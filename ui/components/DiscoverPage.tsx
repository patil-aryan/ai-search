"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Clock, Globe, Zap, BookOpen, Video, Image as ImageIcon, Users } from "lucide-react";

const DiscoverPage = () => {
  const [activeTab, setActiveTab] = useState("trending");

  const trendingTopics = [
    { title: "AI Revolution 2024", category: "Technology", engagement: "2.3M", trend: "+15%" },
    { title: "Climate Change Solutions", category: "Environment", engagement: "1.8M", trend: "+8%" },
    { title: "Space Exploration Updates", category: "Science", engagement: "1.2M", trend: "+12%" },
    { title: "Cryptocurrency Market", category: "Finance", engagement: "3.1M", trend: "+22%" },
    { title: "Health & Wellness Trends", category: "Health", engagement: "950K", trend: "+5%" },
    { title: "Gaming Industry News", category: "Gaming", engagement: "1.5M", trend: "+18%" },
  ];

  const newsItems = [
    {
      title: "Breakthrough in Quantum Computing Achieved",
      source: "TechCrunch",
      time: "2 hours ago",
      category: "Technology",
      image: "/api/placeholder/300/200",
      summary: "Scientists demonstrate new quantum processor with unprecedented stability..."
    },
    {
      title: "Global Climate Summit Reaches Historic Agreement",
      source: "Reuters",
      time: "4 hours ago",
      category: "Environment",
      image: "/api/placeholder/300/200",
      summary: "World leaders commit to ambitious carbon reduction targets..."
    },
    {
      title: "AI Model Solves Complex Mathematical Theorems",
      source: "Nature",
      time: "6 hours ago",
      category: "Science",
      image: "/api/placeholder/300/200",
      summary: "New artificial intelligence system proves long-standing mathematical conjectures..."
    },
    {
      title: "Revolutionary Battery Technology Unveiled",
      source: "MIT Technology Review",
      time: "8 hours ago",
      category: "Innovation",
      image: "/api/placeholder/300/200",
      summary: "New solid-state batteries promise 10x longer life and faster charging..."
    },
  ];

  const categories = [
    { name: "Technology", icon: Zap, color: "from-blue-500 to-cyan-500", count: "1.2K" },
    { name: "Science", icon: BookOpen, color: "from-green-500 to-emerald-500", count: "856" },
    { name: "Entertainment", icon: Video, color: "from-purple-500 to-pink-500", count: "2.1K" },
    { name: "Sports", icon: Users, color: "from-orange-500 to-red-500", count: "1.8K" },
    { name: "Health", icon: Globe, color: "from-teal-500 to-blue-500", count: "934" },
    { name: "Business", icon: TrendingUp, color: "from-yellow-500 to-orange-500", count: "1.5K" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#1a1f2e] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#24A0ED] to-white bg-clip-text text-transparent mb-2">
            Discover
          </h1>
          <p className="text-white/60 text-lg">Explore trending topics, latest news, and discover new content</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] rounded-xl border border-[#23272f] hover:border-[#24A0ED]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#24A0ED]/10 cursor-pointer group overflow-hidden"
              >
                <div className="aspect-video bg-gradient-to-br from-[#24A0ED]/20 to-[#1a8fd1]/20 flex items-center justify-center">
                  <ImageIcon size={48} className="text-[#24A0ED]/40" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-[#24A0ED] bg-[#24A0ED]/10 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-white/60 text-sm">{item.time}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#24A0ED] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{item.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-sm">{item.source}</span>
                    <button className="text-[#24A0ED] text-sm font-medium hover:underline">
                      Read more
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
      </div>
    </div>
  );
};

export default DiscoverPage; 