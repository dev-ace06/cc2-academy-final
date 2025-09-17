import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Users,
  Trophy,
  Shield,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  EyeOff
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClan, setSelectedClan] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [sortField, setSortField] = useState('trophies');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [clans, setClans] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const membersPerPage = 25;

  useEffect(() => {
    fetchClans();
    fetchMembers();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [currentPage, sortField, sortOrder, selectedClan, selectedRole]);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchMembers();
      }, 30000); // Refresh every 30 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchClans = async () => {
    try {
      const response = await axios.get('/api/clans');
      setClans(response.data.clans);
    } catch (error) {
      console.error('Error fetching clans:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        clanTag: selectedClan,
        role: selectedRole,
        sort: sortField,
        order: sortOrder,
        limit: membersPerPage,
        offset: (currentPage - 1) * membersPerPage
      };

      const response = await axios.get('/api/members', { params });
      setMembers(response.data.members);
      setTotalMembers(response.data.total);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clan') {
      setSelectedClan(value);
    } else if (filterType === 'role') {
      setSelectedRole(value);
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedClan('');
    setSelectedRole('');
    setCurrentPage(1);
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      leader: 'badge badge-gold',
      coLeader: 'badge badge-blue',
      admin: 'badge badge-green',
      member: 'badge badge-gray-500'
    };
    return roleStyles[role] || 'badge badge-gray-500';
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      leader: 'Leader',
      coLeader: 'Co-Leader',
      admin: 'Elder',
      member: 'Member'
    };
    return roleNames[role] || role;
  };

  const formatLastSeen = (lastSeen) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <Minus className="w-4 h-4 text-coc-gray-400" />;
    return sortOrder === 'asc' ? 
      <TrendingUp className="w-4 h-4 text-coc-green" /> : 
      <TrendingDown className="w-4 h-4 text-coc-red" />;
  };

  const totalPages = Math.ceil(totalMembers / membersPerPage);

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    
    return members.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [members, searchTerm]);

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-coc-gray-600 dark:text-coc-gray-400">
            Loading members...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coc-gray-900 dark:text-white mb-2">
            Clan Members
          </h1>
          <p className="text-coc-gray-600 dark:text-coc-gray-400">
            {totalMembers} members found
            {lastUpdated && (
              <span className="ml-2 text-sm">
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
              autoRefresh 
                ? 'bg-coc-green text-white' 
                : 'bg-coc-gray-200 dark:bg-coc-gray-700 text-coc-gray-700 dark:text-coc-gray-300'
            }`}
          >
            {autoRefresh ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Auto Refresh</span>
          </button>
          <button
            onClick={fetchMembers}
            className="flex items-center space-x-2 px-3 py-2 bg-coc-blue text-white rounded-lg hover:bg-coc-blue-dark transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-coc-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={handleSearch}
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-coc-gray-200 dark:bg-coc-gray-700 text-coc-gray-700 dark:text-coc-gray-300 rounded-lg hover:bg-coc-gray-300 dark:hover:bg-coc-gray-600 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedClan}
                onChange={(e) => handleFilterChange('clan', e.target.value)}
                className="input-field"
              >
                <option value="">All Clans</option>
                {clans.map(clan => (
                  <option key={clan._id} value={clan.tag}>
                    {clan.name}
                  </option>
                ))}
              </select>
              
              <select
                value={selectedRole}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="input-field"
              >
                <option value="">All Roles</option>
                <option value="leader">Leader</option>
                <option value="coLeader">Co-Leader</option>
                <option value="admin">Elder</option>
                <option value="member">Member</option>
              </select>
              
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-coc-red hover:bg-coc-red hover:text-white rounded-lg transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Members Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="table-header">
              <tr>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-150"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Name</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-150"
                  onClick={() => handleSort('role')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Role</span>
                    {getSortIcon('role')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-150"
                  onClick={() => handleSort('townHallLevel')}
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>TH</span>
                    {getSortIcon('townHallLevel')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-150"
                  onClick={() => handleSort('trophies')}
                >
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4" />
                    <span>Trophies</span>
                    {getSortIcon('trophies')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-150"
                  onClick={() => handleSort('warStars')}
                >
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>War Stars</span>
                    {getSortIcon('warStars')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-150"
                  onClick={() => handleSort('donations')}
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Donations</span>
                    {getSortIcon('donations')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left cursor-pointer hover:bg-coc-gray-100 dark:hover:bg-coc-gray-700 transition-colors duration-150"
                  onClick={() => handleSort('lastSeen')}
                >
                  <div className="flex items-center space-x-2">
                    <span>Last Seen</span>
                    {getSortIcon('lastSeen')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id} className="table-row">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-coc-gray-900 dark:text-white">
                        {member.name}
                      </div>
                      <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                        {member.tag}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getRoleBadge(member.role)}>
                      {getRoleDisplayName(member.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-coc-gray-900 dark:text-white">
                        {member.townHallLevel}
                      </span>
                      {member.builderHallLevel > 0 && (
                        <span className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                          BH{member.builderHallLevel}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-coc-gray-900 dark:text-white">
                      {member.trophies.toLocaleString()}
                    </div>
                    {member.builderTrophies > 0 && (
                      <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                        BH: {member.builderTrophies.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-coc-gray-900 dark:text-white">
                      {member.warStars}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-coc-gray-900 dark:text-white">
                        {member.donations}
                      </div>
                      <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                        Received: {member.donationsReceived}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-coc-gray-600 dark:text-coc-gray-400">
                      {formatLastSeen(member.lastSeen)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-coc-gray-900 dark:text-white mb-2">
              No members found
            </h3>
            <p className="text-coc-gray-500 dark:text-coc-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
            Showing {((currentPage - 1) * membersPerPage) + 1} to {Math.min(currentPage * membersPerPage, totalMembers)} of {totalMembers} members
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-coc-gray-200 dark:bg-coc-gray-700 text-coc-gray-700 dark:text-coc-gray-300 rounded-lg hover:bg-coc-gray-300 dark:hover:bg-coc-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                    currentPage === page
                      ? 'bg-coc-gold text-coc-gray-900'
                      : 'bg-coc-gray-200 dark:bg-coc-gray-700 text-coc-gray-700 dark:text-coc-gray-300 hover:bg-coc-gray-300 dark:hover:bg-coc-gray-600'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-coc-gray-200 dark:bg-coc-gray-700 text-coc-gray-700 dark:text-coc-gray-300 rounded-lg hover:bg-coc-gray-300 dark:hover:bg-coc-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;









