const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const airlines = [
  { code: 'AI', name: 'Air India', logo: '🇮🇳' },
  { code: 'EK', name: 'Emirates', logo: '🇦🇪' },
  { code: 'SQ', name: 'Singapore Airlines', logo: '🇸🇬' },
  { code: '6E', name: 'IndiGo', logo: '🔵' },
  { code: 'BA', name: 'British Airways', logo: '🇬🇧' },
  { code: 'QR', name: 'Qatar Airways', logo: '🇶🇦' },
  { code: 'LH', name: 'Lufthansa', logo: '🇩🇪' },
  { code: 'AF', name: 'Air France', logo: '🇫🇷' },
];

const airports = {
  'Mumbai': 'BOM', 'Delhi': 'DEL', 'Bangalore': 'BLR', 'Chennai': 'MAA',
  'London': 'LHR', 'Paris': 'CDG', 'New York': 'JFK', 'Tokyo': 'NRT',
  'Singapore': 'SIN', 'Dubai': 'DXB', 'Bangkok': 'BKK', 'Bali': 'DPS',
  'Sydney': 'SYD', 'Toronto': 'YYZ', 'Frankfurt': 'FRA', 'Amsterdam': 'AMS',
};

function getAirportCode(city) {
  const key = Object.keys(airports).find(k => city.toLowerCase().includes(k.toLowerCase()));
  return key ? airports[key] : city.toUpperCase().substring(0, 3);
}

function generateFlights(from, to, date, passengers) {
  const flights = [];
  const basePrices = [4200, 5800, 7200, 9500, 12000, 15000, 18000, 22000];
  const durations = ['2h 30m', '3h 15m', '4h 00m', '5h 45m', '7h 20m', '9h 10m', '11h 30m', '14h 00m'];
  const times = ['05:30', '07:45', '09:00', '11:20', '13:45', '15:30', '17:00', '20:15', '22:40'];

  for (let i = 0; i < 6; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const dep = times[Math.floor(Math.random() * times.length)];
    const durMin = 150 + Math.floor(Math.random() * 720);
    const durH = Math.floor(durMin / 60);
    const durM = durMin % 60;
    const depParts = dep.split(':');
    const arrH = (parseInt(depParts[0]) + durH) % 24;
    const arrM = (parseInt(depParts[1]) + durM) % 60;
    const arr = `${String(arrH).padStart(2,'0')}:${String(arrM).padStart(2,'0')}`;
    const basePrice = basePrices[Math.floor(Math.random() * basePrices.length)];

    flights.push({
      id: `FL${Date.now()}${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogo: airline.logo,
      flightNumber: `${airline.code}${100 + Math.floor(Math.random() * 900)}`,
      from: getAirportCode(from),
      fromCity: from,
      to: getAirportCode(to),
      toCity: to,
      departure: dep,
      arrival: arr,
      duration: `${durH}h ${durM}m`,
      stops: Math.floor(Math.random() * 2),
      price: basePrice + Math.floor(Math.random() * 2000),
      pricePerPerson: basePrice,
      totalPrice: (basePrice + Math.floor(Math.random() * 2000)) * (passengers || 1),
      class: ['Economy', 'Economy', 'Economy', 'Business', 'Premium Economy'][Math.floor(Math.random() * 5)],
      seatsLeft: 2 + Math.floor(Math.random() * 20),
      baggage: ['15kg', '20kg', '25kg', '30kg'][Math.floor(Math.random() * 4)],
      refundable: Math.random() > 0.5,
      date,
    });
  }
  return flights.sort((a, b) => a.price - b.price);
}

router.get('/search', auth, (req, res) => {
  const { from, to, date, returnDate, passengers = 1, tripType = 'one-way' } = req.query;
  if (!from || !to) return res.status(400).json({ error: 'from and to required' });
  const outbound = generateFlights(from, to, date, parseInt(passengers));
  const inbound = tripType === 'round-trip' && returnDate ? generateFlights(to, from, returnDate, parseInt(passengers)) : [];
  res.json({ outbound, inbound, from, to, date, passengers: parseInt(passengers) });
});

router.get('/fare-calendar', auth, (req, res) => {
  const { from, to, month } = req.query;
  const calendar = [];
  const today = new Date();
  const yr = month ? parseInt(month.split('-')[0]) : today.getFullYear();
  const mo = month ? parseInt(month.split('-')[1]) - 1 : today.getMonth();
  const daysInMonth = new Date(yr, mo + 1, 0).getDate();
  const basePrice = 4000 + Math.floor(Math.random() * 8000);

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(yr, mo, d);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const variance = (Math.random() - 0.4) * 3000;
    const price = Math.max(1500, Math.round(basePrice + variance + (isWeekend ? 1500 : 0)));
    calendar.push({
      date: `${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`,
      price,
      available: Math.random() > 0.1,
      cheapest: false,
    });
  }
  // Mark cheapest
  const minPrice = Math.min(...calendar.filter(c => c.available).map(c => c.price));
  calendar.forEach(c => { if (c.price <= minPrice * 1.1) c.cheapest = true; });
  res.json({ calendar, from, to, currency: 'INR' });
});

module.exports = router;
