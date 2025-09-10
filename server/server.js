require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Import routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const projectRoutes = require('./routes/projects');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/projects', projectRoutes);

// Health check
app.get('/api/health', (_, res) => {
  res.json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  // Handle route parsing errors
  if (err instanceof TypeError && err.message.includes('Missing parameter')) {
    return res.status(400).json({ 
      message: 'Invalid route parameters',
      path: req.path,
      method: req.method
    });
  }

  // Handle other errors
  res.status(500).json({
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
