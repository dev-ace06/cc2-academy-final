const express = require('express');
const Member = require('../models/Member');
const { authenticateToken } = require('../middleware/auth');
const cocApi = require('../services/cocApi');

const router = express.Router();

// @route   GET /api/members
// @desc    Get all members with search and filter options
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search = '',
      clanTag = '',
      role = '',
      townHallMin = '',
      townHallMax = '',
      sort = 'trophies',
      order = 'desc',
      limit = 50,
      offset = 0
    } = req.query;

    // Build filter object
    const filter = {};
    if (clanTag) filter.clanTag = clanTag;
    if (role) filter.role = role;
    if (townHallMin || townHallMax) {
      filter.townHallLevel = {};
      if (townHallMin) filter.townHallLevel.$gte = parseInt(townHallMin);
      if (townHallMax) filter.townHallLevel.$lte = parseInt(townHallMax);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const members = await Member.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Member.countDocuments(filter);

    res.json({
      members,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters: { search, clanTag, role, townHallMin, townHallMax }
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Failed to fetch members' });
  }
});

// @route   GET /api/members/stats
// @desc    Get member statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const { clanTag = '' } = req.query;
    const filter = clanTag ? { clanTag } : {};

    const stats = await Member.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalMembers: { $sum: 1 },
          avgTrophies: { $avg: '$trophies' },
          avgTownHall: { $avg: '$townHallLevel' },
          maxTrophies: { $max: '$trophies' },
          minTrophies: { $min: '$trophies' },
          totalWarStars: { $sum: '$warStars' },
          totalDonations: { $sum: '$donations' },
          roleDistribution: { $push: '$role' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        totalMembers: 0,
        avgTrophies: 0,
        avgTownHall: 0,
        maxTrophies: 0,
        minTrophies: 0,
        totalWarStars: 0,
        totalDonations: 0,
        roleDistribution: {}
      });
    }

    const result = stats[0];
    const roleCounts = result.roleDistribution.reduce((acc, role) => {
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalMembers: result.totalMembers,
      avgTrophies: Math.round(result.avgTrophies),
      avgTownHall: Math.round(result.avgTownHall * 10) / 10,
      maxTrophies: result.maxTrophies,
      minTrophies: result.minTrophies,
      totalWarStars: result.totalWarStars,
      totalDonations: result.totalDonations,
      roleDistribution: roleCounts
    });
  } catch (error) {
    console.error('Error fetching member stats:', error);
    res.status(500).json({ message: 'Failed to fetch member statistics' });
  }
});

// @route   GET /api/members/top
// @desc    Get top members by various criteria
// @access  Public
router.get('/top', async (req, res) => {
  try {
    const { category = 'trophies', clanTag = '', limit = 10 } = req.query;

    const filter = clanTag ? { clanTag } : {};
    const sortObj = {};
    sortObj[category] = -1;

    const topMembers = await Member.find(filter)
      .sort(sortObj)
      .limit(parseInt(limit))
      .select('name tag role clanTag townHallLevel trophies warStars donations');

    res.json({ category, members: topMembers });
  } catch (error) {
    console.error('Error fetching top members:', error);
    res.status(500).json({ message: 'Failed to fetch top members' });
  }
});

// @route   GET /api/members/:tag
// @desc    Get specific member data
// @access  Public
router.get('/:tag', async (req, res) => {
  try {
    const member = await Member.findOne({ tag: req.params.tag });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ member });
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ message: 'Failed to fetch member data' });
  }
});

// @route   GET /api/members/search/suggestions
// @desc    Get member name suggestions for search
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q = '', limit = 10 } = req.query;
    if (q.length < 2) return res.json({ suggestions: [] });

    const suggestions = await Member.find({
      name: { $regex: q, $options: 'i' }
    })
      .select('name tag clanTag')
      .limit(parseInt(limit));

    res.json({ suggestions });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({ message: 'Failed to fetch suggestions' });
  }
});

// @route   POST /api/members/sync/:clanTag
// @desc    Sync members from Clash of Clans API into MongoDB
// @access  Private (for inspector/leader later)
router.post('/sync/:clanTag', async (req, res) => {
  try {
    const { clanTag } = req.params;
    const apiData = await cocApi.getClanMembers(clanTag);

    if (!apiData.items || apiData.items.length === 0) {
      return res.status(404).json({ message: 'No members found from API' });
    }

    const bulkOps = apiData.items.map(m => {
      const formatted = cocApi.formatMemberData(m, clanTag);
      return {
        updateOne: {
          filter: { tag: formatted.tag },
          update: { $set: formatted },
          upsert: true
        }
      };
    });

    await Member.bulkWrite(bulkOps);
    res.json({ message: 'Members synced successfully', count: apiData.items.length });
  } catch (error) {
    console.error('Error syncing members:', error);
    res.status(500).json({ message: 'Failed to sync members' });
  }
});

module.exports = router;




