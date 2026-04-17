import React from 'react';
import { LayoutDashboard, Database, Activity, Archive, Terminal } from 'lucide-react';

/**
 * MobileNav - Tactical Situational Switcher for small screens.
 * Provides instant access to core mission modules when real estate is limited.
 */
export function MobileNav({ activePage, setActivePage }) {
  const tabs = [
    { id: 'dash', label: 'MAP', icon: LayoutDashboard },
    { id: 'data', label: 'LOGS', icon: Database },
    { id: 'l2', label: 'PREDICT', icon: Activity },
    { id: 'ingest', label: 'INTEL', icon: Terminal },
    { id: 'archives', label: 'DATA', icon: Archive },
  ];

  return (
    <div className="glass-panel" style={{
      position: 'fixed', bottom: '16px', left: '16px', right: '16px',
      height: '64px', display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 10002, borderRadius: '12px', padding: '0 8px',
      background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(32px)'
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activePage === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActivePage(tab.id)}
            style={{
              background: 'transparent', border: 'none', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              padding: '8px', cursor: 'pointer', flex: 1
            }}
          >
            <div style={{
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Icon size={20} color={isActive ? 'var(--domain-primary)' : '#64748b'} />
              {isActive && (
                <motion.div 
                  layoutId="mobile-active-tab"
                  style={{
                    position: 'absolute', width: '32px', height: '32px',
                    borderRadius: '50%', background: 'var(--domain-glow)',
                    zIndex: -1
                  }}
                />
              )}
            </div>
            <span style={{ 
              fontSize: '8px', fontWeight: 900, 
              color: isActive ? 'white' : '#64748b',
              letterSpacing: '1px', fontFamily: 'var(--mono-font)'
            }}>
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
