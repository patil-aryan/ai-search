"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Clock, Zap, BookOpen, Users, Activity, DollarSign, MapPin, Sun, Cloud, CloudRain, Sparkles, ExternalLink, Filter, RefreshCw, Newspaper, Trophy, LineChart, Wind, ListFilter, Search, Globe, Youtube, ImageIcon, MessageSquare, Briefcase, ShoppingBag, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line, ComposedChart, Bar } from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Interfaces
interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: { name: string };
  category?: string;
}

interface SportEvent {
  id: string;
  league: string;
  match: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | string;
  awayScore: number | string;
  status: string;
  gameTime?: string;
  venue?: string;
  sportType: 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'SOCCER' | 'OTHER';
  iconUrl?: string;
}

// Add CryptoQuote type
type CryptoQuote = {
  [symbol: string]: {
    quote: {
      USD: {
        price: number;
      };
    };
  };
};

// StockData type fix (ensure correct interface is used everywhere)
interface StockData {
  symbol: string;
  price: string;
  change: string;
  percent: string;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  total_volume?: number;
  image?: string;
  sparkline_in_7d?: { price: number[] };
  aiSummary?: string;
}

// WeatherData type fix
interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  iconUrl: string; // always a string
  humidity: number;
  windSpeed: number;
  description: string;
}

const newsCategories = [
  { value: "general", label: "All News" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "sports", label: "Sports News" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "entertainment", label: "Entertainment" },
];

// Top stocks list (limit to top 10 only)
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
];

const WeatherCities = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
  'Paris',
  'Toronto',
];

