import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState, Suspense, lazy, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Activity, Database, Cpu, ShieldAlert, Terminal, ShieldCheck, Target, Globe, Search, Zap, Clock, AlertTriangle, CheckCircle, X } from 'lucide-react'
import './App.css'

const SplashGate = lazy(() => import('./components/Core/SplashGate').then(m => ({ default: m.SplashGate || m })))

function Loading() {
  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      background: '#010208', display: 'flex', 
      alignItems: 'center', justifyContent: 'center',
      color: '#0ea5e9', fontFamily: 'monospace'
    }}>
      LOADING...
    </div>
  )
}

function Dashboard({ activePage, setActivePage }) {
  const [threats, setThreats] = useState(47)
  const [nodes, setNodes] = useState(12)
  const [uptime, setUptime] = useState(99.9)
  const [logs, setLogs] = useState([
    { id: 1, time: '02:24:58', type: 'THREAT', msg: 'Suspicious network activity detected from 192.168.1.105', severity: 'high' },
    { id: 2, time: '02:24:32', type: 'SCAN', msg: 'Port scan detected on firewall perimeter', severity: 'medium' },
    { id: 3, time: '02:24:15', type: 'BLOCK', msg: 'Malicious payload blocked - SQL injection attempt', severity: 'critical' },
    { id: 4, time: '02:23:58', type: 'ALERT', msg: 'Anomalous traffic pattern identified', severity: 'low' },
    { id: 5, time: '02:23:42', type: 'PROXY', msg: 'New node registered: server-node-07', severity: 'info' },
  ])
  const [intelligence, setIntelligence] = useState([])
  const [query, setQuery] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  // Live threat counter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(t => t + Math.floor(Math.random() * 3) - 1)
      setNodes(n => Math.max(8, n + (Math.random() > 0.9 ? 1 : 0)))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { id: 'dash', label: 'TACTICAL_HUD', icon: <Target size={16} /> },
    { id: 'data', label: 'INTEL_STREAM', icon: <Database size={16} /> },
    { id: 'ingest', label: 'MOUNT_LOGS', icon: <Terminal size={16} /> },
    { id: 'l2', label: 'PREDICTIVE_AI', icon: <Cpu size={16} /> },
    { id: 'archives', label: 'MISSION_HISTORY', icon: <ShieldCheck size={16} /> },
    { id: 'osint', label: 'OSINT_GATE', icon: <ShieldAlert size={16} /> },
  ]

  const runIntelligenceScan = async () => {
    if (!query.trim()) return
    setIsScanning(true)
    // Simulated OSINT scan
    await new Promise(r => setTimeout(r, 2000))
    setIntelligence(prev => [{
      id: Date.now(),
      source: 'OSINT_SCAN',
      query: query,
      results: [
        { type: 'DOMAIN', data: `${query}.com - RESOLVED: 192.168.1.1` },
        { type: 'WHOIS', data: 'Registrar: Cloudflare, Created: 2024' },
        { type: 'SSL', data: 'TLS 1.3 valid, expires in 89 days' },
        { type: 'PORTS', data: '80, 443, 22 open' },
      ],
      timestamp: new Date().toISOString()
    }, ...prev])
    setIsScanning(false)
    setQuery('')
  }

  const getSeverityColor = (s) => {
    if (s === 'critical') return '#ef4444'
    if (s === 'high') return '#f97316'
    if (s === 'medium') return '#eab308'
    if (s === 'low') return '#3b82f6'
    return '#10b981'
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#010208' }}>
      <nav style={{
        width: '280px', height: '100%',
        background: 'rgba(1, 2, 8, 0.98)',
        borderRight: '1px solid rgba(14, 165, 233, 0.2)',
        display: 'flex', flexDirection: 'column',
        padding: '32px 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px 32px' }}>
          <div style={{ 
            background: 'rgba(14, 165, 233, 0.2)', padding: '12px', borderRadius: '8px',
            border: '1px solid rgba(14, 165, 233, 0.3)'
          }}>
            <Activity color="#0ea5e9" size={20} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>SENTINEL-ARM</div>
            <div style={{ fontSize: '8px', color: '#0ea5e9', fontWeight: 900, letterSpacing: '1px' }}>MIL_INTEL_V1.0</div>
          </div>
        </div>
        
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ padding: '0 16px 12px', fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '2px' }}>MISSION_NAVIGATION</div>
          {navItems.map(item => (
            <div 
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
                borderRadius: '8px', cursor: 'pointer',
                background: activePage === item.id ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                border: activePage === item.id ? '1px solid rgba(14, 165, 233, 0.3)' : '1px solid transparent'
              }}
            >
              <span style={{ color: activePage === item.id ? '#0ea5e9' : '#64748b' }}>
                {item.icon}
              </span> 
              <span style={{ 
                fontSize: '11px', fontWeight: activePage === item.id ? 900 : 700,
                letterSpacing: '1px',
                color: activePage === item.id ? 'white' : '#64748b'
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: '24px 16px', borderTop: '1px solid rgba(14, 165, 233, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981' }}></div>
            <span style={{ fontSize: '10px', fontWeight: 900, color: '#10b981', letterSpacing: '2px' }}>UPLINK_STABLE</span>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        {activePage === 'dash' && (
          <>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px', marginBottom: '8px' }}>
              SENTINEL-ARM // TACTICAL_HUD
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '32px' }}>
              TACTICAL OVERVIEW
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
              <StatCard label="THREATS DETECTED" value={threats} icon={<AlertTriangle size={20} />} color="#ef4444" />
              <StatCard label="ACTIVE NODES" value={nodes} icon={<Cpu size={20} />} color="#0ea5e9" />
              <StatCard label="UPTIME" value={`${uptime}%`} icon={<Zap size={20} />} color="#10b981" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>LIVE THREAT LOG</div>
                {logs.map(log => (
                  <div key={log.id} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace' }}>{log.time}</div>
                    <div style={{ width: '60px', fontSize: '9px', fontWeight: 900, color: getSeverityColor(log.severity), textTransform: 'uppercase' }}>{log.severity}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{log.msg}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>SYSTEM STATUS</div>
                <SystemStatus label="NEURAL_LAYER" value="OPERATIONAL" color="#10b981" />
                <SystemStatus label="THREAT_DETECTION" value="ACTIVE" color="#10b981" />
                <SystemStatus label="ENCRYPTION" value="AES-256" color="#10b981" />
                <SystemStatus label="API_GATEWAY" value="ONLINE" color="#10b981" />
                <SystemStatus label="DATA_LAKE" value="MOUNTED" color="#10b981" />
              </div>
            </div>
          </>
        )}

        {activePage === 'data' && (
          <>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px', marginBottom: '8px' }}>
              SENTINEL-ARM // INTEL_STREAM
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '32px' }}>
              INTEL STREAM
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter intelligence query..."
                  style={{
                    flex: 1, background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)',
                    borderRadius: '8px', padding: '12px 16px', color: 'white', fontFamily: 'monospace',
                    outline: 'none'
                  }}
                />
                <button 
                  onClick={runIntelligenceScan}
                  disabled={isScanning || !query.trim()}
                  style={{
                    background: isScanning ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.2)',
                    border: '1px solid rgba(14, 165, 233, 0.4)',
                    borderRadius: '8px', padding: '12px 24px', color: '#0ea5e9', fontWeight: 900,
                    cursor: isScanning ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isScanning ? 'SCANNING...' : 'EXECUTE'}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {intelligence.length === 0 ? (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '48px', color: '#64748b' }}>
                  <Globe size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <div>Execute an intelligence query to begin data collection</div>
                </div>
              ) : (
                intelligence.map(item => (
                  <div key={item.id} style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
                    <div style={{ fontSize: '10px', color: '#0ea5e9', fontWeight: 900, letterSpacing: '2px', marginBottom: '16px' }}>{item.source}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '12px' }}>Query: {item.query}</div>
                    {item.results.map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>{r.type}</span>
                        <span style={{ color: 'white', fontSize: '11px', fontFamily: 'monospace' }}>{r.data}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activePage === 'ingest' && (
          <>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px', marginBottom: '8px' }}>
              SENTINEL-ARM // MOUNT_LOGS
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '32px' }}>
              MOUNT LOGS
            </div>

            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>LOG INGESTOR</div>
              <textarea 
                placeholder="Paste log data for anomaly detection..."
                style={{
                  width: '100%', height: '200px', background: 'rgba(1, 2, 8, 0.8)', 
                  border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '8px',
                  padding: '16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '11px',
                  outline: 'none', resize: 'none'
                }}
              />
              <button style={{
                marginTop: '16px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px', padding: '12px 24px', color: '#ef4444', fontWeight: 900,
                cursor: 'pointer'
              }}>
                ANALYZE_LOGS
              </button>
            </div>
          </>
        )}

        {activePage === 'l2' && (
          <>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px', marginBottom: '8px' }}>
              SENTINEL-ARM // PREDICTIVE_AI
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '32px' }}>
              PREDICTIVE AI
            </div>

            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>L2 FORECAST ENGINE</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {[
                  { label: 'THREAT_PROBABILITY', value: '23.4%', trend: '↑' },
                  { label: 'ANOMALY_RISK', value: 'LOW', trend: '→' },
                  { label: 'CONFIDENCE', value: '94.7%', trend: '↑' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(1, 2, 8, 0.6)', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px' }}>{item.label}</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activePage === 'archives' && (
          <>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px', marginBottom: '8px' }}>
              SENTINEL-ARM // MISSION_HISTORY
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '32px' }}>
              MISSION HISTORY
            </div>

            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>MISSION ARCHIVES</div>
              {[1,2,3,4,5].map(i => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'white' }}>Operation Sentinel-{2026000 + i}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>2026-04-{17-i} 02:{20+i}:00</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="#10b981" />
                    <span style={{ fontSize: '10px', color: '#10b981' }}>COMPLETED</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activePage === 'osint' && (
          <>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px', marginBottom: '8px' }}>
              SENTINEL-ARM // OSINT_GATE
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '32px' }}>
              OSINT GATE
            </div>

            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>OSINT TOOLS</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {['WHOIS', 'DNS_SCAN', 'SSL_CERT', 'PORT_SCAN', 'SUBDOMAINS', 'CRAWL', 'WEB_ANALYTICS', 'SOCIAL_LOOKUP'].map(tool => (
                  <button key={tool}
                    style={{
                      background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)',
                      borderRadius: '8px', padding: '16px', color: '#0ea5e9', fontSize: '10px', fontWeight: 900,
                      cursor: 'pointer'
                    }}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ 
      background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)',
      borderRadius: '8px', padding: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '2px' }}>{label}</span>
        <span style={{ color }}>{icon}</span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 900, color: 'white' }}>{value}</div>
    </div>
  )
}

function SystemStatus({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ fontSize: '11px', color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: '11px', fontWeight: 900, color }}>{value}</span>
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [activePage, setActivePage] = useState('dash')
  
  return (
    <AnimatePresence mode="wait">
      {!started ? (
        <Suspense key="splash" fallback={<Loading />}>
          <SplashGate onEngage={() => setStarted(true)} />
        </Suspense>
      ) : (
        <Dashboard key="dashboard" activePage={activePage} setActivePage={setActivePage} />
      )}
    </AnimatePresence>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)