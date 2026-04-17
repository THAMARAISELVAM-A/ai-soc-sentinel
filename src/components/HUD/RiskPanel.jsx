import React, { useMemo } from "react";
import { TrendingUp, ShieldAlert, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function RiskPanel({ isAlertActive, feed }) {
  const riskScore = useMemo(() => {
    const base = isAlertActive ? 74 : 12;
    const shift = (feed.filter(f => f.severity === 'critical' || f.severity === 'high').length * 4) % 15;
    return Math.min(99, base + shift);
  }, [isAlertActive, feed]);

  return (
    <div className="glass-panel" style={{ padding: 32, display: "flex", flexDirection: "column", alignItems: "center", minHeight: 340 }}>
      <div className="panel-label" style={{ width: "100%", textAlign: "center", marginBottom: 32, opacity: 0.8 }}>GLOBAL RISK INDEX</div>
      
      <div className="gauge-container" style={{ width: 220, height: 220, position: 'relative' }}>
         <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
            <motion.circle 
               cx="50" cy="50" r="44" fill="none" 
               stroke={isAlertActive ? '#f43f5e' : 'var(--domain-primary)'} 
               strokeWidth="6" strokeLinecap="round"
               strokeDasharray="276.4"
               animate={{ strokeDashoffset: 276.4 - (276.4 * (riskScore / 100)) }}
               transition={{ duration: 1.5, ease: "circOut" }}
               style={{ 
                 filter: `drop-shadow(0 0 12px ${isAlertActive ? 'rgba(244,63,94,0.6)' : 'var(--domain-glow)'})`,
               }}
            />
         </svg>
         
         <div className="gauge-value" style={{ 
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', gap: 4 
         }}>
            <motion.div 
               key={riskScore}
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               style={{ 
                 fontSize: 64, color: 'white', fontWeight: 900, 
                 fontFamily: 'var(--mono-font)', 
                 textShadow: `0 0 40px ${isAlertActive ? 'rgba(244,63,94,0.4)' : 'rgba(59, 130, 246, 0.4)'}` 
               }}
            >
              {riskScore}
            </motion.div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {isAlertActive ? <ShieldAlert size={14} color="#f43f5e" /> : <CheckCircle size={14} color="#10b981" />}
              <span style={{ 
                color: isAlertActive ? '#f43f5e' : '#10b981', 
                fontSize: 10, fontWeight: 900, letterSpacing: '0.4em' 
              }}>
                {riskScore > 70 ? 'CRITICAL' : riskScore > 30 ? 'CAUTION' : 'NOMINAL'}
              </span>
            </div>
         </div>
      </div>

      <div style={{ 
        fontSize: 10, color: "#64748b", marginTop: 32, display: "flex", 
        alignItems: 'center', gap: 12, fontFamily: "var(--mono-font)", 
        letterSpacing: '0.15em', fontWeight: 800
      }}>
         <TrendingUp size={14} color={isAlertActive ? "#f43f5e" : "var(--domain-primary)"}/> 
         UPLINK: <strong style={{color:"white"}}>{isAlertActive ? "THREAT DETECTED" : "SYNCHRONIZED"}</strong>
      </div>
    </div>
  );
}
