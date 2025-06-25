require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const promptsRouter = require('./routes/prompts');
const tagsRouter = require('./routes/tags');
const authRouter = require('./routes/auth');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/prompts', promptsRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
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