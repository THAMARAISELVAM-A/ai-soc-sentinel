import React, { useMemo } from "react";
import { TrendingUp } from "lucide-react";

export function RiskPanel({ isAlertActive, feed }) {
  // Stable calculation based on feed content, not random per render
  const riskScore = useMemo(() => {
    const base = isAlertActive ? 65 : 22;
    const shift = (feed.filter(f => f.severity === 'critical').length * 2) % 20;
    return base + shift;
  }, [isAlertActive, feed]);

  return (
    <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="panel-label" style={{ width: "100%" }}>GLOBAL RISK INDEX</div>
      <div className="gauge-container">
         <div className="gauge-ring" style={{ borderTopColor: isAlertActive ? '#ef4444' : '#3b82f6' }} />
         <div className="gauge-value">
            {riskScore}
            <span>{riskScore > 50 ? 'ELEVATED' : 'STABLE'}</span>
         </div>
      </div>
      <div style={{ fontSize: 10, color: "#8b949e", marginTop: 15, display: "flex", gap: 10 }}>
         <TrendingUp size={12} color={riskScore > 50 ? "#ef4444" : "#f59e0b"}/> STATUS: <strong style={{color:"white"}}>{isAlertActive ? "THREAT DETECTED" : "STABLE"}</strong>
      </div>
    </div>
  );
}
