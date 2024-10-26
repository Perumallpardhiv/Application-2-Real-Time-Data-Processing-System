const mongoose = require('mongoose');

// Define the schema for weather data
const weatherSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
    },
    main: {
        type: String,
        required: true,
    },
    temp: {
        type: Number,
        required: true,
    },
    feels_like: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

const WeatherSummary = mongoose.model('WeatherSummary', weatherSchema);

module.exports = WeatherSummary;
