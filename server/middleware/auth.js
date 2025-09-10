const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Log request headers for debugging
    console.log('🔒 Auth middleware - Headers:', {
      authorization: req.header('Authorization'),
      xAuthToken: req.header('x-auth-token')
    });

    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                 req.header('x-auth-token'); // Support both header formats
    
    if (!token) {
      console.warn('❌ No token provided in request headers');
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      // Verify token using the same secret as authController
      const decoded = jwt.verify(token, require('../config').jwtSecret);
      console.log('✅ Token verified successfully:', decoded);
      
      if (!decoded.user || !decoded.user.id) {
        console.error('❌ Invalid token structure:', decoded);
        return res.status(401).json({ msg: 'Invalid token structure' });
      }

      // Set the full user object from the token
      req.user = decoded.user;
      next();
    } catch (tokenError) {
      console.error('❌ Token verification failed:', tokenError.message);
      return res.status(401).json({ msg: 'Token is not valid' });
    }
  } catch (err) {
    console.error('❌ Auth middleware error:', err);
    res.status(500).json({ msg: 'Server error during authentication' });
  }
};

module.exports = auth;
