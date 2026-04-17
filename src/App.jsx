import { useState, useEffect, useRef, useMemo, lazy, Suspense, Component } from "react";
import { Target, Map, Crosshair, Shield, Activity, AlertTriangle } from "lucide-react";
import * as topojson from "topojson-client";
import { motion, AnimatePresence } from "framer-motion";

import "./App.css";

// ── CUSTOM MODULES ──────────────────────────────────────────
import { DEFAULT_SIGNATURES, LAYERS_DB } from "./constants/threatData.js";
import { useAnomalyEngine } from "./hooks/useAnomalyEngine.js";
import { useL2Forecaster } from "./hooks/useL2Forecaster.js";
import { GlobeLayer } from "./components/Core/GlobeLayer.jsx";

import { Sidebar } from "./components/Navigation/Sidebar.jsx";
import { TopBar } from "./components/Navigation/TopBar.jsx";

// ── LAZY LOADED COMPONENTS ─────────────────────────────────
const DataLake = lazy(() => import("./components/UIPanels/DataLake.jsx"));
const RiskPanel = lazy(() => import("./components/HUD/RiskPanel.jsx"));
const PredictivePanel = lazy(() => import("./components/HUD/PredictivePanel.jsx"));
const IntelligencePanel = lazy(() => import("./components/HUD/IntelligencePanel.jsx"));
const StatsPanel = lazy(() => import("./components/HUD/StatsPanel.jsx"));
const SettingsOverlay = lazy(() => import("./components/Modals/SettingsOverlay.jsx"));
const OSINTModal = lazy(() => import("./components/Modals/OSINTModal.jsx"));
const LogIngestor = lazy(() => import("./components/UIPanels/LogIngestor.jsx"));
const LayerLegend = lazy(() => import("./components/HUD/LayerLegend.jsx"));
const MobileNav = lazy(() => import("./components/Navigation/MobileNav.jsx"));
const SplashGate = lazy(() => import("./components/Core/SplashGate.jsx"));
const OSINTPanel = lazy(() => import("./components/UIPanels/OSINTPanel.jsx"));

import { useSentinelStore } from "./store/sentinelStore.js";

// ── ERROR BOUNDARY ──────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("🔴 Sentinel Error:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', height: '100vh', background: '#0a0a0f', 
          color: '#ef4444', fontFamily: 'monospace', padding: '20px' 
        }}>
          <AlertTriangle size={48} />
          <h2 style={{ marginTop: '16px' }}>SYSTEM FAILURE</h2>
          <p style={{ opacity: 0.7, maxWidth: '400px', textAlign: 'center' }}>
            {this.state.error?.message || "Critical failure in Sentinel-ARM core"}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '20px', padding: '12px 24px', 
              background: '#dc2626', color: 'white', border: 'none', 
              cursor: 'pointer', fontFamily: 'monospace' 
            }}
          >
            REBOOT_SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── LOADING FALLBACK ─────────────────────────────────────────
function LoadingFallback({ area }) {
  return (
    <div className="glass-panel" style={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '200px', opacity: 0.6 
    }}>
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '12px',
        color: 'var(--domain-primary)', fontFamily: 'var(--mono-font)',
        fontSize: '12px', letterSpacing: '2px'
      }}>
        <div className="spinner" style={{ 
          width: '16px', height: '16px', border: '2px solid var(--domain-primary)',
          borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
        <span>LOADING_{area}...</span>
      </div>
    </div>
  );
}

/**
 * SentinelArm - Military-Grade Global Intelligence Platform.
 * Orchestrates real-time threat detection and situational awareness.
 */
