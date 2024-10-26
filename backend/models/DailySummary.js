// backend/models/DailySummary.js
const mongoose = require('mongoose');

const dailySummarySchema = new mongoose.Schema({
    city: { type: String, required: true },
    avgTemp: { type: Number, required: true },
    maxTemp: { type: Number, required: true },
    minTemp: { type: Number, required: true },
    dominantWeather: { type: String, required: true },
    date: { type: String, required: true },
});

const DailySummary = mongoose.model('DailySummary', dailySummarySchema);

module.exports = DailySummary;
