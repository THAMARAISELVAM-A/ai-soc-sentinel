import React from 'react';
import { Target, ShieldAlert, Cpu, Activity, Database, Settings, Terminal } from 'lucide-react';

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
      <div className="logo" style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border)' }}>
        <Activity color="var(--domain-primary)" size={28} />
        <span style={{ fontFamily: 'var(--heading-font)', fontSize: '18px', fontWeight: 900, letterSpacing: '1px', color: 'var(--domain-primary)', textTransform: 'uppercase' }}>SENTINEL_AI</span>
      </div>
      
      <div className="nav-group" style={{ padding: '12px', flexGrow: 1, overflowY: 'auto' }}>
        {navItems.map(item => (
          <div 
            key={item.id}
            onClick={() => setActivePage(item.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '11px', padding: '13px 16px', margin: '3px 0',
              borderRadius: '8px', cursor: 'pointer', color: activePage === item.id ? 'var(--domain-primary)' : '#888884',
              background: activePage === item.id ? 'var(--domain-glow)' : 'transparent',
              borderLeft: `3px solid ${activePage === item.id ? 'var(--domain-primary)' : 'transparent'}`,
              fontSize: '14px', fontWeight: 500, transition: '0.2s', userSelect: 'none'
            }}
          >
            <span className="ico">{item.icon}</span> {item.label}
          </div>
        ))}
      </div>
    </nav>
  );
}
