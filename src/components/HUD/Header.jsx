import React from "react";
import { Globe as GlobeIcon, ShieldAlert, Radio, TrendingUp, BookOpen, Settings } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export function Header({ activeDomain, setActiveDomain, setShowOsintPanel, liveMode, toggleLive, setShowSettings }) {
  return (
    <div className="wm-header">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <motion.div 
          className="wm-logo-box"
          whileHover={{ scale: 1.1, rotate: 90 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <GlobeIcon size={22} strokeWidth={1.5} />
        </motion.div>
        
        <div className="wm-title">WORLD MONITOR <span style={{color:"hsla(0, 0%, 100%, 0.15)", fontSize:10, marginLeft:15, fontWeight: 400, letterSpacing: '0.1em'}}>SEC-OPS V2.8.0</span></div>
        
        <div className="wm-domain-nav" style={{ marginLeft: 30 }}>
           <div onClick={()=>setActiveDomain("CYBER")} className={`nav-icon-btn ${activeDomain === 'CYBER'?'active':''}`} title="Cyber Intelligence"><Radio size={18}/></div>
           <div onClick={()=>setActiveDomain("FINANCE")} className={`nav-icon-btn ${activeDomain === 'FINANCE'?'active':''}`} title="Market Stability"><TrendingUp size={18}/></div>
           <div onClick={()=>setActiveDomain("GEOINT")} className={`nav-icon-btn ${activeDomain === 'GEOINT'?'active':''}`} title="Geopolitical Activity"><ShieldAlert size={18}/></div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
         <motion.div 
           className="badge-tag"
           style={{ border: '1px solid var(--glass-border)', background: 'hsla(0, 0%, 100%, 0.02)', padding: '6px 12px', fontSize: '10px', height: '38px', display: 'flex', alignItems: 'center', gap: '10px' }}
           animate={{ borderColor: liveMode ? `var(--domain-primary)` : "hsla(0, 0%, 100%, 0.1)" }}
         >
            <div className="poi-dot" style={{ background: liveMode ? 'var(--domain-primary)' : '#555', width: 6, height: 6, borderRadius: '50%', boxShadow: liveMode ? `0 0 10px var(--domain-primary)` : 'none' }}></div>
            <span style={{ opacity: 0.6, fontWeight: 800 }}>TRANS-STREAM:</span> <span style={{color: liveMode ? "white" : "#666", fontWeight: 900}}>{liveMode ? 'ACTIVE' : 'STANDBY'}</span>
         </motion.div>
         
         <div className="wm-header-actions">
           <button onClick={() => setShowOsintPanel(true)} className="btn-console"><BookOpen size={14}/> INGEST OSINT</button>
           <button onClick={toggleLive} className={`btn-console ${liveMode ? 'active' : ''}`}>
              {liveMode ? "HALT SCANNING" : "INITIALIZE SCAN"}
           </button>
           <button onClick={() => setShowSettings(true)} className="btn-console" style={{ padding: '0 12px' }}><Settings size={18}/></button>
         </div>
      </div>
    </div>
  );
}
