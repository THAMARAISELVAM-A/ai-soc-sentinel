import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ port: process.env.WS_PORT || 8081 });

// Middleware
app.use(cors({
  origin: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
}));
app.use(express.json());

// Initialize Claude AI client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// LLM Context Persistence - Store conversation history per session
const sessionContexts = new Map();

// Weighted Anomaly Engine - Risk scoring system
class WeightedAnomalyEngine {
  constructor() {
    this.threatWeights = {
      'intrusion': 9.5,
      'malware': 8.5,
      'bruteforce': 7.0,
      'ddos': 8.0,
      'phishing': 6.5,
      'data_exfiltration': 9.8,
      'privilege_escalation': 9.2,
      'zero_day': 10.0,
      'ransomware': 9.9,
      'apt': 9.7
    };
    
    this.severityMultipliers = {
      'critical': 1.5,
      'high': 1.2,
      'medium': 1.0,
      'low': 0.7,
      'info': 0.3
    };
  }

  calculateRiskScore(threat) {
    const baseWeight = this.threatWeights[threat.type] || 5.0;
    const severityMult = this.severityMultipliers[threat.severity] || 1.0;
    const timeFactor = this.getTimeDecayFactor(threat.timestamp);
    const sourceReputation = this.getSourceReputation(threat.source);
    
    const finalScore = Math.min(10, 
      (baseWeight * severityMult * timeFactor) + (sourceReputation * 0.5)
    );
    
    return Math.round(finalScore * 10) / 10;
  }

  getTimeDecayFactor(timestamp) {
    const age = (Date.now() - new Date(timestamp).getTime()) / 60000; // minutes
    return Math.max(0.5, 1 - (age * 0.01)); // Decay over time
  }

  getSourceReputation(source) {
    // Simulate source reputation scoring
    const knownBadActors = ['198.51.100.', '203.0.113.', '192.0.2.'];
    if (knownBadActors.some(prefix => source.startsWith(prefix))) {
      return 2.0;
    }
    return 0.5;
  }

  classifyThreatLevel(score) {
    if (score >= 9.0) return 'CRITICAL';
    if (score >= 7.0) return 'HIGH';
    if (score >= 5.0) return 'ELEVATED';
    if (score >= 3.0) return 'GUARDED';
    return 'LOW';
  }
}

const anomalyEngine = new WeightedAnomalyEngine();

// Simulated threat data generator
function generateThreatData() {
  const threatTypes = ['intrusion', 'malware', 'bruteforce', 'ddos', 'phishing', 'data_exfiltration'];
  const severities = ['critical', 'high', 'medium', 'low'];
  const protocols = ['HTTPS', 'HTTP', 'SSH', 'FTP', 'SMTP', 'DNS', 'UDP', 'TCP'];
  
  const sourceIPs = [
    '198.51.100.23', '203.0.113.42', '192.0.2.15', '198.51.100.87',
    '203.0.113.91', '192.0.2.44', '198.51.100.156', '203.0.113.201'
  ];
  const targetIPs = [
    '10.0.0.1', '10.0.0.5', '10.0.0.12', '172.16.0.8', 
    '172.16.0.15', '10.0.0.100', '172.16.0.50'
  ];

  const descriptions = {
    intrusion: [
      'SQL injection attempt detected on web application firewall',
      'Unauthorized access attempt to admin panel',
      'Cross-site scripting (XSS) payload detected in request'
    ],
    malware: [
      'Trojan downloader activity identified in network traffic',
      'Ransomware encryption pattern detected in file operations',
      'Command & control beacon communication identified'
    ],
    bruteforce: [
      'SSH brute force attack from known botnet infrastructure',
      'RDP credential stuffing attempt detected',
      'API rate limiting triggered by automated attack'
    ],
    ddos: [
      'Volumetric DDoS attack mitigated by edge protection',
      'SYN flood detected from distributed sources',
      'Application layer DDoS targeting login endpoint'
    ],
    phishing: [
      'Spear phishing email with malicious attachment blocked',
      'Credential harvesting site detected mimicking corporate portal',
      'Business email compromise attempt identified'
    ],
    data_exfiltration: [
      'Unusual data transfer volume to external IP detected',
      'Sensitive file access pattern matching data theft profile',
      'Encrypted data exfiltration via DNS tunneling identified'
    ]
  };

  const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  return {
    id: uuidv4(),
    type,
    severity,
    source: sourceIPs[Math.floor(Math.random() * sourceIPs.length)],
    target: targetIPs[Math.floor(Math.random() * targetIPs.length)],
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
    timestamp: new Date().toISOString(),
    riskScore: 0, // Will be calculated by anomaly engine
    location: {
      lat: (Math.random() - 0.5) * 160,
      lon: Math.random() * 360
    }
  };
}

