import React from 'react';
import './CategorySelector.css';

const CategorySelector = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="category-selector">
      <label htmlFor="category-select">Category:</label>
      <select
        id="category-select"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;