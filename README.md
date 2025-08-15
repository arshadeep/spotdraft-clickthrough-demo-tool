# SpotDraft Clickthrough Demo Tool

🚀 **Revolutionary AI-powered demo page generator** that converts screenshots into pixel-perfect, live demo pages with embedded SpotDraft Clickthrough contracts.

![SpotDraft Demo Tool](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node.js](https://img.shields.io/badge/Node.js-v18+-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)

## ✨ Key Features

### 🎨 **World-Class Design System Extraction**
- **Two-stage AI process**: First extracts design DNA, then generates pixel-perfect HTML
- **Surgical precision**: Analyzes colors, typography, spacing, and component styles
- **Brand consistency**: Maintains authentic design language across recreated pages

### 📱 **Multi-Image Context Understanding**
- **Main screenshot**: The exact page to recreate
- **Context pages**: Additional brand pages for design system understanding
- **Smart analysis**: AI learns from multiple pages to capture complete brand aesthetic

### 🔗 **Seamless Clickthrough Integration**
- **Natural placement**: Integrates above/near CTA buttons like real consent flows
- **Brand-matched styling**: Uses extracted design tokens for authentic appearance
- **Multiple clusters**: Support for IN, US, EU, ME regions

### ⚡ **Production-Ready Features**
- **Instant generation**: Live demo URLs in seconds
- **Live preview**: Embedded iframe for immediate testing
- **Responsive design**: Mobile-optimized generated pages
- **Error handling**: Robust retry logic for API stability

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React.js      │────│   Express.js     │────│   Gemini AI     │
│   Frontend      │    │   Backend        │    │   Service       │
│                 │    │                  │    │                 │
│ • Image Upload  │    │ • Multi-image    │    │ • Design DNA    │
│ • Preview       │    │   handling       │    │   extraction    │
│ • Demo URLs     │    │ • Demo hosting   │    │ • HTML gen      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/spotdraft-clickthrough-demo-tool.git
cd spotdraft-clickthrough-demo-tool
```

### 2. Backend Setup
```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your Gemini API key
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Setup environment variables (optional)
cp .env.example .env
```

### 4. Run the Application
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

### 5. Open Your Browser
Navigate to `http://localhost:3000` and start creating demos!

## 📖 How to Use

### Step 1: Upload Images
1. **Main Screenshot**: Upload the exact page you want to recreate
2. **Context Pages** (Optional): Upload homepage, about page, or other brand pages

### Step 2: Configure Clickthrough
1. **Clickwrap ID**: Enter your SpotDraft Clickwrap ID
2. **Cluster**: Select your region (IN, US, EU, ME)

### Step 3: Generate Demo
1. Click **"Generate Demo"**
2. AI extracts design system and creates pixel-perfect HTML
3. Get instant live demo URL

### Step 4: Share & Test
1. **Copy URL** to share with stakeholders
2. **Live Preview** to test functionality immediately
3. **Download HTML** for further customization

## 🎨 AI-Powered Design Process

### Stage 1: Design DNA Extraction
```javascript
🔍 Analyzing uploaded images...
📊 Extracting color palette (#3B82F6, #64748B...)
🔤 Identifying typography (Inter, 16px, 600 weight...)
📏 Measuring spacing patterns (8px, 16px, 32px...)
🎯 Capturing component styles (8px radius, shadows...)
```

### Stage 2: Precision HTML Generation
```javascript
🎨 Applying extracted design system...
💻 Generating pixel-perfect HTML...
🔗 Integrating Clickthrough naturally...
✅ Creating live demo URL...
```

## 🛠️ Environment Variables

### Backend `.env`
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
BASE_URL=http://localhost:5000
```

### Frontend `.env`
```bash
REACT_APP_API_URL=http://localhost:5000
```

## 📦 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React.js + Tailwind CSS | Modern, responsive UI |
| **Backend** | Node.js + Express | API server & file handling |
| **AI Engine** | Google Gemini 1.5 Flash | Design analysis & HTML generation |
| **File Upload** | Multer | Multi-image processing |
| **Demo Hosting** | Static file serving | Live demo URLs |

## 🌍 Deployment Options

### Option 1: Vercel (Recommended)
```bash
# Deploy backend
cd backend && vercel --prod

# Deploy frontend
cd frontend && vercel --prod
```

### Option 2: Railway
1. Connect GitHub repository
2. Add environment variables in dashboard
3. Auto-deploys on push

### Option 3: Render
```yaml
# render.yaml
services:
  - type: web
    name: spotdraft-demo-api
    env: node
    buildCommand: npm install
    startCommand: node server.js
```

## 🔧 Development

### Project Structure
```
spotdraft-clickthrough-demo-tool/
├── frontend/              # React application
│   ├── src/
│   │   ├── App.js        # Main component
│   │   ├── index.js      # Entry point
│   │   └── index.css     # Tailwind styles
│   └── public/
├── backend/              # Express server
│   ├── server.js         # Main server
│   ├── geminiService.js  # AI service
│   └── demos/            # Generated demos
├── README.md
└── .gitignore
```

### Available Scripts

**Backend:**
- `npm start` - Production server
- `npm run dev` - Development server with nodemon

**Frontend:**
- `npm start` - Development server
- `npm run build` - Production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: [your-email@domain.com]
- 💬 **Issues**: [GitHub Issues](https://github.com/yourusername/spotdraft-clickthrough-demo-tool/issues)
- 📖 **Documentation**: [Wiki](https://github.com/yourusername/spotdraft-clickthrough-demo-tool/wiki)

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for revolutionary vision capabilities
- [SpotDraft](https://spotdraft.com/) for the Clickthrough SDK
- [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/) for the amazing frontend tools

---

**Built with ❤️ for the SpotDraft community**