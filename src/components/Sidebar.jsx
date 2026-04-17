import React from 'react';
import { Target, ShieldAlert, Cpu, Activity, Database, Settings, Terminal, Zap } from 'lucide-react';

export function Sidebar({ activePage, setActivePage, isSidebarOpen }) {
  const navItems = [
    { id: 'dash', label: 'Command Center', icon: <Target size={18} /> },
    { id: 'data', label: 'Live Data Lake', icon: <Database size={18} /> },
    { id: 'ingest', label: 'Telemetry Ingest', icon: <Terminal size={18} /> },
    { id: 'l2', label: 'L2 Forecaster', icon: <Cpu size={18} /> },
    { id: 'archives', label: 'Threat Archives', icon: <ShieldAlert size={18} /> },
    { id: 'osint', label: 'OSINT Parsing', icon: <Database size={18} /> },
    { id: 'settings', label: 'Configuration', icon: <Settings size={18} /> },
  ];

  return (
    <nav className={`sidebar ${isSidebarOpen ? 'open' : 'collapsed'}`}>
      <div className="logo" style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--glass-border)' }}>
        <div className="logo-icon-wrap" style={{ 
          background: 'var(--domain-glow)', 
          padding: '8px', 
          borderRadius: '12px', 
          boxShadow: '0 0 20px var(--domain-glow)'
        }}>
          <Activity color="var(--domain-primary)" size={24} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: 'var(--heading-font)', fontSize: '16px', fontWeight: 900, letterSpacing: '2px', color: 'white', textTransform: 'uppercase' }}>SENTINEL</span>
          <span style={{ fontSize: '9px', color: 'var(--domain-primary)', fontWeight: 800, letterSpacing: '1px' }}>AUTONOMOUS SIEM</span>
        </div>
      </div>
      
      <div className="nav-group" style={{ padding: '20px 12px', flexGrow: 1, overflowY: 'auto' }}>
        {navItems.map(item => (
          <div 
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className="nav-item"
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', margin: '4px 0',
              borderRadius: '12px', cursor: 'pointer', 
              color: activePage === item.id ? 'white' : '#94a3b8',
              background: activePage === item.id ? 'var(--domain-glow)' : 'transparent',
              border: `1px solid ${activePage === item.id ? 'var(--glass-border)' : 'transparent'}`,
              fontSize: '13px', fontWeight: 600, transition: 'var(--transition-smooth)', userSelect: 'none',
              position: 'relative', overflow: 'hidden'
            }}
          >
            {activePage === item.id && (
              <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '3px', background: 'var(--domain-primary)', borderRadius: '0 4px 4px 0' }} />
            )}
            <span style={{ 
              color: activePage === item.id ? 'var(--domain-primary)' : 'inherit',
              transition: 'all 0.3s ease'
            }}>{item.icon}</span> 
            {item.label}
          </div>
        ))}
      </div>

      {/* SYSTEM STATUS FOOTER */}
      <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
          <Zap size={14} color="#10b981" />
          SYSTEM UPLINK ACTIVE
        </div>
        <div style={{ marginTop: '8px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', boxShadow: '0 0 10px #10b981' }} />
        </div>
      </div>
    </nav>
  );
}
