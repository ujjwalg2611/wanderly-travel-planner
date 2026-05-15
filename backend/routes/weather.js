const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mock weather data with realistic patterns
const weatherData = {
  'Paris': { temp: 18, feels: 15, humidity: 72, wind: 14, condition: 'Partly Cloudy', icon: '⛅', forecast: [{ day: 'Mon', high: 19, low: 12, icon: '🌤️' }, { day: 'Tue', high: 21, low: 13, icon: '☀️' }, { day: 'Wed', high: 16, low: 10, icon: '🌧️' }, { day: 'Thu', high: 14, low: 9, icon: '⛈️' }, { day: 'Fri', high: 17, low: 11, icon: '🌤️' }] },
  'Tokyo': { temp: 24, feels: 26, humidity: 80, wind: 8, condition: 'Humid & Warm', icon: '🌤️', forecast: [{ day: 'Mon', high: 25, low: 19, icon: '☀️' }, { day: 'Tue', high: 27, low: 20, icon: '☀️' }, { day: 'Wed', high: 23, low: 18, icon: '🌦️' }, { day: 'Thu', high: 22, low: 17, icon: '🌧️' }, { day: 'Fri', high: 24, low: 18, icon: '⛅' }] },
  'Bali': { temp: 30, feels: 34, humidity: 88, wind: 10, condition: 'Hot & Humid', icon: '☀️', forecast: [{ day: 'Mon', high: 31, low: 24, icon: '☀️' }, { day: 'Tue', high: 30, low: 23, icon: '🌦️' }, { day: 'Wed', high: 28, low: 23, icon: '🌧️' }, { day: 'Thu', high: 29, low: 24, icon: '⛅' }, { day: 'Fri', high: 31, low: 25, icon: '☀️' }] },
  'New York': { temp: 15, feels: 12, humidity: 60, wind: 20, condition: 'Windy', icon: '🌬️', forecast: [{ day: 'Mon', high: 16, low: 8, icon: '🌤️' }, { day: 'Tue', high: 18, low: 10, icon: '☀️' }, { day: 'Wed', high: 14, low: 7, icon: '🌧️' }, { day: 'Thu', high: 12, low: 5, icon: '🌩️' }, { day: 'Fri', high: 15, low: 8, icon: '⛅' }] },
  'London': { temp: 12, feels: 9, humidity: 78, wind: 18, condition: 'Overcast', icon: '🌥️', forecast: [{ day: 'Mon', high: 13, low: 7, icon: '🌥️' }, { day: 'Tue', high: 14, low: 8, icon: '🌦️' }, { day: 'Wed', high: 11, low: 6, icon: '🌧️' }, { day: 'Thu', high: 10, low: 5, icon: '🌧️' }, { day: 'Fri', high: 13, low: 7, icon: '⛅' }] },
  'default': { temp: 22, feels: 20, humidity: 65, wind: 12, condition: 'Clear', icon: '☀️', forecast: [{ day: 'Mon', high: 23, low: 15, icon: '☀️' }, { day: 'Tue', high: 25, low: 16, icon: '☀️' }, { day: 'Wed', high: 21, low: 14, icon: '⛅' }, { day: 'Thu', high: 20, low: 13, icon: '🌦️' }, { day: 'Fri', high: 22, low: 15, icon: '☀️' }] }
};

router.get('/:destination', auth, (req, res) => {
  const dest = req.params.destination;
  const key = Object.keys(weatherData).find(k => dest.toLowerCase().includes(k.toLowerCase())) || 'default';
  const data = weatherData[key];
  // Add slight randomization
  data.temp = data.temp + Math.floor(Math.random() * 3 - 1);
  res.json({ ...data, destination: dest, lastUpdated: new Date().toISOString(), alert: data.temp > 35 ? 'Extreme heat warning' : data.condition.includes('Storm') ? 'Storm alert' : null });
});

module.exports = router;
