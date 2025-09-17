const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow images and videos
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov|avi/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/media/upload
// @desc    Upload media file
// @access  Private
router.post('/upload', upload.single('media'), authenticateToken, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Determine media type based on mimetype
    const isVideo = req.file.mimetype.startsWith('video/');
    const mediaType = isVideo ? 'video' : 'image';

    // Create media record
    const media = new Media({
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      category: req.body.category || 'achievement',
      type: mediaType,
      author: req.user.id,
      authorName: req.user.username || req.user.email
    });

    await media.save();

    res.json({
      message: 'Media uploaded successfully',
      media: {
        id: media._id,
        title: media.title,
        description: media.description,
        url: media.url,
        category: media.category,
        type: media.type,
        author: media.authorName,
        createdAt: media.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// @route   GET /api/media
// @desc    Get all media with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, type, page = 1, limit = 20 } = req.query;
    
    const query = { isPublic: true };
    if (category && category !== 'all') query.category = category;
    if (type) query.type = type;

    const media = await Media.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Media.countDocuments(query);

    res.json({
      media,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Failed to fetch media', error: error.message });
  }
});

// @route   GET /api/media/:id
// @desc    Get single media item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id)
      .populate('author', 'username email');

    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Increment view count
    media.views += 1;
    await media.save();

    res.json(media);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ message: 'Failed to fetch media', error: error.message });
  }
});

// @route   PUT /api/media/:id/like
// @desc    Like/unlike media
// @access  Private
router.put('/:id/like', authenticateToken, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Simple like toggle (in a real app, you'd track individual user likes)
    media.likes += 1;
    await media.save();

    res.json({ likes: media.likes });
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ message: 'Failed to like media', error: error.message });
  }
});

// @route   DELETE /api/media/:id
// @desc    Delete media
// @access  Private (only author or admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    
    if (!media) {
      return res.status(404).json({ message: 'Media not found' });
    }

    // Check if user is the author
    if (media.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this media' });
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Media.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete media', error: error.message });
  }
});

module.exports = router;
