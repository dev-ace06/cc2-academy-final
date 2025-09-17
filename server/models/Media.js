const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['cwl', 'war', 'games', 'capital', 'base', 'achievement'],
    default: 'achievement'
  },
  type: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
mediaSchema.index({ category: 1, createdAt: -1 });
mediaSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);

