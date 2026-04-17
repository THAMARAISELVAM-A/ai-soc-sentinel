import React, { useState, useEffect } from 'react';
import { Shield, Lock, Zap, Target, Activity } from 'lucide-react';

/**
 * SplashGate - Tactical Mission Handshake.
 * Satisfies browser AudioContext policies while setting the military-grade tone.
 */
export function SplashGate({ onEngage }) {
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3500);
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  return (
    <div className="boot-wrapper" style={{ zIndex: 20000, background: '#010208' }}>
      <AnimatePresence>
        {loading ? (
          <motion.div 
            key="pre-load"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}
          >
            <div className="scanning">
              <Shield size={64} color="var(--domain-primary)" />
            </div>
            <div style={{ fontFamily: 'var(--mono-font)', fontSize: '10px', color: '#64748b', letterSpacing: '2px', fontWeight: 900 }}>
              ESTABLISHING_SECURE_TUNNEL{dots}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
               {[Lock, Activity, Zap, Target].map((Icon, i) => (
                 <motion.div
                   key={i}
                   animate={{ opacity: [0.2, 1, 0.2] }}
                   transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                 >
                   <Icon size={16} color="var(--domain-primary)" />
                 </motion.div>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="engage"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px' }}
          >
            <div style={{ textAlign: 'center' }}>
               <h1 style={{ fontSize: '12px', color: 'var(--domain-primary)', fontWeight: 900, letterSpacing: '4px', marginBottom: '8px', fontFamily: 'var(--mono-font)' }}>
                 SENTINEL-ARM // TACTICAL OVERSIGHT
               </h1>
               <div style={{ fontSize: '48px', fontWeight: 900, color: 'white', letterSpacing: '-2px', textShadow: '0 0 40px var(--domain-glow)' }}>
                 MISSION_READY
               </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px var(--domain-glow)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onEngage}
              style={{
                background: 'transparent',
                border: '1px solid var(--domain-primary)',
                padding: '20px 64px',
                color: 'var(--domain-primary)',
                fontFamily: 'var(--mono-font)',
                fontSize: '14px',
                fontWeight: 900,
                letterSpacing: '4px',
                cursor: 'pointer',
                borderRadius: '4px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div className="scanning" style={{ position: 'absolute', inset: 0, background: 'var(--domain-glow)', opacity: 0.1 }} />
              INITIATE_HANDSHAKE
            </motion.button>

            <div style={{ maxWidth: '400px', textAlign: 'center', opacity: 0.5, fontSize: '9px', color: '#64748b', lineHeight: 1.6, letterSpacing: '1px' }}>
              BY PROCEEDING, YOU AGREE TO THE MASTER-CLASS OPERATIONAL PROTOCOLS. 
              ENCRYPTED BIOMETRIC DATA WILL BE PROCESSED BY THE SENTINEL-ARM COGNITIVE LAYER.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
