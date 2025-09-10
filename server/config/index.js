// My project configuration file
// AITS Web Development Project - 2025

const config = {
  // MongoDB Atlas connection string (must be set in environment variables)
  mongoURI: process.env.MONGODB_URI,
  
  // Secret key for JSON Web Tokens (must be set in environment variables)
  jwtSecret: process.env.JWT_SECRET,
  
  // Token expires in 24 hours
  jwtExpiration: '24h',
  
  // Project details
  projectName: 'VisionX Developer Community',
  college: 'Annamacharya Institute of Technology and Sciences',
  author: '[Your Name]',
  class: 'B.Tech CSE',
  year: '2025'
};

// Export the config so other files can use it
module.exports = config;
