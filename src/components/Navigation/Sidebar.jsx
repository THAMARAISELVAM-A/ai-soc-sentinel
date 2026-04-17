import React from 'react';
import { Target, ShieldAlert, Cpu, Activity, Database, Terminal, ShieldCheck } from 'lucide-react';

/**
 * Sidebar - Master Class Navigation Suite.
 */
export function Sidebar({ activePage, setActivePage, isSidebarOpen }) {
  const navItems = [
    { id: 'dash', label: 'TACTICAL_HUD', icon: <Target size={16} />, tip: 'Central Intelligence Overview' },
    { id: 'data', label: 'INTEL_STREAM', icon: <Database size={16} />, tip: 'Real-time Signal Analysis' },
    { id: 'ingest', label: 'MOUNT_LOGS', icon: <Terminal size={16} />, tip: 'Manual Telemetry Ingestion' },
    { id: 'l2', label: 'PREDICTIVE_AI', icon: <Cpu size={16} />, tip: 'Threat Forecasting Engine' },
    { id: 'archives', label: 'MISSION_HISTORY', icon: <ShieldCheck size={16} />, tip: 'Threat Record Archives' },
    { id: 'osint', label: 'OSINT_GATE', icon: <ShieldAlert size={16} />, tip: 'External Intelligence Gateway' },
  ];

  return (
    <nav className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`} style={{
      width: isSidebarOpen ? '280px' : '80px', height: '100%', background: 'rgba(1, 2, 8, 0.98)',
      backdropFilter: 'blur(32px)', borderRight: '1px solid var(--glass-border)',
      display: 'flex', flexDirection: 'column', zIndex: 10002, transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      overflow: 'hidden'
    }}>
      {/* ── LOGO SECTION ── */}
      <div className="logo-section" style={{ padding: '32px 24px', position: 'relative' }}>
        <motion.div 
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div style={{ 
            background: 'var(--domain-glow)', padding: '12px', borderRadius: '8px',
            border: '1px solid var(--domain-border)', boxShadow: '0 0 30px var(--domain-glow)'
          }}>
            <Activity color="var(--domain-primary)" size={20} />
          </div>
          {isSidebarOpen && (
            <div>
              <div style={{ fontFamily: 'var(--body-font)', fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', color: 'white' }}>SENTINEL-ARM</div>
              <div style={{ fontSize: '8px', color: 'var(--domain-primary)', fontWeight: 900, letterSpacing: '1px', opacity: 0.8, fontFamily: 'var(--mono-font)' }}>MIL_INTEL_V1.0</div>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* ── NAVIGATION ── */}
      <div className="nav-items" style={{ padding: '20px 16px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ padding: '0 16px 12px', fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '2px' }}>MISSION_NAVIGATION</div>
        {navItems.map(item => (
          <div 
            key={item.id}
            onClick={() => setActivePage(item.id)}
            title={item.tip}
            style={{
              display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
              borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activePage === item.id ? 'var(--domain-glow)' : 'transparent',
              border: '1px solid',
              borderColor: activePage === item.id ? 'var(--glass-border)' : 'transparent'
            }}
          >
            <span style={{ 
               color: activePage === item.id ? 'var(--domain-primary)' : '#64748b',
               transition: '0.2s'
            }}>
              {item.icon}
            </span> 
            <span style={{ 
              fontSize: '11px', fontWeight: activePage === item.id ? 900 : 700,
              fontFamily: 'var(--mono-font)', letterSpacing: '1px',
              color: activePage === item.id ? 'white' : '#64748b'
            }}>
              {item.label}
            </span>
            {activePage === item.id && (
               <motion.div layoutId="nav-glow" style={{ position: 'absolute', right: '8px', width: '4px', height: '16px', borderRadius: '2px', background: 'var(--domain-primary)', boxShadow: '0 0 10px var(--domain-primary)' }} />
            )}
          </div>
        ))}
      </div>

      {/* ── SYSTEM STATUS ── */}
      <div style={{ padding: '32px', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div className="scanning" style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 15px #10b981' }}></div>
          <span style={{ fontSize: '10px', fontWeight: 900, color: '#10b981', letterSpacing: '2px', fontFamily: 'var(--mono-font)' }}>UPLINK_STABLE</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#64748b', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>
              <span>SYNC_LATENCY</span>
              <span>0.02MS</span>
           </div>
           <div style={{ height: '2px', background: 'rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' }}>
             <motion.div 
               animate={{ width: ['20%', '95%', '20%'] }}
               transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
               style={{ height: '100%', background: 'var(--domain-primary)', boxShadow: '0 0 10px var(--domain-primary)' }} 
             />
           </div>
        </div>
      </div>
    </nav>
  );
}
