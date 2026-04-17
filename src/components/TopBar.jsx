import React from 'react';
import { Menu, Zap, Globe, Clock, ShieldCheck } from 'lucide-react';

export function TopBar({ toggleSidebar, activePage, activeDomain, setActiveDomain }) {
  const titles = {
    'dash': 'Command Center Overview',
    'data': 'Live Telemetry & Signals',
    'l2': 'Predictive OSINT Engine',
    'archives': 'Historical Anomalies',
    'settings': 'System Configurations'
  };

  const domainColors = {
    'CYBER': '#3b82f6',
    'FINANCE': '#fbbf24',
    'GEOINT': '#34d399'
  };

  return (
    <div className="top-bar" style={{
      padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'rgba(2, 4, 10, 0.7)', backdropFilter: 'blur(40px) saturate(180%)', position: 'sticky', top: 0, zIndex: 1001,
      borderBottom: '1px solid var(--glass-border)', boxShadow: '0 15px 50px rgba(0,0,0,0.6)'
    }}>
      <div className="top-left" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <button className="nav-icon-btn" onClick={toggleSidebar}>
           <Menu size={20} />
        </button>
        
        <div style={{ height: '32px', width: '1px', background: 'var(--glass-border)' }}></div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
           <h1 style={{ fontFamily: 'var(--heading-font)', fontSize: '20px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'white', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
             <Globe size={20} color="var(--domain-primary)" />
             AI SOC SENTINEL
           </h1>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
             <span style={{ fontSize: '9px', color: 'var(--domain-primary)', fontWeight: 800, letterSpacing: '2px', opacity: 0.9 }}>
               SEC-OPS V2.11 // CORE_MODULE: STABLE
             </span>
             <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--glass-border)' }}></div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#64748b', fontWeight: 700 }}>
               <Clock size={10} />
               {new Date().toLocaleTimeString()} UTC
             </div>
           </div>
        </div>
      </div>
      
      <div className="top-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
         <div style={{ display: 'flex', gap: '8px' }}>
            {['CYBER', 'FINANCE', 'GEOINT'].map(domain => (
              <button 
                key={domain}
                onClick={() => setActiveDomain(domain)}
                style={{ 
                  background: activeDomain === domain ? 'var(--domain-glow)' : 'transparent',
                  border: `1px solid ${activeDomain === domain ? 'var(--domain-primary)' : 'var(--glass-border)'}`,
                  color: activeDomain === domain ? 'white' : '#64748b',
                  fontSize: '9px', fontWeight: 900, padding: '6px 12px', borderRadius: '6px', cursor: 'pointer',
                  transition: 'var(--transition-smooth)', letterSpacing: '1px'
                }}
              >
                {domain}
              </button>
            ))}
         </div>
         
         <div style={{ height: '30px', width: '1px', background: 'var(--glass-border)' }}></div>

         <div style={{ 
           display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', 
           background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', 
           borderRadius: '12px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.05)'
         }}>
            <ShieldCheck size={16} color="#10b981" />
            <span style={{ fontSize: '10px', fontWeight: 900, color: 'white', letterSpacing: '1.5px' }}>THREAT DETECTION ACTIVE</span>
         </div>
      </div>
    </div>
  );
}
