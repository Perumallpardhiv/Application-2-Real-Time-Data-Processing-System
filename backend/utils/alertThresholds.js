// Store previous temperatures for each city
const lastTemperatures = {};

function checkThreshold(weatherData) {
    const thresholdTemp = 30;
    const city = weatherData.city;

    // Retrieve the last temperature for the city
    const lastTemp = lastTemperatures[city];
    lastTemperatures[city] = weatherData.temp;  // Update with the current temperature

    // Check if both the current and last temperatures are above the threshold
    if (lastTemp !== undefined && lastTemp > thresholdTemp && weatherData.temp > thresholdTemp) {
        return `ALERT: Temperature in ${city} has consecutively exceeded ${thresholdTemp}°C, current temp: ${weatherData.temp}°C`;
        // return `ALERT: Temperature in ${weatherData.city} is ${weatherData.temp}°C`
    }

    return null;
}

module.exports = { checkThreshold };
