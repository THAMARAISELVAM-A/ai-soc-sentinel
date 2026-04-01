import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Activity, ShieldAlert, Zap, Globe as GlobeIcon, Settings, Download, Plus, Server, CheckCircle2, Trash2, Upload, Target, ShieldOff, Database, ServerCrash, Search, BookOpen, Skull, Map, Crosshair, ZoomIn } from "lucide-react";
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
  const [hoverD, setHoverD] = useState();
  const [showOsintPanel, setShowOsintPanel] = useState(false);
  const [osintText, setOsintText] = useState("");
  const [isOsintParsing, setIsOsintParsing] = useState(false);

  // URL PARAMETER HYDRATION
  const getUrlParam = (key, defaultVal) => new URLSearchParams(window.location.search).get(key) || defaultVal;
  const [simulationMode, setSimulationMode] = useState(getUrlParam("sim", "true") === "true");
  const [activeLayers, setActiveLayers] = useState(getUrlParam("layers", "centers,ddos").split(",").filter(Boolean));
  const [searchQuery, setSearchQuery] = useState(getUrlParam("spl", ""));

  // ── HOOKS: THE ENGINE ───────────────────────────────────────
  const { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed } = useAnomalyEngine({ 
    apiKey, selectedModel, simulationMode, signatures 
  });
  
  const { forecast, generateForecast, startForecaster, stopForecaster } = useL2Forecaster({ 
    feed, simulationMode, apiKey, selectedModel 
  });

  // Watch for scan state to trigger forecaster
  useEffect(() => {
    if (liveMode) startForecaster(liveSpeed * 15);
    else stopForecaster();
  }, [liveMode, liveSpeed]);

  // ── GLOBE & MAP LOGIC ───────────────────────────────────────
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

  // Sync URL State
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sim", simulationMode);
    if(activeLayers.length > 0) params.set("layers", activeLayers.join(","));
    if(searchQuery) params.set("spl", searchQuery);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
  }, [simulationMode, activeLayers, searchQuery]);

  useEffect(() => { localStorage.setItem("anthropic_api_key", apiKey); }, [apiKey]);

  // Filtering System
  const filteredFeed = useMemo(() => feed.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (q.includes("severity:critical")) return f.severity === "critical";
    if (q.includes("is_anomaly:true")) return f.is_anomaly;
    return f.log.toLowerCase().includes(q) || f.threat_type.toLowerCase().includes(q);
  }), [feed, searchQuery]);

  const mapPoints = useMemo(() => activeLayers.flatMap(l => LAYERS_DB[l] || []), [activeLayers]);

  // ── DYNAMIC THEMING (ALERT STATUS) ──────────────────────────
  const lastAlert = feed[0];
  const isAlertActive = lastAlert?.is_anomaly && (lastAlert?.severity === "critical" || lastAlert?.severity === "high");

  // ── HANDLERS ────────────────────────────────────────────────
  const handleExportSignatures = () => {
    const el = document.createElement("a"); el.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(signatures, null, 2)); el.download = "signatures.json"; el.click();
  };
  const fileInputRef = useRef(null);
  const handleImportSignatures = (e) => {
    const reader = new FileReader(); reader.onload = (ev) => { try { setSignatures(JSON.parse(ev.target.result)); } catch { alert("Invalid JSON") }};
    if(e.target.files[0]) reader.readAsText(e.target.files[0]);
  };

  const processOsintIntelligence = async () => {
    if(!osintText.trim()) return;
    setIsOsintParsing(true);
    // ... OSINT Logic (kept in hook for brevity if this grows)
    if (simulationMode || !apiKey) {
      await new Promise(r => setTimeout(r, 1500));
      setSignatures(prev => [...prev, { id: Date.now(), category: "OSINT Auto-Discovered", severity: "critical", mitre: "T-AUTO", pattern: "Dynamic pattern", active: true }]);
    }
    setIsOsintParsing(false); setShowOsintPanel(false); setOsintText("");
  };

  return (
    <div className={`wm-main-wrapper ${isAlertActive ? 'alert-active' : ''}`}>
      
      {/* 3D GLOBE LAYER */}
      <GlobeLayer 
        dim={dim} countries={countries} arcs={arcs} rings={rings} 
        mapPoints={mapPoints} liveMode={liveMode} globeRef={globeRef} 
      />

      {/* UI OVERLAY */}
      <div className="wm-ui-layer">
        
        {/* HEADER */}
        <div className="wm-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="wm-logo-box"><GlobeIcon size={18} /></div>
            <div>
              <div className="wm-title">Operation Sentinel <span className="l2-badge">L2 SOC</span></div>
            </div>
          </div>
          
          <div className="wm-header-actions">
            <button onClick={() => setShowOsintPanel(true)} className="glass-panel btn-osint"><BookOpen size={14}/> INGEST OSINT</button>
            <button onClick={toggleLive} className={`glass-panel btn-scan ${liveMode ? 'scanning' : ''}`}>
              {liveMode ? <><Activity size={14} /> HALT SCANNING</> : <><Zap size={14} /> INITIALIZE SCAN</>}
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="glass-panel btn-settings"><Settings size={16}/></button>
          </div>
        </div>

        {/* PANELS */}
        <div className="wm-main-content">
          <div className="wm-panel-left">
            {forecast && (
               <div className="glass-panel forecast-panel">
                  <div className="forecast-header"><Skull size={14}/> L2 THREAT FORECAST</div>
                  <div className="forecast-title">{forecast.predicted_attack}</div>
                  <div className="forecast-meta">
                    <span className="badge-eta">ETA: {forecast.eta}</span>
                    <span className="badge-prob">PROB: {forecast.probability}%</span>
                  </div>
                  <div className="forecast-desc">{forecast.explanation}</div>
               </div>
            )}

            <div className="glass-panel layer-panel">
              <div className="panel-label">DATA LAYERS</div>
              <div className="layer-list">
                {["ddos", "malware", "centers"].map(l => (
                   <div key={l} onClick={()=>setActiveLayers(prev => prev.includes(l) ? prev.filter(x=>x!==l) : [...prev, l])} className={`layer-card ${activeLayers.includes(l) ? "active":""}`}>
                      {l === 'ddos' ? <Target size={14} color="#f97316"/> : l === 'malware' ? <ShieldAlert size={14} color="#ef4444"/> : <Database size={14} color="#3b82f6"/>}
                      <span className="layer-name">{l.toUpperCase()} REGIONS</span>
                   </div>
                ))}
              </div>
            </div>
          </div>

          <DataLake 
            filteredFeed={filteredFeed} anomalies={feed.filter(f => f.is_anomaly).length} 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          />
        </div>

        {/* BOTTOM STATS */}
        <div className="wm-panel-bottom">
          <div className="stat-item"><span>SPLUNK INDEX:</span> <strong>{feed.length}</strong></div>
          <div className="stat-sep" />
          <div className="stat-item"><span>POLICIES:</span> <strong>{signatures.length}</strong></div>
          <div className="stat-sep" />
          <div className="stat-item"><span>ENGINE:</span> <strong className={simulationMode ? "txt-warn" : "txt-success"}>{simulationMode ? "SIMULATION" : "LIVE CLAUDE"}</strong></div>
        </div>

        {/* CAMERA CONTROLS */}
        <div className="map-controls">
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 39.8, lng: -98.5, altitude: 2.0 }, 1500)}><Target size={16} /></button>
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 50.0, lng: 15.0, altitude: 2.5 }, 1500)}><Map size={16} /></button>
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000)}><Crosshair size={16} /></button>
        </div>

      </div>

      {/* SETTINGS OVERLAY */}
      {showSettings && (
        <div className="glass-panel settings-overlay">
          <div className="settings-header">AGENT CONFIGURATION <button onClick={() => setShowSettings(false)}>✕</button></div>
          <div className="settings-section">
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleExportSignatures} className="btn-action"><Download size={14}/> EXPORT</button>
              <button onClick={() => fileInputRef.current?.click()} className="btn-action"><Upload size={14}/> IMPORT</button>
              <input type="file" ref={fileInputRef} onChange={handleImportSignatures} accept=".json" style={{ display: "none" }} />
            </div>
          </div>
          <div className="settings-section">
             <div className="label">INFERENCE MODE</div>
             <div className="btn-group">
                <button onClick={() => setSimulationMode(true)} className={simulationMode ? 'active' : ''}>MOCK</button>
                <button onClick={() => setSimulationMode(false)} className={!simulationMode ? 'active' : ''}>CLAUDE</button>
             </div>
          </div>
          {!simulationMode && (
            <div className="settings-section">
               <input type="password" placeholder="API KEY" value={apiKey} onChange={e => setApiKey(e.target.value)} />
               <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{marginTop:8}}>
                  <option value="claude-3-5-sonnet-20241022">Sonnet 3.5</option>
                  <option value="claude-3-opus-20240229">Opus 3</option>
               </select>
            </div>
          )}
          <div className="settings-section">
             <div className="label">POLLING: {Math.round(liveSpeed / 1000)}s</div>
             <input type="range" min="500" max="10000" step="500" value={liveSpeed} onChange={e => setLiveSpeed(Number(e.target.value))} />
          </div>
        </div>
      )}

      {/* OSINT MODAL (simplified) */}
      {showOsintPanel && (
        <div className="wm-osint-modal">
           <div className="glass-panel modal-box">
              <div className="modal-header">OSINT CO-PILOT <button onClick={() => setShowOsintPanel(false)}>✕</button></div>
              <textarea value={osintText} onChange={e=>setOsintText(e.target.value)} placeholder="Paste threat report..." rows={8} />
              <button onClick={processOsintIntelligence} disabled={isOsintParsing} className="btn-primary">
                 {isOsintParsing ? "PARSING..." : "GENERATE POLICIES"}
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
