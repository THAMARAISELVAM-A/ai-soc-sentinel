import React, { useState, useEffect } from "react";
import { Newspaper, ShieldAlert, TrendingUp, Globe, ExternalLink, Loader2, Info, Minimize2 } from "lucide-react";
import { useSentinelStore } from "../../store/sentinelStore";

const RSS_FEEDS = {
  CYBER: "https://feeds.feedburner.com/TheHackersNews",
  FINANCE: "https://finance.yahoo.com/news/rssindex",
  GEOINT: "https://feeds.bbci.co.uk/news/world/rss.xml"
};

/**
 * IntelligencePanel - Master Class OSINT Telemetry Stream.
 */
export function IntelligencePanel() {
  const { activeDomain, togglePanel } = useSentinelStore();
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
          setNews(data.items.slice(0, 10));
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
    const interval = setInterval(fetchNews, 600000);
    return () => clearInterval(interval);
  }, [activeDomain]);

  return (
    <div className="glass-panel" style={{ padding: '32px', flex: 1, display: "flex", flexDirection: "column", minHeight: '380px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h4 className="panel-label" style={{ margin: 0 }}>
            <Newspaper size={14} /> OSINT_TACTICAL_UPLINK
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <div className={`status-dot ${loading ? 'scanning' : ''}`} style={{ width: 6, height: 6, borderRadius: '50%', background: error ? 'var(--alert-red)' : '#10b981', boxShadow: `0 0 10px ${error ? 'var(--alert-red)' : '#10b981'}` }} />
             <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 900, letterSpacing: '1px', fontFamily: 'var(--mono-font)' }}>
               {loading ? 'SYNCING...' : 'LIVE_FEED'}
             </span>
          </div>
        </div>
        <button onClick={() => togglePanel('intel')} className="btn-console" style={{ padding: '4px 8px' }}>
           <Minimize2 size={12} />
        </button>
      </div>

      {loading && !news.length ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
           <Loader2 className="scanning" size={24} color="var(--domain-primary)" />
           <span style={{ fontSize: '10px', letterSpacing: '0.2em', opacity: 0.5, fontFamily: 'var(--mono-font)' }}>
             FETCH_INTEL_STREAMING_V4.2
           </span>
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', textAlign: 'center' }}>
           <ShieldAlert size={24} color="var(--alert-red)" />
           <span style={{ fontSize: '11px', fontWeight: 900, color: 'var(--alert-red)', letterSpacing: '1px' }}>FEED_INTERRUPTED</span>
           <span style={{ fontSize: '9px', opacity: 0.5, fontFamily: 'var(--mono-font)' }}>RETRYING_HANDSHAKE_P2P</span>
        </div>
      ) : (
        <div className="custom-scrollbar" style={{ display: "flex", flexDirection: "column", gap: '12px', overflowY: 'auto', flexGrow: 1, paddingRight: '8px' }}>
          {news.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: idx * 0.04 }}
              style={{ borderLeft: `2px solid var(--domain-primary)`, padding: '16px', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', borderRadius: '0 8px 8px 0', transition: '0.2s' }}
              className="live-item"
              onClick={() => window.open(item.link, '_blank')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '9px', color: 'var(--domain-primary)', fontWeight: 800, fontFamily: 'var(--mono-font)' }}>
                    {activeDomain === 'CYBER' ? <ShieldAlert size={10} /> : activeDomain === 'FINANCE' ? <TrendingUp size={10} /> : <Globe size={10} />}
                    {activeDomain}_SIGNAL
                 </div>
                 <ExternalLink size={10} style={{ opacity: 0.4 }} />
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.4, color: '#f8fafc' }}>
                {item.title}
              </div>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', color: '#64748b', fontFamily: 'var(--mono-font)', opacity: 0.7 }}>
                  {new Date(item.pubDate).toLocaleDateString()}
                </span>
                <span style={{ fontSize: '8px', color: '#64748b', fontWeight: 900, background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                  SOURCE: RSS_B_UPLINK
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b', fontSize: '9px', letterSpacing: '1px' }}>
         <Info size={12} />
         <span>ENCRYPTED_SIGNAL_STREAM_BYPASS_ENABLED</span>
      </div>
    </div>
  );
}
