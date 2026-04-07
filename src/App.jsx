import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line, Points, PointMaterial, Trail, Sphere } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Globe, Activity, AlertTriangle, Search, 
  Terminal, Radio, Zap, Lock, Eye, Cpu, Network,
  ChevronRight, Play, Pause, RefreshCw, Settings,
  Maximize2, Minimize2, Download, Upload, Wifi,
  Crosshair, Target, Radar, MapPin, Clock, TrendingUp,
  BarChart3, PieChart, Layers, GitMerge, Cpu as Processor,
  Brain, MessageSquare, Sparkles, WifiOff
} from 'lucide-react';
import { useWebSocket } from './hooks/useWebSocket';
import './App.css';

// 3D Globe Component with enhanced visuals
function Globe3D({ alertMode, attackData }) {
  const globeRef = useRef();
  const atmosphereRef = useRef();
  
  useFrame((state) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0008;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.001;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Globe sphere with enhanced shader-like material */}
      <mesh>
        <sphereGeometry args={[2, 128, 128]} />
        <meshPhongMaterial
          color={alertMode ? '#1a0505' : '#0a0a1a'}
          emissive={alertMode ? '#ef4444' : '#1e3a5f'}
          emissiveIntensity={0.2}
          transparent
          opacity={0.95}
          wireframe={false}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshBasicMaterial
          color={alertMode ? '#ef4444' : '#3b82f6'}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshBasicMaterial
          color={alertMode ? '#ef4444' : '#3b82f6'}
          transparent
          opacity={0.04}
          side={2}
        />
      </mesh>

      {/* Attack visualization - orbital trails */}
      {attackData && attackData.map((attack, i) => (
        <AttackTrail key={attack.id || i} attack={attack} index={i} />
      ))}

      {/* Random data points on globe */}
      {Array.from({ length: 80 }).map((_, i) => {
        const lat = (Math.random() - 0.5) * 160;
        const lon = Math.random() * 360;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = 2.05 * Math.sin(phi) * Math.cos(theta);
        const y = 2.05 * Math.cos(phi);
        const z = 2.05 * Math.sin(phi) * Math.sin(theta);
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshBasicMaterial
              color={alertMode ? '#ef4444' : '#3b82f6'}
              transparent
              opacity={0.6 + Math.random() * 0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Attack trail visualization component
function AttackTrail({ attack, index }) {
  const ref = useRef();
  const { lat, lon } = attack.location || { lat: (Math.random() - 0.5) * 160, lon: Math.random() * 360 };
  
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = 2.1 * Math.sin(phi) * Math.cos(theta);
  const y = 2.1 * Math.cos(phi);
  const z = 2.1 * Math.sin(phi) * Math.sin(theta);

  useFrame((state) => {
    if (ref.current) {
      ref.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.2;
    }
  });

  const color = attack.riskScore >= 9 ? '#ef4444' : 
                attack.riskScore >= 7 ? '#f59e0b' : 
                attack.riskScore >= 5 ? '#3b82f6' : '#10b981';

  return (
    <group>
      <Trail
        width={1.5}
        length={4}
        color={color}
        attenuation={(t) => t * t}
      >
        <mesh ref={ref} position={[x, y, z]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      </Trail>
      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[x * 0.5, y * 0.5, z * 0.5]}>
        <ringGeometry args={[0.3, 0.32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={2} />
      </mesh>
    </group>
  );
}

// Radar sweep effect
function RadarSweep() {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2.2]}>
      <circleGeometry args={[3, 64, 1]} />
      <meshBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.03}
        side={2}
      />
    </mesh>
  );
}

// AI Analysis Panel Component
function AIAnalysisPanel({ threat, analysis, isAnalyzing }) {
  if (!threat) return null;

  return (
    <motion.div
      className="intel-card ai-analysis-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="intel-source">
        <Brain size={14} style={{ marginRight: '6px' }} />
        CLAUDE 3.5 AI ANALYSIS
        {isAnalyzing && <span className="analyzing-indicator">ANALYZING...</span>}
      </div>
      
      {isAnalyzing ? (
        <div className="ai-loading">
          <div className="ai-loading-bar">
            <div className="ai-loading-progress"></div>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
            Processing threat data with Claude 3.5...
          </span>
        </div>
      ) : analysis ? (
        <div className="ai-analysis-content">
          <div style={{ 
            fontSize: '12px', 
            color: '#e2e8f0', 
            lineHeight: '1.6',
            fontFamily: 'var(--mono-font)'
          }}>
            {analysis.split('\n').map((line, i) => (
              <div key={i} style={{ marginBottom: '8px' }}>
                {line.startsWith('- ') ? (
                  <span>
                    <span style={{ color: '#3b82f6', fontWeight: '700' }}>
                      {line.split(':')[0]}:
                    </span>
                    {line.split(':').slice(1).join(':')}
                  </span>
                ) : line}
              </div>
            ))}
          </div>
          <div style={{ 
            fontSize: '10px', 
            color: '#64748b', 
            marginTop: '12px',
            borderTop: '1px solid var(--glass-border)',
            paddingTop: '8px'
          }}>
            Analyzed at: {new Date().toLocaleTimeString()}
          </div>
        </div>
      ) : (
        <button 
          className="btn-console"
          style={{ marginTop: '12px', width: '100%' }}
        >
          <Sparkles size={14} />
          REQUEST AI ANALYSIS
        </button>
      )}
    </motion.div>
  );
}

// Risk Score Indicator
function RiskScoreIndicator({ score }) {
  const getColor = (s) => {
    if (s >= 9) return '#ef4444';
    if (s >= 7) return '#f59e0b';
    if (s >= 5) return '#3b82f6';
    return '#10b981';
  };

  const getLevel = (s) => {
    if (s >= 9) return 'CRITICAL';
    if (s >= 7) return 'HIGH';
    if (s >= 5) return 'ELEVATED';
    if (s >= 3) return 'GUARDED';
    return 'LOW';
  };

  const color = getColor(score);

  return (
    <div className="risk-score-indicator">
      <div className="risk-score-value" style={{ color }}>
        {score.toFixed(1)}
      </div>
      <div className="risk-score-level" style={{ color: `${color}66` }}>
        {getLevel(score)}
      </div>
      <div className="risk-score-bar">
        <div 
          className="risk-score-fill" 
          style={{ 
            width: `${(score / 10) * 100}%`,
            background: color
          }}
        />
      </div>
    </div>
  );
}

// WebSocket status indicator
function WebSocketStatus({ isConnected, sessionId }) {
  return (
    <div className="ws-status">
      <div className={`ws-status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
      <span style={{ fontSize: '10px', fontFamily: 'var(--mono-font)' }}>
        {isConnected ? 'ONLINE' : 'OFFLINE'}
        {sessionId && ` | ${sessionId.slice(0, 8)}`}
      </span>
    </div>
  );
}

function App() {
  const [alertMode, setAlertMode] = useState(false);
  const [activeDomain, setActiveDomain] = useState('cyber');
  const [activeTab, setActiveTab] = useState('live');
  const [intelData, setIntelData] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [systemStats, setSystemStats] = useState({
    eventsPerSecond: 1247,
    activeThreats: 23,
    blockedAttacks: 892,
    uptime: '99.97%',
    threatLevel: 'ELEVATED'
  });
  const [consoleOutput, setConsoleOutput] = useState([
    '[SYSTEM] AI SOC Sentinel v2.0.0 initialized',
    '[NETWORK] WebSocket bridge connected',
    '[AI] Claude 3.5 integration active',
    '[ANALYSIS] Weighted anomaly engine loaded',
    '[MONITOR] Real-time scanning active'
  ]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [attackData, setAttackData] = useState([]);

  // WebSocket connection
  const { 
    isConnected, 
    sessionId, 
    lastMessage, 
    requestAnalysis,
    getContext 
  } = useWebSocket();

  const domains = [
    { id: 'cyber', icon: Shield, label: 'CYBER', color: '#3b82f6' },
    { id: 'finance', icon: Activity, label: 'FINANCE', color: '#f59e0b' },
    { id: 'geoint', icon: Globe, label: 'GEOINT', color: '#10b981' }
  ];

  const tabs = [
    { id: 'intel', label: 'INTEL FEED' },
    { id: 'live', label: 'LIVE EVENTS' },
    { id: 'analysis', label: 'AI ANALYSIS' }
  ];

  // Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'initial_data':
        setLiveEvents(lastMessage.threats);
        setAttackData(lastMessage.threats);
        setSystemStats(prev => ({ ...prev, ...lastMessage.systemStats }));
        setConsoleOutput(prev => [...prev, '[WS] Initial threat data received']);
        break;

      case 'new_threat':
        setLiveEvents(prev => [lastMessage.threat, ...prev.slice(0, 19)]);
        setAttackData(prev => [...prev.slice(-9), lastMessage.threat]);
        setSystemStats(prev => ({
          ...prev,
          activeThreats: prev.activeThreats + 1,
          threatLevel: lastMessage.threatLevel
        }));
        setConsoleOutput(prev => [...prev, 
          `[ALERT] ${lastMessage.threat.type.toUpperCase()} detected from ${lastMessage.threat.source}`
        ]);
        break;

      case 'ai_analysis':
        setAiAnalysis(lastMessage.analysis);
        setIsAnalyzing(false);
        setConsoleOutput(prev => [...prev, '[AI] Analysis complete from Claude 3.5']);
        break;

      case 'context_summary':
        setConsoleOutput(prev => [...prev, 
          `[CONTEXT] Session: ${lastMessage.threatCount} threats analyzed, ${lastMessage.messageCount} AI exchanges`
        ]);
        break;

      default:
        break;
    }
  }, [lastMessage]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        eventsPerSecond: Math.floor(prev.eventsPerSecond + (Math.random() - 0.5) * 100),
        activeThreats: Math.max(0, prev.activeThreats + Math.floor(Math.random() * 5 - 2)),
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 10),
        uptime: prev.uptime,
        threatLevel: prev.threatLevel
      }));

      // Random console messages
      if (Math.random() > 0.85) {
        const messages = [
          '[SCAN] Network sweep completed - 1,247 hosts analyzed',
          '[AI] Pattern recognition model updated with new signatures',
          '[ALERT] Anomalous traffic pattern detected in segment 7G',
          '[UPDATE] Threat intelligence feed synchronized',
          '[BLOCK] Malicious payload quarantined successfully',
          '[WEIGHT] Anomaly score recalculated for active threats',
          '[CONTEXT] LLM session context maintained - 12 active threads'
        ];
        const newMessage = messages[Math.floor(Math.random() * messages.length)];
        setConsoleOutput(prev => [...prev.slice(-9), newMessage]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setConsoleOutput(prev => [...prev, `[SEARCH] Query executed: "${searchQuery}"`]);
    setSearchQuery('');
  };

  const toggleAlertMode = () => {
    setAlertMode(!alertMode);
    setConsoleOutput(prev => [...prev, 
      alertMode 
        ? '[SYSTEM] Alert mode deactivated - returning to normal operations' 
        : '[SYSTEM] ALERT MODE ACTIVATED - Enhanced monitoring protocols engaged'
    ]);
  };

  const handleThreatSelect = (threat) => {
    setSelectedThreat(threat);
    setAiAnalysis(null);
    setIsAnalyzing(true);
    
    // Request AI analysis via WebSocket
    requestAnalysis({
      ...threat,
      riskScore: threat.riskScore || 7.0
    });
    
    setConsoleOutput(prev => [...prev, 
      `[AI] Requesting Claude 3.5 analysis for threat ${threat.id?.slice(0, 8)}`
    ]);
  };

  const handleAiAnalysisClick = () => {
    if (selectedThreat) {
      setIsAnalyzing(true);
      setAiAnalysis(null);
      requestAnalysis(selectedThreat);
    }
  };

  return (
    <div className={`wm-main-wrapper ${alertMode ? 'alert-active' : ''}`}>
      {/* 3D Globe Container */}
      <div className="wm-globe-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Globe3D alertMode={alertMode} attackData={attackData} />
          <RadarSweep />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minDistance={3} 
            maxDistance={10}
            autoRotate={!alertMode}
            autoRotateSpeed={0.3}
          />
        </Canvas>
      </div>

      {/* UI Layer */}
      <div className="wm-ui-layer">
        {/* Header */}
        <motion.header 
          className="wm-header glass-panel tactical-corners"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="wm-logo-box">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="wm-title text-glow">AI SOC SENTINEL</h1>
              <p style={{ fontSize: '9px', color: '#64748b', letterSpacing: '0.3em', marginTop: '2px', fontFamily: 'var(--mono-font)' }}>
                WORLD MONITOR INTELLIGENCE ENGINE v2.0
              </p>
            </div>
          </div>

          <div className="wm-header-actions">
            <WebSocketStatus isConnected={isConnected} sessionId={sessionId} />
            <div className="stat-box">
              <span>Events/sec</span>
              <strong>{systemStats.eventsPerSecond.toLocaleString()}</strong>
            </div>
            <div className="stat-box">
              <span>Active Threats</span>
              <strong style={{ 
                color: alertMode ? '#ef4444' : systemStats.activeThreats > 20 ? '#f59e0b' : '#10b981',
                textShadow: `0 0 10px ${alertMode ? '#ef4444' : '#f59e0b'}40`
              }}>
                {systemStats.activeThreats}
              </strong>
            </div>
            <div className="stat-box">
              <span>Blocked</span>
              <strong>{systemStats.blockedAttacks.toLocaleString()}</strong>
            </div>
            <div className="stat-box">
              <span>Uptime</span>
              <strong>{systemStats.uptime}</strong>
            </div>
            <div className="stat-box">
              <span>Threat Level</span>
              <strong style={{ 
                color: systemStats.threatLevel === 'CRITICAL' ? '#ef4444' : 
                         systemStats.threatLevel === 'HIGH' ? '#f59e0b' : '#3b82f6',
                textShadow: `0 0 15px ${systemStats.threatLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b'}40`
              }}>
                {systemStats.threatLevel}
              </strong>
            </div>
          </div>
        </motion.header>

        {/* Left Panel */}
        <motion.aside 
          className="wm-panel-left glass-panel tactical-corners"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Domain Navigation */}
          <div className="wm-domain-nav">
            {domains.map(domain => (
              <button
                key={domain.id}
                className={`nav-icon-btn ${activeDomain === domain.id ? 'active' : ''}`}
                onClick={() => setActiveDomain(domain.id)}
                style={{
                  borderColor: activeDomain === domain.id ? domain.color : '',
                  color: activeDomain === domain.id ? domain.color : ''
                }}
              >
                <domain.icon size={20} />
              </button>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="tab-bar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="list-container">
            <AnimatePresence mode="wait">
              {activeTab === 'intel' && (
                <motion.div
                  key="intel"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="panel-label text-glow-sm">THREAT INTELLIGENCE</h3>
                  {intelData.length === 0 ? (
                    <div style={{ padding: '20px', color: '#64748b', fontSize: '12px', fontFamily: 'var(--mono-font)' }}>
                      Waiting for intelligence feed...
                    </div>
                  ) : (
                    intelData.map(item => (
                      <motion.div 
                        key={item.id}
                        className="intel-card"
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="intel-source">{item.source}</div>
                        <div className="intel-title">{item.title}</div>
                        <div style={{ fontSize: '10px', color: '#64748b', marginTop: '8px' }}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'live' && (
                <motion.div
                  key="live"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="panel-label text-glow-sm">LIVE EVENTS</h3>
                  {liveEvents.length === 0 ? (
                    <div style={{ padding: '20px', color: '#64748b', fontSize: '12px', fontFamily: 'var(--mono-font)' }}>
                      Waiting for real-time events...
                    </div>
                  ) : (
                    liveEvents.map(item => (
                      <motion.div 
                        key={item.id}
                        className={`live-item ${selectedThreat?.id === item.id ? 'selected' : ''}`}
                        whileHover={{ x: 5 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleThreatSelect(item)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                              {item.type.toUpperCase()} | {item.protocol}
                            </div>
                            <div style={{ fontSize: '12px', color: '#e2e8f0' }}>
                              {item.source} → {item.target}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                              {item.description}
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                            <RiskScoreIndicator score={item.riskScore || 7.0} />
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'analysis' && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="panel-label text-glow-sm">AI ANALYSIS</h3>
                  
                  <div className="intel-card">
                    <div className="intel-source">
                      <Cpu size={14} style={{ marginRight: '6px' }} />
                      ML MODEL STATUS
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Anomaly Detection</span>
                        <span style={{ fontSize: '12px', color: '#10b981' }}>98.7% Accuracy</span>
                      </div>
                      <div style={{ height: '3px', background: '#1e293b', borderRadius: '2px' }}>
                        <div style={{ width: '98.7%', height: '100%', background: '#10b981', borderRadius: '2px' }}></div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Threat Classification</span>
                        <span style={{ fontSize: '12px', color: '#3b82f6' }}>96.2% Accuracy</span>
                      </div>
                      <div style={{ height: '3px', background: '#1e293b', borderRadius: '2px' }}>
                        <div style={{ width: '96.2%', height: '100%', background: '#3b82f6', borderRadius: '2px' }}></div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Pattern Recognition</span>
                        <span style={{ fontSize: '12px', color: '#f59e0b' }}>94.8% Accuracy</span>
                      </div>
                      <div style={{ height: '3px', background: '#1e293b', borderRadius: '2px' }}>
                        <div style={{ width: '94.8%', height: '100%', background: '#f59e0b', borderRadius: '2px' }}></div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Claude 3.5 AI</span>
                        <span style={{ fontSize: '12px', color: '#a855f7' }}>
                          {isConnected ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </div>
                      <div style={{ height: '3px', background: '#1e293b', borderRadius: '2px' }}>
                        <div style={{ 
                          width: isConnected ? '100%' : '0%', 
                          height: '100%', 
                          background: '#a855f7', 
                          borderRadius: '2px',
                          transition: 'width 0.5s'
                        }}></div>
                      </div>
                    </div>
                  </div>

                  {selectedThreat && (
                    <AIAnalysisPanel 
                      threat={selectedThreat}
                      analysis={aiAnalysis}
                      isAnalyzing={isAnalyzing}
                    />
                  )}

                  <div className="intel-card">
                    <div className="intel-source">
                      <Zap size={14} style={{ marginRight: '6px' }} />
                      ACTIVE DETECTIONS
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      <div>• {liveEvents.filter(e => e.riskScore >= 9).length} critical threats identified</div>
                      <div>• {liveEvents.filter(e => e.type === 'intrusion').length} intrusion attempts blocked</div>
                      <div>• {liveEvents.filter(e => e.type === 'malware').length} malware signatures detected</div>
                      <div>• {liveEvents.length} total active monitoring events</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>

        {/* Right Panel */}
        <motion.aside 
          className="wm-panel-right glass-panel tactical-corners"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="panel-label text-glow-sm">COMMAND CENTER</h3>

            {/* Search */}
            <form onSubmit={handleSearch} className="splunk-input-box">
              <Search size={16} style={{ position: 'absolute', left: '14px', top: '16px', color: '#64748b' }} />
              <input 
                type="text" 
                placeholder="Search threats, IPs, hashes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Quick Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
              <button className="btn-console" onClick={toggleAlertMode} style={alertMode ? { color: '#ef4444', borderColor: '#ef4444' } : {}}>
                <AlertTriangle size={16} />
                {alertMode ? 'DEACTIVATE' : 'ALERT MODE'}
              </button>
              <button className="btn-console" onClick={() => setIsConsoleOpen(!isConsoleOpen)}>
                <Terminal size={16} />
                CONSOLE
                <span className="status-tag" style={{ backgroundColor: isConsoleOpen ? '#10b98133' : '#64748b33', color: isConsoleOpen ? '#10b981' : '#64748b' }}>
                  {isConsoleOpen ? 'ON' : 'OFF'}
                </span>
              </button>
              <button className="btn-console">
                <Network size={16} />
                NETWORK
              </button>
              <button className="btn-console">
                <Settings size={16} />
                CONFIG
              </button>
            </div>

            {/* Console Output */}
            {isConsoleOpen && (
              <motion.div 
                className="intel-card"
                style={{ marginTop: '24px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="intel-source">
                  <Terminal size={14} style={{ marginRight: '6px' }} />
                  SYSTEM CONSOLE
                </div>
                <div style={{ 
                  flex: 1, 
                  background: '#00000080', 
                  borderRadius: '6px', 
                  padding: '12px',
                  fontFamily: 'var(--mono-font)',
                  fontSize: '11px',
                  color: '#10b981',
                  overflowY: 'auto',
                  lineHeight: '1.6'
                }}>
                  {consoleOutput.map((line, index) => (
                    <div key={index} className="data-stream">
                      <span className="line">{line}</span>
                    </div>
                  ))}
                  <div className="blink">_</div>
                </div>
              </motion.div>
            )}

            {/* System Status */}
            <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
              <div className="intel-card" style={{ marginBottom: '0' }}>
                <div className="intel-source">
                  <Activity size={14} style={{ marginRight: '6px' }} />
                  SYSTEM STATUS
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      CPU Load
                    </div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'var(--mono-font)' }}>
                      34%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Memory
                    </div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'var(--mono-font)' }}>
                      67%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Network I/O
                    </div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'var(--mono-font)' }}>
                      1.2 GB/s
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Disk I/O
                    </div>
                    <div style={{ fontSize: '14px', color: '#e2e8f0', fontFamily: 'var(--mono-font)' }}>
                      450 MB/s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Bottom Panel */}
        <motion.footer 
          className="wm-panel-bottom glass-panel"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="stat-box" style={{ border: 'none', paddingLeft: '0' }}>
            <span>Threat Level</span>
            <strong style={{ 
              color: systemStats.threatLevel === 'CRITICAL' ? '#ef4444' : 
                       systemStats.threatLevel === 'HIGH' ? '#f59e0b' : '#3b82f6',
              textShadow: `0 0 20px ${systemStats.threatLevel === 'CRITICAL' ? '#ef4444' : '#f59e0b'}40`
            }}>
              {systemStats.threatLevel}
            </strong>
          </div>

          <div className="stat-box" style={{ border: 'none', paddingLeft: '0' }}>
            <span>Active Sensors</span>
            <strong>2,847</strong>
          </div>

          <div className="stat-box" style={{ border: 'none', paddingLeft: '0' }}>
            <span>Monitored Networks</span>
            <strong>156</strong>
          </div>

          <div className="stat-box" style={{ border: 'none', paddingLeft: '0' }}>
            <span>Last Update</span>
            <strong>{new Date().toLocaleTimeString()}</strong>
          </div>

          <div className="stat-box" style={{ border: 'none', paddingLeft: '0' }}>
            <span>AI Confidence</span>
            <strong style={{ color: '#10b981' }}>97.3%</strong>
          </div>

          <div className="stat-box" style={{ border: 'none', paddingLeft: '0' }}>
            <span>Context</span>
            <strong style={{ color: '#a855f7' }}>ACTIVE</strong>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;