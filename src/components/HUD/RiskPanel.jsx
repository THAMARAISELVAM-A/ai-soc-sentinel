import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";

export function RiskPanel({ isAlertActive, feed }) {
  const riskScore = useMemo(() => {
    const base = isAlertActive ? 65 : 22;
    const shift = (feed.filter(f => f.severity === 'critical').length * 2) % 20;
    return base + shift;
  }, [isAlertActive, feed]);

  return (
    <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="panel-label" style={{ width: "100%", textAlign: "center" }}>GLOBAL RISK INDEX</div>
      <div className="gauge-container">
         <div className="gauge-ring" style={{ borderTopColor: isAlertActive ? '#ef4444' : 'var(--domain-primary)' }} />
         <div className="gauge-value">
            {riskScore}
            <span style={{ color: isAlertActive ? '#ef4444' : 'var(--domain-primary)', fontSize: 10, marginTop: -5, fontWeight: 800, letterSpacing: '0.1em' }}>{riskScore > 50 ? 'ELEVATED' : 'STABLE'}</span>
         </div>
      </div>
      <div style={{ fontSize: 10, color: "#8b949e", marginTop: 15, display: "flex", gap: 10, fontFamily: "var(--mono-font)" }}>
         <TrendingUp size={12} color={isAlertActive ? "#ef4444" : "var(--domain-primary)"}/> STATUS: <strong style={{color:"white"}}>{isAlertActive ? "THREAT DETECTED" : "SYNCRONIZED"}</strong>
      </div>
    </div>
  );
}
