const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = import.meta.env.VITE_NEWS_BASE_URL;
// "ae286d8cf3ac617a4096e81b9f05917e"
export const fetchTopHeadlines = async (category = 'general', country = 'us', pageSize = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/top-headlines?category=${category}&country=${country}&max=${pageSize}&apikey=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching top headlines:", error);
    throw error;
  }
};

export const fetchNewsByKeyword = async (keyword = '', language = 'en', pageSize = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(keyword)}&lang=${language}&max=${pageSize}&apikey=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching news by keyword:", error);
    throw error;
  }
};

export const fetchLatestNews = async (language = 'en', pageSize = 10) => {
  try {
    const response = await fetch(`${BASE_URL}/latest-headlines?lang=${language}&max=${pageSize}&apikey=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching latest news:", error);
    throw error;
  }
};

export const categories = [
  'general',
  'world',
  'nation',
  'business',
  'technology',
  'entertainment',
  'sports',
  'science',
  'health'
];

export const countries = [
  { code: 'us', name: 'United States' },
  { code: 'gb', name: 'United Kingdom' },
  { code: 'in', name: 'India' },
  { code: 'au', name: 'Australia' },
  { code: 'ca', name: 'Canada' },
  { code: 'de', name: 'Germany' },
  { code: 'fr', name: 'France' },
  { code: 'ru', name: 'Russia' },
  { code: 'jp', name: 'Japan' }
];

export const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'he', name: 'Hebrew' },
  { code: 'it', name: 'Italian' },
  { code: 'nl', name: 'Dutch' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'zh', name: 'Chinese' }
];