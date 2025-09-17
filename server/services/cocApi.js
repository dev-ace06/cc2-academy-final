const axios = require('axios');

class ClashOfClansAPI {
  constructor() {
    this.baseURL = process.env.COC_API_BASE_URL || 'https://api.clashofclans.com/v1';
    this.apiKey = process.env.COC_API_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️  COC_API_KEY not found in environment variables');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  // Get clan information
  async getClan(clanTag) {
    try {
      const response = await this.client.get(`/clans/${encodeURIComponent(clanTag)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clan:', error.response?.data || error.message);
      throw new Error(`Failed to fetch clan data: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get clan members
  async getClanMembers(clanTag) {
    try {
      const response = await this.client.get(`/clans/${encodeURIComponent(clanTag)}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching clan members:', error.response?.data || error.message);
      throw new Error(`Failed to fetch clan members: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get current war
  async getCurrentWar(clanTag) {
    try {
      const response = await this.client.get(`/clans/${encodeURIComponent(clanTag)}/currentwar`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current war:', error.response?.data || error.message);
      throw new Error(`Failed to fetch current war: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get war log
  async getWarLog(clanTag, limit = 10) {
    try {
      const response = await this.client.get(`/clans/${encodeURIComponent(clanTag)}/warlog?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching war log:', error.response?.data || error.message);
      throw new Error(`Failed to fetch war log: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get league group (CWL)
  async getLeagueGroup(clanTag) {
    try {
      const response = await this.client.get(`/clans/${encodeURIComponent(clanTag)}/currentwar/leaguegroup`);
      return response.data;
    } catch (error) {
      console.error('Error fetching league group:', error.response?.data || error.message);
      throw new Error(`Failed to fetch league group: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get league war
  async getLeagueWar(warTag) {
    try {
      const response = await this.client.get(`/clanwarleagues/wars/${encodeURIComponent(warTag)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching league war:', error.response?.data || error.message);
      throw new Error(`Failed to fetch league war: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get player information
  async getPlayer(playerTag) {
    try {
      const response = await this.client.get(`/players/${encodeURIComponent(playerTag)}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching player:', error.response?.data || error.message);
      throw new Error(`Failed to fetch player data: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get clan capital raids
  async getClanCapitalRaidSeasons(clanTag, limit = 5) {
    try {
      const response = await this.client.get(`/clans/${encodeURIComponent(clanTag)}/capitalraidseasons?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching capital raids:', error.response?.data || error.message);
      throw new Error(`Failed to fetch capital raids: ${error.response?.data?.message || error.message}`);
    }
  }

  // Helper method to format clan data for our database
  formatClanData(clanData) {
    return {
      tag: clanData.tag,
      name: clanData.name,
      level: clanData.clanLevel,
      points: clanData.clanPoints,
      builderBasePoints: clanData.clanBuilderBasePoints,
      members: clanData.members,
      description: clanData.description || '',
      location: clanData.location?.name || '',
      type: clanData.type,
      warFrequency: clanData.warFrequency,
      clanWarTrophies: clanData.clanWarTrophies,
      clanCapital: clanData.clanCapital || {},
      badgeUrls: clanData.badgeUrls || {},
      lastUpdated: new Date()
    };
  }

  // Helper method to format member data for our database
  formatMemberData(memberData, clanTag) {
    return {
      tag: memberData.tag,
      name: memberData.name,
      role: memberData.role,
      clanTag: clanTag,
      townHallLevel: memberData.townHallLevel,
      builderHallLevel: memberData.builderHallLevel || 0,
      trophies: memberData.trophies,
      builderTrophies: memberData.builderTrophies || 0,
      warStars: memberData.warStars,
      donations: memberData.donations,
      donationsReceived: memberData.donationsReceived,
      lastSeen: memberData.lastSeen ? new Date(memberData.lastSeen) : new Date(),
      league: memberData.league || {},
      builderBaseLeague: memberData.builderBaseLeague || {},
      clanCapitalContributions: memberData.clanCapitalContributions || 0,
      lastUpdated: new Date()
    };
  }
}

module.exports = new ClashOfClansAPI();





