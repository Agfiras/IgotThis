const express = require('express');
const Prompt = require('../models/Prompt');

const router = express.Router();

// GET /api/tags - List all unique tags
router.get('/', async (req, res) => {
  // TODO: Aggregate all unique tags from prompts
  res.json({ message: 'List tags (to implement)' });
});

module.exports = router; 