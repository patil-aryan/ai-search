// Real API integrations for FutureSearch
// Replace mock data with these implementations when you add your API keys

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category?: string;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface SportsGame {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'upcoming';
  time: string;
  league: string;
}

// NEWS API SERVICE
export class NewsService {
  private static readonly BASE_URL = 'https://newsapi.org/v2';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  static async getTopHeadlines(country = 'us', category?: string): Promise<NewsArticle[]> {
    if (!this.API_KEY || this.API_KEY === 'your_news_api_key_here') {
      return this.getMockNews();
    }

    try {
      const categoryParam = category ? `&category=${category}` : '';
      const response = await fetch(
        `${this.BASE_URL}/top-headlines?country=${country}${categoryParam}&apiKey=${this.API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data = await response.json();
      return data.articles.map((article: any, index: number) => ({
        id: `news-${index}`,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source,
        category: category || 'general'
      }));
    } catch (error) {
      console.error('News API error:', error);
      return this.getMockNews();
    }
  }

  static async searchNews(query: string): Promise<NewsArticle[]> {
    if (!this.API_KEY || this.API_KEY === 'your_news_api_key_here') {
      return this.getMockNews();
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${this.API_KEY}`
      );
      
      if (!response.ok) throw new Error('Failed to search news');
      
      const data = await response.json();
      return data.articles.map((article: any, index: number) => ({
        id: `search-${index}`,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: article.source
      }));
    } catch (error) {
      console.error('News search error:', error);
      return this.getMockNews();
    }
  }

  private static getMockNews(): NewsArticle[] {
    return [
      {
        id: "1",
        title: "AI Breakthrough in Medical Diagnosis Announced",
        description: "New AI system achieves 95% accuracy in early cancer detection, revolutionizing healthcare screening processes.",
        url: "https://example.com/ai-medical-breakthrough",
        urlToImage: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop",
        publishedAt: new Date().toISOString(),
        source: { name: "TechHealth" },
        category: "Technology"
      },
      {
        id: "2",
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders commit to accelerated carbon reduction targets, setting new standards for environmental policy.",
        url: "https://example.com/climate-agreement",
        urlToImage: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=400&h=200&fit=crop",
        publishedAt: new Date(Date.now() - 3600000).toISOString(),
        source: { name: "Global News" },
        category: "Environment"
      }
    ];
  }
}

// STOCK MARKET API SERVICE
export class StockService {
  private static readonly ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query';
  private static readonly FINNHUB_URL = 'https://finnhub.io/api/v1';
  private static readonly ALPHA_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY;
  private static readonly FINNHUB_KEY = process.env.NEXT_PUBLIC_FINNHUB_KEY;

  static async getStockQuotes(symbols: string[]): Promise<StockData[]> {
    if (!this.ALPHA_KEY || this.ALPHA_KEY === 'your_alpha_vantage_key_here') {
      return this.getMockStocks();
    }

    try {
      const promises = symbols.map(symbol => this.fetchStockData(symbol));
      const results = await Promise.allSettled(promises);
      
      return results
        .filter((result): result is PromiseFulfilledResult<StockData> => result.status === 'fulfilled')
        .map(result => result.value);
    } catch (error) {
      console.error('Stock API error:', error);
      return this.getMockStocks();
    }
  }

  private static async fetchStockData(symbol: string): Promise<StockData> {
    const response = await fetch(
      `${this.ALPHA_VANTAGE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apiKey=${this.ALPHA_KEY}`
    );
    
    if (!response.ok) throw new Error(`Failed to fetch ${symbol}`);
    
    const data = await response.json();
    const quote = data['Global Quote'];
    
    return {
      symbol: quote['01. Symbol'],
      price: parseFloat(quote['05. Price']),
      change: parseFloat(quote['09. Change']),
      changePercent: parseFloat(quote['10. Change Percent'].replace('%', '')),
      volume: parseInt(quote['06. Volume'])
    };
  }

  private static getMockStocks(): StockData[] {
    return [
      { symbol: "AAPL", price: 185.42, change: 2.34, changePercent: 1.28, volume: 45230000 },
      { symbol: "GOOGL", price: 2435.67, change: -12.45, changePercent: -0.51, volume: 28450000 },
      { symbol: "MSFT", price: 378.92, change: 5.67, changePercent: 1.52, volume: 32100000 },
      { symbol: "TSLA", price: 242.68, change: -8.34, changePercent: -3.33, volume: 54200000 }
    ];
  }
}

