"use client";

import React from 'react';
import EnhancedLibrary from '@/components/EnhancedLibrary';

const LibraryPage = () => {
  const sendMessage = (message: string) => {
    // For now, just log the message. In a real app, this would integrate with the search functionality
    console.log('Library search:', message);
    // You could also navigate to the main page with the search query
    // router.push(`/?q=${encodeURIComponent(message)}`);
  };

  return <EnhancedLibrary sendMessage={sendMessage} />;
};

export default LibraryPage; 