require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('./passport');
const promptsRouter = require('./routes/prompts');
const tagsRouter = require('./routes/tags');
const authRouter = require('./routes/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(passport.initialize()); // Initialize Passport

// Routes
app.use('/api/prompts', promptsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/DATA';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

module.exports = app; 