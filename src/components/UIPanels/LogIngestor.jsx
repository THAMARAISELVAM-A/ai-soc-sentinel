import React, { useState } from "react";
import { Terminal, ShieldPlus, Loader2, CheckCircle2, AlertCircle, Activity, Globe } from "lucide-react";
import { supabase } from "../../lib/supabase";

/**
 * LogIngestor - Master Class Tactical Manual Ingest Module.
 * Final refinement for cloud signaling and high-fidelity visuals.
 */
export function LogIngestor({ onIngest, activeDomain }) {
  const [logText, setLogText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleIngest = async () => {
    if (!logText.trim()) return;
    setIsProcessing(true);
    setLastResult(null);
    try {
      const result = await onIngest(logText);
      setLastResult(result);
      setLogText("");

      // AUDIO FEEDBACK
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      osc.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(result.is_anomaly ? 220 : 880, ctx.currentTime);
      osc.start(); osc.stop(ctx.currentTime + 0.1);

    } catch (e) {
      console.error(e);
      setLastResult({ error: "Analysis Failed" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '48px', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1000px', margin: '0 auto', background: 'rgba(2, 6, 23, 0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '32px' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '12px', background: 'var(--domain-glow)', border: '1px solid var(--domain-border)', borderRadius: '8px' }}>
               <Terminal size={24} color="var(--domain-primary)" />
            </div>
            <div>
               <div className="panel-label" style={{ margin: 0, gap: '12px' }}>
                 <Activity size={12} /> UNIT_TELEMETRY_INGEST
               </div>
               <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 900, letterSpacing: '2px', marginTop: '6px' }}>
                 UPLINK_SOURCE: MANUAL_OSINT // SECTOR: {activeDomain}
               </div>
            </div>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.6 }}>
            <Globe size={14} color="var(--domain-primary)" />
            <span style={{ fontSize: '9px', fontWeight: 900, fontFamily: 'var(--mono-font)', letterSpacing: '1px' }}>
              {supabase ? 'CLOUD_SINK_ACTIVE' : 'LOCAL_ONLY_MODE'}
            </span>
         </div>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea 
          placeholder="PASTE_RAW_TACTICAL_LOG_DATA_HERE (JSON, SYSLOG, STACK_TRACE)..."
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          className="custom-scrollbar"
          style={{ 
            width: '100%', height: '320px', background: 'rgba(0,0,0,0.5)', 
            border: '1px solid var(--glass-border)', borderRadius: '8px', 
            padding: '24px', color: 'white', fontFamily: 'var(--mono-font)', 
            fontSize: '12px', resize: 'none', outline: 'none', 
            boxShadow: 'inset 0 10px 40px rgba(0,0,0,0.5)',
            letterSpacing: '0.5px', lineHeight: '1.8'
          }}
        />
        <AnimatePresence>
          {isProcessing && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               style={{ position: 'absolute', inset: 0, background: 'rgba(1,2,8,0.85)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', gap: '20px' }}>
               <Loader2 size={32} className="scanning" color="var(--domain-primary)" />
               <div style={{ fontSize: '11px', color: 'var(--domain-primary)', fontWeight: 900, letterSpacing: '4px', fontFamily: 'var(--mono-font)' }}>EXTRACTING_THREAT_SIGNATURES...</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
               <div style={{ width: '4px', height: '4px', background: '#64748b', borderRadius: '50%' }}></div>
               <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '1px', fontFamily: 'var(--mono-font)' }}>AI_HEURISTICS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b' }}>
               <div style={{ width: '4px', height: '4px', background: '#64748b', borderRadius: '50%' }}></div>
               <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '1px', fontFamily: 'var(--mono-font)' }}>CLOUD_SIGNALING</span>
            </div>
         </div>
         <button 
           onClick={handleIngest}
           disabled={isProcessing || !logText.trim()}
           className="btn-console"
           style={{ 
             padding: '16px 48px', fontSize: '12px', fontWeight: 900,
             opacity: (isProcessing || !logText.trim()) ? 0.3 : 1,
             background: 'var(--domain-primary)', color: '#000',
             boxShadow: '0 0 30px var(--domain-glow)'
           }}>
           <ShieldPlus size={18} /> COMMIT_TO_SENTINEL_UPLINK
         </button>
      </div>

      <AnimatePresence>
        {lastResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ 
              padding: '32px', 
              background: lastResult.is_anomaly ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)', 
              border: `1px solid ${lastResult.is_anomaly ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, 
              borderRadius: '8px' 
            }}
          >
             <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                {lastResult.is_anomaly ? <AlertCircle size={24} color="var(--alert-red)" /> : <CheckCircle2 size={24} color="#10b981" />}
                <span style={{ fontWeight: 900, fontSize: '14px', color: lastResult.is_anomaly ? 'var(--alert-red)' : '#10b981', fontFamily: 'var(--mono-font)', letterSpacing: '2px' }}>
                  {lastResult.is_anomaly ? 'CRITICAL_ANOMALY_CONFIRMED' : 'TELEMETRY_STATUS_VALIDATED'}
                </span>
             </div>
             <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.8', fontFamily: 'var(--mono-font)', letterSpacing: '0.5px' }}>
               {lastResult.explanation?.toUpperCase() || (lastResult.is_anomaly ? "HIGH-RISK SIGNATURE MATCH DETECTED IN MANUAL UPLINK." : "NO ANOMALIES IDENTIFIED DURING HEURISTIC ANALYSIS.")}
             </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
