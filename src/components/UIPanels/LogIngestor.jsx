import React, { useState } from "react";
import { Terminal, ShieldPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
    } catch (e) {
      console.error(e);
      setLastResult({ error: "Analysis Failed" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '20px' }}>
         <Terminal size={24} color="var(--domain-primary)" />
         <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, letterSpacing: '0.1em' }}>MANUAL TELEMETRY INGESTION</h3>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.5 }}>Paste raw logs from your server or local machine for AI classification.</p>
         </div>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea 
          placeholder="Paste real server logs here (e.g. Apache, Nginx, SSH auth.log)..."
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          style={{ width: '100%', height: '240px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '16px', color: '#f1f5f9', fontFamily: 'var(--mono-font)', fontSize: '12px', resize: 'none', outline: 'none' }}
        />
        {isProcessing && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
             <Loader2 size={32} className="scanning" color="var(--domain-primary)" />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ fontSize: '11px', color: '#64748b' }}>
           * Large logs will be analyzed as a single intelligence block.
         </div>
         <button 
           onClick={handleIngest}
           disabled={isProcessing || !logText.trim()}
           style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--domain-primary)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', transition: '0.3s', opacity: (isProcessing || !logText.trim()) ? 0.4 : 1 }}>
           <ShieldPlus size={18} /> INGEST TO SENTINEL
         </button>
      </div>

      {lastResult && (
        <div style={{ padding: '20px', background: lastResult.is_anomaly ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${lastResult.is_anomaly ? '#ef444433' : '#10b98133'}`, borderRadius: '12px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              {lastResult.is_anomaly ? <AlertCircle size={18} color="#ef4444" /> : <CheckCircle2 size={18} color="#10b981" />}
              <span style={{ fontWeight: 900, fontSize: '13px', color: lastResult.is_anomaly ? '#ef4444' : '#10b981' }}>
                {lastResult.is_anomaly ? 'THREAT DETECTED' : 'CLEAN TELEMETRY'}
              </span>
           </div>
           <p style={{ margin: 0, fontSize: '12px', color: '#f8fafc', lineHeight: '1.5' }}>
             {lastResult.explanation || (lastResult.is_anomaly ? "Manual ingestion triggered a high-risk signature match." : "No anomalies found in the provided log block.")}
           </p>
        </div>
      )}
    </div>
  );
}
