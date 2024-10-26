# Zeotap Application 2 - Real-Time Data Processing System for Weather Monitoring

This project is a real-time data processing system designed to monitor weather conditions for major metropolitan areas in India using data from the OpenWeatherMap API. The system retrieves weather data continuously, performs analysis, and generates daily summaries using rollups and aggregates, including key metrics such as average, maximum, and minimum temperatures as well as dominant weather conditions. With configurable alert thresholds, users receive notifications when specific temperature or weather conditions are met. Additionally, the system includes visualization tools for displaying daily summaries and triggered alerts, allowing for comprehensive weather tracking and analysis.

## Features
**1. Continuous Data Retrieval:** Calls the OpenWeatherMap API at customizable intervals to gather real-time weather data.

**2. Temperature Conversion:** Converts temperature from Kelvin to Celsius, with options to adjust based on user preferences.

**3. Daily Weather Summaries:** Calculates and stores daily aggregates for average, maximum, minimum temperatures, and dominant weather conditions.

**4. Custom Alerts:** Allows user-configurable alert thresholds for conditions like high temperatures, triggering alerts when thresholds are breached.

**5. Visualizations:** Displays the current temperature, today’s summary, and yesterday’s summary across all metropolitan cities, providing a comprehensive view for easy monitoring and analysis.

## Technologies Used
- **Frontend:** React.js, CSS
- **Backend:** Node.js, Express.js, MongoDB  
- **API:** OpenWeatherMap API  
- **Cron Jobs**  
- **Version Control:** Git  


## Clone the repository:
```bash
git clone https://github.com/Perumallpardhiv/Application-2-Real-Time-Data-Processing-System.git
```

### Frontend Setup:
```bash
cd .\frontend\
```
```bash
npm install
npm start
```

### Backend Setup:
```bash
cd .\backend\
```
```bash
npm install
node server.js
```

### Data Display:

| Current Temperature                              | Weather Summary                                  |
|--------------------------------------------------|--------------------------------------------------|
| ![Current Temperature Screenshot](/screenshots/1.png) | ![Weather Summary Screenshot](/screenshots/2.png) |
| The current temperature is updated every 10 seconds through regular API calls. This approach ensures that the displayed data reflects real-time weather conditions, providing users with the most accurate and timely information.. | - **Daily Summary:** Calculates the minimum, maximum, and average temperatures by aggregating all API calls made until that time. <br>  - Today's summary includes today's minimum, maximum, average, and dominant weather conditions. <br>  - The summary for yesterday follows the same format, providing insights into past weather patterns. |

As the system stores all API calls in the database, the database size may increase significantly over time. To manage this, a cron job is implemented to regularly remove data older than three days. This cron job runs twice a day, ensuring that the database remains efficient and performs optimally.


### Temperature Conversion:

| Temperature Conversion Example                   | Temperature Conversion Example                 |
|--------------------------------------------------|------------------------------------------------|
| ![Kelvin to Celsius Conversion Screenshot](/screenshots/3.png) | ![User Preference Screenshot](/screenshots/4.png) |
| This screenshot demonstrates the conversion from Kelvin to Celsius. | This screenshot demonstrates the conversion from Celsius to Kelvin. |


### Alert Notifications:

| Alert Display Example                             |
|--------------------------------------------------|
| ![Alert Notifications Screenshot](/screenshots/5.png) |
| This screenshot illustrates how alerts are displayed in the project, providing users with timely notifications for significant weather conditions. |

### MongoDB Data Storage

| Weather Summaries                                | Daily Summaries                                |
|--------------------------------------------------|------------------------------------------------|
| ![Weather Summaries Screenshot](/screenshots/6.png) | ![Daily Summaries Screenshot](/screenshots/7.png) |
| This screenshot displays the "WeatherSummaries," showcasing all API call results of today's weather details. | This screenshot illustrates the "DailySummaries," storing the results of today's and yesterday's weather summary data. |


### Packages Used

| **Frontend Packages**           | **Backend Packages**           |
|----------------------------------|---------------------------------|
| react                            | axios                          |
| react-dom                        | cors                           |
| react-scripts                    | dotenv                         |
| socket.io-client                 | express                        |
| web-vitals                       | mongoose                       |
|                                  | node-cron                      |
|                                  | socket.io                      |


### Conclusion

Thank you for taking the time to review my project. I truly appreciate the opportunity to share my work, and I look forward to any feedback you may have to help me improve further.
