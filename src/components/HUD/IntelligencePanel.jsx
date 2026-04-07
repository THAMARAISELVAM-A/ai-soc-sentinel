import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Newspaper, ShieldAlert, TrendingUp, Globe, ExternalLink, Loader2 } from "lucide-react";

const RSS_FEEDS = {
  CYBER: "https://feeds.feedburner.com/TheHackersNews",
  FINANCE: "https://finance.yahoo.com/news/rssindex",
  GEOINT: "https://feeds.bbci.co.uk/news/world/rss.xml"
};

export function IntelligencePanel({ activeDomain }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(false);
      try {
        const rssUrl = RSS_FEEDS[activeDomain] || RSS_FEEDS.CYBER;
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();
        if (data.status === 'ok') {
          setNews(data.items.slice(0, 8)); // Top 8 news
        } else {
          setError(true);
        }
      } catch (e) {
        console.error("News Fetch Failed", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 600000); // 10 min refresh
    return () => clearInterval(interval);
  }, [activeDomain]);

  return (
    <div className="glass-panel" style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", minHeight: 400 }}>
      {/* Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h4 style={{ margin: 0, fontSize: 13, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--domain-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Newspaper size={16} /> LIVE INTELLIGENCE
        </h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
           <div className={`status-dot ${loading ? 'scanning' : ''}`} style={{ width: 6, height: 6, borderRadius: '50%', background: error ? '#ef4444' : '#10b981' }} />
           <span style={{ fontSize: 9, color: '#666', fontWeight: 900 }}>{loading ? 'SYNCING...' : 'REAL-TIME'}</span>
        </div>
      </div>

      {loading && !news.length ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
           <Loader2 className="scanning" size={24} color="var(--domain-primary)" />
           <span style={{ fontSize: 11, letterSpacing: '0.15em', opacity: 0.4 }}>SCANNING GLOBAL CHANNELS...</span>
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, textAlign: 'center' }}>
           <ShieldAlert size={28} color="#ef4444" style={{ marginBottom: 10 }} />
           <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4444' }}>FEED OFFLINE</span>
           <span style={{ fontSize: 10, opacity: 0.6 }}>Connection interrupted. Retrying in background.</span>
        </div>
      ) : (
        <div className="list-container" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {news.map((item, idx) => (
            <motion.div 
              key={idx} 
              className="intel-card" 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: idx * 0.05 }}
              style={{ borderLeft: `3px solid var(--domain-primary)`, padding: '16px', cursor: 'pointer' }}
              onClick={() => window.open(item.link, '_blank')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                 <div className="intel-source" style={{ margin: 0 }}>
                    {activeDomain === 'CYBER' ? <ShieldAlert size={10} /> : activeDomain === 'FINANCE' ? <TrendingUp size={10} /> : <Globe size={10} />}
                    {item.author || (activeDomain === 'CYBER' ? 'HACKER NEWS' : activeDomain === 'FINANCE' ? 'YAHOO FINANCE' : 'BBC WORLD')}
                 </div>
                 <ExternalLink size={10} style={{ opacity: 0.4 }} />
              </div>
              <div className="intel-title" style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, color: '#f8fafc' }}>
                {item.title}
              </div>
              <div style={{ marginTop: 8, fontSize: 9, color: '#64748b', fontStyle: 'italic' }}>
                {new Date(item.pubDate).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
