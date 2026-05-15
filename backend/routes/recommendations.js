const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const recommendations = {
  adventure: [
    { name: 'Queenstown, New Zealand', rating: 4.9, type: 'Adventure Capital', image: 'https://source.unsplash.com/400x300/?queenstown,newzealand' },
    { name: 'Interlaken, Switzerland', rating: 4.8, type: 'Alpine Adventure', image: 'https://source.unsplash.com/400x300/?interlaken,switzerland' },
    { name: 'Moab, Utah', rating: 4.7, type: 'Desert Adventure', image: 'https://source.unsplash.com/400x300/?moab,utah,desert' }
  ],
  culture: [
    { name: 'Kyoto, Japan', rating: 4.9, type: 'Cultural Heritage', image: 'https://source.unsplash.com/400x300/?kyoto,japan,temple' },
    { name: 'Rome, Italy', rating: 4.8, type: 'Ancient History', image: 'https://source.unsplash.com/400x300/?rome,italy,colosseum' },
    { name: 'Marrakech, Morocco', rating: 4.7, type: 'Exotic Culture', image: 'https://source.unsplash.com/400x300/?marrakech,morocco' }
  ],
  nature: [
    { name: 'Patagonia, Argentina', rating: 4.9, type: 'Wilderness', image: 'https://source.unsplash.com/400x300/?patagonia,argentina' },
    { name: 'Banff, Canada', rating: 4.8, type: 'Mountain Lakes', image: 'https://source.unsplash.com/400x300/?banff,canada,mountains' },
    { name: 'Bali, Indonesia', rating: 4.7, type: 'Tropical Paradise', image: 'https://source.unsplash.com/400x300/?bali,indonesia,rice' }
  ],
  food: [
    { name: 'Tokyo, Japan', rating: 4.9, type: 'Culinary Hub', image: 'https://source.unsplash.com/400x300/?tokyo,japan,food' },
    { name: 'Lyon, France', rating: 4.8, type: 'Gastronomic Capital', image: 'https://source.unsplash.com/400x300/?lyon,france,food' },
    { name: 'Bangkok, Thailand', rating: 4.7, type: 'Street Food Paradise', image: 'https://source.unsplash.com/400x300/?bangkok,thailand,street,food' }
  ]
};

router.get('/', auth, (req, res) => {
  const db = req.app.get('db');
  const user = db.users.find(u => u.id === req.user.id);
  const trips = db.trips.filter(t => t.userId === req.user.id);
  const interests = trips.flatMap(t => t.interests || []);
  const primary = interests[0] || 'culture';
  const recs = [
    ...(recommendations[primary] || recommendations.culture),
    ...recommendations.nature
  ].slice(0, 6);
  res.json(recs);
});

module.exports = router;
