import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  Shield, 
  MapPin, 
  Calendar,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Clans = () => {
  const [clans, setClans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchClans();
  }, []);

  const fetchClans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/clans/overview');
      setClans(response.data.clans);
    } catch (error) {
      console.error('Error fetching clans:', error);
      toast.error('Failed to load clan data');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const response = await axios.post('/api/clans/sync');
      toast.success('Clan data synced successfully!');
      await fetchClans(); // Refresh data after sync
    } catch (error) {
      console.error('Error syncing clans:', error);
      toast.error('Failed to sync clan data');
    } finally {
      setSyncing(false);
    }
  };

  const getComparisonIcon = (value1, value2) => {
    if (value1 > value2) return <TrendingUp className="w-4 h-4 text-coc-green" />;
    if (value1 < value2) return <TrendingDown className="w-4 h-4 text-coc-red" />;
    return <Minus className="w-4 h-4 text-coc-gray-500" />;
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-coc-gray-600 dark:text-coc-gray-400">
            Loading clan data...
          </p>
        </div>
      </div>
    );
  }

  if (clans.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white mb-4">
          No Clan Data Available
        </h2>
        <p className="text-coc-gray-600 dark:text-coc-gray-400 mb-6">
          Sync with Clash of Clans API to load clan information.
        </p>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="btn-primary"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Data
            </>
          )}
        </button>
      </div>
    );
  }

  const [clan1, clan2] = clans;

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-coc-gray-900 dark:text-white mb-2">
            Clan Overview
          </h1>
          <p className="text-sm sm:text-base text-coc-gray-600 dark:text-coc-gray-400">
            Compare and analyze your clan statistics
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-coc-blue text-white rounded-lg hover:bg-coc-blue-dark transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
        >
          {syncing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Sync Data</span>
            </>
          )}
        </button>
      </div>

      {/* Clan Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {[clan1, clan2].map((clan, index) => (
          <div key={clan?._id || index} className="card animate-fadeIn p-4 sm:p-6">
            {clan ? (
              <>
                {/* Clan Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    {clan.badgeUrls?.large && (
                      <img 
                        src={clan.badgeUrls.large} 
                        alt={`${clan.name} badge`}
                        className="w-12 h-12 sm:w-16 sm:h-16"
                      />
                    )}
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white">
                        {clan.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                        {clan.tag}
                      </p>
                      {clan.location && (
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-coc-gray-400" />
                          <span className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                            {clan.location}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-3xl font-bold text-coc-gold">
                      Level {clan.level}
                    </div>
                    <div className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                      Clan Level
                    </div>
                  </div>
                </div>

                {/* Clan Stats Grid */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-coc-gold" />
                      {clan2 && getComparisonIcon(clan.points, clan2.points)}
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white">
                      {formatNumber(clan.points)}
                    </div>
                    <div className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                      Trophies
                    </div>
                  </div>

                  <div className="bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-coc-blue" />
                      {clan2 && getComparisonIcon(clan.actualMemberCount || clan.members, clan2.actualMemberCount || clan2.members)}
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white">
                      {clan.actualMemberCount || clan.members}
                    </div>
                    <div className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                      Members
                    </div>
                  </div>

                  <div className="bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-coc-green" />
                      {clan2 && getComparisonIcon(clan.clanWarTrophies, clan2.clanWarTrophies)}
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white">
                      {formatNumber(clan.clanWarTrophies)}
                    </div>
                    <div className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                      War Trophies
                    </div>
                  </div>

                  <div className="bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-coc-purple" />
                      {clan2 && getComparisonIcon(clan.builderBasePoints, clan2.builderBasePoints)}
                    </div>
                    <div className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white">
                      {formatNumber(clan.builderBasePoints)}
                    </div>
                    <div className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                      Builder Base
                    </div>
                  </div>
                </div>

                {/* Clan Description */}
                {clan.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-2">
                      Description
                    </h3>
                    <p className="text-coc-gray-600 dark:text-coc-gray-400">
                      {clan.description}
                    </p>
                  </div>
                )}

                {/* Clan Type and War Frequency */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="badge badge-blue">
                      {clan.type === 'open' ? 'Open' : clan.type === 'inviteOnly' ? 'Invite Only' : 'Closed'}
                    </span>
                    <span className="badge badge-green">
                      {clan.warFrequency}
                    </span>
                  </div>
                  <div className="text-coc-gray-500 dark:text-coc-gray-400">
                    Last updated: {new Date(clan.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-coc-gray-900 dark:text-white mb-2">
                  Clan {index + 1}
                </h3>
                <p className="text-coc-gray-500 dark:text-coc-gray-400">
                  No data available
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Summary */}
      {clan1 && clan2 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white mb-6">
            Comparison Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-2">
                Higher Level
              </h3>
              <p className="text-2xl font-bold text-coc-gold">
                {clan1.level > clan2.level ? clan1.name : clan2.name}
              </p>
              <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                Level {Math.max(clan1.level, clan2.level)}
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-2">
                More Trophies
              </h3>
              <p className="text-2xl font-bold text-coc-gold">
                {clan1.points > clan2.points ? clan1.name : clan2.name}
              </p>
              <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                {formatNumber(Math.max(clan1.points, clan2.points))}
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-2">
                More Members
              </h3>
              <p className="text-2xl font-bold text-coc-gold">
                {(clan1.actualMemberCount || clan1.members) > (clan2.actualMemberCount || clan2.members) ? clan1.name : clan2.name}
              </p>
              <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                {Math.max(clan1.actualMemberCount || clan1.members, clan2.actualMemberCount || clan2.members)} members
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-2">
                Better War Record
              </h3>
              <p className="text-2xl font-bold text-coc-gold">
                {clan1.clanWarTrophies > clan2.clanWarTrophies ? clan1.name : clan2.name}
              </p>
              <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                {formatNumber(Math.max(clan1.clanWarTrophies, clan2.clanWarTrophies))} trophies
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clans;






