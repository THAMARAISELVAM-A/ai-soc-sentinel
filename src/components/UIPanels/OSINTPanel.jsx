import React, { useState } from "react";
import { 
  Globe, Users, Image, ShieldAlert, Database, Share2, 
  Search, Play, Trash2, Download, Copy, X, ChevronRight,
  Clock, CheckCircle, AlertCircle, Loader2
} from "lucide-react";
import { OSINT_CATEGORIES } from "../../constants/osintFramework";

const CATEGORY_ICONS = {
  NETWORK: Globe,
  PEOPLE: Users,
  MEDIA: Image,
  THREAT: ShieldAlert,
  DOMAIN: Database,
  SOCIAL: Share2,
};

export function OSINTPanel({ onClose }) {
  const [activeCategory, setActiveCategory] = useState("NETWORK");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const currentCategory = OSINT_CATEGORIES[activeCategory];
  const IconComponent = CATEGORY_ICONS[activeCategory];

  const runQuickScan = async (toolId) => {
    if (!query.trim()) return;
    
    setIsScanning(true);
    setSelectedTool(toolId);
    
    // Simulate scan for demo (in production, connect to real APIs)
    await new Promise(r => setTimeout(r, 1500));
    
    const mockResults = {
      ip_lookup: {
        ip: query,
        city: "San Francisco",
        region: "California",
        country: "US",
        country_code: "US",
        isp: "Cloudflare Inc",
        org: "Cloudflare",
        asn: "AS13335",
        latitude: 37.7749,
        longitude: -122.4194,
        timezone: "America/Los_Angeles"
      },
      whois: {
        domain: query,
        created: "2020-01-15",
        expires: "2025-01-15",
        registrar: "Cloudflare",
        registrant: { country: "US" }
      },
      dns_lookup: {
        A: ["192.168.1.1"],
        AAAA: ["::1"],
        MX: ["mail.cloudflare.com"],
        TXT: ["v=spf1 include:_spf.cloudflare.com ~all"]
      },
      threatfox: {
        status: "clean",
        tags: [],
        last_seen: null
      },
      abuse_ip: {
        ipAddress: query,
        abuseConfidenceScore: 0,
        countryCode: "US",
        isp: "Cloudflare",
        domain: "cloudflare.com"
      }
    };

    const result = mockResults[toolId] || { result: "Scan completed", query };
    // eslint-disable-next-line react-hooks/purity
    const timestamp = Date.now();
    setResults([{ toolId, query, data: result, timestamp }, ...results]);
    setIsScanning(false);
    setSelectedTool(null);
  };

  const runCategoryScan = async () => {
    if (!query.trim()) return;
    
    setIsScanning(true);
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    
    for (const tool of currentCategory.tools) {
      setSelectedTool(tool.id);
      await new Promise(r => setTimeout(r, 500));
      setResults(prev => [{
        toolId: tool.id,
        query,
        data: { scanned: true, tool: tool.name },
        timestamp: now + Math.random()
      }, ...prev]);
    }
    
    setIsScanning(false);
    setSelectedTool(null);
  };

  const clearResults = () => setResults([]);

  const exportResults = () => {
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sentinel-osint-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="glass-panel" style={{ 
      position: 'fixed', top: '80px', left: '80px', right: '80px', bottom: '80px',
      display: 'flex', flexDirection: 'column', zIndex: 10005, overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px 24px', borderBottom: '1px solid var(--glass-border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={24} color="var(--domain-primary)" />
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 900, letterSpacing: '2px' }}>
              SENTINEL-ARM OSINT FRAMEWORK
            </h2>
            <span style={{ fontSize: '10px', color: '#64748b', fontFamily: 'var(--mono-font)' }}>
              Military-Grade Intelligence Gathering
            </span>
          </div>
        </div>
        <button className="btn-console" onClick={onClose} style={{ padding: '8px' }}>
          <X size={16} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Categories */}
        <div style={{ 
          width: '220px', borderRight: '1px solid var(--glass-border)', 
          padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
          {Object.entries(OSINT_CATEGORIES).map(([key, cat]) => {
            const CatIcon = CATEGORY_ICONS[key];
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', border: 'none', borderRadius: '4px',
                  background: activeCategory === key ? `color-mix(in srgb, ${cat.color} 20%, transparent)` : 'transparent',
                  color: activeCategory === key ? 'white' : '#94a3b8',
                  cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--mono-font)',
                  fontSize: '11px', fontWeight: 900, letterSpacing: '1px'
                }}
              >
                <CatIcon size={16} color={cat.color} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Tools Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Search Bar */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Enter ${activeCategory.toLowerCase()} indicator (IP, domain, email, username)...`}
                style={{
                  width: '100%', padding: '10px 12px 10px 40px',
                  background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                  borderRadius: '4px', color: 'white', fontSize: '12px',
                  fontFamily: 'var(--mono-font)'
                }}
              />
            </div>
            <button 
              className="btn-console" 
              onClick={runCategoryScan}
              disabled={isScanning || !query.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: isScanning || !query.trim() ? 0.5 : 1 }}
            >
              {isScanning ? <Loader2 size={14} className="spinner" /> : <Play size={14} />}
              SCAN_ALL
            </button>
          </div>

          {/* Tools Grid */}
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {currentCategory.tools.map(tool => (
              <button
                key={tool.id}
                onClick={() => runQuickScan(tool.id)}
                disabled={isScanning || !query.trim()}
                style={{
                  padding: '16px', border: '1px solid var(--glass-border)', borderRadius: '4px',
                  background: 'rgba(255,255,255,0.02)', color: 'white', cursor: 'pointer',
                  textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px',
                  opacity: isScanning || !query.trim() ? 0.5 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 900, letterSpacing: '1px', fontFamily: 'var(--mono-font)' }}>
                    {tool.name}
                  </span>
                  {selectedTool === tool.id && <Loader2 size={14} className="spinner" />}
                </div>
                <span style={{ fontSize: '10px', color: '#64748b' }}>{tool.description}</span>
              </button>
            ))}
          </div>

          {/* Results Panel */}
          <div style={{ flex: 1, overflow: 'auto', padding: '16px', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--mono-font)', letterSpacing: '1px' }}>
                SCAN_RESULTS [{results.length}]
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-console" onClick={exportResults} style={{ padding: '4px 8px', fontSize: '10px' }}>
                  <Download size={12} /> EXPORT
                </button>
                <button className="btn-console" onClick={clearResults} style={{ padding: '4px 8px', fontSize: '10px' }}>
                  <Trash2 size={12} /> CLEAR
                </button>
              </div>
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '12px' }}>
                <Search size={32} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>Enter an indicator and run a scan to see results</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {results.map((r, i) => (
                  <div key={i} style={{ 
                    padding: '12px', background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '4px', borderLeft: `3px solid ${currentCategory.color}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 900, color: currentCategory.color, fontFamily: 'var(--mono-font)' }}>
                        {r.toolId.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        {new Date(r.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <pre style={{ 
                      fontSize: '10px', color: '#94a3b8', fontFamily: 'var(--mono-font)',
                      margin: 0, whiteSpace: 'pre-wrap', maxHeight: '100px', overflow: 'auto'
                    }}>
                      {JSON.stringify(r.data, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}