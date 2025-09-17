import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Shield, 
  Star,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Home = () => {
  const [clanData, setClanData] = useState([]);
  const [memberStats, setMemberStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [clansResponse, statsResponse] = await Promise.all([
        axios.get('/api/clans/overview'),
        axios.get('/api/members/stats')
      ]);

      setClanData(clansResponse.data.clans);
      setMemberStats(statsResponse.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching home data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchHomeData();
    toast.success('Data refreshed!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-coc-gray-600 dark:text-coc-gray-400">
            Loading CC2 Academy Stats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-coc-gray-900 dark:text-white mb-3 sm:mb-4">
          Welcome to CC2 Academy Stats
        </h1>
        <p className="text-base sm:text-lg text-coc-gray-600 dark:text-coc-gray-400 mb-4 sm:mb-6">
          Track and manage your Clash of Clans clan statistics
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleRefresh}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-coc-blue text-white rounded-lg hover:bg-coc-blue-dark transition-colors duration-200 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
          {lastUpdated && (
            <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Clan Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {clanData.map((clan, index) => (
          <div key={clan._id} className="card animate-fadeIn p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {clan.badgeUrls?.small && (
                  <img 
                    src={clan.badgeUrls.small} 
                    alt={`${clan.name} badge`}
                    className="w-10 h-10 sm:w-12 sm:h-12"
                  />
                )}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-coc-gray-900 dark:text-white">
                    {clan.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                    {clan.tag}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl font-bold text-coc-gold">
                  Level {clan.level}
                </p>
                <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                  Clan Level
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div className="text-center p-2 sm:p-3 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-coc-gold mx-auto mb-1" />
                <p className="text-sm sm:text-lg font-semibold text-coc-gray-900 dark:text-white">
                  {clan.points?.toLocaleString()}
                </p>
                <p className="text-xs text-coc-gray-500 dark:text-coc-gray-400">
                  Trophies
                </p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-coc-blue mx-auto mb-1" />
                <p className="text-sm sm:text-lg font-semibold text-coc-gray-900 dark:text-white">
                  {clan.actualMemberCount || clan.members}
                </p>
                <p className="text-xs text-coc-gray-500 dark:text-coc-gray-400">
                  Members
                </p>
              </div>
            </div>

            <Link
              to={`/clans?clan=${clan.tag}`}
              className="flex items-center justify-center space-x-2 w-full py-2 sm:py-2 bg-coc-gold text-coc-gray-900 rounded-lg hover:bg-coc-gold-dark transition-colors duration-200 font-semibold text-sm sm:text-base"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="card text-center p-3 sm:p-6">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-coc-blue mx-auto mb-2 sm:mb-3" />
          <h3 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-1">
            {memberStats.totalMembers || 0}
          </h3>
          <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400">
            Total Members
          </p>
        </div>

        <div className="card text-center p-3 sm:p-6">
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-coc-gold mx-auto mb-2 sm:mb-3" />
          <h3 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-1">
            {memberStats.avgTrophies || 0}
          </h3>
          <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400">
            Avg Trophies
          </p>
        </div>

        <div className="card text-center p-3 sm:p-6">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-coc-green mx-auto mb-2 sm:mb-3" />
          <h3 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-1">
            {memberStats.avgTownHall || 0}
          </h3>
          <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400">
            Avg Town Hall
          </p>
        </div>

        <div className="card text-center p-3 sm:p-6">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-coc-purple mx-auto mb-2 sm:mb-3" />
          <h3 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-1">
            {memberStats.totalWarStars || 0}
          </h3>
          <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400">
            War Stars
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-4 sm:mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            to="/members"
            className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg hover:bg-coc-gray-100 dark:hover:bg-coc-gray-600 transition-colors duration-200"
          >
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-coc-blue" />
            <div>
              <p className="font-semibold text-coc-gray-900 dark:text-white text-sm sm:text-base">
                View Members
              </p>
              <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                Browse all members
              </p>
            </div>
          </Link>

          <Link
            to="/events"
            className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg hover:bg-coc-gray-100 dark:hover:bg-coc-gray-600 transition-colors duration-200"
          >
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-coc-green" />
            <div>
              <p className="font-semibold text-coc-gray-900 dark:text-white text-sm sm:text-base">
                Events
              </p>
              <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                War schedule & CWL
              </p>
            </div>
          </Link>

          <Link
            to="/media"
            className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg hover:bg-coc-gray-100 dark:hover:bg-coc-gray-600 transition-colors duration-200"
          >
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-coc-purple" />
            <div>
              <p className="font-semibold text-coc-gray-900 dark:text-white text-sm sm:text-base">
                Media Gallery
              </p>
              <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                Clan achievements
              </p>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className="flex items-center space-x-2 sm:space-x-3 p-3 sm:p-4 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg hover:bg-coc-gray-100 dark:hover:bg-coc-gray-600 transition-colors duration-200"
          >
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-coc-orange" />
            <div>
              <p className="font-semibold text-coc-gray-900 dark:text-white text-sm sm:text-base">
                Dashboard
              </p>
              <p className="text-xs sm:text-sm text-coc-gray-500 dark:text-coc-gray-400">
                Manage settings
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;






