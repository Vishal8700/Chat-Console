import React, { useState } from 'react';
import './NewsFilter.css';
import { categories, countries, languages } from './newsApi';

const NewsFilter = ({ onFilterChange, currentFilter }) => {
  const [activeTab, setActiveTab] = useState('category');
  
  const handleFilterChange = (type, value) => {
    onFilterChange({
      ...currentFilter,
      [type]: value
    });
  };

  return (
    <div className="news-filter">
      <div className="filter-header">
        <h2>Filter News</h2>
      </div>
      
      <div className="filter-tabs">
        <button 
          className={`tab-button ${activeTab === 'category' ? 'active' : ''}`} 
          onClick={() => setActiveTab('category')}
        >
          Categories
        </button>
        <button 
          className={`tab-button ${activeTab === 'country' ? 'active' : ''}`} 
          onClick={() => setActiveTab('country')}
        >
          Countries
        </button>
        <button 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`} 
          onClick={() => setActiveTab('view')}
        >
          View Type
        </button>
      </div>
      
      <div className="filter-content">
        {activeTab === 'category' && (
          <div className="filter-options">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-option ${currentFilter.category === category ? 'selected' : ''}`}
                onClick={() => handleFilterChange('category', category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'country' && (
          <div className="filter-options">
            {countries.map((country) => (
              <button
                key={country.code}
                className={`filter-option ${currentFilter.country === country.code ? 'selected' : ''}`}
                onClick={() => handleFilterChange('country', country.code)}
              >
                {country.name}
              </button>
            ))}
          </div>
        )}
        
        {activeTab === 'view' && (
          <div className="filter-options view-type">
            <button
              className={`filter-option ${currentFilter.viewType === 'headlines' ? 'selected' : ''}`}
              onClick={() => handleFilterChange('viewType', 'headlines')}
            >
              Top Headlines
            </button>
            {/* <button
              className={`filter-option ${currentFilter.viewType === 'latest' ? 'selected' : ''}`}
              onClick={() => handleFilterChange('viewType', 'latest')}
            >
              Latest News
            </button> */}
            <button
              className={`filter-option ${currentFilter.viewType === 'search' ? 'selected' : ''}`}
              onClick={() => handleFilterChange('viewType', 'search')}
            >
              Search
            </button>
            
            {currentFilter.viewType === 'search' || currentFilter.viewType === 'latest' ? (
              <div className="language-select">
                <label htmlFor="language">Select Language:</label>
                <select 
                  id="language"
                  value={currentFilter.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFilter;

