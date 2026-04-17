import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

/**
 * Sentinel Store - The central mission-control state for the platform.
 * Managed via Zustand for high-performance reactive updates.
 * Upgraded for Master Class Cloud synchronization via Supabase.
 */
export const useSentinelStore = create(
  persist(
    (set, get) => ({
      // Operational State
      activeDomain: 'CYBER',
      simulationMode: true,
      liveMode: true,
      liveSpeed: 4000,
      
      // Feature Toggles (Layers)
      activeLayers: ['military', 'cables', 'conflict', 'sanctions', 'nuclear', 'natural', 'cyber', 'waterways'],
      
      // Intelligence Feeds
      feed: [],
      arcs: [],
      rings: [],

      // HUD Orchestration
      panels: {
        stats: true,
        risk: true,
        intel: true,
        layers: true
      },
      
      // API Configurations
      apiKey: '',
      selectedModel: 'claude-3-5-sonnet-latest',
      threatFoxKey: '',
      otxKey: '',
      proxyStatus: 'DISCONNECTED',
      
      // ── CLOUD ORCHESTRATION ────────────────────────────────────
      syncCloud: async () => {
        if (!supabase) {
          console.warn("🛡️ SENTINEL_CLOUD_OFFLINE: Supabase not initialized. Running in local mode.");
          return null;
        }
        
        const { activeDomain } = get();

        try {
          // 1. Hydrate Initial Mission Feed
          const { data, error } = await supabase
            .from('sentinel_signals')
            .select('*')
            .eq('sector', activeDomain)
            .order('ts', { ascending: false })
            .limit(100);

          if (error) {
            console.error("🔴 Cloud sync error:", error.message);
            set({ proxyStatus: 'ERROR' });
            return null;
          }

          if (!error && data) {
            // Autonomous Seeding for 'Generous' Experience
            if (data.length === 0) {
              console.log("🛡️ Master Class Seeding: Initializing Tactical Stream...");
              try {
                const seed = [
                  { ts: Date.now(), sector: activeDomain, severity: 'critical', is_anomaly: true, threat_type: 'DOMINATION_SIG', log_content: 'SENTINEL_UPLINK: CLOUD_HANDSHAKE_COMPLETE', explanation: 'Initial mission synchronization successful.' },
                  { ts: Date.now() - 5000, sector: activeDomain, severity: 'normal', is_anomaly: false, threat_type: 'HB_SIGNAL', log_content: 'CORE_HEARTBEAT_STABLE', explanation: 'System nominal.' }
                ];
                const { error: seedError } = await supabase.from('sentinel_signals').insert(seed);
                if (seedError) console.warn("Seed insert failed:", seedError.message);
              } catch (seedErr) {
                console.warn("Seeding failed:", seedErr);
              }
            }
            
            set({ 
              feed: data.map(d => ({
                ...d,
                log: d.log_content 
              })),
              proxyStatus: 'CONNECTED'
            });
          }

          // 2. Real-time Subscription Uplink
          const subscription = supabase
            .channel('sentinel_live_telemetry')
            .on('postgres_changes', { 
              event: 'INSERT', 
              schema: 'public', 
              table: 'sentinel_signals',
              filter: `sector=eq.${activeDomain}`
            }, (payload) => {
              const newSignal = { ...payload.new, log: payload.new.log_content };
              
              // MASTER CLASS AUDIO FEEDBACK
              try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.type = 'sine'; 
                osc.frequency.setValueAtTime(newSignal.is_anomaly ? 880 : 440, ctx.currentTime);
                gain.gain.setValueAtTime(0.02, ctx.currentTime);
                osc.start(); 
                osc.stop(ctx.currentTime + 0.15);
              } catch {
                // Silently fail audio - not critical
              }

              set((state) => ({
                feed: [newSignal, ...state.feed].slice(0, 400)
              }));
            })
            .subscribe((status) => {
              if (status === 'SUBSCRIBED') {
                console.log("📡 Real-time telemetry channel active");
              } else if (status === 'CHANNEL_ERROR') {
                console.error("🔴 Channel subscription error");
                set({ proxyStatus: 'ERROR' });
              }
            });

          set({ proxyStatus: 'CONNECTED' });
          return () => {
            supabase.removeChannel(subscription);
          };
        } catch (err) {
          console.error("🔴 Sync Cloud exception:", err);
          set({ proxyStatus: 'ERROR' });
          return null;
        }
      },

      // Actions
      setProxyStatus: (status) => set({ proxyStatus: status }),
      setActiveDomain: (domain) => set({ activeDomain: domain }),
      togglePanel: (panel) => set((state) => ({
        panels: { ...state.panels, [panel]: !state.panels[panel] }
      })),
      toggleLayer: (layer) => set((state) => ({
        activeLayers: state.activeLayers.includes(layer)
          ? state.activeLayers.filter(l => l !== layer)
          : [...state.activeLayers, layer]
      })),
      
      setLiveMode: (live) => set({ liveMode: live }),
      setLiveSpeed: (speed) => set({ liveSpeed: speed }),
      setSimulationMode: (mode) => set({ simulationMode: mode }),
      
      setFeed: (updater) => set((state) => ({
        feed: typeof updater === 'function' ? updater(state.feed) : updater
      })),
      
      addArc: (arc) => set((state) => ({
        arcs: [...state.arcs, arc].slice(-30)
      })),
      
      addRing: (ring) => set((state) => ({
        rings: [...state.rings, ring].slice(-15)
      })),
      
      setConfig: (config) => set((state) => ({ ...state, ...config })),
    }),
    {
      name: 'sentinel-mission-config',
      partialize: (state) => ({
        activeDomain: state.activeDomain,
        activeLayers: state.activeLayers,
        simulationMode: state.simulationMode,
        apiKey: state.apiKey,
        selectedModel: state.selectedModel,
        threatFoxKey: state.threatFoxKey,
        otxKey: state.otxKey,
        proxyStatus: state.proxyStatus
      }),
    }
  )
);