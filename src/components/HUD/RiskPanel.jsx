import React, { useMemo } from "react";
import { Minimize2, TrendingUp, ShieldAlert, CheckCircle, Activity, Globe } from "lucide-react";
import { useSentinelStore } from "../../store/sentinelStore";

/**
 * RiskPanel - Master Class Situational Risk Visualization.
 */
export function RiskPanel() {
  const { feed, togglePanel } = useSentinelStore();

  const riskScore = useMemo(() => {
    const criticals = feed.filter(f => f.severity === 'critical' || f.severity === 'high').length;
    const isAlertActive = criticals > 0;
    const base = isAlertActive ? 65 : 12;
    const shift = (criticals * 8) % 30;
    return Math.min(99, base + shift);
  }, [feed]);

  const isAlertActive = riskScore > 60;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: "flex", flexDirection: "column", alignItems: "center", height: '100%', width: '100%', overflow: 'hidden' }}>
      <div className="panel-label" style={{ width: "100%", justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <Activity size={12} /> MISSION_RISK_INDEX
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           <button onClick={() => togglePanel('risk')} className="btn-console" style={{ padding: '4px 8px' }}>
              <Minimize2 size={12} />
           </button>
           <div style={{ fontSize: '8px', opacity: 0.5 }}>INDEX_V.04</div>
        </div>
      </div>
      
      <div style={{ width: 220, height: 220, position: 'relative' }}>
         {/* Background Grid Lines for the Gauge */}
         <div style={{ position: 'absolute', inset: -10, border: '1px solid rgba(255,255,255,0.02)', borderRadius: '50%', pointerEvents: 'none' }} />
         <div style={{ position: 'absolute', inset: -20, border: '1px solid rgba(255,255,255,0.01)', borderRadius: '50%', pointerEvents: 'none' }} />

         <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.01)" strokeWidth="0.5" />
            
            <motion.circle 
               cx="50" cy="50" r="46" fill="none" 
               stroke={isAlertActive ? 'var(--alert-red)' : 'var(--domain-primary)'} 
               strokeWidth="4" strokeLinecap="round"
               strokeDasharray="289"
               animate={{ strokeDashoffset: 289 - (289 * (riskScore / 100)) }}
               transition={{ duration: 1.5, ease: "circOut" }}
               style={{ 
                 filter: `drop-shadow(0 0 12px ${isAlertActive ? 'var(--alert-red)' : 'var(--domain-primary)'})`,
               }}
            />

            {/* Tactical Markers */}
            {[0, 25, 50, 75, 100].map(p => {
              const angle = (p / 100) * Math.PI * 2;
              const x1 = 50 + 44 * Math.cos(angle);
              const y1 = 50 + 44 * Math.sin(angle);
              const x2 = 50 + 48 * Math.cos(angle);
              const y2 = 50 + 48 * Math.sin(angle);
              return <line key={p} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            })}
         </svg>
         
         <div style={{ 
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: '4px' 
         }}>
            <motion.div 
               key={riskScore}
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               style={{ 
                 fontSize: '64px', color: 'white', fontWeight: 900, 
                 fontFamily: 'var(--mono-font)', 
                 textShadow: `0 0 30px ${isAlertActive ? 'var(--alert-glow)' : 'var(--domain-glow)'}` 
               }}
            >
              {riskScore}
            </motion.div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(1,2,8,0.8)', padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--glass-border)', backdropFilter: 'blur(8px)' }}>
              {isAlertActive ? <ShieldAlert size={10} color="var(--alert-red)" /> : <CheckCircle size={10} color="#10b981" />}
              <span style={{ 
                color: isAlertActive ? 'var(--alert-red)' : '#10b981', 
                fontSize: '9px', fontWeight: 900, letterSpacing: '1px', fontFamily: 'var(--mono-font)'
              }}>
                {riskScore > 75 ? 'CRITICAL' : riskScore > 40 ? 'CAUTION' : 'NOMINAL'}
              </span>
            </div>
         </div>
      </div>

      <div style={{ width: '100%', marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Globe size={12} /> GLOBAL_UPLINK
          </div>
          <div style={{ fontSize: '9px', color: isAlertActive ? 'var(--alert-red)' : '#10b981', fontFamily: 'var(--mono-font)', fontWeight: 900 }}>
             {isAlertActive ? "THREAT_ISOLATION_REQD" : "COLLECTING_OSINT"}
          </div>
        </div>
        
        <div style={{ height: '4px', width: '100%', background: 'rgba(0,0,0,0.4)', borderRadius: '2px', overflow: 'hidden' }}>
           <motion.div 
             animate={{ x: [-100, 100] }} 
             transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
             style={{ height: '100%', width: '40%', background: isAlertActive ? 'var(--alert-red)' : 'var(--domain-primary)', opacity: 0.5 }} 
           />
        </div>
      </div>
    </div>
  );
}
