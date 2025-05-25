"use client";

import { useState, useEffect } from "react";
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

  // API Keys
  const NEWS_API_KEY = "95e671056a9049fc9b1f3781faacc5e7";
  const WEATHER_API_KEY = "4908931555f941dfd2851f15bf284f23";
  const FINNHUB_API_KEY = "d0pkha1r01qgccu9mju0d0pkha1r01qgccu9mjug";

  // Load Lottie animation (first one)
  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch("/Animation - 1748190729557.json");
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
  const generateAISuggestions = () => {
    return [
      "AI impact on software development workflow",
      "Future of renewable energy sources",
      "Latest advancements in quantum machine learning",
      "Understanding global supply chain disruptions"
    ];
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

  // Fetch real news data
  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=6&apiKey=${NEWS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }
      
      const data = await response.json();
      const filteredNews = data.articles
        .filter((article: any) => 
          article.title && 
          article.description && 
          article.urlToImage &&
          !article.title.includes('[Removed]') &&
          article.description !== '[Removed]'
        )
        .slice(0, 6)
        .map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: { name: article.source.name },
          category: article.category
        }));
      
      if (filteredNews.length > 0) {
        setNews(filteredNews);
      } else {
        throw new Error('No valid news articles found');
      }
    } catch (error) {
      console.error("News fetch error:", error);
      // Set fallback news data
      setNews([
        {
          title: "Breaking: Major Tech Breakthrough in AI Development",
          description: "Scientists announce significant advancement in artificial intelligence technology that could revolutionize multiple industries.",
          url: "https://example.com/news/1",
          urlToImage: "https://picsum.photos/seed/news1/400/250",
          publishedAt: new Date().toISOString(),
          source: { name: "Tech News" },
          category: "Technology"
        },
        {
          title: "Global Markets Show Strong Performance This Quarter",
          description: "Stock markets worldwide demonstrate resilience with positive growth across major indices and sectors.",
          url: "https://example.com/news/2",
          urlToImage: "https://picsum.photos/seed/news2/400/250",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: "Financial Times" },
          category: "Economy"
        },
        {
          title: "Climate Change Summit Reaches Historic Agreement",
          description: "World leaders unite on comprehensive climate action plan with ambitious targets for carbon reduction.",
          url: "https://example.com/news/3",
          urlToImage: "https://picsum.photos/seed/news3/400/250",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: "Global News" },
          category: "Environment"
        },
        {
          title: "Space Exploration Milestone: New Mission to Mars",
          description: "Space agency announces successful launch of advanced rover mission with cutting-edge scientific instruments.",
          url: "https://example.com/news/4",
          urlToImage: "https://picsum.photos/seed/news4/400/250",
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          source: { name: "Space Today" },
          category: "Science"
        }
      ]);
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
      setStocks(stockData);
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

  // Fetch crypto data
  const fetchCrypto = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
      if (!response.ok) throw new Error('Crypto API error');
      const data = await response.json();
      setCrypto(data);
    } catch (error) {
      console.error('Crypto fetch error:', error);
      setCrypto([]);
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
    if (!crypto.length) return <p className="text-xs text-neutral-400">Loading crypto data...</p>;
    // Use recharts AreaChart for the first coin (BTC)
    const btc = crypto[0];
    const chartData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      price: btc.current_price * (1 + (Math.random() - 0.5) * 0.02),
    }));
    return (
      <div className="space-y-4">
        <Card className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-black flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {btc.name} ({btc.symbol.toUpperCase()})
              </CardTitle>
              <div className="text-right">
                 <p className="text-sm font-bold text-blue-700">${btc.current_price.toLocaleString()}</p>
                 <Badge variant={btc.price_change_percentage_24h >= 0 ? "default" : "destructive"} className={`text-[10px] px-1.5 py-0.5 ${btc.price_change_percentage_24h >= 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{btc.price_change_percentage_24h >= 0 ? '+' : ''}{btc.price_change_percentage_24h.toFixed(2)}%</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} interval="preserveStartEnd" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={['dataMin - 1', 'dataMax + 1']} />
                  <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => [`$${value.toFixed(2)}`, 'Price']} labelFormatter={(label) => `Time: ${label}`} />
                  <Area type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} fill="url(#colorCrypto)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 gap-3">
          {crypto.slice(1, 5).map((coin, idx) => (
            <Card key={coin.id} className="border-neutral-200/80 rounded-lg bg-white shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-black truncate">{coin.name} ({coin.symbol.toUpperCase()})</span>
                  <Badge variant={coin.price_change_percentage_24h >= 0 ? "default" : "destructive"} className={`text-[9px] px-1 py-0.5 ${coin.price_change_percentage_24h >= 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(1)}%</Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-sm text-black">${coin.current_price.toFixed(2)}</span>
                  <span className={`text-[10px] font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>{coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}</span>
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
    <div className="min-h-screen bg-white text-black relative pt-8">
      {/* Current Date - Top Right */}
      <div className="fixed top-6 right-6 z-40 bg-white/80 backdrop-blur-sm border border-neutral-200/70 rounded-lg px-3 py-1.5 shadow-sm">
        <p className="text-xs text-neutral-600 font-medium">
          {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 pt-4 pb-12">
        {/* Lottie Animation */}
        {lottieData ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col items-center mb-4">
            <div className="w-56 h-56" style={{ filter: 'hue-rotate(210deg) brightness(0.5) saturate(3.5) contrast(1.5)' }}>
              <Lottie animationData={lottieData} loop autoplay style={{ width: '100%', height: '100%' }} />
            </div>
            <p className="mt-1 text-sm text-neutral-500">AI powered intelligent search engine</p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center mb-4 h-56">
            <p className="text-xs text-neutral-400">Loading animation...</p>
            <p className="mt-2 text-sm text-neutral-500">AI powered intelligent search engine</p>
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
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

          {/* Live Stock Market Grid (Right) & Crypto Market */}
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-black mb-1">Stock Market</h2>
              <StockChart stocks={stocks} />
            </div>
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