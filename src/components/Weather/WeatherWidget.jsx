import { useState, useEffect, useCallback, useRef } from "react"
import "./WeatherWidget.css"
import {
  SunnyIcon,
  CloudIcon,
  RainIcon,
  SnowIcon,
  WindIcon,
  DropIcon,
  EyeIcon,
  RefreshIcon,
  CloseIcon,
  LocationIcon
} from "./weatherIcons"

const getWeatherIcon = (conditionCode) => {
  if (conditionCode === 1000) return <SunnyIcon />
  if ([1003, 1006, 1009].includes(conditionCode)) return <CloudIcon />
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195].includes(conditionCode)) return <RainIcon />
  if ([1066, 1210, 1213, 1216, 1219, 1222, 1225].includes(conditionCode)) return <SnowIcon />
  return <CloudIcon />
}

const WeatherWidget = ({ className = "" }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState(null)
  const widgetRef = useRef(null)

  const fetchWeather = useCallback(async (query, isUpdate = false) => {
    try {
      if (isUpdate) setUpdating(true)
      else setLoading(true)

      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockData = {
        location: {
          name: query.includes(",") ? "Current Location" : "Mumbai",
          country: "India",
          region: "Maharashtra",
        },
        current: {
          temp_c: 27,
          condition: {
            text: "Partly Cloudy",
            icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png",
            code: 1003,
          },
          humidity: 65,
          wind_kph: 12,
          vis_km: 15,
          feelslike_c: 29,
        },
        forecast: {
          forecastday: [
            {
              date: new Date().toISOString().split("T")[0],
              day: {
                maxtemp_c: 30,
                mintemp_c: 22,
                condition: {
                  text: "Partly Cloudy",
                  icon: "https://cdn.weatherapi.com/weather/64x64/day/116.png",
                },
              },
            },
            {
              date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
              day: {
                maxtemp_c: 28,
                mintemp_c: 20,
                condition: {
                  text: "Sunny",
                  icon: "https://cdn.weatherapi.com/weather/64x64/day/113.png",
                },
              },
            },
          ],
        },
      }

      setWeather(mockData)
      setError(null)
    } catch (err) {
      setError("Failed to fetch weather data")
    } finally {
      setLoading(false)
      setUpdating(false)
    }
  }, [])

  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        },
      )
    })
  }, [])

  const initializeWeather = useCallback(async () => {
    try {
      const position = await getCurrentLocation()
      const { latitude, longitude } = position.coords
      await fetchWeather(`${latitude},${longitude}`)
    } catch (error) {
      await fetchWeather("Mumbai")
    }
  }, [getCurrentLocation, fetchWeather])

  const handleRefresh = useCallback(async () => {
    if (weather) {
      await fetchWeather("refresh", true)
    }
  }, [weather, fetchWeather])

  const toggleExpanded = () => setExpanded(!expanded)

  useEffect(() => {
    initializeWeather()
  }, [initializeWeather])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setExpanded(false)
      }
    }
    if (expanded) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [expanded])

  if (loading) {
    return (
      <div className={`weather-widget ${className}`} ref={widgetRef}>
        <button className="weather-pill loading">
        
          <span>Loading...</span>
        </button>
      </div>
    )
  }

  if (error && !weather) {
    return (
      <div className={`weather-widget ${className}`} ref={widgetRef}>
        <button className="weather-pill error" onClick={initializeWeather}>
          <span><CloseIcon /></span>
          <span>Error</span>
        </button>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className={`weather-widget ${className}`} ref={widgetRef}>
        <button className="weather-pill">
          <span><CloudIcon /></span>
          <span>--°C</span>
        </button>
      </div>
    )
  }

  const weatherIcon = getWeatherIcon(weather.current.condition.code)

  return (
    <div className={`weather-widget ${className}`} ref={widgetRef}>
      {expanded && (
        <div className="weather-expanded">
          <div className="weather-card">
            <div className="weather-header">
              <div className="location-info">
                <div className="location-icon"><LocationIcon /></div>
                <div className="location-details">
                  <div className="location-name">{weather.location.name}</div>
                  <div className="location-region">
                    {weather.location.region}, {weather.location.country}
                  </div>
                </div>
              </div>
              <div className="weather-actions">
                <button className={`action-btn ${updating ? "updating" : ""}`} onClick={handleRefresh} disabled={updating}>
                  <RefreshIcon />
                </button>
                <button className="action-btn close-btn" onClick={() => setExpanded(false)}>
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="current-weather">
              <div className="weather-main">
                <div className="weather-icon-large">{weatherIcon}</div>
                <div className="temperature-info">
                  <div className="current-temp">{Math.round(weather.current.temp_c)}°C</div>
                  <div className="feels-like">Feels like {Math.round(weather.current.feelslike_c)}°C</div>
                </div>
              </div>
              <div className="weather-condition">
                <div className="condition-text">{weather.current.condition.text}</div>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <div className="detail-icon"><DropIcon /></div>
                <div className="detail-label">Humidity</div>
                <div className="detail-value">{weather.current.humidity}%</div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><WindIcon /></div>
                <div className="detail-label">Wind</div>
                <div className="detail-value">{weather.current.wind_kph} km/h</div>
              </div>
              <div className="detail-item">
                <div className="detail-icon"><EyeIcon /></div>
                <div className="detail-label">Visibility</div>
                <div className="detail-value">{weather.current.vis_km} km</div>
              </div>
            </div>

            <div className="weather-forecast">
              <h3 className="forecast-title">2-Day Forecast</h3>
              <div className="forecast-list">
                {weather.forecast.forecastday.slice(0, 2).map((day, index) => (
                  <div key={day.date} className="forecast-item">
                    <div className="forecast-info">
                      <div className="forecast-icon">{weatherIcon}</div>
                      <div className="forecast-details">
                        <div className="forecast-day">{index === 0 ? "Today" : "Tomorrow"}</div>
                        <div className="forecast-condition">{day.day.condition.text}</div>
                      </div>
                    </div>
                    <div className="forecast-temps">
                      <div className="temp-high">{Math.round(day.day.maxtemp_c)}°</div>
                      <div className="temp-low">{Math.round(day.day.mintemp_c)}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        className={`weather-pill ${expanded ? "expanded" : ""} ${updating ? "updating" : ""}`}
        onClick={toggleExpanded}
        title="Click to view detailed weather information"
      >
        <span className="pill-icon">{weatherIcon}</span>
        <span className="pill-temp">{Math.round(weather.current.temp_c)}°C</span>
        {updating && <div className="pill-spinner"><RefreshIcon /></div>}
      </button>
    </div>
  )
}

export default WeatherWidget