export default function SentinelArm() {
  const { 
    apiKey,
    activeDomain, 
    activeLayers, toggleLayer, 
    simulationMode,
    feed, arcs, rings, liveMode, liveSpeed,
    panels
  } = useSentinelStore();

  const [booting, setBooting] = useState(true);
  const [missionEngaged, setMissionEngaged] = useState(false);
  const [bootStatus, setBootStatus] = useState("INITIALIZING_CORE");
  const [bootProgress, setBootProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const [dim, setDim] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [signatures, setSignatures] = useState(() => {
    const saved = localStorage.getItem("soc_signatures");
    return saved ? JSON.parse(saved) : DEFAULT_SIGNATURES;
  });
  const [selectedModel] = useState("claude-3-5-sonnet-20241022");
  const [showOsintPanel, setShowOsintPanel] = useState(false);
  const [osintText, setOsintText] = useState("");
  const [isOsintParsing, setIsOsintParsing] = useState(false);
  const [showBriefing, setShowBriefing] = useState(() => !localStorage.getItem("soc_briefing_seen"));

  const { syncCloud } = useSentinelStore();

  // ── MISSION ORCHESTRATION ──
  const handleEngage = () => {
    setMissionEngaged(true);
    // Professional Military Boot Sequence
    const statusMsgs = [
      { p: 10, m: "MOUNTING_TACTICAL_DOMAINS" },
      { p: 35, m: "CALIBRATING_NEURAL_VECTORS" },
      { p: 65, m: "SYNCING_THREAT_SIGNATURES" },
      { p: 90, m: "HARDENING_OSINT_GATEWAY" },
      { p: 100, m: "SENTINEL-ARM_ACTIVE" }
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      setBootProgress(current);
      const msg = statusMsgs.find(s => current <= s.p);
      if (msg) setBootStatus(msg.m);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setBooting(false), 500);
      }
    }, 40);
  };

  // ── CLOUD INFRASTRUCTURE UPLINK ───────────────────────────
  useEffect(() => {
    let cleanup;
    const initCloud = async () => {
      cleanup = await syncCloud();
    };
    initCloud();
    return () => cleanup && cleanup();
  }, [activeDomain, syncCloud]);

  const [activePage, setActivePage] = useState('dash');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { ingestManualLog } = useAnomalyEngine({ signatures });
  const { forecast } = useL2Forecaster({ feed, simulationMode, apiKey, selectedModel, liveMode, liveSpeed });

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

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    const handleResize = () => {
      setDim({ w: window.innerWidth, h: window.innerHeight });
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("resize", handleResize);
    // Mark as loaded after initial setup
    setTimeout(() => setIsLoaded(true), 100);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredFeed = useMemo(() => feed.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return f.log.toLowerCase().includes(q) || f.threat_type.toLowerCase().includes(q);
  }), [feed, searchQuery]);

  const mapPoints = useMemo(() => {
    const points = [];
    activeLayers.forEach(l => {
      if (LAYERS_DB[l]) points.push(...LAYERS_DB[l]);
    });
    return points;
  }, [activeLayers]);

  const themeClass = `theme-${activeDomain.toLowerCase()}`;

  const processOsintIntelligence = async () => {
    if(!osintText.trim()) return;
    setIsOsintParsing(true);
    try {
      if (simulationMode || !apiKey) {
        await new Promise(r => setTimeout(r, 1500));
        setSignatures(prev => [...prev, { id: Date.now(), category: `OSINT [EXTRACTED]`, severity: "high", mitre: "T-OSINT", pattern: "Extracted", active: true }]);
      } else {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({ 
            model: selectedModel, max_tokens: 300, 
            system: "Extract JSON: { \"category\", \"mitre\", \"pattern\", \"severity\" }", 
            messages: [{ role: "user", content: osintText }] 
          })
        });
        const data = await response.json();
        const raw = data.content?.find(c => c.type === "text")?.text || "{}";
        const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
        setSignatures(prev => [...prev, { ...parsed, id: Date.now(), active: true }]);
      }
    } catch(e) { console.error(e); }
    setIsOsintParsing(false); setShowOsintPanel(false); setOsintText("");
  };

  if (!missionEngaged) return (
    <Suspense fallback={<div style={{ background: '#0a0a0f', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--domain-primary)', fontFamily: 'monospace' }}>INITIALIZING...</div>}>
      <SplashGate onEngage={handleEngage} />
    </Suspense>
  );

  // Show loading until everything is ready
  if (!isLoaded) {
    return (
      <div style={{ 
        width: '100vw', height: '100vh', background: '#010208', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--domain-primary)', fontFamily: 'var(--mono-font)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '12px', letterSpacing: '4px', marginBottom: '16px' }}>INITIALIZING</div>
          <div style={{ width: '200px', height: '2px', background: 'rgba(255,255,255,0.1)' }}>
            <div style={{ width: '30%', height: '100%', background: 'var(--domain-primary)', animation: 'slide 1s infinite' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`wm-main-wrapper ${themeClass}`}>
      <motion.div 
        className="custom-cursor"
        style={{ left: mousePos.x, top: mousePos.y }}
        animate={{ scale: isMobile ? 0 : 1 }}
      />

      <AnimatePresence>
        {showBriefing && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', bottom: '80px', right: '32px', width: '300px', zIndex: 10006, pointerEvents: 'auto' }}
          >
             <div className="glass-panel" style={{ padding: '20px', border: '1px solid var(--domain-primary)', boxShadow: '0 0 30px var(--domain-glow)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                   <Activity size={16} color="var(--domain-primary)" />
                   <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '2px', color: 'white' }}>MISSION_BRIEFING</span>
                </div>
                <p style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '16px' }}>
                  Operator, welcome to SENTINEL-ARM. Quadrants provide real-time telemetry. Toggle layers in the bottom-right legend to isolate threats.
                </p>
                <button 
                  className="btn-console" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setShowBriefing(false); localStorage.setItem("soc_briefing_seen", "true"); }}
                >
                  ACKNOWLEDGE_MISSION
                </button>
             </div>
          </motion.div>
        )}

        {booting && (
          <motion.div 
            key="boot"
            exit={{ opacity: 0, scale: 1.1 }}
            className="boot-wrapper"
          >
             <div className="boot-logo scanning">
                <Target size={64} color="var(--domain-primary)" />
             </div>
             <div style={{ width: '320px', marginTop: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '10px', color: 'var(--domain-primary)', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>
                  <span>{bootStatus}</span>
                  <span>{bootProgress}%</span>
                </div>
                <div className="boot-bar">
                    <div className="boot-progress" style={{ width: `${bootProgress}%` }} />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="wm-globe-container">
         <GlobeLayer 
           dim={dim} countries={countries} arcs={arcs} rings={rings} 
           mapPoints={mapPoints} liveMode={liveMode} globeRef={globeRef} 
           activeDomain={activeDomain} activeLayers={activeLayers}
         />
      </div>

      {!isMobile && (
        <div style={{ gridArea: 'sidebar', pointerEvents: 'auto', zIndex: 10003 }}>
          <Sidebar activePage={activePage} setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} />
        </div>
      )}
      
      <div style={{ gridArea: 'header', pointerEvents: 'auto', zIndex: 10004 }}>
        <TopBar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} activePage={activePage} />
      </div>

      <div className="hud-layout-grid">
          <AnimatePresence mode="wait">
            {activePage === 'dash' && (
              <>
                {panels.stats && <div className="wm-hud-quadrant wm-hud-tl"><StatsPanel /></div>}
                {panels.risk && <div className="wm-hud-quadrant wm-hud-tr"><RiskPanel /></div>}
                
                {!isMobile && panels.intel && <div className="wm-hud-quadrant wm-hud-bl"><IntelligencePanel /></div>}
                {!isMobile && panels.layers && (
                  <div className="wm-hud-quadrant wm-hud-br">
                    <LayerLegend activeLayers={activeLayers} setActiveLayers={toggleLayer} />
                  </div>
                )}
              </>
            )}

            {activePage === 'l2' && (
              <motion.div 
                key="l2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ gridArea: 'tl / tl / br / br', pointerEvents: 'auto', padding: '40px' }}
              >
                 <PredictivePanel forecast={forecast} />
              </motion.div>
            )}

            {activePage === 'data' && (
              <motion.div 
                key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ gridArea: 'tl / tl / br / br', pointerEvents: 'auto', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px' }}
              >
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }} className="custom-scrollbar">
                    <RiskPanel />
                    <IntelligencePanel />
                 </div>
                 <DataLake filteredFeed={filteredFeed} anomalies={feed.filter(f => f.is_anomaly).length} searchQuery={searchQuery} setSearchQuery={setSearchQuery} activeDomain={activeDomain} onTrackIp={(geoData) => {
                   if(globeRef.current) globeRef.current.pointOfView({ lat: geoData.lat, lng: geoData.lon || geoData.lng, altitude: 0.8 }, 2000);
                 }} />
              </motion.div>
            )}

            {activePage === 'archives' && (
               <motion.div 
                  key="records"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="glass-panel" 
                  style={{ height: 'calc(100vh - 180px)', display: 'flex', flexDirection: 'column' }}
               >
                  <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="panel-label" style={{ margin: 0 }}>LOCAL_THREAT_ARCHIVES // {feed.length}_RECORDS</div>
                    <button className="btn-console" onClick={() => { if(window.confirm("Purge local telemetry?")) { useSentinelStore.getState().setFeed([]); window.location.reload(); } }}>PURGE_UPLINK</button>
                  </div>
                  <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 32px' }} className="custom-scrollbar">
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#94a3b8', fontSize: '11px', fontFamily: 'var(--mono-font)' }}>
                      <thead style={{ position: 'sticky', top: 0, background: 'var(--soc-bg)', zIndex: 5 }}>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                          <th style={{ padding: '20px 10px' }}>TIMESTAMP</th>
                          <th style={{ padding: '20px 10px' }}>SEVERITY</th>
                          <th style={{ padding: '20px 10px' }}>UNIT_LOG</th>
                          <th style={{ padding: '20px 10px' }}>MITRE_TCODE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feed.map((f, i) => (
                          <tr key={f.id || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', background: f.is_anomaly ? 'rgba(244, 63, 94, 0.03)' : 'transparent' }}>
                            <td style={{ padding: '15px 10px', color: 'white' }}>{new Date(f.ts).toISOString().replace('T', ' ').slice(0, 19)}</td>
                            <td style={{ padding: '15px 10px' }}>
                              <span style={{ color: f.severity === 'critical' ? 'var(--alert-red)' : f.severity === 'high' ? 'var(--domain-primary)' : '#64748b', fontWeight: 900 }}>{f.severity.toUpperCase()}</span>
                            </td>
                            <td style={{ padding: '15px 10px', opacity: 0.6 }}>{f.log.slice(0, 100)}...</td>
                            <td style={{ padding: '15px 10px', color: 'var(--domain-primary)' }}>{f.mitre_attack || '----'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </motion.div>
            )}

            {activePage === 'ingest' && (
              <motion.div key="ingest" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ gridArea: 'tl / tl / br / br', pointerEvents: 'auto' }}>
                <LogIngestor onIngest={ingestManualLog} activeDomain={activeDomain} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tactical Overlay Tools (Integrated) */}
          {!isMobile && activePage === 'dash' && (
            <div className="map-controls glass-panel" style={{ position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)', padding: '8px', zIndex: 10005, display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
              <button className="btn-console" style={{ padding: '8px' }} onClick={() => globeRef.current?.pointOfView({ lat: 38, lng: 127, altitude: 1.5 }, 1500)} title="Focus: Asia"><Target size={16} /></button>
              <button className="btn-console" style={{ padding: '8px' }} onClick={() => globeRef.current?.pointOfView({ lat: 48, lng: 31, altitude: 1.5 }, 1500)} title="Focus: Europe"><Map size={16} /></button>
              <button className="btn-console" style={{ padding: '8px' }} onClick={() => globeRef.current?.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 1000)} title="Reset Globe"><Crosshair size={16} /></button>
            </div>
          )}
      </div>

      {isMobile && <MobileNav activePage={activePage} setActivePage={setActivePage} />}

      <Suspense fallback={null}>
        {activePage === 'osint' && (
          <OSINTPanel onClose={() => setActivePage('dash')} />
        )}
      </Suspense>

      <OSINTModal 
        showOsintPanel={showOsintPanel} 
        setShowOsintPanel={(val) => { setShowOsintPanel(val); }} 
        osintText={osintText} setOsintText={setOsintText} 
        processOsintIntelligence={processOsintIntelligence} isOsintParsing={isOsintParsing} 
      />
      </div>
    </ErrorBoundary>
  );
}
