import { useState, useCallback, useEffect, useRef } from "react";

export function useL2Forecaster({ feed, simulationMode, apiKey, selectedModel }) {
  const [forecast, setForecast] = useState(null);
  const forecastIntervalRef = useRef(null);

  const generateForecast = useCallback(async () => {
    if (feed.length < 5) return;
    if (simulationMode || !apiKey) {
      setForecast({ 
        predicted_attack: "Distributed SSH Brute Force", 
        eta: "4 Minutes", 
        probability: 89, 
        explanation: "Escalating trajectory of failed SSH attempts detected across multiple edge nodes."
      });
      return;
    }
    
    const recentLogs = feed.slice(0, 50).map(f => `[${f.severity}] ${f.threat_type}`).join("\n");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ 
          model: selectedModel, max_tokens: 300, 
          system: "You are an L2 Predictive SOC Agent. Analyze the recent timeline logs and forecast the impending attack trajectory. Return ONLY valid JSON: { \"predicted_attack\": \"string\", \"eta\": \"string\", \"probability\": 0-100, \"explanation\": \"1 precise sentence\" }", 
          messages: [{ role: "user", content: `Recent event cascade:\n\n${recentLogs}` }] 
        })
      });
      const data = await response.json();
      const raw = data.content?.find(c => c.type === "text")?.text || "{}";
      setForecast(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch(e) { console.error("Forecast Error", e); }
  }, [feed, simulationMode, apiKey, selectedModel]);

  // Handle automatic interval when scanning is active
  const startForecaster = (interval) => {
     forecastIntervalRef.current = setInterval(generateForecast, interval);
  };
  const stopForecaster = () => {
     clearInterval(forecastIntervalRef.current);
  };

  useEffect(() => {
    return () => clearInterval(forecastIntervalRef.current);
  }, []);

  return { forecast, generateForecast, startForecaster, stopForecaster };
}
