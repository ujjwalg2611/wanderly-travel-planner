const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

router.get('/:tripId', auth, (req, res) => {
  const db = req.app.get('db');
  const expenses = db.expenses.filter(e => e.tripId === req.params.tripId);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  res.json({ expenses, total, byCategory });
});

router.post('/:tripId', auth, (req, res) => {
  const db = req.app.get('db');
  const { title, amount, category, date, paidBy, splitWith, notes } = req.body;
  const expense = {
    id: uuidv4(),
    tripId: req.params.tripId,
    userId: req.user.id,
    title, amount: parseFloat(amount),
    category: category || 'other',
    date: date || new Date().toISOString().split('T')[0],
    paidBy: paidBy || req.user.name,
    splitWith: splitWith || [],
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  db.expenses.push(expense);
  res.json(expense);
});

router.delete('/:tripId/:id', auth, (req, res) => {
  const db = req.app.get('db');
  const idx = db.expenses.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Expense not found' });
  db.expenses.splice(idx, 1);
  res.json({ success: true });
});

module.exports = router;
