import React, { useState, useEffect } from "react";

export function StatsPanel({ activeDomain, signatures, simulationMode }) {
  const [liveSig, setLiveSig] = useState("SYNCING...");

  useEffect(() => {
    if (activeDomain === 'FINANCE') {
      const fetchPrice = async () => {
        try {
          const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
          const data = await res.json();
          setLiveSig(`BTC: $${Math.floor(data.bpi.USD.rate_float).toLocaleString()}`);
        } catch {
          setLiveSig("OFFLINE");
        }
      };
      fetchPrice();
      const interval = setInterval(fetchPrice, 30000); // 30s refresh
      return () => clearInterval(interval);
    } else {
      // For Cyber/GeoInt, simulated signal based on current domain stressors
      setLiveSig(activeDomain === 'CYBER' ? "SIG: 104.2 Tbps" : "GEO: 0.94 STAB");
    }
  }, [activeDomain]);

  return (
    <div className="wm-panel-bottom" style={{ gap: '4rem' }}>
       <div className="stat-box">
          <span>OPERATIONAL MODE</span>
          <strong style={{ color: simulationMode ? '#94a3b8' : '#10b981' }}>
            {simulationMode ? 'SIMULATION' : 'LIVE UPLINK'}
          </strong>
       </div>
       <div className="stat-box">
          <span>{activeDomain} SIGNAL</span>
          <strong style={{ color: 'var(--domain-primary)' }}>{liveSig}</strong>
       </div>
       <div className="stat-box">
          <span>ACTIVE SIGNATURES</span>
          <strong>{signatures.filter(s => s.active).length}</strong>
       </div>
       <div className="stat-box">
          <span>SIGNAL LATENCY</span>
          <strong style={{ opacity: 0.8 }}>{simulationMode ? '0ms' : '12ms'}</strong>
       </div>
       <div className="stat-box">
          <span>SYSTEM HEALTH</span>
          <strong style={{ color: '#10b981' }}>NOMINAL</strong>
       </div>
    </div>
  );
}
