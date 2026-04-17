import React from "react";
import { BrainCircuit, Activity, Clock, ShieldCheck } from "lucide-react";

export function PredictivePanel({ forecast }) {
  if (!forecast) return null;

  return (
    <div className="glass-panel predictive-panel" style={{ padding: '32px', borderLeft: "4px solid var(--domain-primary)" }}>
      <div className="panel-label">
        <BrainCircuit size={14} /> AI_PREDICTIVE_FORECAST_CORE
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '8px', color: 'white' }}>
            {forecast.predicted_attack.toUpperCase()}
          </h2>
          <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'var(--mono-font)', display: 'flex', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} /> ETA: {forecast.eta}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--domain-primary)' }}>
              <ShieldCheck size={12} /> CONFIDENCE_HIGH
            </span>
          </div>
          
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', fontStyle: 'italic', fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
            "{forecast.explanation}"
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', letterSpacing: '2px' }}>PROBABILITY_VECT</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--domain-primary)', fontFamily: 'var(--mono-font)' }}>{forecast.probability}%</span>
          </div>
          
          <div style={{ height: '40px', width: '100%', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', position: 'relative', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${forecast.probability}%` }}
               transition={{ duration: 1.5, ease: "easeOut" }}
               style={{ 
                 position: 'absolute', top: 0, left: 0, bottom: 0, 
                 background: 'linear-gradient(90deg, transparent, var(--domain-primary))',
                 boxShadow: '0 0 30px var(--domain-primary)'
               }} 
             />
             <div className="scanning" style={{ position: 'absolute', inset: 0, opacity: 0.3 }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '8px' }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: '4px', background: i <= (forecast.probability/33) ? 'var(--domain-primary)' : 'rgba(255,255,255,0.05)', borderRadius: '2px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
