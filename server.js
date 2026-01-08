
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const noteRoutes = require('./routes/notes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/notes', noteRoutes);

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Database & Server Initialization
const PORT = process.env.PORT || 5000;

/** 
 * CONNECTION LOGIC: 
 * The app looks for MONGO_URI in your .env file first.
 * If not found, it defaults to a local MongoDB instance.
 */
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saas-bundle';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Critical Error: MongoDB connection failed!');
    console.error('Make sure your MONGO_URI in the .env file is correct.');
    console.error(err);
    process.exit(1);
  });
