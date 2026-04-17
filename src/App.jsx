import { useState, useEffect, useRef, useMemo } from "react";
import { Target, Map, Crosshair } from "lucide-react";
import * as topojson from "topojson-client";

import "./App.css";

// ── CUSTOM MODULES ──────────────────────────────────────────
import { DEFAULT_SIGNATURES, LAYERS_DB } from "./constants/threatData.js";
import { useAnomalyEngine } from "./hooks/useAnomalyEngine.js";
import { useL2Forecaster } from "./hooks/useL2Forecaster.js";
import { GlobeLayer } from "./components/GlobeLayer.jsx";

import { Sidebar } from "./components/Sidebar.jsx";
import { TopBar } from "./components/TopBar.jsx";

// ── NEW MODULAR COMPONENTS ──────────────────────────────────
import { DataLake } from "./components/UIPanels/DataLake.jsx";
import { RiskPanel } from "./components/HUD/RiskPanel.jsx";
import { PredictivePanel } from "./components/HUD/PredictivePanel.jsx";
import { IntelligencePanel } from "./components/HUD/IntelligencePanel.jsx";
import { StatsPanel } from "./components/HUD/StatsPanel.jsx";
import { SettingsOverlay } from "./components/Modals/SettingsOverlay.jsx";
import { OSINTModal } from "./components/Modals/OSINTModal.jsx";
import { LogIngestor } from "./components/UIPanels/LogIngestor.jsx";
import { ThreatHeatmap } from "./components/HUD/ThreatHeatmap.jsx";

