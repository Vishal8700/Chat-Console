import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image"></div>
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;