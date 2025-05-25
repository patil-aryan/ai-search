"use client";

import { useState, useEffect } from "react";
import { Search, Clock, MessageSquare, Star, Trash2, Calendar, Filter } from "lucide-react";

interface ChatHistory {
  id: string;
  title: string;
  firstMessage: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  starred: boolean;
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
  }>;
}

const PremiumLibrary = () => {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);

  useEffect(() => {
    loadChatHistories();
  }, []);

  const loadChatHistories = () => {
    try {
      const stored = localStorage.getItem("futuresearch_chats");
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const converted = parsed.map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatHistories(converted);
      }
    } catch (error) {
      console.error("Failed to load chat histories:", error);
    }
  };

  const saveChatHistories = (histories: ChatHistory[]) => {
    try {
      localStorage.setItem("futuresearch_chats", JSON.stringify(histories));
    } catch (error) {
      console.error("Failed to save chat histories:", error);
    }
  };

  const toggleStar = (chatId: string) => {
    const updated = chatHistories.map(chat =>
      chat.id === chatId ? { ...chat, starred: !chat.starred } : chat
    );
    setChatHistories(updated);
    saveChatHistories(updated);
  };

  const deleteChat = (chatId: string) => {
    const updated = chatHistories.filter(chat => chat.id !== chatId);
    setChatHistories(updated);
    saveChatHistories(updated);
    if (selectedChat?.id === chatId) {
      setSelectedChat(null);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const filteredChats = chatHistories.filter(chat => {
    const matchesSearch = 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.firstMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === "all" ||
      (selectedFilter === "starred" && chat.starred) ||
      (selectedFilter === "recent" && new Date().getTime() - chat.timestamp.getTime() < 24 * 60 * 60 * 1000);
    
    return matchesSearch && matchesFilter;
  });

  const totalChats = chatHistories.length;
  const starredChats = chatHistories.filter(chat => chat.starred).length;
  const recentChats = chatHistories.filter(chat => 
    new Date().getTime() - chat.timestamp.getTime() < 24 * 60 * 60 * 1000
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Search History</h1>
          <p className="text-gray-600">Your conversation history and saved searches</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Searches</p>
                <p className="text-2xl font-semibold text-gray-900">{totalChats}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Starred</p>
                <p className="text-2xl font-semibold text-gray-900">{starredChats}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-semibold text-gray-900">{recentChats}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {chatHistories.filter(chat => 
                    new Date().getTime() - chat.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
                  ).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search your conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Conversations</option>
                <option value="starred">Starred</option>
                <option value="recent">Recent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Chat List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {filteredChats.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
                <p className="text-gray-600">
                  {searchQuery ? "Try adjusting your search terms" : "Start a new search to see your history here"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`bg-white p-6 rounded-lg border border-gray-200 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedChat?.id === chat.id ? 'ring-2 ring-blue-500 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1 truncate">{chat.title}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{chat.firstMessage}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimestamp(chat.timestamp)}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {chat.messageCount} messages
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(chat.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              chat.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'
                            }`}
                          />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Detail Panel */}
          <div className="lg:col-span-1">
            {selectedChat ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                <h3 className="font-medium text-gray-900 mb-4">{selectedChat.title}</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          {message.role === 'user' ? 'You' : 'AI'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-3">{message.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">Select a conversation to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumLibrary; 