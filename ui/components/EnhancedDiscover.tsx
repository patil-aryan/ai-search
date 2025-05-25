"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, Clock, Zap, BookOpen, Users, Activity, DollarSign, MapPin, Sun, Cloud, CloudRain, Sparkles, ExternalLink, Filter, RefreshCw, Newspaper, Trophy, LineChart, Wind, ListFilter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Interfaces (consistent with homepage where applicable)
interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: { name: string };
  category?: string;
}

interface SportsScore {
  id: string; // Added ID for key prop
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | string;
  awayScore: number | string;
  status: string;
  gameTime?: string;
  sport: 'NBA' | 'NFL' | 'SOCCER';
  icon?: JSX.Element;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  name: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  iconUrl?: string;
}

const newsCategories = [
  { value: "general", label: "All News" },
  { value: "technology", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "sports", label: "Sports News" }, // Differentiate from sports scores section
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "entertainment", label: "Entertainment" },
];

const EnhancedDiscover = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sports, setSports] = useState<SportsScore[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState({
    news: true, sports: true, stocks: true, weather: true
  });
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsItem | null>(null);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState<string>(newsCategories[0].value);

  const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "95e671056a9049fc9b1f3781faacc5e7";
  const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "4908931555f941dfd2851f15bf284f23";
  const SPORTS_API_KEY = process.env.NEXT_PUBLIC_SPORTS_API_KEY || "8f556c5990e52f441f6f398cd74d4961";
  const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "d0pkha1r01qgccu9mju0d0pkha1r01qgccu9mjug";

  const getCategoryFromTitle = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('tech') || lowerTitle.includes('ai') || lowerTitle.includes('software')) return 'technology';
    if (lowerTitle.includes('business') || lowerTitle.includes('stock') || lowerTitle.includes('finance') || lowerTitle.includes('market')) return 'business';
    if (lowerTitle.includes('sport') || lowerTitle.includes('nba') || lowerTitle.includes('nfl') || lowerTitle.includes('soccer')) return 'sports';
    if (lowerTitle.includes('science') || lowerTitle.includes('research')) return 'science';
    if (lowerTitle.includes('health') || lowerTitle.includes('medical')) return 'health';
    if (lowerTitle.includes('entertainment') || lowerTitle.includes('movie') || lowerTitle.includes('music')) return 'entertainment';
    return 'general';
  };

  const fetchNews = useCallback(async (category: string = 'general') => {
    setLoading(prev => ({ ...prev, news: true }));
    try {
      const categoryQuery = category === 'general' ? '' : `&category=${category}`;
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=10${categoryQuery}&apiKey=${NEWS_API_KEY}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(
        data.articles
          .filter((article: any) => article.title && article.description && article.urlToImage && !article.title.includes('[Removed]'))
          .map((article: any) => ({
            ...article,
            category: getCategoryFromTitle(article.title), 
            source: { name: article.source.name || 'Unknown Source' }
          }))
      );
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
    }
    setLoading(prev => ({ ...prev, news: false }));
  }, [NEWS_API_KEY]);

  const fetchSportsData = useCallback(async () => {
    setLoading(prev => ({ ...prev, sports: true }));
    const sportsToFetch = [
      { endpoint: `https://v1.basketball.api-sports.io/games?league=12&season=2023-2024&live=all`, sportType: 'NBA' as const, name: 'NBA'},
      { endpoint: `https://v3.football.api-sports.io/fixtures?live=all&league=39`, sportType: 'SOCCER' as const, name: 'Premier League' }, // EPL
      { endpoint: `https://v3.football.api-sports.io/fixtures?live=all&league=140`, sportType: 'SOCCER' as const, name: 'La Liga' }, // La Liga
    ];
    let allScores: SportsScore[] = [];
    for (const sport of sportsToFetch) {
      try {
        const res = await fetch(sport.endpoint, { headers: { 'x-apisports-key': SPORTS_API_KEY } });
        if (!res.ok) { console.error(`Sports API Error (${sport.name}): ${res.status} ${await res.text()}`); continue; }
        const data = await res.json();
        if (data.response && Array.isArray(data.response)) {
          if (sport.sportType === 'NBA') {
            allScores.push(...data.response.map((game: any): SportsScore => ({
              id: game.id.toString(),
              league: game.league.name || sport.name,
              homeTeam: game.teams.home.name, awayTeam: game.teams.visitors.name,
              homeScore: game.scores.home.points ?? '-', awayScore: game.scores.visitors.points ?? '-',
              status: game.status.long, gameTime: game.status.short === 'HT' ? 'Half Time' : game.status.clock || game.status.short,
              sport: 'NBA'
            })));
          } else if (sport.sportType === 'SOCCER') {
            allScores.push(...data.response.map((game: any): SportsScore => ({
              id: game.fixture.id.toString(),
              league: game.league.name || sport.name,
              homeTeam: game.teams.home.name, awayTeam: game.teams.away.name,
              homeScore: game.goals.home ?? '-', awayScore: game.goals.away ?? '-',
              status: game.fixture.status.long, gameTime: game.fixture.status.elapsed ? `${game.fixture.status.elapsed}'` : game.fixture.status.short,
              sport: 'SOCCER'
            })));
          }
        }
      } catch (error) { console.error(`Error fetching ${sport.name}:`, error); }
    }
    setSports(allScores.slice(0, 6));
    setLoading(prev => ({ ...prev, sports: false }));
  }, [SPORTS_API_KEY]);
  
  const fetchStocks = useCallback(async () => {
    setLoading(prev => ({ ...prev, stocks: true }));
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 'AMZN'];
    const stockPromises = symbols.map(async (symbol) => {
      try {
        const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
        if (!response.ok) throw new Error(`Failed to fetch stock ${symbol}`);
        const data = await response.json();
        return {
          symbol,
          price: data.c ?? 0,
          change: data.d ?? 0,
          changePercent: data.dp ?? 0,
          name: symbol, 
        };
      } catch (error) {
        console.error(error);
        return { symbol, price: 0, change: 0, changePercent: 0, name: symbol };
      }
    });
    setStocks(await Promise.all(stockPromises));
    setLoading(prev => ({ ...prev, stocks: false }));
  }, [FINNHUB_API_KEY]);

  const fetchWeather = useCallback(async () => {
    setLoading(prev => ({ ...prev, weather: true }));
    const cities = ["New York", "London", "Tokyo", "Paris", "Berlin"];
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
        };
      } catch (error) {
        console.error(error);
        return { location: city, temperature: 0, condition: 'N/A' };
      }
    });
    setWeather(await Promise.all(weatherPromises));
    setLoading(prev => ({ ...prev, weather: false }));
  }, [WEATHER_API_KEY]);

  // Effect for initial load and interval refresh of non-news data
  useEffect(() => {
    fetchSportsData();
    fetchStocks();
    fetchWeather();
    const interval = setInterval(() => {
        fetchSportsData();
        fetchStocks();
        fetchWeather();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchSportsData, fetchStocks, fetchWeather]);

  // Effect for fetching news when category changes or on initial load
  useEffect(() => {
    fetchNews(selectedNewsCategory);
  }, [selectedNewsCategory, fetchNews]);

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

  const generateAISummary = (article: NewsItem): string => {
    return `This article, titled "${article.title}", from ${article.source.name}, discusses ${article.description.substring(0,100)}... Key topics include ${article.category}.`;
  };

  const renderSkeletonCard = (className: string = "h-40") => (
    <Card className={`border-neutral-200/70 rounded-lg bg-white shadow-sm p-3 flex flex-col ${className}`}>
        <Skeleton className="w-3/4 h-5 mb-2 rounded" />
        <Skeleton className="w-full h-3 mb-1 rounded" />
        <Skeleton className="w-full h-3 mb-1 rounded" />
        <Skeleton className="w-1/2 h-3 mb-3 rounded" />
        <div className="mt-auto flex justify-between items-center">
            <Skeleton className="w-1/4 h-4 rounded" />
            <Skeleton className="w-1/3 h-6 rounded" />
        </div>
    </Card>
  );

  const GridItem = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
        className={`bg-white border border-neutral-200/70 shadow-sm rounded-lg p-4 ${className || ''}`}
    >
        {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-black p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-2xl font-semibold text-black">Discover Feed</h1>
          <p className="text-sm text-neutral-500">Live insights across news, sports, stocks, and weather.</p>
        </div>
        <div className="flex items-center gap-3">
            <Select value={selectedNewsCategory} onValueChange={(value: string) => setSelectedNewsCategory(value)}>
                <SelectTrigger className="w-full md:w-[180px] text-xs h-9 bg-white border-neutral-200/80 rounded-md shadow-xs">
                    <ListFilter className="w-3.5 h-3.5 mr-1.5 text-neutral-500" />
                    <SelectValue placeholder="Filter news..." />
                </SelectTrigger>
                <SelectContent>
                    {newsCategories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value} className="text-xs">{cat.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={() => fetchNews(selectedNewsCategory)} disabled={Object.values(loading).some(Boolean)} className="border-neutral-200/80 text-neutral-600 hover:text-black rounded-md text-xs h-9">
                <RefreshCw className={`w-3 h-3 mr-1.5 ${Object.values(loading).some(Boolean) ? 'animate-spin' : ''}`} />
                Refresh
            </Button>
        </div>
      </motion.div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,_auto)]">
        {/* News Section (Larger Span) */}
        <GridItem className="md:col-span-2 lg:row-span-2 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-black flex items-center"><Newspaper className="w-4 h-4 mr-2 text-neutral-500"/>Latest News</h2>
            </div>
            {loading.news ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    {Array.from({ length: 4 }).map((_, i) => renderSkeletonCard("h-auto min-h-[150px]"))}
                </div>
            ) : news.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto flex-1 pr-1">
                    {news.map((article, idx) => (
                        <Card key={idx} className="border-neutral-200/70 rounded-lg bg-white shadow-sm p-3 flex flex-col gap-1.5 h-full hover:shadow-md transition-shadow">
                            {article.urlToImage && 
                                <div className="aspect-[16/10] w-full bg-neutral-100 rounded-md overflow-hidden mb-1">
                                    <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover" />
                                </div>
                            }
                            <Badge variant="secondary" className="w-fit text-[8px] uppercase tracking-wider bg-neutral-100 text-neutral-500 border-neutral-200/70 font-medium px-1.5 py-0.5">{article.category || 'General'}</Badge>
                            <p className="font-semibold text-xs text-black line-clamp-2 leading-snug flex-grow">{article.title}</p>
                            <div className="flex items-center justify-between text-[9px] text-neutral-400 mt-auto pt-1 border-t border-neutral-100">
                                <span className="truncate max-w-[60%]">{article.source.name}</span>
                                <span>{formatTimeAgo(article.publishedAt)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1.5 self-start">
                                <Button variant="outline" size="sm" className="border-neutral-200/80 text-neutral-600 hover:text-black rounded-md px-1.5 py-0.5 text-[9px] h-auto" onClick={() => setSelectedNewsArticle(article)}>
                                    AI Summary
                                </Button>
                                <Button variant="outline" size="sm" className="border-neutral-200/80 text-neutral-600 hover:text-black rounded-md px-1.5 py-0.5 text-[9px] h-auto" onClick={() => window.open(article.url, '_blank')}>
                                    Read Article
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : <p className="text-center text-xs text-neutral-400 py-10">No news articles found for this category.</p>}
        </GridItem>

        {/* Sports Scores Section */}
        <GridItem className="lg:col-span-1 flex flex-col">
            <h2 className="text-base font-semibold text-black mb-3 flex items-center"><Trophy className="w-4 h-4 mr-2 text-neutral-500"/>Live Sports</h2>
            {loading.sports ? renderSkeletonCard("min-h-[150px]") :
                sports.length > 0 ? (
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1"> 
                    {sports.map((game) => (
                        <Card key={game.id} className="border-neutral-200/70 rounded-lg bg-white shadow-sm p-2.5">
                            <div className="flex items-center justify-between mb-0.5">
                                <Badge variant="outline" className="text-[8px] border-neutral-200/70 text-neutral-500 font-medium px-1.5 py-0.5">{game.league} ({game.sport})</Badge>
                                <p className="text-[9px] text-neutral-400">{game.gameTime}</p>
                            </div>
                            <div className="flex items-center justify-between gap-1 text-xs">
                                <p className="font-medium text-black truncate w-2/5 text-left">{game.homeTeam}</p>
                                <p className="font-bold text-xs text-black">{game.homeScore} - {game.awayScore}</p>
                                <p className="font-medium text-black truncate w-2/5 text-right">{game.awayTeam}</p>
                            </div>
                            <p className="text-[9px] text-green-600 font-medium mt-1 self-start">{game.status.toUpperCase()}</p>
                        </Card>
                    ))}
                </div>
            ) : <p className="text-center text-xs text-neutral-400 py-10">No live games currently.</p>}
        </GridItem>
        
        {/* Stock Market Section */}
        <GridItem className="lg:col-span-1 flex flex-col">
             <h2 className="text-base font-semibold text-black mb-3 flex items-center"><LineChart className="w-4 h-4 mr-2 text-neutral-500"/>Stock Market</h2>
            {loading.stocks ? renderSkeletonCard("min-h-[150px]") :
            stocks.length > 0 ? (
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1"> 
                    {stocks.map((stock) => (
                        <Card key={stock.symbol} className="border-neutral-200/70 rounded-lg bg-white shadow-sm p-2.5">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-xs text-black truncate">{stock.name} ({stock.symbol})</p>
                                <Badge variant={stock.change >= 0 ? "default" : "destructive"} className={`text-[9px] px-1.5 py-0.5 ${stock.change >=0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}> {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}% </Badge>
                            </div>
                            <div className="flex items-baseline justify-start gap-2 mt-0.5">
                                <p className="font-bold text-base text-black">${stock.price.toFixed(2)}</p>
                                <p className={`text-[10px] font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : <p className="text-center text-xs text-neutral-400 py-10">Stock data unavailable.</p>}
        </GridItem>

        {/* Weather Section (Can span more if needed, or be a single row item) */}
        <GridItem className="md:col-span-2 lg:col-span-4 flex flex-col">
            <h2 className="text-base font-semibold text-black mb-3 flex items-center"><Wind className="w-4 h-4 mr-2 text-neutral-500"/>Weather Outlook</h2>
            {loading.weather ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"><Skeleton className="h-28 rounded-lg" /><Skeleton className="h-28 rounded-lg" /><Skeleton className="h-28 rounded-lg" /><Skeleton className="h-28 rounded-lg" /><Skeleton className="h-28 rounded-lg" /></div>
            ) : weather.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {weather.map((w, idx) => (
                        <Card key={idx} className="border-neutral-200/70 rounded-lg bg-white shadow-sm p-3 text-center flex flex-col justify-center items-center h-full">
                            {w.iconUrl && <img src={w.iconUrl} alt={w.condition} className="w-8 h-8 mx-auto mb-0.5" />}
                            <p className="font-semibold text-xs text-black">{w.location}</p>
                            <p className="text-lg font-bold text-black mt-0.5">{w.temperature}°C</p>
                            <p className="text-[10px] text-neutral-500 mt-0.5">{w.condition}</p>
                        </Card>
                    ))}
                </div>
            ) : <p className="text-center text-xs text-neutral-400 py-10">Weather data unavailable.</p>}
        </GridItem>
      </div>

      {/* News AI Summary Modal - Same as homepage */}
      <AnimatePresence>
        {selectedNewsArticle && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setSelectedNewsArticle(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y:10 }} animate={{ scale: 1, opacity: 1, y:0 }} exit={{ scale: 0.9, opacity: 0, y:10 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-black leading-tight">AI Generated Summary</h3>
                    <Button variant="ghost" size="icon" className="-mr-2 -mt-2 h-7 w-7 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100" onClick={() => setSelectedNewsArticle(null)}>
                        <Zap className="w-4 h-4" /> {/* Or X icon */}
                    </Button>
                </div>
                {selectedNewsArticle.urlToImage && (<img src={selectedNewsArticle.urlToImage} alt={selectedNewsArticle.title} className="w-full h-36 object-cover rounded-lg mb-3 border border-neutral-100" />)}
                <p className="text-xs text-neutral-500 mb-0.5 uppercase tracking-wider">{selectedNewsArticle.source.name}</p>
                <h4 className="text-sm font-medium text-black mb-2 leading-snug">{selectedNewsArticle.title}</h4>
                <div className="bg-neutral-50 border border-neutral-200/70 rounded-md p-3 mb-3">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-black flex-shrink-0" />
                        <p className="text-[11px] font-medium text-black">Key Insights (AI)</p>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed">{generateAISummary(selectedNewsArticle)}</p>
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

export default EnhancedDiscover; 