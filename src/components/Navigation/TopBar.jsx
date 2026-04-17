import React, { useState, useEffect } from 'react';
import { Menu, Shield, ShieldCheck, Clock, Settings, Bell, Database, LayoutPanelTop, Eye, Activity } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useSentinelStore } from '../../store/sentinelStore';
import { SettingsOverlay } from '../Modals/SettingsOverlay';
import { CloudSetupModal } from '../Modals/CloudSetupModal';

/**
 * TopBar - SENTINEL-ARM Mission Command Header.
 * Rebranded for Military-Grade Situational Awareness.
 */
export function TopBar({ toggleSidebar, activePage: _activePage }) {
  const { activeDomain, setActiveDomain, proxyStatus, panels, togglePanel } = useSentinelStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showCloudSetup, setShowCloudSetup] = useState(false);
  const [showRestorePanel, setShowRestorePanel] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isCloudConnected = proxyStatus === 'CONNECTED';
  const hiddenPanels = Object.entries(panels).filter(([, visible]) => !visible);

  return (
    <>
      <div className="top-bar glass-panel" style={{
        margin: '24px 32px 0', padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: '24px', zIndex: 10001, borderRadius: '12px',
        background: 'rgba(2, 6, 23, 0.4)', backdropFilter: 'blur(32px)'
      }}>
        <div className="top-left" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <button className="btn-console" onClick={toggleSidebar} style={{ padding: '10px' }} title="Toggle Master Sidebar">
             <Menu size={18} />
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Shield size={18} color="var(--domain-primary)" />
                <h1 style={{ fontFamily: 'var(--body-font)', fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', color: 'white', margin: 0 }}>
                  SENTINEL-ARM_<span style={{ color: 'var(--domain-primary)' }}>MOBILE</span>
                </h1>
             </div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
               <span style={{ fontSize: '9px', color: 'var(--domain-primary)', fontWeight: 900, letterSpacing: '1px', fontFamily: 'var(--mono-font)', opacity: 0.8 }}>
                 MIL_GRADE // STRAT_OVERSIGHT
               </span>
             </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          {['CYBER', 'FINANCE', 'GEOINT'].map(domain => (
            <button 
              key={domain}
              onClick={() => setActiveDomain(domain)}
              style={{ 
                background: activeDomain === domain ? 'var(--domain-glow)' : 'transparent',
                border: activeDomain === domain ? '1px solid var(--domain-border)' : '1px solid transparent',
                color: activeDomain === domain ? 'white' : '#64748b',
                fontSize: '10px', fontWeight: 900, padding: '8px 20px', borderRadius: '6px', cursor: 'pointer',
                transition: '0.2s', letterSpacing: '1px', fontFamily: 'var(--mono-font)'
              }}
              title={`Switch Sector: ${domain}`}
            >
              {domain}
            </button>
          ))}
        </div>

        <div className="top-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
           {/* Restoration Dock */}
           <div style={{ position: 'relative' }}>
              <button 
                className={`btn-console ${hiddenPanels.length > 0 ? 'scanning' : ''}`}
                onClick={() => setShowRestorePanel(!showRestorePanel)}
                style={{ padding: '10px', position: 'relative' }}
                title="HUD Panel Restoration"
              >
                <LayoutPanelTop size={18} color={hiddenPanels.length > 0 ? 'var(--domain-primary)' : '#64748b'} />
                {hiddenPanels.length > 0 && (
                  <span style={{ position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: 'var(--alert-red)', color: 'white', fontSize: '8px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {hiddenPanels.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showRestorePanel && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', width: '200px', background: 'rgba(1,2,8,0.95)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '12px', backdropFilter: 'blur(32px)', zIndex: 10002 }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--domain-primary)', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', letterSpacing: '1px' }}>
                      MINIMIZED_HUD_MODULES
                    </div>
                    {hiddenPanels.length === 0 ? (
                      <div style={{ fontSize: '9px', color: '#64748b', opacity: 0.5 }}>ACTIVE_SITUATIONAL_FULL</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {hiddenPanels.map(([id]) => (
                          <button 
                            key={id} onClick={() => togglePanel(id)}
                            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '4px', padding: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s' }}
                          >
                             <Eye size={12} color="var(--domain-primary)" />
                             <span style={{ fontSize: '9px', fontWeight: 900, color: 'white', textTransform: 'uppercase' }}>RESTORE_{id}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingRight: '24px', borderRight: '1px solid var(--glass-border)' }}>
              <Clock size={14} color="#64748b" />
              <div style={{ fontFamily: 'var(--mono-font)', fontSize: '12px', fontWeight: 800, color: 'white', letterSpacing: '1px' }}>
                {time.toLocaleTimeString('en-US', { hour12: false })} <span style={{ opacity: 0.4, fontSize: '9px' }}>UTC</span>
              </div>
           </div>

           <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-console" style={{ padding: '10px' }} title="Emergency Alerts"><Bell size={18} /></button>
              <button className="btn-console" style={{ padding: '10px' }} onClick={() => setShowSettings(true)} title="System Settings"><Settings size={18} /></button>
           </div>
           
           <motion.div 
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowCloudSetup(true)}
              style={{ 
                padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                background: isCloudConnected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', 
                border: `1px solid ${isCloudConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                display: 'flex', alignItems: 'center', gap: '12px'
              }}
              title="Global Defense Network Status"
           >
              {isCloudConnected ? <ShieldCheck size={14} color="#10b981" /> : <Database size={14} color="var(--alert-red)" className="scanning" />}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '9px', fontWeight: 900, color: isCloudConnected ? '#10b981' : 'var(--alert-red)', letterSpacing: '1px' }}>
                  {isCloudConnected ? 'SYS_SECURE' : 'CLOUD_REQD'}
                </span>
                <span style={{ fontSize: '7px', color: '#64748b', fontWeight: 800 }}>{isCloudConnected ? 'UPLINK_LIVE' : 'AIR_GAPPED'}</span>
              </div>
           </motion.div>
        </div>
      </div>

      <SettingsOverlay showSettings={showSettings} setShowSettings={setShowSettings} />
      <CloudSetupModal isOpen={showCloudSetup} onClose={() => setShowCloudSetup(false)} />
    </>
  );
}
