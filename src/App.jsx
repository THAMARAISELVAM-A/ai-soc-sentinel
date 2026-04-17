import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState, Suspense, lazy, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Activity, Database, Cpu, ShieldAlert, Terminal, ShieldCheck, Target, Globe as GlobeIcon, Satellite, Zap, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react'
import './App.css'

const SplashGate = lazy(() => import('./components/Core/SplashGate').then(m => ({ default: m.SplashGate || m })))
const GlobeLayer = lazy(() => import('./components/Core/GlobeLayer').then(m => ({ default: m.GlobeLayer || m })))

function Loading() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#010208', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', fontFamily: 'monospace' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', marginBottom: '16px' }}>INITIALIZING SENTINEL-ARM</div>
        <RefreshCw className="spin" size={24} />
      </div>
    </div>
  )
}

function Dashboard({ activePage, setActivePage }) {
  const [threats] = useState(47)
  const [nodes] = useState(12)
  const [uptime] = useState(99.9)
  
  const [intelligence, setIntelligence] = useState([])
  const [query, setQuery] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  // Globe data
  const arcs = useMemo(() => [
    { startLat: 40.7, startLng: -74.0, endLat: 51.5, endLng: -0.1, color: '#0ea5e9' },
    { startLat: 40.7, startLng: -74.0, endLat: 35.6, endLng: 139.6, color: '#f97316' },
    { startLat: 40.7, startLng: -74.0, endLat: 1.3, endLng: 103.8, color: '#10b981' },
    { startLat: 51.5, startLng: -0.1, endLat: 48.8, endLng: 2.3, color: '#0ea5e9' },
  ], [])

  const rings = useMemo(() => [
    { lat: 40.7, lng: -74.0, color: '#ef4444' },
    { lat: 51.5, lng: -0.1, color: '#f97316' },
    { lat: 35.6, lng: 139.6, color: '#eab308' },
  ], [])

  const mapPoints = useMemo(() => [
    { lat: 40.7, lng: -74.0 },
    { lat: 51.5, lng: -0.1 },
    { lat: 35.6, lng: 139.6 },
    { lat: 1.3, lng: 103.8 },
    { lat: 48.8, lng: 2.3 },
  ], [])

  const navItems = [
    { id: 'dash', label: 'TACTICAL_HUD', icon: <Target size={16} /> },
    { id: 'globe', label: 'GLOBAL_VIEW', icon: <GlobeIcon size={16} /> },
    { id: 'data', label: 'INTEL_STREAM', icon: <Database size={16} /> },
    { id: 'l2', label: 'PREDICTIVE_AI', icon: <Cpu size={16} /> },
    { id: 'sat', label: 'SAT_NETWORK', icon: <Satellite size={16} /> },
    { id: 'osint', label: 'OSINT_GATE', icon: <ShieldAlert size={16} /> },
  ]

  const runIntelligenceScan = async () => {
    if (!query.trim()) return
    setIsScanning(true)
    await new Promise(r => setTimeout(r, 2000))
    setIntelligence(prev => [{
      id: Date.now(),
      source: 'OSINT_SCAN',
      query: query,
      results: [
        { type: 'DOMAIN', data: `${query}.com - RESOLVED` },
        { type: 'WHOIS', data: 'Registrar: Cloudflare' },
        { type: 'SSL', data: 'TLS 1.3 valid, expires 89 days' },
        { type: 'GEOLOCATION', data: 'United States' },
        { type: 'PORTS', data: '80, 443, 22 open' },
      ],
      timestamp: new Date().toISOString()
    }, ...prev])
    setIsScanning(false)
    setQuery('')
  }

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#010208' }}>
      {/* SIDEBAR */}
      <nav style={{ width: '280px', height: '100%', background: 'rgba(1, 2, 8, 0.98)', borderRight: '1px solid rgba(14, 165, 233, 0.2)', display: 'flex', flexDirection: 'column', padding: '32px 16px', position: 'fixed', left: 0, top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px 32px' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.2)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
            <Activity color="#0ea5e9" size={20} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>SENTINEL-ARM</div>
            <div style={{ fontSize: '8px', color: '#0ea5e9', fontWeight: 900, letterSpacing: '1px' }}>MIL_INTEL_V2.0</div>
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
              <span style={{ color: activePage === item.id ? '#0ea5e9' : '#64748b' }}>{item.icon}</span> 
              <span style={{ fontSize: '11px', fontWeight: activePage === item.id ? 900 : 700, letterSpacing: '1px', color: activePage === item.id ? 'white' : '#64748b' }}>
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

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '32px', overflow: 'auto', height: '100vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px' }}>
              SENTINEL-ARM // {navItems.find(n => n.id === activePage)?.label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'white' }}>
              {activePage === 'dash' && 'TACTICAL OVERVIEW'}
              {activePage === 'globe' && 'GLOBAL INTELLIGENCE'}
              {activePage === 'data' && 'INTEL STREAM'}
              {activePage === 'l2' && 'PREDICTIVE AI'}
              {activePage === 'sat' && 'SATELLITE NETWORK'}
              {activePage === 'osint' && 'OSINT GATE'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <StatPill label="THREATS" value={threats} color="#ef4444" />
            <StatPill label="NODES" value={nodes} color="#0ea5e9" />
            <StatPill label="UPTIME" value={`${uptime}%`} color="#10b981" />
          </div>
        </div>

        {/* TACTICAL HUD */}
        {activePage === 'dash' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>LIVE THREAT LOG</div>
              {[
                { time: '02:24:58', severity: 'CRITICAL', msg: 'Network intrusion blocked from 192.168.1.105' },
                { time: '02:24:32', severity: 'HIGH', msg: 'Port scan detected on firewall' },
                { time: '02:24:15', severity: 'MEDIUM', msg: 'SQL injection attempt blocked' },
                { time: '02:23:58', severity: 'LOW', msg: 'Anomalous traffic pattern identified' },
                { time: '02:23:42', severity: 'INFO', msg: 'New node registered: server-07' },
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', width: '60px' }}>{log.time}</div>
                  <div style={{ width: '70px', fontSize: '9px', fontWeight: 900, color: log.severity === 'CRITICAL' ? '#ef4444' : log.severity === 'HIGH' ? '#f97316' : '#10b981', textTransform: 'uppercase' }}>{log.severity}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', flex: 1 }}>{log.msg}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>SYSTEM STATUS</div>
              {['NEURAL_LAYER', 'THREAT_DETECTION', 'ENCRYPTION', 'API_GATEWAY', 'DATA_LAKE'].map(label => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{label}</span>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>OPERATIONAL</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3D GLOBE */}
        {activePage === 'globe' && (
          <div style={{ height: 'calc(100vh - 200px)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(14, 165, 233, 0.3)', background: '#000' }}>
            <Suspense fallback={<Loading />}>
              <GlobeLayer 
                dim={{ w: window.innerWidth - 344, h: window.innerHeight - 200 }}
                countries={{ features: [] }}
                arcs={arcs}
                rings={rings}
                mapPoints={mapPoints}
                liveMode={true}
                activeDomain="CYBER"
                activeLayers={["military"]}
              />
            </Suspense>
          </div>
        )}

        {/* INTEL STREAM */}
        {activePage === 'data' && (
          <>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter intelligence query..."
                style={{ flex: 1, background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '8px', padding: '12px 16px', color: 'white', fontFamily: 'monospace', outline: 'none' }}
              />
              <button 
                onClick={runIntelligenceScan}
                disabled={isScanning || !query.trim()}
                style={{ background: isScanning ? 'rgba(14, 165, 233, 0.3)' : 'rgba(14, 165, 233, 0.2)', border: '1px solid rgba(14, 165, 233, 0.4)', borderRadius: '8px', padding: '12px 24px', color: '#0ea5e9', fontWeight: 900, cursor: isScanning ? 'not-allowed' : 'pointer' }}
              >
                {isScanning ? 'SCANNING...' : 'EXECUTE'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {intelligence.length === 0 ? (
                <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '48px', color: '#64748b' }}>
                  <GlobeIcon size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                  <div>Execute intelligence query to begin data collection</div>
                </div>
              ) : intelligence.map(item => (
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
              ))}
            </div>
          </>
        )}

        {/* PREDICTIVE AI */}
        {activePage === 'l2' && (
          <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>L2 FORECAST ENGINE</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <MetricCard label="THREAT_PROBABILITY" value="23.4%" />
              <MetricCard label="ANOMALY_RISK" value="LOW" />
              <MetricCard label="CONFIDENCE" value="94.7%" />
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>7-DAY THREAT FORECAST</div>
            <div style={{ height: '200px', background: 'rgba(1, 2, 8, 0.6)', borderRadius: '8px', padding: '16px', marginTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%' }}>
                {[65, 45, 78, 52, 89, 34, 67].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: i > 4 ? '#0ea5e9' : 'rgba(14, 165, 233, 0.3)', height: `${h}%`, borderRadius: '4px 4px 0 0' }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SATELLITE NETWORK */}
        {activePage === 'sat' && (
          <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>LEO SATELLITE NETWORK</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {['SAT-001', 'SAT-002', 'SAT-003', 'SAT-004', 'SAT-005', 'SAT-006', 'SAT-007', 'SAT-008'].map(id => (
                <div key={id} style={{ background: 'rgba(1, 2, 8, 0.6)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                  <Satellite size={24} color="#0ea5e9" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '11px', color: 'white', fontWeight: 900 }}>{id}</div>
                  <div style={{ fontSize: '9px', color: '#10b981' }}>OPERATIONAL</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OSINT GATE */}
        {activePage === 'osint' && (
          <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>OSINT TOOLS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {['WHOIS', 'DNS_SCAN', 'SSL_CERT', 'PORT_SCAN', 'SUBDOMAINS', 'CRAWL', 'WEB_ANALYTICS', 'SOCIAL_LOOKUP', 'EMAIL_VERIFY', 'IP_GEOLOC', 'REVERSE_DNS', 'HTTP_HEADERS'].map(tool => (
                <button key={tool} style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.3)', borderRadius: '8px', padding: '20px', color: '#0ea5e9', fontSize: '10px', fontWeight: 900, cursor: 'pointer' }}>
                  {tool}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function StatPill({ label, value, color }) {
  return (
    <div style={{ background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '24px', padding: '8px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
      <span style={{ fontSize: '10px', color: '#64748b', letterSpacing: '1px' }}>{label}:</span>
      <span style={{ fontSize: '12px', fontWeight: 900, color }}>{value}</span>
    </div>
  )
}

function MetricCard({ label, value }) {
  return (
    <div style={{ background: 'rgba(1, 2, 8, 0.6)', borderRadius: '8px', padding: '20px' }}>
      <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>{value}</div>
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