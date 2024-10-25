const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const cron = require('node-cron');
const weatherService = require('./services/weatherService');
const { WeatherSummary } = require('./models/Weather');
const alertThresholds = require('./utils/alertThresholds');
const cors = require('cors');

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
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Trigger weather data fetch every 5 minutes using cron
cron.schedule('*/5 * * * * *', async () => {
    console.log('Fetching weather data...');
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

    for (const city of cities) {
        try {
            const weatherData = await weatherService.getWeatherData(city);
            const dailySummary = await WeatherSummary.create(weatherData);

            const alert = alertThresholds.checkThreshold(weatherData);
            if (alert) {
                io.emit('weatherAlert', alert);
            }
        } catch (error) {
            console.error(`Error fetching data for ${city}: `, error.message);
        }
    }
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
