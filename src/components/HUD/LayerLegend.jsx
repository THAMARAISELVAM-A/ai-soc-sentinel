import React from 'react';
import { useSentinelStore } from '../../store/sentinelStore';
import { Minimize2 } from 'lucide-react';
import { 
  Flag, 
  Radio, 
  Waves, 
  Zap, 
  AlertTriangle,
  Globe,
  Lock,
  Cpu,
  Layers
} from 'lucide-react';

const LAYER_CONFIG = [
  { id: 'military', label: 'STRATEGIC_BASES', icon: Flag, color: '#f43f5e' },
  { id: 'cables', label: 'UNDERSEA_CABLES', icon: Waves, color: '#3b82f6' },
  { id: 'conflict', label: 'CONFLICT_ZONES', icon: AlertTriangle, color: '#fbbf24' },
  { id: 'sanctions', label: 'ECONOMIC_SANCTIONS', icon: Lock, color: '#f97316' },
  { id: 'nuclear', label: 'NUCLEAR_SITES', icon: Radio, color: '#10b981' },
  { id: 'natural', label: 'NATURAL_ANOMALIES', icon: Zap, color: '#06b6d4' },
  { id: 'cyber', label: 'APT_TACTICAL_HUBS', icon: Cpu, color: '#8b5cf6' },
  { id: 'waterways', label: 'STRATEGIC_WATERWAYS', icon: Globe, color: '#0ea5e9' },
];

/**
 * LayerLegend - Master Class Tactical Domain Overlays.
 */
export function LayerLegend({ activeLayers, setActiveLayers }) {
  const { togglePanel } = useSentinelStore();
  const toggleLayer = (id) => {
    setActiveLayers(id); // Store expects the ID
  };

  return (
    <div className="glass-panel" style={{ width: '100%', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="panel-label" style={{ marginBottom: 0 }}>
          <Layers size={14} /> STRATEGIC_OVERLAYS
        </div>
        <button onClick={() => togglePanel('layers')} className="btn-console" style={{ padding: '4px 8px' }}>
           <Minimize2 size={12} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '16px' }}>
        {LAYER_CONFIG.map((layer) => {
          const isActive = activeLayers.includes(layer.id);
          const Icon = layer.icon;

          return (
            <motion.div
              key={layer.id}
              whileHover={{ x: 4, background: 'rgba(255,255,255,0.03)' }}
              onClick={() => toggleLayer(layer.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid',
                borderColor: isActive ? 'var(--glass-border)' : 'transparent'
              }}
            >
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: layer.color,
                boxShadow: isActive ? `0 0 12px ${layer.color}` : 'none',
                opacity: isActive ? 1 : 0.2
              }} />
              
              <Icon size={14} style={{ 
                color: isActive ? 'white' : '#64748b',
                transition: '0.2s'
              }} />

              <span style={{
                fontFamily: 'var(--mono-font)',
                fontSize: '9px',
                fontWeight: isActive ? 900 : 700,
                color: isActive ? 'white' : '#64748b',
                flexGrow: 1,
                letterSpacing: '0.5px'
              }}>{layer.label}</span>

              {isActive && (
                <div style={{ width: '3px', height: '12px', borderRadius: '2px', background: 'var(--domain-primary)', boxShadow: '0 0 10px var(--domain-primary)' }} />
              )}
            </motion.div>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ fontSize: '8px', color: '#64748b', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>
           ACTIVE_LAYERS: {activeLayers.length}
         </div>
         <div style={{ fontSize: '8px', color: 'var(--domain-primary)', fontWeight: 900, fontFamily: 'var(--mono-font)' }}>
           L_SEC: OMEGA
         </div>
      </div>
    </div>
  );
}
