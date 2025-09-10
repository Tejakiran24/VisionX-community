const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

// Register user
exports.register = async (req, res) => {
  try {
    console.log('📝 Received registration request');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.error('❌ Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check if user exists
    console.log('🔍 Checking if user exists:', email);
    let user = await User.findOne({ email });
    if (user) {
      console.log('❌ User already exists:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    console.log('👤 Creating new user instance');
    user = new User({
      name,
      email,
      password,
      role: 'beginner',
      points: 0
    });

    // Hash password
    console.log('🔒 Hashing password');
    try {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    } catch (err) {
      console.error('❌ Password hashing error:', err);
      return res.status(500).json({ msg: 'Error processing password' });
    }

    // Save user
    console.log('💾 Saving user to database');
    try {
      await user.save();
      console.log('✅ User saved successfully:', user.email);
    } catch (err) {
      console.error('❌ Database save error:', err);
      if (err.code === 11000) {
        return res.status(400).json({ msg: 'Email already exists' });
      }
      return res.status(500).json({ msg: 'Error saving user to database' });
    }

    // Create and return JWT token
    console.log('🎫 Generating JWT token');
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
      }
    };

    try {
      const token = jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: config.jwtExpiration }
      );
      
      console.log('✅ Token generated successfully');
      console.log('🔑 Token payload:', payload);
      
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error('❌ Token generation error:', err);
      return res.status(500).json({ msg: 'Error generating authentication token' });
    }
  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log('🔐 Received login request');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('❌ Missing required fields:', { email: !!email, password: !!password });
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check if user exists
    console.log('🔍 Looking up user:', email);
    let user;
    try {
      user = await User.findOne({ email });
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('❌ Database lookup error:', err);
      return res.status(500).json({ msg: 'Error checking user credentials' });
    }

    // Validate password
    console.log('🔒 Validating password');
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('❌ Invalid password for:', email);
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('❌ Password validation error:', err);
      return res.status(500).json({ msg: 'Error validating credentials' });
    }

    // Create and return JWT token
    console.log('🎫 Generating JWT token');
    const payload = {
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    };

    try {
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: config.jwtExpiration },
        (err, token) => {
          if (err) {
            console.error('❌ Token signing error:', err);
            throw err;
          }
          console.log('✅ Login successful, token generated');
          res.json({ token });
        }
      );
    } catch (err) {
      console.error('❌ Token generation error:', err);
      return res.status(500).json({ msg: 'Error generating authentication token' });
    }
  } catch (err) {
    console.error('❌ Unhandled login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('❌ Get user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
