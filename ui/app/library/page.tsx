"use client";

import React, { useState, useEffect } from 'react';
import EnhancedLibrary from '@/components/EnhancedLibrary';
import { useRouter } from 'next/navigation';

const MAX_RECENT_SEARCHES = 5;

const LibraryPage = () => {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage on component mount
    const storedSearches = localStorage.getItem('globalRecentSearches');
    if (storedSearches) {
      try {
        setRecentSearches(JSON.parse(storedSearches));
      } catch (e) {
        console.error("Failed to parse recent searches from localStorage", e);
        setRecentSearches([]);
      }
    }
  }, []);

  const addRecentSearch = (query: string) => {
    const updatedSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
    setRecentSearches(updatedSearches);
    localStorage.setItem('globalRecentSearches', JSON.stringify(updatedSearches));
  };

  const sendMessage = (message: string) => {
    console.log('Library search (global):', message);
    addRecentSearch(message);
    router.push(`/?q=${encodeURIComponent(message)}`); // Navigate to home page with search query
  };

  const handleRecentSearchClick = (query: string) => {
    sendMessage(query); // This will also add it to recent searches and navigate
  };

  return <EnhancedLibrary sendMessage={sendMessage} recentSearches={recentSearches} onRecentSearchClick={handleRecentSearchClick} />;
};

export default LibraryPage;