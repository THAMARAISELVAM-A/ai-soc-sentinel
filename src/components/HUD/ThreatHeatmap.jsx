import React, { useMemo } from 'react';

export function ThreatHeatmap({ feed, activeDomain }) {
  // Generate a mock heatmap based on feed data and random fillers for visual weight
  const data = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const sectors = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'];
    
    return sectors.map(s => ({
      name: s,
      points: hours.map(h => {
        // Find if we have feed items for this "hour" (simulated)
        const density = feed.filter(f => f.is_anomaly && new Date(f.ts).getHours() === h).length;
        return density + Math.floor(Math.random() * 3);
      })
    }));
  }, [feed]);

  const getColor = (val) => {
    if (val > 8) return 'var(--alert-red)';
    if (val > 4) return 'var(--domain-primary)';
    if (val > 0) return 'var(--domain-glow)';
    return 'rgba(255,255,255,0.03)';
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div className="panel-label">Threat Heatmap // 24H Activity</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {data.map(sector => (
          <div key={sector.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '60px', fontSize: '10px', color: '#64748b', fontWeight: 800 }}>{sector.name}</div>
            <div style={{ display: 'flex', flexGrow: 1, gap: '4px' }}>
              {sector.points.map((p, i) => (
                <div 
                  key={i} 
                  style={{ 
                    flexGrow: 1, 
                    height: '20px', 
                    background: getColor(p),
                    borderRadius: '3px',
                    transition: 'var(--transition-smooth)',
                    boxShadow: p > 5 ? `0 0 10px ${getColor(p)}` : 'none'
                  }} 
                  title={`Hour ${i}: Intensity ${p}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '9px', color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>23:59</span>
      </div>
    </div>
  );
}
