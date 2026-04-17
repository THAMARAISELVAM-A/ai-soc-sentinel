import { useState, useCallback, useEffect, useRef } from "react";
import { NORMAL_LOGS, ATTACK_LOGS, MOCK_COORD, LAYERS_DB, SEV_COLOR } from "../constants/threatData";

/**
 * useAnomalyEngine - The central orchestration hook for the AI SOC Sentinel.
 * 
 * This hook manages the autonomous telemetry stream, AI-driven analysis, 
 * real-time threat intelligence ingestion (ThreatFox), and local 
 * sentinel proxy connectivity via WebSockets.
 * 
 * @param {Object} props - Hook properties.
 * @param {string} props.apiKey - Anthropic API key for live AI analysis.
 * @param {string} props.selectedModel - The Claude model to use for analysis.
 * @param {boolean} props.simulationMode - If true, uses heuristic mock data instead of real APIs.
 * @param {Array} props.signatures - List of active security signatures for the AI to monitor.
 * @param {string} props.activeDomain - Current operational domain (CYBER | FINANCE | GEOINT).
 * @param {string} props.threatFoxKey - API key for Abuse.ch ThreatFox integration.
 * @param {string} props.otxKey - API key for AlienVault OTX (placeholder).
 * 
 * @returns {Object} { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed, analyzeLog, ingestManualLog, proxyStatus }
 */
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

  // ── LOCAL PERSISTENCE LAYER ──────────────────────────────────
  useEffect(() => {
    const savedFeed = localStorage.getItem(`sentinel_feed_${activeDomain}`);
    if (savedFeed) {
      try {
        setFeed(JSON.parse(savedFeed).slice(0, 150));
      } catch (e) {
        console.warn("Failed to hydrate feed from storage", e);
      }
    }
  }, [activeDomain]);

  useEffect(() => {
    if (feed.length > 0) {
      localStorage.setItem(`sentinel_feed_${activeDomain}`, JSON.stringify(feed.slice(0, 150)));
    }
  }, [feed, activeDomain]);

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
        const msg = JSON.parse(event.data);
        
        if (msg.type === "telemetry") {
          const result = await analyzeLog(msg.data.log);
          setFeed(prev => [result, ...prev].slice(0, 400));
          handleThreatVisuals(result);
        } else if (msg.type === "history") {
          console.log("Syncing Historical Data:", msg.data.length, "records");
          // History items are already analyzed or raw logs. 
          // For now, we just prepend them if they aren't already there.
          setFeed(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newLogs = msg.data.filter(h => !existingIds.has(h.id));
            return [...newLogs, ...prev].slice(0, 400);
          });
        }
      };

      socket.onclose = () => {
        setProxyStatus("OFFLINE");
        setTimeout(connect, 5000); 
      };
      
      socket.onerror = () => {
        socket.close();
      };
    };

    connect();
    return () => socket && socket.close();
  }, [apiKey, simulationMode, analyzeLog, handleThreatVisuals]);

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
TASK: Analyze the provided telemetry log and return a JSON result.
SIGNATURES: ${active.map(s => s.category).join(", ")}
REQUIREMENTS:
1. Classify if it's an anomaly or normal traffic.
2. If anomaly, map it to the MITRE ATT&CK framework (Technique Code).
3. Identify the attacker source IP if visible.
4. Provide a professional forensic explanation.

RESPONSE JSON FORMAT:
{
  "is_anomaly": boolean,
  "threat_type": "string",
  "severity": "critical/high/medium/low/normal",
  "mitre_attack": "T1XXX - Name",
  "explanation": "string",
  "attacker_ip": "IP string",
  "iocs": ["string"]
}
DO NOT RETURN ANY OTHER TEXT OR MARKDOWN.`;
  }, [signatures, activeDomain]);

  const analyzeLog = useCallback(async (logText) => {
    if ((simulationMode || !apiKey) && !logText.includes("REAL_IOC")) {
      await new Promise(r => setTimeout(r, 400));
      const isSus = /union|failed|curl|instability|crash|strike|military|breach|exploit|infiltrate|sql_inject|lfi_attempt|rce_staged|ssh_brute|cve-/i.test(logText);
      const severity = isSus ? (Math.random() > 0.7 ? "critical" : "high") : "normal";
      
      return { 
        is_anomaly: isSus, 
        threat_type: isSus ? `${activeDomain} ALERT` : "NORMAL TRAFFIC", 
        severity: severity, 
        mitre_attack: isSus ? "T1059 - Command and Scripting Interpreter" : null,
        attacker_ip: isSus ? (logText.match(/(\d{1,3}\.){3}\d{1,3}/)?.[0] || `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`) : null,
        log: logText, ts: Date.now(), id: Date.now() + Math.random(),
        explanation: isSus ? "Pattern recognition identified a high-risk signature match in the telemetry stream." : null
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
        severity: (parsed.severity || "normal").toLowerCase()
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
      setArcs(prev => [...prev, { 
        startLat: originURL.lat, 
        startLng: originURL.lng, 
        endLat: targetURL.lat, 
        endLng: targetURL.lng, 
        color: SEV_COLOR[result.severity] || SEV_COLOR.normal
      }].slice(-30));
      
      if (result.severity === "critical" || result.severity === "high") {
        setRings(prev => [...prev, { lat: targetURL.lat, lng: targetURL.lng, color: result.severity === 'critical' ? "#ef4444" : "#f59e0b", maxR: 8 }].slice(-15));
        
        try {
          // Subtle audio ping
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(result.severity === 'critical' ? 880 : 440, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
          
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch { } 
      }
    }
  }, []);

  const ingestManualLog = useCallback(async (text) => {
     const result = await analyzeLog(text);
     setFeed(prev => [result, ...prev].slice(0, 400));
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

  // ── INITIAL FEED POPULATION (Instant WOW factor) ────────────────
  useEffect(() => {
    const saved = localStorage.getItem(`sentinel_feed_${activeDomain}`);
    if (saved) return; // Already hydrated

    const initialLogs = Array.from({ length: 15 }, (_, i) => {
      const logs = (activeDomain === "CYBER") ? [...NORMAL_LOGS, ...ATTACK_LOGS] :
                   (activeDomain === "FINANCE") ? ["SEC-OPS: INDEX VOLATILITY SYNC", "DEBT LIMIT NOMINAL", "MARKET STABLE", "LIQUIDITY SIGNAL"] :
                   ["PATROL SECTOR-4 READY", "STABILITY SCORE 98%", "AIRSPACE CLEAR", "BORDER TELEMETRY"];
      const logText = logs[Math.floor(Math.random() * logs.length)];
      return { 
        id: Date.now() - i * 1000, 
        ts: Date.now() - i * 1000, 
        is_anomaly: Math.random() > 0.8,
        threat_type: Math.random() > 0.8 ? `${activeDomain} ALERT` : "NORMAL_TRAFFIC",
        severity: Math.random() > 0.8 ? "high" : "normal",
        log: logText,
        attacker_ip: Math.random() > 0.8 ? `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}` : null
      };
    }).sort((a,b) => b.ts - a.ts);
    setFeed(initialLogs);
  }, [activeDomain]);

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
      setFeed(prev => [result, ...prev].slice(0, 400));
      handleThreatVisuals(result);
    }, liveSpeed);

    return () => clearInterval(interval);
  }, [liveMode, liveSpeed, analyzeLog, activeDomain, simulationMode, threatFoxKey, fetchRealWorldThreats, proxyStatus, handleThreatVisuals]);

  return { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed, analyzeLog, ingestManualLog, proxyStatus };
}
