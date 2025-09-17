import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  Shield, 
  BarChart3, 
  RefreshCw,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isInspector } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [cwlRecords, setCwlRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (isInspector() && activeTab === 'cwl') {
      fetchCWLRecords();
    }
  }, [activeTab, isInspector]);

  const fetchCWLRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cwl/records');
      setCwlRecords(response.data.records);
    } catch (error) {
      console.error('Error fetching CWL records:', error);
      toast.error('Failed to load CWL records');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record._id);
    setEditForm({
      points: record.points,
      rank: record.rank,
      remarks: record.remarks,
      isPromoted: record.isPromoted,
      isDemoted: record.isDemoted
    });
  };

  const handleSaveRecord = async (recordId) => {
    try {
      await axios.put(`/api/cwl/records/${recordId}`, editForm);
      toast.success('CWL record updated successfully');
      setEditingRecord(null);
      fetchCWLRecords();
    } catch (error) {
      console.error('Error updating CWL record:', error);
      toast.error('Failed to update CWL record');
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditForm({});
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (isInspector()) {
    tabs.push({ id: 'cwl', label: 'CWL Management', icon: Shield });
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-coc-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-coc-gray-600 dark:text-coc-gray-400">
            Welcome back, {user?.email}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="badge badge-blue text-xs sm:text-sm">{user?.role}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-coc-gray-200 dark:border-coc-gray-700">
        <nav className="-mb-px flex space-x-2 sm:space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-coc-gold text-coc-gold'
                    : 'border-transparent text-coc-gray-500 dark:text-coc-gray-400 hover:text-coc-gray-700 dark:hover:text-coc-gray-300 hover:border-coc-gray-300'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="card text-center p-3 sm:p-6">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-coc-blue mx-auto mb-2 sm:mb-3" />
                <h3 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-1">
                  Member
                </h3>
                <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400">
                  Your Role
                </p>
              </div>

              <div className="card text-center p-3 sm:p-6">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-coc-green mx-auto mb-2 sm:mb-3" />
                <h3 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-1">
                  {user?.clanTag || 'N/A'}
                </h3>
                <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400">
                  Clan Tag
                </p>
              </div>

              <div className="card text-center p-3 sm:p-6">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-coc-purple mx-auto mb-2 sm:mb-3" />
                <h3 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-1">
                  Active
                </h3>
                <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400">
                  Account Status
                </p>
              </div>

              <div className="card text-center p-3 sm:p-6">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-coc-orange mx-auto mb-2 sm:mb-3" />
                <h3 className="text-lg sm:text-2xl font-bold text-coc-gray-900 dark:text-white mb-1">
                  {user?.role}
                </h3>
                <p className="text-xs sm:text-sm text-coc-gray-600 dark:text-coc-gray-400">
                  Access Level
                </p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-4 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg hover:bg-coc-gray-100 dark:hover:bg-coc-gray-600 transition-colors duration-200 text-left">
                  <Users className="w-6 h-6 text-coc-blue mb-2" />
                  <h3 className="font-semibold text-coc-gray-900 dark:text-white">
                    View Members
                  </h3>
                  <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                    Browse all clan members
                  </p>
                </button>

                <button className="p-4 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg hover:bg-coc-gray-100 dark:hover:bg-coc-gray-600 transition-colors duration-200 text-left">
                  <BarChart3 className="w-6 h-6 text-coc-green mb-2" />
                  <h3 className="font-semibold text-coc-gray-900 dark:text-white">
                    View Statistics
                  </h3>
                  <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                    Check clan performance
                  </p>
                </button>

                <button className="p-4 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg hover:bg-coc-gray-100 dark:hover:bg-coc-gray-600 transition-colors duration-200 text-left">
                  <Settings className="w-6 h-6 text-coc-purple mb-2" />
                  <h3 className="font-semibold text-coc-gray-900 dark:text-white">
                    Account Settings
                  </h3>
                  <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                    Manage your profile
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white mb-6">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-coc-gray-100 dark:bg-coc-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role || ''}
                  disabled
                  className="input-field bg-coc-gray-100 dark:bg-coc-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                  Clan Tag
                </label>
                <input
                  type="text"
                  value={user?.clanTag || 'Not set'}
                  disabled
                  className="input-field bg-coc-gray-100 dark:bg-coc-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-2">
                  Last Login
                </label>
                <input
                  type="text"
                  value={user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Unknown'}
                  disabled
                  className="input-field bg-coc-gray-100 dark:bg-coc-gray-700"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card">
            <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white mb-6">
              Account Settings
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-coc-gray-300" defaultChecked />
                    <span className="ml-2 text-coc-gray-700 dark:text-coc-gray-300">
                      Email notifications for clan updates
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-coc-gray-300" defaultChecked />
                    <span className="ml-2 text-coc-gray-700 dark:text-coc-gray-300">
                      War reminders
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-coc-gray-300" />
                    <span className="ml-2 text-coc-gray-700 dark:text-coc-gray-300">
                      CWL updates
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-4">
                  Privacy Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-coc-gray-300" defaultChecked />
                    <span className="ml-2 text-coc-gray-700 dark:text-coc-gray-300">
                      Show my profile to other members
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-coc-gray-300" />
                    <span className="ml-2 text-coc-gray-700 dark:text-coc-gray-300">
                      Allow direct messages
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-coc-gray-200 dark:border-coc-gray-700">
                <button className="btn-primary">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cwl' && isInspector() && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white">
                CWL Records Management
              </h2>
              <button
                onClick={fetchCWLRecords}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-coc-blue text-white rounded-lg hover:bg-coc-blue-dark transition-colors duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="table-header">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">Member</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">Season</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">TH Level</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">Points</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">Rank</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">Status</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">Remarks</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <div className="loading-spinner mx-auto mb-4"></div>
                          <p className="text-coc-gray-500 dark:text-coc-gray-400">
                            Loading CWL records...
                          </p>
                        </td>
                      </tr>
                    ) : cwlRecords.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-12 text-center">
                          <Shield className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-coc-gray-900 dark:text-white mb-2">
                            No CWL Records Found
                          </h3>
                          <p className="text-coc-gray-500 dark:text-coc-gray-400">
                            CWL records will appear here once they are created.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      cwlRecords.map((record) => (
                        <tr key={record._id} className="table-row">
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-semibold text-coc-gray-900 dark:text-white">
                                {record.memberName}
                              </div>
                              <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                                {record.memberTag}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="badge badge-blue">
                              {record.season}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-coc-gray-900 dark:text-white">
                              TH{record.townHallLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {editingRecord === record._id ? (
                              <input
                                type="number"
                                value={editForm.points || ''}
                                onChange={(e) => setEditForm({...editForm, points: parseInt(e.target.value)})}
                                className="w-20 px-2 py-1 border border-coc-gray-300 dark:border-coc-gray-600 rounded bg-white dark:bg-coc-gray-700 text-coc-gray-900 dark:text-white"
                              />
                            ) : (
                              <span className="font-semibold text-coc-gray-900 dark:text-white">
                                {record.points}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingRecord === record._id ? (
                              <input
                                type="number"
                                value={editForm.rank || ''}
                                onChange={(e) => setEditForm({...editForm, rank: parseInt(e.target.value)})}
                                className="w-20 px-2 py-1 border border-coc-gray-300 dark:border-coc-gray-600 rounded bg-white dark:bg-coc-gray-700 text-coc-gray-900 dark:text-white"
                              />
                            ) : (
                              <span className="font-semibold text-coc-gray-900 dark:text-white">
                                {record.rank}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-1">
                              {record.isPromoted && (
                                <span className="badge badge-green">Promoted</span>
                              )}
                              {record.isDemoted && (
                                <span className="badge badge-red">Demoted</span>
                              )}
                              {!record.isPromoted && !record.isDemoted && (
                                <span className="badge badge-gray-500">Neutral</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {editingRecord === record._id ? (
                              <input
                                type="text"
                                value={editForm.remarks || ''}
                                onChange={(e) => setEditForm({...editForm, remarks: e.target.value})}
                                className="w-32 px-2 py-1 border border-coc-gray-300 dark:border-coc-gray-600 rounded bg-white dark:bg-coc-gray-700 text-coc-gray-900 dark:text-white"
                                placeholder="Add remarks..."
                              />
                            ) : (
                              <span className="text-coc-gray-600 dark:text-coc-gray-400">
                                {record.remarks || 'No remarks'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {editingRecord === record._id ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSaveRecord(record._id)}
                                  className="p-1 text-coc-green hover:bg-coc-green hover:text-white rounded transition-colors duration-200"
                                >
                                  <Save className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 text-coc-red hover:bg-coc-red hover:text-white rounded transition-colors duration-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleEditRecord(record)}
                                className="p-1 text-coc-blue hover:bg-coc-blue hover:text-white rounded transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;






