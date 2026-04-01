import React from "react";

export function PredictivePanel({ forecast }) {
  if (!forecast) return null;

  return (
    <div className="glass-panel predictive-panel" style={{ padding: 20, borderLeft: "2px solid #a855f7" }}>
      <div className="panel-label">AI PREDICTIVE FORECAST</div>
      <div style={{ fontSize: 13, fontWeight: "bold", color: "#fff", marginBottom: 5 }}>{forecast.predicted_attack}</div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#a855f7", marginBottom: 10 }}>
        <span>PROBABILITY: {forecast.probability}%</span>
        <span>ETA: {forecast.eta}</span>
      </div>
      <div style={{ fontSize: 11, color: "#8b949e", fontStyle: "italic" }}>"{forecast.explanation}"</div>
    </div>
  );
}
