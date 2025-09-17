const express = require('express');
const cocApi = require('../services/cocApi');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/events/war-schedule
// @desc    Get war schedule for both clans
// @access  Public
router.get('/war-schedule', async (req, res) => {
  try {
    const clanTags = [
      process.env.CLAN_TAG_1,
      process.env.CLAN_TAG_2
    ].filter(Boolean);

    const warSchedules = [];

    for (const clanTag of clanTags) {
      try {
        const currentWar = await cocApi.getCurrentWar(clanTag);
        const warLog = await cocApi.getWarLog(clanTag, 5);

        warSchedules.push({
          clanTag,
          currentWar,
          recentWars: warLog.items || []
        });
      } catch (error) {
        console.error(`Error fetching war data for ${clanTag}:`, error);
        warSchedules.push({
          clanTag,
          error: error.message
        });
      }
    }

    res.json({ warSchedules });
  } catch (error) {
    console.error('Error fetching war schedule:', error);
    res.status(500).json({ message: 'Failed to fetch war schedule' });
  }
});

// @route   GET /api/events/cwl-schedule
// @desc    Get CWL schedule and league group info
// @access  Public
router.get('/cwl-schedule', async (req, res) => {
  try {
    const clanTags = [
      process.env.CLAN_TAG_1,
      process.env.CLAN_TAG_2
    ].filter(Boolean);

    const cwlSchedules = [];

    for (const clanTag of clanTags) {
      try {
        const leagueGroup = await cocApi.getLeagueGroup(clanTag);
        cwlSchedules.push({
          clanTag,
          leagueGroup
        });
      } catch (error) {
        console.error(`Error fetching CWL data for ${clanTag}:`, error);
        cwlSchedules.push({
          clanTag,
          error: error.message
        });
      }
    }

    res.json({ cwlSchedules });
  } catch (error) {
    console.error('Error fetching CWL schedule:', error);
    res.status(500).json({ message: 'Failed to fetch CWL schedule' });
  }
});

// @route   GET /api/events/clan-games
// @desc    Get clan games information (placeholder - API doesn't provide this)
// @access  Public
router.get('/clan-games', async (req, res) => {
  try {
    // Note: Clash of Clans API doesn't provide clan games data
    // This is a placeholder for future implementation or manual data entry
    const clanGamesData = {
      message: 'Clan Games data not available via API',
      suggestion: 'This feature can be implemented with manual data entry or third-party tracking',
      upcomingEvents: [
        {
          name: 'Clan Games',
          startDate: '2023-10-15',
          endDate: '2023-10-22',
          status: 'upcoming'
        }
      ]
    };

    res.json(clanGamesData);
  } catch (error) {
    console.error('Error fetching clan games:', error);
    res.status(500).json({ message: 'Failed to fetch clan games data' });
  }
});

// @route   GET /api/events/upcoming
// @desc    Get all upcoming events
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const events = [];

    // Get current wars
    const clanTags = [
      process.env.CLAN_TAG_1,
      process.env.CLAN_TAG_2
    ].filter(Boolean);

    for (const clanTag of clanTags) {
      try {
        const currentWar = await cocApi.getCurrentWar(clanTag);
        
        if (currentWar.state === 'preparation' || currentWar.state === 'inWar') {
          events.push({
            type: 'war',
            clanTag,
            title: `War vs ${currentWar.opponent?.name || 'Unknown'}`,
            startTime: currentWar.startTime,
            endTime: currentWar.endTime,
            state: currentWar.state,
            participants: currentWar.teamSize
          });
        }
      } catch (error) {
        console.error(`Error fetching war for ${clanTag}:`, error);
      }
    }

    // Get CWL info
    for (const clanTag of clanTags) {
      try {
        const leagueGroup = await cocApi.getLeagueGroup(clanTag);
        
        if (leagueGroup && leagueGroup.rounds) {
          leagueGroup.rounds.forEach((round, index) => {
            events.push({
              type: 'cwl',
              clanTag,
              title: `CWL Round ${index + 1}`,
              startTime: round.startTime,
              endTime: round.endTime,
              warTags: round.warTags
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching CWL for ${clanTag}:`, error);
      }
    }

    // Sort events by start time
    events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    res.json({ events });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming events' });
  }
});

// @route   GET /api/events/history
// @desc    Get event history
// @access  Public
router.get('/history', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const clanTags = [
      process.env.CLAN_TAG_1,
      process.env.CLAN_TAG_2
    ].filter(Boolean);

    const history = [];

    for (const clanTag of clanTags) {
      try {
        const warLog = await cocApi.getWarLog(clanTag, parseInt(limit));
        
        if (warLog.items) {
          warLog.items.forEach(war => {
            history.push({
              type: 'war',
              clanTag,
              title: `War vs ${war.opponent?.name || 'Unknown'}`,
              startTime: war.startTime,
              endTime: war.endTime,
              result: war.result,
              teamSize: war.teamSize,
              attacks: war.attacks,
              stars: war.stars,
              destructionPercentage: war.destructionPercentage
            });
          });
        }
      } catch (error) {
        console.error(`Error fetching war history for ${clanTag}:`, error);
      }
    }

    // Sort by end time (most recent first)
    history.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

    res.json({ 
      history: history.slice(0, parseInt(limit)),
      total: history.length
    });
  } catch (error) {
    console.error('Error fetching event history:', error);
    res.status(500).json({ message: 'Failed to fetch event history' });
  }
});

module.exports = router;









