const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

const issueJWT = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
  // Issue JWT and redirect to frontend with token
  const token = issueJWT(req.user);
  const redirectUrl = process.env.GOOGLE_SUCCESS_REDIRECT || 'http://localhost:5173/login?token=' + token;
  res.redirect(redirectUrl + (redirectUrl.includes('?') ? '&' : '?') + 'token=' + token);
});

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, provider: 'local' });
    const token = issueJWT(user);
    res.status(201).json({ token });
  } catch {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ email, provider: 'local' });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = issueJWT(user);
    res.json({ token });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;