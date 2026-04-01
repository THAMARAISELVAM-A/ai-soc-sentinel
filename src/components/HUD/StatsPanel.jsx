import React from "react";

export function StatsPanel({ activeDomain, feed, signatures, simulationMode }) {
  return (
    <div className="wm-panel-bottom">
       <div className="stat-box">
          <span>OPERATIONAL MODE</span>
          <strong>{simulationMode ? 'SIMULATED' : 'LIVE TRANSMISSION'}</strong>
       </div>
       <div className="stat-box">
          <span>ACTIVE DOMAIN</span>
          <strong style={{ color: 'var(--domain-primary)' }}>{activeDomain}</strong>
       </div>
       <div className="stat-box">
          <span>THREAT SIGNATURES</span>
          <strong>{signatures.filter(s => s.active).length}</strong>
       </div>
       <div className="stat-box">
          <span>TELEMETRY FPS</span>
          <strong>60.4</strong>
       </div>
       <div className="stat-box">
          <span>SIGNAL LATENCY</span>
          <strong>12ms</strong>
       </div>
       <div className="stat-box">
          <span>SYSTEM HEALTH</span>
          <strong style={{ color: '#10b981' }}>NOMINAL</strong>
       </div>
    </div>
  );
}
