import React from "react";
import { X, Shield, Cpu, Key, Activity, Zap, Server, Globe, Sliders } from "lucide-react";
import { useSentinelStore } from "../../store/sentinelStore";

/**
 * SettingsOverlay - Master Class Command & Control Hub.
 */
export function SettingsOverlay({ showSettings, setShowSettings }) {
  const { 
    simulationMode, setSimulationMode, 
    liveSpeed, setLiveSpeed, 
    apiKey, setApiKey, 
    threatFoxKey, setThreatFoxKey, 
    otxKey, setOtxKey 
  } = useSentinelStore();

  if (!showSettings) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(1, 2, 8, 0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowSettings(false)}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-panel" 
          style={{
            width: '540px', padding: '40px', zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '32px',
            background: 'var(--soc-bg)', border: '1px solid var(--domain-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
             <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
               <Sliders size={20} color="var(--domain-primary)" /> OPERATIONAL_CONFIG
             </h3>
             <button onClick={() => setShowSettings(false)} className="btn-console" style={{ padding: '8px' }}><X size={18} /></button>
          </div>

          <div className="custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '12px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
            
            {/* ── OPERATION MODE ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div className="panel-label" style={{ marginBottom: '8px' }}>CORE_MISSION_PROTOCOL</div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button 
                    onClick={() => setSimulationMode(true)} 
                    style={{ 
                      padding: '16px', borderRadius: '8px', cursor: 'pointer', transition: '0.3s',
                      background: simulationMode ? 'var(--domain-glow)' : 'rgba(255,255,255,0.02)', 
                      border: simulationMode ? '1px solid var(--domain-primary)' : '1px solid rgba(255,255,255,0.05)', 
                      color: simulationMode ? 'white' : '#64748b', fontSize: '11px', fontWeight: 900, fontFamily: 'var(--mono-font)', letterSpacing: '1px'
                    }}>
                    <Zap size={14} style={{ marginBottom: '8px', display: 'block' }} /> SIMULATION_MODE
                  </button>
                  <button 
                    onClick={() => setSimulationMode(false)} 
                    style={{ 
                      padding: '16px', borderRadius: '8px', cursor: 'pointer', transition: '0.3s',
                      background: !simulationMode ? 'var(--domain-glow)' : 'rgba(255,255,255,0.02)', 
                      border: !simulationMode ? '1px solid var(--domain-primary)' : '1px solid rgba(255,255,255,0.05)', 
                      color: !simulationMode ? 'white' : '#64748b', fontSize: '11px', fontWeight: 900, fontFamily: 'var(--mono-font)', letterSpacing: '1px'
                    }}>
                    <Activity size={14} style={{ marginBottom: '8px', display: 'block' }} /> REAL_TIME_HANDSHAKE
                  </button>
               </div>
            </div>

            {/* ── API CREDENTIALS ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               <div className="panel-label" style={{ marginBottom: '8px' }}>ENCRYPTED_UPLINK_KEYS</div>
               
               {[
                 { label: 'ANTHROPIC_CLAUDE_AI', val: apiKey, setter: setApiKey, icon: Cpu, placeholder: 'sk-ant-...' },
                 { label: 'THREATFOX_ABUSE_CH', val: threatFoxKey, setter: setThreatFoxKey, icon: Shield, placeholder: 'Enter API Key...' },
                 { label: 'ALIENVAULT_OTX', val: otxKey, setter: setOtxKey, icon: Globe, placeholder: 'Enter OTX Key...' }
               ].map((cred, i) => (
                 <div key={i} className="credential-field" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px', fontWeight: 800, color: '#f8fafc', letterSpacing: '1px' }}>
                      <cred.icon size={12} color="var(--domain-primary)" /> {cred.label}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Key size={14} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', opacity: 0.3 }} />
                      <input 
                        type="password" placeholder={cred.placeholder} value={cred.val} 
                        onChange={e => cred.setter(e.target.value)}
                        className="input-tactical"
                        style={{ width: '100%', paddingLeft: '44px' }} 
                      />
                    </div>
                 </div>
               ))}
            </div>

            {/* ── PERFORMANCE ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
               <div className="panel-label" style={{ marginBottom: '8px' }}>
                 UPLINK_FREQUENCY: {(liveSpeed / 1000).toFixed(1)}s
               </div>
               <div style={{ background: 'rgba(0,0,0,0.3)', padding: '24px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                 <input 
                   type="range" min="1000" max="15000" step="500" value={liveSpeed} 
                   onChange={e => setLiveSpeed(Number(e.target.value))} 
                   style={{ width: '100%', accentColor: 'var(--domain-primary)', cursor: 'pointer' }}
                 />
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '8px', color: '#64748b', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>
                    <span>HIGH_FIDELITY</span>
                    <span>BALANCED</span>
                    <span>LOW_RES_UPLINK</span>
                 </div>
               </div>
            </div>

          </div>

          <div style={{ padding: '20px', background: 'rgba(14, 165, 233, 0.05)', border: '1px solid rgba(14, 165, 233, 0.15)', borderRadius: '12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
             <Server size={18} color="var(--domain-primary)" style={{ marginTop: '2px' }} />
             <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.6', color: '#94a3b8' }}>
               <strong>IDENTITY_SHIELD_ACTIVE:</strong> All tactical keys are stored in the local encrypted browser vault. Credentials are never transmitted to Sentinel servers.
             </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
