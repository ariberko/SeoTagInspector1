import React, { createContext, useContext, useEffect, useState } from 'react';
import { SEOMetaTag } from '@shared/schema';

interface SearchHistoryItem {
  url: string;
  timestamp: number;
  score?: number;
  title?: string;
}

interface SearchHistoryContextType {
  searchHistory: SearchHistoryItem[];
  addToHistory: (url: string, seoData?: SEOMetaTag) => void;
  clearHistory: () => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextType | undefined>(undefined);

export function SearchHistoryProvider({ children }: { children: React.ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    const savedHistory = localStorage.getItem('seoSearchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('seoSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToHistory = (url: string, seoData?: SEOMetaTag) => {
    const newItem: SearchHistoryItem = {
      url,
      timestamp: Date.now(),
      score: seoData?.score,
      title: seoData?.title,
    };

    setSearchHistory(prevHistory => {
      // Remove duplicate URL if it exists
      const filteredHistory = prevHistory.filter(item => item.url !== url);
      // Add new item to the beginning (most recent)
      return [newItem, ...filteredHistory].slice(0, 10); // Keep only last 10 searches
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('seoSearchHistory');
  };

  return (
    <SearchHistoryContext.Provider value={{ searchHistory, addToHistory, clearHistory }}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider');
  }
  return context;
}