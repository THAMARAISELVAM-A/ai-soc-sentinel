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

export default function AnomalyDetector() {
  const [apiKey] = useState(() => localStorage.getItem("anthropic_api_key") || "");

  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [signatures, setSignatures] = useState(DEFAULT_SIGNATURES);
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
  const { feed, arcs, rings, liveMode, liveSpeed, setLiveSpeed } = useAnomalyEngine({ 
    apiKey, selectedModel, simulationMode, signatures, activeDomain
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
    if (simulationMode || !apiKey) {
      await new Promise(r => setTimeout(r, 1500));
      setSignatures(prev => [...prev, { id: Date.now(), category: "OSINT Auto-Discovered", severity: "critical", mitre: "T-AUTO", pattern: "Dynamic pattern", active: true }]);
    }
    setIsOsintParsing(false); setShowOsintPanel(false); setOsintText("");
  };

  return (
    <div className={`wm-main-wrapper ${themeClass} ${isAlertActive ? 'alert-active' : ''}`} style={{ display: 'flex' }}>
      
      {/* Persist the globe behind everything */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: activePage === 'dash' ? 1 : 0.2, transition: 'opacity 0.6s', pointerEvents: activePage === 'dash' ? 'auto' : 'none' }}>
         <GlobeLayer 
           dim={dim} countries={countries} arcs={arcs} rings={rings} 
           mapPoints={mapPoints} liveMode={liveMode} globeRef={globeRef} 
           activeDomain={activeDomain}
         />
      </div>

      <Sidebar activePage={activePage} setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} />
      
      <div className={`main ${isSidebarOpen ? '' : 'expanded'}`} style={{ 
        marginLeft: isSidebarOpen ? '240px' : '0', 
        width: isSidebarOpen ? 'calc(100% - 240px)' : '100%', 
        transition: 'all 0.3s ease', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto'
      }}>
        <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} activePage={activePage} activeDomain={activeDomain} setActiveDomain={setActiveDomain} />
        
        <div className="content" style={{ padding: '24px', flexGrow: 1 }}>
          
          {activePage === 'dash' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                 <StatsPanel activeDomain={activeDomain} feed={feed} signatures={signatures} simulationMode={simulationMode} />
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
                  <IntelligencePanel intelTab={intelTab} setIntelTab={setIntelTab} activeDomain={activeDomain} signatures={signatures} />
               </div>
               <DataLake filteredFeed={filteredFeed} anomalies={feed.filter(f => f.is_anomaly).length} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeDomain={activeDomain} onTrackIp={(geoData) => {
                 if(globeRef.current && geoData.lat) {
                   globeRef.current.pointOfView({ lat: geoData.lat, lng: geoData.lon || geoData.lng, altitude: 0.8 }, 2000);
                 }
               }} />
            </div>
          )}

          {activePage === 'settings' && (
            <SettingsOverlay showSettings={true} setShowSettings={() => {}} simulationMode={simulationMode} setSimulationMode={setSimulationMode} liveSpeed={liveSpeed} setLiveSpeed={setLiveSpeed} />
          )}

          {activePage === 'archives' && (
             <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--domain-primary)' }}>
                <h2>No Historical Archives Found</h2>
                <p style={{ opacity: 0.6, marginTop: '10px' }}>Historical telemetry requires an attached external S3 bucket.</p>
             </div>
          )}
          
        </div>
      </div>

      <OSINTModal showOsintPanel={showOsintPanel || activePage === 'osint'} setShowOsintPanel={(val) => { setShowOsintPanel(val); if(!val && activePage === 'osint') setActivePage('dash'); }} osintText={osintText} setOsintText={setOsintText} processOsintIntelligence={processOsintIntelligence} isOsintParsing={isOsintParsing} />
    </div>
  );
}
