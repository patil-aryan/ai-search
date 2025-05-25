"use client";

import { useState } from "react";
import { Search, Globe, BookOpen, Video, Image as ImageIcon, ChevronDown } from "lucide-react";

const focusModes = [
  {
    key: "webSearch",
    title: "All",
    description: "Search the entire web",
    icon: <Globe size={16} />,
  },
  {
    key: "academicSearch", 
    title: "Academic",
    description: "Research papers and studies",
    icon: <BookOpen size={16} />,
  },
  {
    key: "youtubeSearch",
    title: "Videos",
    description: "Video content and tutorials",
    icon: <Video size={16} />,
  },
  {
    key: "imageSearch",
    title: "Images",
    description: "Visual content and photos",
    icon: <ImageIcon size={16} />,
  },
];

const PremiumSearchInput = ({
  sendMessage,
  focusMode,
  setFocusMode,
}: {
  sendMessage: (message: string) => void;
  focusMode: string;
  setFocusMode: (mode: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const [showFocusModes, setShowFocusModes] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      sendMessage(query.trim());
      setQuery("");
    }
  };

  const currentMode = focusModes.find(mode => mode.key === focusMode) || focusModes[0];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        {/* Main search container */}
        <div className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 focus-within:shadow-xl focus-within:border-blue-500">
          
          {/* Focus mode selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFocusModes(!showFocusModes)}
              className="flex items-center space-x-2 px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors duration-200 border-r border-gray-200"
            >
              {currentMode.icon}
              <span className="text-sm font-medium">{currentMode.title}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Focus modes dropdown */}
            {showFocusModes && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-2">
                {focusModes.map((mode) => (
                  <button
                    key={mode.key}
                    type="button"
                    onClick={() => {
                      setFocusMode(mode.key);
                      setShowFocusModes(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-start space-x-3 ${
                      focusMode === mode.key ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {mode.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{mode.title}</div>
                      <div className="text-xs text-gray-600 mt-0.5">{mode.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything..."
            className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent focus:outline-none text-lg"
          />

          {/* Search button */}
          <button
            type="submit"
            disabled={!query.trim()}
            className="flex items-center justify-center w-12 h-12 m-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200"
          >
            <Search size={20} />
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-6 text-center">
          <div className="text-sm text-gray-600 mb-3">Try searching for:</div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "AI latest news",
              "Climate change solutions", 
              "Stock market today",
              "Weather forecast"
            ].map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setQuery(suggestion);
                  sendMessage(suggestion);
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Click outside to close dropdown */}
      {showFocusModes && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowFocusModes(false)}
        />
      )}
    </div>
  );
};

export default PremiumSearchInput; 