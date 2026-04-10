require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const { User, Store, Rating } = require('./models'); // ensure associations run

const app = express();

// CORS
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/stores', require('./routes/storeRoutes'));
app.use('/api/owner', require('./routes/ownerRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Sync DB (only in dev, for prod use migrations)
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true })
    .then(() => console.log('Database synced'))
    .catch(err => console.error('Sync error:', err));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));