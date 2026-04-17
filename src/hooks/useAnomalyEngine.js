import { useCallback, useEffect, useRef } from "react";
import { NORMAL_LOGS, ATTACK_LOGS, MOCK_COORD, SEV_COLOR } from "../constants/threatData";
import { useSentinelStore } from "../store/sentinelStore";
import { supabase } from "../lib/supabase";

// ── REAL-WORLD NEWS RSS FEEDS ───────────────────────────────────────
const NEWS_SOURCES = {
  world: [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.reutersagency.com/feed/?best-regions=world",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"
  ],
  cyber: [
    "https://feeds.feedburner.com/TheHackersNews",
    "https://www.schneier.com/feed/atom/",
    "https://krebsonsecurity.com/feed/"
  ],
  finance: [
    "https://finance.yahoo.com/news/rssindex",
    "https://www.reutersagency.com/feed/?best-topics=business-finance"
  ],
  military: [
    "https://www.janes.com/rss feeds/janes.xml",
    "https://www.reutersagency.com/feed/?best-regions=middle-east"
  ]
};

const GEOPOLITICAL_ALERTS = [
  // Ukraine War
  { pattern: /ukraine|russia|kyiv|moscow|kremlin|putin|zelen|bakhmut|donbas/i, type: "GEOPOLITICAL", severity: "high", lat: 50.45, lng: 30.52, threat: "Ukraine Theater Escalation" },
  { pattern: /nato|putin|moscow|baltic|poland/i, type: "GEOPOLITICAL", severity: "critical", lat: 54.9, lng: 23.9, threat: "NATO Eastern Flank Alert" },
  { pattern: /iran|tehran|israel|gaza|hamas|hezbollah/i, type: "GEOPOLITICAL", severity: "critical", lat: 32.3, lng: 54.3, threat: "Middle East Instability" },
  { pattern: /taiwan|china|beijing|xi|scs|southchina|pla/i, type: "GEOPOLITICAL", severity: "critical", lat: 25.0, lng: 121.5, threat: "Taiwan Strait Tensions" },
  { pattern: /north|korea|kim|pyongyang|missile|nuclear/i, type: "GEOPOLITICAL", severity: "critical", lat: 39.0, lng: 125.7, threat: "DPRK Nuclear Activity" },
  { pattern: /houthi|yemen|redsea|shipping|bab-el-mandeb/i, type: "GEOPOLITICAL", severity: "high", lat: 15.0, lng: 42.5, threat: "Red Sea Shipping Threat" },
  { pattern: /india|pakistan|kashmir|border|loc/i, type: "GEOPOLITICAL", severity: "high", lat: 33.0, lng: 76.0, threat: "South Asia Border Tensions" },
  { pattern: /election|trump|biden|democrat|republican/i, type: "GEOPOLITICAL", severity: "medium", lat: 38.9, lng: -77.0, threat: "US Political Activity" },
  // Energy & Economy
  { pattern: /oil|petroleum|opec|saudi|energy|gas|brent|wti/i, type: "ENERGY", severity: "high", lat: 25.0, lng: 47.0, threat: "Energy Market Volatility" },
  { pattern: /bitcoin|crypto|ethereum|blockchain/i, type: "FINANCE", severity: "medium", lat: 40.7, lng: -74.0, threat: "Crypto Market Movement" },
  // Cyber
  { pattern: /ransomware|hacker|breach|malware|cryptolock/i, type: "CYBER", severity: "high", lat: 37.7, lng: -122.4, threat: "Cyber Attack Detected" },
  { pattern: /ai|openai|chatgpt|claude|anthropic/i, type: "TECH", severity: "low", lat: 37.4, lng: -122.1, threat: "AI Sector Activity" },
  // Natural
  { pattern: /earthquake|tsunami|volcano|eruption|seismic/i, type: "NATURAL", severity: "high", lat: 35.3, lng: 138.7, threat: "Seismic Event" },
  { pattern: /hurricane|typhoon|storm|flood|cyclone/i, type: "NATURAL", severity: "high", lat: 25.0, lng: -80.0, threat: "Severe Weather Alert" },
];

/**
 * useAnomalyEngine - The central orchestration hook for the AI SOC Sentinel.
 * Upgraded for Phase 5: Cloud-native signaling.
 */
