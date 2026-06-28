require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const gigRoutes = require('./routes/gigs');
const learningRoutes = require('./routes/learning');
const paymentRoutes = require('./routes/payments');
const aiRoutes = require('./routes/ai');
const analyticsRoutes = require('./routes/analytics');
const userRoutes = require('./routes/users');
const housingRoutes = require('./routes/housing');
const constructionRoutes = require('./routes/construction');
const notificationRoutes = require('./routes/notifications');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Global rate limit
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/housing', housingRoutes);
app.use('/api/construction', constructionRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok', platform: 'FIXR Africa' }));

app.listen(process.env.PORT || 5000, () =>
  console.log(`FIXR Backend running on port ${process.env.PORT || 5000}`)
);

module.exports = app;
