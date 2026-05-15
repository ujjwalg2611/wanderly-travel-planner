const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'travel_planner_secret_2024';

router.post('/register', async (req, res) => {
  const db = req.app.get('db');
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });
  if (db.users.find(u => u.email === email))
    return res.status(400).json({ error: 'Email already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: uuidv4(), name, email, password: hashed,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
    bio: '', location: '', followers: [], following: [],
    savedTrips: [], savedPlaces: [],
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

router.post('/login', async (req, res) => {
  const db = req.app.get('db');
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

router.get('/me', require('../middleware/auth'), (req, res) => {
  const db = req.app.get('db');
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

router.put('/profile', require('../middleware/auth'), (req, res) => {
  const db = req.app.get('db');
  const idx = db.users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const { name, bio, location } = req.body;
  if (name) db.users[idx].name = name;
  if (bio !== undefined) db.users[idx].bio = bio;
  if (location !== undefined) db.users[idx].location = location;
  const { password: _, ...safeUser } = db.users[idx];
  res.json(safeUser);
});

module.exports = router;
