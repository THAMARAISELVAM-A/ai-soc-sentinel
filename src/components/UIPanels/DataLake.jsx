import React from "react";
import { Search } from "lucide-react";
import { SEV_COLOR } from "../../constants/threatData.js";

export function DataLake({ filteredFeed, anomalies, searchQuery, setSearchQuery, activeDomain }) {
  const panelTitle = activeDomain === "CYBER" ? "IN-MEMORY DATA LAKE" :
                     activeDomain === "FINANCE" ? "GLOBAL MARKET SIGNALS" : 
                     "GEOPOLITICAL INTELLIGENCE";

  return (
    <div className="wm-panel-right">
      <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="panel-label">{panelTitle}</div>
          <div className="badge-tag">{anomalies} SIGNALS DETECTED</div>
        </div>

        {/* SPL Search Box */}
        <div className="splunk-input-box">
          <Search size={14} color="var(--domain-primary)" style={{ position: "absolute", top: 12, left: 12 }} />
          <input 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="SPL > severity:critical | filter nodes" 
          />
        </div>

        <div className="list-container">
          {filteredFeed.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, opacity: 0.3, fontSize: 10, letterSpacing: "0.2em", fontFamily: "var(--mono-font)" }}>SYNCHRONIZING FEED...</div>
          ) : (
            filteredFeed.map(f => (
              <div key={f.id} className="live-item" style={{ borderLeftColor: f.is_anomaly ? SEV_COLOR[f.severity] : 'var(--domain-primary)' }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="ts">{new Date(f.ts).toLocaleTimeString()}</span>
                  <span className="type" style={{ color: f.is_anomaly ? SEV_COLOR[f.severity] : 'var(--domain-primary)' }}>{f.category || f.threat_type}</span>
                </div>
                <div className="content">{f.log}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
