import React from "react";
import { Globe as GlobeIcon, ShieldAlert, Radio, TrendingUp, BookOpen, Settings } from "lucide-react";

export function Header({ activeDomain, setActiveDomain, setShowOsintPanel, liveMode, toggleLive, setShowSettings }) {
  return (
    <div className="wm-header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="wm-logo-box"><GlobeIcon size={20} /></div>
        <div className="wm-title">WORLD MONITOR <span style={{color:"#444", fontSize:12, marginLeft:10}}>V2.6.5</span></div>
        
        <div className="wm-domain-nav">
           <div onClick={()=>setActiveDomain("CYBER")} className={`nav-icon-btn ${activeDomain === 'CYBER'?'active':''}`} title="Cyber Intelligence"><Radio size={16}/></div>
           <div onClick={()=>setActiveDomain("GEOINT")} className={`nav-icon-btn ${activeDomain === 'GEOINT'?'active':''}`} title="Geopolitical Activity"><ShieldAlert size={16}/></div>
           <div onClick={()=>setActiveDomain("FINANCE")} className={`nav-icon-btn ${activeDomain === 'FINANCE'?'active':''}`} title="Market Stability"><TrendingUp size={16}/></div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
         <div className="badge-tag" style={{background:"rgba(239,68,68,0.1)", color:"#ef4444", padding:"8px 12px", border:"1px solid rgba(239,68,68,0.3)"}}>
            DEFCON 5 <span style={{opacity:0.6, marginLeft:4}}>8%</span>
         </div>
         <div className="wm-header-actions">
           <button onClick={() => setShowOsintPanel(true)} className="btn-console"><BookOpen size={14}/> INGEST OSINT</button>
           <button onClick={toggleLive} className={`btn-console ${liveMode ? 'active' : ''}`}>
              {liveMode ? "HALT SCANNING" : "INITIALIZE SCAN"}
           </button>
           <button onClick={() => setShowSettings(true)} className="btn-console"><Settings size={16}/></button>
         </div>
      </div>
    </div>
  );
}
