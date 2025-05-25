"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Clock, Globe, Zap, BookOpen, Video, Image as ImageIcon, Users, Sun, Cloud, CloudRain, Wind, Trophy, Activity, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
  category?: string;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon?: string;
  humidity?: number;
  windSpeed?: number;
  description?: string;
}

interface SportsEvent {
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
}

const DiscoverPage = () => {
  const [activeTab, setActiveTab] = useState("trending");
  const [news, setNews] = useState<NewsItem[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [sports, setSports] = useState<SportsEvent[]>([]);
  const [loading, setLoading] = useState({
    news: true,
    weather: true,
    sports: true
  });
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsItem | null>(null);

  // API Keys
  const NEWS_API_KEY = "95e671056a9049fc9b1f3781faacc5e7";
  const WEATHER_API_KEY = "4908931555f941dfd2851f15bf284f23";

  const trendingTopics = [
    { title: "AI Revolution 2024", category: "Technology", engagement: "2.3M", trend: "+15%" },
    { title: "Climate Change Solutions", category: "Environment", engagement: "1.8M", trend: "+8%" },
    { title: "Space Exploration Updates", category: "Science", engagement: "1.2M", trend: "+12%" },
    { title: "Cryptocurrency Market", category: "Finance", engagement: "3.1M", trend: "+22%" },
    { title: "Health & Wellness Trends", category: "Health", engagement: "950K", trend: "+5%" },
    { title: "Gaming Industry News", category: "Gaming", engagement: "1.5M", trend: "+18%" },
  ];

  const categories = [
    { name: "Technology", icon: Zap, color: "from-blue-500 to-cyan-500", count: "1.2K" },
    { name: "Science", icon: BookOpen, color: "from-green-500 to-emerald-500", count: "856" },
    { name: "Entertainment", icon: Video, color: "from-purple-500 to-pink-500", count: "2.1K" },
    { name: "Sports", icon: Users, color: "from-orange-500 to-red-500", count: "1.8K" },
    { name: "Health", icon: Globe, color: "from-teal-500 to-blue-500", count: "934" },
    { name: "Business", icon: TrendingUp, color: "from-yellow-500 to-orange-500", count: "1.5K" },
  ];

  // Fetch real news data
  const fetchNews = async () => {
    setLoading(prev => ({ ...prev, news: true }));
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
          category: article.category || 'General'
        }));
      
      setNews(filteredNews);
    } catch (error) {
      console.error("News fetch error:", error);
      setNews([]);
    }
    setLoading(prev => ({ ...prev, news: false }));
  };

  // Fetch real weather data
  const fetchWeather = async () => {
    setLoading(prev => ({ ...prev, weather: true }));
    try {
      const cities = ["London", "New York", "Tokyo", "Paris", "Sydney"];
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
            windSpeed: Math.round(data.wind.speed),
            description: data.weather[0].description
          };
        } catch (error) {
          console.error(`Weather error for ${city}:`, error);
          return null;
        }
      });
      
      const weatherData = (await Promise.all(weatherPromises)).filter(Boolean) as WeatherData[];
      setWeather(weatherData);
    } catch (error) {
      console.error("Weather fetch error:", error);
      setWeather([]);
    }
    setLoading(prev => ({ ...prev, weather: false }));
  };

  // Fetch sports data
  const fetchSports = async () => {
    setLoading(prev => ({ ...prev, sports: true }));
    try {
      // Mock sports data since API might require subscription
      const mockSports: SportsEvent[] = [
        { 
          id: '1', 
          league: 'NBA', 
          match: 'Lakers vs Warriors', 
          homeTeam: 'Lakers', 
          awayTeam: 'Warriors', 
          homeScore: 108, 
          awayScore: 115, 
          status: 'Finished', 
          gameTime: '2 hours ago', 
          sportType: 'NBA',
          venue: 'Crypto.com Arena'
        },
        { 
          id: '2', 
          league: 'Champions League', 
          match: 'Barcelona vs PSG', 
          homeTeam: 'Barcelona', 
          awayTeam: 'PSG', 
          homeScore: 2, 
          awayScore: 1, 
          status: 'Live', 
          gameTime: "78'", 
          sportType: 'SOCCER',
          venue: 'Camp Nou'
        },
        { 
          id: '3', 
          league: 'NFL', 
          match: 'Chiefs vs Bills', 
          homeTeam: 'Chiefs', 
          awayTeam: 'Bills', 
          homeScore: 14, 
          awayScore: 21, 
          status: 'Q3 08:45', 
          gameTime: 'Live', 
          sportType: 'NFL',
          venue: 'Arrowhead Stadium'
        },
        { 
          id: '4', 
          league: 'Premier League', 
          match: 'Arsenal vs Chelsea', 
          homeTeam: 'Arsenal', 
          awayTeam: 'Chelsea', 
          homeScore: 0, 
          awayScore: 0, 
          status: 'Upcoming', 
          gameTime: 'Tomorrow 3:00 PM', 
          sportType: 'SOCCER',
          venue: 'Emirates Stadium'
        }
      ];
      setSports(mockSports);
    } catch (error) {
      console.error("Sports fetch error:", error);
      setSports([]);
    }
    setLoading(prev => ({ ...prev, sports: false }));
  };

  useEffect(() => {
    fetchNews();
    fetchWeather();
    fetchSports();
    
    // Refresh data every 5 minutes
    const interval = setInterval(() => {
      fetchNews();
      fetchWeather();
      fetchSports();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("clear") || lowerCondition.includes("sun")) {
      return <Sun className="w-5 h-5 text-yellow-500" />;
    }
    if (lowerCondition.includes("cloud")) {
      return <Cloud className="w-5 h-5 text-gray-400" />;
    }
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    }
    return <Sun className="w-5 h-5 text-yellow-500" />;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#1a1f2e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#24A0ED] to-white bg-clip-text text-transparent mb-2">
            Discover
          </h1>
          <p className="text-white/60 text-lg">Explore trending topics, latest news, weather, and sports updates</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-[#1a1f2e] p-1 rounded-xl border border-[#23272f]">
          {[
            { id: "trending", label: "Trending", icon: TrendingUp },
            { id: "news", label: "Latest News", icon: Clock },
            { id: "categories", label: "Categories", icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#24A0ED] to-[#1a8fd1] text-white shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-[#23272f]"
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === "trending" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f] hover:border-[#24A0ED]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#24A0ED]/10 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-medium text-[#24A0ED] bg-[#24A0ED]/10 px-3 py-1 rounded-full">
                    {topic.category}
                  </span>
                  <span className="text-green-400 text-sm font-medium flex items-center">
                    <TrendingUp size={14} className="mr-1" />
                    {topic.trend}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-[#24A0ED] transition-colors">
                  {topic.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{topic.engagement} discussions</span>
                  <span>Trending now</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "news" && (
          <div className="space-y-8">
            {/* Live News Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-[#24A0ED]" />
                  Live News Updates
                </h2>
                <Button
                  onClick={fetchNews}
                  variant="outline"
                  size="sm"
                  className="border-[#24A0ED]/30 text-[#24A0ED] hover:bg-[#24A0ED]/10"
                  disabled={loading.news}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading.news ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
              {loading.news ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] rounded-xl border border-[#23272f] animate-pulse">
                      <div className="aspect-video bg-[#24A0ED]/10 rounded-t-xl"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-[#24A0ED]/10 rounded w-1/4"></div>
                        <div className="h-6 bg-[#24A0ED]/10 rounded w-3/4"></div>
                        <div className="h-4 bg-[#24A0ED]/10 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {news.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] rounded-xl border border-[#23272f] hover:border-[#24A0ED]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#24A0ED]/10 cursor-pointer group overflow-hidden"
                      onClick={() => setSelectedNewsArticle(item)}
                    >
                      {item.urlToImage && (
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={item.urlToImage} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-[#24A0ED] bg-[#24A0ED]/10 px-3 py-1 rounded-full">
                            {item.category}
                          </span>
                          <span className="text-white/60 text-sm">{formatTimeAgo(item.publishedAt)}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-[#24A0ED] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-white/60 text-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/40 text-sm">{item.source.name}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-[#24A0ED]/30 text-[#24A0ED] hover:bg-[#24A0ED]/10 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(item.url, '_blank');
                            }}
                          >
                            Read more
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f] hover:border-[#24A0ED]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#24A0ED]/10 cursor-pointer group text-center"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-[#24A0ED] transition-colors">
                  {category.name}
                </h3>
                <p className="text-white/60 text-sm">{category.count} topics</p>
              </div>
            ))}
          </div>
        )}

        {/* Weather and Sports Section - Fixed Layout */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weather Section */}
          <div className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Sun className="w-5 h-5 mr-2 text-[#24A0ED]" />
                Global Weather
              </h2>
              <Button
                onClick={fetchWeather}
                variant="outline"
                size="sm"
                className="border-[#24A0ED]/30 text-[#24A0ED] hover:bg-[#24A0ED]/10"
                disabled={loading.weather}
              >
                <RefreshCw className={`w-4 h-4 ${loading.weather ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {loading.weather ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#24A0ED]/5 p-4 rounded-lg animate-pulse">
                    <div className="h-4 bg-[#24A0ED]/10 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-[#24A0ED]/10 rounded w-1/3 mb-1"></div>
                    <div className="h-3 bg-[#24A0ED]/10 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {weather.map((cityWeather, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-[#24A0ED]/5 p-4 rounded-lg hover:bg-[#24A0ED]/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getWeatherIcon(cityWeather.condition)}
                        <span className="font-medium text-white">{cityWeather.location}</span>
                      </div>
                      <span className="text-2xl font-bold text-[#24A0ED]">{cityWeather.temperature}°C</span>
                    </div>
                    <p className="text-sm text-white/60 capitalize mb-2">{cityWeather.description || cityWeather.condition}</p>
                    {cityWeather.humidity && cityWeather.windSpeed && (
                      <div className="flex items-center justify-between text-xs text-white/50">
                        <span className="flex items-center">
                          <Activity className="w-3 h-3 mr-1" />
                          {cityWeather.humidity}% humidity
                        </span>
                        <span className="flex items-center">
                          <Wind className="w-3 h-3 mr-1" />
                          {cityWeather.windSpeed} m/s
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Sports Section */}
          <div className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-[#24A0ED]" />
                Sports Updates
              </h2>
              <Button
                onClick={fetchSports}
                variant="outline"
                size="sm"
                className="border-[#24A0ED]/30 text-[#24A0ED] hover:bg-[#24A0ED]/10"
                disabled={loading.sports}
              >
                <RefreshCw className={`w-4 h-4 ${loading.sports ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {loading.sports ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-[#24A0ED]/5 p-4 rounded-lg animate-pulse">
                    <div className="h-3 bg-[#24A0ED]/10 rounded w-1/4 mb-2"></div>
                    <div className="h-5 bg-[#24A0ED]/10 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-[#24A0ED]/10 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sports.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-[#24A0ED]/5 p-4 rounded-lg hover:bg-[#24A0ED]/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#24A0ED] bg-[#24A0ED]/10 px-2 py-1 rounded">
                        {event.league}
                      </span>
                      <Badge
                        variant={
                          event.status.toLowerCase().includes('live') ? 'destructive' :
                          event.status.toLowerCase().includes('upcoming') ? 'secondary' : 'outline'
                        }
                        className="text-xs"
                      >
                        {event.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-white mb-2">{event.homeTeam} vs {event.awayTeam}</h4>
                    {(event.status.toLowerCase().includes('live') || event.status.toLowerCase().includes('finished')) && (
                      <div className="text-2xl font-bold text-[#24A0ED] mb-2">
                        {event.homeScore} - {event.awayScore}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>{event.gameTime}</span>
                      {event.venue && <span>{event.venue}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* News Article Modal */}
      <AnimatePresence>
        {selectedNewsArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedNewsArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#23272f]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white leading-tight flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-[#24A0ED]" />
                      Article Preview
                    </h3>
                    <p className="text-xs text-white/60 mt-1">Click to read full article</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-[#24A0ED]/10"
                    onClick={() => setSelectedNewsArticle(null)}
                  >
                    ×
                  </Button>
                </div>
                
                {selectedNewsArticle.urlToImage && (
                  <img 
                    src={selectedNewsArticle.urlToImage} 
                    alt={selectedNewsArticle.title} 
                    className="w-full h-48 object-cover rounded-lg mb-4 border border-[#23272f]" 
                  />
                )}
                
                <p className="text-xs text-[#24A0ED] mb-1 uppercase tracking-wider">
                  {selectedNewsArticle.source.name}
                </p>
                <h4 className="text-base font-medium text-white mb-3 leading-snug">
                  {selectedNewsArticle.title}
                </h4>
                <p className="text-sm text-white/80 mb-4 leading-relaxed">
                  {selectedNewsArticle.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    className="w-full sm:w-auto flex-1 bg-[#24A0ED] text-white hover:bg-[#1a8fd1] rounded-lg"
                    onClick={() => {
                      window.open(selectedNewsArticle.url, '_blank');
                      setSelectedNewsArticle(null);
                    }}
                  >
                    Read Full Article
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex-1 border-[#24A0ED]/30 text-[#24A0ED] hover:bg-[#24A0ED]/10 rounded-lg"
                    onClick={() => setSelectedNewsArticle(null)}
                  >
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

export default DiscoverPage; 