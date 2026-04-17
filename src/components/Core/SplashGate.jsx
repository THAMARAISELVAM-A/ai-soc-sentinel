import React, { useState, useEffect } from 'react';
import { Shield, Lock, Zap, Target, Activity } from 'lucide-react';

/**
 * SplashGate - Tactical Mission Handshake.
 * Simplified without framer-motion.
 */
export function SplashGate({ onEngage }) {
  const [loading, setLoading] = useState(true);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    const interval = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  if (loading) {
    return (
      <div style={{ 
        width: '100vw', height: '100vh', 
        background: '#010208', display: 'flex', 
        flexDirection: 'column', alignItems: 'center', 
        justifyContent: 'center', gap: '24px', zIndex: 20000 
      }}>
        <Shield size={64} color="#0ea5e9" />
        <div style={{ 
          fontFamily: 'JetBrains Mono, monospace', 
          fontSize: '10px', color: '#64748b', 
          letterSpacing: '2px', fontWeight: 900 
        }}>
          ESTABLISHING_SECURE_TUNNEL{dots}
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <Lock size={16} color="#0ea5e9" />
          <Activity size={16} color="#0ea5e9" />
          <Zap size={16} color="#0ea5e9" />
          <Target size={16} color="#0ea5e9" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100vw', height: '100vh', 
      background: '#010208', display: 'flex', 
      flexDirection: 'column', alignItems: 'center', 
      justifyContent: 'center', gap: '48px', zIndex: 20000 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontFamily: 'JetBrains Mono, monospace', 
          fontSize: '12px', color: '#0ea5e9', 
          fontWeight: 900, letterSpacing: '4px', marginBottom: '8px' 
        }}>
          SENTINAL-ARM // TACTICAL OVERSIGHT
        </div>
        <div style={{ 
          fontSize: '48px', fontWeight: 900, color: 'white', 
          letterSpacing: '-2px', textShadow: '0 0 40px rgba(14,165,233,0.4)' 
        }}>
          MISSION_READY
        </div>
      </div>

      <button
        onClick={onEngage}
        style={{
          background: 'transparent',
          border: '1px solid #0ea5e9',
          padding: '20px 64px',
          color: '#0ea5e9',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '14px',
          fontWeight: 900,
          letterSpacing: '4px',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        INITIATE_HANDSHAKE
      </button>

      <div style={{ 
        maxWidth: '400px', textAlign: 'center', 
        opacity: 0.5, fontSize: '9px', color: '#64748b', 
        lineHeight: 1.6, letterSpacing: '1px' 
      }}>
        BY PROCEEDING, YOU AGREE TO THE MASTER-CLASS OPERATIONAL PROTOCOLS. 
        ENCRYPTED BIOMETRIC DATA WILL BE PROCESSED BY THE SENTINEL-ARM COGNITIVE LAYER.
      </div>
    </div>
  );
}