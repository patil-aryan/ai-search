"use client";

import { useState } from "react";
import { TrendingUp, Clock, Zap, Globe, Video, Image as ImageIcon, ArrowRight, Sparkles } from "lucide-react";
import EnhancedMessageInput from "./EnhancedMessageInput";

const EnhancedEmptyChat = ({
  sendMessage,
  focusMode,
  setFocusMode,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  const trendingTopics = [
    { topic: "AI Revolution 2024", category: "Technology", searches: "2.3M" },
    { topic: "Climate Solutions", category: "Environment", searches: "1.8M" },
    { topic: "Space Exploration", category: "Science", searches: "1.2M" },
    { topic: "Crypto Market", category: "Finance", searches: "3.1M" },
    { topic: "Health Tech", category: "Health", searches: "950K" },
    { topic: "Gaming News", category: "Gaming", searches: "1.5M" },
  ];

  const todaysNews = [
    {
      title: "Breakthrough in Quantum Computing",
      source: "TechCrunch",
      time: "2h ago",
      category: "Technology"
    },
    {
      title: "Climate Summit Agreement",
      source: "Reuters", 
      time: "4h ago",
      category: "Environment"
    },
    {
      title: "AI Solves Math Theorems",
      source: "Nature",
      time: "6h ago", 
      category: "Science"
    },
    {
      title: "Revolutionary Battery Tech",
      source: "MIT Review",
      time: "8h ago",
      category: "Innovation"
    },
  ];

  const quickSearches = [
    "Latest AI developments",
    "Climate change solutions", 
    "Space missions 2024",
    "Cryptocurrency trends",
    "Health research",
    "Tech innovations"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-screen mx-auto p-4 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-4xl">
        <div className="relative">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-[#24A0ED] to-white bg-clip-text text-transparent">
            Ask Real Questions
          </h1>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="text-[#24A0ED] animate-pulse" size={32} />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white/90">
          Get Complete Answers
        </h2>
        <p className="text-white/60 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          Search the entire web with AI-powered intelligence. Get comprehensive answers, discover trending topics, and explore the latest news.
        </p>
      </div>

      {/* Enhanced Search Input */}
      <div className="w-full max-w-4xl">
        <EnhancedMessageInput
          sendMessage={sendMessage}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
        />
      </div>

      {/* Quick Search Suggestions */}
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6">
          <p className="text-white/60 text-sm mb-4">Try these popular searches:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {quickSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => sendMessage(search)}
                className="px-4 py-2 bg-gradient-to-r from-[#181c24]/80 to-[#1a1f2e]/80 border border-[#23272f] rounded-full text-white/70 hover:text-white hover:border-[#24A0ED]/50 transition-all duration-200 text-sm backdrop-blur-sm hover:scale-105"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Topics and News Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trending Topics */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-[#24A0ED] to-[#1a8fd1] rounded-lg">
              <TrendingUp className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-white">Trending Now</h3>
          </div>
          <div className="space-y-3">
            {trendingTopics.slice(0, 6).map((item, index) => (
              <div
                key={index}
                onClick={() => sendMessage(item.topic)}
                className="bg-gradient-to-r from-[#181c24]/60 to-[#1a1f2e]/60 p-4 rounded-xl border border-[#23272f] hover:border-[#24A0ED]/30 transition-all duration-300 cursor-pointer group backdrop-blur-sm hover:shadow-lg hover:shadow-[#24A0ED]/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white group-hover:text-[#24A0ED] transition-colors">
                      {item.topic}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#24A0ED] bg-[#24A0ED]/10 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-white/60">{item.searches} searches</span>
                    </div>
                  </div>
                  <ArrowRight className="text-white/40 group-hover:text-[#24A0ED] transition-colors" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's News */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <Clock className="text-white" size={20} />
            </div>
            <h3 className="text-xl font-semibold text-white">Today&apos;s News</h3>
          </div>
          <div className="space-y-3">
            {todaysNews.map((item, index) => (
              <div
                key={index}
                onClick={() => sendMessage(`Latest news about ${item.title}`)}
                className="bg-gradient-to-r from-[#181c24]/60 to-[#1a1f2e]/60 p-4 rounded-xl border border-[#23272f] hover:border-[#24A0ED]/30 transition-all duration-300 cursor-pointer group backdrop-blur-sm hover:shadow-lg hover:shadow-[#24A0ED]/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white group-hover:text-[#24A0ED] transition-colors mb-2">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-white/60">{item.source}</span>
                      <span className="text-xs text-white/40">{item.time}</span>
                    </div>
                  </div>
                  <ArrowRight className="text-white/40 group-hover:text-[#24A0ED] transition-colors" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-white mb-2">Explore Categories</h3>
          <p className="text-white/60">Discover content across different topics</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: "Technology", icon: Zap, color: "from-blue-500 to-cyan-500" },
            { name: "Science", icon: Globe, color: "from-green-500 to-emerald-500" },
            { name: "Entertainment", icon: Video, color: "from-purple-500 to-pink-500" },
            { name: "News", icon: Clock, color: "from-orange-500 to-red-500" },
            { name: "Health", icon: Globe, color: "from-teal-500 to-blue-500" },
            { name: "Finance", icon: TrendingUp, color: "from-yellow-500 to-orange-500" },
          ].map((category, index) => (
            <div
              key={index}
              onClick={() => sendMessage(`Latest ${category.name.toLowerCase()} news and updates`)}
              className="bg-gradient-to-r from-[#181c24]/60 to-[#1a1f2e]/60 p-6 rounded-xl border border-[#23272f] hover:border-[#24A0ED]/30 transition-all duration-300 cursor-pointer group text-center backdrop-blur-sm hover:shadow-lg hover:shadow-[#24A0ED]/10"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <category.icon size={24} className="text-white" />
              </div>
              <h4 className="font-medium text-white group-hover:text-[#24A0ED] transition-colors text-sm">
                {category.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedEmptyChat; 