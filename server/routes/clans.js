const express = require('express');
const Clan = require('../models/Clan');
const Member = require('../models/Member');
const cocApi = require('../services/cocApi');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/clans
// @desc    Get all clans data
// @access  Public
router.get('/', async (req, res) => {
  try {
    const clans = await Clan.find().sort({ name: 1 });
    res.json({ clans });
  } catch (error) {
    console.error('Error fetching clans:', error);
    res.status(500).json({ message: 'Failed to fetch clans' });
  }
});

// @route   GET /api/clans/overview
// @desc    Get clan overview with comparison data
// @access  Public
router.get('/overview', async (req, res) => {
  try {
    const clans = await Clan.find().sort({ name: 1 });
    
    if (clans.length === 0) {
      return res.json({ 
        message: 'No clan data available. Please sync with Clash of Clans API.',
        clans: []
      });
    }

    // Get member counts for each clan
    const clanData = await Promise.all(
      clans.map(async (clan) => {
        const memberCount = await Member.countDocuments({ clanTag: clan.tag });
        return {
          ...clan.toObject(),
          actualMemberCount: memberCount
        };
      })
    );

    res.json({ clans: clanData });
  } catch (error) {
    console.error('Error fetching clan overview:', error);
    res.status(500).json({ message: 'Failed to fetch clan overview' });
  }
});

// @route   POST /api/clans/sync
// @desc    Sync clan data from Clash of Clans API
// @access  Private (Admin only)
router.post('/sync', authenticateToken, async (req, res) => {
  try {
    const clanTags = [
      process.env.CLAN_TAG_1,
      process.env.CLAN_TAG_2
    ].filter(Boolean);

    if (clanTags.length === 0) {
      return res.status(400).json({ 
        message: 'No clan tags configured in environment variables' 
      });
    }

    const syncResults = [];

    for (const clanTag of clanTags) {
      try {
        // Fetch clan data from API
        const clanData = await cocApi.getClan(clanTag);
        const formattedClanData = cocApi.formatClanData(clanData);

        // Update or create clan in database
        const clan = await Clan.findOneAndUpdate(
          { tag: clanData.tag },
          formattedClanData,
          { upsert: true, new: true }
        );

        // Fetch and update members
        const membersData = await cocApi.getClanMembers(clanTag);
        const memberUpdates = membersData.items.map(member => 
          cocApi.formatMemberData(member, clanTag)
        );

        // Bulk update members
        for (const memberData of memberUpdates) {
          await Member.findOneAndUpdate(
            { tag: memberData.tag },
            memberData,
            { upsert: true, new: true }
          );
        }

        // Remove members who are no longer in the clan
        const currentMemberTags = memberUpdates.map(m => m.tag);
        await Member.deleteMany({
          clanTag: clanTag,
          tag: { $nin: currentMemberTags }
        });

        syncResults.push({
          clanTag,
          clanName: clan.name,
          membersUpdated: memberUpdates.length,
          status: 'success'
        });

      } catch (error) {
        console.error(`Error syncing clan ${clanTag}:`, error);
        syncResults.push({
          clanTag,
          status: 'error',
          error: error.message
        });
      }
    }

    res.json({
      message: 'Clan sync completed',
      results: syncResults,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Error syncing clans:', error);
    res.status(500).json({ message: 'Failed to sync clan data' });
  }
});

// @route   GET /api/clans/:tag
// @desc    Get specific clan data
// @access  Public
router.get('/:tag', async (req, res) => {
  try {
    const clan = await Clan.findOne({ tag: req.params.tag });
    
    if (!clan) {
      return res.status(404).json({ message: 'Clan not found' });
    }

    const memberCount = await Member.countDocuments({ clanTag: req.params.tag });
    
    res.json({
      clan: {
        ...clan.toObject(),
        actualMemberCount: memberCount
      }
    });
  } catch (error) {
    console.error('Error fetching clan:', error);
    res.status(500).json({ message: 'Failed to fetch clan data' });
  }
});

// @route   GET /api/clans/:tag/members
// @desc    Get clan members
// @access  Public
router.get('/:tag/members', async (req, res) => {
  try {
    const { sort = 'trophies', order = 'desc', limit = 50, offset = 0 } = req.query;
    
    const sortObj = {};
    sortObj[sort] = order === 'desc' ? -1 : 1;

    const members = await Member.find({ clanTag: req.params.tag })
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Member.countDocuments({ clanTag: req.params.tag });

    res.json({
      members,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching clan members:', error);
    res.status(500).json({ message: 'Failed to fetch clan members' });
  }
});

// @route   GET /api/clans/:tag/war
// @desc    Get current war data
// @access  Public
router.get('/:tag/war', async (req, res) => {
  try {
    const warData = await cocApi.getCurrentWar(req.params.tag);
    res.json({ war: warData });
  } catch (error) {
    console.error('Error fetching war data:', error);
    res.status(500).json({ message: 'Failed to fetch war data' });
  }
});

// @route   GET /api/clans/:tag/warlog
// @desc    Get war log
// @access  Public
router.get('/:tag/warlog', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const warLog = await cocApi.getWarLog(req.params.tag, parseInt(limit));
    res.json({ warLog });
  } catch (error) {
    console.error('Error fetching war log:', error);
    res.status(500).json({ message: 'Failed to fetch war log' });
  }
});

module.exports = router;








