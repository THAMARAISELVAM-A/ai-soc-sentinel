import React, { useMemo } from "react";
import { Search, Activity } from "lucide-react";
import { SEV_COLOR } from "../../constants/threatData.js";

export function DataLake({ filteredFeed, anomalies, searchQuery, setSearchQuery, activeDomain }) {
  const panelTitle = activeDomain === "CYBER" ? "IN-MEMORY DATA LAKE" :
                     activeDomain === "FINANCE" ? "GLOBAL MARKET SIGNALS" : 
                     "GEOPOLITICAL INTELLIGENCE";

  const totalPackets = useMemo(() => {
    return 1420 + (filteredFeed.length * 68) % 3000;
  }, [filteredFeed]);

  return (
    <div className="wm-panel-right">
      <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div className="panel-label" style={{ marginBottom: 6 }}>{panelTitle}</div>
            <div style={{ fontSize: 10, color: 'hsla(0, 0%, 100%, 0.3)', fontFamily: 'var(--mono-font)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Activity size={12} /> {totalPackets} PKTS/S REAL-TIME
            </div>
          </div>
          <div className="badge-tag" style={{ border: '1px solid', padding: '4px 10px', fontSize: '9px', background: anomalies > 0 ? 'hsla(0, 100%, 50%, 0.1)' : 'hsla(162, 84%, 39%, 0.1)', borderColor: anomalies > 0 ? '#ef4444' : '#10b981', color: anomalies > 0 ? '#ef4444' : '#10b981' }}>
            {anomalies} THREATS DETECTED
          </div>
        </div>

        <div className="splunk-input-box">
          <Search size={14} color="var(--domain-primary)" style={{ position: "absolute", top: 18, left: 14, opacity: 0.6 }} />
          <input 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="SPL > severity:critical | filter nodes" 
            style={{ paddingLeft: 42, background: 'rgba(0,0,0,0.8)' }}
          />
        </div>

        <div className="list-container">
          {filteredFeed.length === 0 ? (
            <div style={{ textAlign: "center", padding: 80, opacity: 0.4, fontSize: 11, letterSpacing: "0.25em", fontFamily: "var(--mono-font)" }}>SYNCHRONIZING FEED...</div>
          ) : (
            filteredFeed.map(f => (
              <div key={f.id} className="live-item" style={{ borderLeftColor: f.is_anomaly ? SEV_COLOR[f.severity] : 'var(--domain-primary)', background: f.is_anomaly ? 'hsla(0, 100%, 50%, 0.03)' : 'transparent' }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span className="ts" style={{ fontSize: 10, opacity: 0.4, fontFamily: 'var(--mono-font)' }}>{new Date(f.ts).toLocaleTimeString()}</span>
                  <span className="type" style={{ fontSize: 10, fontWeight: 900, color: f.is_anomaly ? SEV_COLOR[f.severity] : 'var(--domain-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{f.category || f.threat_type}</span>
                </div>
                <div className="content" style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.5, fontFamily: 'var(--heading-font)' }}>{f.log}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
