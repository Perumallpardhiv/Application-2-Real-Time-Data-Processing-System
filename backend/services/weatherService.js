const axios = require('axios');
const { kelvinToCelsius } = require('../utils/tempConverter');

const apiKey = '00394e5a116740493b907a8f7585334b';

async function getWeatherData(city) {
    const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
    );

    const data = response.data;
    const weatherSummary = {
        city: city,
        main: data.weather[0].main,
        temp: kelvinToCelsius(data.main.temp),
        feels_like: kelvinToCelsius(data.main.feels_like),
        timestamp: new Date(data.dt * 1000),
    };

    return weatherSummary;
}

module.exports = { getWeatherData };
