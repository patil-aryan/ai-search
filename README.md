﻿# intelliSearch - AI-Powered Search Platform

A modern, minimal search platform with real-time news, market data, weather updates, and intelligent search capabilities. Built with Next.js, TypeScript, and a clean white/black aesthetic.

## ✨ Features

### 🔍 **Enhanced Search**
- Intelligent search with AI-powered responses
- Multiple source integration (web, Reddit, code, news, academic)
- Real-time suggestions and related searches
- Professional tabbed interface

### 📰 **Real News Integration**
- Live news feeds with images
- Multiple categories (Technology, Environment, Science, etc.)
- Source attribution and timestamps
- Clean card-based layout

### 📚 **Functional Library**
- **Note-taking system**: Create, edit, delete notes with persistent storage
- **Todo lists**: Full CRUD functionality with progress tracking
- **Persistent storage**: All data saved to localStorage
- **Search & filter**: Find notes and todos instantly

### 📊 **Live Market Data**
- Real-time stock prices and changes
- Market trends visualization
- Multiple stock tracking
- Clean, minimal design

### 🌤️ **Weather Updates**
- Current weather conditions
- Location-based forecasts
- Humidity and wind data
- Simple, elegant display

### 🎨 **Clean Design**
- **Minimal white/black aesthetic**
- Professional typography
- Smooth, professional animations
- Mobile-responsive design
- **No childish colors or gradients**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd futuresearch
```

2. **Install dependencies**
```bash
# Backend
npm install

# Frontend
cd ui
npm install
```

3. **Setup API Keys** (Optional - will use mock data without keys)
Edit `ui/.env.local`:
```bash
# NewsAPI - Free tier: 1000 requests/day
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key_here

# Alpha Vantage - Free tier: 500 requests/day  
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here

# OpenWeatherMap - Free tier: 1000 requests/day
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key_here

# Finnhub - Free tier: 60 requests/minute
NEXT_PUBLIC_FINNHUB_KEY=your_finnhub_key_here
```

4. **Start the services**

Backend (Terminal 1):
```bash
npm run dev
```

Frontend (Terminal 2):
```bash
cd ui
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 🔑 Free API Services

### News API
- **Service**: [NewsAPI.org](https://newsapi.org/)
- **Free Tier**: 1000 requests/day
- **Features**: Top headlines, search, categories
- **Setup**: Register → Get API key → Add to `.env.local`

### Stock Market APIs

#### Alpha Vantage (Recommended)
- **Service**: [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
- **Free Tier**: 500 requests/day
- **Features**: Real-time quotes, historical data
- **Setup**: Register → Get API key → Add to `.env.local`

#### Finnhub (Alternative)
- **Service**: [Finnhub](https://finnhub.io/)
- **Free Tier**: 60 requests/minute
- **Features**: Stock quotes, market data
- **Setup**: Register → Get API key → Add to `.env.local`

### Weather API
- **Service**: [OpenWeatherMap](https://openweathermap.org/api)
- **Free Tier**: 1000 requests/day
- **Features**: Current weather, forecasts
- **Setup**: Register → Get API key → Add to `.env.local`

### Sports APIs (No API Key Required)
- **ESPN API**: Free public API for live scores
- **TheSportsDB**: Free sports data
- **Automatic fallback**: Uses mock data if APIs are unavailable

## 🏗️ Architecture

### Backend (`/src`)
- **Express.js** server with WebSocket support
- **Multi-key Gemini API** integration with load balancing
- **CORS** enabled for frontend communication
- **Config management** with TOML

### Frontend (`/ui`)
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **shadcn/ui** components
- **Radix UI** primitives

### Key Components
- `FloatingNavbar.tsx` - Clean, minimal navigation
- `EnhancedLibrary.tsx` - Notes and todos with persistence
- `EnhancedSearchResults.tsx` - Professional search interface
- `DiscoverPage.tsx` - News, stocks, weather dashboard

## 📁 Project Structure

```
futuresearch/
├── src/                    # Backend
│   ├── app.ts             # Express server
│   ├── config.ts          # Configuration management
│   └── routes/            # API routes
├── ui/                    # Frontend
│   ├── app/               # Next.js pages
│   ├── components/        # React components
│   ├── lib/               # Utilities & API services
│   └── public/            # Static assets
├── config.toml            # Backend configuration
└── README.md
```

## 🎯 Features Deep Dive

### Library System
- **Create notes**: Rich text editing with titles
- **Edit in-place**: Click to edit functionality
- **Todo lists**: Full task management with progress bars
- **Persistent storage**: All data saved automatically
- **Search functionality**: Find notes and todos instantly
- **Clean UI**: Minimal white/black design

### Discover Dashboard
- **News tab**: Latest headlines with images
- **Markets tab**: Live stock data with trends
- **Weather tab**: Current conditions and forecasts
- **Auto-refresh**: Live data updates
- **Rate limiting**: Prevents API overuse

### Search Interface
- **AI responses**: Powered by Gemini API
- **Source categorization**: Web, Reddit, code, news, academic
- **Related searches**: Intelligent suggestions
- **Clean layout**: Professional tabbed interface

## 🔧 Configuration

### Gemini API Keys
The backend supports multiple Gemini API keys for load balancing:

```toml
[API_KEYS]
GEMINI = ["key1", "key2", "key3"]
```

### Environment Variables
All API keys are configured in `ui/.env.local`:
- Secure client-side environment variables
- Graceful fallback to mock data
- Rate limiting protection

## 🚨 Important Notes

1. **Port 3001**: Make sure port 3001 is free for the backend
2. **API Keys**: The app works with mock data if no API keys are provided
3. **Rate Limits**: Built-in rate limiting prevents API overuse
4. **CORS**: Enabled for localhost development
5. **WebSocket**: Live updates via WebSocket connection

## 🎨 Design Philosophy

- **Minimal aesthetics**: Clean white and black color scheme
- **Professional typography**: Readable fonts and spacing
- **Smooth animations**: Professional transitions using Framer Motion
- **Mobile-first**: Responsive design for all devices
- **Performance-focused**: Optimized loading and interactions

## 🔄 Development Workflow

1. **Backend changes**: Edit files in `/src` - auto-reloads with nodemon
2. **Frontend changes**: Edit files in `/ui` - auto-reloads with Next.js
3. **API testing**: Use the browser dev tools or Postman
4. **Data persistence**: Library data is automatically saved to localStorage

## 🛠️ Troubleshooting

### Port 3001 Already in Use
```bash
# Kill existing processes
taskkill /f /im node.exe
```

### Missing Dependencies
```bash
# Backend
npm install

# Frontend  
cd ui && npm install
```

### API Errors
- Check your API keys in `.env.local`
- Verify rate limits haven't been exceeded
- App will fallback to mock data automatically

## 🚀 Next Steps

1. **Add your API keys** to enable real data
2. **Customize the design** to match your preferences
3. **Extend functionality** with additional features
4. **Deploy to production** when ready

## 📝 License

Private project - All rights reserved.

---

**Enjoy your clean, minimal, and professional search platform!** 🎉