const EnhancedDiscover = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [sportsEvents, setSportsEvents] = useState<SportEvent[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [crypto, setCrypto] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState({
    news: true, sports: true, stocks: true, weather: true, crypto: true
  });
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsItem | null>(null);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>(TopStocksList[0].symbol);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>('bitcoin');

  // --- NEWS: Try multiple NewsAPI keys in order ---
  const NEWSAPI_KEYS = [
    'd2698da0654a45399781d3d2de36f62e',
    // Add more keys here if needed
  ];

  const fetchNews = useCallback(async () => {
    setLoading(prev => ({ ...prev, news: true }));
    let lastError = null;
    for (const key of NEWSAPI_KEYS) {
      try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=12&apiKey=${key}`);
        if (!response.ok) throw new Error('NewsAPI error: ' + response.status);
        const data = await response.json();
        if (data.status !== 'ok' || !data.articles) throw new Error('NewsAPI error: ' + (data.message || 'Unknown error'));
        let articles = data.articles.slice(0, 12).map((item: any) => ({
          title: item.title,
          description: item.description,
          url: item.url,
          urlToImage: item.urlToImage,
          publishedAt: item.publishedAt,
          source: { name: item.source?.name || '' },
          category: undefined,
        }));
        while (articles.length < 12) articles.push(null);
        setNews(articles);
        setNewsError(null);
        setLoading(prev => ({ ...prev, news: false }));
        return;
      } catch (error) {
        lastError = error;
      }
    }
    setNews(Array(12).fill(null));
    setNewsError((lastError instanceof Error ? lastError.message : 'Failed to fetch news.'));
    setLoading(prev => ({ ...prev, news: false }));
  }, []);

  // --- WEATHER: Fetch for 6 cities, fix WEATHER_API_KEY usage and null filtering ---
  const fetchWeather = useCallback(async () => {
    setLoading(prev => ({ ...prev, weather: true }));
    const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    const weatherPromises = WeatherCities.map(async (city) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
        );
        if (!response.ok) throw new Error('Weather API error');
        const data = await response.json();
        return {
          location: city,
          temperature: data.main.temp,
          condition: data.weather[0].main,
          iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          description: data.weather[0].description,
        };
      } catch (error) {
        return null;
      }
    });
    const results = await Promise.all(weatherPromises);
    setWeather(results.filter((item): item is WeatherData => !!item && typeof item.location === 'string'));
    setLoading(prev => ({ ...prev, weather: false }));
  }, []);

  // --- SPORTS: Show 4 English League 1 matches (static for now, can be API) ---
  const fetchSportsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, sports: true }));
    try {
      // Static English League 1 matches for demo
      const events = [
        {
          id: '1',
          league: 'English League 1',
          match: 'Charlton vs Leyton Orient',
          homeTeam: 'Charlton',
          awayTeam: 'Leyton Orient',
          homeScore: 1,
          awayScore: 0,
          status: 'Match Finished',
          gameTime: '2025-05-25 12:01:00',
          venue: 'Wembley Stadium',
          sportType: 'SOCCER',
        },
        {
          id: '2',
          league: 'English League 1',
          match: 'Charlton vs Wycombe',
          homeTeam: 'Charlton',
          awayTeam: 'Wycombe',
          homeScore: 1,
          awayScore: 0,
          status: 'Match Finished',
          gameTime: '2025-05-15 19:00:00',
          venue: 'The Valley',
          sportType: 'SOCCER',
        },
        {
          id: '3',
          league: 'English League 1',
          match: 'Stockport vs Leyton Orient',
          homeTeam: 'Stockport',
          awayTeam: 'Leyton Orient',
          homeScore: 1,
          awayScore: 1,
          status: 'Match Finished',
          gameTime: '2025-05-14 19:00:00',
          venue: 'Edgeley Park',
          sportType: 'SOCCER',
        },
        {
          id: '4',
          league: 'English League 1',
          match: 'Wycombe vs Charlton',
          homeTeam: 'Wycombe',
          awayTeam: 'Charlton',
          homeScore: 0,
          awayScore: 0,
          status: 'Match Finished',
          gameTime: '2025',
          venue: '',
          sportType: 'SOCCER',
        },
      ];
      setSportsEvents(events);
    } catch (error) {
      setSportsEvents([]);
      console.error('Sports fetch error:', error);
    }
    setLoading(prev => ({ ...prev, sports: false }));
  }, []);
  
  // --- STOCKS: Use Alpha Vantage with provided key ---
  // STOCKS SECTION
  const [selectedStock, setSelectedStock] = useState<string>('AAPL');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [stockError, setStockError] = useState<string | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);

  const fetchStock = async (symbol: string) => {
    setLoadingStock(true);
    setStockError(null);
    setStockData(null);
    try {
      const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY}`);
      const data = await res.json();
      if (data["Note"]) {
        setStockError("Alpha Vantage rate limit reached. Please wait a minute and try again.");
      } else if (!data["Global Quote"] || Object.keys(data["Global Quote"]).length === 0) {
        setStockError("No data available for this stock symbol.");
      } else {
        setStockData({
          symbol: data["Global Quote"]["01. symbol"],
          price: data["Global Quote"]["05. price"],
          change: data["Global Quote"]["09. change"],
          percent: data["Global Quote"]["10. change percent"],
        });
      }
    } catch (err) {
      setStockError("Failed to fetch stock data.");
    } finally {
      setLoadingStock(false);
    }
  };

  // CRYPTO SECTION
  const [cryptoData, setCryptoData] = useState<CryptoQuote | null>(null);
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [loadingCrypto, setLoadingCrypto] = useState(false);

  // --- CRYPTO: Use CoinGecko API (same as homepage) ---
  const fetchCrypto = async () => {
    setLoadingCrypto(true);
    setCryptoError(null);
    setCrypto([]);
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=true');
      if (!res.ok) throw new Error('Crypto API error');
      const data = await res.json();
      setCrypto(data);
    } catch (err: any) {
      setCryptoError(err.message || 'Failed to fetch crypto data.');
    } finally {
      setLoadingCrypto(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchSportsData();
    fetchStock(selectedStock);
    fetchWeather();
    fetchCrypto();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        fetchSportsData();
        fetchStock(selectedStock);
        fetchWeather();
        fetchCrypto();
        fetchNews();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews, fetchSportsData, fetchStock, fetchWeather, fetchCrypto]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const generateAISummaryForNewsModal = (article: NewsItem): string => {
    return `This article, titled "${article.title}", published by ${article.source.name} on ${new Date(article.publishedAt).toLocaleDateString()}, delves into ${article.description}. The content primarily focuses on ${article.category || 'various topics'}. Key takeaways include [AI would generate actual takeaways here]. This is an AI-generated summary.`;
  };
  
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("clear") || lowerCondition.includes("sun")) return <Sun className="w-5 h-5 text-yellow-500" />;
    if (lowerCondition.includes("cloud")) return <Cloud className="w-5 h-5 text-gray-400" />;
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) return <CloudRain className="w-5 h-5 text-blue-500" />;
    if (lowerCondition.includes("snow")) return <CloudRain className="w-5 h-5 text-sky-300" />;
    if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) return <Zap className="w-5 h-5 text-purple-500" />;
    if (lowerCondition.includes("wind")) return <Wind className="w-5 h-5 text-teal-500" />;
    return <Cloud className="w-5 h-5 text-gray-400" />;
  };

  const GridItem = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-neutral-200/70 p-4 ${className}`}>
        {children}
    </div>
  );

  const DataAreaChart = ({ data, dataKey, name, color }: { data: any[], dataKey: string, name: string, color: string }) => (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <defs>
          <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.7}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(value) => `$${Number(value).toFixed(0)}`} tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
        <Tooltip
          contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
          itemStyle={{ fontSize: '12px' }}
          labelStyle={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}
          formatter={(value: number) => [`$${value.toFixed(2)}`, name]}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#color${dataKey})`} />
                </AreaChart>
              </ResponsiveContainer>
  );

  const StockChartDisplay = ({ stock }: { stock: StockData | undefined}) => {
    if (loading.stocks && !stock) return <Skeleton className="h-[200px] w-full" />;
    if (!stock) return <div className="h-[200px] flex items-center justify-center text-neutral-500 text-sm">No stock data available.</div>;
    
    const chartData = Array.from({ length: 30 }, (_, i) => ({
        time: `D${i+1}`,
        price: Number(stock.price) * (1 + (Math.random() - 0.5) * 0.1 * (i/30))
    }));

    return <DataAreaChart data={chartData} dataKey="price" name={stock.symbol} color="#10b981" />;
  };
  
  const CryptoChartDisplay = ({ coin }: { coin: CryptoData | undefined }) => {
    if (loading.crypto && !coin) return <Skeleton className="h-[200px] w-full" />;
    if (!coin) return <div className="h-[200px] flex items-center justify-center text-neutral-500 text-sm">No crypto data available.</div>;

    const chartData = coin.sparkline_in_7d?.price.map((p, i) => ({ time: `D${i+1}`, price: p })) || 
                      Array.from({ length: 7 }, (_, i) => ({ time: `D${i+1}`, price: coin.current_price * (1 + (Math.random() - 0.5) * 0.05) }));

    return <DataAreaChart data={chartData} dataKey="price" name={coin.symbol.toUpperCase()} color="#3b82f6" />;
  };

  if (loading.news && news.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-neutral-600 text-lg">Loading Discover Page...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-6 lg:p-8">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-800">Discover</h1>
        <p className="text-neutral-500 mt-1">Stay updated with the latest trends and information.</p>
      </header>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-neutral-700">Live News Updates</h2>
        </div>
        {newsError ? (
          <p className="text-center text-red-500 py-8">{newsError}</p>
        ) : loading.news && news.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, idx) => (
              <Card key={idx} className="border-neutral-200/70 rounded-lg bg-white shadow-sm flex flex-col">
                <Skeleton className="w-full h-32 rounded-t-lg" />
                <CardHeader className="p-3">
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-3 w-5/6" />
                </CardContent>
                <div className="p-3 pt-1 mt-auto flex gap-2">
                  <Skeleton className="h-7 w-1/2 rounded-md" />
                  <Skeleton className="h-7 w-1/2 rounded-md" />
                </div>
              </Card>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-rows-3 grid-cols-1 md:grid-cols-4 gap-4">
            {news.map((article, idx) => (
              article ? (
                <Card 
                  key={idx} 
                  className="border-neutral-200/70 rounded-lg bg-white shadow-sm flex flex-col justify-between transition-all hover:shadow-md overflow-hidden"
                >
                  <div>
                    {article.urlToImage && (
                      <img 
                        src={article.urlToImage} 
                        alt={article.title} 
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                        <span className="truncate uppercase tracking-wider">{article.source.name}</span>
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      <CardTitle className="font-semibold text-sm text-neutral-800 line-clamp-2 leading-snug hover:text-blue-600 transition-colors">
                        <a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">{article.description}</p>
                    </CardContent>
                  </div>
                  <div className="p-3 pt-2 mt-auto border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Button
                          variant="outline"
                          size="sm"
                          className="border-neutral-200/90 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md px-2.5 py-1 text-[11px] h-auto flex-1"
                          onClick={() => setSelectedNewsArticle(article)}
                      >
                          <Sparkles className="w-3 h-3 mr-1.5" /> AI Summary
                      </Button>
                      <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="border-neutral-200/90 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md px-2.5 py-1 text-[11px] h-auto flex-1"
                      >
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1.5" /> Read More
                          </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card key={idx} className="border-neutral-200/70 rounded-lg bg-white shadow-sm flex flex-col opacity-50">
                  <Skeleton className="w-full h-32 rounded-t-lg" />
                  <CardHeader className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <Skeleton className="h-3 w-full mb-1" />
                    <Skeleton className="h-3 w-5/6" />
                  </CardContent>
                  <div className="p-3 pt-1 mt-auto flex gap-2">
                    <Skeleton className="h-7 w-1/2 rounded-md" />
                    <Skeleton className="h-7 w-1/2 rounded-md" />
                  </div>
                </Card>
              )
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-8">No news articles found.</p>
        )}
      </section>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-neutral-700">Stock Market</h2>
        </div>
        {loading.stocks ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card><CardContent className="p-4"><Skeleton className="h-[200px] w-full" /></CardContent></Card>
            <Card><CardContent className="p-4"><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2 mb-4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full mt-1" /><Skeleton className="h-4 w-5/6 mt-1" /></CardContent></Card>
          </div>
        ) : (
          <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral-700">Stocks</h2>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <select
              value={selectedStock}
              onChange={e => setSelectedStock(e.target.value)}
              className="border border-neutral-200 rounded px-2 py-1 text-xs text-neutral-700 bg-white"
              disabled={loadingStock}
            >
              <option value="AAPL">AAPL</option>
              <option value="MSFT">MSFT</option>
              <option value="GOOGL">GOOGL</option>
              <option value="AMZN">AMZN</option>
              <option value="TSLA">TSLA</option>
              <option value="NVDA">NVDA</option>
              <option value="META">META</option>
              <option value="NFLX">NFLX</option>
              <option value="BRK.B">BRK.B</option>
              <option value="JPM">JPM</option>
            </select>
            <Button
              onClick={() => fetchStock(selectedStock)}
              variant="outline"
              size="sm"
              className="border-neutral-200/90 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-xs"
              disabled={loadingStock}
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${loadingStock ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        <Card className="border-neutral-200/70 rounded-lg bg-white shadow-sm flex flex-col h-full min-h-[120px] flex-1 p-2 max-w-xs mx-auto">
          <CardContent className="flex flex-col items-center justify-center flex-1 px-2 py-1">
            {loadingStock ? (
              <>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </>
            ) : stockError ? (
              <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-300 mx-auto mb-1" />
                <p className="text-xs text-red-500">{stockError}</p>
              </div>
            ) : stockData ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-bold text-neutral-800">{stockData.symbol}</span>
                </div>
                <div className="text-2xl font-bold text-neutral-700 mb-1">${Number(stockData.price).toFixed(2)}</div>
                <div className={`text-sm font-semibold ${Number(stockData.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{stockData.change} ({stockData.percent})</div>
              </>
            ) : (
              <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
                <TrendingUp className="w-8 h-8 text-neutral-300 mx-auto mb-1" />
                <p className="text-xs text-neutral-500">No stock data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
        )}
      </section>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral-700">Crypto</h2>
          <Button
            onClick={fetchCrypto}
            variant="outline"
            size="sm"
            className="border-neutral-200/90 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-xs mt-2 sm:mt-0"
            disabled={loadingCrypto}
          >
            <RefreshCw className={`w-3 h-3 mr-1.5 ${loadingCrypto ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <Card className="border-neutral-200/70 rounded-lg bg-white shadow-sm flex flex-col h-full min-h-[120px] flex-1 p-2 max-w-xs mx-auto">
          <CardContent className="flex flex-col items-center justify-center flex-1 px-2 py-1">
            {loadingCrypto ? (
              <>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </>
            ) : cryptoError ? (
              <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-300 mx-auto mb-1" />
                <p className="text-xs text-red-500">{cryptoError}</p>
                {cryptoError.includes('CORS') && (
                  <p className="text-xs text-neutral-500 mt-1">To fix this, fetch crypto data from your backend or use a CORS proxy for development.</p>
                )}
              </div>
            ) : cryptoData ? (
              <div className="w-full flex flex-col gap-2">
                {['BTC', 'ETH', 'SOL'].map(symbol => (
                  <div key={symbol} className="flex items-center justify-between border-b border-neutral-100 pb-1 last:border-b-0">
                    <span className="text-xs font-semibold text-neutral-700">{symbol}</span>
                    <span className="text-base font-bold text-neutral-800">${cryptoData[symbol]?.quote?.USD?.price?.toFixed(2) ?? '--'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
                <TrendingUp className="w-8 h-8 text-neutral-300 mx-auto mb-1" />
                <p className="text-xs text-neutral-500">No crypto data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-neutral-700">Weather & Sports Updates</h2>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              onClick={fetchWeather}
              variant="outline"
              size="sm"
              className="border-neutral-200/90 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-xs"
              disabled={loading.weather}
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${loading.weather ? 'animate-spin' : ''}`} />
              Weather
            </Button>
            <Button
              onClick={fetchSportsData}
              variant="outline"
              size="sm"
              className="border-neutral-200/90 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 text-xs"
              disabled={loading.sports}
            >
              <RefreshCw className={`w-3 h-3 mr-1.5 ${loading.sports ? 'animate-spin' : ''}`} />
              Sports
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Weather Card */}
          <Card className="border-neutral-200/70 rounded-lg bg-white shadow-sm flex flex-col h-full min-h-[120px] flex-1 p-2">
            <CardHeader className="pb-2 px-2">
              <CardTitle className="text-base font-semibold text-neutral-700 flex items-center">
                <Sun className="w-4 h-4 mr-1 text-orange-500" />
                Weather
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                Major cities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 flex-1 flex flex-col justify-center px-2 py-1">
              {loading.weather && weather.length === 0 ? (
                Array.from({length: 6}).map((_, idx) => (
                  <div key={idx} className="p-2 border border-neutral-100 rounded-lg">
                    <Skeleton className="h-4 w-1/3 mb-1"/>
                    <Skeleton className="h-3 w-1/2"/>
                  </div>
                ))
              ) : weather.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {weather.map((cityWeather, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="p-2 border border-neutral-100 rounded-lg hover:border-neutral-200 hover:shadow-sm transition-all flex flex-col items-center justify-center min-h-[48px]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {cityWeather.iconUrl ? (
                          <img src={cityWeather.iconUrl} alt={cityWeather.condition} className="w-5 h-5" />
                        ) : (
                          getWeatherIcon(cityWeather.condition)
                        )}
                        <span className="text-xs font-medium text-neutral-800">{cityWeather.location}</span>
                      </div>
                      <span className="text-base font-bold text-neutral-700">{cityWeather.temperature}°C</span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
                  <Cloud className="w-8 h-8 text-neutral-300 mx-auto mb-1" />
                  <p className="text-xs text-neutral-500">Weather unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* Sports Card */}
          <Card className="border-neutral-200/70 rounded-lg bg-white shadow-sm flex flex-col h-full min-h-[120px] flex-1 p-2">
            <CardHeader className="pb-2 px-2">
              <CardTitle className="text-base font-semibold text-neutral-700 flex items-center">
                <Trophy className="w-4 h-4 mr-1 text-blue-500" />
                Sports
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                NBA highlights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 flex-1 flex flex-col justify-center px-2 py-1">
              {loading.sports && sportsEvents.length === 0 ? (
                Array.from({length: 4}).map((_, idx) => (
                  <div key={idx} className="p-2 border border-neutral-100 rounded-lg">
                    <Skeleton className="h-3 w-1/4 mb-1" />
                    <Skeleton className="h-4 w-3/4 mb-1" />
                  </div>
                ))
              ) : sportsEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {sportsEvents.map((event, idx) => (
                    event ? (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="p-2 border border-neutral-100 rounded-lg hover:border-neutral-200 hover:shadow-sm transition-all flex flex-col min-h-[60px]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
                            {event.league}
                          </span>
                          <Badge 
                            variant={
                              event.status.toLowerCase().includes('live') || event.status.toLowerCase().includes('progress') ? 'destructive' : 
                              event.status.toLowerCase().includes('upcoming') || event.status.toLowerCase().includes('scheduled') ? 'secondary' : 
                              'outline'
                            }
                            className="text-[10px] px-1 py-0.5"
                          >
                            {event.status}
                          </Badge>
                        </div>
                        <div className="mb-1">
                          <p className="text-xs font-semibold text-neutral-800">{event.homeTeam} vs {event.awayTeam}</p>
                          {(event.status.toLowerCase().includes('live') || event.status.toLowerCase().includes('finished') || event.status.toLowerCase().includes('progress')) && (
                            <p className="text-base text-blue-600 font-bold mt-0.5">{event.homeScore} - {event.awayScore}</p>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-neutral-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.gameTime}
                          </span>
                          {event.venue && (
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {event.venue}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      <div key={idx} className="p-2 border border-neutral-100 rounded-lg opacity-50 flex flex-col min-h-[60px]">
                        <Skeleton className="h-3 w-1/4 mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-1" />
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
                  <Trophy className="w-8 h-8 text-neutral-300 mx-auto mb-1" />
                  <p className="text-xs text-neutral-500">Sports unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <AnimatePresence>
        {selectedNewsArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setSelectedNewsArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-neutral-800 leading-tight">AI Generated Summary</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">Powered by Advanced AI</p>
                    </div>
                    <Button variant="ghost" size="icon" className="-mr-2 -mt-1 h-8 w-8 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100" onClick={() => setSelectedNewsArticle(null)}>
                        <Zap className="w-4 h-4" />
                    </Button>
                </div>
                {selectedNewsArticle.urlToImage && (
                    <img src={selectedNewsArticle.urlToImage} alt={selectedNewsArticle.title} className="w-full h-48 object-cover rounded-lg mb-3 border border-neutral-200" />
                )}
                <p className="text-xs text-neutral-500 mb-0.5 uppercase tracking-wider">{selectedNewsArticle.source.name}</p>
                <h4 className="text-base font-medium text-neutral-800 mb-2 leading-snug">{selectedNewsArticle.title}</h4>
                
                <div className="bg-neutral-50 border border-neutral-200/80 rounded-lg p-3 mb-4 max-h-48 overflow-y-auto">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <p className="text-xs font-semibold text-neutral-700">Key Insights (AI Generated)</p>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">{generateAISummaryForNewsModal(selectedNewsArticle)}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                    <Button size="sm" className="w-full sm:w-auto flex-1 bg-neutral-800 text-white hover:bg-neutral-700 rounded-md text-xs h-9 px-4" onClick={() => { window.open(selectedNewsArticle.url, '_blank'); setSelectedNewsArticle(null); }}>
                        Read Full Article <ExternalLink className="w-3.5 h-3.5 ml-2"/>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto flex-1 border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-md text-xs h-9 px-4" onClick={() => setSelectedNewsArticle(null)}>
                        Close
                    </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedDiscover;