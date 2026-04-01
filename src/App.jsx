import { useState, useEffect, useRef, useMemo } from "react";
import { Target, Map, Crosshair } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as topojson from "topojson-client";

import "./App.css";

// ── CUSTOM MODULES ──────────────────────────────────────────
import { DEFAULT_SIGNATURES, LAYERS_DB } from "./constants/threatData.js";
import { useAnomalyEngine } from "./hooks/useAnomalyEngine.js";
import { useL2Forecaster } from "./hooks/useL2Forecaster.js";
import { GlobeLayer } from "./components/GlobeLayer.jsx";

// ── NEW MODULAR COMPONENTS ──────────────────────────────────
import { DataLake } from "./components/UIPanels/DataLake.jsx";
import { Header } from "./components/HUD/Header.jsx";
import { RiskPanel } from "./components/HUD/RiskPanel.jsx";
import { PredictivePanel } from "./components/HUD/PredictivePanel.jsx";
import { IntelligencePanel } from "./components/HUD/IntelligencePanel.jsx";
import { StatsPanel } from "./components/HUD/StatsPanel.jsx";
import { SettingsOverlay } from "./components/Modals/SettingsOverlay.jsx";
import { OSINTModal } from "./components/Modals/OSINTModal.jsx";

export default function AnomalyDetector() {
  const [apiKey] = useState(() => localStorage.getItem("anthropic_api_key") || "");
  const [showSettings, setShowSettings] = useState(false);
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
  const { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed } = useAnomalyEngine({ 
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
    <div className={`wm-main-wrapper ${themeClass} ${isAlertActive ? 'alert-active' : ''}`}>
      
      <GlobeLayer 
        dim={dim} countries={countries} arcs={arcs} rings={rings} 
        mapPoints={mapPoints} liveMode={liveMode} globeRef={globeRef} 
        activeDomain={activeDomain}
      />

      <div className="wm-ui-layer">
        
        <Header 
          activeDomain={activeDomain} setActiveDomain={setActiveDomain} 
          setShowOsintPanel={setShowOsintPanel} liveMode={liveMode} 
          toggleLive={toggleLive} setShowSettings={setShowSettings} 
        />

        <motion.div 
          className="wm-panel-left"
          initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
           <RiskPanel isAlertActive={isAlertActive} feed={feed} />
           <AnimatePresence mode="wait">
             {forecast && (
               <motion.div key="forecast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                 <PredictivePanel forecast={forecast} />
               </motion.div>
             )}
           </AnimatePresence>
           <IntelligencePanel 
             intelTab={intelTab} setIntelTab={setIntelTab} 
             activeDomain={activeDomain} signatures={signatures} 
           />
        </motion.div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <DataLake 
            filteredFeed={filteredFeed} anomalies={feed.filter(f => f.is_anomaly).length} 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
            activeDomain={activeDomain}
          />
        </motion.div>

        <StatsPanel 
          activeDomain={activeDomain} feed={feed} 
          signatures={signatures} simulationMode={simulationMode} 
        />

        <div className="map-controls">
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 38, lng: 127, altitude: 1.5 }, 1500)} title="Focus: Asia"><Target size={16} /></button>
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 48, lng: 31, altitude: 1.5 }, 1500)} title="Focus: Europe"><Map size={16} /></button>
           <button className="map-btn" onClick={() => globeRef.current?.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000)} title="Reset Globe"><Crosshair size={16} /></button>
        </div>
      </div>

      <SettingsOverlay 
        showSettings={showSettings} setShowSettings={setShowSettings} 
        simulationMode={simulationMode} setSimulationMode={setSimulationMode} 
        liveSpeed={liveSpeed} setLiveSpeed={setLiveSpeed} 
      />

      <OSINTModal 
        showOsintPanel={showOsintPanel} setShowOsintPanel={setShowOsintPanel} 
        osintText={osintText} setOsintText={setOsintText} 
        processOsintIntelligence={processOsintIntelligence} isOsintParsing={isOsintParsing} 
      />
    </div>
  );
}
