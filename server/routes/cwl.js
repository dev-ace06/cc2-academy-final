const express = require('express');
const CWLRecord = require('../models/CWLRecord');
const { authenticateToken, requireInspector } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// @route   GET /api/cwl/records
// @desc    Get CWL records
// @access  Public
router.get('/records', async (req, res) => {
  try {
    const {
      clanTag = '',
      season = '',
      sort = 'points',
      order = 'desc',
      limit = 50,
      offset = 0
    } = req.query;

    const filter = {};

    if (clanTag) {
      filter.clanTag = clanTag;
    }

    if (season) {
      filter.season = season;
    }

    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const records = await CWLRecord.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await CWLRecord.countDocuments(filter);

    res.json({
      records,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching CWL records:', error);
    res.status(500).json({ message: 'Failed to fetch CWL records' });
  }
});

// @route   GET /api/cwl/seasons
// @desc    Get available CWL seasons
// @access  Public
router.get('/seasons', async (req, res) => {
  try {
    const seasons = await CWLRecord.distinct('season');
    res.json({ seasons: seasons.sort().reverse() });
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({ message: 'Failed to fetch seasons' });
  }
});

// @route   GET /api/cwl/promotion-demotion
// @desc    Get promotion/demotion data
// @access  Public
router.get('/promotion-demotion', async (req, res) => {
  try {
    const { season = '', clanTag = '' } = req.query;

    const filter = {};

    if (season) {
      filter.season = season;
    }

    if (clanTag) {
      filter.clanTag = clanTag;
    }

    const records = await CWLRecord.find(filter)
      .sort({ points: -1, rank: 1 });

    // Separate promoted and demoted members
    const promoted = records.filter(record => record.isPromoted);
    const demoted = records.filter(record => record.isDemoted);
    const neutral = records.filter(record => !record.isPromoted && !record.isDemoted);

    res.json({
      promoted,
      demoted,
      neutral,
      total: records.length
    });
  } catch (error) {
    console.error('Error fetching promotion/demotion data:', error);
    res.status(500).json({ message: 'Failed to fetch promotion/demotion data' });
  }
});

// @route   POST /api/cwl/records
// @desc    Create new CWL record (Inspector only)
// @access  Private (Inspector)
router.post('/records', authenticateToken, requireInspector, [
  body('memberTag').notEmpty(),
  body('memberName').notEmpty(),
  body('clanTag').notEmpty(),
  body('season').notEmpty(),
  body('townHallLevel').isInt({ min: 1, max: 15 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const recordData = {
      ...req.body,
      editedBy: req.user._id,
      lastEdited: new Date()
    };

    const record = new CWLRecord(recordData);
    await record.save();

    res.status(201).json({
      message: 'CWL record created successfully',
      record
    });
  } catch (error) {
    console.error('Error creating CWL record:', error);
    res.status(500).json({ message: 'Failed to create CWL record' });
  }
});

// @route   PUT /api/cwl/records/:id
// @desc    Update CWL record (Inspector only)
// @access  Private (Inspector)
router.put('/records/:id', authenticateToken, requireInspector, [
  body('points').optional().isInt({ min: 0 }),
  body('rank').optional().isInt({ min: 1 }),
  body('remarks').optional().isString(),
  body('isPromoted').optional().isBoolean(),
  body('isDemoted').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const updateData = {
      ...req.body,
      editedBy: req.user._id,
      lastEdited: new Date()
    };

    const record = await CWLRecord.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'CWL record not found' });
    }

    res.json({
      message: 'CWL record updated successfully',
      record
    });
  } catch (error) {
    console.error('Error updating CWL record:', error);
    res.status(500).json({ message: 'Failed to update CWL record' });
  }
});

// @route   DELETE /api/cwl/records/:id
// @desc    Delete CWL record (Inspector only)
// @access  Private (Inspector)
router.delete('/records/:id', authenticateToken, requireInspector, async (req, res) => {
  try {
    const record = await CWLRecord.findByIdAndDelete(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'CWL record not found' });
    }

    res.json({ message: 'CWL record deleted successfully' });
  } catch (error) {
    console.error('Error deleting CWL record:', error);
    res.status(500).json({ message: 'Failed to delete CWL record' });
  }
});

// @route   POST /api/cwl/bulk-update
// @desc    Bulk update CWL records (Inspector only)
// @access  Private (Inspector)
router.post('/bulk-update', authenticateToken, requireInspector, [
  body('records').isArray(),
  body('records.*.id').notEmpty(),
  body('records.*.points').optional().isInt({ min: 0 }),
  body('records.*.rank').optional().isInt({ min: 1 }),
  body('records.*.remarks').optional().isString(),
  body('records.*.isPromoted').optional().isBoolean(),
  body('records.*.isDemoted').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { records } = req.body;
    const updateResults = [];

    for (const recordUpdate of records) {
      try {
        const updateData = {
          ...recordUpdate,
          editedBy: req.user._id,
          lastEdited: new Date()
        };
        delete updateData.id; // Remove id from update data

        const record = await CWLRecord.findByIdAndUpdate(
          recordUpdate.id,
          updateData,
          { new: true, runValidators: true }
        );

        if (record) {
          updateResults.push({ id: recordUpdate.id, status: 'success' });
        } else {
          updateResults.push({ id: recordUpdate.id, status: 'not_found' });
        }
      } catch (error) {
        updateResults.push({ 
          id: recordUpdate.id, 
          status: 'error', 
          error: error.message 
        });
      }
    }

    res.json({
      message: 'Bulk update completed',
      results: updateResults
    });
  } catch (error) {
    console.error('Error bulk updating CWL records:', error);
    res.status(500).json({ message: 'Failed to bulk update CWL records' });
  }
});

module.exports = router;









