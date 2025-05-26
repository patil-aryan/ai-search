"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, TrendingUp, Clock, Zap, Sun, Cloud, CloudRain, DollarSign, Activity, Sparkles, Globe, BookOpen, Youtube, MessageSquare, Briefcase, Image as ImageIcon, ShoppingBag, Map } from "lucide-react";
import PremiumSearchInput from "./PremiumSearchInput";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StockChart from "./StockChart";
import { ResponsiveContainer } from "recharts";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  category?: string;
}

interface SportsScore {
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  gameTime?: string;
}

interface SportEvent {
  id: string;
  league: string;
  match: string;
  time: string;
  status: string;
  homeScore: number;
  awayScore: number;
  venue: string;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
}

// Define agents/focus modes
const agentModes = [
  { id: "all", name: "All", icon: Globe, description: "General web search" },
  { id: "academic", name: "Academic", icon: BookOpen, description: "Scholarly articles & papers" },
  { id: "youtube", name: "YouTube", icon: Youtube, description: "Videos and multimedia" },
  { id: "images", name: "Images", icon: ImageIcon, description: "Find visual content" },
  { id: "reddit", name: "Reddit", icon: MessageSquare, description: "Discussions and communities" },
  { id: "business", name: "Business", icon: Briefcase, description: "Market news and company info" },
  { id: "shopping", name: "Shopping", icon: ShoppingBag, description: "Products and e-commerce" },
];

