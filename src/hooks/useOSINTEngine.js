import { useState, useCallback } from "react";
import { OSINT_CATEGORIES, createScanResult } from "../constants/osintFramework";

// ─────────────────────────────────────────────────────────────────────
// SENTINEL-ARM OSINT ENGINE
// Military-grade intelligence gathering hook
// ─────────────────────────────────────────────────────────────────────
export function useOSINTEngine() {
  const [scanResults, setScanResults] = useState([]);
  const [activeScans, setActiveScans] = useState({});
  const [scanHistory, setScanHistory] = useState([]);

  // Execute OSINT tool
  const executeTool = useCallback(async (tool, query, options = {}) => {
    const scanId = `scan_${Date.now()}`;
    
    setActiveScans(prev => ({ ...prev, [scanId]: { tool: tool.id, query, status: "scanning" } }));

    try {
      let result = null;
      let error = null;

      // Handle different tool types
      if (tool.endpoint) {
        // API-based tool
        const url = tool.endpoint
          .replace("{query}", encodeURIComponent(query))
          .replace("{apiKey}", options.apiKey || "");
        
        const response = await fetch(url, {
          method: tool.endpoint.includes("POST") ? "POST" : "GET",
          headers: {
            "Accept": "application/json",
            ...(options.apiKey && { "Authorization": `Bearer ${options.apiKey}` })
          },
          body: tool.endpoint.includes("POST") ? JSON.stringify({ query: query }) : undefined
        });

        if (response.ok) {
          result = await response.json();
        } else {
          error = `HTTP ${response.status}: ${response.statusText}`;
        }
      } else if (tool.type === "upload") {
        // File upload - handle metadata extraction
        result = { type: "upload_required", message: `Upload ${tool.name} file for analysis` };
      }

      const scanResult = createScanResult(tool.id, query, result || { error });
      
      setScanResults(prev => [scanResult, ...prev].slice(0, 100));
      setScanHistory(prev => [scanResult, ...prev].slice(0, 500));
      
      setActiveScans(prev => {
        const updated = { ...prev };
        delete updated[scanId];
        return updated;
      });

      return scanResult;
    } catch (err) {
      const scanResult = createScanResult(tool.id, query, { error: err.message });
      setScanResults(prev => [scanResult, ...prev].slice(0, 100));
      setActiveScans(prev => {
        const updated = { ...prev };
        delete updated[scanId];
        return updated;
      });
      return scanResult;
    }
  }, []);

  // Run category scan (all tools in category)
  const runCategoryScan = useCallback(async (categoryKey, query, options = {}) => {
    const category = OSINT_CATEGORIES[categoryKey];
    if (!category) return [];

    const results = [];
    for (const tool of category.tools) {
      const result = await executeTool(tool, query, options);
      results.push(result);
    }
    return results;
  }, [executeTool]);

  // Quick IP Intelligence
  const quickIPIntel = useCallback(async (ip) => {
    const results = await Promise.all([
      executeTool({ id: "ip_lookup", endpoint: "https://ipapi.co/{query}/json/" }, ip),
      executeTool({ id: "shodan", endpoint: "https://api.shodan.io/shodan/host/{query}" }, ip),
      executeTool({ id: "abuse_ip", endpoint: "https://api.abuseipdb.com/api/v2/check?ipAddress={query}" }, ip),
    ]);
    return results;
  }, [executeTool]);

  // Quick Domain Intelligence  
  const quickDomainIntel = useCallback(async (domain) => {
    const results = await Promise.all([
      executeTool({ id: "whois", endpoint: "https://api.viewdns.info/whois/?domain={query}&apikey={apiKey}" }, domain),
      executeTool({ id: "dns_lookup", endpoint: "https://dns.google/resolve?name={query}&type=ANY" }, domain),
      executeTool({ id: "ssl_cert", endpoint: "https://crt.sh/?q={query}&output=json" }, domain),
      executeTool({ id: "mx_lookup", endpoint: "https://dns.google/resolve?name={query}&type=MX" }, domain),
    ]);
    return results;
  }, [executeTool]);

  // Threat Intelligence Check
  const checkThreatIntel = useCallback(async (indicator) => {
    const results = await Promise.all([
      executeTool({ id: "threatfox", endpoint: "https://threatfox-api.abuse.ch/api/v1/", type: "POST" }, indicator),
      executeTool({ id: "urlhaus", endpoint: "https://urlhaus-api.abuse.ch/v1/urls/" }, indicator),
      executeTool({ id: "abuse_ip", endpoint: "https://api.abuseipdb.com/api/v2/check?ipAddress={query}" }, indicator),
    ]);
    return results;
  }, [executeTool]);

  // Clear results
  const clearResults = useCallback(() => {
    setScanResults([]);
  }, []);

  // Export results
  const exportResults = useCallback((format = "json") => {
    const data = scanResults;
    
    if (format === "json") {
      return JSON.stringify(data, null, 2);
    } else if (format === "csv") {
      const headers = ["ID", "Tool", "Query", "Timestamp", "Status"];
      const rows = data.map(r => [r.id, r.toolId, r.query, new Date(r.timestamp).toISOString(), r.status]);
      return [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    }
    return "";
  }, [scanResults]);

  return {
    scanResults,
    activeScans,
    scanHistory,
    executeTool,
    runCategoryScan,
    quickIPIntel,
    quickDomainIntel,
    checkThreatIntel,
    clearResults,
    exportResults
  };
}