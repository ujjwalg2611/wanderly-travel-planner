const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/:tripId', auth, (req, res) => {
  const db = req.app.get('db');
  const trip = db.trips.find(t => t.id === req.params.tripId);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json(trip.itinerary || []);
});

router.put('/:tripId/day/:dayId', auth, (req, res) => {
  const db = req.app.get('db');
  const trip = db.trips.find(t => t.id === req.params.tripId);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const dayIdx = (trip.itinerary || []).findIndex(d => d.id === req.params.dayId);
  if (dayIdx === -1) return res.status(404).json({ error: 'Day not found' });
  trip.itinerary[dayIdx] = { ...trip.itinerary[dayIdx], ...req.body };
  res.json(trip.itinerary[dayIdx]);
});

module.exports = router;
