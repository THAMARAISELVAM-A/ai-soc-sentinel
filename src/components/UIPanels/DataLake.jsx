import React, { useState } from 'react';
import { Download, Crosshair, ShieldAlert, Activity, Eye, Search, Terminal } from 'lucide-react';

/**
 * DataLake - Master Class Forensic Intelligence Feed.
 */
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
    a.download = `sentinel_forensics_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleTrack = async (ip) => {
    setTrackingIp(ip);
    try {
      const res = await fetch(`https://freeipapi.com/api/json/${ip}`);
      const data = await res.json();
      if(onTrackIp && data.latitude) {
        onTrackIp({ ...data, lat: data.latitude, lon: data.longitude });
      }
    } catch { }
    setTrackingIp(null);
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── TACTICAL HEADER ── */}
      <div style={{ padding: '32px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
           <div className="panel-label" style={{ margin: 0 }}>
             <Activity size={14} /> FORENSIC_SIGNAL_LAKE
           </div>
           <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <div style={{ background: anomalies > 0 ? 'var(--alert-red)' : 'rgba(255,255,255,0.05)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '8px', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>
                {anomalies}_ANOMALIES_DETECTED
              </div>
              <div style={{ background: 'var(--domain-border)', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '8px', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>
                OPERATIONAL_DOMAIN: {activeDomain}
              </div>
           </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
            <input 
              type="text" 
              placeholder="SEARCH_TELEMETRY..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="input-tactical"
              style={{ paddingLeft: '36px', width: '280px', height: '40px' }} 
            />
          </div>
          <button className="btn-console" onClick={exportCsv} style={{ height: '40px' }}>
            <Download size={14} /> EXPORT_COV
          </button>
        </div>
      </div>
      
      {/* ── SIGNAL STREAM ── */}
      <div className="custom-scrollbar" style={{ padding: '32px', flexGrow: 1, overflowY: 'auto' }}>
        <AnimatePresence initial={false}>
          {filteredFeed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '120px', color: '#64748b', fontFamily: 'var(--mono-font)', letterSpacing: '4px', fontSize: '11px', opacity: 0.5 }}>
              NO_SIGNALS_ACQUIRED_IN_CURRENT_WINDOW
            </div>
          ) : (
            filteredFeed.map((item, i) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="live-item" 
                style={{ 
                  borderLeft: `2px solid ${item.is_anomaly ? 'var(--alert-red)' : 'var(--domain-primary)'}`,
                  padding: '24px',
                  marginBottom: '16px',
                  background: 'rgba(255,255,255,0.015)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.is_anomaly ? <ShieldAlert size={14} color="var(--alert-red)" className="scanning" /> : <Terminal size={14} color="var(--domain-primary)" />}
                    <span style={{ color: item.is_anomaly ? 'var(--alert-red)' : 'white', fontSize: '12px', fontWeight: 900, fontFamily: 'var(--mono-font)', letterSpacing: '1px' }}>
                      {item.threat_type?.toUpperCase() || 'CORE_SIGNAL'}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--mono-font)', display: 'flex', gap: '16px', fontWeight: 700 }}>
                    <span style={{ opacity: 0.6 }}>{new Date(item.ts).toLocaleTimeString()}</span>
                    <span style={{ color: item.is_anomaly ? 'var(--alert-red)' : 'var(--domain-primary)' }}>
                      LVL_{item.severity?.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div style={{ fontSize: '11px', lineHeight: '1.7', fontFamily: 'var(--mono-font)', color: '#cbd5e1', background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '4px', border: '1px solid var(--glass-border)' }}>
                  {item.log}
                </div>

                {item.is_anomaly && (
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {item.explanation && (
                       <div style={{ padding: '12px 16px', borderLeft: '2px solid var(--alert-red)', background: 'rgba(244, 63, 94, 0.05)', fontSize: '11px', color: '#fca5a5', lineHeight: '1.4' }}>
                          <span style={{ color: 'var(--alert-red)', fontWeight: 900, marginRight: '10px' }}>AI_FORENSICS:</span>
                          {item.explanation}
                       </div>
                    )}
                    
                    {item.attacker_ip && (
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 16px', borderRadius: '4px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--alert-red)', fontWeight: 800, fontFamily: 'var(--mono-font)' }}>
                            <Eye size={12} /> IP_ORIGIN: {item.attacker_ip}
                         </div>
                         <button 
                           onClick={() => handleTrack(item.attacker_ip)} 
                           disabled={trackingIp === item.attacker_ip}
                           className="btn-console"
                           style={{ padding: '6px 12px', fontSize: '9px' }}>
                           <Crosshair size={10} /> {trackingIp === item.attacker_ip ? 'CORRELATING...' : 'TRACE_ORIGIN'}
                         </button>
                       </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
