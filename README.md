# MK BLACK FRIDAY RADAR 🇲🇰

AI-powered deal discovery platform for Black Friday shopping in Skopje, North Macedonia.

[![Web App](https://img.shields.io/badge/Web%20App-Live-blue)](https://mk-black-friday-radar.vercel.app)
[![APK Download](https://img.shields.io/badge/APK-Download-green)](https://github.com/Maliot100X/Black-Friday/releases)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📱 Download App

- **Android APK**: [Download Latest Release](https://github.com/Maliot100X/Black-Friday/releases/latest)
- **Web App**: [Live Demo](https://mk-black-friday-radar.vercel.app)

## 🎯 Features

- **🔥 Fireworks AI (Kimi)**: Multilingual AI chatbot in Macedonian & Albanian
- **🤖 AI Agents**: CrewAI-powered agents for deal scraping, verification, ranking
- **🔍 RAG Search**: Natural language deal search using ChromaDB vector database
- **🗺️ Map Radar**: Geographic deal discovery with MapLibre GL
- **📱 QR Scanner**: Real QR code scanning for store verification
- **💬 AI Chatbot**: Floating assistant trained on North Macedonia stores
- **🌐 Web Platform**: Next.js frontend with TailwindCSS
- **📲 Mobile App**: React Native with Expo for iOS/Android
- **📊 Analytics**: PostHog integration for user tracking
- **🐛 Monitoring**: Prometheus, Grafana, and Sentry

## 🎯 Features

- **AI Agents**: CrewAI-powered agents for deal scraping, verification, ranking, and recommendations
- **RAG Search**: Natural language deal search using ChromaDB vector database
- **Map Radar**: Geographic deal discovery with MapLibre GL
- **QR Membership**: Unique QR codes for store verification and exclusive discounts
- **Web Platform**: Next.js frontend with TailwindCSS and ShadCN UI
- **Mobile App**: React Native with Expo for iOS/Android
- **Real-time Notifications**: Firebase Cloud Messaging for deal alerts
- **Analytics**: PostHog integration for user tracking
- **Monitoring**: Prometheus, Grafana, and Sentry

## 🏗️ Architecture

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Next.js Web   │  │  React Native   │  │   FastAPI API   │
│   Frontend      │  │   Mobile App    │  │   Backend       │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │
         └────────────────────┴────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │  Load Balancer    │
                    └─────────┬─────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
│  PostgreSQL     │  │   ChromaDB      │  │     Redis       │
│  + PostGIS      │  │  Vector DB      │  │   Cache/Queue   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Python 3.12+
- PostgreSQL 16 with PostGIS
- Redis 7+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/mk-black-friday-radar.git
   cd mk-black-friday-radar
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   ```bash
   docker-compose exec postgres psql -U postgres -d mkbf_deals -f /docker-entrypoint-initdb.d/schema.sql
   ```

5. **Access the services**
   - Web App: http://localhost:3000
   - API Docs: http://localhost:8000/docs
   - Grafana: http://localhost:3001
   - Prometheus: http://localhost:9090

## 📁 Project Structure

```
mk-black-friday-radar/
├── backend/           # FastAPI backend
│   ├── main.py       # API endpoints
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/         # Next.js web app
│   ├── app/         # Pages
│   ├── components/  # React components
│   └── package.json
├── mobile/          # React Native app
│   ├── screens/     # App screens
│   ├── App.tsx
│   └── package.json
├── agents/          # CrewAI agents
│   ├── agents.md    # Agent definitions
│   └── crew_config.py
├── skills/          # Skill library
│   └── skills.md
├── scrapers/        # Web scrapers
│   ├── deal_scraper.py
│   └── Dockerfile
├── rag/            # RAG system
│   ├── vector_db.py
│   └── chroma/     # ChromaDB data
├── database/       # Database schema
│   └── schema.sql
├── monitoring/     # Prometheus/Grafana
│   └── prometheus.yml
├── docker-compose.yml
└── README.md
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login and get token |
| `/api/deals` | GET | List all deals |
| `/api/deals/{id}` | GET | Get specific deal |
| `/api/search` | POST | RAG search |
| `/api/stores` | GET | List stores |
| `/api/map/nearby` | POST | Find nearby deals |
| `/api/scan` | POST | Verify QR code |
| `/api/purchase` | POST | Record purchase |
| `/api/recommendations` | GET | Get recommendations |

## 🤖 AI Agents

| Agent | Purpose |
|-------|---------|
| Scraper | Collect deals from websites |
| Extraction | Parse and structure data |
| Verification | Detect fake discounts |
| Ranking | Score and rank deals |
| RAG Query | Answer user questions |
| Map Agent | Geographic search |
| Notification | Send alerts |
| QR Verification | Validate QR codes |

## 🛠️ Development

### Backend

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Mobile

```bash
cd mobile
npm install
npx expo start
```

## 📱 Mobile App

The mobile app is built with React Native and Expo, featuring:

- Home feed with featured deals
- RAG-powered search
- Map radar with location-based deals
- QR code membership system
- Push notifications
- Saved deals
- User profile

### Building for Production

```bash
cd mobile
# Build APK
eas build -p android --profile preview

# Build AAB for Play Store
eas build -p android --profile production
```

## 📊 Monitoring

- **Prometheus**: Metrics collection (http://localhost:9090)
- **Grafana**: Dashboards (http://localhost:3001, admin/admin)
- **Sentry**: Error tracking

## 🔐 Security

- JWT authentication
- Rate limiting
- SQL injection protection (SQLAlchemy)
- XSS protection (React escaping)
- HTTPS in production

## 📝 License

MIT License - see LICENSE file for details

## 👥 Contributors

- MK Black Friday Radar Team

## 🙏 Acknowledgments

- CrewAI framework
- ChromaDB vector database
- FastAPI
- Next.js
- React Native
- MapLibre GL
