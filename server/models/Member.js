const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['leader', 'coLeader', 'admin', 'member'],
    required: true
  },
  clanTag: {
    type: String,
    required: true
  },
  townHallLevel: {
    type: Number,
    required: true
  },
  builderHallLevel: {
    type: Number,
    default: 0
  },
  trophies: {
    type: Number,
    required: true
  },
  builderTrophies: {
    type: Number,
    default: 0
  },
  warStars: {
    type: Number,
    required: true
  },
  donations: {
    type: Number,
    required: true
  },
  donationsReceived: {
    type: Number,
    required: true
  },
  lastSeen: {
    type: Date,
    required: true
  },
  league: {
    type: Object,
    default: {}
  },
  builderBaseLeague: {
    type: Object,
    default: {}
  },
  clanCapitalContributions: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
memberSchema.index({ clanTag: 1 });
memberSchema.index({ role: 1 });
memberSchema.index({ townHallLevel: -1 });
memberSchema.index({ trophies: -1 });
memberSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Member', memberSchema);








