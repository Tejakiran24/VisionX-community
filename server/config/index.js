// My project configuration file
// AITS Web Development Project - 2025

// I'm learning about environment variables, but for now keeping it simple
const config = {
  // MongoDB Atlas connection string
  mongoURI: process.env.MONGODB_URI || 'mongodb+srv://Tejakiran:Teja2004@cluster0.xswame2.mongodb.net/visionx-community?retryWrites=true&w=majority',
  
  // Secret key for JSON Web Tokens
  jwtSecret: process.env.JWT_SECRET || 'aits-visionx-2025-secret',
  
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
