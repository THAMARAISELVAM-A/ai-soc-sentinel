import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export function RiskPanel({ isAlertActive, feed }) {
  const riskScore = useMemo(() => {
    const base = isAlertActive ? 65 : 22;
    const shift = (feed.filter(f => f.severity === 'critical').length * 21) % 15;
    return base + shift;
  }, [isAlertActive, feed]);

  return (
    <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center", minHeight: 320 }}>
      <div className="panel-label" style={{ width: "100%", textAlign: "center", marginBottom: 30 }}>GLOBAL RISK INDEX</div>
      
      <div className="gauge-container" style={{ width: 190, height: 190, position: 'relative' }}>
         <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="hsla(0,0%,100%,0.02)" strokeWidth="6" />
            <motion.circle 
               cx="50" cy="50" r="44" fill="none" 
               stroke={isAlertActive ? '#ef4444' : 'var(--domain-primary)'} 
               strokeWidth="6" strokeLinecap="round"
               strokeDasharray="276.4"
               animate={{ strokeDashoffset: 276.4 - (276.4 * (riskScore / 100)) }}
               transition={{ duration: 1.8, ease: "circOut" }}
               style={{ filter: `drop-shadow(0 0 8px ${isAlertActive ? 'rgba(239,68,68,0.4)' : 'var(--domain-glow)'})` }}
            />
         </svg>
         <div className="gauge-value" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 2 }}>
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ fontSize: 54, color: 'white', fontWeight: 900, fontFamily: 'var(--mono-font)', textShadow: `0 0 30px ${isAlertActive ? 'rgba(239,68,68,0.3)' : 'var(--domain-primary)'}` }}
            >
              {riskScore}
            </motion.span>
            <span style={{ color: isAlertActive ? '#ef4444' : 'var(--domain-primary)', fontSize: 11, fontWeight: 900, letterSpacing: '0.3em', opacity: 0.8 }}>{riskScore > 50 ? 'CRITICAL' : 'STABLE'}</span>
         </div>
      </div>

      <div style={{ fontSize: 11, color: "hsla(0, 0%, 100%, 0.25)", marginTop: 30, display: "flex", alignItems: 'center', gap: 12, fontFamily: "var(--mono-font)", letterSpacing: '0.08em' }}>
         <TrendingUp size={14} color={isAlertActive ? "#ef4444" : "var(--domain-primary)"}/> 
         STATUS: <strong style={{color:"white", fontWeight: 900}}>{isAlertActive ? "THREAT DETECTED" : "SYNCHRONIZED"}</strong>
      </div>
    </div>
  );
}
