# AI SOC Sentinel - World Monitor Intelligence Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff.svg)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r160-000000.svg)](https://threejs.org/)

## 🛡️ Overview

**AI SOC Sentinel** is an open-source, AI-powered Security Operations Center (SOC) dashboard designed for real-time cybersecurity monitoring, threat intelligence analysis, and incident response. It features a stunning 3D globe visualization, glass-morphism UI design, and simulated threat detection capabilities.

### Key Features

- 🌍 **3D Interactive Globe** - Real-time visualization of global cyber threats using Three.js
- 🎨 **Glass-morphism UI** - Modern, futuristic interface with blur effects and smooth animations
- 📊 **Real-time Statistics** - Live monitoring of events per second, active threats, and system performance
- 🧠 **AI Analysis Panel** - ML model accuracy metrics and active detection summaries
- 📡 **Threat Intelligence Feed** - Integration with multiple intelligence sources (CISA, FBI, NSA, INTERPOL)
- ⚡ **Live Event Stream** - Real-time security events with severity classification
- 🎯 **Multi-Domain Support** - Switch between Cyber, Finance, and GEOINT monitoring modes
- 🔍 **Search Functionality** - Quick search for threats, IPs, and hashes
- 🖥️ **System Console** - Live system logs and command output
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/THAMARAISELVAM-A/ai-soc-sentinel.git
cd ai-soc-sentinel

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
ai-soc-sentinel/
├── public/
│   └── assets/              # Font files and static assets
├── src/
│   ├── components/          # React components
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # This file
```

## 🎮 Usage

### Domain Navigation

Switch between different monitoring domains using the icon buttons in the left panel:

- **CYBER** (Blue) - Cybersecurity threats and network monitoring
- **FINANCE** (Orange) - Financial fraud detection and transaction monitoring  
- **GEOINT** (Green) - Geographic intelligence and location-based threats

### Interface Sections

1. **Header** - System title, logo, and key metrics (events/sec, active threats, blocked attacks, uptime)
2. **Left Panel** - Threat intelligence feed, live events, and AI analysis
3. **Right Panel** - Command center with search, quick actions, console, and system status
4. **Bottom Panel** - Quick stats including threat level, active sensors, monitored networks
5. **Center** - Interactive 3D globe showing global threat landscape

### Interactive Features

- **Rotate Globe**: Click and drag to rotate the 3D globe
- **Zoom**: Scroll to zoom in/out on the globe
- **Alert Mode**: Toggle emergency alert mode (changes theme to red)
- **Console**: Toggle system console for live logs
- **Search**: Search for threats, IPs, or hashes
- **Tabs**: Switch between Intel Feed, Live Events, and AI Analysis views

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **3D Library**: Three.js with React Three Fiber
- **UI Components**: Lucide React icons
- **Animations**: Framer Motion
- **Styling**: CSS with glass-morphism effects
- **Fonts**: Outfit (headings), JetBrains Mono (code)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
VITE_API_ENDPOINT=https://api.example.com
VITE_WS_ENDPOINT=wss://ws.example.com
```

### Customization

#### Theme Colors

Modify the CSS variables in `src/index.css` to customize the color scheme:

```css
:root {
  --soc-bg: #010204;
  --soc-accent: #3b82f6;
  --domain-primary: #3b82f6;
  --domain-glow: #3c83f626;
  /* ... other variables */
}
```

#### Adding New Intelligence Sources

Edit the `generateIntelData` function in `src/App.jsx` to add new sources:

```javascript
const sources = ['CISA', 'FBI', 'NSA', 'INTERPOL', 'YourSource'];
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** - For the amazing 3D library
- **React Three Fiber** - For React bindings to Three.js
- **Lucide** - For beautiful open-source icons
- **Framer Motion** - For smooth animations
- **Google Fonts** - For Outfit and JetBrains Mono fonts

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/THAMARAISELVAM-A/ai-soc-sentinel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/THAMARAISELVAM-A/ai-soc-sentinel/discussions)
- **Email**: [Contact the maintainer](mailto:your-email@example.com)

## 🗺️ Roadmap

- [ ] Real API integration with threat intelligence feeds
- [ ] WebSocket support for real-time data streaming
- [ ] User authentication and role-based access
- [ ] Custom dashboard configurations
- [ ] Export reports functionality
- [ ] Mobile app version
- [ ] Plugin system for custom integrations
- [ ] Dark/light theme toggle
- [ ] Multi-language support
- [ ] Advanced filtering and search

## 📊 Demo

![AI SOC Sentinel Demo](https://via.placeholder.com/800x450/010204/3b82f6?text=AI+SOC+Sentinel+Dashboard)

*Interactive 3D globe showing real-time cyber threat visualization*

---

**Built with ❤️ for the cybersecurity community**

*AI SOC Sentinel - Protecting the digital world, one threat at a time.*