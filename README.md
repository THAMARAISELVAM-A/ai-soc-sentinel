# AI SOC Sentinel - World Monitor Intelligence Engine v2.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-000000.svg)](https://threejs.org/)
[![Claude 3.5](https://img.shields.io/badge/Claude-3.5-a855f7.svg)](https://anthropic.com/claude)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-10b981.svg)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🛡️ Overview

**AI SOC Sentinel** is an advanced, open-source Security Operations Center (SOC) dashboard powered by **Claude 3.5 AI** for real-time cybersecurity monitoring, intelligent threat analysis, and automated incident response. It features a stunning 3D globe visualization with orbital attack trails, CRT scanline effects, glass-morphism UI, and a sophisticated weighted anomaly detection engine.

### ✨ What's New in v2.0

- 🤖 **Claude 3.5 AI Integration** - Real-time threat analysis with LLM context persistence
- 🔌 **WebSocket Bridge** - True real-time bidirectional threat data streaming
- ⚖️ **Weighted Anomaly Engine** - Intelligent risk scoring with time decay and source reputation
- 🌍 **Enhanced 3D Globe** - Orbital trails, attack visualizations, and radar sweep effects
- 📺 **CRT Scanline Effects** - Military-grade tactical display with scanlines and flicker
- 🔤 **Orbitron Typography** - Sci-fi military aesthetic with Google Fonts
- 🎯 **Risk Score Indicators** - Visual threat level classification (CRITICAL/HIGH/ELEVATED/GUARDED/LOW)
- 🧠 **LLM Context Persistence** - Session-aware AI that remembers previous threats and analysis

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) Anthropic API key for Claude 3.5 AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/THAMARAISELVAM-A/ai-soc-sentinel.git
cd ai-soc-sentinel

# Install dependencies
npm install

# Copy environment files
cp .env.example .env
cp server/.env.example server/.env

# (Optional) Add your Anthropic API key to server/.env
# ANTHROPIC_API_KEY=your_key_here

# Start the backend server (in one terminal)
npm run server

# Start the frontend (in another terminal)
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8080`.

### Build for Production

```bash
npm run build
npm run preview
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t ai-soc-sentinel .
docker run -p 80:80 ai-soc-sentinel
```

## 📁 Project Structure

```
ai-soc-sentinel/
├── public/
│   └── assets/              # Font files and static assets
├── src/
│   ├── hooks/               # Custom React hooks
│   │   └── useWebSocket.js # WebSocket client hook
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   ├── index.css           # Global styles + CRT effects
│   └── main.jsx            # Application entry point
├── server/
│   ├── index.js            # Backend server with WebSocket + Claude AI
│   └── .env.example        # Server environment template
├── .env.example            # Frontend environment template
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── Dockerfile              # Docker configuration
├── nginx.conf              # Nginx production config
└── README.md               # This file
```

## 🏗️ Architecture

### Phase 1: Tech Stack & Foundation
- **React 18 + Vite 5** - Fast frontend development and builds
- **Orbitron Typography** - Sci-fi military aesthetic
- **Glass-morphism + CRT Effects** - Tactical display styling

### Phase 2: 3D Visual Engine
- **Three.js + React Three Fiber** - 3D globe rendering
- **Orbital Trails** - Attack path visualization
- **Radar Sweep** - Situational awareness effects
- **NASA-style Globe** - Realistic Earth visualization

### Phase 3: Neural Core (AI)
- **Anthropic Claude 3.5** - Advanced threat analysis
- **LLM Context Persistence** - Session-aware conversations
- **System Prompts** - Tactical analysis formatting
- **Token Management** - Context window optimization

### Phase 4: Data Pipeline
- **WebSocket Bridge** - Real-time bidirectional communication
- **Weighted Anomaly Engine** - Risk scoring algorithm
- **Time Decay Factors** - Dynamic threat prioritization
- **Source Reputation** - IP-based threat intelligence

### Phase 5: Military UI/UX
- **CRT Scanlines** - Retro-futuristic display effects
- **Tactical Corners** - Military-grade interface elements
- **Risk Score Indicators** - Visual threat classification
- **Responsive Layout** - Stable under high data load

## 🎮 Usage

### Starting the Application

1. **Start the backend server** (provides WebSocket + AI analysis):
   ```bash
   npm run server
   ```

2. **Start the frontend** (React development server):
   ```bash
   npm run dev
   ```

3. **Open your browser** to `http://localhost:5173`

### Domain Navigation

Switch between different monitoring domains using the icon buttons in the left panel:

- **CYBER** (Blue) - Cybersecurity threats and network monitoring
- **FINANCE** (Orange) - Financial fraud detection and transaction monitoring  
- **GEOINT** (Green) - Geographic intelligence and location-based threats

### Interface Sections

1. **Header** - System title, logo, WebSocket status, and key metrics
2. **Left Panel** - Threat intelligence feed, live events, and AI analysis
3. **Right Panel** - Command center with search, quick actions, console, and system status
4. **Bottom Panel** - Quick stats including threat level, active sensors, monitored networks
5. **Center** - Interactive 3D globe showing global threat landscape with orbital attack trails

### Interactive Features

- **Rotate Globe**: Click and drag to rotate the 3D globe
- **Zoom**: Scroll to zoom in/out on the globe
- **Alert Mode**: Toggle emergency alert mode (changes theme to red)
- **Console**: Toggle system console for live logs
- **Search**: Search for threats, IPs, or hashes
- **Tabs**: Switch between Intel Feed, Live Events, and AI Analysis views
- **Select Threat**: Click on a live event to request AI analysis from Claude 3.5
- **AI Analysis**: View detailed threat assessment, attacker profiling, and remediation steps

### Using AI Analysis

1. Click on any threat in the **LIVE EVENTS** panel
2. The system will automatically request analysis from Claude 3.5
3. View the AI-generated assessment including:
   - **THREAT ASSESSMENT** - Brief analysis of the threat
   - **LIKELY ATTACKER** - Attribution and profiling
   - **IMMEDIATE ACTIONS** - Critical response steps
   - **INVESTIGATION PATHS** - Follow-up actions

### WebSocket Connection

The application automatically connects to the backend WebSocket server. The connection status is displayed in the header:
- 🟢 **ONLINE** - Connected to backend, receiving real-time threats
- 🔴 **OFFLINE** - Disconnected, using simulated data

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI framework
- **Vite 5.0** - Build tool and dev server
- **Three.js r160** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Orbitron Font** - Sci-fi military typography
- **JetBrains Mono** - Monospace font for code/terminal

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **WebSocket (ws)** - Real-time communication
- **@anthropic-ai/sdk** - Claude AI integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **uuid** - Unique ID generation

### DevOps
- **Docker** - Containerization
- **Nginx** - Production web server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🔧 Configuration

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend Configuration
VITE_WS_PORT=8081
VITE_API_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_AI_ANALYSIS=true
VITE_ENABLE_WEBSOCKET=true
```

### Backend Environment Variables

Create a `server/.env` file:

```env
# Anthropic API Key for Claude 3.5
ANTHROPIC_API_KEY=your_api_key_here

# Server Configuration
PORT=8080
WS_PORT=8081

# CORS Settings
ALLOWED_ORIGINS=http://localhost:5173,https://your-domain.com

# AI Model Configuration
CLAUDE_MODEL=claude-3-5-sonnet-20241022
CLAUDE_MAX_TOKENS=1024
```

### Customization

#### Theme Colors

Modify the CSS variables in `src/index.css`:

```css
:root {
  --soc-bg: #010204;
  --soc-accent: #3b82f6;
  --domain-primary: #3b82f6;
  --domain-glow: #3c83f626;
  --crt-scanline-opacity: 0.03;
  /* ... other variables */
}
```

#### Risk Scoring Weights

Edit the `WeightedAnomalyEngine` class in `server/index.js`:

```javascript
this.threatWeights = {
  'intrusion': 9.5,
  'malware': 8.5,
  'bruteforce': 7.0,
  // Add custom threat types
};
```

#### AI Analysis Prompts

Modify the `systemPrompt` in `server/index.js` to customize Claude's analysis format.

## 📊 API Reference

### REST Endpoints

#### GET `/api/health`
Returns server health status.

```json
{
  "status": "healthy",
  "timestamp": "2024-04-07T12:00:00.000Z",
  "version": "2.0.0",
  "aiEnabled": true,
  "activeSessions": 5
}
```

#### GET `/api/stats`
Returns aggregated statistics.

```json
{
  "activeSessions": 5,
  "totalThreatsAnalyzed": 127,
  "averageRiskScore": 7.2,
  "topThreatTypes": [
    { "type": "intrusion", "count": 156 },
    { "type": "malware", "count": 89 }
  ]
}
```

#### POST `/api/analyze`
Request AI analysis for a threat.

**Request Body:**
```json
{
  "threat": {
    "type": "intrusion",
    "severity": "high",
    "source": "198.51.100.23",
    "target": "10.0.0.1",
    "protocol": "HTTPS",
    "description": "SQL injection attempt",
    "riskScore": 8.5
  },
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "analysis": "THREAT ASSESSMENT: ...\nLIKELY ATTACKER: ...\nIMMEDIATE ACTIONS: ...\nINVESTIGATION PATHS: ...",
  "sessionId": "uuid",
  "analyzedAt": "2024-04-07T12:00:00.000Z"
}
```

### WebSocket Messages

#### Client → Server

**Request Analysis:**
```json
{
  "type": "analyze_threat",
  "threat": { /* threat object */ },
  "timestamp": "2024-04-07T12:00:00.000Z"
}
```

**Get Context Summary:**
```json
{
  "type": "get_context"
}
```

#### Server → Client

**Session Initialization:**
```json
{
  "type": "session_init",
  "sessionId": "uuid",
  "timestamp": "2024-04-07T12:00:00.000Z"
}
```

**Initial Data:**
```json
{
  "type": "initial_data",
  "threats": [ /* threat objects */ ],
  "systemStats": { /* stats object */ }
}
```

**New Threat:**
```json
{
  "type": "new_threat",
  "threat": { /* threat object */ },
  "threatLevel": "HIGH"
}
```

**AI Analysis Result:**
```json
{
  "type": "ai_analysis",
  "analysis": "THREAT ASSESSMENT: ...",
  "threatId": "uuid"
}
```

**Context Summary:**
```json
{
  "type": "context_summary",
  "sessionStart": "2024-04-07T12:00:00.000Z",
  "threatCount": 12,
  "messageCount": 24
}
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a pull request.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use ESLint for code linting
- Follow the existing code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Test WebSocket and AI features before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** - For Claude 3.5 and the AI SDK
- **Three.js** - For the amazing 3D library
- **React Three Fiber** - For React bindings to Three.js
- **Lucide** - For beautiful open-source icons
- **Framer Motion** - For smooth animations
- **Google Fonts** - For Orbitron and JetBrains Mono fonts

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/THAMARAISELVAM-A/ai-soc-sentinel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/THAMARAISELVAM-A/ai-soc-sentinel/discussions)
- **Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides

## 🗺️ Roadmap

### Completed ✅
- [x] Claude 3.5 AI integration
- [x] WebSocket real-time bridge
- [x] Weighted anomaly scoring engine
- [x] Enhanced 3D globe with orbital trails
- [x] CRT scanline effects
- [x] Orbitron typography
- [x] Risk score indicators
- [x] LLM context persistence

### In Progress 🚧
- [ ] Real threat intelligence API integration
- [ ] User authentication and role-based access
- [ ] Custom dashboard configurations

### Planned 📋
- [ ] Export reports functionality
- [ ] Mobile app version
- [ ] Plugin system for custom integrations
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Advanced filtering and search
- [ ] Historical threat analysis
- [ ] Integration with SIEM systems
- [ ] Automated response playbooks

## 📊 Demo

![AI SOC Sentinel Demo](https://via.placeholder.com/800x450/010204/3b82f6?text=AI+SOC+Sentinel+v2.0)

*Interactive 3D globe with real-time cyber threat visualization, AI analysis, and military-grade tactical display*

---

**Built with ❤️ for the cybersecurity community**

*AI SOC Sentinel v2.0 - AI-powered threat detection, real-time analysis, intelligent response.*