const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/users', auth, (req, res) => {
  const db = req.app.get('db');
  const users = db.users.map(({ password: _, ...u }) => u);
  res.json(users.filter(u => u.id !== req.user.id));
});

router.post('/follow/:userId', auth, (req, res) => {
  const db = req.app.get('db');
  const me = db.users.find(u => u.id === req.user.id);
  const target = db.users.find(u => u.id === req.params.userId);
  if (!me || !target) return res.status(404).json({ error: 'User not found' });
  const idx = me.following.indexOf(req.params.userId);
  if (idx === -1) {
    me.following.push(req.params.userId);
    target.followers.push(req.user.id);
  } else {
    me.following.splice(idx, 1);
    target.followers.splice(target.followers.indexOf(req.user.id), 1);
  }
  res.json({ following: idx === -1 });
});

router.get('/feed', auth, (req, res) => {
  const db = req.app.get('db');
  const me = db.users.find(u => u.id === req.user.id);
  const feedTrips = db.trips.filter(t =>
    t.isPublic && (me.following.includes(t.userId) || t.userId !== req.user.id)
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(feedTrips);
});

module.exports = router;
