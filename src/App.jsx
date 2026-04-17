import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState, Suspense, lazy, useMemo, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Activity, Database, Cpu, ShieldAlert, Terminal, ShieldCheck, Target, Globe as GlobeIcon, Satellite, Zap, AlertTriangle, CheckCircle, RefreshCw, TrendingUp, DollarSign, Globe, Newspaper, Radio, Wifi, Server, Cloud, Bomb, Anchor } from 'lucide-react'
import './App.css'

const SplashGate = lazy(() => import('./components/Core/SplashGate').then(m => ({ default: m.SplashGate || m })))
const GlobeLayer = lazy(() => import('./components/Core/GlobeLayer').then(m => ({ default: m.GlobeLayer || m })))

function Loading() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#010208', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9', fontFamily: 'monospace' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '14px', marginBottom: '16px' }}>INITIALIZING SENTINAL-ARM</div>
        <RefreshCw className="spin" size={24} />
      </div>
    </div>
  )
}

function Dashboard({ activePage, setActivePage }) {
  // Live data states
  const [threatCount, setThreatCount] = useState(156)
  const [activeNodes, setActiveNodes] = useState(24)
  const [uptime] = useState(99.97)
  
  const [intelligence, setIntelligence] = useState([])
  const [query, setQuery] = useState('')
  const [isScanning, setIsScanning] = useState(false)

  const [news, setNews] = useState([
    { id: 1, category: 'CYBER', title: 'Critical vulnerability discovered in major framework', time: '2 min ago', severity: 'critical' },
    { id: 2, category: 'MILITARY', title: 'Naval exercises in South China Sea', time: '15 min ago', severity: 'high' },
    { id: 3, category: 'ECONOMIC', title: 'Global markets react to new tariffs', time: '32 min ago', severity: 'medium' },
    { id: 4, category: 'INFRASTRUCTURE', title: 'Undersea cable disruption detected', time: '45 min ago', severity: 'high' },
    { id: 5, category: 'CLIMATE', title: 'Major hurricane approaching Caribbean', time: '1 hr ago', severity: 'critical' },
  ])

  const [countryRisk, setCountryRisk] = useState([
    { country: 'Russia', risk: 87, category: 'MILITARY' },
    { country: 'China', risk: 82, category: 'CYBER' },
    { country: 'North Korea', risk: 78, category: 'NUCLEAR' },
    { country: 'Iran', risk: 74, category: 'NUCLEAR' },
    { country: 'USA', risk: 23, category: 'INTERNAL' },
  ])

  const [markets, setMarkets] = useState([
    { name: 'S&P 500', value: '4,892.34', change: '+1.24%', up: true },
    { name: 'NASDAQ', value: '15,628.90', change: '+2.15%', up: true },
    { name: 'CRUDE OIL', value: '$78.42', change: '-0.82%', up: false },
    { name: 'GOLD', value: '$2,034.18', change: '+0.45%', up: true },
    { name: 'BITCOIN', value: '$42,891.00', change: '+3.21%', up: true },
  ])

  const [flightData, setFlightData] = useState([
    { callsign: 'AF123', from: 'JFK', to: 'LHR', lat: 51.4, lng: -0.5 },
    { callsign: 'UA456', from: 'LAX', to: 'NRT', lat: 35.6, lng: 139.6 },
    { callsign: 'BA789', from: 'HKG', to: 'DXB', lat: 25.2, lng: 55.3 },
  ])

  // Arc and ring data for globe
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

  // Navigation items
  const navItems = [
    { id: 'dash', label: 'TACTICAL_HUD', icon: <Target size={16} /> },
    { id: 'globe', label: 'GLOBAL_VIEW', icon: <GlobeIcon size={16} /> },
    { id: 'news', label: 'INTELLIGENCE', icon: <Newspaper size={16} /> },
    { id: 'risk', label: 'RISK_INDEX', icon: <AlertTriangle size={16} /> },
    { id: 'finance', label: 'FINANCE_RADAR', icon: <DollarSign size={16} /> },
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
      <nav style={{ width: '280px', height: '100%', background: 'rgba(1, 2, 8, 0.98)', borderRight: '1px solid rgba(14, 165, 233, 0.2)', display: 'flex', flexDirection: 'column', padding: '32px 16px', position: 'fixed', left: 0, top: 0, zIndex: 100, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 16px 32px' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.2)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>
            <Activity color="#0ea5e9" size={20} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'white' }}>SENTINAL-ARM</div>
            <div style={{ fontSize: '8px', color: '#0ea5e9', fontWeight: 900, letterSpacing: '1px' }}>MIL_INTEL_V3.0</div>
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
          <div style={{ fontSize: '9px', color: '#64748b', marginTop: '8px' }}>SIGNALS: {threatCount} active</div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '32px', overflow: 'auto', height: '100vh' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px' }}>
              SENTINAL-ARM // {navItems.find(n => n.id === activePage)?.label}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'white' }}>
              {activePage === 'dash' && 'TACTICAL OVERVIEW'}
              {activePage === 'globe' && 'GLOBAL INTELLIGENCE'}
              {activePage === 'news' && 'INTELLIGENCE FEEDS'}
              {activePage === 'risk' && 'COUNTRY RISK INDEX'}
              {activePage === 'finance' && 'FINANCE RADAR'}
              {activePage === 'sat' && 'SATELLITE NETWORK'}
              {activePage === 'osint' && 'OSINT GATE'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <StatPill label="SIGNALS" value={threatCount} color="#ef4444" />
            <StatPill label="NODES" value={activeNodes} color="#0ea5e9" />
            <StatPill label="UPTIME" value={`${uptime}%`} color="#10b981" />
          </div>
        </div>

        {/* TACTICAL HUD */}
        {activePage === 'dash' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>LIVE THREAT LOG</div>
              {news.slice(0, 5).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', width: '60px' }}>{item.time}</div>
                  <div style={{ width: '80px', fontSize: '9px', fontWeight: 900, color: item.severity === 'critical' ? '#ef4444' : item.severity === 'high' ? '#f97316' : '#10b981', textTransform: 'uppercase' }}>{item.severity}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', flex: 1 }}>{item.title}</div>
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

        {/* INTELLIGENCE FEEDS */}
        {activePage === 'news' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {['CYBER', 'MILITARY', 'ECONOMIC', 'INFRASTRUCTURE', 'CLIMATE', 'GEOPOLITICAL'].map(cat => (
              <div key={cat} style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#0ea5e9', marginBottom: '12px' }}>{cat}</div>
                {news.filter(n => n.category === cat || cat === 'CYBER').slice(0, 3).map((item, i) => (
                  <div key={i} style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {item.title}
                    <div style={{ fontSize: '9px', color: '#64748b', marginTop: '4px' }}>{item.time}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* RISK INDEX */}
        {activePage === 'risk' && (
          <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '24px' }}>COUNTRY INTELLIGENCE INDEX</div>
            {countryRisk.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '100px', fontSize: '14px', fontWeight: 900, color: 'white' }}>{item.country}</div>
                <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${item.risk}%`, height: '100%', background: item.risk > 70 ? '#ef4444' : item.risk > 50 ? '#f97316' : '#10b981', borderRadius: '4px' }} />
                </div>
                <div style={{ width: '60px', fontSize: '14px', fontWeight: 900, color: item.risk > 70 ? '#ef4444' : item.risk > 50 ? '#f97316' : '#10b981' }}>{item.risk}%</div>
                <div style={{ width: '80px', fontSize: '10px', color: '#64748b' }}>{item.category}</div>
              </div>
            ))}
          </div>
        )}

        {/* FINANCE RADAR */}
        {activePage === 'finance' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>MARKET COMPOSITE</div>
              {markets.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.name}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: 'white' }}>{item.value}</div>
                    <div style={{ fontSize: '10px', color: item.up ? '#10b981' : '#ef4444' }}>{item.change}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>CRYPTO SIGNALS</div>
              {[
                { name: 'BTC', price: '$42,891', change: '+3.21%', up: true },
                { name: 'ETH', price: '$2,284', change: '+2.14%', up: true },
                { name: 'SOL', price: '$98.42', change: '+5.67%', up: true },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{item.name}</span>
                  <span style={{ fontSize: '12px', color: item.up ? '#10b981' : '#ef4444' }}>{item.change}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SATELLITE NETWORK */}
        {activePage === 'sat' && (
          <div style={{ background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)', borderRadius: '8px', padding: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>LEO SATELLITE NETWORK</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {['SAT-001', 'SAT-002', 'SAT-003', 'SAT-004', 'SAT-005', 'SAT-006', 'SAT-007', 'SAT-008'].map(id => (
                <div key={id} style={{ background: 'rgba(1, 2, 8, 0.6)', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                  <Satellite size={24} color="#0ea5e9" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '11px', color: 'white', fontWeight: 900 }}>{id}</div>
                  <div style={{ fontSize: '9px', color: '#10b981' }}>OPERATIONAL</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>ACTIVE FLIGHTS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {flightData.map((flight, i) => (
                <div key={i} style={{ background: 'rgba(1, 2, 8, 0.6)', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: '#0ea5e9' }}>{flight.callsign}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{flight.from} → {flight.to}</div>
                  <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>LIVE TRACKING</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OSINT GATE */}
        {activePage === 'osint' && (
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
          </>
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