const mongoose = require('mongoose');

const cwlRecordSchema = new mongoose.Schema({
  memberTag: {
    type: String,
    required: true
  },
  memberName: {
    type: String,
    required: true
  },
  clanTag: {
    type: String,
    required: true
  },
  season: {
    type: String,
    required: true // Format: "2023-10" for October 2023
  },
  townHallLevel: {
    type: Number,
    required: true
  },
  builderHallLevel: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0 // Custom points added by Inspector
  },
  rank: {
    type: Number,
    default: 0
  },
  attacks: {
    type: Number,
    default: 0
  },
  stars: {
    type: Number,
    default: 0
  },
  destructionPercentage: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    default: ''
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  isDemoted: {
    type: Boolean,
    default: false
  },
  editedBy: {
    type: String, // User ID who edited
    default: null
  },
  lastEdited: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
cwlRecordSchema.index({ clanTag: 1, season: -1 });
cwlRecordSchema.index({ memberTag: 1, season: -1 });
cwlRecordSchema.index({ points: -1 });
cwlRecordSchema.index({ rank: 1 });

module.exports = mongoose.model('CWLRecord', cwlRecordSchema);