// WEATHER API SERVICE
export class WeatherService {
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private static readonly API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  static async getCurrentWeather(city = 'New York'): Promise<WeatherData> {
    if (!this.API_KEY || this.API_KEY === 'your_weather_api_key_here') {
      return this.getMockWeather();
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather');
      
      const data = await response.json();
      
      return {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6) // Convert m/s to km/h
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getMockWeather();
    }
  }

  static async getWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
    if (!this.API_KEY || this.API_KEY === 'your_weather_api_key_here') {
      return this.getMockWeather();
    }

    try {
      const response = await fetch(
        `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
      );
      
      if (!response.ok) throw new Error('Failed to fetch weather');
      
      const data = await response.json();
      
      return {
        location: data.name,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6)
      };
    } catch (error) {
      console.error('Weather API error:', error);
      return this.getMockWeather();
    }
  }

  private static getMockWeather(): WeatherData {
    return {
      location: "New York",
      temperature: 22,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12
    };
  }
}

// SPORTS API SERVICE
export class SportsService {
  private static readonly ESPN_URL = 'https://site.api.espn.com/apis/site/v2/sports';
  private static readonly THESPORTSDB_URL = 'https://www.thesportsdb.com/api/v1/json/3';

  static async getLiveScores(): Promise<SportsGame[]> {
    try {
      // ESPN API is free but can be unreliable
      const nflScores = await this.fetchESPNScores('football', 'nfl');
      const nbaScores = await this.fetchESPNScores('basketball', 'nba');
      
      return [...nflScores, ...nbaScores];
    } catch (error) {
      console.error('Sports API error:', error);
      return this.getMockSports();
    }
  }

  private static async fetchESPNScores(sport: string, league: string): Promise<SportsGame[]> {
    try {
      const response = await fetch(`${this.ESPN_URL}/${sport}/${league}/scoreboard`);
      if (!response.ok) throw new Error(`Failed to fetch ${league} scores`);
      
      const data = await response.json();
      
      return data.events?.map((event: any, index: number) => ({
        id: `${league}-${index}`,
        sport: league.toUpperCase(),
        homeTeam: event.competitions[0].competitors.find((c: any) => c.homeAway === 'home')?.team.shortDisplayName || 'Home',
        awayTeam: event.competitions[0].competitors.find((c: any) => c.homeAway === 'away')?.team.shortDisplayName || 'Away',
        homeScore: parseInt(event.competitions[0].competitors.find((c: any) => c.homeAway === 'home')?.score || '0'),
        awayScore: parseInt(event.competitions[0].competitors.find((c: any) => c.homeAway === 'away')?.score || '0'),
        status: event.status.type.completed ? 'finished' : (event.status.type.id === '2' ? 'live' : 'upcoming'),
        time: event.status.displayClock || event.date,
        league: league.toUpperCase()
      })) || [];
    } catch (error) {
      console.error(`Error fetching ${league} scores:`, error);
      return [];
    }
  }

  private static getMockSports(): SportsGame[] {
    return [
      {
        id: "1",
        sport: "NFL",
        homeTeam: "Chiefs",
        awayTeam: "Bills",
        homeScore: 21,
        awayScore: 14,
        status: "live",
        time: "Q3 8:42",
        league: "NFL"
      },
      {
        id: "2",
        sport: "NBA",
        homeTeam: "Lakers",
        awayTeam: "Warriors",
        homeScore: 98,
        awayScore: 102,
        status: "live",
        time: "Q4 2:15",
        league: "NBA"
      }
    ];
  }
}

// RATE LIMITING UTILITY
export class RateLimiter {
  private static requests: Map<string, number[]> = new Map();

  static canMakeRequest(service: string, maxRequests: number, timeWindow: number): boolean {
    const now = Date.now();
    const serviceRequests = this.requests.get(service) || [];
    
    // Remove old requests outside time window
    const validRequests = serviceRequests.filter(time => now - time < timeWindow);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(service, validRequests);
    return true;
  }
}

// USAGE EXAMPLES:
/*
// In your components:

// Load news
const news = await NewsService.getTopHeadlines('us', 'technology');

// Load stocks  
const stocks = await StockService.getStockQuotes(['AAPL', 'GOOGL', 'MSFT', 'TSLA']);

// Load weather
const weather = await WeatherService.getCurrentWeather('New York');

// Load sports
const scores = await SportsService.getLiveScores();

// With rate limiting
if (RateLimiter.canMakeRequest('news', 100, 3600000)) { // 100 requests per hour
  const news = await NewsService.getTopHeadlines();
}
*/ 