const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const placeTypes = {
  restaurant: ['🍽️', 'bg-orange-100 text-orange-700'],
  hotel: ['🏨', 'bg-blue-100 text-blue-700'],
  attraction: ['🏛️', 'bg-purple-100 text-purple-700'],
  shopping: ['🛍️', 'bg-pink-100 text-pink-700'],
  transport: ['🚇', 'bg-green-100 text-green-700'],
  nature: ['🌿', 'bg-emerald-100 text-emerald-700'],
  nightlife: ['🎵', 'bg-indigo-100 text-indigo-700'],
  medical: ['🏥', 'bg-red-100 text-red-700'],
};

const nearbyPlaces = {
  'Paris': [
    { name: 'Eiffel Tower', type: 'attraction', rating: 4.7, distance: '0.8 km', address: 'Champ de Mars, Paris', open: true, lat: 48.8584, lng: 2.2945 },
    { name: 'Le Jules Verne', type: 'restaurant', rating: 4.5, distance: '0.9 km', address: 'Eiffel Tower, Paris', open: true, lat: 48.858, lng: 2.294 },
    { name: 'Louvre Museum', type: 'attraction', rating: 4.8, distance: '2.1 km', address: 'Rue de Rivoli, Paris', open: false, lat: 48.8606, lng: 2.3376 },
    { name: 'Galeries Lafayette', type: 'shopping', rating: 4.4, distance: '3.2 km', address: 'Bd Haussmann, Paris', open: true, lat: 48.8735, lng: 2.3320 },
    { name: 'Montmartre', type: 'attraction', rating: 4.6, distance: '3.8 km', address: 'Montmartre, Paris', open: true, lat: 48.8867, lng: 2.3431 },
    { name: 'Seine River Cruise', type: 'attraction', rating: 4.5, distance: '0.5 km', address: 'Port de la Bourdonnais', open: true, lat: 48.8591, lng: 2.2931 },
  ],
  'Tokyo': [
    { name: 'Senso-ji Temple', type: 'attraction', rating: 4.7, distance: '1.2 km', address: 'Asakusa, Tokyo', open: true, lat: 35.7148, lng: 139.7967 },
    { name: 'Tsukiji Outer Market', type: 'restaurant', rating: 4.6, distance: '2.5 km', address: 'Tsukiji, Tokyo', open: true, lat: 35.6654, lng: 139.7707 },
    { name: 'Shinjuku Gyoen', type: 'nature', rating: 4.6, distance: '4.0 km', address: 'Shinjuku, Tokyo', open: true, lat: 35.6852, lng: 139.7100 },
    { name: 'Akihabara', type: 'shopping', rating: 4.4, distance: '3.5 km', address: 'Akihabara, Tokyo', open: true, lat: 35.6987, lng: 139.7742 },
  ],
  'default': [
    { name: 'City Central Park', type: 'nature', rating: 4.3, distance: '0.5 km', address: 'City Center', open: true, lat: 0, lng: 0 },
    { name: 'Grand Palace Hotel', type: 'hotel', rating: 4.5, distance: '0.3 km', address: 'Main Street', open: true, lat: 0, lng: 0 },
    { name: 'Local Market', type: 'shopping', rating: 4.1, distance: '0.8 km', address: 'Market Street', open: true, lat: 0, lng: 0 },
    { name: 'Heritage Museum', type: 'attraction', rating: 4.4, distance: '1.2 km', address: 'Heritage Lane', open: false, lat: 0, lng: 0 },
    { name: 'Riverside Restaurant', type: 'restaurant', rating: 4.6, distance: '1.5 km', address: 'River Road', open: true, lat: 0, lng: 0 },
  ]
};

router.get('/nearby', auth, (req, res) => {
  const { destination, type } = req.query;
  const key = Object.keys(nearbyPlaces).find(k => destination?.toLowerCase().includes(k.toLowerCase())) || 'default';
  let places = nearbyPlaces[key].map((p, i) => ({
    ...p,
    id: `place_${i}`,
    emoji: placeTypes[p.type]?.[0] || '📍',
    badgeClass: placeTypes[p.type]?.[1] || 'bg-gray-100 text-gray-700',
    reviews: 50 + Math.floor(Math.random() * 2000),
    priceLevel: ['Free', '$', '$$', '$$$'][Math.floor(Math.random() * 4)],
  }));
  if (type && type !== 'all') places = places.filter(p => p.type === type);
  res.json({ places, destination });
});

router.get('/route', auth, (req, res) => {
  const { origin, destination } = req.query;
  res.json({
    distance: `${(2 + Math.random() * 50).toFixed(1)} km`,
    duration: `${15 + Math.floor(Math.random() * 120)} mins`,
    mode: 'driving',
    mapsUrl: `https://www.google.com/maps/dir/${encodeURIComponent(origin || '')}/${encodeURIComponent(destination || '')}`,
  });
});

module.exports = router;
