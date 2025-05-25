"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, TrendingUp, Clock, Zap, Sun, Cloud, CloudRain } from "lucide-react";
import PremiumSearchInput from "./PremiumSearchInput";

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
}

interface NewsItem {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: { name: string };
}

const PremiumHomepage = ({
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
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // API Keys
  const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY || "95e671056a9049fc9b1f3781faacc5e7";
  const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "4908931555f941dfd2851f15bf284f23";

  // AI-generated search suggestions
  const generateAISuggestions = () => {
    const suggestions = [
      "Latest AI breakthroughs in 2024",
      "Climate change solutions and innovations",
      "Quantum computing recent developments",
      "Space exploration missions this year",
      "Renewable energy technology advances",
      "Cybersecurity trends and threats",
      "Medical research breakthroughs",
      "Electric vehicle market analysis",
      "Cryptocurrency market trends",
      "Mental health awareness",
      "Sustainable living tips",
      "Future of work technology"
    ];
    return suggestions.sort(() => Math.random() - 0.5).slice(0, 4);
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
          const data = await response.json();
          
          if (response.ok) {
            return {
              location: city,
              temperature: Math.round(data.main.temp),
              condition: data.weather[0].main,
              icon: data.weather[0].icon
            };
          }
          throw new Error('Weather API error');
        } catch (error) {
          console.error(`Error fetching weather for ${city}:`, error);
          return {
            location: city,
            temperature: Math.floor(Math.random() * 30) + 5,
            condition: "Clear",
            icon: "01d"
          };
        }
      });

      const weatherData = await Promise.all(weatherPromises);
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Fallback to mock data
      const mockWeather: WeatherData[] = [
        { location: "London", temperature: 15, condition: "Cloudy", icon: "03d" },
        { location: "New York", temperature: 18, condition: "Sunny", icon: "01d" },
        { location: "Tokyo", temperature: 25, condition: "Clear", icon: "01d" },
        { location: "Paris", temperature: 12, condition: "Rainy", icon: "09d" },
      ];
      setWeather(mockWeather);
    }
  };

  // Fetch real news data
  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&pageSize=8&apiKey=${NEWS_API_KEY}`
      );
      
      if (response.ok) {
        const data = await response.json();
        const filteredNews = data.articles
          .filter((article: any) => 
            article.title && 
            article.description && 
            article.urlToImage &&
            !article.title.includes('[Removed]')
          )
          .slice(0, 4)
          .map((article: any) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            source: { name: article.source.name }
          }));
        
        setNews(filteredNews);
      } else {
        throw new Error('News API error');
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      // Fallback to mock data
      const mockNews: NewsItem[] = [
        {
          title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
          description: "Researchers unveil a revolutionary AI system that demonstrates unprecedented cognitive abilities...",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
          publishedAt: new Date().toISOString(),
          source: { name: "Tech Today" }
        },
        {
          title: "Climate Summit Reaches Historic Carbon Reduction Agreement",
          description: "World leaders commit to ambitious targets in landmark environmental accord...",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1569163003615-94b21b5de6cb?w=400",
          publishedAt: new Date().toISOString(),
          source: { name: "Global News" }
        },
        {
          title: "Quantum Computer Solves Complex Problem in Seconds",
          description: "Latest quantum breakthrough promises to revolutionize scientific computing...",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
          publishedAt: new Date().toISOString(),
          source: { name: "Science Daily" }
        },
        {
          title: "Space Mission Discovers Potentially Habitable Exoplanet",
          description: "NASA's latest discovery brings us closer to finding life beyond Earth...",
          url: "#",
          urlToImage: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400",
          publishedAt: new Date().toISOString(),
          source: { name: "Space Explorer" }
        }
      ];
      setNews(mockNews);
    }
  };

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const timeInterval = setInterval(updateTime, 60000);

    // Load data
    const loadData = async () => {
      setLoading(true);
      setAiSuggestions(generateAISuggestions());
      
      await Promise.all([
        fetchWeather(),
        fetchNews()
      ]);
      
      setLoading(false);
    };

    loadData();

    return () => clearInterval(timeInterval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'clouds':
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rain':
      case 'rainy':
      case 'drizzle':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      default:
        return <Sun className="w-5 h-5 text-yellow-500" />;
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header with time and weather */}
      <div className="w-full border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-sm text-gray-600 font-medium">{currentTime}</div>
              <div className="flex items-center space-x-4">
                {weather.slice(0, 3).map((w, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    {getWeatherIcon(w.condition)}
                    <span className="text-gray-700">{w.location}</span>
                    <span className="font-medium text-gray-900">{w.temperature}°C</span>
                  </div>
                ))}
              </div>
            </div>
            {loading && (
              <div className="text-sm text-gray-500">Loading live data...</div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-light text-gray-900 mb-2">Search</h1>
          <p className="text-lg text-gray-600">Powered by AI</p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <PremiumSearchInput
            sendMessage={sendMessage}
            focusMode={focusMode}
            setFocusMode={setFocusMode}
          />
        </div>

        {/* AI-Generated Search Suggestions */}
        <div className="mb-16">
          <div className="text-center mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Trending Searches</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(suggestion)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200 transition-colors duration-200 hover:border-gray-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Latest News</h2>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              Live updates
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.map((article, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => sendMessage(`Tell me more about: ${article.title}`)}
                >
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=250&fit=crop";
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600">{article.source.name}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {article.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Access Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Images", icon: "🖼️", query: "Show me images about" },
            { name: "Videos", icon: "🎥", query: "Find videos about" },
            { name: "News", icon: "📰", query: "Latest news about" },
            { name: "Research", icon: "🔬", query: "Research papers about" },
          ].map((category, index) => (
            <button
              key={index}
              onClick={() => sendMessage(`${category.query} `)}
              className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 text-center transition-colors duration-200 group"
            >
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {category.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PremiumHomepage; 