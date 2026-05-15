const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const db = req.app.get('db');
  const now = new Date();
  const trips = db.trips.filter(t => t.userId === req.user.id || (t.collaborators || []).includes(req.user.id));
  const upcoming = trips.filter(t => new Date(t.startDate) > now);
  const ongoing = trips.filter(t => new Date(t.startDate) <= now && new Date(t.endDate) >= now);
  const past = trips.filter(t => new Date(t.endDate) < now);
  const expenses = db.expenses.filter(e => trips.some(t => t.id === e.tripId));
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  res.json({
    stats: {
      totalTrips: trips.length,
      upcomingTrips: upcoming.length,
      countriesVisited: [...new Set(past.map(t => t.destination))].length,
      totalSpent
    },
    upcoming: upcoming.slice(0, 3),
    ongoing: ongoing.slice(0, 2),
    past: past.slice(0, 5),
    recentActivity: trips.slice(-5).reverse()
  });
});

module.exports = router;