export default function AnomalyDetector() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("anthropic_api_key") || "");
  const [threatFoxKey, setThreatFoxKey] = useState(() => localStorage.getItem("threatfox_api_key") || "");
  const [otxKey, setOtxKey] = useState(() => localStorage.getItem("otx_api_key") || "");

  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [signatures, setSignatures] = useState(() => {
    const saved = localStorage.getItem("soc_signatures");
    return saved ? JSON.parse(saved) : DEFAULT_SIGNATURES;
  });
  const [selectedModel] = useState("claude-3-5-sonnet-20241022");
  const [showOsintPanel, setShowOsintPanel] = useState(false);
  const [osintText, setOsintText] = useState("");
  const [isOsintParsing, setIsOsintParsing] = useState(false);

  // ── PHASE 2 DOMAIN STATE ──
  const [activeDomain, setActiveDomain] = useState("CYBER"); // CYBER | FINANCE | GEOINT
  const [intelTab, setIntelTab] = useState("THREATS");

  // URL PARAMETER HYDRATION
  const getUrlParam = (key, defaultVal) => new URLSearchParams(window.location.search).get(key) || defaultVal;
  const [simulationMode, setSimulationMode] = useState(getUrlParam("sim", "true") === "true");
  const [activeLayers] = useState(getUrlParam("layers", "centers,ddos").split(",").filter(Boolean));
  const [searchQuery, setSearchQuery] = useState(getUrlParam("spl", ""));

  // ── HOOKS: THE ENGINE ───────────────────────────────────────
  const { feed, arcs, rings, liveMode, liveSpeed, setLiveSpeed, ingestManualLog, proxyStatus } = useAnomalyEngine({ 
    apiKey, selectedModel, simulationMode, signatures, activeDomain, threatFoxKey, otxKey
  });
  
  const { forecast } = useL2Forecaster({ 
    feed, simulationMode, apiKey, selectedModel, liveMode, liveSpeed 
  });

  const globeRef = useRef();
  const [countries, setCountries] = useState({ features: [] });
  
  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then(res => res.json())
      .then(topoData => {
         const geoJson = topojson.feature(topoData, topoData.objects.countries);
         setCountries(geoJson);
      }).catch(() => console.error("Map Data Synchronization Failed."));
  }, []);

  useEffect(() => {
    const handleResize = () => setDim({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => { localStorage.setItem("anthropic_api_key", apiKey); }, [apiKey]);
  useEffect(() => { localStorage.setItem("threatfox_api_key", threatFoxKey); }, [threatFoxKey]);
  useEffect(() => { localStorage.setItem("otx_api_key", otxKey); }, [otxKey]);
  useEffect(() => { localStorage.setItem("soc_signatures", JSON.stringify(signatures)); }, [signatures]);

  const filteredFeed = useMemo(() => feed.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (q.includes("severity:critical")) return f.severity === "critical";
    if (q.includes("is_anomaly:true")) return f.is_anomaly;
    return f.log.toLowerCase().includes(q) || f.threat_type.toLowerCase().includes(q);
  }), [feed, searchQuery]);

  const mapPoints = useMemo(() => {
    if (activeDomain === "CYBER") return activeLayers.flatMap(l => LAYERS_DB[l] || []);
    if (activeDomain === "FINANCE") return LAYERS_DB.centers; 
    return [...LAYERS_DB.ddos, ...LAYERS_DB.malware]; 
  }, [activeLayers, activeDomain]);

  const [activePage, setActivePage] = useState('dash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ── DYNAMIC THEMING ──────────────────────
  const isAlertActive = feed[0]?.is_anomaly && (feed[0]?.severity === "critical" || feed[0]?.severity === "high");
  const themeClass = `theme-${activeDomain.toLowerCase()}`;

  const processOsintIntelligence = async () => {
    if(!osintText.trim()) return;
    setIsOsintParsing(true);
    
    try {
      if (simulationMode || !apiKey) {
        await new Promise(r => setTimeout(r, 1500));
        const newSig = { 
          id: Date.now(), 
          category: `OSINT [${osintText.slice(0, 12)}...]`, 
          severity: "high", 
          mitre: "T-OSINT", 
          pattern: "extracted from raw intelligence", 
          active: true 
        };
        setSignatures(prev => [...prev, newSig]);
      } else {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({ 
            model: selectedModel, max_tokens: 300, 
            system: "You are an OSINT Intelligence Synthesizer. Extract security signatures and IOC patterns from the provided text. Return ONLY JSON: { \"category\": \"string\", \"mitre\": \"string\", \"pattern\": \"string\", \"severity\": \"high/medium/low\" }", 
            messages: [{ role: "user", content: `Intelligence Feed: "${osintText}"` }] 
          })
        });
        const data = await response.json();
        const raw = data.content?.find(c => c.type === "text")?.text || "{}";
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        setSignatures(prev => [...prev, { ...parsed, id: Date.now(), active: true }]);
      }
    } catch(e) { console.error("OSINT Synthesis Failed", e); }
    
    setIsOsintParsing(false); 
    setShowOsintPanel(false); 
    setOsintText("");
  };

  return (
    <div className={`wm-main-wrapper ${themeClass} ${isAlertActive ? 'alert-active' : ''}`}>
      {/* ── PERSISTENT GLOBE LAYER (Z-INDEX: 0) ── */}
      <div className="wm-globe-container" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
         <GlobeLayer 
           dim={dim} countries={countries} arcs={arcs} rings={rings} 
           mapPoints={mapPoints} liveMode={liveMode} globeRef={globeRef} 
           activeDomain={activeDomain}
         />
      </div>

      {/* ── INTERACTIVE SIDEBAR NAVIGATION (Z-INDEX: 1002) ── */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} />
      
      {/* ── MAIN CONTENT HUB (Z-INDEX: 10) ── */}
      <div className={`main ${isSidebarOpen ? 'expanded' : ''}`}>
        <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} activePage={activePage} activeDomain={activeDomain} setActiveDomain={setActiveDomain} />
        
        <div className="content" style={{ padding: '24px', flexGrow: 1 }}>
          
          {activePage === 'dash' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '20px' }}>
                 <StatsPanel activeDomain={activeDomain} signatures={signatures} simulationMode={simulationMode} proxyStatus={proxyStatus} />
                 <ThreatHeatmap feed={feed} activeDomain={activeDomain} />
              </div>
              <div className="map-controls glass-panel" style={{ width: 'fit-content', padding: '8px', zIndex: 20 }}>
                 <button className="nav-icon-btn" onClick={() => globeRef.current?.pointOfView({ lat: 38, lng: 127, altitude: 1.5 }, 1500)} title="Focus: Asia"><Target size={18} /></button>
                 <button className="nav-icon-btn" onClick={() => globeRef.current?.pointOfView({ lat: 48, lng: 31, altitude: 1.5 }, 1500)} title="Focus: Europe"><Map size={18} /></button>
                 <button className="nav-icon-btn" onClick={() => globeRef.current?.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000)} title="Reset Globe"><Crosshair size={18} /></button>
              </div>
            </div>
          )}

          {activePage === 'l2' && forecast && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
               <PredictivePanel forecast={forecast} />
            </div>
          )}

          {activePage === 'data' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '24px', height: 'calc(100vh - 120px)' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <RiskPanel isAlertActive={isAlertActive} feed={feed} />
                  <IntelligencePanel activeDomain={activeDomain} />
               </div>
               <DataLake filteredFeed={filteredFeed} anomalies={feed.filter(f => f.is_anomaly).length} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeDomain={activeDomain} onTrackIp={(geoData) => {
                 if(globeRef.current && geoData.lat) {
                   globeRef.current.pointOfView({ lat: geoData.lat, lng: geoData.lon || geoData.lng, altitude: 0.8 }, 2000);
                 }
               }} />
            </div>
          )}

          {activePage === 'settings' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
              <SettingsOverlay 
                showSettings={true} 
                setShowSettings={() => {}} 
                simulationMode={simulationMode} 
                setSimulationMode={setSimulationMode} 
                liveSpeed={liveSpeed} 
                setLiveSpeed={setLiveSpeed} 
                apiKey={apiKey} 
                setApiKey={setApiKey} 
                threatFoxKey={threatFoxKey} 
                setThreatFoxKey={setThreatFoxKey} 
                otxKey={otxKey} 
                setOtxKey={setOtxKey}
              />
            </div>
          )}

          {activePage === 'archives' && (
             <div className="glass-panel" style={{ padding: '0', height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="panel-label" style={{ margin: 0 }}>Local Threat Archives // {feed.length} Records</div>
                  <button className="nav-icon-btn" style={{ fontSize: '10px', padding: '4px 12px' }} onClick={() => { if(window.confirm("Purge local telemetry data?")) { localStorage.removeItem(`sentinel_feed_${activeDomain}`); window.location.reload(); } }}>PURGE DATA</button>
                </div>
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px' }}>
                  {feed.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '100px', color: '#64748b' }}>No local telemetry found.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#94a3b8', fontSize: '12px' }}>
                      <thead style={{ position: 'sticky', top: 0, background: 'var(--glass-bg)', zIndex: 5 }}>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                          <th style={{ padding: '12px' }}>TIMESTAMP</th>
                          <th style={{ padding: '12px' }}>SEVERITY</th>
                          <th style={{ padding: '12px' }}>TELEMETRY LOG</th>
                          <th style={{ padding: '12px' }}>MITRE ATT&CK</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feed.map((f, i) => (
                          <tr key={f.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: f.is_anomaly ? 'rgba(244, 63, 94, 0.05)' : 'transparent' }}>
                            <td style={{ padding: '12px', fontFamily: 'var(--mono-font)', color: 'white' }}>{new Date(f.ts).toLocaleString()}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ 
                                color: f.severity === 'critical' ? '#f43f5e' : f.severity === 'high' ? '#fbbf24' : '#94a3b8',
                                fontWeight: 800, textTransform: 'uppercase', fontSize: '10px'
                              }}>{f.severity}</span>
                            </td>
                            <td style={{ padding: '12px', opacity: 0.8 }}>{f.log}</td>
                            <td style={{ padding: '12px', color: 'var(--soc-accent)' }}>{f.mitre_attack || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
             </div>
          )}

          {activePage === 'ingest' && (
            <div style={{ marginTop: '20px' }}>
              <LogIngestor onIngest={ingestManualLog} activeDomain={activeDomain} />
            </div>
          )}
          
        </div>
      </div>

      <OSINTModal showOsintPanel={showOsintPanel || activePage === 'osint'} setShowOsintPanel={(val) => { setShowOsintPanel(val); if(!val && activePage === 'osint') setActivePage('dash'); }} osintText={osintText} setOsintText={setOsintText} processOsintIntelligence={processOsintIntelligence} isOsintParsing={isOsintParsing} />
    </div>
  );
}
