import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Trophy, 
  Users, 
  Shield,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [warSchedule, setWarSchedule] = useState([]);
  const [cwlSchedule, setCwlSchedule] = useState([]);
  const [eventHistory, setEventHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const [upcomingRes, warRes, cwlRes, historyRes] = await Promise.all([
        axios.get('/api/events/upcoming'),
        axios.get('/api/events/war-schedule'),
        axios.get('/api/events/cwl-schedule'),
        axios.get('/api/events/history')
      ]);

      setUpcomingEvents(upcomingRes.data.events);
      setWarSchedule(warRes.data.warSchedules);
      setCwlSchedule(cwlRes.data.cwlSchedules);
      setEventHistory(historyRes.data.history);
    } catch (error) {
      console.error('Error fetching events data:', error);
      toast.error('Failed to load events data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntil = (dateString) => {
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffInMs = eventDate - now;
    
    if (diffInMs < 0) return 'Past';
    
    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    
    if (now < startTime) return { status: 'upcoming', color: 'badge-blue' };
    if (now >= startTime && now <= endTime) return { status: 'active', color: 'badge-green' };
    return { status: 'completed', color: 'badge-gray-500' };
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming Events', icon: Calendar },
    { id: 'wars', label: 'War Schedule', icon: Shield },
    { id: 'cwl', label: 'CWL Schedule', icon: Trophy },
    { id: 'history', label: 'Event History', icon: Clock }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-coc-gray-600 dark:text-coc-gray-400">
            Loading events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coc-gray-900 dark:text-white mb-2">
            Events & Schedule
          </h1>
          <p className="text-coc-gray-600 dark:text-coc-gray-400">
            Track wars, CWL, and clan activities
          </p>
        </div>
        <button
          onClick={fetchEventsData}
          className="flex items-center space-x-2 px-4 py-2 bg-coc-blue text-white rounded-lg hover:bg-coc-blue-dark transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-coc-gray-200 dark:border-coc-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-coc-gold text-coc-gold'
                    : 'border-transparent text-coc-gray-500 dark:text-coc-gray-400 hover:text-coc-gray-700 dark:hover:text-coc-gray-300 hover:border-coc-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            
            {upcomingEvents.length === 0 ? (
              <div className="card text-center py-12">
                <Calendar className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-coc-gray-900 dark:text-white mb-2">
                  No Upcoming Events
                </h3>
                <p className="text-coc-gray-500 dark:text-coc-gray-400">
                  Check back later for scheduled events
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => {
                  const eventStatus = getEventStatus(event);
                  return (
                    <div key={index} className="card animate-fadeIn">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {event.type === 'war' ? (
                            <Shield className="w-8 h-8 text-coc-red" />
                          ) : (
                            <Trophy className="w-8 h-8 text-coc-gold" />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white">
                              {event.title}
                            </h3>
                            <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                              {event.clanTag}
                            </p>
                          </div>
                        </div>
                        <span className={`badge ${eventStatus.color}`}>
                          {eventStatus.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-coc-gray-600 dark:text-coc-gray-400">
                            Start Time
                          </span>
                          <span className="text-sm font-medium text-coc-gray-900 dark:text-white">
                            {formatDate(event.startTime)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-coc-gray-600 dark:text-coc-gray-400">
                            End Time
                          </span>
                          <span className="text-sm font-medium text-coc-gray-900 dark:text-white">
                            {formatDate(event.endTime)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-coc-gray-600 dark:text-coc-gray-400">
                            Time Until
                          </span>
                          <span className="text-sm font-medium text-coc-gold">
                            {getTimeUntil(event.startTime)}
                          </span>
                        </div>

                        {event.participants && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-coc-gray-600 dark:text-coc-gray-400">
                              Participants
                            </span>
                            <span className="text-sm font-medium text-coc-gray-900 dark:text-white">
                              {event.participants} vs {event.participants}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wars' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white">
              War Schedule
            </h2>
            
            {warSchedule.length === 0 ? (
              <div className="card text-center py-12">
                <Shield className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-coc-gray-900 dark:text-white mb-2">
                  No War Data Available
                </h3>
                <p className="text-coc-gray-500 dark:text-coc-gray-400">
                  War information will appear here when available
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {warSchedule.map((clanWar, index) => (
                  <div key={index} className="card">
                    <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-4">
                      {clanWar.clanTag}
                    </h3>
                    
                    {clanWar.currentWar && (
                      <div className="mb-6">
                        <h4 className="text-md font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-3">
                          Current War
                        </h4>
                        <div className="bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-coc-gray-900 dark:text-white">
                              vs {clanWar.currentWar.opponent?.name || 'Unknown'}
                            </span>
                            <span className={`badge ${
                              clanWar.currentWar.state === 'inWar' ? 'badge-green' :
                              clanWar.currentWar.state === 'preparation' ? 'badge-blue' :
                              'badge-gray-500'
                            }`}>
                              {clanWar.currentWar.state}
                            </span>
                          </div>
                          <div className="text-sm text-coc-gray-600 dark:text-coc-gray-400">
                            Team Size: {clanWar.currentWar.teamSize}
                          </div>
                        </div>
                      </div>
                    )}

                    {clanWar.recentWars && clanWar.recentWars.length > 0 && (
                      <div>
                        <h4 className="text-md font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-3">
                          Recent Wars
                        </h4>
                        <div className="space-y-2">
                          {clanWar.recentWars.slice(0, 3).map((war, warIndex) => (
                            <div key={warIndex} className="flex items-center justify-between p-3 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg">
                              <div>
                                <span className="font-medium text-coc-gray-900 dark:text-white">
                                  vs {war.opponent?.name || 'Unknown'}
                                </span>
                                <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                                  {formatDate(war.endTime)}
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`badge ${
                                  war.result === 'win' ? 'badge-green' :
                                  war.result === 'lose' ? 'badge-red' :
                                  'badge-gray-500'
                                }`}>
                                  {war.result}
                                </span>
                                <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                                  {war.stars} stars
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'cwl' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white">
              CWL Schedule
            </h2>
            
            {cwlSchedule.length === 0 ? (
              <div className="card text-center py-12">
                <Trophy className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-coc-gray-900 dark:text-white mb-2">
                  No CWL Data Available
                </h3>
                <p className="text-coc-gray-500 dark:text-coc-gray-400">
                  CWL information will appear here when available
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {cwlSchedule.map((clanCWL, index) => (
                  <div key={index} className="card">
                    <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white mb-4">
                      {clanCWL.clanTag}
                    </h3>
                    
                    {clanCWL.leagueGroup ? (
                      <div className="space-y-4">
                        <div className="bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg p-4">
                          <h4 className="font-medium text-coc-gray-900 dark:text-white mb-2">
                            League Group: {clanCWL.leagueGroup.tag}
                          </h4>
                          <div className="text-sm text-coc-gray-600 dark:text-coc-gray-400">
                            Season: {clanCWL.leagueGroup.season}
                          </div>
                        </div>

                        {clanCWL.leagueGroup.rounds && (
                          <div>
                            <h4 className="text-md font-medium text-coc-gray-700 dark:text-coc-gray-300 mb-3">
                              CWL Rounds
                            </h4>
                            <div className="space-y-2">
                              {clanCWL.leagueGroup.rounds.map((round, roundIndex) => (
                                <div key={roundIndex} className="flex items-center justify-between p-3 bg-coc-gray-50 dark:bg-coc-gray-700 rounded-lg">
                                  <div>
                                    <span className="font-medium text-coc-gray-900 dark:text-white">
                                      Round {roundIndex + 1}
                                    </span>
                                    <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                                      {formatDate(round.startTime)} - {formatDate(round.endTime)}
                                    </div>
                                  </div>
                                  <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                                    {round.warTags?.length || 0} wars
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Trophy className="w-12 h-12 text-coc-gray-400 mx-auto mb-2" />
                        <p className="text-coc-gray-500 dark:text-coc-gray-400">
                          No active CWL league group
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-coc-gray-900 dark:text-white">
              Event History
            </h2>
            
            {eventHistory.length === 0 ? (
              <div className="card text-center py-12">
                <Clock className="w-16 h-16 text-coc-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-coc-gray-900 dark:text-white mb-2">
                  No Event History
                </h3>
                <p className="text-coc-gray-500 dark:text-coc-gray-400">
                  Past events will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventHistory.map((event, index) => (
                  <div key={index} className="card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {event.type === 'war' ? (
                          <Shield className="w-8 h-8 text-coc-red" />
                        ) : (
                          <Trophy className="w-8 h-8 text-coc-gold" />
                        )}
                        <div>
                          <h3 className="text-lg font-semibold text-coc-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                          <p className="text-sm text-coc-gray-500 dark:text-coc-gray-400">
                            {event.clanTag} • {formatDate(event.endTime)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${
                          event.result === 'win' ? 'badge-green' :
                          event.result === 'lose' ? 'badge-red' :
                          'badge-gray-500'
                        }`}>
                          {event.result}
                        </span>
                        <div className="text-sm text-coc-gray-500 dark:text-coc-gray-400 mt-1">
                          {event.stars} stars • {event.destructionPercentage}% destruction
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;








