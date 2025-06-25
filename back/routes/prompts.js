const express = require('express');
const Prompt = require('../models/Prompt');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/prompts - List prompts (search, filter, pagination)
router.get('/', async (req, res) => {
  try {
    const { search, tag, page = 1, limit = 10 } = req.query;
    const query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (tag) {
      query.tags = tag;
    }
    const prompts = await Prompt.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// POST /api/prompts - Create prompt (auth required)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }
    const prompt = await Prompt.create({
      title,
      body,
      tags: Array.isArray(tags) ? tags : [],
      authorId: req.user._id,
    });
    res.status(201).json(prompt);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create prompt' });
  }
});

// GET /api/prompts/:id - Get single prompt
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prompt' });
  }
});

// PUT /api/prompts/:id - Update prompt (auth, only author)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    if (!prompt.authorId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (title) prompt.title = title;
    if (body) prompt.body = body;
    if (tags) prompt.tags = Array.isArray(tags) ? tags : [];
    await prompt.save();
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// DELETE /api/prompts/:id - Delete prompt (auth, only author)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ error: 'Prompt not found' });
    }
    if (!prompt.authorId.equals(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await prompt.deleteOne();
    res.json({ message: 'Prompt deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

module.exports = router; 