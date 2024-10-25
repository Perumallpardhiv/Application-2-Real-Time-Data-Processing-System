function checkThreshold(weatherData) {
    const thresholdTemp = 5;
    console.log(`Checking temperature for ${weatherData.city}...`);
    const alert = weatherData.temp > thresholdTemp ?
        `ALERT: Temperature in ${weatherData.city} is ${weatherData.temp}°C` : null;

    return alert;
}

module.exports = { checkThreshold };
