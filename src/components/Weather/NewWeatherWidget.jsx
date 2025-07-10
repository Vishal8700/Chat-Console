import React, { useState, useEffect } from 'react';
import './NewWeatherWidget.css';

const NewWeatherWidget = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=1`
            );
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error?.message || 'Weather data not available');
            }

            const data = await response.json();
            setWeather(data);
            setHourlyForecast(data.forecast.forecastday[0].hour.slice(new Date().getHours(), new Date().getHours() + 4));
          } catch (err) {
            setError('Failed to fetch weather data: ' + err.message);
          } finally {
            setLoading(false);
          }
        },
        () => {
          setError('Please enable location access');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!location.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=1`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Location not found');
      }

      const data = await response.json();
      setWeather(data);
      setHourlyForecast(data.forecast.forecastday[0].hour.slice(new Date().getHours(), new Date().getHours() + 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="we-weather-card-modern">
      <div className="we-weather-search">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search location..."
            className="we-new-search-input"
          />
        </form>
      </div>

      {loading && <div className="we-loading-spinner" />}
      {error && <div className="we-weather-error">{error}</div>}

      {weather && !loading && !error && (
        <>
          <div className="we-weather-header">
            <div className="we-location-name">{weather.location.name}</div>
            <div className="we-weather-condition">{weather.current.condition.text}</div>
          </div>

          <div className="we-current-temp">
            {Math.round(weather.current.temp_c)}°
            <img 
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
              className="we-weather-icon"
            />
          </div>

          {hourlyForecast && hourlyForecast.length > 0 && (
            <div className="we-hourly-forecast">
              {hourlyForecast.map((hour, index) => (
                <div key={index} className="we-forecast-hour">
                  <div className="we-hour-temp">{Math.round(hour.temp_c)}°</div>
                  <img 
                    src={hour.condition.icon}
                    alt={hour.condition.text}
                    className="we-hour-icon"
                  />
                  <div className="we-hour-time">
                    {new Date(hour.time).getHours()}:00
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewWeatherWidget;
