import { useState, useEffect } from 'react';
import './Weather.css';

function Weather() {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  useEffect(() => {
    // API key should be in an environment variable
    const API_KEY = '4e351bb1708043498d182233240307';
    
    const fetchWeather = async (query) => {
      try {
        setWeatherLoading(true);
        
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=7`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Weather data not available');
        }
        
        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch weather data: ' + error.message);
      } finally {
        setWeatherLoading(false);
      }
    };

    const getLocation = () => {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation not supported by your browser'));
          return;
        }
        
        navigator.geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        );
      });
    };

    const setupLocationTracking = async () => {
      try {
        const position = await getLocation();
        const { latitude, longitude } = position.coords;
        // console.log(`Initial location: ${latitude}, ${longitude}`);
        await fetchWeather(`${latitude},${longitude}`);
        
        // Set up continuous location watching with less frequent updates
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // console.log(`Location updated: ${latitude}, ${longitude}`);
            fetchWeather(`${latitude},${longitude}`);
          },
          (error) => {
            // console.error('Location watching error:', error);
            setError('Location error: ' + error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000 // Update if location is older than 5 minutes
          }
        );

        setWatchId(id);
      } catch (error) {
        // console.error('Geolocation error:', error);
        setError('Location access denied or unavailable. Using default location.');
        // Fallback to default location
        fetchWeather('Mumbai');
      }
    };

    setupLocationTracking();

    // Cleanup function to stop watching location
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  if (weatherLoading && !weather) {
    return (
      <div className="weather-info">
        <div className="weather-container">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="weather-info">
        <div className="weather-container error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-info">
        <div className="weather-container">Weather unavailable</div>
      </div>
    );
  }
  return (
    <div className="weather-info">
      <div className="weather-container">
        {weatherLoading && <div className="updating-indicator">Updating...</div>}
        <img 
          src={weather.current.condition.icon} 
          alt={weather.current.condition.text}
          className="weather-icon"
        />
        <span className="temperature">{Math.round(weather.current.temp_c)}°C</span>
        <span className="condition">{weather.current.condition.text}</span>
        <span className="location">
          {weather.location.name}, {weather.location.country}
        </span>
      </div>
    </div>
  );
}  

export default Weather;