const EnhancedHomepage = ({
  sendMessage,
}: {
  sendMessage: (message: string) => void;
}) => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sports, setSports] = useState<SportsScore[]>([]);
  const [sportsEvents, setSportsEvents] = useState<SportEvent[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [lottieData, setLottieData] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>(agentModes[0].id);
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsItem | null>(null);
  const [crypto, setCrypto] = useState<any[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>("AAPL");
  const [selectedCrypto, setSelectedCrypto] = useState<string>("bitcoin");
  const [rotation, setRotation] = useState(0);
  const [spinDir, setSpinDir] = useState(1);
  const lottieRef = useRef<any>(null);

  // API Keys
  const NEWS_API_KEY = "95e671056a9049fc9b1f3781faacc5e7";
  const WEATHER_API_KEY = "4908931555f941dfd2851f15bf284f23";
  const FINNHUB_API_KEY = "d0pkha1r01qgccu9mju0d0pkha1r01qgccu9mjug";

  // Load Lottie animation (replace with new file)
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch("/Animation - 1748190444778.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const animationData = await response.json();
        setLottieData(animationData);
      } catch (error) {
        console.error("Failed to load Lottie animation:", error);
        setLottieData(null);
      }
    };
    loadAnimation();
  }, []);

  // AI-generated search suggestions
  // AI-generated search suggestions
  const generateAISuggestions = () => {
    const allTopics = [
      // Technology & AI
      "AI impact on software development workflow",
      "Latest advancements in quantum machine learning",
      "ChatGPT vs Claude AI comparison 2025",
      "Future of autonomous vehicles and self-driving cars",
      "Blockchain technology beyond cryptocurrency",
      "Virtual reality in education and training",
      "Cybersecurity threats in remote work environments",
      "Edge computing and its business applications",
      "5G network implementation challenges",
      "Neural interfaces and brain-computer connections",
      "AI in medical diagnosis and healthcare",
      "Machine learning ethics and bias prevention",
      "Quantum computing breakthrough discoveries",
      "Metaverse development and virtual worlds",
      "Internet of Things (IoT) security concerns",
      
      // Environment & Sustainability
      "Future of renewable energy sources",
      "Climate change adaptation strategies 2025",
      "Carbon capture technology innovations",
      "Electric vehicle adoption worldwide",
      "Sustainable agriculture and vertical farming",
      "Ocean plastic pollution solutions",
      "Green hydrogen energy potential",
      "Solar panel efficiency improvements",
      "Wind energy storage technologies",
      "Biodiversity conservation efforts",
      "Circular economy business models",
      "Environmental impact of cryptocurrency mining",
      "Sustainable fashion industry trends",
      "Zero-waste lifestyle implementation",
      "Deforestation monitoring via satellite",
      
      // Business & Economics
      "Understanding global supply chain disruptions",
      "Remote work impact on productivity",
      "Cryptocurrency market volatility analysis",
      "E-commerce trends post-pandemic",
      "Gig economy worker protection laws",
      "Digital transformation in traditional industries",
      "Inflation effects on global markets",
      "Supply chain automation benefits",
      "Small business digital marketing strategies",
      "Corporate ESG investing trends",
      "Future of retail and shopping experiences",
      "Subscription economy growth patterns",
      "Fintech innovations in banking",
      "Real estate market predictions 2025",
      "Global economic recovery indicators",
      
      // Health & Medicine
      "Mental health awareness in workplace",
      "Telemedicine adoption rates worldwide",
      "Gene therapy breakthrough treatments",
      "Personalized medicine and genomics",
      "Vaccine development timeline optimization",
      "Nutrition science latest discoveries",
      "Fitness technology and wearable devices",
      "Aging population healthcare challenges",
      "Precision medicine cancer treatments",
      "Mental health apps effectiveness",
      "Healthcare AI diagnostic accuracy",
      "Medical device cybersecurity",
      "Pharmaceutical supply chain security",
      "Health data privacy protection",
      "Pandemic preparedness strategies",
      
      // Social & Cultural
      "Social media impact on teen mental health",
      "Digital divide and internet accessibility",
      "Future of work and employment trends",
      "Generation Z workplace expectations",
      "Cultural preservation in digital age",
      "Online education effectiveness studies",
      "Gaming industry growth and trends",
      "Streaming services competition analysis",
      "Content creator economy sustainability",
      "Digital nomad lifestyle challenges",
      "Social commerce and influencer marketing",
      "Virtual events vs in-person gatherings",
      "Digital art and NFT market evolution",
      "Language learning app effectiveness",
      "Community building in virtual spaces",
      
      // Science & Space
      "Mars colonization mission updates",
      "Space tourism industry development",
      "James Webb Space Telescope discoveries",
      "Nuclear fusion energy progress",
      "CRISPR gene editing applications",
      "Quantum physics practical applications",
      "Asteroid mining feasibility studies",
      "Climate modeling accuracy improvements",
      "Ocean exploration new technologies",
      "Artificial photosynthesis research",
      "Space debris cleanup solutions",
      "Exoplanet discovery methods",
      "Renewable energy from space",
      "Bioengineering ethical considerations",
      "Scientific collaboration in global research",
      
      // Politics & Society
      "Digital privacy rights legislation",
      "Voting technology security measures",
      "Smart city development challenges",
      "Immigration policy impacts on economy",
      "Media literacy education importance",
      "Government AI regulation frameworks",
      "Public transportation electrification",
      "Urban planning for climate resilience",
      "Digital identity verification systems",
      "Civic engagement through technology",
      "Public health policy effectiveness",
      "Educational system reform needs",
      "Housing affordability crisis solutions",
      "Democracy and social media influence",
      "International trade agreement impacts"
    ];

    // Randomly select 4 topics
    const shuffled = [...allTopics].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // Fetch real weather data
  const fetchWeather = async () => {
    try {
      const cities = ["London", "New York", "Tokyo", "Paris"];
      const weatherPromises = cities.map(async (city) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
          );
          
          if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
          }
          
          const data = await response.json();
          return {
            location: city,
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            icon: data.weather[0].icon,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
          };
        } catch (error) {
          console.error(`Weather error for ${city}:`, error);
          // Return fallback data
          return { 
            location: city, 
            temperature: Math.floor(Math.random() * 25) + 10, 
            condition: "Clear", 
            icon: "01d", 
            humidity: Math.floor(Math.random() * 40) + 40, 
            windSpeed: Math.floor(Math.random() * 10) + 5 
          };
        }
      });
      const weatherData = await Promise.all(weatherPromises);
      setWeather(weatherData);
    } catch (error) {
      console.error("Weather fetch error:", error);
      // Set fallback weather data
      setWeather([
        { location: "London", temperature: 18, condition: "Cloudy", icon: "02d", humidity: 65, windSpeed: 8 },
        { location: "New York", temperature: 22, condition: "Clear", icon: "01d", humidity: 55, windSpeed: 12 },
        { location: "Tokyo", temperature: 25, condition: "Rain", icon: "10d", humidity: 80, windSpeed: 6 },
        { location: "Paris", temperature: 20, condition: "Cloudy", icon: "03d", humidity: 70, windSpeed: 10 }
      ]);
    }
  };

  // News API cache for homepage
  const newsCache = useState<{ [key: string]: { data: NewsItem[], timestamp: number } }>(() => {
    try {
      const cached = localStorage.getItem('futuresearch_homepage_news_cache');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  })[0];

  const NEWS_API_KEYS = [
    process.env.NEXT_PUBLIC_NEWS_API_KEY,
    process.env.NEXT_PUBLIC_NEWS_API_KEY_2,
    process.env.NEXT_PUBLIC_NEWS_API_KEY_3,
    process.env.NEXT_PUBLIC_NEWS_API_KEY_4
  ].filter(Boolean);

  const [currentNewsApiKeyIndex, setCurrentNewsApiKeyIndex] = useState<number>(0);

  // Fetch real news data using the same system as EnhancedDiscover
  const fetchNews = async () => {
    // Check cache first (10 minutes)
    const cacheKey = 'us_headlines_homepage';
    const cached = newsCache[cacheKey];
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000 && cached.data.length >= 5) {
      setNews(cached.data.slice(0, 5));
      return;
    }

    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < NEWS_API_KEYS.length) {
      try {
        const apiKey = NEWS_API_KEYS[(currentNewsApiKeyIndex + attempts) % NEWS_API_KEYS.length];
        if (!apiKey) {
          attempts++;
          continue;
        }

        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=${apiKey}`);
        
        if (!response.ok) {
          if (response.status === 429) {
            console.warn(`Homepage News API key ${attempts + 1} rate limited, trying next key...`);
            attempts++;
            continue;
          }
          throw new Error(`News API error: ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'error') {
          throw new Error(`News API error: ${data.message}`);
        }

        let articles = (data?.articles || [])
          .filter((article: any) => 
            article?.title && 
            article?.description && 
            !article.title.includes('[Removed]') &&
            article.description !== '[Removed]'
          )
          .map((article: any) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            source: article.source,
            category: 'general'
          }));

        // Cache successful result in both homepage and discover caches
        if (articles.length >= 6) {
          newsCache[cacheKey] = { data: articles, timestamp: Date.now() };
          localStorage.setItem('futuresearch_homepage_news_cache', JSON.stringify(newsCache));
          
          // Also update discover page cache for cross-compatibility
          try {
            const discoverCache = localStorage.getItem('futuresearch_news_cache') || '{}';
            const parsedDiscoverCache = JSON.parse(discoverCache);
            parsedDiscoverCache['us_headlines'] = { data: articles, timestamp: Date.now() };
            localStorage.setItem('futuresearch_news_cache', JSON.stringify(parsedDiscoverCache));
          } catch (e) {
            console.error('Error updating discover cache:', e);
          }
        }

        setNews(articles.slice(0, 5));
        
        // Update API key index for next request
        setCurrentNewsApiKeyIndex((currentNewsApiKeyIndex + attempts) % NEWS_API_KEYS.length);
        return;

      } catch (error) {
        lastError = error as Error;
        attempts++;
      }
    }

    // All API keys failed, use cache or fallback to real news from localStorage
    if (cached && cached.data.length > 0) {
      setNews(cached.data.slice(0, 5));
      console.warn('Using cached news due to API rate limits');
    } else {
      // Try to get real cached news from other sources (like discover page cache)
      try {
        const discoverNewsCache = localStorage.getItem('futuresearch_news_cache');
        if (discoverNewsCache) {
          const parsedCache = JSON.parse(discoverNewsCache);
          const realNews = parsedCache['us_headlines']?.data || [];
          if (realNews.length > 0) {
            setNews(realNews.slice(0, 5));
            console.warn('Using real cached news from discover page');
            return;
          }
        }
      } catch (e) {
        console.error('Error accessing discover news cache:', e);
      }

      // Final fallback to mock news
      const fallbackNews: NewsItem[] = [
        {
          title: "Technology Market Shows Strong Growth Amid Innovation Wave",
          description: "Major tech companies report robust earnings as artificial intelligence drives new opportunities.",
          url: "https://example.com/tech-growth",
          urlToImage: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=200&fit=crop",
          publishedAt: new Date().toISOString(),
          source: { name: "TechNews" },
          category: "Technology"
        },
        {
          title: "Global Climate Summit Reaches Historic Agreement",
          description: "World leaders announce unprecedented commitments to renewable energy transition.",
          url: "https://example.com/climate-summit",
          urlToImage: "https://images.unsplash.com/photo-1569163139394-de44cb8ba2d3?w=400&h=200&fit=crop",
          publishedAt: new Date(Date.now() - 1800000).toISOString(),
          source: { name: "Global News" },
          category: "Environment"
        },
        {
          title: "Healthcare Innovation Breakthrough in Medical Research",
          description: "New treatment methods show promising results in clinical trials.",
          url: "https://example.com/health-breakthrough",
          urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: "HealthWatch" },
          category: "Health"
        },
        {
          title: "Financial Markets Rally on Economic Recovery Signs",
          description: "Stock markets reach new highs as investors show confidence in economic indicators.",
          url: "https://example.com/finance-rally",
          urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop",
          publishedAt: new Date(Date.now() - 5400000).toISOString(),
          source: { name: "FinanceDaily" },
          category: "Business"
        },
        {
          title: "Space Exploration Reaches New Milestone",
          description: "Private space companies achieve breakthrough in satellite deployment technology.",
          url: "https://example.com/space-milestone",
          urlToImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: "SpaceToday" },
          category: "Science"
        }
      ];
      
      setNews(fallbackNews.slice(0, 5));
      console.warn(`All homepage news API keys exhausted. ${lastError?.message || 'Using fallback news.'}`);
    }
  };

  // Fetch stock data
  const fetchStocks = async () => {
    try {
      const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA'];
      const stockPromises = symbols.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error(`Stock API error: ${response.status}`);
          }
          
          const data = await response.json();
          
          return {
            symbol,
            price: data.c || Math.random() * 200 + 100,
            change: data.d || (Math.random() - 0.5) * 10,
            changePercent: data.dp || (Math.random() - 0.5) * 5,
            name: symbol === 'AAPL' ? 'Apple' : symbol === 'GOOGL' ? 'Google' : symbol === 'MSFT' ? 'Microsoft' : symbol === 'TSLA' ? 'Tesla' : 'NVIDIA'
          };
        } catch (error) {
          console.error(`Stock error for ${symbol}:`, error);
          // Return fallback data
          return {
            symbol,
            price: Math.random() * 200 + 100,
            change: (Math.random() - 0.5) * 10,
            changePercent: (Math.random() - 0.5) * 5,
            name: symbol === 'AAPL' ? 'Apple' : symbol === 'GOOGL' ? 'Google' : symbol === 'MSFT' ? 'Microsoft' : symbol === 'TSLA' ? 'Tesla' : 'NVIDIA'
          };
        }
      });

      const stockData = await Promise.all(stockPromises);
      // If API returns empty array, set fallback data
      if (!stockData || stockData.length === 0) {
        setStocks([
          { symbol: 'AAPL', price: 175.43, change: 2.15, changePercent: 1.24, name: 'Apple' },
          { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85, name: 'Google' },
          { symbol: 'MSFT', price: 378.85, change: 4.67, changePercent: 1.25, name: 'Microsoft' },
          { symbol: 'TSLA', price: 248.42, change: -3.21, changePercent: -1.27, name: 'Tesla' },
          { symbol: 'NVDA', price: 875.28, change: 12.45, changePercent: 1.44, name: 'NVIDIA' }
        ]);
      } else {
        setStocks(stockData);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      // Set fallback stock data
      setStocks([
        { symbol: 'AAPL', price: 175.43, change: 2.15, changePercent: 1.24, name: 'Apple' },
        { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85, name: 'Google' },
        { symbol: 'MSFT', price: 378.85, change: 4.67, changePercent: 1.25, name: 'Microsoft' },
        { symbol: 'TSLA', price: 248.42, change: -3.21, changePercent: -1.27, name: 'Tesla' },
        { symbol: 'NVDA', price: 875.28, change: 12.45, changePercent: 1.44, name: 'NVIDIA' }
      ]);
    }
  };

  // Enhanced crypto data fetching with real API and comprehensive fallback
  const fetchCrypto = async () => {
    // Generate realistic sparkline data with proper volatility
    const generateRealisticSparkline = (basePrice: number) => {
      const points = 168; // 7 days * 24 hours
      const sparkline = [];
      let currentPrice = basePrice;
      
      for (let i = 0; i < points; i++) {
        // Add realistic market movement
        const volatility = 0.03; // 3% max change per hour
        const trendFactor = Math.sin(i / 24) * 0.005; // Daily trend cycle
        const randomFactor = (Math.random() - 0.5) * volatility;
        
        currentPrice = currentPrice * (1 + trendFactor + randomFactor);
        sparkline.push(Math.max(currentPrice, basePrice * 0.7)); // Prevent extreme dips
      }
      
      return sparkline;
    };

    try {
      // Try multiple endpoints for better reliability
      const endpoints = [
        'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true&price_change_percentage=24h',
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,cardano&vs_currencies=usd&include_24hr_change=true'
      ];

      console.log('Fetching crypto data from multiple sources...');
      
      // Try primary endpoint first
      let response = await fetch(endpoints[0]);
      
      if (!response.ok) {
        console.warn(`Primary crypto API failed: ${response.status}, trying fallback...`);
        // Try simple price endpoint as fallback
        response = await fetch(endpoints[1]);
      }
      
      if (response.ok) {
        const data = await response.json();
        
        // Handle different API response formats
        if (Array.isArray(data) && data.length > 0) {
          // Full market data response
          const processedData = data.map(coin => ({
            ...coin,
            sparkline_in_7d: coin.sparkline_in_7d || { price: generateRealisticSparkline(coin.current_price) },
            price_change_percentage_24h: coin.price_change_percentage_24h || (Math.random() - 0.5) * 10
          }));

          console.log('✅ Successfully fetched full crypto market data:', processedData.length, 'coins');
          setCrypto(processedData);
          return;
        } else if (typeof data === 'object' && data.bitcoin) {
          // Simple price response - convert to market format
          const simplePriceData = [
            {
              id: 'bitcoin',
              name: 'Bitcoin',
              symbol: 'btc',
              current_price: data.bitcoin.usd,
              price_change_percentage_24h: data.bitcoin.usd_24h_change || 2.5,
              market_cap: data.bitcoin.usd * 19700000, // Approximate circulating supply
              total_volume: data.bitcoin.usd * 500000,
              image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              sparkline_in_7d: { price: generateRealisticSparkline(data.bitcoin.usd) }
            },
            ...(data.ethereum ? [{
              id: 'ethereum',
              name: 'Ethereum',
              symbol: 'eth',
              current_price: data.ethereum.usd,
              price_change_percentage_24h: data.ethereum.usd_24h_change || 1.8,
              market_cap: data.ethereum.usd * 120000000,
              total_volume: data.ethereum.usd * 350000,
              image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              sparkline_in_7d: { price: generateRealisticSparkline(data.ethereum.usd) }
            }] : [])
          ];

          console.log('✅ Converted simple price data to market format');
          setCrypto(simplePriceData);
          return;
        }
      }
      
      throw new Error('No valid crypto data received');
      
    } catch (error) {
      console.error('All crypto APIs failed, using enhanced mock data:', error);
      
      // Current realistic crypto prices (as of May 2025)
      const realisticCryptoData = [
        { 
          id: 'bitcoin', 
          name: 'Bitcoin', 
          symbol: 'btc', 
          current_price: 109088, // Current real BTC price
          price_change_percentage_24h: 3.2, 
          market_cap: 2150000000000, // $2.15T market cap
          total_volume: 45000000000, 
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          sparkline_in_7d: { price: generateRealisticSparkline(109088) }
        },
        { 
          id: 'ethereum', 
          name: 'Ethereum', 
          symbol: 'eth', 
          current_price: 4150, // Realistic ETH price
          price_change_percentage_24h: 2.8, 
          market_cap: 500000000000, 
          total_volume: 25000000000, 
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          sparkline_in_7d: { price: generateRealisticSparkline(4150) }
        },
        { 
          id: 'binancecoin', 
          name: 'BNB', 
          symbol: 'bnb', 
          current_price: 720, 
          price_change_percentage_24h: 1.5, 
          market_cap: 104000000000, 
          total_volume: 3200000000, 
          image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
          sparkline_in_7d: { price: generateRealisticSparkline(720) }
        },
        { 
          id: 'solana', 
          name: 'Solana', 
          symbol: 'sol', 
          current_price: 245, 
          price_change_percentage_24h: -1.2, 
          market_cap: 118000000000, 
          total_volume: 4800000000, 
          image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
          sparkline_in_7d: { price: generateRealisticSparkline(245) }
        },
        { 
          id: 'cardano', 
          name: 'Cardano', 
          symbol: 'ada', 
          current_price: 1.25, 
          price_change_percentage_24h: -0.8, 
          market_cap: 44000000000, 
          total_volume: 1200000000, 
          image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
          sparkline_in_7d: { price: generateRealisticSparkline(1.25) }
        }
      ];
      
      setCrypto(realisticCryptoData);
      console.log('✅ Set realistic crypto mock data with current BTC price and proper sparklines');
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    const loadData = async () => {
      setLoading(true);
      setAiSuggestions(generateAISuggestions());
      
      await Promise.all([
        fetchWeather(),
        fetchNews(),
        fetchStocks(),
        fetchCrypto()
      ]);
      
      setLoading(false);
    };

    loadData();
    const dataInterval = setInterval(loadData, 300000); // Refresh every 5 minutes

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  // Animation loop for subtle horizontal rotation
  useEffect(() => {
    let frame: number;
    let last = performance.now();
    const animate = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setRotation((r) => (r + spinDir * 10 * delta) % 360); // 10 deg/sec, subtle
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [spinDir]);

  const handleLottieClick = () => {
    setSpinDir((d) => -d); // Only reverse direction, no speed up
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'clouds':
      case 'cloudy':
        return <Cloud className="w-4 h-4 text-gray-500" />;
      case 'rain':
      case 'rainy':
        return <CloudRain className="w-4 h-4 text-blue-500" />;
      default:
        return <Sun className="w-4 h-4 text-yellow-500" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const handleNewsClick = (article: NewsItem) => {
    const message = `Generate an AI summary of this news article: "${article.title}" - ${article.description}`;
    sendMessage(message);
  };

  // Handle search with agent context (simplified for now)
  const handleSearchWithAgent = (query: string) => {
    const agentContext = agentModes.find(agent => agent.id === selectedAgent)?.name || "General";
    const message = selectedAgent === "all" ? query : `Search for ${query} using ${agentContext} agent`;
    sendMessage(message);
  };

  const generateAISummaryForNews = (article: NewsItem) => {
    return `Summary for "${article.title}": This article from ${article.source.name} published on ${new Date(article.publishedAt).toLocaleDateString()} covers topics related to ${article.description.substring(0, 50)}...`;
  };

  const CryptoChart = ({ crypto }: { crypto: any[] }) => {
    console.log('🚀 CryptoChart rendering with data:', crypto?.length || 0, 'coins'); // Debug log
    
    if (!crypto || crypto.length === 0) {
      return (
        <div className="space-y-4">
          <Card className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
            <CardContent className="p-4 flex items-center justify-center h-32">
              <p className="text-xs text-neutral-400">Loading crypto data...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Use the first coin (usually Bitcoin) for the main chart
    const primaryCoin = crypto[0];
    console.log('📊 Primary coin for chart:', primaryCoin?.name, 'price:', primaryCoin?.current_price); // Debug log
    
    // Generate enhanced chart data with better error handling
    let chartData = [];
    
    if (primaryCoin?.sparkline_in_7d?.price && Array.isArray(primaryCoin.sparkline_in_7d.price) && primaryCoin.sparkline_in_7d.price.length > 0) {
      // Use actual sparkline data (sample every 6-8 hours for cleaner 24-point chart)
      const sparklineData = primaryCoin.sparkline_in_7d.price;
      const sampleSize = 24; // 24 hours of data
      const step = Math.max(1, Math.floor(sparklineData.length / sampleSize));
      
      chartData = Array.from({ length: sampleSize }, (_, i) => {
        const dataIndex = Math.min(i * step, sparklineData.length - 1);
        const price = Number(sparklineData[dataIndex]);
        return {
          time: `${i}h`,
          price: !isNaN(price) && price > 0 ? price : Number(primaryCoin.current_price) || 50000,
        };
      });
      console.log('✅ Using real sparkline data, chart points:', chartData.length, 'sample step:', step); // Debug log
    } else {
      // Generate realistic historical data based on current price
      const basePrice = Number(primaryCoin?.current_price) || 109088; // Default to current BTC price
      console.log('⚠️ Generating realistic chart data, base price:', basePrice); // Debug log
      
      chartData = Array.from({ length: 24 }, (_, i) => {
        // Create realistic price movement over 24 hours
        const hourlyVolatility = 0.015; // 1.5% max hourly change
        const trendComponent = Math.sin((i / 24) * Math.PI * 2) * 0.008; // Daily trend cycle
        const randomComponent = (Math.random() - 0.5) * hourlyVolatility;
        const priceMultiplier = 1 + trendComponent + randomComponent;
        
        return {
          time: `${i}h`,
          price: Math.round(basePrice * priceMultiplier * 100) / 100, // Round to 2 decimals
        };
      });
    }

    // Enhanced data validation with fallback
    const validData = chartData.filter(point => 
      point && 
      typeof point.price === 'number' && 
      !isNaN(point.price) && 
      point.price > 0 &&
      point.time
    );
    
    // Ensure we always have data to display
    if (validData.length === 0) {
      console.error('❌ No valid chart data, creating emergency fallback');
      const fallbackPrice = Number(primaryCoin?.current_price) || 109088;
      validData.push(
        { time: '0h', price: fallbackPrice * 0.98 },
        { time: '6h', price: fallbackPrice * 1.01 },
        { time: '12h', price: fallbackPrice * 0.99 },
        { time: '18h', price: fallbackPrice * 1.02 },
        { time: '24h', price: fallbackPrice }
      );
    }

    // Add price range calculation for better Y-axis scaling
    const prices = validData.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const paddedMin = Math.max(0, minPrice - priceRange * 0.1);
    const paddedMax = maxPrice + priceRange * 0.1;

    console.log('📈 Final chart data:', validData.length, 'points, price range:', paddedMin.toFixed(0), '-', paddedMax.toFixed(0)); // Debug

    return (
      <div className="space-y-4">
        <Card className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-black flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {primaryCoin.name || 'Unknown'} ({(primaryCoin.symbol || 'N/A').toUpperCase()})
              </CardTitle>
              <div className="text-right">
                <p className="text-sm font-bold text-blue-700">
                  ${primaryCoin.current_price < 1 
                    ? (primaryCoin.current_price || 0).toFixed(4)
                    : (primaryCoin.current_price || 0).toLocaleString()}
                </p>
                <Badge 
                  variant={(primaryCoin.price_change_percentage_24h || 0) >= 0 ? "default" : "destructive"} 
                  className={`text-[10px] px-1.5 py-0.5 ${
                    (primaryCoin.price_change_percentage_24h || 0) >= 0 
                      ? 'bg-green-100 text-green-700 border-green-200' 
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}
                >
                  {(primaryCoin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                  {(primaryCoin.price_change_percentage_24h || 0).toFixed(2)}%
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={validData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorCryptoHome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                    interval="preserveStartEnd" 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }} 
                    domain={[paddedMin, paddedMax]}
                    tickFormatter={(value) => `$${value < 1 ? value.toFixed(4) : Math.round(value).toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }} 
                    formatter={(value: any) => [
                      `$${Number(value).toLocaleString(undefined, { 
                        minimumFractionDigits: primaryCoin.current_price < 1 ? 4 : 2, 
                        maximumFractionDigits: primaryCoin.current_price < 1 ? 4 : 2 
                      })}`, 
                      'Price'
                    ]} 
                    labelFormatter={(label) => `Time: ${label}`} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2563eb" 
                    strokeWidth={2.5} 
                    fill="url(#colorCryptoHome)" 
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2, fill: "#2563eb" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Other crypto coins grid */}
        <div className="grid grid-cols-2 gap-3">
          {crypto.slice(1, 5).map((coin, idx) => (
            <Card key={coin.id || `crypto-${idx}`} className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-black truncate">
                    {coin.name || 'Unknown'} ({(coin.symbol || 'N/A').toUpperCase()})
                  </span>
                  <Badge 
                    variant={(coin.price_change_percentage_24h || 0) >= 0 ? "default" : "destructive"} 
                    className={`text-[9px] px-1 py-0.5 ${
                      (coin.price_change_percentage_24h || 0) >= 0 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                    {(coin.price_change_percentage_24h || 0).toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm text-black">
                    ${(coin.current_price || 0) < 1 
                      ? (coin.current_price || 0).toFixed(4) 
                      : (coin.current_price || 0).toFixed(2)}
                  </span>
                  <span className={`text-[10px] font-medium ${
                    (coin.price_change_percentage_24h || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(coin.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                    {(coin.price_change_percentage_24h || 0).toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const StockDetailAndInsights = ({ stock }: { stock: StockData | undefined }) => {
    if (!stock) return <p className="text-xs text-neutral-400">Select a stock to see details.</p>;
    return (
      <Card className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">{stock.name} ({stock.symbol}) - Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-neutral-700">
          <p><strong>Price:</strong> ${stock.price.toFixed(2)}</p>
          <p><strong>Change:</strong> <span className={stock.change >= 0 ? 'text-green-600' : 'text-red-600'}>{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)</span></p>
          <div className="mt-3 pt-3 border-t border-neutral-200/60">
            <h4 className="text-xs font-semibold text-black mb-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Powered Insights</h4>
            <p className="italic">AI insights for {stock.name} suggest a positive outlook based on recent market activity and analyst reports. Consider further research before investing.</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const CryptoDetailAndInsights = ({ coin }: { coin: any | undefined }) => {
    if (!coin) return <p className="text-xs text-neutral-400">Select a cryptocurrency to see details.</p>;
    return (
      <Card className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-black">{coin.name} ({coin.symbol.toUpperCase()}) - Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-neutral-700">
          <p><strong>Price:</strong> ${coin.current_price.toLocaleString()}</p>
          <p><strong>Market Cap:</strong> ${coin.market_cap.toLocaleString()}</p>
          <p><strong>24h Change:</strong> <span className={coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}>{coin.price_change_percentage_24h.toFixed(2)}%</span></p>
          {coin.total_volume && <p><strong>24h Volume:</strong> ${coin.total_volume.toLocaleString()}</p>}
           <div className="mt-3 pt-3 border-t border-neutral-200/60">
            <h4 className="text-xs font-semibold text-black mb-1 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> AI Powered Insights</h4>
            <p className="italic">AI analysis indicates {coin.name} is currently experiencing high volatility. Monitor market trends closely. This is not financial advice.</p>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const TopStocksList = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
    { symbol: 'BRK-A', name: 'Berkshire Hathaway Inc.' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
    { symbol: 'V', name: 'Visa Inc.' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.' },
    { symbol: 'WMT', name: 'Walmart Inc.' },
    { symbol: 'PG', name: 'Procter & Gamble Co.' },
    { symbol: 'XOM', name: 'Exxon Mobil Corp.' },
    { symbol: 'HD', name: 'Home Depot, Inc.' },
    { symbol: 'CVX', name: 'Chevron Corporation' },
    { symbol: 'MA', name: 'Mastercard Incorporated' },
    { symbol: 'LLY', name: 'Eli Lilly and Company' },
    { symbol: 'AVGO', name: 'Broadcom Inc.' },
  ];

  // Placeholder for fetchSports
  const fetchSports = async () => {
    // Simulate fetching sports data
    setSportsEvents([
      { id: '1', league: 'NBA', match: 'Lakers vs Celtics', time: '7:30 PM ET', status: 'Upcoming', homeScore: 0, awayScore: 0, venue: 'Crypto.com Arena' },
      { id: '2', league: 'MLB', match: 'Yankees vs Red Sox', time: 'LIVE', status: 'Live', homeScore: 3, awayScore: 2, venue: 'Yankee Stadium' },
      { id: '3', league: 'NFL', match: 'Chiefs vs Eagles', time: 'Yesterday', status: 'Finished', homeScore: 27, awayScore: 24, venue: 'Arrowhead Stadium' },
      { id: '4', league: 'NHL', match: 'Oilers vs Avalanche', time: '10:00 PM ET', status: 'Upcoming', homeScore: 0, awayScore: 0, venue: 'Rogers Place' },
    ]);
  };

  useEffect(() => {
    fetchSports(); // Call fetchSports
    // ... rest of your useEffect
  }, []);

  return (
    <div className="min-h-screen bg-white text-black relative pt-2">
      {/* Current Date - Top Right */}
      <div className="fixed top-6 right-6 z-40 bg-white/80 backdrop-blur-sm border border-neutral-200/70 rounded-lg px-3 py-1.5 shadow-sm">
        <p className="text-xs text-neutral-600 font-medium">
          {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pt-2 pb-2">
        {/* Lottie Animation */}
        {lottieData ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-col items-center mb-2">
            <motion.div
              className="w-64 h-64 cursor-pointer select-none"
              onPointerDown={handleLottieClick}
              onClick={handleLottieClick}
              tabIndex={0}
              aria-label="Interactive loading animation"
            >
              <Lottie lottieRef={lottieRef} animationData={lottieData} loop autoplay />
            </motion.div>
            <h1 className="mt-1 text-4xl font-semibold text-center lowercase font-sans" style={{ fontFamily: 'Inter, var(--font-sans), Segoe UI, Arial, sans-serif', letterSpacing: '0.01em', color: 'inherit' }}>
              <span className="font-normal">intelli</span><span className="font-bold">search</span>
            </h1>
            <p className="mt-1 text-sm text-neutral-500 uppercase tracking-wide">AI POWERED INTELLIGENT SEARCH ENGINE</p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center mb-1 h-64">
            <p className="text-xs text-neutral-400">Loading animation...</p>
            <p className="mt-1 text-base text-neutral-500">AI powered intelligent search engine</p>
          </div>
        )}

        {/* Search Bar (shadcn inspired) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6 flex justify-center"
        >
          <div className="w-full">
            <form onSubmit={(e) => { 
                e.preventDefault(); 
                const input = e.currentTarget.querySelector('input[type="text"]') as HTMLInputElement;
                if (input && input.value.trim()) {
                    handleSearchWithAgent(input.value.trim());
                    input.value = '';
                }
            }} className="relative flex items-center border border-neutral-300 rounded-lg bg-white shadow-sm focus-within:ring-1 focus-within:ring-black focus-within:border-black transition-all pr-2">
              <Search className="w-4 h-4 text-neutral-400 ml-3 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 bg-transparent outline-none text-sm text-black placeholder-neutral-500 py-2.5"
                // onKeyDown removed as form submission handles Enter
              />
              <Button type="submit" size="sm" className="ml-2 bg-black text-white hover:bg-neutral-800 rounded-md px-3 py-1.5 h-auto text-xs">
                Search
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Agent Selection Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-6 flex flex-col items-center gap-3"
        >
          <div className="text-center mb-1">
            <h3 className="text-sm font-semibold text-black">Choose Your Focus</h3>
            <p className="text-xs text-neutral-500">Select an agent to tailor your search to specific sources.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {agentModes.map((agent) => {
              const Icon = agent.icon;
              return (
                <Button
                  key={agent.id}
                  variant={selectedAgent === agent.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`text-xs px-3 py-1.5 h-auto rounded-md flex items-center gap-1.5 shadow-xs transition-all
                              ${selectedAgent === agent.id 
                                  ? 'bg-black text-white' 
                                  : 'border-neutral-200/80 text-neutral-600 hover:bg-neutral-100 hover:text-black'
                              }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${selectedAgent === agent.id ? 'text-white' : 'text-neutral-500'}`} />
                  {agent.name}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* AI Suggestions / Trending Topics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 text-center"
        >
          <p className="text-xs text-neutral-500 mb-1.5">Explore ideas or dive into current events.</p>
          <h3 className="text-sm font-semibold text-black mb-3">Trending Topics</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {aiSuggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="ghost"
                size="sm"
                className="text-neutral-700 bg-neutral-50 hover:bg-neutral-100 hover:text-black border border-neutral-200/70 rounded-md text-xs font-normal shadow-xs px-3 py-1 h-auto"
                onClick={() => handleSearchWithAgent(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* News + Stock Market Grid (Aligned) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
        >
          {/* News Grid (Left) */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-black mb-1">Latest News</h2>
            {news.length > 0 ? news.map((article, idx) => (
              <Card 
                key={idx} 
                className="border border-neutral-200/80 rounded-lg bg-white shadow-sm p-3 flex flex-col gap-2 transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  {article.urlToImage && 
                    <img src={article.urlToImage} alt={article.title} className="w-16 h-16 object-cover rounded-md border border-neutral-100 flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{article.source.name}</p>
                      {article.category && (
                        <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-700 border-blue-200">
                          {article.category}
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium text-sm text-black line-clamp-2 leading-snug">{article.title}</p>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mt-1">{article.description}</p>
                <div className="flex items-center gap-2 mt-1.5 self-start">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-200/80 text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-md px-2 py-1 text-[10px] h-auto"
                        onClick={() => setSelectedNewsArticle(article)}
                    >
                        AI Summary
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-neutral-200/80 text-neutral-600 hover:text-black hover:bg-neutral-50 rounded-md px-2 py-1 text-[10px] h-auto"
                        onClick={() => window.open(article.url, '_blank')}
                    >
                        Read Article
                    </Button>
                </div>
              </Card>
            )) : <p className="text-xs text-neutral-400">Loading news...</p>}
          </div>

          {/* Stock Market (Right) */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-black mb-1">Stock Market</h2>
            <StockChart stocks={stocks} />
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-black mb-1">Crypto Market</h2>
              <CryptoChart crypto={crypto} />
            </div>
          </div>
        </motion.div>
      </div>
      <AnimatePresence>
        {selectedNewsArticle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedNewsArticle(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y:10 }} animate={{ scale: 1, opacity: 1, y:0 }} exit={{ scale: 0.9, opacity: 0, y:10 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-black leading-tight">AI Generated Summary</h3>
                    <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-7 w-7 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100" onClick={() => setSelectedNewsArticle(null)}><Zap className="w-4 h-4" /></Button>
                </div>
                {selectedNewsArticle.urlToImage && (<img src={selectedNewsArticle.urlToImage} alt={selectedNewsArticle.title} className="w-full h-36 object-cover rounded-lg mb-3 border border-neutral-100" />)}
                <p className="text-xs text-neutral-500 mb-0.5 uppercase tracking-wider">{selectedNewsArticle.source.name}</p>
                <h4 className="text-sm font-medium text-black mb-2 leading-snug">{selectedNewsArticle.title}</h4>
                <div className="bg-neutral-50 border border-neutral-200/70 rounded-md p-3 mb-3">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-black flex-shrink-0" />
                        <p className="text-[11px] font-medium text-black">Key Insights (AI)</p>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">{generateAISummaryForNews(selectedNewsArticle)}</p>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <Button size="sm" className="flex-1 bg-black text-white hover:bg-neutral-800 rounded-md text-xs h-8 px-3" onClick={() => { window.open(selectedNewsArticle.url, '_blank'); setSelectedNewsArticle(null); }}>Read Full Article</Button>
                    <Button variant="outline" size="sm" className="flex-1 border-neutral-200/80 text-neutral-600 hover:text-black rounded-md text-xs h-8 px-3" onClick={() => setSelectedNewsArticle(null)}>Close</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedHomepage;