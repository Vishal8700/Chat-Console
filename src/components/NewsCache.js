import { useState, useEffect } from 'react';

const NEWS_CACHE_KEY = 'newsCache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const NewsCache = ({ children }) => {
  const [cachedNews, setCachedNews] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  useEffect(() => {
    // Load cached data on component mount
    const loadCachedData = () => {
      const cached = localStorage.getItem(NEWS_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const now = new Date().getTime();
        
        // Check if cache is still valid (within 24 hours)
        if (now - timestamp < CACHE_DURATION) {
          setCachedNews(data);
          setLastFetchTime(timestamp);
          return true;
        } else {
          // Clear expired cache
          localStorage.removeItem(NEWS_CACHE_KEY);
        }
      }
      return false;
    };

    loadCachedData();
  }, []);

  const updateCache = (newData) => {
    const timestamp = new Date().getTime();
    const cacheData = {
      data: newData,
      timestamp: timestamp
    };
    
    localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify(cacheData));
    setCachedNews(newData);
    setLastFetchTime(timestamp);
  };

  const clearCache = () => {
    localStorage.removeItem(NEWS_CACHE_KEY);
    setCachedNews(null);
    setLastFetchTime(null);
  };

  const getTimeUntilExpiry = () => {
    if (!lastFetchTime) return null;
    const now = new Date().getTime();
    const timeLeft = CACHE_DURATION - (now - lastFetchTime);
    return Math.max(0, timeLeft);
  };

  return children({
    cachedNews,
    updateCache,
    clearCache,
    getTimeUntilExpiry,
    isCacheValid: !!cachedNews && getTimeUntilExpiry() > 0
  });
};

export default NewsCache;