const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

app.use(cors());
app.use(express.json());

const db = { users: [], trips: [], expenses: [], comments: [], notifications: [], priceAlerts: [] };
app.set('db', db);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/trips', require('./routes/trips'));
app.use('/api/itineraries', require('./routes/itineraries'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/social', require('./routes/social'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/flights', require('./routes/flights'));
app.use('/api/hotels', require('./routes/hotels'));
app.use('/api/visa', require('./routes/visa'));
app.use('/api/loyalty', require('./routes/loyalty'));
app.use('/api/maps', require('./routes/maps'));

const authMw = require('./middleware/auth');
app.post('/api/alerts', authMw, (req, res) => {
  const { route, targetPrice } = req.body;
  const alert = { id: Date.now().toString(), userId: req.user.id, route, targetPrice, createdAt: new Date().toISOString() };
  db.priceAlerts.push(alert);
  res.json(alert);
});
app.get('/api/alerts', authMw, (req, res) => {
  res.json(db.priceAlerts.filter(a => a.userId === req.user.id));
});

io.on('connection', (socket) => {
  socket.on('join-trip', (id) => socket.join(`trip-${id}`));
  socket.on('update-itinerary', (d) => socket.to(`trip-${d.tripId}`).emit('itinerary-updated', d));
  socket.on('send-message', (d) => io.to(`trip-${d.tripId}`).emit('new-message', d));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Wanderly server on port ${PORT}`));
