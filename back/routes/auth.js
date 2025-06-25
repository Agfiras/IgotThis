const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Helper: issue JWT
const issueJWT = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register - Register with email/password
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, provider: 'local' });
    const token = issueJWT(user);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login - Login with email/password
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email, provider: 'local' });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = issueJWT(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/magic-link - Request magic link
router.post('/magic-link', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const magicLink = `${process.env.MAGIC_LINK_URL}?token=${token}`;
    // Save token and expiry to user (optional, for one-time use)
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, provider: 'local' });
    }
    user.magicLinkToken = token;
    user.magicLinkExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    // Send email (stub)
    // In production, configure nodemailer with real SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: { user: 'user', pass: 'pass' },
    });
    await transporter.sendMail({
      from: 'no-reply@igotthis.com',
      to: email,
      subject: 'Your Magic Login Link',
      text: `Click to login: ${magicLink}`,
    });
    res.json({ message: 'Magic link sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send magic link' });
  }
});

// GET /api/auth/magic-link - Verify magic link
router.get('/magic-link', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, magicLinkToken: token });
    if (!user || !user.magicLinkExpires || user.magicLinkExpires < Date.now()) {
      return res.status(401).json({ error: 'Invalid or expired magic link' });
    }
    // Invalidate magic link (optional: for one-time use)
    user.magicLinkToken = null;
    user.magicLinkExpires = null;
    await user.save();
    const jwtToken = issueJWT(user);
    res.json({ token: jwtToken });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired magic link' });
  }
});

module.exports = router; 