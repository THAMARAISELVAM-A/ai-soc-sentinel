import React from "react";

export function IntelligencePanel({ intelTab, setIntelTab, activeDomain, signatures }) {
  return (
    <div className="glass-panel" style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
      <div className="tab-bar">
         <button onClick={()=>setIntelTab("THREATS")} className={`tab-btn ${intelTab==='THREATS'?'active':''}`}>LIVE INTELLIGENCE</button>
         <button onClick={()=>setIntelTab("POSTURE")} className={`tab-btn ${intelTab==='POSTURE'?'active':''}`}>POSTURE</button>
      </div>

      <div className="list-container">
        {intelTab === "THREATS" ? (
           <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {activeDomain === "CYBER" && signatures.slice(0, 3).map(s => (
                 <div className="intel-card" key={s.id}>
                    <div className="intel-source">MITRE {s.mitre}</div>
                    <div className="intel-title">{s.category} patterns active in global cluster.</div>
                 </div>
              ))}
              {activeDomain === "GEOINT" && (
                  <>
                    <div className="intel-card" style={{ borderLeft: "4px solid #10b981" }}>
                       <div className="intel-source" style={{ color: "#10b981" }}>KOREAHERALD.COM <span className="status-tag" style={{ background: "#10b981" }}>MONITORING</span></div>
                       <div className="intel-title">Regional strategic flexibility at risk in North Theater.</div>
                    </div>
                    <div className="intel-card">
                       <div className="intel-source">INTEL-OPS</div>
                       <div className="intel-title">Military hardware migration detected in Eastern Europe.</div>
                    </div>
                  </>
              )}
              {activeDomain === "FINANCE" && (
                  <>
                    <div className="intel-card" style={{ borderLeft: "4px solid #f59e0b" }}>
                       <div className="intel-source" style={{ color: "#f59e0b" }}>BLOOMBERG.INT</div>
                       <div className="intel-title">Supply chain volatility index rising across Asian tech nodes.</div>
                    </div>
                    <div className="intel-card">
                       <div className="intel-source" style={{ color: "#f59e0b" }}>MARKET-ALERT <span className="status-tag" style={{ background: "#f59e0b" }}>ELEVATED</span></div>
                       <div className="intel-title">National Debt Clock: Global surplus trajectory failing.</div>
                    </div>
                  </>
              )}
           </div>
        ) : (
           <div className="meter-list">
              <div className="meter-row">
                 <div className="meter-label"><span>UKRAINE RECOVERY</span> <strong>72%</strong></div>
                 <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "72%", background: "var(--domain-primary)" }} /></div>
              </div>
              <div className="meter-row">
                 <div className="meter-label"><span>CHINA STABILITY</span> <strong>91%</strong></div>
                 <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "91%", background: "var(--domain-primary)" }} /></div>
              </div>
              <div className="meter-row">
                 <div className="meter-label"><span>MARKET LIQUIDITY</span> <strong>45%</strong></div>
                 <div className="meter-bar-bg"><div className="meter-bar-fill" style={{ width: "45%", background: "#ef4444" }} /></div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
