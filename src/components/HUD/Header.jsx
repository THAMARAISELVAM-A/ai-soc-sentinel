import React from "react";
import { Globe as GlobeIcon, ShieldAlert, Radio, TrendingUp, BookOpen, Settings } from "lucide-react";
import { motion } from "framer-motion";

export function Header({ activeDomain, setActiveDomain, setShowOsintPanel, liveMode, toggleLive, setShowSettings }) {
  return (
    <div className="wm-header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <motion.div 
          className="wm-logo-box"
          whileHover={{ scale: 1.1, rotate: 90 }}
          animate={{ borderColor: `var(--domain-primary)` }}
        >
          <GlobeIcon size={24} />
        </motion.div>
        
        <div className="wm-title">WORLD MONITOR <span style={{color:"#444", fontSize:11, marginLeft:12, fontWeight: 400}}>SEC-OPS V2.8.0</span></div>
        
        <div className="wm-domain-nav">
           <div onClick={()=>setActiveDomain("CYBER")} className={`nav-icon-btn ${activeDomain === 'CYBER'?'active':''}`} title="Cyber Intelligence"><Radio size={18}/></div>
           <div onClick={()=>setActiveDomain("FINANCE")} className={`nav-icon-btn ${activeDomain === 'FINANCE'?'active':''}`} title="Market Stability"><TrendingUp size={18}/></div>
           <div onClick={()=>setActiveDomain("GEOINT")} className={`nav-icon-btn ${activeDomain === 'GEOINT'?'active':''}`} title="Geopolitical Activity"><ShieldAlert size={18}/></div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
         <motion.div 
           className="badge-tag"
           animate={{ borderColor: liveMode ? `var(--domain-primary)` : "rgba(255,255,255,0.1)" }}
         >
            <div className="poi-dot" style={{ background: liveMode ? 'var(--domain-primary)' : '#555' }}></div>
            TRANS-STREAM: <span style={{color: "white"}}>ACTIVE</span>
         </motion.div>
         
         <div className="wm-header-actions">
           <button onClick={() => setShowOsintPanel(true)} className="btn-console"><BookOpen size={14}/> INGEST OSINT</button>
           <button onClick={toggleLive} className={`btn-console ${liveMode ? 'active' : ''}`}>
              {liveMode ? "HALT SCANNING" : "INITIALIZE SCAN"}
           </button>
           <button onClick={() => setShowSettings(true)} className="btn-console"><Settings size={18}/></button>
         </div>
      </div>
    </div>
  );
}
