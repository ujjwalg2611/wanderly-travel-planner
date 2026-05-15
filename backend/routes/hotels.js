const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const hotelBrands = ['Marriott', 'Hilton', 'Hyatt', 'ITC', 'Taj', 'Oberoi', 'Radisson', 'Novotel', 'Ibis', 'Le Meridien', 'Sheraton', 'Four Seasons', 'Ritz-Carlton', 'Courtyard', 'Holiday Inn'];
const amenities = ['Pool', 'Spa', 'Gym', 'Free WiFi', 'Restaurant', 'Bar', 'Airport Shuttle', 'Parking', 'Room Service', 'Conference Room', 'Laundry', 'Concierge'];
const neighborhoods = ['City Center', 'Old Town', 'Beach Front', 'Business District', 'Arts Quarter', 'Airport Area', 'Historic District', 'Waterfront'];

const hotelImages = {
  'Paris': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
  'Tokyo': 'https://images.unsplash.com/photo-1569245591149-6c3f4a70c3e9?w=400',
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
  'London': 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=400',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
  'default': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
};

function generateHotels(destination, checkin, checkout, guests = 1) {
  const nights = checkin && checkout
    ? Math.max(1, Math.ceil((new Date(checkout) - new Date(checkin)) / 86400000))
    : 3;
  const imgKey = Object.keys(hotelImages).find(k => destination?.toLowerCase().includes(k.toLowerCase())) || 'default';
  const hotels = [];

  for (let i = 0; i < 8; i++) {
    const stars = 2 + Math.floor(Math.random() * 4);
    const brand = hotelBrands[Math.floor(Math.random() * hotelBrands.length)];
    const pricePerNight = stars === 2 ? 1500 + Math.floor(Math.random() * 1500)
      : stars === 3 ? 3000 + Math.floor(Math.random() * 2000)
      : stars === 4 ? 6000 + Math.floor(Math.random() * 4000)
      : 12000 + Math.floor(Math.random() * 15000);
    const hotelAmenities = amenities.sort(() => Math.random() - 0.5).slice(0, 4 + Math.floor(Math.random() * 5));
    const rating = (3.5 + Math.random() * 1.4).toFixed(1);
    const reviews = 50 + Math.floor(Math.random() * 2000);

    hotels.push({
      id: uuidv4(),
      name: `${brand} ${destination?.split(',')[0] || 'City'}`,
      brand,
      stars,
      rating: parseFloat(rating),
      reviews,
      neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
      address: `${10 + Math.floor(Math.random() * 200)}, ${neighborhoods[i % neighborhoods.length]}, ${destination}`,
      image: hotelImages[imgKey],
      images: [hotelImages[imgKey], hotelImages['default']],
      pricePerNight,
      totalPrice: pricePerNight * nights,
      nights,
      amenities: hotelAmenities,
      roomType: ['Standard Room', 'Deluxe Room', 'Superior Room', 'Suite'][Math.floor(Math.random() * 4)],
      cancellation: Math.random() > 0.4 ? 'Free cancellation' : 'Non-refundable',
      breakfastIncluded: Math.random() > 0.5,
      available: Math.random() > 0.1,
      distance: `${(0.2 + Math.random() * 5).toFixed(1)} km from center`,
      affiliateUrl: `https://www.booking.com/search.html?ss=${encodeURIComponent(destination)}`,
    });
  }
  return hotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
}

router.get('/search', auth, (req, res) => {
  const { destination, checkin, checkout, guests = 1, minPrice, maxPrice, stars: filterStars } = req.query;
  if (!destination) return res.status(400).json({ error: 'destination required' });
  let hotels = generateHotels(destination, checkin, checkout, parseInt(guests));
  if (minPrice) hotels = hotels.filter(h => h.pricePerNight >= parseInt(minPrice));
  if (maxPrice) hotels = hotels.filter(h => h.pricePerNight <= parseInt(maxPrice));
  if (filterStars) hotels = hotels.filter(h => h.stars >= parseInt(filterStars));
  res.json({ hotels, destination, checkin, checkout, guests: parseInt(guests) });
});

router.get('/:id', auth, (req, res) => {
  res.json({ id: req.params.id, message: 'Hotel detail - connect real API for production' });
});

module.exports = router;
