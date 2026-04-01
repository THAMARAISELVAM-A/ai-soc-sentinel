import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Activity, ShieldAlert, Zap, Globe as GlobeIcon, Settings, Download, Plus, Server, CheckCircle2, Trash2, Upload, Target, ShieldOff, Database, ServerCrash, Search, BookOpen, Skull, Map, Crosshair, ZoomIn, TrendingUp, Landmark, BarChart3, Radio, AlertTriangle } from "lucide-react";
import "./App.css";

// ── CUSTOM MODULES ──────────────────────────────────────────
import { DEFAULT_SIGNATURES, LAYERS_DB, SEV_COLOR } from "./constants/threatData";
import { useAnomalyEngine } from "./hooks/useAnomalyEngine";
import { useL2Forecaster } from "./hooks/useL2Forecaster";
import { GlobeLayer } from "./components/GlobeLayer";
import { DataLake } from "./components/UIPanels/DataLake";

export default function AnomalyDetector() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("anthropic_api_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [signatures, setSignatures] = useState(DEFAULT_SIGNATURES);
  const [selectedModel, setSelectedModel] = useState("claude-3-5-sonnet-20241022");
  const [showOsintPanel, setShowOsintPanel] = useState(false);
  const [osintText, setOsintText] = useState("");
  const [isOsintParsing, setIsOsintParsing] = useState(false);

  // ── PHASE 2 DOMAIN STATE ──
  const [activeDomain, setActiveDomain] = useState("CYBER"); // CYBER | FINANCE | GEOINT
  const [intelTab, setIntelTab] = useState("THREATS");

  // URL PARAMETER HYDRATION
  const getUrlParam = (key, defaultVal) => new URLSearchParams(window.location.search).get(key) || defaultVal;
  const [simulationMode, setSimulationMode] = useState(getUrlParam("sim", "true") === "true");
  const [activeLayers, setActiveLayers] = useState(getUrlParam("layers", "centers,ddos").split(",").filter(Boolean));
  const [searchQuery, setSearchQuery] = useState(getUrlParam("spl", ""));

  // ── HOOKS: THE ENGINE ───────────────────────────────────────
  const { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed } = useAnomalyEngine({ 
    apiKey, selectedModel, simulationMode, signatures, activeDomain
  });
  
  const { forecast, generateForecast, startForecaster, stopForecaster } = useL2Forecaster({ 
    feed, simulationMode, apiKey, selectedModel 
  });


  // Watch for scan state to trigger forecaster
  useEffect(() => {
    if (liveMode) startForecaster(liveSpeed * 15);
    else stopForecaster();
  }, [liveMode, liveSpeed]);

  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  
  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then(res => res.json())
      .then(topoData => {
         import("topojson-client").then(topojson => {
            const geoJson = topojson.feature(topoData, topoData.objects.countries);
            setCountries(geoJson);
         });
      }).catch(e => console.log("Map Load Failed."));
  }, []);

  useEffect(() => {
    const handleResize = () => setDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { localStorage.setItem("anthropic_api_key", apiKey); }, [apiKey]);

  const filteredFeed = useMemo(() => feed.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (q.includes("severity:critical")) return f.severity === "critical";
    if (q.includes("is_anomaly:true")) return f.is_anomaly;
    return f.log.toLowerCase().includes(q) || f.threat_type.toLowerCase().includes(q);
  }), [feed, searchQuery]);

  // Layer filtering based on domain
  const mapPoints = useMemo(() => {
    if (activeDomain === "CYBER") return activeLayers.flatMap(l => LAYERS_DB[l] || []);
    if (activeDomain === "FINANCE") return LAYERS_DB.centers; // Simplified center focus
    return [...LAYERS_DB.ddos, ...LAYERS_DB.malware]; // High activity for Geo-Int
  }, [activeLayers, activeDomain]);

  // ── DYNAMIC THEMING ──────────────────────
  const lastAlert = feed[0];
  const isAlertActive = lastAlert?.is_anomaly && (lastAlert?.severity === "critical" || lastAlert?.severity === "high");

  const handleExportSignatures = () => {
    const el = document.createElement("a"); el.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signatures, null, 2)); el.download = "signatures.json"; el.click();
  };

  const processOsintIntelligence = async () => {
    if(!osintText.trim()) return;
    setIsOsintParsing(true);
    if (simulationMode || !apiKey) {
      await new Promise(r => setTimeout(r, 1500));
      setSignatures(prev => [...prev, { id: Date.now(), category: "OSINT Auto-Discovered", severity: "critical", mitre: "T-AUTO", pattern: "Dynamic pattern", active: true }]);
    }
    setIsOsintParsing(false); setShowOsintPanel(false); setOsintText("");
  };

  return (
    <div className={`wm-main-wrapper ${isAlertActive ? 'alert-active' : ''}`}>
      
      <GlobeLayer 
        dim={dim} countries={countries} arcs={arcs} rings={rings} 
        mapPoints={mapPoints} liveMode={liveMode} globeRef={globeRef} 
      />

      <div className="wm-ui-layer">
        
        {/* WORLD MONITOR GLOBAL HEADER */}
        <div className="wm-header">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="wm-logo-box"><GlobeIcon size={20} /></div>
            <div className="wm-title">WORLD MONITOR <span style={{color:"#444", fontSize:12, marginLeft:10}}>V2.6.5</span></div>
            
            {/* DOMAIN NAV (Inspired by Screenshot) */}
            <div className="wm-domain-nav">
               <div onClick={()=>setActiveDomain("CYBER")} className={`nav-icon-btn ${activeDomain === 'CYBER'?'active':''}`} title="Cyber Intelligence"><Radio size={16}/></div>
               <div onClick={()=>setActiveDomain("GEOINT")} className={`nav-icon-btn ${activeDomain === 'GEOINT'?'active':''}`} title="Geopolitical Activity"><ShieldAlert size={16}/></div>
               <div onClick={()=>setActiveDomain("FINANCE")} className={`nav-icon-btn ${activeDomain === 'FINANCE'?'active':''}`} title="Market Stability"><TrendingUp size={16}/></div>
            </div>
          </div>
          
          <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
             <div className="badge-tag" style={{background:"rgba(239,68,68,0.1)", color:"#ef4444", padding:"8px 12px", border:"1px solid rgba(239,68,68,0.3)"}}>
                DEFCON 5 <span style={{opacity:0.6, marginLeft:4}}>8%</span>
             </div>
             <div className="wm-header-actions">
               <button onClick={() => setShowOsintPanel(true)} className="btn-console"><BookOpen size={14}/> INGEST OSINT</button>
               <button onClick={toggleLive} className={`btn-console ${liveMode ? 'active' : ''}`}>
                  {liveMode ? "HALT SCANNING" : "INITIALIZE SCAN"}
               </button>
               <button onClick={() => setShowSettings(!showSettings)} className="btn-console"><Settings size={16}/></button>
             </div>
          </div>
        </div>

        {/* LEFT HUD: INTEL & STRATEGIC POSTURE */}
        <div className="wm-panel-left">
           
           {/* RISK GAUGE (Inspired by Screenshot) */}
           <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="panel-label" style={{ width: "100%" }}>GLOBAL RISK INDEX</div>
              <div className="gauge-container">
                 <div className="gauge-ring" style={{ borderTopColor: isAlertActive ? '#ef4444' : '#3b82f6' }} />
                 <div className="gauge-value">
                    {Math.floor(Math.random() * 20) + (isAlertActive ? 60 : 20)}
                    <span>ELEVATED</span>
                 </div>
              </div>
              <div style={{ fontSize: 10, color: "#8b949e", marginTop: 15, display: "flex", gap: 10 }}>
                 <TrendingUp size={12} color="#f59e0b"/> STATUS: <strong style={{color:"white"}}>STABLE</strong>
              </div>
           </div>

           {/* DOMAIN-SPECIFIC LEFT FEED */}
           <div className="glass-panel" style={{ padding: 24, flex: 1 }}>
              <div className="tab-bar">
                 <button onClick={()=>setIntelTab("THREATS")} className={`tab-btn ${intelTab==='THREATS'?'active':''}`}>LIVE INTELLIGENCE</button>
                 <button onClick={()=>setIntelTab("POSTURE")} className={`tab-btn ${intelTab==='POSTURE'?'active':''}`}>POSTURE</button>
              </div>

              {intelTab === "THREATS" ? (
                 <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {activeDomain === "CYBER" && (
                       signatures.slice(0, 3).map(s => (
                          <div className="intel-card" key={s.id}>
                             <div className="intel-source">MITRE {s.mitre}</div>
                             <div className="intel-title">{s.category} patterns active in global cluster.</div>
                          </div>
                       ))
                    )}
                    {activeDomain === "GEOINT" && (
                        <>
                          <div className="intel-card critical">
                             <div className="intel-source">KOREAHERALD.COM <span className="status-tag">CRITICAL</span></div>
                             <div className="intel-title">Regional strategic flexibility at risk in North Theater.</div>
                          </div>
                          <div className="intel-card">
                             <div className="intel-source">INTEL-OPS</div>
                             <div className="intel-title">Military hardware migration detected in Eastern Europe.</div>
                          </div>
                        </>
                    )}
                    {activeDomain === "FINANCE" && (
                        <>
                          <div className="intel-card">
                             <div className="intel-source">BLOOMBERG.INT</div>
                             <div className="intel-title">Supply chain volatility index rising across Asian tech nodes.</div>
                          </div>
                          <div className="intel-card critical">
                             <div className="intel-source">MARKET-ALERT <span className="status-tag">ELEVATED</span></div>
                             <div className="intel-title">National Debt Clock: Global surplus trajectory failing.</div>
                          </div>
                        </>
                    )}
                 </div>
              ) : (
                 <div className="meter-list">
                    <div className="meter-row">
                       <div className="meter-label"><span>UKRAINE RECOVERY</span> <strong>72%</strong></div>
                       <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "72%", background: "#ef4444" }} /></div>
                    </div>
                    <div className="meter-row">
                       <div className="meter-label"><span>CHINA STABILITY</span> <strong>91%</strong></div>
                       <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "91%", background: "#3b82f6" }} /></div>
                    </div>
                    <div className="meter-row">
                       <div className="meter-label"><span>MARKET LIQUIDITY</span> <strong>45%</strong></div>
                       <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "45%", background: "#f59e0b" }} /></div>
                    </div>
                 </div>
              )}
           </div>
        </div>

        {/* RIGHT HUD: DATA LAKE / TERMINAL */}
        <DataLake 
          filteredFeed={filteredFeed} anomalies={feed.filter(f => f.is_anomaly).length} 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          activeDomain={activeDomain}
        />


        {/* BOTTOM HUD: GLOBAL STATS MONITOR */}
        <div className="wm-panel-bottom">
           <div className="stat-box"><span>{activeDomain === 'FINANCE' ? 'GLOBAL DEBT CLOCK' : 'DATA INDEX SIZE'}</span> <strong>{activeDomain === 'FINANCE' ? '$115.8T' : feed.length}</strong></div>
           <div className="stat-box"><span>ACTIVE SIMULATIONS</span> <strong>{signatures.length}</strong></div>
           <div className="stat-box"><span>AI FORECAST ENGINE</span> <strong style={{ color: simulationMode ? "#f59e0b" : "#22c55e" }}>{simulationMode ? "SIMULATION" : "LIVE CLAUDE"}</strong></div>
           <div className="stat-box"><span>NETWORK LATENCY</span> <strong>12ms</strong></div>
        </div>

        {/* CAMERA CONTROLS */}
        <div className="map-controls">
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 38, lng: 127, altitude: 1.5 }, 1500)} title="Focus: Asia"><Target size={16} /></button>
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 48, lng: 31, altitude: 1.5 }, 1500)} title="Focus: Europe"><Map size={16} /></button>
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000)} title="Reset Globe"><Crosshair size={16} /></button>
        </div>

      </div>

      {/* OVERLAYS */}
      {showSettings && (
        <div className="glass-panel settings-overlay">
          <div className="settings-header">PLATFORM PARAMETERS <button onClick={() => setShowSettings(false)}>✕</button></div>
          <div className="settings-section">
             <div className="label">GLOBAL AGENT MODE</div>
             <div className="btn-group">
                <button onClick={() => setSimulationMode(true)} className={simulationMode ? 'active' : ''}>SIMULATION</button>
                <button onClick={() => setSimulationMode(false)} className={!simulationMode ? 'active' : ''}>LIVE ENGINE</button>
             </div>
          </div>
          <div className="settings-section">
             <div className="label">REFRESH RATE: {Math.round(liveSpeed / 1000)}s</div>
             <input type="range" min="500" max="10000" step="500" value={liveSpeed} onChange={e => setLiveSpeed(Number(e.target.value))} />
          </div>
        </div>
      )}

      {showOsintPanel && (
        <div className="wm-osint-modal">
           <div className="glass-panel modal-box">
              <div className="modal-header">OSINT CO-PILOT <button onClick={() => setShowOsintPanel(false)}>✕</button></div>
              <textarea 
                 value={osintText} onChange={e=>setOsintText(e.target.value)} 
                 placeholder="Paste threat report clipping, market signal, or military bulletin here..." 
              />
              <button onClick={processOsintIntelligence} disabled={isOsintParsing} className="btn-primary">
                 {isOsintParsing ? "SYNTHESIZING INTELLIGENCE..." : "AUTONOMOUSLY GENERATE POLICIES"}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
