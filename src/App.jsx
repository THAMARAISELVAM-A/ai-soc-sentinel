import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { useState, Suspense, lazy } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Activity, Database, Cpu, ShieldAlert, Terminal, ShieldCheck, Target } from 'lucide-react'
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
  const navItems = [
    { id: 'dash', label: 'TACTICAL_HUD', icon: <Target size={16} /> },
    { id: 'data', label: 'INTEL_STREAM', icon: <Database size={16} /> },
    { id: 'ingest', label: 'MOUNT_LOGS', icon: <Terminal size={16} /> },
    { id: 'l2', label: 'PREDICTIVE_AI', icon: <Cpu size={16} /> },
    { id: 'archives', label: 'MISSION_HISTORY', icon: <ShieldCheck size={16} /> },
    { id: 'osint', label: 'OSINT_GATE', icon: <ShieldAlert size={16} /> },
  ]

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
        <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#0ea5e9', letterSpacing: '2px', marginBottom: '8px' }}>
          SENTINEL-ARM // {navItems.find(n => n.id === activePage)?.label}
        </div>
        <div style={{ fontSize: '32px', fontWeight: 900, color: 'white', marginBottom: '32px' }}>
          {activePage === 'dash' && 'TACTICAL OVERVIEW'}
          {activePage === 'data' && 'INTEL STREAM'}
          {activePage === 'ingest' && 'MOUNT LOGS'}
          {activePage === 'l2' && 'PREDICTIVE AI'}
          {activePage === 'archives' && 'MISSION HISTORY'}
          {activePage === 'osint' && 'OSINT GATE'}
        </div>

        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' 
        }}>
          {['THREATS DETECTED', 'ACTIVE NODES', 'UPTIME'].map((label, i) => (
            <div key={i} style={{ 
              background: 'rgba(14, 165, 233, 0.1)', border: '1px solid rgba(14, 165, 233, 0.2)',
              borderRadius: '8px', padding: '24px'
            }}>
              <div style={{ fontSize: '10px', color: '#64748b', letterSpacing: '2px', marginBottom: '8px' }}>{label}</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: 'white' }}>{[47, 12, '99.9%'][i]}</div>
            </div>
          ))}
        </div>

        <div style={{ 
          background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.2)',
          borderRadius: '8px', padding: '24px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 900, color: 'white', marginBottom: '16px' }}>SYSTEM STATUS</div>
          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>NEURAL_LAYER</span><span style={{ color: '#10b981' }}>OPERATIONAL</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>THREAT_DETECTION</span><span style={{ color: '#10b981' }}>ACTIVE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
              <span>ENCRYPTION</span><span style={{ color: '#10b981' }}>AES-256</span>
            </div>
          </div>
        </div>
      </main>
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