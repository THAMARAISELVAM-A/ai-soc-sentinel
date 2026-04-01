import React from "react";
import { Search, Terminal } from "lucide-react";
import { SEV_COLOR } from "../../constants/threatData";

export function DataLake({ filteredFeed, anomalies, searchQuery, setSearchQuery }) {
  return (
    <div className="wm-panel-right">
      <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", height: "100%", background: "rgba(10, 15, 20, 0.75)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div className="panel-label">IN-MEMORY DATA LAKE</div>
          <div className="badge-tag" style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.3)" }}>{anomalies} ALERTS</div>
        </div>

        {/* SPL Search Box */}
        <div className="splunk-input-box">
          <Search size={14} color="#3b82f6" style={{ position: "absolute", top: 12, left: 12 }} />
          <input 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="SPL > severity:critical | grep sql" 
          />
        </div>

        <div className="list-container">
          {filteredFeed.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, opacity: 0.3, fontSize: 10, letterSpacing: "0.2em" }}>QUERYING REMOTE INDEX...</div>
          ) : (
            filteredFeed.map(f => (
              <div key={f.id} className="live-item" style={{ borderLeftColor: SEV_COLOR[f.severity] }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span className="ts">{new Date(f.ts).toLocaleTimeString()}</span>
                  <span className="type" style={{ color: SEV_COLOR[f.severity] }}>{f.threat_type}</span>
                </div>
                <div className="content">{f.log}</div>
                {f.is_anomaly && (
                   <div style={{ marginTop: 8, fontSize: 9, color: SEV_COLOR[f.severity], opacity: 0.7, fontStyle: "italic" }}>
                     // MITRE ENGAGED: T1059.001
                   </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
