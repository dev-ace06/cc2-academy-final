const mongoose = require('mongoose');

const clanSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  builderBasePoints: {
    type: Number,
    required: true
  },
  members: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['open', 'inviteOnly', 'closed'],
    default: 'open'
  },
  warFrequency: {
    type: String,
    default: 'unknown'
  },
  clanWarTrophies: {
    type: Number,
    default: 0
  },
  clanCapital: {
    type: Object,
    default: {}
  },
  badgeUrls: {
    type: Object,
    default: {}
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
clanSchema.index({ tag: 1 });
clanSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Clan', clanSchema);









