import React, { useState } from 'react';
import { Download, Crosshair } from 'lucide-react';

export function DataLake({ filteredFeed, anomalies, searchQuery, setSearchQuery, activeDomain, onTrackIp }) {
  const [trackingIp, setTrackingIp] = useState(null);

  const exportCsv = () => {
    if(!filteredFeed.length) return;
    const header = "Timestamp,Severity,Threat Type,Attacker IP,Explanation,Log Data\n";
    const csv = filteredFeed.map(f => {
      const ts = new Date(f.ts).toISOString();
      return `${ts},${f.severity},"${f.threat_type || ''}","${f.attacker_ip || ''}","${f.explanation || ''}","${f.log.replace(/"/g, '""')}"`;
    }).join("\n");
    
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel_export_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleTrack = async (ip) => {
    setTrackingIp(ip);
    try {
      const res = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await res.json();
      if(onTrackIp && data.lat) {
        onTrackIp(data);
      } else {
        alert(`Geolocation failed for IP: ${ip}`);
      }
    } catch { 
      alert(`API Limit reached or network error for IP: ${ip}`);
    }
    setTrackingIp(null);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
           <h3 style={{ margin: 0, color: 'var(--domain-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
             DATA LAKE
             <span className="status-tag" style={{ background: 'var(--alert-red)' }}>{anomalies} FLAGS</span>
           </h3>
           <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>Real-time {activeDomain} telemetry feed.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-console" onClick={exportCsv} title="Download CSV Report">
            <Download size={14} /> EXPORT
          </button>
          <div className="splunk-input-box" style={{ marginBottom: 0, width: '220px' }}>
             <input type="text" placeholder="Search SPL..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ height: '36px' }} />
          </div>
        </div>
      </div>
      
      <div className="list-container" style={{ padding: '20px 24px' }}>
        {filteredFeed.length === 0 ? (
          <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '40px' }}>No logs match current filter.</div>
        ) : (
          filteredFeed.map((item) => (
            <div key={item.id} className="live-item" style={{ borderLeftColor: item.is_anomaly ? 'var(--alert-red)' : 'var(--domain-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong style={{ color: item.is_anomaly ? '#ef4444' : 'white', fontSize: '12px', letterSpacing: '0.05em' }}>
                  {item.threat_type || 'TELEMETRY'}
                </strong>
                <span style={{ fontSize: '10px', color: '#666', fontFamily: 'var(--mono-font)' }}>
                  {new Date(item.ts).toLocaleTimeString()}
                </span>
              </div>
              <div style={{ fontSize: '13px', lineHeight: '1.5', wordBreak: 'break-all', fontFamily: 'var(--mono-font)', opacity: 0.8 }}>
                {item.log}
              </div>
              {item.is_anomaly && item.explanation && (
                <div style={{ marginTop: '8px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px', fontSize: '12px', color: '#ef4444' }}>
                  <strong>AI ANALYSIS:</strong> {item.explanation}
                </div>
              )}
              {item.attacker_ip && (
                <div style={{ marginTop: '10px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--mono-font)', fontSize: '11px', color: 'var(--domain-primary)' }}>IP: {item.attacker_ip}</span>
                  <button 
                    onClick={() => handleTrack(item.attacker_ip)} 
                    disabled={trackingIp === item.attacker_ip}
                    style={{ background: 'transparent', border: '1px solid var(--domain-primary)', color: 'var(--domain-primary)', padding: '4px 8px', fontSize: '10px', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Crosshair size={10} /> {trackingIp === item.attacker_ip ? 'TRACING...' : 'REVERSE TRACK'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
