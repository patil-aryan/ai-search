"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Hash,
  Clock,
  Users,
  ExternalLink,
  RefreshCw,
  Globe,
  MessageSquare,
  Search,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  category: 'technology' | 'politics' | 'sports' | 'entertainment' | 'business' | 'science';
  trendScore: number;
  change: 'up' | 'down' | 'stable';
  changePercent: number;
  volume: number;
  source: 'twitter' | 'reddit' | 'google' | 'news';
  url?: string;
  hashtags?: string[];
  timestamp: Date;
}

interface TrendingTopicsProps {
  onTopicClick?: (topic: string) => void;
  className?: string;
}

const categoryConfig = {
  technology: { color: "bg-blue-100 text-blue-700", label: "Tech" },
  politics: { color: "bg-red-100 text-red-700", label: "Politics" },
  sports: { color: "bg-green-100 text-green-700", label: "Sports" },
  entertainment: { color: "bg-purple-100 text-purple-700", label: "Entertainment" },
  business: { color: "bg-orange-100 text-orange-700", label: "Business" },
  science: { color: "bg-indigo-100 text-indigo-700", label: "Science" }
};

const sourceConfig = {
  twitter: { icon: MessageSquare, color: "text-blue-500", label: "Twitter" },
  reddit: { icon: MessageSquare, color: "text-orange-500", label: "Reddit" },
  google: { icon: Search, color: "text-green-500", label: "Google" },
  news: { icon: Globe, color: "text-gray-500", label: "News" }
};

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ onTopicClick, className }) => {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchTrendingTopics();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchTrendingTopics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrendingTopics = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real implementation, this would fetch from multiple APIs
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTopics: TrendingTopic[] = [
        {
          id: "1",
          title: "AI Breakthrough in Medical Diagnosis",
          description: "New AI system achieves 95% accuracy in early cancer detection",
          category: "technology",
          trendScore: 95,
          change: "up",
          changePercent: 23,
          volume: 15420,
          source: "twitter",
          hashtags: ["AI", "Healthcare", "Innovation"],
          timestamp: new Date(),
          url: "https://example.com/ai-medical"
        },
        {
          id: "2", 
          title: "Climate Summit 2024",
          description: "World leaders gather to discuss new climate initiatives",
          category: "politics",
          trendScore: 87,
          change: "up",
          changePercent: 12,
          volume: 8930,
          source: "news",
          hashtags: ["Climate", "COP29", "Environment"],
          timestamp: new Date(),
          url: "https://example.com/climate-summit"
        },
        {
          id: "3",
          title: "Quantum Computing Milestone",
          description: "IBM announces 1000-qubit quantum processor",
          category: "science",
          trendScore: 78,
          change: "up",
          changePercent: 45,
          volume: 5670,
          source: "reddit",
          hashtags: ["Quantum", "IBM", "Computing"],
          timestamp: new Date(),
          url: "https://example.com/quantum-milestone"
        },
        {
          id: "4",
          title: "Space Tourism Launch",
          description: "First commercial space hotel opens for bookings",
          category: "technology",
          trendScore: 72,
          change: "stable",
          changePercent: 0,
          volume: 3240,
          source: "google",
          hashtags: ["Space", "Tourism", "Innovation"],
          timestamp: new Date(),
          url: "https://example.com/space-tourism"
        },
        {
          id: "5",
          title: "Renewable Energy Record",
          description: "Solar power generates 50% of global electricity for first time",
          category: "science",
          trendScore: 68,
          change: "up",
          changePercent: 8,
          volume: 7890,
          source: "news",
          hashtags: ["Solar", "Renewable", "Energy"],
          timestamp: new Date(),
          url: "https://example.com/renewable-record"
        }
      ];
      
      setTopics(mockTopics);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch trending topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTopics = selectedCategory === "all" 
    ? topics 
    : topics.filter(topic => topic.category === selectedCategory);

  const categories = Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Trending Now</h2>
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={fetchTrendingTopics}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {categoryConfig[category].label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="animate-pulse space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {filteredTopics.map((topic, index) => (
                  <TrendingTopicCard
                    key={topic.id}
                    topic={topic}
                    index={index}
                    onTopicClick={onTopicClick}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Trending Topic Card Component
const TrendingTopicCard: React.FC<{
  topic: TrendingTopic;
  index: number;
  onTopicClick?: (topic: string) => void;
}> = ({ topic, index, onTopicClick }) => {
  const categoryConfig_ = categoryConfig[topic.category];
  const sourceConfig_ = sourceConfig[topic.source];
  const SourceIcon = sourceConfig_.icon;

  const getTrendIcon = () => {
    switch (topic.change) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card className="p-4 hover:shadow-md transition-all duration-200 group cursor-pointer">
        <div className="flex items-start space-x-4">
          {/* Trend Rank */}
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className={categoryConfig_.color}>
                {categoryConfig_.label}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <SourceIcon className={cn("w-3 h-3", sourceConfig_.color)} />
                <span>{sourceConfig_.label}</span>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                {topic.change !== "stable" && (
                  <span className={cn(
                    "text-xs font-medium",
                    topic.change === "up" ? "text-green-600" : "text-red-600"
                  )}>
                    {topic.changePercent}%
                  </span>
                )}
              </div>
            </div>
            
            <h3 
              className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-1 cursor-pointer"
              onClick={() => onTopicClick?.(topic.title)}
            >
              {topic.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {topic.description}
            </p>
            
            {/* Hashtags */}
            {topic.hashtags && topic.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {topic.hashtags.slice(0, 3).map(hashtag => (
                  <Badge key={hashtag} variant="outline" className="text-xs">
                    <Hash className="w-2 h-2 mr-1" />
                    {hashtag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{formatVolume(topic.volume)} mentions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{topic.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {topic.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(topic.url, '_blank')}
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTopicClick?.(topic.title)}
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default TrendingTopics; 