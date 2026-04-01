import React from "react";

export function SettingsOverlay({ showSettings, setShowSettings, simulationMode, setSimulationMode, liveSpeed, setLiveSpeed }) {
  if (!showSettings) return null;

  return (
    <div className="glass-panel settings-overlay">
      <div className="settings-header">PLATFORM PARAMETERS <button onClick={() => setShowSettings(false)}>✕</button></div>
      <div className="settings-section">
         <div className="label">GLOBAL AGENT MODE</div>
         <div className="btn-group">
            <button onClick={() => setSimulationMode(true)} className={simulationMode ? 'active' : ''}>SIMULATION</button>
            <button onClick={() => setSimulationMode(false)} className={!simulationMode ? 'active' : ''}>LIVE ENGINE</button>
         </div>
      </div>
      <div className="settings-section">
         <div className="label">REFRESH RATE: {Math.round(liveSpeed / 1000)}s</div>
         <input type="range" min="500" max="10000" step="500" value={liveSpeed} onChange={e => setLiveSpeed(Number(e.target.value))} />
      </div>
    </div>
  );
}
