import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewsCard from '../components/News/NewsCard';
import NewsFilter from '../components/News/NewsFilter';
import Loader from '../components/News/Loader';
import NewsCache from '../components/News/NewsCache';
import { fetchTopHeadlines, fetchNewsByKeyword, fetchLatestNews } from '../components/News/newsApi.jsx';
import './NewsApp.css';
import NewWeatherWidget from '../components/Weather/NewWeatherWidget';

const NewsApp = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    category: 'general',
    country: 'us',
    viewType: 'headlines',
    language: 'en',
    keyword: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNews, setFilteredNews] = useState([]);
  const [pageSize] = useState(10);
  const navigate = useNavigate();

  // Fetch news based on current filter
  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        switch(filter.viewType) {
          case 'headlines':
            data = await fetchTopHeadlines(filter.category, filter.country, pageSize);
            break;
          case 'latest':
            data = await fetchLatestNews(filter.language, pageSize);
            break;
          case 'search':
            // If no search term is entered, use a default topic
            const keyword = searchTerm.trim() || 'technology';
            data = await fetchNewsByKeyword(keyword, filter.language, pageSize);
            break;
          default:
            data = await fetchTopHeadlines(filter.category, filter.country, pageSize);
        }
        
        if (data && data.articles) {
          setNews(data.articles);
          setFilteredNews(data.articles);
        }
      } catch (err) {
       
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    getNews();
  }, [filter.category, filter.country, filter.viewType, filter.language, searchTerm, pageSize]);

  // Handle filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (filter.viewType !== 'search') {
      setFilter({
        ...filter,
        viewType: 'search'
      });
    } else {
      // Trigger a re-fetch
      const currentSearchTerm = searchTerm;
      setSearchTerm('');
      setTimeout(() => setSearchTerm(currentSearchTerm), 10);
    }
  };



  return (
    <NewsCache>
      {({ cachedNews, updateCache, clearCache, getTimeUntilExpiry, isCacheValid }) => {
        const getNews = async () => {
          try {
            if (isCacheValid) {
              setNews(cachedNews);
              setFilteredNews(cachedNews);
              return;
            }

            setLoading(true);
            setError(null);
            
            let data;
            switch(filter.viewType) {
              case 'headlines':
                data = await fetchTopHeadlines(filter.category, filter.country, pageSize);
                break;
              case 'latest':
                data = await fetchLatestNews(filter.language, pageSize);
                break;
              case 'search':
                const keyword = searchTerm.trim() || 'technology';
                data = await fetchNewsByKeyword(keyword, filter.language, pageSize);
                break;
              default:
                data = await fetchTopHeadlines(filter.category, filter.country, pageSize);
            }
            
            if (data && data.articles) {
              updateCache(data.articles);
              setNews(data.articles);
              setFilteredNews(data.articles);
            }
          } catch (err) {
            setError('Failed to fetch news. Please try again later.');
            console.error(err);
          } finally {
            setLoading(false);
          }
        };

        useEffect(() => {
          getNews();
        }, [filter.category, filter.country, filter.viewType, filter.language, searchTerm, pageSize]);

        const formatTimeRemaining = (ms) => {
          if (!ms) return '';
          const hours = Math.floor(ms / (60 * 60 * 1000));
          const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
          return `${hours}h ${minutes}m`;
        };

        return (
          <div className="news-app">
            <header className="news-header">
              <h1>Global News Explorer</h1>
              {isCacheValid && (
                <div className="cache-status">
                  <span className="cache-status-text">
                    Using cached data (expires in: 
                    <span className="cache-timer">
                      {formatTimeRemaining(getTimeUntilExpiry())}
                    </span>)
                  </span>
                  <button 
                    className="cache-refresh-button"
                    onClick={() => {
                      clearCache();
                      getNews();
                    }}
                  >
                    Refresh Data
                  </button>
                </div>
              )}
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </header>
      
      <main className="news-content-container">
        <aside className="news-sidebar">
          <NewsFilter 
            onFilterChange={handleFilterChange} 
            currentFilter={filter}
          />
          
          <div className="filter-info">
            <h3>Current Filter</h3>
            <p>
              <strong>View:</strong> {
                filter.viewType === 'headlines' ? 'Top Headlines' : 
                filter.viewType === 'latest' ? 'Latest News' : 'Search'
              }
              <br />
              {filter.viewType === 'headlines' ? (
                <>
                  <strong>Category:</strong> {filter.category.charAt(0).toUpperCase() + filter.category.slice(1)}
                  <br />
                  <strong>Country:</strong> {filter.country.toUpperCase()}
                </>
              ) : (
                <><strong>Language:</strong> {filter.language.toUpperCase()}</>
              )}
              {filter.viewType === 'search' && searchTerm && (
                <>
                  <br />
                  <strong>Search Term:</strong> {searchTerm}
                </>
              )}
            </p>
          </div>
          
          {/* Add the new weather widget */}
          <NewWeatherWidget />
        </aside>
        
        <section className="news-main">
          {error && <div className="news-error">{error}</div>}
          
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className="news-stats">
                <p>Showing {filteredNews.length} articles</p>
              </div>
              
              {filteredNews.length > 0 ? (
                <div className="news-grid">
                  {filteredNews.map((article, index) => (
                    <NewsCard key={`${article.url}-${index}`} article={article} />
                  ))}
                </div>
              ) : (
                <div className="no-news">
                  <p>No articles found matching your criteria.</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
      }}
    </NewsCache>
  );
};

export default NewsApp;

