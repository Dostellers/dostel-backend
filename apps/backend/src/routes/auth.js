const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authConfig = require('../config/authConfig');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      authConfig.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed' });
  }
});

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    const newUser = new User({
      email,
      password,
      role: 'admin' // Default to admin for initial setup
    });
    await newUser.save();
    
    const token = jwt.sign(
      { userId: newUser._id, email, role: newUser.role },
      authConfig.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed' });
  }
});

module.exports = router;