export function useAnomalyEngine({ signatures }) {
  const { 
    activeDomain, simulationMode, apiKey, selectedModel, threatFoxKey, 
    feed, setFeed, arcs, addArc, rings, addRing, 
    liveMode, liveSpeed, setLiveSpeed,
    proxyStatus
  } = useSentinelStore();

  const contextKeywords = useRef([]);
  const latestNews = useRef([]);

  // ── REAL-TIME NEWS FETCHER ───────────────────────────────────────
  const fetchGlobalNews = useCallback(async () => {
    const sources = activeDomain === 'FINANCE' ? NEWS_SOURCES.finance : 
                    activeDomain === 'CYBER' ? NEWS_SOURCES.cyber : 
                    NEWS_SOURCES.world;
    
    const allNews = [];
    
    for (const rssUrl of sources.slice(0, 2)) {
      try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await res.json();
        if (data.status === 'ok' && data.items) {
          allNews.push(...data.items.slice(0, 8).map(item => ({
            title: item.title,
            pubDate: item.pubDate,
            link: item.link
          })));
        }
      } catch {}
    }
    
    latestNews.current = allNews.slice(0, 15);
    contextKeywords.current = allNews.slice(0, 10).map(item => {
      const words = item.title.split(' ').slice(0, 2).join(' ').toUpperCase();
      return words.replace(/[^A-Z0-9\s]/g, '');
    }).filter(w => w.length > 4);
    
    return allNews;
  }, [activeDomain]);

  // ── GEOPOLITICAL MATCHER ─────────────────────────────────────────
  const matchGeopoliticalAlert = useCallback((newsTitle) => {
    for (const alert of GEOPOLITICAL_ALERTS) {
      if (alert.pattern.test(newsTitle)) {
        return alert;
      }
    }
    return null;
  }, []);

  // ── NEWS-DRIVEN THREAT GENERATOR ────────────────────────────────
  const generateNewsThreat = useCallback(() => {
    if (latestNews.current.length === 0) return null;
    
    const randomNews = latestNews.current[Math.floor(Math.random() * latestNews.current.length)];
    const alert = matchGeopoliticalAlert(randomNews.title);
    
    if (alert) {
      return {
        ts: Date.now(),
        sector: activeDomain,
        severity: alert.severity,
        is_anomaly: true,
        threat_type: `${alert.type}_ALERT`,
        log_content: `[BREAKING] ${randomNews.title.substring(0, 120)}...`,
        explanation: `${alert.threat} detected via global news stream.`,
        geo_lat: alert.lat + (Math.random() - 0.5) * 10,
        geo_lon: alert.lng + (Math.random() - 0.5) * 10,
        mitre_attack: alert.type === 'CYBER' ? 'T0059 - Threat Intelligence' : 
                     alert.type === 'ENERGY' ? 'T0040 - Natural Disaster' : 
                     'T0028 - Social Political Instability',
        source: 'NEWS_FEED'
      };
    }
    return null;
  }, [activeDomain, matchGeopoliticalAlert]);

  // ── CLOUD SIGNALING SINK ─────────────────────────────────────
  const pushSignalToCloud = useCallback(async (result) => {
    if (!supabase) return;

    const { error } = await supabase
      .from('sentinel_signals')
      .insert([{
        ts: result.ts,
        sector: activeDomain,
        severity: result.severity,
        is_anomaly: result.is_anomaly,
        threat_type: result.threat_type,
        log_content: result.log,
        attacker_ip: result.attacker_ip,
        mitre_attack: result.mitre_attack,
        explanation: result.explanation,
        geo_lat: result.geo_lat,
        geo_lon: result.geo_lon
      }]);

    if (error) console.error("Cloud Signal Sink Failure", error);
  }, [activeDomain]);

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
    let result;
    if ((simulationMode || !apiKey) && !logText.includes("REAL_IOC")) {
      await new Promise(r => setTimeout(r, 400));
      const isSus = /union|failed|curl|instability|crash|strike|military|breach|exploit|infiltrate|sql_inject|lfi_attempt|rce_staged|ssh_brute|cve-/i.test(logText);
      const severity = isSus ? (Math.random() > 0.7 ? "critical" : "high") : "normal";
      
      const coord = MOCK_COORD[Math.floor(Math.random() * MOCK_COORD.length)];

      result = { 
        is_anomaly: isSus, 
        threat_type: isSus ? `${activeDomain} ALERT` : "NORMAL TRAFFIC", 
        severity: severity, 
        mitre_attack: isSus ? "T1059 - Command and Scripting Interpreter" : null,
        attacker_ip: isSus ? (logText.match(/(\d{1,3}\.){3}\d{1,3}/)?.[0] || `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`) : null,
        log: logText, ts: Date.now(), id: Date.now() + Math.random(),
        explanation: isSus ? "Pattern recognition identified a high-risk signature match in the telemetry stream." : null,
        geo_lat: isSus ? coord.lat : null,
        geo_lon: isSus ? coord.lng : null
      };
    } else {
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
        const coord = MOCK_COORD[Math.floor(Math.random() * MOCK_COORD.length)];

        result = { 
          ...parsed, 
          log: logText, 
          ts: Date.now(), 
          id: Math.random(),
          severity: (parsed.severity || "normal").toLowerCase(),
          geo_lat: parsed.is_anomaly ? coord.lat : null,
          geo_lon: parsed.is_anomaly ? coord.lng : null
        };
      } catch(e) { 
        console.error("AI Analysis Failed", e); 
        result = { is_anomaly: false, threat_type: "AI_OFFLINE", severity: "normal", log: logText, id: Date.now(), ts: Date.now() };
      }
    }

    // PUSH TO CLOUD IF ENABLED
    if (supabase) {
      pushSignalToCloud(result);
    } else {
      // LOCAL FALLBACK
      setFeed(prev => [result, ...prev].slice(0, 400));
    }

    return result;
  }, [apiKey, simulationMode, activeDomain, selectedModel, buildSystemPrompt, pushSignalToCloud, setFeed]);

  const handleThreatVisuals = useCallback((result) => {
    if (result.is_anomaly) {
      const targetCoords = MOCK_COORD[Math.floor(Math.random() * MOCK_COORD.length)];
      
      addArc({ 
        startLat: result.geo_lat || MOCK_COORD[0].lat, 
        startLng: result.geo_lon || MOCK_COORD[0].lng, 
        endLat: targetCoords.lat, 
        endLng: targetCoords.lng, 
        color: SEV_COLOR[result.severity] || SEV_COLOR.normal
      });
      
      if (result.severity === "critical" || result.severity === "high") {
        addRing({ lat: targetCoords.lat, lng: targetCoords.lng, color: result.severity === 'critical' ? "#ef4444" : "#f59e0b", maxR: 8 });
        
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(result.severity === 'critical' ? 880 : 440, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch {} 
      }
    }
  }, [addArc, addRing]);

  const ingestManualLog = useCallback(async (text) => {
     const result = await analyzeLog(text);
     handleThreatVisuals(result);
     return result;
  }, [analyzeLog, handleThreatVisuals]);

  const toggleLive = useCallback(() => {
    useSentinelStore.getState().setLiveMode(!liveMode);
  }, [liveMode]);

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

    // Initial news fetch
    fetchGlobalNews();
    const newsInterval = setInterval(fetchGlobalNews, 300000); // Fetch news every 5 min

    const interval = setInterval(async () => {
      let log = "";
      
      // Random chance to generate news-driven threat (30%)
      if (Math.random() < 0.3) {
        const newsThreat = generateNewsThreat();
        if (newsThreat) {
          if (supabase) {
            await supabase.from('sentinel_signals').insert([newsThreat]);
          } else {
            setFeed(prev => [newsThreat, ...prev].slice(0, 400));
          }
          handleThreatVisuals(newsThreat);
          return;
        }
      }

      if (!simulationMode && threatFoxKey) {
        log = await fetchRealWorldThreats();
      }

      if (!log) {
        let logs = (activeDomain === "CYBER") ? [...NORMAL_LOGS, ...ATTACK_LOGS] :
                   (activeDomain === "FINANCE") ? ["STOCK VOLATILITY RISING", "DEBT LIMIT BREACHED", "MARKET STABLE", "LIQUIDITY ALERT", "RATE HIKE ALERT", "INFLATION SPIKE"] :
                   ["ROUTINE PATROL", "STABILITY SCORE NOMINAL", "AIRSPACE MONITORING", "BORDER TELEMETRY", "SATELLITE REPOSITIONING", "RADAR CONTACT"];

        log = logs[Math.floor(Math.random() * logs.length)];
        if (contextKeywords.current.length > 0 && Math.random() > 0.5) {
          const keyword = contextKeywords.current[Math.floor(Math.random() * contextKeywords.current.length)];
          log = `${log} [REF: ${keyword}]`;
        }
      }

      const result = await analyzeLog(log);
      handleThreatVisuals(result);
    }, liveSpeed);

    return () => {
      clearInterval(interval);
      clearInterval(newsInterval);
    };
  }, [liveMode, liveSpeed, analyzeLog, activeDomain, simulationMode, threatFoxKey, fetchRealWorldThreats, proxyStatus, handleThreatVisuals, fetchGlobalNews, generateNewsThreat]);

  return { feed, arcs, rings, liveMode, toggleLive, liveSpeed, setLiveSpeed, analyzeLog, ingestManualLog, proxyStatus };
}
