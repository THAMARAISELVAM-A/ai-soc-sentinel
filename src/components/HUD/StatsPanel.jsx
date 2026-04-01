import React from "react";

export function StatsPanel({ activeDomain, feed, signatures, simulationMode }) {
  return (
    <div className="wm-panel-bottom">
      <div className="stat-box">
        <span>{activeDomain === 'FINANCE' ? 'GLOBAL DEBT CLOCK' : 'DATA INDEX SIZE'}</span> 
        <strong>{activeDomain === 'FINANCE' ? '$115.8T' : feed.length}</strong>
      </div>
      <div className="stat-box"><span>ACTIVE SIMULATIONS</span> <strong>{signatures.length}</strong></div>
      <div className="stat-box">
        <span>AI FORECAST ENGINE</span> 
        <strong style={{ color: simulationMode ? "#f59e0b" : "#22c55e" }}>
          {simulationMode ? "SIMULATION" : "LIVE CLAUDE"}
        </strong>
      </div>
      <div className="stat-box"><span>NETWORK LATENCY</span> <strong>12ms</strong></div>
    </div>
  );
}
