"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Clock, Globe, Zap, BookOpen, Video, Image as ImageIcon, Users, ArrowRight, Search } from "lucide-react";

const PremiumDiscover = () => {
  const [activeCategory, setActiveCategory] = useState("trending");

  const trendingTopics = [
    { title: "AI Revolution 2024", category: "Technology", engagement: "2.3M", trend: "+15%" },
    { title: "Climate Change Solutions", category: "Environment", engagement: "1.8M", trend: "+8%" },
    { title: "Space Exploration Updates", category: "Science", engagement: "1.2M", trend: "+12%" },
    { title: "Cryptocurrency Market", category: "Finance", engagement: "3.1M", trend: "+22%" },
    { title: "Health & Wellness Trends", category: "Health", engagement: "900K", trend: "+5%" },
    { title: "Renewable Energy Tech", category: "Technology", engagement: "1.5M", trend: "+18%" },
  ];

  const newsArticles = [
    {
      title: "AI Breakthrough: New Model Achieves Human-Level Reasoning",
      description: "Researchers unveil a revolutionary AI system that demonstrates unprecedented cognitive abilities across multiple domains.",
      category: "Technology",
      time: "2h ago",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
      trending: true
    },
    {
      title: "Climate Summit Reaches Historic Carbon Reduction Agreement",
      description: "World leaders commit to ambitious targets in landmark environmental accord, setting new global standards.",
      category: "Environment",
      time: "4h ago",
      image: "https://images.unsplash.com/photo-1569163003615-94b21b5de6cb?w=400&h=250&fit=crop",
      trending: false
    },
    {
      title: "Quantum Computer Solves Complex Problem in Seconds",
      description: "Latest quantum breakthrough promises to revolutionize scientific computing and cryptography.",
      category: "Science",
      time: "6h ago",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop",
      trending: true
    },
    {
      title: "Mars Mission Updates: New Discoveries",
      description: "Recent findings from Mars exploration missions reveal surprising geological formations.",
      category: "Space",
      time: "8h ago",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop",
      trending: false
    }
  ];

  const categories = [
    { id: "trending", name: "Trending Now", icon: TrendingUp, color: "text-red-500" },
    { id: "technology", name: "Technology", icon: Zap, color: "text-blue-500" },
    { id: "science", name: "Science", icon: BookOpen, color: "text-green-500" },
    { id: "environment", name: "Environment", icon: Globe, color: "text-emerald-500" },
    { id: "health", name: "Health", icon: Users, color: "text-purple-500" },
  ];

  const quickSearches = [
    "Latest AI news",
    "Climate change research",
    "Quantum computing",
    "Space exploration",
    "Renewable energy",
    "Medical breakthroughs",
    "Tech innovations",
    "Environmental solutions"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Discover</h1>
          <p className="text-gray-600">Explore trending topics, latest news, and emerging insights</p>
        </div>

        {/* Quick Search Suggestions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Searches</h2>
          <div className="flex flex-wrap gap-3">
            {quickSearches.map((search, index) => (
              <button
                key={index}
                className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-sm rounded-full border border-gray-200 hover:border-blue-300 transition-all duration-200"
              >
                {search}
              </button>
            ))}
          </div>
        </div>

        {/* Category Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Trending Topics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Trending Topics</h2>
                <TrendingUp className="w-5 h-5 text-red-500" />
              </div>
              
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{topic.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {topic.category}
                        </span>
                        <span>{topic.engagement} searches</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-green-600">{topic.trend}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest News */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Latest News</h2>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  Live updates
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newsArticles.map((article, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300">
                      <div className="aspect-video bg-gray-100 overflow-hidden relative">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {article.trending && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            Trending
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-blue-600">{article.category}</span>
                          <span className="text-xs text-gray-500">{article.time}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {article.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Popular Categories */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Categories</h3>
              <div className="space-y-3">
                {categories.slice(1).map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <category.icon className={`w-4 h-4 ${category.color}`} />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Search Statistics */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Search Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Searches Today</span>
                  <span className="font-semibold text-gray-900">2.4M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-semibold text-gray-900">156K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top Category</span>
                  <span className="font-semibold text-blue-600">Technology</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Trending Queries</span>
                  <span className="font-semibold text-red-600">+25%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="text-sm font-medium">Search Images</span>
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-sm font-medium">Find Videos</span>
                  <Video className="w-4 h-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="text-sm font-medium">Academic Search</span>
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDiscover; 