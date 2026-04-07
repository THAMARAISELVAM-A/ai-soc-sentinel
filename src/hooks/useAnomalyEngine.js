import { useState, useCallback, useEffect } from "react";
import { NORMAL_LOGS, ATTACK_LOGS, MOCK_COORD, LAYERS_DB, SEV_COLOR } from "../constants/threatData";

export function useAnomalyEngine({ apiKey, selectedModel, simulationMode, signatures, activeDomain }) {
  const [feed, setFeed] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);
  const [liveMode, setLiveMode] = useState(true);
  const [liveSpeed, setLiveSpeed] = useState(4000);

  const buildSystemPrompt = useCallback(() => {
    const active = signatures.filter(s => s.active);
    return `You are a World Monitor Intelligence Engine (${activeDomain} domain).
CONTEXT: Cybersecurity, Global Markets, and Geopolitical instability.
TASK: Analyze the provided intel string and return a JSON result.
SIGNATURES: ${active.map(s => s.category).join(", ")}
RESPONSE JSON: { "is_anomaly": true/false, "threat_type": "string", "severity": "critical/high/medium/low/normal", "explanation": "string", "attacker_ip": "192.168.x.x string", "iocs": [] }`;
  }, [signatures, activeDomain]);

  const analyzeLog = useCallback(async (logText) => {
    if (simulationMode || !apiKey) {
      await new Promise(r => setTimeout(r, 400));
      const isSus = /union|failed|curl|instability|crash|strike|military/i.test(logText);
      return { 
        is_anomaly: isSus, 
        threat_type: isSus ? `${activeDomain} ALERT` : "NORMAL TRAFFIC", 
        severity: isSus ? "high" : "normal", 
        attacker_ip: isSus ? `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}` : null,
        log: logText, ts: Date.now(), id: Date.now() + Math.random() 
      };
    }
    // ── LIVE ANTHROPIC AI ENGINE ────────────────────────────
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", 
        headers: { 
          "Content-Type": "application/json", 
          "x-api-key": apiKey, 
          "anthropic-version": "2023-06-01", 
          "anthropic-dangerous-direct-browser-access": "true" 
        },
        body: JSON.stringify({ 
          model: selectedModel, 
          max_tokens: 300, 
          system: buildSystemPrompt(), 
          messages: [{ role: "user", content: `TELEMETRY LOG: "${logText}"` }] 
        })
      });
      const data = await response.json();
      const raw = data.content?.find(c => c.type === "text")?.text || "{}";
      const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
      return { 
        ...parsed, 
        log: logText, 
        ts: Date.now(), 
        id: Math.random(),
        severity: parsed.severity?.toLowerCase() || "normal"
      };
    } catch(e) { 
      console.error("AI Analysis Failed", e); 
      return { is_anomaly: false, threat_type: "AI_OFFLINE", severity: "normal", log: logText, id: Date.now(), ts: Date.now() };
    }
  }, [apiKey, simulationMode, activeDomain, selectedModel, buildSystemPrompt]);

  const toggleLive = useCallback(() => {
    setLiveMode(prev => !prev);
  }, []);

  useEffect(() => {
    if (!liveMode) return;

    const interval = setInterval(async () => {
      let logs = (activeDomain === "CYBER") ? [...NORMAL_LOGS, ...ATTACK_LOGS] :
                 (activeDomain === "FINANCE") ? ["STOCK CRASH: $AAPL -12%", "NASDAQ VOLATILITY RISING", "DEBT LIMIT BREACHED", "MARKET STABLE"] :
                 ["MILITARY MOVEMENT: DNIEPER RIVER", "AIRSPACE CLOSURE: MEA", "STABILITY SCORE: KOREA DECREASE", "ROUTINE PATROL"];

      const log = logs[Math.floor(Math.random() * logs.length)];
      const result = await analyzeLog(log);
      setFeed(prev => [result, ...prev].slice(0, 150));

      if (result.is_anomaly) {
        const originURL = MOCK_COORD[Math.floor(Math.random() * MOCK_COORD.length)];
        const targetURL = LAYERS_DB.centers[Math.floor(Math.random() * LAYERS_DB.centers.length)] || MOCK_COORD[0];
        setArcs(prev => [...prev, { startLat: originURL.lat, startLng: originURL.lng, endLat: targetURL.lat, endLng: targetURL.lng, color: SEV_COLOR[result.severity] }].slice(-25));
        if (result.severity === "critical") {
          setRings(prev => [...prev, { lat: targetURL.lat, lng: targetURL.lng, color: "#ef4444", maxR: 8 }].slice(-10));
          
          // Autonomous Audio Alert
          try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.3);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
          } catch { /* Ignore AudioContext restrictions before user gesture */ }
        }
      }
    }, liveSpeed);

    return () => clearInterval(interval);
  }, [liveMode, liveSpeed, analyzeLog, activeDomain]);

  return { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed, analyzeLog };
}
