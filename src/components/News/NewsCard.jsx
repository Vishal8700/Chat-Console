import React from 'react';
import './NewsCard.css';

const NewsCard = ({ article }) => {
  const { title, description, url, image, publishedAt, source, content } = article;
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle missing image
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image+Available';
  };

  // Extract first few sentences from content
  const getExcerpt = (content) => {
    if (!content) return 'No content available';
    // Remove the characters count indicator from the end of the content
    const cleanContent = content.replace(/\[\d+ chars\]$/, '').trim();
    return cleanContent;
  };

  return (
    <div className="news-card">
      <div className="news-image-container">
        <img 
          src={image || 'https://via.placeholder.com/300x200?text=No+Image+Available'} 
          alt={title}
          onError={handleImageError}
          className="news-image"
        />
        {source.name && (
          <div className="news-source">
            <span>{source.name}</span>
          </div>
        )}
      </div>
      
      <div className="news-content">
        <h2 className="news-title">{title}</h2>
        <p className="news-description">{description || 'No description available'}</p>
        
        <div className="news-details">
          <p className="news-date">{formatDate(publishedAt)}</p>
        </div>
        
        <a href={url} target="_blank" rel="noopener noreferrer" className="news-link">
          Read Full Article
        </a>
      </div>
    </div>
  );
};

export default NewsCard;

