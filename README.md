# 🛡️ AI SOC Sentinel

> **Autonomous AI-Powered Security Operations Center** — Real-time threat detection, 3D global tracking, satellite visualization, and predictive intelligence powered by Anthropic Claude.

[![Deploy](https://github.com/THAMARAISELVAM-A/ai-soc-sentinel/actions/workflows/deploy.yml/badge.svg)](https://github.com/THAMARAISELVAM-A/ai-soc-sentinel/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌐 Live Demo

**[→ https://thamaraiselvam-a.github.io/ai-soc-sentinel/](https://thamaraiselvam-a.github.io/ai-soc-sentinel/)**

---

## ✨ Features

### 🤖 Autonomous AI Engine
- **Zero-config startup** — threat scanning begins the instant the page loads
- **Anthropic Claude** AI analyzes every telemetry log in real-time
- Graceful offline fallback to high-speed simulation mode if no API key is set

### 🌍 Advanced 3D Globe Visualization
- **Live satellite constellation tracking** — 28 simulated LEO/Starlink/Recon satellites with orbital physics animation
- **Custom 3D satellite models** with solar panel geometry rendered via Three.js
- **Holographic attack arcs** — glowing laser lines tracing active threat vectors between origin and target nodes
- **Pulse rings** on critical threat locations — radiating red circles pinpoint attacks in real time
- **Named strategic nodes** — 15 real-world data center hotspots with live threat classifications
- Photo-realistic night-side Earth texture with topology bump-mapping

### 🔍 Reverse IP Geolocation & Tracking
- Every anomaly generates an `attacker_ip` field
- Click **"REVERSE TRACK"** on any IP to query the live `ip-api.com` geolocation API
- The 3D globe instantly zooms and focuses on the attacker's real-world city

### 📊 Data Lake & Telemetry
- Live feed of 150+ classified events with AI-powered MITRE ATT&CK classification
- **SPL-style search** filtering — `severity:critical`, `is_anomaly:true`, keyword search
- **One-click CSV export** — download full telemetry report with timestamps and AI explanations
- 8 active threat signatures covering SQL Injection, Ransomware, DDoS, Lateral Movement, and more

### 🔮 Predictive L2 Forecaster
- After enough data accumulates, an AI agent analyzes attack patterns
- Outputs predicted next attack vector, probability, and estimated ETA

### 📡 OSINT Intelligence Engine
- Paste any threat intelligence article or report
- The AI extracts IOCs and auto-creates new monitoring signatures

### 🔊 Autonomous Audio Alarms
- Critical severity threats trigger a synthetic sonar ping via the Web Audio API
- No configuration required — fully autonomous

### 🎨 Multi-Domain Visualization
| Domain | Color Theme | Use Case |
|--------|-------------|----------|
| **CYBER** | Blue `#3b82f6` | Network intrusion, malware, DDoS |
| **FINANCE** | Amber `#f59e0b` | Market instability, fraud patterns |
| **GEOINT** | Green `#10b981` | Geopolitical events, military movements |

---

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/THAMARAISELVAM-A/ai-soc-sentinel.git
cd ai-soc-sentinel

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# Opens at http://localhost:3000
```

> **No API Key Required** — The app runs autonomously in simulation mode with zero setup.

### Optional: Enable Live AI Analysis
1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Open the app → navigate to **Configuration** in the sidebar
3. Enter your API key — live AI analysis activates immediately

---

## 🏗️ Architecture

```
src/
├── App.jsx                         # Root layout shell & page router
├── App.css                         # Design system — glassmorphism, variables, animations
├── components/
│   ├── GlobeLayer.jsx              # ★ 3D Globe + Satellite tracking + Attack arcs
│   ├── Sidebar.jsx                 # Collapsible glassmorphic navigation
│   ├── TopBar.jsx                  # Domain switcher + header
│   ├── HUD/
│   │   ├── RiskPanel.jsx           # Animated global risk index gauge
│   │   ├── IntelligencePanel.jsx   # Live threat intelligence cards
│   │   ├── PredictivePanel.jsx     # L2 AI forecast output
│   │   └── StatsPanel.jsx          # System stats bar
│   ├── Modals/
│   │   ├── SettingsOverlay.jsx     # API key & simulation controls
│   │   └── OSINTModal.jsx          # OSINT text ingestion & parsing
│   └── UIPanels/
│       └── DataLake.jsx            # Live telemetry feed with IP tracking + CSV export
├── hooks/
│   ├── useAnomalyEngine.js         # ★ AI analysis engine (Anthropic API)
│   └── useL2Forecaster.js          # L2 predictive threat model
└── constants/
    └── threatData.js               # Threat signatures, real-world node coordinates
```

---

## 🔧 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 5** | Build tool + dev server |
| **react-globe.gl** | 3D WebGL globe rendering |
| **Three.js** | Custom 3D satellite geometry |
| **Framer Motion** | Animated risk gauge, threat cards |
| **Anthropic Claude** | AI threat classification & forecasting |
| **Lucide React** | Icon system |
| **Web Audio API** | Autonomous critical alert sounds |

---

## 🚢 CI/CD Deployment

GitHub Actions automatically:
1. **Lints** the codebase (ESLint — 0 errors policy)
2. **Builds** the production bundle
3. **Deploys** to GitHub Pages

Triggered on every push to `master`.

---

## 📄 License

MIT © [THAMARAISELVAM-A](https://github.com/THAMARAISELVAM-A)
