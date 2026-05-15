const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const TIERS = [
  { name: 'Explorer', minPoints: 0, color: '#888780', perks: ['Access to community', 'Basic recommendations'] },
  { name: 'Wanderer', minPoints: 500, color: '#1D9E75', perks: ['Priority support', '5% expense insights', 'Custom avatar badge'] },
  { name: 'Globetrotter', minPoints: 2000, color: '#185FA5', perks: ['AI itinerary boost', 'Hotel affiliate discounts', 'Advanced analytics'] },
  { name: 'Legend', minPoints: 5000, color: '#c4842a', perks: ['All features unlocked', 'Early access features', 'Exclusive badge', 'Partner deals'] },
];

const ACTIONS = [
  { action: 'create_trip', points: 50, label: 'Create a trip', icon: '✈️' },
  { action: 'complete_trip', points: 200, label: 'Complete a trip', icon: '🏆' },
  { action: 'share_trip', points: 30, label: 'Share a trip publicly', icon: '🌍' },
  { action: 'invite_friend', points: 100, label: 'Invite a friend', icon: '👥' },
  { action: 'add_expense', points: 10, label: 'Log an expense', icon: '💰' },
  { action: 'write_review', points: 25, label: 'Write a trip review', icon: '⭐' },
  { action: 'upload_photo', points: 15, label: 'Add trip photos', icon: '📸' },
  { action: 'daily_login', points: 5, label: 'Daily login', icon: '📅' },
];

// In-memory loyalty store
const loyaltyStore = {};

function getUserLoyalty(userId) {
  if (!loyaltyStore[userId]) {
    loyaltyStore[userId] = {
      points: 150,
      totalEarned: 150,
      history: [
        { id: uuidv4(), action: 'create_trip', points: 50, label: 'Created first trip', date: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: uuidv4(), action: 'daily_login', points: 5, label: 'Daily login bonus', date: new Date(Date.now() - 86400000 * 2).toISOString() },
        { id: uuidv4(), action: 'add_expense', points: 10, label: 'Logged expenses', date: new Date(Date.now() - 86400000).toISOString() },
      ],
      lastLogin: new Date().toISOString(),
      streak: 3,
    };
  }
  return loyaltyStore[userId];
}

function getTier(points) {
  return [...TIERS].reverse().find(t => points >= t.minPoints) || TIERS[0];
}

function getNextTier(points) {
  return TIERS.find(t => t.minPoints > points);
}

router.get('/', auth, (req, res) => {
  const loyalty = getUserLoyalty(req.user.id);
  const tier = getTier(loyalty.points);
  const nextTier = getNextTier(loyalty.points);
  res.json({
    ...loyalty,
    tier,
    nextTier,
    pointsToNext: nextTier ? nextTier.minPoints - loyalty.points : 0,
    progress: nextTier ? Math.round(((loyalty.points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100) : 100,
    actions: ACTIONS,
    tiers: TIERS,
  });
});

router.post('/earn', auth, (req, res) => {
  const { action } = req.body;
  const actionDef = ACTIONS.find(a => a.action === action);
  if (!actionDef) return res.status(400).json({ error: 'Invalid action' });
  const loyalty = getUserLoyalty(req.user.id);
  loyalty.points += actionDef.points;
  loyalty.totalEarned += actionDef.points;
  loyalty.history.unshift({
    id: uuidv4(), action, points: actionDef.points,
    label: actionDef.label, date: new Date().toISOString()
  });
  const tier = getTier(loyalty.points);
  const nextTier = getNextTier(loyalty.points);
  res.json({ ...loyalty, tier, nextTier, pointsToNext: nextTier ? nextTier.minPoints - loyalty.points : 0, progress: nextTier ? Math.round(((loyalty.points - tier.minPoints) / (nextTier.minPoints - tier.minPoints)) * 100) : 100 });
});

module.exports = router;
