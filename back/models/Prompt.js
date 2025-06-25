const mongoose = require('mongoose');
const { Schema } = mongoose;

const PromptSchema = new Schema({
  title: { type: String, required: true, trim: true, index: true },
  body: { type: String, required: true, trim: true, index: true },
  tags: { type: [String], default: [], index: true },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true });

PromptSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Prompt', PromptSchema);