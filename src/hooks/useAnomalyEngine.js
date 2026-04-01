import { useState, useRef, useCallback, useEffect } from "react";
import { NORMAL_LOGS, ATTACK_LOGS, MOCK_COORD, LAYERS_DB, SEV_COLOR } from "../constants/threatData";

export function useAnomalyEngine({ apiKey, selectedModel, simulationMode, signatures }) {
  const [feed, setFeed] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);
  const [liveMode, setLiveMode] = useState(false);
  const [liveSpeed, setLiveSpeed] = useState(4000);
  
  const liveRef = useRef(false);
  const liveIntervalRef = useRef(null);

  const buildSystemPrompt = useCallback(() => {
    const active = signatures.filter(s => s.active);
    return `You are an expert cybersecurity AI anomaly detection engine. You have been trained on the following attack signatures and patterns:
${active.map(s => `## ${s.category} (MITRE ${s.mitre}) — Severity: ${s.severity.toUpperCase()}\nPatterns to detect: ${s.pattern}`).join("\n")}
TASK: Analyze the provided log entry and determine if it represents an anomaly, attack, or normal behavior.
You MUST respond with ONLY valid JSON:
{ "is_anomaly": true/false, "threat_type": "string", "severity": "critical/high/medium/low/normal", "explanation": "string", "iocs": [] }`;
  }, [signatures]);

  const analyzeLog = useCallback(async (logText) => {
    if (simulationMode || !apiKey) {
      await new Promise(r => setTimeout(r, 400));
      const isSus = /union|failed|curl|\.sh/i.test(logText);
      return { 
        is_anomaly: isSus, 
        threat_type: isSus ? "Suspected Attack" : "Normal Traffic", 
        severity: isSus ? (Math.random() > 0.5 ? "critical" : "high") : "normal", 
        log: logText, ts: Date.now(), id: Date.now() + Math.random() 
      };
    }
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: selectedModel, max_tokens: 300, system: buildSystemPrompt(), messages: [{ role: "user", content: logText }] })
      });
      const data = await response.json();
      const raw = data.content?.find(c => c.type === "text")?.text || "{}";
      return { ...JSON.parse(raw.replace(/```json|```/g, "").trim()), log: logText, id: Date.now() + Math.random(), ts: Date.now() };
    } catch (e) {
      return { is_anomaly: false, threat_type: "API Error", severity: "critical", log: logText, id: Date.now(), ts: Date.now() };
    }
  }, [apiKey, simulationMode, selectedModel, buildSystemPrompt]);

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
        const isAttack = Math.random() < 0.35;
        const log = isAttack ? ATTACK_LOGS[Math.floor(Math.random() * ATTACK_LOGS.length)] : NORMAL_LOGS[Math.floor(Math.random() * NORMAL_LOGS.length)];
        const result = await analyzeLog(log);
        setFeed(prev => [result, ...prev].slice(0, 150));

        if (result.is_anomaly) {
          const originURL = MOCK_COORD[Math.floor(Math.random() * MOCK_COORD.length)];
          const targetURL = LAYERS_DB.centers[Math.floor(Math.random() * LAYERS_DB.centers.length)] || MOCK_COORD[0];
          setArcs(prev => [...prev, { startLat: originURL.lat, startLng: originURL.lng, endLat: targetURL.lat, endLng: targetURL.lng, color: SEV_COLOR[result.severity] }].slice(-25));
          
          if (result.severity === "critical" || result.severity === "high") {
            setRings(prev => [...prev, { lat: targetURL.lat, lng: targetURL.lng, color: result.severity === "critical" ? "#ef4444" : "#f97316", maxR: result.severity === "critical" ? 8 : 4 }].slice(-10));
          }
        }
      }, liveSpeed);
    }
  }, [liveMode, liveSpeed, analyzeLog]);

  useEffect(() => {
    return () => clearInterval(liveIntervalRef.current);
  }, []);

  return { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed, analyzeLog };
}
