const mongoose = require('mongoose');

const { Schema } = mongoose;

const PromptSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // for search
    },
    body: {
      type: String,
      required: true,
      trim: true,
      index: true, // for search
    },
    tags: {
      type: [String],
      default: [],
      index: true, // for tag filtering
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  { 
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Text index for case-insensitive full-text search on title and body
PromptSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Prompt', PromptSchema); 