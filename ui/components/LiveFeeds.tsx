"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Trophy,
  Clock,
  RefreshCw,
  DollarSign,
  BarChart3,
  Zap,
  Target,
  Calendar,
  Users,
  Sparkles,
  ChevronRight,
  Play,
  Pause,
  Bitcoin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface SportsScore {
  id: string;
  sport: 'football' | 'basketball' | 'baseball' | 'soccer' | 'tennis';
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'upcoming';
  time: string;
  league: string;
  quarter?: string;
  lastUpdate: Date;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  rank: number;
  aiInsight?: string;
  lastUpdate: Date;
}

interface StockData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  aiInsight?: string;
  lastUpdate: Date;
}

interface LiveFeedsProps {
  className?: string;
}

const sportConfig = {
  football: { icon: Target, label: "NFL", color: "bg-green-100 text-green-700" },
  basketball: { icon: Target, label: "NBA", color: "bg-orange-100 text-orange-700" },
  baseball: { icon: Target, label: "MLB", color: "bg-blue-100 text-blue-700" },
  soccer: { icon: Target, label: "Soccer", color: "bg-red-100 text-red-700" },
  tennis: { icon: Target, label: "Tennis", color: "bg-purple-100 text-purple-700" }
};

const LiveFeeds: React.FC<LiveFeedsProps> = ({ className }) => {
  const [sportsData, setSportsData] = useState<SportsScore[]>([]);
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("sports");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchLiveData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchLiveData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchLiveData = async () => {
    setLoading(true);
    try {
      // Simulate API calls - in real implementation, these would fetch from live APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock Sports Data
      const mockSports: SportsScore[] = [
        {
          id: "1",
          sport: "football",
          homeTeam: "Chiefs",
          awayTeam: "Bills",
          homeScore: 21,
          awayScore: 14,
          status: "live",
          time: "Q3 8:42",
          league: "NFL",
          quarter: "3rd Quarter",
          lastUpdate: new Date()
        },
        {
          id: "2",
          sport: "basketball",
          homeTeam: "Lakers",
          awayTeam: "Warriors",
          homeScore: 98,
          awayScore: 102,
          status: "live",
          time: "Q4 2:15",
          league: "NBA",
          quarter: "4th Quarter",
          lastUpdate: new Date()
        },
        {
          id: "3",
          sport: "soccer",
          homeTeam: "Arsenal",
          awayTeam: "Chelsea",
          homeScore: 2,
          awayScore: 1,
          status: "live",
          time: "78'",
          league: "Premier League",
          lastUpdate: new Date()
        }
      ];      // Mock Stock Data with AI insights
      const mockStocks: StockData[] = [
        {
          id: "1",
          symbol: "AAPL",
          name: "Apple Inc.",
          price: 185.42,
          change: 2.34,
          changePercent: 1.28,
          volume: 45230000,
          marketCap: "2.89T",
          aiInsight: "Strong momentum following iPhone 15 launch. Technical indicators suggest continued upward trend.",
          lastUpdate: new Date()
        },
        {
          id: "2",
          symbol: "TSLA",
          name: "Tesla Inc.",
          price: 242.68,
          change: -5.12,
          changePercent: -2.07,
          volume: 38450000,
          marketCap: "771B",
          aiInsight: "Temporary pullback after recent highs. Support level at $240 remains strong.",
          lastUpdate: new Date()
        },
        {
          id: "3",
          symbol: "NVDA",
          name: "NVIDIA Corp.",
          price: 456.78,
          change: 12.45,
          changePercent: 2.80,
          volume: 52100000,
          marketCap: "1.12T",
          aiInsight: "AI chip demand driving growth. Bullish sentiment continues with strong institutional buying.",
          lastUpdate: new Date()
        },
        {
          id: "4",
          symbol: "MSFT",
          name: "Microsoft Corp.",
          price: 378.92,
          change: 1.87,
          changePercent: 0.50,
          volume: 28900000,
          marketCap: "2.81T",
          aiInsight: "Steady growth in cloud services. Azure revenue up 29% YoY, maintaining competitive edge.",
          lastUpdate: new Date()
        }
      ];

      // Mock Crypto Data with AI insights
      const mockCrypto: CryptoData[] = [
        {
          id: "1",
          symbol: "BTC",
          name: "Bitcoin",
          price: 43250.82,
          change: 1875.45,
          changePercent: 4.54,
          volume: 28450000000,
          marketCap: "845B",
          rank: 1,
          aiInsight: "Breaking above $43K resistance. Institutional adoption driving demand. Watch for continuation above $44K.",
          lastUpdate: new Date()
        },
        {
          id: "2",
          symbol: "ETH",
          name: "Ethereum",
          price: 2645.33,
          change: -87.12,
          changePercent: -3.19,
          volume: 15230000000,
          marketCap: "318B",
          rank: 2,
          aiInsight: "Consolidating after recent upgrade. DeFi activity remains strong. Support at $2600 level.",
          lastUpdate: new Date()
        },
        {
          id: "3",
          symbol: "BNB",
          name: "Binance Coin",
          price: 308.45,
          change: 12.67,
          changePercent: 4.28,
          volume: 892000000,
          marketCap: "47B",
          rank: 3,
          aiInsight: "Benefiting from increased exchange volume. Strong correlation with overall crypto market sentiment.",
          lastUpdate: new Date()
        },
        {
          id: "4",
          symbol: "SOL",
          name: "Solana",
          price: 95.78,
          change: 3.45,
          changePercent: 3.74,
          volume: 2450000000,
          marketCap: "41B",
          rank: 4,
          aiInsight: "Network improvements driving adoption. DeFi ecosystem expansion continues to attract developers.",
          lastUpdate: new Date()
        }
      ];

      setSportsData(mockSports);
      setStocksData(mockStocks);
      setCryptoData(mockCrypto);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch live data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Live Feeds</h2>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center space-x-2"
          >
            {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{autoRefresh ? "Pause" : "Resume"}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveData}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="sports" className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Sports Scores</span>
          </TabsTrigger>
          <TabsTrigger value="stocks" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Stock Market</span>
          </TabsTrigger>
          <TabsTrigger value="crypto" className="flex items-center space-x-2">
            <Bitcoin className="w-4 h-4" />
            <span>Crypto Market</span>
          </TabsTrigger>
        </TabsList>

        {/* Sports Tab */}
        <TabsContent value="sports" className="mt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {sportsData.map((game, index) => (
                  <SportsCard key={game.id} game={game} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>        {/* Stocks Tab */}
        <TabsContent value="stocks" className="mt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {stocksData.map((stock, index) => (
                  <StockCard key={stock.id} stock={stock} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Crypto Tab */}
        <TabsContent value="crypto" className="mt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {cryptoData.map((crypto, index) => (
                  <CryptoCard key={crypto.id} crypto={crypto} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Sports Card Component
const SportsCard: React.FC<{ game: SportsScore; index: number }> = ({ game, index }) => {
  const config = sportConfig[game.sport];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={cn("p-2 rounded-lg", config.color)}>
              <Icon className="w-4 h-4" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="secondary">{config.label}</Badge>
                <Badge 
                  variant={game.status === "live" ? "default" : "outline"}
                  className={game.status === "live" ? "bg-red-600 text-white animate-pulse" : ""}
                >
                  {game.status === "live" ? "LIVE" : game.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-600">
                {game.time} • {game.league}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-medium text-gray-900">{game.awayTeam}</div>
                <div className="text-2xl font-bold text-gray-900">{game.awayScore}</div>
              </div>
              
              <div className="text-gray-400 font-medium">vs</div>
              
              <div className="text-right">
                <div className="font-medium text-gray-900">{game.homeTeam}</div>
                <div className="text-2xl font-bold text-gray-900">{game.homeScore}</div>
              </div>
            </div>
            
            {game.quarter && (
              <div className="text-xs text-gray-500 mt-1">{game.quarter}</div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Stock Card Component
const StockCard: React.FC<{ stock: StockData; index: number }> = ({ stock, index }) => {
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={cn(
              "p-2 rounded-lg",
              isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                <Badge variant="outline" className="text-xs">
                  {stock.marketCap}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{stock.name}</p>
              
              {stock.aiInsight && (
                <div className="bg-blue-50 rounded-lg p-3 mb-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">AI Insight</span>
                  </div>
                  <p className="text-xs text-blue-700">{stock.aiInsight}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3" />
                  <span>Vol: {formatVolume(stock.volume)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{stock.lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${stock.price.toFixed(2)}
            </div>
            
            <div className={cn(
              "flex items-center space-x-1 text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Crypto Card Component
const CryptoCard: React.FC<{ crypto: CryptoData; index: number }> = ({ crypto, index }) => {
  const isPositive = crypto.change >= 0;

  // Deterministic mock price history for the chart (24h, hourly)
  // Simulate a visible up or down trend based on the current change
  const base = crypto.price - crypto.change;
  const priceHistory = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}h`,
    price: base + (crypto.change * (i / 23)), // Linear trend from base to current price
  }));

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className={cn(
              "p-2 rounded-lg",
              isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900">{crypto.symbol}</h3>
                <Badge variant="outline" className="text-xs">
                  #{crypto.rank}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {crypto.marketCap}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{crypto.name}</p>
              {/* Chart */}
              <div className="w-full h-28 mb-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis dataKey="hour" hide />
                    <YAxis domain={[(dataMin: number) => Math.floor(dataMin * 0.99), (dataMax: number) => Math.ceil(dataMax * 1.01)]} hide />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Line type="monotone" dataKey="price" stroke={isPositive ? "#22c55e" : "#ef4444"} strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {crypto.aiInsight && (
                <div className="bg-blue-50 rounded-lg p-3 mb-2">
                  <div className="flex items-center space-x-1 mb-1">
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">AI Insight</span>
                  </div>
                  <p className="text-xs text-blue-700">{crypto.aiInsight}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3" />
                  <span>Vol: ${formatCryptoVolume(crypto.volume)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{crypto.lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${crypto.price.toLocaleString()}
            </div>
            
            <div className={cn(
              "flex items-center space-x-1 text-sm font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>
                {isPositive ? "+" : ""}${crypto.change.toFixed(2)} ({isPositive ? "+" : ""}{crypto.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-4"
  >
    {[1, 2, 3, 4].map((i) => (
      <Card key={i} className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded" />
          </div>
        </div>
      </Card>
    ))}
  </motion.div>
);

const formatVolume = (volume: number) => {
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toString();
};

const formatCryptoVolume = (volume: number) => {
  if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toString();
};

export default LiveFeeds;