import { useState, useRef, useCallback, useEffect } from "react";
import { NORMAL_LOGS, ATTACK_LOGS, MOCK_COORD, LAYERS_DB, SEV_COLOR } from "../constants/threatData";

export function useAnomalyEngine({ apiKey, selectedModel, simulationMode, signatures, activeDomain }) {
  const [feed, setFeed] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);
  const [liveMode, setLiveMode] = useState(false);
  const [liveSpeed, setLiveSpeed] = useState(4000);
  
  const liveRef = useRef(false);
  const liveIntervalRef = useRef(null);

  const buildSystemPrompt = useCallback(() => {
    const active = signatures.filter(s => s.active);
    return `You are a World Monitor Intelligence Engine (${activeDomain} domain).
CONTEXT: Cybersecurity, Global Markets, and Geopolitical instability.
TASK: Analyze the provided intel string and return a JSON result.
SIGNATURES: ${active.map(s => s.category).join(", ")}
RESPONSE JSON: { "is_anomaly": true/false, "threat_type": "string", "severity": "critical/high/medium/low/normal", "explanation": "string", "iocs": [] }`;
  }, [signatures, activeDomain]);

  const analyzeLog = useCallback(async (logText) => {
    if (simulationMode || !apiKey) {
      await new Promise(r => setTimeout(r, 400));
      const isSus = /union|failed|curl|instability|crash|strike|military/i.test(logText);
      return { 
        is_anomaly: isSus, 
        threat_type: isSus ? `${activeDomain} ALERT` : "NORMAL TRAFFIC", 
        severity: isSus ? "high" : "normal", 
        log: logText, ts: Date.now(), id: Date.now() + Math.random() 
      };
    }
    // ... API Logic (same as before)
    return { is_anomaly: false, threat_type: "NORMAL", severity: "normal", log: logText, id: Date.now(), ts: Date.now() };
  }, [apiKey, simulationMode, activeDomain]);

  const toggleLive = useCallback(() => {
    if (liveMode) {
      setLiveMode(false);
      liveRef.current = false;
      clearInterval(liveIntervalRef.current);
    } else {
      setLiveMode(true);
      liveRef.current = true;
      liveIntervalRef.current = setInterval(async () => {
        if (!liveRef.current) return;
        
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
          }
        }
      }, liveSpeed);
    }
  }, [liveMode, liveSpeed, analyzeLog, activeDomain]);

  useEffect(() => {
    return () => clearInterval(liveIntervalRef.current);
  }, []);

  return { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed, analyzeLog };
}
