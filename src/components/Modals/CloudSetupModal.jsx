import React from "react";
import { X, Database, Terminal, ShieldAlert, Key, Zap, CheckCircle2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

/**
 * CloudSetupModal - The Master Class Onboarding Assistant.
 * Guides the user through Supabase SQL and Env Var provisioning.
 */
export function CloudSetupModal({ isOpen, onClose }) {
  const isConnected = !!supabase;

  const SQL_SCHEMA = `-- Sentinel Telemetry Uplink
CREATE TABLE IF NOT EXISTS sentinel_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  ts BIGINT NOT NULL,
  sector TEXT NOT NULL,
  severity TEXT,
  is_anomaly BOOLEAN,
  threat_type TEXT,
  log_content TEXT NOT NULL,
  attacker_ip TEXT,
  explanation TEXT
);
ALTER PUBLICATION supabase_realtime ADD TABLE sentinel_signals;`;

  const copySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    alert("SENTINEL_SQL_COPIED: Ready for Supabase SQL Editor.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 11000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(1, 2, 8, 0.9)', backdropFilter: 'blur(12px)' }}
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="glass-panel" 
            style={{
              width: '680px', padding: '48px', zIndex: 11001, display: 'flex', flexDirection: 'column', gap: '32px',
              background: 'linear-gradient(135deg, rgba(2, 6, 23, 0.95), rgba(1, 2, 8, 0.98))',
              border: '1px solid var(--domain-border)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'var(--domain-glow)', padding: '12px', borderRadius: '8px', border: '1px solid var(--domain-border)' }}>
                    <Database size={24} color="var(--domain-primary)" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, letterSpacing: '0.1em', color: 'white' }}>CLOUD_ONBOARDING_ASSISTANT</h3>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 800, letterSpacing: '2px', marginTop: '4px' }}>SUPABASE_UPLINK_V4</div>
                  </div>
               </div>
               <button onClick={onClose} className="btn-console" style={{ padding: '8px' }}><X size={18} /></button>
            </div>

            <div className="custom-scrollbar" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '12px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
              
              {/* STATUS BAR */}
              <div style={{ padding: '24px', background: isConnected ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)', border: `1px solid ${isConnected ? '#10b981' : 'var(--alert-red)'}`, borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                   {isConnected ? <CheckCircle2 size={24} color="#10b981" /> : <ShieldAlert size={24} color="var(--alert-red)" className="scanning" />}
                   <div>
                     <div style={{ fontSize: '12px', fontWeight: 900, color: 'white' }}>{isConnected ? 'UPLINK_STABLE' : 'UPLINK_DISCONNECTED'}</div>
                     <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>{isConnected ? 'Sentinel Cloud is actively heartbeating.' : 'Credentials missing. Manual provisioning required.'}</div>
                   </div>
                 </div>
                 {!isConnected && <div style={{ fontSize: '8px', fontWeight: 900, color: 'var(--alert-red)', letterSpacing: '2px' }}>ACTION_REQD</div>}
              </div>

              {!isConnected && (
                <>
                  {/* STEP 1: SQL */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--domain-primary)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>1</div>
                      <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '2px', color: 'white' }}>INITIALIZE_POSTGRES_SCHEMA</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <pre style={{ margin: 0, padding: '20px', background: 'rgba(0,0,0,0.6)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontSize: '10px', color: '#94a3b8', fontFamily: 'var(--mono-font)', overflowX: 'auto' }}>
                        {SQL_SCHEMA}
                      </pre>
                      <button 
                        onClick={copySql}
                        className="btn-console" 
                        style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--domain-primary)', color: 'black', border: 'none' }}>
                        <Terminal size={12} /> COPY_SQL
                      </button>
                    </div>
                  </div>

                  {/* STEP 2: ENV */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--domain-primary)', color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>2</div>
                      <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '2px', color: 'white' }}>PROVISION_MISSION_KEYS</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ color: 'var(--domain-primary)', fontSize: '10px', fontWeight: 900, marginBottom: '8px', fontFamily: 'var(--mono-font)' }}>VITE_SUPABASE_URL</div>
                        <div style={{ color: '#64748b', fontSize: '9px' }}>Found in Project Settings &gt; API &gt; Project URL</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ color: 'var(--domain-primary)', fontSize: '10px', fontWeight: 900, marginBottom: '8px', fontFamily: 'var(--mono-font)' }}>VITE_SUPABASE_ANON_KEY</div>
                        <div style={{ color: '#64748b', fontSize: '9px' }}>Found in Project Settings &gt; API &gt; Anon Key</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>

            <div style={{ padding: '24px', background: 'var(--domain-glow)', border: '1px solid var(--domain-border)', borderRadius: '12px', display: 'flex', gap: '16px' }}>
               <Zap size={20} color="var(--domain-primary)" style={{ flexShrink: 0 }} />
               <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.6', color: '#94a3b8' }}>
                 <strong>SENTINEL_NOTE:</strong> Once configured, mission telemetry will persist in the cloud, enabling sub-millisecond real-time orchestration across all tactical nodes.
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
