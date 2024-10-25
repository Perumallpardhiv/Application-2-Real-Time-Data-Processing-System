const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
    city: String,
    main: String,
    temp: Number,
    feels_like: Number,
    timestamp: Date,
});

const WeatherSummary = mongoose.model('WeatherSummary', weatherSchema);

module.exports = { WeatherSummary };
