const express = require('express');
const Prompt = require('../models/Prompt');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tags = await Prompt.distinct('tags');
    res.json(tags);
  } catch {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

module.exports = router;