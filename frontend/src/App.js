import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

const App = () => {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    socket.on('weatherAlert', (alert) => {
      setAlerts((prevAlerts) => [...prevAlerts, alert]);
    });

    return () => socket.off('weatherAlert');
  }, []);
  
  return (
    <div className="App">
      <h1>Real-Time Weather Alerts</h1>
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <div key={index} className="alert">
            {alert}
          </div>
        ))
      ) : (
        <p>No weather alerts.</p>
      )}
    </div>
  );
};

export default App;
