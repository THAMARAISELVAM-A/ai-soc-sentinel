import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line, Points, PointMaterial } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Globe, Activity, AlertTriangle, Search, 
  Terminal, Radio, Zap, Lock, Eye, Cpu, Network,
  ChevronRight, Play, Pause, RefreshCw, Settings,
  Maximize2, Minimize2, Download, Upload, Wifi,
  Crosshair, Target, Radar, MapPin, Clock, TrendingUp,
  BarChart3, PieChart, Layers, GitMerge, Cpu as Processor
} from 'lucide-react';
import './App.css';

// 3D Globe Component
function Globe3D({ alertMode }) {
  const globeRef = useRef();
  
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Globe sphere */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial
          color={alertMode ? '#ef4444' : '#1a1a2e'}
          emissive={alertMode ? '#ef4444' : '#3b82f6'}
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
          wireframe={false}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[2.02, 32, 32]} />
        <meshBasicMaterial
          color={alertMode ? '#ef4444' : '#3b82f6'}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color={alertMode ? '#ef4444' : '#3b82f6'}
          transparent
          opacity={0.05}
          side={2}
        />
      </mesh>

      {/* Random data points on globe */}
      {Array.from({ length: 50 }).map((_, i) => {
        const lat = (Math.random() - 0.5) * 160;
        const lon = Math.random() * 360;
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = 2.05 * Math.sin(phi) * Math.cos(theta);
        const y = 2.05 * Math.cos(phi);
        const z = 2.05 * Math.sin(phi) * Math.sin(theta);
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              color={alertMode ? '#ef4444' : '#3b82f6'}
              transparent
              opacity={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Sample data generators
const generateIntelData = () => [
  {
    id: 1,
    source: 'CISA',
    title: 'Critical infrastructure targeted by APT29 group using novel supply chain attack vectors',
    severity: 'critical',
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
  },
  {
    id: 2,
    source: 'FBI',
    title: 'Ransomware-as-a-Service operations increase 300% in Q4 2024',
    severity: 'high',
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
  },
  {
    id: 3,
    source: 'NSA',
    title: 'Zero-day vulnerability discovered in enterprise VPN solutions',
    severity: 'high',
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
  },
  {
    id: 4,
    source: 'INTERPOL',
    title: 'International cybercrime syndicate dismantled in Operation Shadow',
    severity: 'medium',
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
  }
];

const generateLiveEvents = () => [
  {
    id: 1,
    type: 'intrusion',
    source: '192.168.1.45',
    target: '10.0.0.12',
    protocol: 'HTTPS',
    severity: 'critical',
    description: 'SQL injection attempt detected on web application firewall',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    type: 'malware',
    source: '203.0.113.42',
    target: '172.16.0.8',
    protocol: 'HTTP',
    severity: 'high',
    description: 'Trojan downloader activity identified in network traffic',
    timestamp: new Date(Date.now() - 120000).toISOString()
  },
  {
    id: 3,
    type: 'bruteforce',
    source: '198.51.100.23',
    target: '10.0.0.5',
    protocol: 'SSH',
    severity: 'medium',
    description: 'SSH brute force attack from known botnet infrastructure',
    timestamp: new Date(Date.now() - 300000).toISOString()
  },
  {
    id: 4,
    type: 'ddos',
    source: 'Multiple',
    target: '10.0.0.1',
    protocol: 'UDP',
    severity: 'high',
    description: 'Volumetric DDoS attack mitigated by edge protection',
    timestamp: new Date(Date.now() - 600000).toISOString()
  }
];

function App() {
  const [alertMode, setAlertMode] = useState(false);
  const [activeDomain, setActiveDomain] = useState('cyber');
  const [activeTab, setActiveTab] = useState('intel');
  const [intelData, setIntelData] = useState(generateIntelData());
  const [liveEvents, setLiveEvents] = useState(generateLiveEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [systemStats, setSystemStats] = useState({
    eventsPerSecond: 1247,
    activeThreats: 23,
    blockedAttacks: 892,
    uptime: '99.97%'
  });
  const [consoleOutput, setConsoleOutput] = useState([
    '[SYSTEM] AI SOC Sentinel v1.0.0 initialized',
    '[NETWORK] Connected to threat intelligence feeds',
    '[ANALYSIS] ML models loaded and ready',
    '[MONITOR] Real-time scanning active'
  ]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

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

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        eventsPerSecond: Math.floor(prev.eventsPerSecond + (Math.random() - 0.5) * 100),
        activeThreats: Math.max(0, prev.activeThreats + Math.floor(Math.random() * 5 - 2)),
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 10),
        uptime: prev.uptime
      }));

      // Randomly add new intel
      if (Math.random() > 0.7) {
        const sources = ['CISA', 'FBI', 'NSA', 'INTERPOL', 'Europol', 'NCSC'];
        const titles = [
          'New ransomware variant targeting healthcare sector detected',
          'Critical vulnerability patched in widely-used encryption library',
          'State-sponsored hacking group identified in supply chain compromise',
          'Phishing campaign using AI-generated content discovered',
          'IoT botnet activity surge detected in Eastern Europe'
        ];
        
        const newIntel = {
          id: Date.now(),
          source: sources[Math.floor(Math.random() * sources.length)],
          title: titles[Math.floor(Math.random() * titles.length)],
          severity: Math.random() > 0.5 ? 'high' : 'medium',
          timestamp: new Date().toISOString()
        };
        
        setIntelData(prev => [newIntel, ...prev.slice(0, 5)]);
      }

      // Randomly add console messages
      if (Math.random() > 0.8) {
        const messages = [
          '[SCAN] Network sweep completed - 1,247 hosts analyzed',
          '[AI] Pattern recognition model updated with new signatures',
          '[ALERT] Anomalous traffic pattern detected in segment 7G',
          '[UPDATE] Threat intelligence feed synchronized',
          '[BLOCK] Malicious payload quarantined successfully'
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

  return (
    <div className={`wm-main-wrapper ${alertMode ? 'alert-active' : ''}`}>
      {/* 3D Globe Container */}
      <div className="wm-globe-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Globe3D alertMode={alertMode} />
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minDistance={3} 
            maxDistance={10}
            autoRotate={!alertMode}
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* UI Layer */}
      <div className="wm-ui-layer">
        {/* Header */}
        <motion.header 
          className="wm-header glass-panel"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="wm-logo-box">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="wm-title">AI SOC SENTINEL</h1>
              <p style={{ fontSize: '10px', color: '#64748b', letterSpacing: '0.2em', marginTop: '2px' }}>
                WORLD MONITOR INTELLIGENCE ENGINE
              </p>
            </div>
          </div>

          <div className="wm-header-actions">
            <div className="stat-box">
              <span>Events/sec</span>
              <strong>{systemStats.eventsPerSecond.toLocaleString()}</strong>
            </div>
            <div className="stat-box">
              <span>Active Threats</span>
              <strong style={{ color: alertMode ? '#ef4444' : '#f59e0b' }}>
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
          </div>
        </motion.header>

        {/* Left Panel */}
        <motion.aside 
          className="wm-panel-left glass-panel"
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
                  <h3 className="panel-label">THREAT INTELLIGENCE</h3>
                  {intelData.map(item => (
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
                  ))}
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
                  <h3 className="panel-label">LIVE EVENTS</h3>
                  {liveEvents.map(item => (
                    <motion.div 
                      key={item.id}
                      className="live-item"
                      whileHover={{ x: 5 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
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
                        <div style={{ 
                          padding: '2px 6px', 
                          borderRadius: '3px', 
                          fontSize: '9px',
                          backgroundColor: item.severity === 'critical' ? '#ef444420' : 
                                         item.severity === 'high' ? '#f59e0b20' : '#3b82f620',
                          color: item.severity === 'critical' ? '#ef4444' : 
                                item.severity === 'high' ? '#f59e0b' : '#3b82f6',
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em'
                        }}>
                          {item.severity}
                        </div>
                      </div>
                    </motion.div>
                  ))}
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
                  <h3 className="panel-label">AI ANALYSIS</h3>
                  
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
                  </div>

                  <div className="intel-card">
                    <div className="intel-source">
                      <Zap size={14} style={{ marginRight: '6px' }} />
                      ACTIVE DETECTIONS
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
                      <div>• 3 suspicious network patterns identified</div>
                      <div>• 7 potential phishing attempts blocked</div>
                      <div>• 2 malware signatures detected in transit</div>
                      <div>• 12 anomalous login attempts flagged</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>

        {/* Right Panel */}
        <motion.aside 
          className="wm-panel-right glass-panel"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="panel-label">COMMAND CENTER</h3>

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
              <button className="btn-console" onClick={toggleAlertMode}>
                <AlertTriangle size={16} />
                {alertMode ? 'DEACTIVATE' : 'ALERT MODE'}
              </button>
              <button className="btn-console">
                <Terminal size={16} />
                CONSOLE
                <span className="status-tag" style={{ backgroundColor: '#10b98133', color: '#10b981' }}>
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
                    <div key={index}>{line}</div>
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
              color: alertMode ? '#ef4444' : '#f59e0b',
              textShadow: `0 0 20px ${alertMode ? '#ef4444' : '#f59e0b'}40`
            }}>
              {alertMode ? 'CRITICAL' : 'ELEVATED'}
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
        </motion.footer>
      </div>
    </div>
  );
}

export default App;