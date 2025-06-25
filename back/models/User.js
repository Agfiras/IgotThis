const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      default: null, // null for magic link or social
    },
    magicLinkToken: {
      type: String,
      default: null,
    },
    magicLinkExpires: {
      type: Date,
      default: null,
    },
    provider: {
      type: String, // 'local', 'github', 'google'
      default: 'local',
    },
    providerId: {
      type: String, // social provider user id
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', UserSchema); 