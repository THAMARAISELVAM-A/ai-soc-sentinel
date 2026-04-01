import React from "react";

export function OSINTModal({ showOsintPanel, setShowOsintPanel, osintText, setOsintText, processOsintIntelligence, isOsintParsing }) {
  if (!showOsintPanel) return null;

  return (
    <div className="wm-osint-modal">
       <div className="glass-panel modal-box">
          <div className="modal-header">OSINT CO-PILOT <button onClick={() => setShowOsintPanel(false)}>✕</button></div>
          <textarea 
             value={osintText} onChange={e=>setOsintText(e.target.value)} 
             placeholder="Paste threat report clipping, market signal, or military bulletin here..." 
          />
          <button onClick={processOsintIntelligence} disabled={isOsintParsing} className="btn-primary">
             {isOsintParsing ? "SYNTHESIZING INTELLIGENCE..." : "AUTONOMOUSLY GENERATE POLICIES"}
          </button>
       </div>
    </div>
  );
}
