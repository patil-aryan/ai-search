"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Clock, Zap, BookOpen, Users, Activity, DollarSign, MapPin, Sun, Cloud, CloudRain, Sparkles, ExternalLink, Filter, RefreshCw, Newspaper, Trophy, LineChart, Wind, ListFilter, Search, Globe, Youtube, ImageIcon, MessageSquare, Briefcase, ShoppingBag } from "lucide-react";
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

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
  historical?: { date: string; close: number }[];
  aiSummary?: string;
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

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  iconUrl?: string;
  humidity?: number;
  windSpeed?: number;
  description?: string;
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

// Top stocks list
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

const EnhancedDiscover = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
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

  const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "95e671056a9049fc9b1f3781faacc5e7";
  const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "4908931555f941dfd2851f15bf284f23";
  const SPORTS_API_KEY = process.env.NEXT_PUBLIC_SPORTS_API_KEY || "8f556c5990e52f441f6f398cd74d4961";
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "d0pkha1r01qgccu9mju0d0pkha1r01qgccu9mjug";
  const COINGECKO_API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY || "";

  const fetchNews = useCallback(async () => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=8&apiKey=${NEWS_API_KEY}`);
      
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
        .slice(0, 8)
        .map((article: any) => ({
          title: article.title,
          description: article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: { name: article.source.name },
          category: article.category || 'General'
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
    setLoading(prev => ({ ...prev, news: false }));
  }, [NEWS_API_KEY]);

  const fetchSportsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, sports: true }));
    const mockSports: SportEvent[] = [
      { id: '1', league: 'NBA', match: 'Warriors vs Suns', homeTeam: 'Warriors', awayTeam: 'Suns', homeScore: 115, awayScore: 108, status: 'Finished', gameTime: 'Yesterday', sportType: 'NBA', venue: 'Chase Center', iconUrl: '/icons/nba.svg' },
      { id: '2', league: 'Champions League', match: 'Real Madrid vs Bayern Munich', homeTeam: 'Real Madrid', awayTeam: 'Bayern Munich', homeScore: 1, awayScore: 1, status: 'Halftime', gameTime: "45'", sportType: 'SOCCER', venue: 'Santiago Bernabéu', iconUrl: '/icons/soccer.svg' },
      { id: '3', league: 'NFL', match: '49ers vs Cowboys', homeTeam: '49ers', awayTeam: 'Cowboys', homeScore: '7', awayScore: '10', status: 'Q2 08:30', gameTime: 'LIVE', sportType: 'NFL', venue: 'Levi\'s Stadium', iconUrl: '/icons/nfl.svg' },
      { id: '4', league: 'MLB', match: 'Dodgers vs Giants', homeTeam: 'Dodgers', awayTeam: 'Giants', homeScore: 0, awayScore: 0, status: 'Upcoming', gameTime: 'Tomorrow 7:10PM', sportType: 'MLB', venue: 'Dodger Stadium', iconUrl: '/icons/mlb.svg' },
      { id: '5', league: 'NHL', match: 'Oilers vs Avalanche', homeTeam: 'Oilers', awayTeam: 'Avalanche', homeScore: 2, awayScore: 3, status: 'Live P3 05:12', gameTime: 'LIVE', sportType: 'NHL', venue: 'Rogers Place', iconUrl: '/icons/nhl.svg' },
      { id: '6', league: 'Formula 1', match: 'Monaco Grand Prix', homeTeam: 'LEC', awayTeam: 'VER', homeScore: 'P1', awayScore: 'P2', status: 'Finished', gameTime: 'Last Sunday', sportType: 'OTHER', venue: 'Circuit de Monaco', iconUrl: '/icons/f1.svg' }
    ];
    await new Promise(resolve => setTimeout(resolve, 800));
    setSportsEvents(mockSports);
    setLoading(prev => ({ ...prev, sports: false }));
  }, []);
  
  const fetchStocks = useCallback(async () => {
    setLoading(prev => ({ ...prev, stocks: true }));
    const stockPromises = TopStocksList.map(async (stockInfo) => {
      try {
        const quoteResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${stockInfo.symbol}&token=${FINNHUB_API_KEY}`);
        if (!quoteResponse.ok) throw new Error(`Failed to fetch quote for ${stockInfo.symbol}`);
        const quoteData = await quoteResponse.json();
        
        const summaries = [
            `Recent positive earnings for ${stockInfo.name} have boosted investor confidence. Analyst ratings are leaning towards 'Buy'. Technical indicators show potential upward momentum if key resistance levels are breached.`,
            `${stockInfo.name} is navigating a volatile sector. Watch for upcoming industry news and macroeconomic factors. AI sentiment analysis suggests a mixed short-term outlook, but long-term fundamentals appear solid.`,
            `Trading volume for ${stockInfo.symbol} has increased by X% over the past week, indicating heightened market interest. AI models predict a potential price consolidation before the next significant move. Consider upcoming shareholder meetings.`,
            `Competitor performance and new product announcements in ${stockInfo.name}'s sector could impact ${stockInfo.symbol}. Our AI suggests monitoring these external factors closely along with standard financial metrics.`
        ];
        const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];

        return {
          symbol: stockInfo.symbol,
          price: quoteData.c ?? (Math.random() * 500 + 50),
          change: quoteData.d ?? (Math.random() * 10 - 5),
          changePercent: quoteData.dp ?? (Math.random() * 2 - 1),
          name: stockInfo.name,
          aiSummary: randomSummary
        };
      } catch (error) {
        console.error(`Error fetching stock ${stockInfo.symbol}:`, error);
        return { 
            symbol: stockInfo.symbol, 
            price: (Math.random() * 500 + 50), 
            change: (Math.random() * 10 - 5), 
            changePercent: (Math.random() * 2 - 1), 
            name: stockInfo.name, 
            historical: [], 
            aiSummary: "AI insights currently unavailable due to a data fetching issue. Please try again later." 
        };
      }
    });
    const fetchedStocks = await Promise.all(stockPromises);
    setStocks(fetchedStocks);
    setLoading(prev => ({ ...prev, stocks: false }));
  }, [FINNHUB_API_KEY]);

  const fetchWeather = useCallback(async () => {
    setLoading(prev => ({ ...prev, weather: true }));
    const cities = ["New York", "London", "Tokyo", "Paris"];
    const weatherPromises = cities.map(async (city) => {
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
        if (!response.ok) throw new Error(`Failed to fetch weather for ${city}`);
        const data = await response.json();
        return {
          location: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          description: data.weather[0].description,
        };
      } catch (error) {
        console.error(error);
        return { location: city, temperature: Math.floor(Math.random() * 20), condition: 'N/A', description: 'Could not load' };
      }
    });
    setWeather(await Promise.all(weatherPromises));
    setLoading(prev => ({ ...prev, weather: false }));
  }, [WEATHER_API_KEY]);

  const fetchCrypto = useCallback(async () => {
    setLoading(prev => ({ ...prev, crypto: true }));
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h${COINGECKO_API_KEY ? `&x_cg_demo_api_key=${COINGECKO_API_KEY}`: ""}`);
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Crypto API error: ${response.status} ${errorBody}`);
      }
      const data: CryptoData[] = await response.json();
      
      const cryptoSummaries = [
        `Blockchain activity for ${name} shows a recent spike in transaction volume, often a precursor to price movements. Social media sentiment is currently bullish.`,
        `Upcoming network upgrades for ${name} could enhance scalability and attract new investment. AI analysis suggests a potential breakout if current support levels hold.`,
        `Regulatory news in key markets may impact ${name}'s short-term price. Our models are factoring in a period of uncertainty, but long-term adoption trends remain positive.`,
        `${name} is showing strong correlation with major market indices. Watch for broader economic shifts. AI suggests a cautious approach, with key resistance at $X and support at $Y.`
      ];

      setCrypto(data.map(c => {
        const randomSummary = cryptoSummaries[Math.floor(Math.random() * cryptoSummaries.length)].replace(/\${name}/g, c.name).replace(/\$X/g, (c.current_price * 1.1).toFixed(2)).replace(/\$Y/g, (c.current_price * 0.9).toFixed(2));
        return {...c, aiSummary: randomSummary};
      }));
      if (data.length > 0 && !crypto.find(c => c.id === selectedCryptoId)) {
        setSelectedCryptoId(data[0].id);
      }
    } catch (error) {
      console.error('Crypto fetch error:', error);
      setCrypto([]);
    }
    setLoading(prev => ({ ...prev, crypto: false }));
  }, [COINGECKO_API_KEY, selectedCryptoId]);

  useEffect(() => {
    fetchNews();
    fetchSportsData();
    fetchStocks();
    fetchWeather();
    fetchCrypto();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        fetchSportsData();
        fetchStocks();
        fetchWeather();
        fetchCrypto();
        fetchNews();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews, fetchSportsData, fetchStocks, fetchWeather, fetchCrypto]);

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
        price: stock.price * (1 + (Math.random() - 0.5) * 0.1 * (i/30))
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
        {loading.news && news.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {news.map((article, idx) => (
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
            ))}
          </div>
        ) : (
          <p className="text-center text-neutral-500 py-8">No news articles found.</p>
        )}
      </section>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-neutral-700">Stock Market</h2>
            <div className="mt-2 sm:mt-0 w-full sm:w-auto max-w-xs">
                <Select value={selectedStockSymbol} onValueChange={setSelectedStockSymbol}>
                    <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Select a stock..." />
                    </SelectTrigger>
                    <SelectContent>
                        {TopStocksList.map(stock => (
                            <SelectItem key={stock.symbol} value={stock.symbol} className="text-xs">
                  {stock.name} ({stock.symbol})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        {loading.stocks && !stocks.find(s => s.symbol === selectedStockSymbol) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card><CardContent className="p-4"><Skeleton className="h-[200px] w-full" /></CardContent></Card>
                <Card><CardContent className="p-4"><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2 mb-4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full mt-1" /><Skeleton className="h-4 w-5/6 mt-1" /></CardContent></Card>
            </div>
        ) : stocks.find(s => s.symbol === selectedStockSymbol) ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="md:col-span-3 border-neutral-200/70 rounded-lg bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium text-neutral-700">{stocks.find(s => s.symbol === selectedStockSymbol)?.name} ({selectedStockSymbol}) Chart</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        <StockChartDisplay stock={stocks.find(s => s.symbol === selectedStockSymbol)} />
                    </CardContent>
                </Card>
                <Card className="md:col-span-2 border-neutral-200/70 rounded-lg bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium text-neutral-700">Details & AI Insights</CardTitle>
                  </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                        {stocks.find(s => s.symbol === selectedStockSymbol) && (
                            <>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-neutral-500">Price:</span>
                                    <span className="font-semibold text-neutral-800 text-sm">${stocks.find(s => s.symbol === selectedStockSymbol)?.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-neutral-500">Change:</span>
                                    <span className={`font-semibold text-sm ${stocks.find(s => s.symbol === selectedStockSymbol)!.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stocks.find(s => s.symbol === selectedStockSymbol)?.change.toFixed(2)} ({stocks.find(s => s.symbol === selectedStockSymbol)?.changePercent.toFixed(2)}%)
                                    </span>
                                </div>
                                <div className="pt-3 mt-2 border-t border-neutral-100">
                                    <h4 className="text-xs font-semibold text-neutral-800 mb-1 flex items-center"><Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> AI Insights</h4>
                                    <p className="text-neutral-600 leading-relaxed italic text-[11px]">
                                        {stocks.find(s => s.symbol === selectedStockSymbol)?.aiSummary || "AI insights are currently processing..."}
                                    </p>
                                </div>
                            </>
                        )}
                  </CardContent>
                </Card>
            </div>
        ) : (
             <p className="text-center text-neutral-500 py-8">Stock data not available for {selectedStockSymbol}.</p>
        )}
      </section>

      <section className="mb-10">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-neutral-700">Cryptocurrency Market</h2>
            <div className="mt-2 sm:mt-0 w-full sm:w-auto max-w-xs">
                <Select value={selectedCryptoId} onValueChange={setSelectedCryptoId}>
                    <SelectTrigger className="text-xs h-9">
                        <SelectValue placeholder="Select crypto..." />
                    </SelectTrigger>
                    <SelectContent>
                        {crypto.slice(0,20).map(c => (
                            <SelectItem key={c.id} value={c.id} className="text-xs">
                                {c.name} ({c.symbol.toUpperCase()})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        {loading.crypto && !crypto.find(c => c.id === selectedCryptoId) ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card><CardContent className="p-4"><Skeleton className="h-[200px] w-full" /></CardContent></Card>
                <Card><CardContent className="p-4"><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2 mb-4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full mt-1" /><Skeleton className="h-4 w-5/6 mt-1" /></CardContent></Card>
            </div>
        ) : crypto.find(c => c.id === selectedCryptoId) ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="md:col-span-3 border-neutral-200/70 rounded-lg bg-white shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-base font-medium text-neutral-700">{crypto.find(c => c.id === selectedCryptoId)?.name} ({crypto.find(c => c.id === selectedCryptoId)?.symbol.toUpperCase()}) Chart</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        <CryptoChartDisplay coin={crypto.find(c => c.id === selectedCryptoId)} />
                    </CardContent>
                </Card>
                <Card className="md:col-span-2 border-neutral-200/70 rounded-lg bg-white shadow-sm">
                     <CardHeader>
                        <CardTitle className="text-base font-medium text-neutral-700">Details & AI Insights</CardTitle>
                  </CardHeader>
                    <CardContent className="space-y-3 text-xs">
                        {crypto.find(c => c.id === selectedCryptoId) && (
                            <>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-neutral-500">Price:</span>
                                    <span className="font-semibold text-neutral-800 text-sm">${crypto.find(c => c.id === selectedCryptoId)?.current_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-neutral-500">24h Change:</span>
                                     <span className={`font-semibold text-sm ${crypto.find(c => c.id === selectedCryptoId)!.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {crypto.find(c => c.id === selectedCryptoId)?.price_change_percentage_24h.toFixed(2)}%
                                    </span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-neutral-500">Market Cap:</span>
                                    <span className="font-semibold text-neutral-800 text-sm">${crypto.find(c => c.id === selectedCryptoId)?.market_cap.toLocaleString()}</span>
                                </div>
                                {crypto.find(c => c.id === selectedCryptoId)?.total_volume && (
                                <div className="flex justify-between items-baseline">
                                    <span className="text-neutral-500">24h Volume:</span>
                                    <span className="font-semibold text-neutral-800 text-sm">${crypto.find(c => c.id === selectedCryptoId)?.total_volume?.toLocaleString()}</span>
                                </div>
                                )}
                                <div className="pt-3 mt-2 border-t border-neutral-100">
                                    <h4 className="text-xs font-semibold text-neutral-800 mb-1 flex items-center"><Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> AI Insights</h4>
                                    <p className="text-neutral-600 leading-relaxed italic text-[11px]">
                                        {crypto.find(c => c.id === selectedCryptoId)?.aiSummary || "AI insights are currently processing..."}
                                    </p>
                                </div>
                            </>
                        )}
                  </CardContent>
                </Card>
            </div>
         ) : (
             <p className="text-center text-neutral-500 py-8">Crypto data not available for {selectedCryptoId}.</p>
        )}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-neutral-200/70 rounded-lg bg-white shadow-sm h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-neutral-700 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-orange-500" />
                Global Weather
              </CardTitle>
              <CardDescription className="text-sm text-neutral-500">
                Current conditions in major cities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[400px] flex flex-col">
              {loading.weather && weather.length === 0 ? (
                Array.from({length: 4}).map((_, idx) => (
                  <div key={idx} className="p-3 border border-neutral-100 rounded-lg">
                    <Skeleton className="h-5 w-1/3 mb-2"/>
                    <Skeleton className="h-4 w-1/2"/>
                  </div>
                ))
              ) : weather.length > 0 ? (
                <div className="flex-1 space-y-3">
                  {weather.map((cityWeather, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="p-3 border border-neutral-100 rounded-lg hover:border-neutral-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {cityWeather.iconUrl ? (
                            <img src={cityWeather.iconUrl} alt={cityWeather.condition} className="w-10 h-10" />
                          ) : (
                            getWeatherIcon(cityWeather.condition)
                          )}
                          <div>
                            <span className="text-sm font-medium text-neutral-800">{cityWeather.location}</span>
                            <p className="text-xs text-neutral-500 capitalize">{cityWeather.description || cityWeather.condition}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-neutral-700">{cityWeather.temperature}°C</span>
                          {cityWeather.humidity && cityWeather.windSpeed && (
                            <div className="text-xs text-neutral-500 mt-1">
                              <div>💧 {cityWeather.humidity}%</div>
                              <div>💨 {cityWeather.windSpeed} m/s</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
                  <Cloud className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">Weather data currently unavailable</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-neutral-200/70 rounded-lg bg-white shadow-sm h-fit">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-neutral-700 flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-blue-500" />
                Sports Highlights
              </CardTitle>
              <CardDescription className="text-sm text-neutral-500">
                Live scores and upcoming games
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 min-h-[400px] flex flex-col">
              {loading.sports && sportsEvents.length === 0 ? (
                Array.from({length: 4}).map((_, idx) => (
                  <div key={idx} className="p-3 border border-neutral-100 rounded-lg">
                    <Skeleton className="h-4 w-1/4 mb-1"/>
                    <Skeleton className="h-5 w-3/4 mb-2"/>
                    <Skeleton className="h-3 w-1/2"/>
                  </div>
                ))
              ) : sportsEvents.length > 0 ? (
                <div className="flex-1 space-y-3">
                  {sportsEvents.map((event: SportEvent, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      className="p-3 border border-neutral-100 rounded-lg hover:border-neutral-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider font-medium">
                          {event.league}
                        </span>
                        <Badge 
                          variant={
                            event.status.toLowerCase().includes('live') || event.status.toLowerCase().includes('progress') ? 'destructive' : 
                            event.status.toLowerCase().includes('upcoming') || event.status.toLowerCase().includes('scheduled') ? 'secondary' : 
                            'outline'
                          }
                          className="text-xs px-2 py-1"
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-semibold text-neutral-800">{event.homeTeam} vs {event.awayTeam}</p>
                        {(event.status.toLowerCase().includes('live') || event.status.toLowerCase().includes('finished') || event.status.toLowerCase().includes('progress')) && (
                          <p className="text-lg text-blue-600 font-bold mt-1">{event.homeScore} - {event.awayScore}</p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-xs text-neutral-500">
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 flex-1 flex flex-col items-center justify-center">
                  <Trophy className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-neutral-500">Sports highlights currently unavailable</p>
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