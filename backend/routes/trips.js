const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Generate itinerary helper
function generateItinerary(trip) {
  const days = [];
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const numDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  const activityBank = {
    adventure: ['Mountain Trekking', 'Rock Climbing', 'White Water Rafting', 'Paragliding', 'Zip Lining', 'Bungee Jumping'],
    culture: ['Museum Visit', 'Historical Walking Tour', 'Local Market', 'Temple/Church Visit', 'Art Gallery', 'Cultural Show'],
    food: ['Street Food Tour', 'Cooking Class', 'Fine Dining Experience', 'Food Market Exploration', 'Wine Tasting', 'Local Brewery'],
    nature: ['National Park Visit', 'Beach Walk', 'Botanical Garden', 'Scenic Viewpoint', 'Bird Watching', 'Sunset Cruise'],
    relaxation: ['Spa Day', 'Beach Lounging', 'Hot Springs', 'Yoga Session', 'Meditation Retreat', 'Pool Day'],
    shopping: ['Local Bazaar', 'Shopping Mall', 'Artisan Workshop', 'Souvenir Shopping', 'Night Market', 'Designer District']
  };

  const interests = trip.interests || ['culture', 'food', 'nature'];
  const pool = interests.flatMap(i => activityBank[i] || activityBank.culture);

  for (let d = 0; d < Math.min(numDays, 14); d++) {
    const date = new Date(start);
    date.setDate(date.getDate() + d);
    days.push({
      id: uuidv4(),
      day: d + 1,
      date: date.toISOString().split('T')[0],
      morning: {
        time: '08:00 - 11:00',
        activity: pool[Math.floor(Math.random() * pool.length)],
        location: trip.destination,
        notes: '',
        type: 'activity'
      },
      afternoon: {
        time: '13:00 - 17:00',
        activity: pool[Math.floor(Math.random() * pool.length)],
        location: trip.destination,
        notes: '',
        type: 'activity'
      },
      evening: {
        time: '19:00 - 22:00',
        activity: pool[Math.floor(Math.random() * pool.length)],
        location: trip.destination,
        notes: '',
        type: 'dining'
      },
      hotel: `${['Grand', 'Royal', 'Luxury', 'Boutique', 'Heritage'][d % 5]} Hotel ${trip.destination}`,
      transport: d === 0 ? 'Airport Transfer' : 'Local Transport',
      budget: Math.floor(trip.budget / numDays)
    });
  }
  return days;
}

router.get('/', auth, (req, res) => {
  const db = req.app.get('db');
  const trips = db.trips.filter(t => t.userId === req.user.id || (t.collaborators || []).includes(req.user.id));
  res.json(trips);
});

router.get('/explore', (req, res) => {
  const db = req.app.get('db');
  const publicTrips = db.trips.filter(t => t.isPublic);
  res.json(publicTrips);
});

router.post('/', auth, (req, res) => {
  const db = req.app.get('db');
  const { destination, startDate, endDate, budget, interests, travelersCount, title, description } = req.body;
  if (!destination || !startDate || !endDate)
    return res.status(400).json({ error: 'Destination and dates are required' });

  const trip = {
    id: uuidv4(),
    userId: req.user.id,
    userName: req.user.name,
    title: title || `Trip to ${destination}`,
    destination, startDate, endDate,
    budget: budget || 1000,
    interests: interests || ['culture', 'food'],
    travelersCount: travelersCount || 1,
    description: description || '',
    isPublic: false,
    collaborators: [],
    likes: [],
    comments: [],
    coverImage: `https://source.unsplash.com/800x400/?${encodeURIComponent(destination)},travel`,
    status: 'upcoming',
    createdAt: new Date().toISOString()
  };

  const itinerary = generateItinerary(trip);
  trip.itinerary = itinerary;
  db.trips.push(trip);
  res.json(trip);
});

router.get('/:id', auth, (req, res) => {
  const db = req.app.get('db');
  const trip = db.trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  res.json(trip);
});

router.put('/:id', auth, (req, res) => {
  const db = req.app.get('db');
  const idx = db.trips.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Trip not found' });
  db.trips[idx] = { ...db.trips[idx], ...req.body, id: req.params.id };
  res.json(db.trips[idx]);
});

router.delete('/:id', auth, (req, res) => {
  const db = req.app.get('db');
  const idx = db.trips.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Trip not found' });
  db.trips.splice(idx, 1);
  res.json({ success: true });
});

router.put('/:id/itinerary', auth, (req, res) => {
  const db = req.app.get('db');
  const trip = db.trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.itinerary = req.body.itinerary;
  res.json(trip);
});

router.post('/:id/like', auth, (req, res) => {
  const db = req.app.get('db');
  const trip = db.trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const likeIdx = trip.likes.indexOf(req.user.id);
  if (likeIdx === -1) trip.likes.push(req.user.id);
  else trip.likes.splice(likeIdx, 1);
  res.json({ likes: trip.likes.length, liked: likeIdx === -1 });
});

router.post('/:id/comment', auth, (req, res) => {
  const db = req.app.get('db');
  const trip = db.trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const comment = {
    id: uuidv4(),
    userId: req.user.id,
    userName: req.user.name,
    text: req.body.text,
    createdAt: new Date().toISOString()
  };
  trip.comments.push(comment);
  res.json(comment);
});

router.post('/:id/collaborate', auth, (req, res) => {
  const db = req.app.get('db');
  const trip = db.trips.find(t => t.id === req.params.id && t.userId === req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const user = db.users.find(u => u.email === req.body.email);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!trip.collaborators.includes(user.id)) trip.collaborators.push(user.id);
  res.json({ success: true, collaborator: { id: user.id, name: user.name } });
});

module.exports = router;
