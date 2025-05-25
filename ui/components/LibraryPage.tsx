"use client";

import { useState } from "react";
import { MessageSquare, Clock, Search, Filter, MoreVertical, Star, Archive, Trash2 } from "lucide-react";

const LibraryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  const recentChats = [
    {
      id: 1,
      title: "AI and Machine Learning Trends",
      preview: "What are the latest developments in artificial intelligence and how they impact...",
      timestamp: "2 hours ago",
      messageCount: 12,
      category: "Technology",
      starred: true,
    },
    {
      id: 2,
      title: "Climate Change Solutions",
      preview: "Exploring renewable energy sources and sustainable practices for environmental...",
      timestamp: "1 day ago",
      messageCount: 8,
      category: "Environment",
      starred: false,
    },
    {
      id: 3,
      title: "Space Exploration Updates",
      preview: "Latest missions to Mars and the future of space colonization projects...",
      timestamp: "2 days ago",
      messageCount: 15,
      category: "Science",
      starred: true,
    },
    {
      id: 4,
      title: "Cryptocurrency Market Analysis",
      preview: "Understanding blockchain technology and its impact on financial markets...",
      timestamp: "3 days ago",
      messageCount: 6,
      category: "Finance",
      starred: false,
    },
    {
      id: 5,
      title: "Health and Wellness Research",
      preview: "Recent studies on nutrition, exercise, and mental health improvements...",
      timestamp: "1 week ago",
      messageCount: 10,
      category: "Health",
      starred: false,
    },
    {
      id: 6,
      title: "Gaming Industry Innovations",
      preview: "Virtual reality, augmented reality, and the future of interactive entertainment...",
      timestamp: "1 week ago",
      messageCount: 9,
      category: "Gaming",
      starred: true,
    },
  ];

  const filteredChats = recentChats.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         chat.preview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === "all" || 
                         (filterBy === "starred" && chat.starred) ||
                         chat.category.toLowerCase() === filterBy.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111111] to-[#1a1f2e] text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-[#24A0ED] to-white bg-clip-text text-transparent mb-2">
            Library
          </h1>
          <p className="text-white/60 text-lg">Your conversation history and saved searches</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gradient-to-r from-[#181c24] to-[#1a1f2e] border border-[#23272f] rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#24A0ED]/50 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-gradient-to-r from-[#181c24] to-[#1a1f2e] border border-[#23272f] rounded-xl pl-12 pr-8 py-3 text-white focus:outline-none focus:border-[#24A0ED]/50 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="all">All Conversations</option>
              <option value="starred">Starred</option>
              <option value="technology">Technology</option>
              <option value="science">Science</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="gaming">Gaming</option>
              <option value="environment">Environment</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Chats</p>
                <p className="text-2xl font-bold text-white">{recentChats.length}</p>
              </div>
              <MessageSquare className="text-[#24A0ED]" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Starred</p>
                <p className="text-2xl font-bold text-white">{recentChats.filter(c => c.starred).length}</p>
              </div>
              <Star className="text-yellow-400" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">4</p>
              </div>
              <Clock className="text-green-400" size={24} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Categories</p>
                <p className="text-2xl font-bold text-white">6</p>
              </div>
              <Filter className="text-purple-400" size={24} />
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="space-y-4">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className="bg-gradient-to-br from-[#181c24] to-[#1a1f2e] p-6 rounded-xl border border-[#23272f] hover:border-[#24A0ED]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#24A0ED]/10 cursor-pointer group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold group-hover:text-[#24A0ED] transition-colors">
                      {chat.title}
                    </h3>
                    {chat.starred && <Star className="text-yellow-400 fill-current" size={16} />}
                    <span className="text-xs font-medium text-[#24A0ED] bg-[#24A0ED]/10 px-2 py-1 rounded-full">
                      {chat.category}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{chat.preview}</p>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {chat.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} />
                      {chat.messageCount} messages
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-[#23272f] rounded-lg transition-colors">
                    <Star size={16} className={chat.starred ? "text-yellow-400 fill-current" : "text-white/40"} />
                  </button>
                  <button className="p-2 hover:bg-[#23272f] rounded-lg transition-colors">
                    <Archive size={16} className="text-white/40" />
                  </button>
                  <button className="p-2 hover:bg-[#23272f] rounded-lg transition-colors">
                    <MoreVertical size={16} className="text-white/40" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredChats.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="mx-auto text-white/20 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-white/60 mb-2">No conversations found</h3>
            <p className="text-white/40">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage; 