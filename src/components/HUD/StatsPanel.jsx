import { Minimize2, Activity, Shield, Zap, Globe } from 'lucide-react';
import { useSentinelStore } from '../../store/sentinelStore';

/**
 * StatsPanel - Master Class SOC Telemetry Dashboard.
 */
export function StatsPanel() {
  const { activeDomain, feed, proxyStatus, togglePanel } = useSentinelStore();
  
  const anomalies = feed.filter(f => f.is_anomaly).length;
  const critical = feed.filter(f => f.severity === 'critical').length;

  const STATS_CONFIG = [
    { label: 'CORE_SIGNALS', value: feed.length, icon: Activity, color: 'var(--domain-primary)' },
    { label: 'THREAT_ANOMALIES', value: anomalies, icon: Shield, color: anomalies > 0 ? 'var(--alert-red)' : '#64748b' },
    { label: 'CRITICAL_FLAGS', value: critical, icon: Zap, color: critical > 0 ? 'var(--alert-red)' : '#64748b' },
    { label: 'UPLINK_STATUS', value: proxyStatus === 'connected' ? 'SECURE' : 'OFFLINE', icon: Globe, color: proxyStatus === 'connected' ? '#10b981' : 'var(--alert-red)' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="panel-label" style={{ marginBottom: 0 }}>
          <Target size={14} /> MISSION_CONTROL_TELEMETRY
        </div>
        <button onClick={() => togglePanel('stats')} className="btn-console" style={{ padding: '4px 8px' }}>
           <Minimize2 size={12} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '24px' }}>
        {STATS_CONFIG.map((stat, idx) => (
          <div key={idx} style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <stat.icon size={16} style={{ color: stat.color }} />
                <div style={{ fontSize: '7px', color: '#64748b', fontWeight: 900, letterSpacing: '1px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                  DOM_{activeDomain}
                </div>
             </div>
             
             <div style={{ fontSize: '24px', fontWeight: 900, color: 'white', fontFamily: 'var(--mono-font)', letterSpacing: '-1px' }}>
               {stat.value}
             </div>
             
             <div style={{ fontSize: '9px', fontWeight: 800, color: '#64748b', marginTop: '4px', letterSpacing: '1px' }}>
               {stat.label}
             </div>

             <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '2px', background: stat.color, opacity: 0.4 }} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <Cpu size={14} color="var(--domain-primary)" />
           <span style={{ fontSize: '9px', color: '#f8fafc', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>CPU_LOAD</span>
        </div>
        <div style={{ flexGrow: 1 }}>
           <div style={{ height: '3px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '1.5px', overflow: 'hidden' }}>
              <div className="scanning" style={{ height: '100%', width: '42%', background: 'var(--domain-primary)', boxShadow: '0 0 10px var(--domain-primary)' }} />
           </div>
        </div>
        <span style={{ fontSize: '9px', color: 'var(--domain-primary)', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>42%</span>
      </div>

      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '10px' }}>
        <Info size={12} />
        <span style={{ letterSpacing: '0.05em' }}>SENTINEL_AI_THROTTLING_ACTIVE</span>
      </div>
    </div>
  );
}
