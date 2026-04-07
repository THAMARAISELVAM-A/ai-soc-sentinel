import React from "react";
import { X, Shield, Cpu, Key, Activity, Zap } from "lucide-react";

export function SettingsOverlay({ 
  showSettings, setShowSettings, simulationMode, setSimulationMode, 
  liveSpeed, setLiveSpeed, apiKey, setApiKey, 
  threatFoxKey, setThreatFoxKey, otxKey, setOtxKey 
}) {
  if (!showSettings) return null;

  return (
    <div className="glass-panel" style={{
      position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: '500px', padding: '32px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
         <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <Shield size={20} color="var(--domain-primary)" /> INTEGRATION HUB
         </h3>
         <button onClick={() => setShowSettings(false)} className="nav-icon-btn"><X size={18} /></button>
      </div>

      <div className="settings-scroll-area" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Core Mode Toggle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div style={{ fontSize: '11px', fontWeight: 900, color: '#888', letterSpacing: '0.15em' }}>SENTINEL OPERATION MODE</div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                onClick={() => setSimulationMode(true)} 
                style={{ padding: '12px', background: simulationMode ? 'var(--domain-glow)' : 'rgba(255,255,255,0.02)', border: simulationMode ? '1px solid var(--domain-primary)' : '1px solid transparent', color: simulationMode ? 'white' : '#777', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' }}>
                <Zap size={14} style={{ marginRight: '8px' }} /> SIMULATION
              </button>
              <button 
                onClick={() => setSimulationMode(false)} 
                style={{ padding: '12px', background: !simulationMode ? 'var(--domain-glow)' : 'rgba(255,255,255,0.02)', border: !simulationMode ? '1px solid var(--domain-primary)' : '1px solid transparent', color: !simulationMode ? 'white' : '#777', borderRadius: '8px', cursor: 'pointer', transition: '0.3s' }}>
                <Activity size={14} style={{ marginRight: '8px' }} /> REAL-WORLD
              </button>
           </div>
        </div>

        {/* API Credentials */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           <div style={{ fontSize: '11px', fontWeight: 900, color: '#888', letterSpacing: '0.15em' }}>PROFESSIONAL API CREDENTIALS</div>
           
           <div className="credential-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#f8fafc', marginBottom: '8px' }}>
                <Cpu size={14} /> Anthropic Claude AI (Core)
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={14} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input 
                  type="password" placeholder="sk-ant-..." value={apiKey} 
                  onChange={e => setApiKey(e.target.value)}
                  style={{ width: '100%', background: 'black', border: '1px solid var(--glass-border)', padding: '10px 12px 10px 36px', color: 'white', borderRadius: '6px', fontSize: '12px' }} 
                />
              </div>
           </div>

           <div className="credential-field">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#f8fafc', marginBottom: '8px' }}>
                <Shield size={14} /> ThreatFox (abuse.ch) Auth-Key
              </label>
              <div style={{ position: 'relative' }}>
                <Key size={14} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', opacity: 0.4 }} />
                <input 
                  type="password" placeholder="Enter community key..." value={threatFoxKey} 
                  onChange={e => setThreatFoxKey(e.target.value)}
                  style={{ width: '100%', background: 'black', border: '1px solid var(--glass-border)', padding: '10px 12px 10px 36px', color: 'white', borderRadius: '6px', fontSize: '12px' }} 
                />
              </div>
           </div>
        </div>

        {/* Performance Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <div style={{ fontSize: '11px', fontWeight: 900, color: '#888', letterSpacing: '0.15em' }}>
             SIGNAL REFRESH INTERVAL: {Math.round(liveSpeed / 1000)}s
           </div>
           <input 
             type="range" min="1000" max="15000" step="1000" value={liveSpeed} 
             onChange={e => setLiveSpeed(Number(e.target.value))} 
             style={{ width: '100%', accentColor: 'var(--domain-primary)', background: 'var(--glass-border)', borderRadius: '4px' }}
           />
        </div>

      </div>

      <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
         <p style={{ margin: 0, fontSize: '11px', lineHeight: '1.6', color: '#888', fontStyle: 'italic' }}>
           <strong>Security Note:</strong> Keys are stored locally in your browser's encrypted vault. They are never transmitted except directly to the respective API endpoints.
         </p>
      </div>
    </div>
  );
}
