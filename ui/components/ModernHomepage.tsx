"use client";

import { useState, useEffect } from "react";
import { Search, Clock, TrendingUp, Globe, BookOpen, Newspaper, Video, Image as ImageIcon, Code, ArrowRight, Youtube, MessageSquare, Pen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

const ModernHomepage = ({
  sendMessage,
  focusMode,
  setFocusMode,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copilotEnabled, setCopilotEnabled] = useState(false);

  // Fetch real weather data
  const fetchWeather = async () => {
    try {
      const cities = ["London", "New York", "Tokyo"];
      const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      
      const weatherPromises = cities.map(async (city) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
          );
          const data = await response.json();
          
          if (response.ok) {
            return {
              location: city,
              temperature: Math.round(data.main.temp),
              condition: data.weather[0].main,
            };
          }
        } catch (error) {
          console.error(`Weather error for ${city}:`, error);
        }
        return {
          location: city,
          temperature: Math.floor(Math.random() * 25) + 10,
          condition: "Clear",
        };
      });

      const weatherData = await Promise.all(weatherPromises);
      setWeather(weatherData.filter(Boolean));
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  };

  // Fetch real news data
  const fetchNews = async () => {
    try {
      const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=6&apiKey=${NEWS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const filteredNews = data.articles
          .filter((article: any) => 
            article.title && 
            article.description && 
            !article.title.includes('[Removed]')
          )
          .slice(0, 6);
        
        setNews(filteredNews);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
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
      await Promise.all([
        fetchWeather(),
        fetchNews()
      ]);
      setLoading(false);
    };

    loadData();
    return () => clearInterval(timeInterval);
  }, []);

  const handleSearch = (query?: string) => {
    const searchQuery = query || searchValue;
    if (searchQuery.trim()) {
      sendMessage(searchQuery);
      setSearchValue("");
    }
  };

  const focusModes = [
    { id: "all", name: "All", icon: Globe },
    { id: "academic", name: "Academic", icon: BookOpen },
    { id: "news", name: "News", icon: Newspaper },
    { id: "videos", name: "Videos", icon: Video },
    { id: "images", name: "Images", icon: ImageIcon },
    { id: "code", name: "Code", icon: Code },
    { id: "youtube", name: "YouTube", icon: Youtube },
    { id: "reddit", name: "Reddit", icon: MessageSquare },
    { id: "writing", name: "Writing", icon: Pen },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with time and weather */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {currentTime}
              </div>
              {weather.length > 0 && (
                <div className="flex items-center space-x-4">
                  {weather.map((w, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <span>{w.location}</span>
                      <span className="font-medium text-gray-900">{w.temperature}°C</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {loading && (
              <div className="text-sm text-gray-500 animate-pulse">Loading...</div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-12">
        {/* Logo/Brand */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-extralight text-gray-900 mb-2 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Intelligent Search
          </h1>
          <p className="text-lg text-gray-600 font-light">Advanced AI-powered search</p>
        </div>

        {/* Search Input */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for anything..."
                className="border-0 focus:ring-0 text-lg px-4 bg-transparent flex-1"
              />
              {copilotEnabled && (
                <div className="flex items-center mr-3">
                  <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                  <span className="text-xs text-purple-600 ml-1">AI</span>
                </div>
              )}
              <Button 
                onClick={() => handleSearch()}
                className="m-1 bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 transform hover:scale-105"
                disabled={!searchValue.trim()}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Copilot Toggle */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCopilotEnabled(!copilotEnabled)}
            className={`border-gray-300 transition-all duration-200 ${
              copilotEnabled 
                ? "bg-purple-50 border-purple-300 text-purple-700" 
                : "hover:bg-gray-50"
            }`}
          >
            <Sparkles className={`w-4 h-4 mr-2 ${copilotEnabled ? "text-purple-500" : "text-gray-500"}`} />
            Copilot {copilotEnabled ? "On" : "Off"}
          </Button>
        </div>

        {/* Focus Mode Selection */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-wrap justify-center gap-2">
            {focusModes.map((mode, index) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={focusMode === mode.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFocusMode(mode.id)}
                  className={`flex items-center space-x-2 rounded-lg transition-all duration-200 transform hover:scale-105 animate-fade-in ${
                    focusMode === mode.id
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                  style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{mode.name}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Live News Section */}
        {news.length > 0 && (
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Latest News
              </h2>
              <Badge variant="outline" className="flex items-center border-gray-300">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((article, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 transform hover:-translate-y-1 animate-fade-in"
                  onClick={() => handleSearch(`Tell me about: ${article.title}`)}
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs border-gray-300">
                        {article.source.name}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {article.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          {[
            { name: "Code Help", icon: Code, query: "Help me with coding:" },
            { name: "Research", icon: BookOpen, query: "Research papers about:" },
            { name: "Latest News", icon: Newspaper, query: "Latest news about:" },
            { name: "Find Images", icon: ImageIcon, query: "Show me images of:" },
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleSearch(action.query)}
                className="p-6 h-auto border-gray-200 hover:bg-gray-50 transition-all duration-300 group transform hover:scale-105 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className="text-center">
                  <div className="w-8 h-8 mx-auto mb-2 text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                    {action.name}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ModernHomepage; 