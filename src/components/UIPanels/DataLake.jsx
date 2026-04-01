import React from "react";
import { Search } from "lucide-react";
import { SEV_COLOR } from "../../constants/threatData";

export function DataLake({ filteredFeed, anomalies, searchQuery, setSearchQuery }) {
  return (
    <div className="wm-panel-right" style={{ width: 450 }}>
      <div className="glass-panel" style={{ padding: 16, display: "flex", flexDirection: "column", height: "100%", background: "rgba(10, 15, 20, 0.75)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#60a5fa", fontWeight: 800, letterSpacing: "0.15em" }}>IN-MEMORY DATA LAKE</div>
          <div className="badge" style={{ background: "rgba(239,68,68,0.2)", color: "#fca5a5" }}>{anomalies} ALERTS</div>
        </div>

        {/* SPL Search Box */}
        <div style={{ marginBottom: 12, position: "relative" }}>
          <Search size={14} color="#3b82f6" style={{ position: "absolute", top: 9, left: 10 }} />
          <input 
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="SPL > severity:critical | grep sql" 
            style={{ paddingLeft: "32px!important", fontFamily: "monospace", color: "#60a5fa!important", background: "rgba(0,0,0,0.8)!important", border: "1px solid #1e3a5f!important" }} 
          />
        </div>

        <div className="list-container" style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {filteredFeed.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#8b949e", fontSize: 11, fontStyle: "italic", opacity: 0.6 }}>Executing remote query projection...</div>
          ) : (
            filteredFeed.map(f => (
              <div key={f.id} className="live-item" style={{ padding: "8px 10px", background: "rgba(0,0,0,0.6)", borderLeft: `2px solid ${SEV_COLOR[f.severity]}`, borderRadius: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: "#8b949e", fontFamily: "monospace" }}>{new Date(f.ts).toLocaleTimeString()}</span>
                  <span style={{ fontSize: 10, color: SEV_COLOR[f.severity], fontWeight: 800, letterSpacing: "0.05em" }}>{f.threat_type}</span>
                </div>
                <div style={{ fontSize: 11, color: f.is_anomaly ? "#fca5a5" : "#c9d1d9", wordBreak: "break-all", fontFamily: "monospace", opacity: 0.9 }}>{f.log}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
