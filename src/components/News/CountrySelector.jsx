import React from 'react';
import { countries } from '../services/newsService';
import './CountrySelector.css';

const CountrySelector = ({ selectedCountry, onCountryChange }) => {
  return (
    <div className="country-selector">
      <label htmlFor="country-select">Country:</label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={(e) => onCountryChange(e.target.value)}
        className="country-select"
      >
        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountrySelector;