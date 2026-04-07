import React from 'react';
import { Menu, Activity, Shield } from 'lucide-react';

export function TopBar({ toggleSidebar, activePage, activeDomain, setActiveDomain }) {
  const titles = {
    'dash': 'Command Center Overview',
    'data': 'Live Telemetry & Signals',
    'l2': 'Predictive OSINT Engine',
    'archives': 'Historical Anomalies',
    'settings': 'System Configurations'
  };

  return (
    <div className="top-bar" style={{
      padding: '22px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'rgba(1, 2, 4, 0.92)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 90,
      borderBottom: '1px solid var(--glass-border)'
    }}>
      <div className="page-title" style={{ fontFamily: 'var(--heading-font)', fontSize: '26px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button type="button" onClick={toggleSidebar} style={{ background: 'transparent', border: 'none', color: 'var(--domain-primary)', cursor: 'pointer' }}>
          <Menu size={24} />
        </button>
        <span>{titles[activePage] || 'Dashboard'}</span>
      </div>
      
      <div className="top-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--glass-bg)', border: '1px solid var(--domain-primary)', borderRadius: '6px' }}>
           <span style={{ color: 'var(--domain-primary)' }}>
             {activeDomain === 'CYBER' ? <Shield size={16} /> : <Activity size={16} />}
           </span>
           <select 
             value={activeDomain} 
             onChange={(e) => setActiveDomain(e.target.value)}
             style={{ 
               background: 'transparent', border: 'none', color: 'white', 
               fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em', 
               textTransform: 'uppercase', outline: 'none', cursor: 'pointer',
               appearance: 'none', paddingRight: '12px'
             }}
           >
             <option value="CYBER">CYBER DOMAIN</option>
             <option value="FINANCE">FINANCE DOMAIN</option>
             <option value="GEOINT">GEOINT DOMAIN</option>
           </select>
        </div>
      </div>
    </div>
  );
}
