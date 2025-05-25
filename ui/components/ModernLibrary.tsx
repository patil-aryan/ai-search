"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Code, FileText, Database, Globe, Brain, Cpu, Microscope, Calculator, Palette, Music, Camera, Gamepad2, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface LibraryCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  searchQuery: string;
}

interface RecentSearch {
  query: string;
  timestamp: Date;
  category: string;
}

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

const ModernLibrary = ({
  sendMessage,
}: {
  sendMessage: (message: string) => void;
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);

  const categories: LibraryCategory[] = [
    {
      id: "programming",
      name: "Programming",
      icon: Code,
      description: "Code snippets, tutorials, and documentation",
      searchQuery: "Programming help with"
    },
    {
      id: "research",
      name: "Research",
      icon: BookOpen,
      description: "Academic papers and scientific studies",
      searchQuery: "Research papers about"
    },
    {
      id: "documentation",
      name: "Documentation",
      icon: FileText,
      description: "Technical documentation and guides",
      searchQuery: "Documentation for"
    },
    {
      id: "databases",
      name: "Databases",
      icon: Database,
      description: "Data sources and structured information",
      searchQuery: "Database information about"
    },
    {
      id: "web",
      name: "Web Resources",
      icon: Globe,
      description: "Online tools and web applications",
      searchQuery: "Web resources for"
    },
    {
      id: "ai",
      name: "AI & ML",
      icon: Brain,
      description: "Artificial intelligence and machine learning",
      searchQuery: "AI and machine learning about"
    },
    {
      id: "algorithms",
      name: "Algorithms",
      icon: Cpu,
      description: "Computer algorithms and data structures",
      searchQuery: "Algorithms for"
    },
    {
      id: "science",
      name: "Science",
      icon: Microscope,
      description: "Scientific knowledge and discoveries",
      searchQuery: "Scientific information about"
    },
    {
      id: "mathematics",
      name: "Mathematics",
      icon: Calculator,
      description: "Mathematical concepts and formulas",
      searchQuery: "Mathematical help with"
    },
    {
      id: "design",
      name: "Design",
      icon: Palette,
      description: "Design principles and creative resources",
      searchQuery: "Design resources for"
    },
  ];

  // Load data from localStorage
  useEffect(() => {
    try {
      // Load recent searches
      const storedRecent = localStorage.getItem("intelligent_search_recent");
      if (storedRecent) {
        const searches = JSON.parse(storedRecent).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setRecentSearches(searches.slice(0, 8)); // Show only last 8
      }

      // Load chat histories
      const storedChats = localStorage.getItem("futuresearch_chats");
      if (storedChats) {
        const chats = JSON.parse(storedChats).map((chat: any) => ({
          ...chat,
          timestamp: new Date(chat.timestamp),
          messages: chat.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setChatHistories(chats.slice(0, 10)); // Show only last 10
      }
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
    }
  }, []);

  const saveRecentSearch = (query: string, category: string) => {
    try {
      const newSearch = {
        query,
        timestamp: new Date(),
        category
      };
      
      const existing = recentSearches.filter(s => s.query !== query);
      const updated = [newSearch, ...existing].slice(0, 20);
      
      localStorage.setItem("intelligent_search_recent", JSON.stringify(updated));
      setRecentSearches(updated.slice(0, 8));
    } catch (error) {
      console.error("Failed to save recent search:", error);
    }
  };

  const handleSearch = (query?: string) => {
    const searchQuery = query || searchValue;
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery, selectedCategory || "general");
      sendMessage(searchQuery);
      setSearchValue("");
    }
  };

  const handleCategoryClick = (category: LibraryCategory) => {
    setSelectedCategory(category.id);
    const query = `${category.searchQuery} `;
    saveRecentSearch(query, category.name);
    handleSearch(query);
  };

  const handleChatClick = (chat: ChatHistory) => {
    const query = chat.firstMessage;
    saveRecentSearch(query, "chat_history");
    sendMessage(query);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    category.description.toLowerCase().includes(searchValue.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-light text-gray-900 mb-2">Knowledge Library</h1>
          <p className="text-gray-600">
            Explore curated resources across multiple domains. Each category provides access to specialized knowledge and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search library categories..."
                  className="pl-10 pr-4 py-3 rounded-lg border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCategories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-lg border-gray-200 transform hover:scale-105 hover:-translate-y-1 animate-fade-in ${
                      selectedCategory === category.id ? 'ring-2 ring-gray-900 shadow-lg' : ''
                    }`}
                    onClick={() => handleCategoryClick(category)}
                    style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 mx-auto mb-3 bg-gray-900 rounded-lg flex items-center justify-center group-hover:bg-gray-800 transition-all duration-300 group-hover:scale-110">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-medium text-sm text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No categories found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search terms or browse all available categories.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchValue("")}
                  className="mt-4 border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Searches
                  </h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSearch(search.query)}
                        className="w-full justify-start text-left h-auto p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                      >
                        <div className="w-full">
                          <div className="text-sm font-medium line-clamp-1">{search.query}</div>
                          <div className="text-xs text-gray-400">
                            {search.category} • {formatTimestamp(search.timestamp)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Chat History */}
            {chatHistories.length > 0 && (
              <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Recent Conversations</h3>
                  <div className="space-y-2">
                    {chatHistories.slice(0, 5).map((chat, index) => (
                      <Button
                        key={chat.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleChatClick(chat)}
                        className="w-full justify-start text-left h-auto p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
                      >
                        <div className="w-full">
                          <div className="text-sm font-medium line-clamp-1">{chat.title}</div>
                          <div className="text-xs text-gray-400">
                            {chat.messageCount} messages • {formatTimestamp(chat.timestamp)}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Access */}
            <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-4">Quick Access</h3>
                <div className="space-y-2">
                  {[
                    "How to code in Python",
                    "Latest AI research papers",
                    "Web development best practices",
                    "Data structure algorithms",
                    "Machine learning tutorials"
                  ].map((query, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSearch(query)}
                      className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                    >
                      {query}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
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

export default ModernLibrary; 