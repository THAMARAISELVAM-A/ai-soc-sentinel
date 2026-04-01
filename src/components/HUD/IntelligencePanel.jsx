import React from "react";
import { motion } from "framer-motion";

export function IntelligencePanel({ intelTab, setIntelTab, activeDomain, signatures }) {
  return (
    <div className="glass-panel" style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", minHeight: 400 }}>
      <div className="tab-bar">
         <button onClick={()=>setIntelTab("THREATS")} className={`tab-btn ${intelTab==='THREATS'?'active':''}`}>LIVE INTELLIGENCE</button>
         <button onClick={()=>setIntelTab("POSTURE")} className={`tab-btn ${intelTab==='POSTURE'?'active':''}`}>POSTURE</button>
      </div>

      <div className="list-container">
        {intelTab === "THREATS" ? (
           <div style={{ display: "flex", flexDirection: "column" }}>
              {activeDomain === "CYBER" && signatures.slice(0, 3).map((s, idx) => (
                 <motion.div 
                   key={idx} className="intel-card" 
                   initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                   style={{ borderLeft: `3px solid var(--domain-primary)` }}
                 >
                    <div className="intel-source">THREAT-REGISTRY {s.mitre}</div>
                    <div className="intel-title">{s.category} active in global cluster.</div>
                 </motion.div>
              ))}
              {activeDomain === "GEOINT" && (
                  <>
                    <motion.div className="intel-card" style={{ borderLeft: "4px solid #10b981" }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                       <div className="intel-source" style={{ color: "#10b981" }}>KOREAHERALD.COM <span className="status-tag" style={{ background: "#10b981" }}>MONITORING</span></div>
                       <div className="intel-title">Regional strategic flexibility at risk in North Theater.</div>
                    </motion.div>
                    <motion.div className="intel-card" style={{ borderLeft: "1px solid hsla(162, 84%, 39%, 0.3)" }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                       <div className="intel-source">GEO-INTEL_OPS</div>
                       <div className="intel-title">Military hardware migration detected in Eastern Europe.</div>
                    </motion.div>
                  </>
              )}
              {activeDomain === "FINANCE" && (
                  <>
                    <motion.div className="intel-card" style={{ borderLeft: "4px solid #f59e0b" }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                       <div className="intel-source" style={{ color: "#f59e0b" }}>BLOOMBERG.INT</div>
                       <div className="intel-title">Supply chain volatility index rising across Asian tech nodes.</div>
                    </motion.div>
                    <motion.div className="intel-card" style={{ borderLeft: "1px solid hsla(38, 92%, 50%, 0.3)" }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                       <div className="intel-source" style={{ color: "#f59e0b" }}>MARKET-ALERT <span className="status-tag" style={{ background: "#f59e0b" }}>ELEVATED</span></div>
                       <div className="intel-title">National Debt Clock: Global surplus trajectory failing.</div>
                    </motion.div>
                  </>
              )}
           </div>
        ) : (
           <div className="meter-list" style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 10 }}>
              <div className="meter-row">
                 <div className="meter-label"><span>UKRAINE RECOVERY</span> <strong style={{ color: "white" }}>72%</strong></div>
                 <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "72%", background: "var(--domain-primary)", boxShadow: `0 0 15px var(--domain-glow)` }} /></div>
              </div>
              <div className="meter-row">
                 <div className="meter-label"><span>CHINA STABILITY</span> <strong style={{ color: "white" }}>91%</strong></div>
                 <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "91%", background: "var(--domain-primary)", boxShadow: `0 0 15px var(--domain-glow)` }} /></div>
              </div>
              <div className="meter-row">
                 <div className="meter-label"><span>MARKET LIQUIDITY</span> <strong style={{ color: "#ef4444" }}>45%</strong></div>
                 <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "45%", background: "#ef4444", boxShadow: `0 0 15px hsla(0, 100%, 50%, 0.2)` }} /></div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
