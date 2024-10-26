const axios = require('axios');
const { kelvinToCelsius } = require('../utils/tempConverter');
const WeatherSummary = require('../models/Weather');
const DailySummary = require('../models/DailySummary');

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

async function calculateDailySummary() {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

    for (const city of cities) {
        const todayData = await WeatherSummary.find({ city, timestamp: { $gte: new Date().setHours(0, 0, 0, 0) } });
        // console.log(city, todayData);
        if (todayData.length > 0) {
            const temps = todayData.map(data => data.temp);
            const mainWeatherConditions = todayData.map(data => data.main);

            const dailySummary = {
                city,
                avgTemp: (temps.reduce((a, b) => a + b) / temps.length).toFixed(2),
                maxTemp: Math.max(...temps),
                minTemp: Math.min(...temps),
                dominantWeather: mainWeatherConditions.sort((a, b) =>
                    mainWeatherConditions.filter(v => v === a).length - mainWeatherConditions.filter(v => v === b).length
                ).pop(),
                date: new Date().toISOString().split('T')[0]
            };

            // await DailySummary.findOneAndUpdate(
            //     { city: city, date: dailySummary.date },
            //     dailySummary,
            //     { upsert: true }
            // );

            await DailySummary.updateOne(
                { city: city, date: dailySummary.date },
                { $set: dailySummary },
                { upsert: true }
            );
        }
    }
}

module.exports = { getWeatherData, calculateDailySummary };
