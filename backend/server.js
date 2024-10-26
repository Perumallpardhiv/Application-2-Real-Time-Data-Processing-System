const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const weatherService = require('./services/weatherService');
const DailySummary = require('./models/DailySummary');
const WeatherSummary = require('./models/Weather');
const alertThresholds = require('./utils/alertThresholds');
const cors = require('cors');
const path = require('path');

mongoose.connect('mongodb+srv://lit2021001:lit2021001@cluster0.mwmft.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message);
});

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.static(path.join(__dirname, 'public')));

const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('getLatestWeather', async () => {
        const weatherData = await WeatherSummary.find();
        const latestWeatherData = weatherData.reduce((acc, curr) => {
            const city = curr.city;
            if (!acc[city] || curr.timestamp > acc[city].timestamp) {
                acc[city] = curr;
            }
            return acc;
        }, {});

        socket.emit('latestWeatherData', Object.values(latestWeatherData));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Today's Summary Endpoint
app.get('/api/todaysSummary', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        console.log(today);
        const summaries = await DailySummary.find({ date: today });
        res.json(summaries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching today\'s summary' });
    }
});

// Yesterday's Summary Endpoint
app.get('/api/yesterdaysSummary', async (req, res) => {
    try {
        const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
        const summaries = await DailySummary.find({ date: yesterday });
        res.json(summaries);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching yesterday\'s summary' });
    }
});

// Trigger weather data fetch every 5 sec using cron
cron.schedule('*/5 * * * * *', async () => {
    // console.log('Fetching weather data...');
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

    for (const city of cities) {
        try {
            const weatherData = await weatherService.getWeatherData(city);
            const dailySummary = await WeatherSummary.create({
                city: weatherData.city,
                main: weatherData.main,
                temp: weatherData.temp,
                feels_like: weatherData.feels_like,
                timestamp: new Date(),
            });

            const alert = alertThresholds.checkThreshold(weatherData);
            if (alert) {
                io.emit('weatherAlert', alert);
            }
        } catch (error) {
            console.error(`Error fetching data for ${city}: `, error.message);
        }
    }
});

// Calculate daily summary at midnight
// cron.schedule('33 1 * * *', async () => {
cron.schedule('*/10 * * * * *', async () => {
    console.log('Calculating daily summary...');
    try {
        await weatherService.calculateDailySummary();
        console.log('Daily summary calculation completed.');
    } catch (error) {
        console.error('Error in daily summary calculation:', error);
    }
});

// Delete weather data older than 3 days twice a day at 2:00 AM and 2:00 PM
cron.schedule('0 2,14 * * *', async () => {
    console.log('Deleting weather data older than 3 days...');
    try {
        const threeDaysAgo = new Date(new Date().setDate(new Date().getDate() - 3));
        const result = await WeatherSummary.deleteMany({ timestamp: { $lt: threeDaysAgo } });
        console.log(`Deleted ${result.deletedCount} outdated weather entries.`);
    } catch (error) {
        console.error('Error deleting outdated weather data:', error);
    }
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
