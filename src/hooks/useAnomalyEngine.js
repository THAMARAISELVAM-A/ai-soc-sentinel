import { useState, useCallback, useEffect, useRef } from "react";
import { NORMAL_LOGS, ATTACK_LOGS, MOCK_COORD, LAYERS_DB, SEV_COLOR } from "../constants/threatData";

export function useAnomalyEngine({ 
  apiKey, selectedModel, simulationMode, signatures, activeDomain, 
  threatFoxKey, otxKey 
}) {
  const [feed, setFeed] = useState([]);
  const [arcs, setArcs] = useState([]);
  const [rings, setRings] = useState([]);
  const [liveMode, setLiveMode] = useState(true);
  const [liveSpeed, setLiveSpeed] = useState(4000);
  const [proxyStatus, setProxyStatus] = useState("OFFLINE");
  const contextKeywords = useRef([]);

  // ── LOCAL SENTINEL UPLINK (WebSocket) ─────────────────────────
  useEffect(() => {
    let socket;
    const connect = () => {
      socket = new WebSocket("ws://localhost:8888");
      
      socket.onopen = () => {
        console.log("🛡️ Local Sentinel Connected");
        setProxyStatus("CONNECTED");
      };

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log("Proxy Data Recv:", data.log);
        const result = await analyzeLog(data.log);
        setFeed(prev => [result, ...prev].slice(0, 150));
        handleThreatVisuals(result);
      };

      socket.onclose = () => {
        setProxyStatus("OFFLINE");
        setTimeout(connect, 5000); // Retry every 5s
      };
      
      socket.onerror = (err) => {
        console.warn("Local Sentinel Proxy not detected at ws://localhost:8888");
        socket.close();
      };
    };

    connect();
    return () => socket && socket.close();
  }, [apiKey, simulationMode]);

  // ── LIVE CONTEXT: News headlines for simulation enrichment ─────
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const rssUrl = activeDomain === 'FINANCE' ? "https://finance.yahoo.com/news/rssindex" : "https://feeds.bbci.co.uk/news/world/rss.xml";
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await res.json();
        if (data.status === 'ok') {
          contextKeywords.current = data.items.map(item => {
            const words = item.title.split(' ').slice(0, 3).join('-').toUpperCase();
            return words.replace(/[^A-Z-]/g, '');
          }).filter(w => w.length > 5);
        }
      } catch (e) {
        console.warn("Autonomous Context Sync Failed", e);
      }
    };
    fetchContext();
  }, [activeDomain]);

  const buildSystemPrompt = useCallback(() => {
    const active = signatures.filter(s => s.active);
    return `You are a World Monitor Intelligence Engine (${activeDomain} domain).
CONTEXT: Cybersecurity, Global Markets, and Geopolitical instability.
TASK: Analyze the provided intel string and return a JSON result.
SIGNATURES: ${active.map(s => s.category).join(", ")}
RESPONSE JSON: { "is_anomaly": true/false, "threat_type": "string", "severity": "critical/high/medium/low/normal", "explanation": "string", "attacker_ip": "192.168.x.x string", "iocs": [] }`;
  }, [signatures, activeDomain]);

  const analyzeLog = useCallback(async (logText) => {
    if ((simulationMode || !apiKey) && !logText.includes("REAL_IOC")) {
      await new Promise(r => setTimeout(r, 400));
      const isSus = /union|failed|curl|instability|crash|strike|military|breach|exploit|infiltrate/i.test(logText);
      return { 
        is_anomaly: isSus, 
        threat_type: isSus ? `${activeDomain} ALERT` : "NORMAL TRAFFIC", 
        severity: isSus ? (Math.random() > 0.7 ? "critical" : "high") : "normal", 
        attacker_ip: isSus ? `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}` : (logText.match(/(\d{1,3}\.){3}\d{1,3}/)?.[0] || null),
        log: logText, ts: Date.now(), id: Date.now() + Math.random(),
        explanation: isSus ? "Heuristic match for suspicious patterns in telemetry stream." : null
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

  const handleThreatVisuals = useCallback((result) => {
    if (result.is_anomaly) {
      const originURL = MOCK_COORD[Math.floor(Math.random() * MOCK_COORD.length)];
      const targetURL = LAYERS_DB.centers[Math.floor(Math.random() * LAYERS_DB.centers.length)] || MOCK_COORD[0];
      setArcs(prev => [...prev, { startLat: originURL.lat, startLng: originURL.lng, endLat: targetURL.lat, endLng: targetURL.lng, color: SEV_COLOR[result.severity] }].slice(-25));
      
      if (result.severity === "critical") {
        setRings(prev => [...prev, { lat: targetURL.lat, lng: targetURL.lng, color: "#ef4444", maxR: 8 }].slice(-10));
        
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
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch { } 
      }
    }
  }, []);

  const ingestManualLog = useCallback(async (text) => {
     const result = await analyzeLog(text);
     setFeed(prev => [result, ...prev].slice(0, 150));
     handleThreatVisuals(result);
     return result;
  }, [analyzeLog, handleThreatVisuals]);

  const toggleLive = useCallback(() => {
    setLiveMode(prev => !prev);
  }, []);

  const fetchRealWorldThreats = useCallback(async () => {
    if (!threatFoxKey) return null;
    try {
      const response = await fetch("https://threatfox-api.abuse.ch/api/v1/", {
        method: "POST",
        body: JSON.stringify({ query: "get_recent", days: 1 })
      });
      const data = await response.json();
      if (data.status === "ok") {
        const item = data.data[Math.floor(Math.random() * data.data.length)];
        return `[REAL_IOC] ${item.threat_type_full}: ${item.ioc} (Ref: ${item.malware_printable})`;
      }
    } catch (e) {
      console.warn("ThreatFox Sync Failed", e);
    }
    return null;
  }, [threatFoxKey]);

  useEffect(() => {
    if (!liveMode || proxyStatus === 'CONNECTED') return;

    const interval = setInterval(async () => {
      let log = "";
      
      if (!simulationMode && threatFoxKey) {
        log = await fetchRealWorldThreats();
      }

      if (!log) {
        let logs = (activeDomain === "CYBER") ? [...NORMAL_LOGS, ...ATTACK_LOGS] :
                   (activeDomain === "FINANCE") ? ["STOCK VOLATILITY RISING", "DEBT LIMIT BREACHED", "MARKET STABLE", "LIQUIDITY ALERT"] :
                   ["ROUTINE PATROL", "STABILITY SCORE NOMINAL", "AIRSPACE MONITORING", "BORDER TELEMETRY"];

        log = logs[Math.floor(Math.random() * logs.length)];
        
        if (contextKeywords.current.length > 0 && Math.random() > 0.5) {
          const keyword = contextKeywords.current[Math.floor(Math.random() * contextKeywords.current.length)];
          log = `${log} [REF: ${keyword}]`;
        }
      }

      const result = await analyzeLog(log);
      setFeed(prev => [result, ...prev].slice(0, 150));
      handleThreatVisuals(result);
    }, liveSpeed);

    return () => clearInterval(interval);
  }, [liveMode, liveSpeed, analyzeLog, activeDomain, simulationMode, threatFoxKey, fetchRealWorldThreats, proxyStatus, handleThreatVisuals]);

  return { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed, analyzeLog, ingestManualLog, proxyStatus };
}
