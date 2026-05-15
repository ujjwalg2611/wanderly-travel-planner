const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const visaData = {
  'India-France': { type: 'Schengen Visa', required: true, fee: '€80', processing: '15-20 days', validity: '90 days in 180 days', docs: ['Passport (6mo+ valid)', 'Bank statements (3 months)', 'Hotel bookings', 'Flight itinerary', 'Travel insurance', 'ITR / Salary slips'], tips: 'Apply 3-4 weeks before travel. VFS Global handles applications.', difficulty: 'Medium' },
  'India-Japan': { type: 'Tourist Visa', required: true, fee: '¥3,000', processing: '5-7 days', validity: '30 days', docs: ['Passport', 'Bank statements', 'Employment letter', 'Hotel bookings', 'Return flight'], tips: 'Japan is visa-friendly for Indian passport holders. Process is quick.', difficulty: 'Easy' },
  'India-UAE': { type: 'Visa on Arrival', required: true, fee: 'Free', processing: 'On arrival', validity: '30 days', docs: ['Valid passport', 'Return ticket', 'Sufficient funds'], tips: 'Indian passport holders get free visa on arrival in UAE.', difficulty: 'Very Easy' },
  'India-Thailand': { type: 'Visa on Arrival', required: true, fee: '₹2,000', processing: 'On arrival', validity: '15 days', docs: ['Passport', 'Photo', 'Return ticket', 'Cash (10,000 THB)'], tips: 'VOA available. E-Visa recommended for easier process.', difficulty: 'Very Easy' },
  'India-UK': { type: 'Standard Visitor Visa', required: true, fee: '£115', processing: '15 business days', validity: 'Up to 6 months', docs: ['Passport', 'Bank statements (6 months)', 'Employment proof', 'Property documents', 'Travel history'], tips: 'Strong financial ties to India improve approval chances.', difficulty: 'Hard' },
  'India-USA': { type: 'B1/B2 Tourist Visa', required: true, fee: '$160', processing: '1-3 months (varies)', validity: '10 years / 6 months per visit', docs: ['Passport', 'DS-160 form', 'Bank statements', 'Employment letter', 'Property documents', 'Strong ties to India'], tips: 'Interview required. Appointment wait times can be 6-18 months.', difficulty: 'Very Hard' },
  'India-Singapore': { type: 'e-Visa', required: true, fee: 'SGD 30', processing: '3-5 days', validity: '30 days', docs: ['Passport', 'Photo', 'Bank statements', 'Return flight'], tips: 'Easy online e-Visa. Approval is usually quick.', difficulty: 'Easy' },
  'India-Bali': { type: 'Visa on Arrival', required: true, fee: '$35', processing: 'On arrival', validity: '30 days (extendable)', docs: ['Passport (6mo+ valid)', 'Return ticket', 'Proof of funds'], tips: 'Very easy for Indians. Can extend for another 30 days.', difficulty: 'Very Easy' },
  'India-Maldives': { type: 'Free Visa on Arrival', required: false, fee: 'Free', processing: 'On arrival', validity: '30 days', docs: ['Valid passport', 'Return ticket', 'Hotel booking'], tips: 'Completely free and hassle-free for Indian passport holders.', difficulty: 'None' },
  'default': { type: 'Visa Required', required: true, fee: 'Varies', processing: '2-4 weeks', validity: 'Varies', docs: ['Valid passport', 'Completed visa application', 'Passport photos', 'Bank statements', 'Travel itinerary', 'Accommodation proof'], tips: 'Check the official embassy website for latest requirements.', difficulty: 'Medium' }
};

const difficultyColors = { 'None': '#0F6E56', 'Very Easy': '#22c55e', 'Easy': '#84cc16', 'Medium': '#f59e0b', 'Hard': '#ef4444', 'Very Hard': '#991b1b' };

router.get('/check', auth, (req, res) => {
  const { passport, destination } = req.query;
  if (!passport || !destination) return res.status(400).json({ error: 'passport and destination required' });
  const destCountry = destination.split(',').pop().trim();
  const key = `${passport}-${destCountry}`;
  const data = visaData[key] || visaData['default'];
  res.json({
    ...data,
    passport,
    destination: destCountry,
    difficultyColor: difficultyColors[data.difficulty] || '#f59e0b',
    embassyUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(destCountry)}_visa_policy`,
  });
});

router.get('/countries', auth, (req, res) => {
  const countries = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Singapore', 'UAE'];
  res.json(countries);
});

module.exports = router;
