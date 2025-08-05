const express = require('express');
const cors = require('cors');

// In-memory storage
const db = {
  users: [],
  questions: [],
  projects: []
};

// Export db for controllers
module.exports.db = db;

const app = express();

// Enable CORS with more specific configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://visionx-community.onrender.com'
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Load some initial test data
const testData = require('./test-data');
db.questions.push(...testData.questions);
db.projects.push(...testData.projects);
db.users.push(...testData.users);

console.log('✅ In-memory database initialized');

const path = require('path');

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/projects', require('./routes/projects'));

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    if (req.url.startsWith('/api')) {
      res.status(404).send('API endpoint not found');
      return;
    }
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', err);
  }
});
