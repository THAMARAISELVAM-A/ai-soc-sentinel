// ─────────────────────────────────────────────────────────────────────
// SENTINEL-ARM OSINT FRAMEWORK
// Complete suite of military-grade intelligence gathering tools
// ─────────────────────────────────────────────────────────────────────

export const OSINT_CATEGORIES = {
  NETWORK: {
    name: "Network Reconnaissance",
    icon: "Globe",
    color: "#3b82f6",
    tools: [
      { id: "ip_lookup", name: "IP Geolocation", description: "Trace IP to geographic location", endpoint: "https://ipapi.co/{query}/json/" },
      { id: "reverse_dns", name: "Reverse DNS", description: "Find domains on IP", endpoint: "https://api.viewdns.info/reverseip/?host={query}&apikey={apiKey}" },
      { id: "whois", name: "WHOIS Lookup", description: "Domain/IP registration", endpoint: "https://api.viewdns.info/whois/?domain={query}&apikey={apiKey}" },
      { id: "dns_lookup", name: "DNS Records", description: "Query DNS records", endpoint: "https://dns.google/resolve?name={query}&type=ANY" },
      { id: "subdomain", name: "Subdomain Finder", description: "Discover subdomains", endpoint: "https://api.viewdns.info/subdomains/?domain={query}&apikey={apiKey}" },
      { id: "port_scan", name: "Port Scanner", description: "Scan common ports", endpoint: "https://api.shodan.io/shodan/host/{query}" },
      { id: "ssl_cert", name: "SSL Certificate", description: "SSL/TLS certificate info", endpoint: "https://crt.sh/?q={query}&output=json" },
      { id: "cdn_check", name: "CDN Detection", description: "Identify CDN provider", endpoint: "https://api.viewdns.info/cdncheck/?domain={query}&apikey={apiKey}" },
    ]
  },
  PEOPLE: {
    name: "Human Intelligence",
    icon: "Users",
    color: "#8b5cf6",
    tools: [
      { id: "username", name: "Username Search", description: "Find across social platforms", endpoint: "https://api.socialsearcher.com/v2/users?q={query}" },
      { id: "email_find", name: "Email Finder", description: "Discover email addresses", endpoint: "https://api.viewdns.info/emailfinder/?domain={query}&apikey={apiKey}" },
      { id: "phone_lookup", name: "Phone Number", description: "Phone number info", endpoint: "https://api.numverify.com/validate?number={query}&apikey={apiKey}" },
      { id: "paste_search", name: "Paste Search", description: "Search leaked data", endpoint: "https://api.pastesearch.com/search?q={query}" },
      { id: "linkedin", name: "LinkedIn Profile", description: "Find LinkedIn profiles", endpoint: "https://api.socialsearcher.com/v2/search?q={query}&network=linkedin" },
      { id: "github", name: "GitHub Recon", description: "GitHub username search", endpoint: "https://api.github.com/search/users?q={query}" },
    ]
  },
  MEDIA: {
    name: "Media Forensics",
    icon: "Image",
    color: "#10b981",
    tools: [
      { id: "exif", name: "EXIF Extractor", description: "Extract image metadata", type: "upload" },
      { id: "reverse_image", name: "Reverse Image", description: "Find image origins", endpoint: "https://lens.google.com/uploadbyurl?url={query}" },
      { id: "metadata", name: "Document Metadata", description: "Extract file metadata", type: "upload" },
      { id: "audio_geo", name: "Audio Forensics", description: "Analyze audio for location", type: "upload" },
      { id: "video_meta", name: "Video Analysis", description: "Extract video metadata", type: "upload" },
    ]
  },
  THREAT: {
    name: "Threat Intelligence",
    icon: "ShieldAlert",
    color: "#ef4444",
    tools: [
      { id: "threatfox", name: "ThreatFox IOC", description: "Malware indicators", endpoint: "https://threatfox-api.abuse.ch/api/v1/" },
      { id: "malware_bazaar", name: "Malware Bazaar", description: "Malware sample database", endpoint: "https://mb-api.abuse.ch/api/v1/" },
      { id: "urlhaus", name: "URLhaus", description: "Malicious URLs", endpoint: "https://urlhaus-api.abuse.ch/v1/urls/" },
      { id: "virus_total", name: "VirusTotal", description: "File/IP reputation", endpoint: "https://www.virustotal.com/api/v3/files/{query}" },
      { id: "abuse_ip", name: "AbuseIPDB", description: "Malicious IP database", endpoint: "https://api.abuseipdb.com/api/v2/check?ipAddress={query}" },
      { id: "alien_vault", name: "AlienVault OTX", description: "Threat pulses", endpoint: "https://otx.alienvault.com/api/v1/pulses/subscribed" },
      { id: "shodan", name: "Shodan Search", description: "Internet-connected devices", endpoint: "https://api.shodan.io/shodan/host/{query}" },
      { id: "security_trails", name: "Security Trails", description: "DNS history", endpoint: "https://api.securitytrails.com/v1/domain/{query}" },
    ]
  },
  DOMAIN: {
    name: "Domain Intelligence",
    icon: "Database",
    color: "#f59e0b",
    tools: [
      { id: "domain_age", name: "Domain Age", description: "Registration date", endpoint: "https://api.viewdns.info/whois/?domain={query}&apikey={apiKey}" },
      { id: "mx_lookup", name: "MX Records", description: "Mail servers", endpoint: "https://dns.google/resolve?name={query}&type=MX" },
      { id: "txt_records", name: "TXT Records", description: "DNS TXT entries", endpoint: "https://dns.google/resolve?name={query}&type=TXT" },
      { id: "zone_transfer", name: "Zone Transfer", description: "Attempt zone transfer", type: "manual" },
      { id: "tech_stack", name: "Tech Stack", description: "Detect technologies", endpoint: "https://api.viewdns.info/technology/?domain={query}&apikey={apiKey}" },
      { id: "http_headers", name: "HTTP Headers", description: "Server headers", endpoint: "https://api.viewdns.info/httpheaders/?domain={query}&apikey={apiKey}" },
    ]
  },
  SOCIAL: {
    name: "Social Media Intel",
    icon: "Share2",
    color: "#06b6d4",
    tools: [
      { id: "twitter", name: "Twitter/X Analysis", description: "Tweet search", endpoint: "https://api.twitter.com/2/tweets/search/recent?query={query}" },
      { id: "instagram", name: "Instagram Recon", description: "Profile lookup", endpoint: "https://api.socialsearcher.com/v2/search?q={query}&network=instagram" },
      { id: "facebook", name: "Facebook Search", description: "Find profiles", endpoint: "https://api.socialsearcher.com/v2/search?q={query}&network=facebook" },
      { id: "tiktok", name: "TikTok Analysis", description: "Content search", endpoint: "https://api.socialsearcher.com/v2/search?q={query}&network=tiktok" },
      { id: "youtube", name: "YouTube Search", description: "Video search", endpoint: "https://api.socialsearcher.com/v2/search?q={query}&network=youtube" },
    ]
  }
};

// API Keys (user configurable)
export const OSINT_CONFIG = {
  viewdns_key: "",
  numverify_key: "",
  virus_total_key: "",
  shodan_key: "",
  abuseipdb_key: "",
  securitytrails_key: "",
  google_cse_key: "",
};

// Common public APIs that don't require auth
export const FREE_OSINT_APIS = {
  ipapi: "https://ipapi.co/{query}/json/",
  ipapi_location: "https://ipapi.co/{query}/location/",
  dns_google: "https://dns.google/resolve?name={query}&type=ANY",
  crt_sh: "https://crt.sh/?q={query}&output=json",
  github: "https://api.github.com/users/{query}",
  github_search: "https://api.github.com/search/code?q={query}",
};

// OSINT Scan Result Interface
export const createScanResult = (toolId, query, data, timestamp = Date.now()) => ({
  id: `scan_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
  toolId,
  query,
  data,
  timestamp,
  status: "complete"
});

// Utility functions
export const formatOSINTToolName = (toolId) => {
  return toolId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const getToolCategory = (toolId) => {
  for (const [cat, data] of Object.entries(OSINT_CATEGORIES)) {
    if (data.tools.find(t => t.id === toolId)) return cat;
  }
  return null;
};