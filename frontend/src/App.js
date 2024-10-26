import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://localhost:5000');

const App = () => {
  const [alerts, setAlerts] = useState([]);
  const [latestWeatherData, setLatestWeatherData] = useState([]);
  const [todaySummary, setTodaySummary] = useState([]);
  const [yesterdaySummary, setYesterdaySummary] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true); // State to track temperature unit

  useEffect(() => {
    socket.on('weatherAlert', (alert) => {
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
      setTimeout(() => {
        setAlerts((prevAlerts) => prevAlerts.filter((_, index) => index !== 0));
      }, 5000);
    });

    socket.emit('getLatestWeather');

    socket.on('latestWeatherData', (data) => {
      setLatestWeatherData(data);
    });

    const fetchDailySummaries = async () => {
      try {
        console.log("Fetching today's summary...");
        const todayResponse = await fetch('/api/todaysSummary');
        const todayData = await todayResponse.json();
        setTodaySummary(todayData);

        const yesterdayResponse = await fetch('/api/yesterdaysSummary');
        const yesterdayData = await yesterdayResponse.json();
        setYesterdaySummary(yesterdayData);
      } catch (error) {
        console.error('Error fetching summaries:', error);
      }
    };

    fetchDailySummaries();

    const intervalId = setInterval(() => {
      socket.emit('getLatestWeather');
    }, 10000);

    return () => {
      socket.off('weatherAlert');
      socket.off('latestWeatherData');
      clearInterval(intervalId);
    };
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true });
  };

  const getWeatherIcon = (weather) => {
    const weatherIcons = {
      Thunderstorm: "wi-thunderstorm",
      Drizzle: "wi-sprinkle",
      Rain: "wi-rain",
      Snow: "wi-snow",
      Mist: "wi-fog",
      Smoke: "wi-smoke",
      Haze: "wi-day-haze",
      Dust: "wi-dust",
      Fog: "wi-fog",
      Sand: "wi-sandstorm",
      Ash: "wi-volcano",
      Squall: "wi-strong-wind",
      Tornado: "wi-tornado",
      Clear: "wi-day-sunny",
      Clouds: "wi-cloudy",
    };
    return weatherIcons[weather] || "wi-na"; // Fallback icon if weather type not matched
  };

  // Function to convert Celsius to Kelvin
  const celsiusToKelvin = (temp) => temp + 273.15;
  
  // Function to toggle temperature unit
  const toggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  return (
    <div className="App">
      <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 20px' }}>
        <span style={{ flex: 1, textAlign: 'center' }}>Real-Time Weather Monitoring</span>
        {/* Temperature Unit Toggle */}
        <div className="toggle-container">
          <label className="toggle-label" style={{ display: 'flex', alignItems: 'center' }}>
            <span className="toggle-text" style={{ marginRight: '5px' }}>K</span>
            <input
              type="checkbox"
              checked={isCelsius}
              onChange={toggleTemperatureUnit}
              className="toggle-input"
            />
            <span className="toggle-switch"></span>
            <span className="toggle-text" style={{ marginLeft: '5px' }}>°C</span>
          </label>
        </div>
      </h1>


      <h2>Latest Weather Data</h2>
      <div className="city-grid">
        {latestWeatherData.length > 0 ? (
          latestWeatherData.map((city, index) => (
            <div key={index} className={`city-card ${city.main.toLowerCase()}`}>
              <i className={`wi ${getWeatherIcon(city.main)}`}></i>
              <h2>{city.city}</h2>
              <p>{city.main}</p>
              <p>Temperature: {isCelsius ? city.temp : celsiusToKelvin(city.temp).toFixed(2)}°{isCelsius ? "C" : "K"}</p>
              <p>Feels like: {isCelsius ? city.feels_like : celsiusToKelvin(city.feels_like).toFixed(2)}°{isCelsius ? "C" : "K"}</p>
              <p>Updated Time: {formatTimestamp(city.timestamp)}</p>
            </div>
          ))
        ) : (
          <p>No latest weather data available.</p>
        )}
      </div>

      <h2>Today's Summary</h2>
      <div className="city-grid">
        {todaySummary.length > 0 ? (
          todaySummary.map((summary, index) => (
            <div key={index} className={`city-card ${summary.dominantWeather.toLowerCase()}`}>
              <i className={`wi ${getWeatherIcon(summary.dominantWeather)}`}></i>
              <h2>{summary.city}</h2>
              <p>Average Temp: {isCelsius ? summary.avgTemp : celsiusToKelvin(summary.avgTemp).toFixed(2)}°{isCelsius ? "C" : "K"}</p>
              <p>Max Temp: {isCelsius ? summary.maxTemp : celsiusToKelvin(summary.maxTemp).toFixed(2)}°{isCelsius ? "C" : "K"}</p>
              <p>Min Temp: {isCelsius ? summary.minTemp : celsiusToKelvin(summary.minTemp).toFixed(2)}°{isCelsius ? "C" : "K"}</p>
              <p>Dominant Weather: {summary.dominantWeather}</p>
            </div>
          ))
        ) : (
          <p>No summary data available for today.</p>
        )}
      </div>

      <h2>Yesterday's Summary</h2>
      <div className="city-grid">
        {yesterdaySummary.length > 0 ? (
          yesterdaySummary.map((summary, index) => (
            <div key={index} className={`city-card ${summary.dominantWeather.toLowerCase()}`}>
              <i className={`wi ${getWeatherIcon(summary.dominantWeather)}`}></i>
              <h2>{summary.city}</h2>
              <p>Average Temp: {isCelsius ? summary.avgTemp : celsiusToKelvin(summary.avgTemp).toFixed(2)}°{isCelsius ? "C" : "K"}</p>
              <p>Max Temp: {isCelsius ? summary.maxTemp : celsiusToKelvin(summary.maxTemp).toFixed(2)}°{isCelsius ? "C" : "K"}</p>
              <p>Min Temp: {isCelsius ? summary.minTemp : celsiusToKelvin(summary.minTemp).toFixed(2)}°{isCelsius ? "C" : "K"}</p>
              <p>Dominant Weather: {summary.dominantWeather}</p>
            </div>
          ))
        ) : (
          <p>No summary data available for yesterday.</p>
        )}
      </div>

      <div className="alerts">
        {alerts.map((alert, index) => (
          <div key={index} className="alert">{alert}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