// Claude AI Analysis
async function analyzeThreatWithClaude(threat, sessionId) {
  try {
    // Get or create session context
    let context = sessionContexts.get(sessionId);
    if (!context) {
      context = {
        messages: [],
        sessionStart: new Date().toISOString(),
        threatCount: 0
      };
      sessionContexts.set(sessionId, context);
    }

    // Limit context to last 10 messages to manage tokens
    if (context.messages.length > 20) {
      context.messages = context.messages.slice(-20);
    }

    const systemPrompt = `You are an expert cybersecurity analyst AI assistant for AI SOC Sentinel. 
Analyze security threats and provide concise, actionable insights. 
Consider the context of previous threats in this session.
Provide analysis in this format:
- THREAT ASSESSMENT: [Brief assessment]
- LIKELY ATTACKER: [Profile/attribution]
- IMMEDIATE ACTIONS: [1-3 critical steps]
- INVESTIGATION PATHS: [Follow-up actions]

Keep responses under 150 words. Be direct and tactical.`;

    const userMessage = `Analyze this security threat (Session #${sessionId.slice(0, 8)}):
Type: ${threat.type.toUpperCase()}
Severity: ${threat.severity.toUpperCase()}
Source: ${threat.source} → Target: ${threat.target}
Protocol: ${threat.protocol}
Description: ${threat.description}
Risk Score: ${threat.riskScore}/10
Time: ${new Date(threat.timestamp).toLocaleString()}

Previous related threats in session: ${context.threatCount}`;

    const response = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      max_tokens: parseInt(process.env.CLAUDE_MAX_TOKENS) || 1024,
      system: systemPrompt,
      messages: [
        ...context.messages,
        { role: 'user', content: userMessage }
      ]
    });

    const analysis = response.content[0].text;
    
    // Update context with this exchange
    context.messages.push({ role: 'user', content: userMessage });
    context.messages.push({ role: 'assistant', content: analysis });
    context.threatCount++;

    return {
      analysis,
      sessionId,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Claude API Error:', error.message);
    return {
      analysis: `⚠️ AI Analysis unavailable: ${error.message}`,
      sessionId,
      analyzedAt: new Date().toISOString(),
      error: true
    };
  }
}

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('🔌 Client connected to WebSocket');
  
  const sessionId = uuidv4();
  ws.sessionId = sessionId;
  
  // Send session ID to client
  ws.send(JSON.stringify({
    type: 'session_init',
    sessionId,
    timestamp: new Date().toISOString()
  }));

  // Send initial threat data
  const initialThreats = Array.from({ length: 5 }, () => {
    const threat = generateThreatData();
    threat.riskScore = anomalyEngine.calculateRiskScore(threat);
    return threat;
  });

  ws.send(JSON.stringify({
    type: 'initial_data',
    threats: initialThreats,
    systemStats: {
      eventsPerSecond: Math.floor(1200 + Math.random() * 300),
      activeThreats: Math.floor(20 + Math.random() * 15),
      blockedAttacks: Math.floor(850 + Math.random() * 200),
      uptime: '99.97%',
      threatLevel: anomalyEngine.classifyThreatLevel(7.5)
    }
  }));

  // Real-time threat simulation
  const threatInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      const threat = generateThreatData();
      threat.riskScore = anomalyEngine.calculateRiskScore(threat);
      
      ws.send(JSON.stringify({
        type: 'new_threat',
        threat,
        threatLevel: anomalyEngine.classifyThreatLevel(threat.riskScore)
      }));
    }
  }, 3000 + Math.random() * 4000); // Random interval 3-7 seconds

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'analyze_threat') {
        const analysis = await analyzeThreatWithClaude(data.threat, sessionId);
        ws.send(JSON.stringify({
          type: 'ai_analysis',
          analysis,
          threatId: data.threat.id
        }));
      }
      
      if (data.type === 'get_context') {
        const context = sessionContexts.get(sessionId);
        ws.send(JSON.stringify({
          type: 'context_summary',
          sessionStart: context?.sessionStart,
          threatCount: context?.threatCount || 0,
          messageCount: context?.messages.length || 0
        }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    clearInterval(threatInterval);
    console.log('🔌 Client disconnected');
    // Clean up session after 5 minutes
    setTimeout(() => sessionContexts.delete(sessionId), 5 * 60 * 1000);
  });
});

// REST API endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    aiEnabled: !!process.env.ANTHROPIC_API_KEY,
    activeSessions: sessionContexts.size
  });
});

app.get('/api/stats', (req, res) => {
  const stats = {
    activeSessions: sessionContexts.size,
    totalThreatsAnalyzed: Array.from(sessionContexts.values())
      .reduce((sum, ctx) => sum + ctx.threatCount, 0),
    averageRiskScore: 7.2, // Simulated
    topThreatTypes: [
      { type: 'intrusion', count: 156 },
      { type: 'malware', count: 89 },
      { type: 'bruteforce', count: 234 }
    ]
  };
  res.json(stats);
});

app.post('/api/analyze', async (req, res) => {
  const { threat, sessionId } = req.body;
  if (!threat) {
    return res.status(400).json({ error: 'Threat data required' });
  }
  
  const analysis = await analyzeThreatWithClaude(threat, sessionId || 'rest-api');
  res.json(analysis);
});

// Start server
const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 AI SOC Sentinel Server running on port ${PORT}`);
  console.log(`🔌 WebSocket server running on port ${process.env.WS_PORT || 8081}`);
  console.log(`🤖 Claude AI: ${process.env.ANTHROPIC_API_KEY ? 'Enabled' : 'Disabled (set ANTHROPIC_API_KEY)'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Shutting down gracefully...');
  httpServer.close();
  wss.close();
  process.exit(0);
});