/**
 * My Teams Page
 * Shows all teams the user is part of
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([fetchMyTeams(), fetchMyInvites()]).finally(() => setLoading(false));
  }, []);

  const fetchMyTeams = async () => {
    try {
      const response = await api.get('/teams/my-teams');
      setTeams(response.data.teams);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchMyInvites = async () => {
    try {
      const response = await api.get('/teams/my-invites');
      setInvites(response.data.invites || []);
    } catch (error) {
      console.error('Error fetching invites:', error);
    }
  };

  const handleAccept = async (teamId) => {
    try {
      setActionError('');
      setActionSuccess('');
      await api.post(`/teams/${teamId}/join`);
      setActionSuccess('Joined team successfully');
      await Promise.all([fetchMyTeams(), fetchMyInvites()]);
      setTimeout(() => setActionSuccess(''), 2500);
    } catch (error) {
      setActionError(error.response?.data?.error?.message || 'Failed to join team');
      setTimeout(() => setActionError(''), 3000);
    }
  };

  const handleDecline = async (teamId) => {
    try {
      setActionError('');
      setActionSuccess('');
      await api.post(`/teams/${teamId}/decline`);
      setActionSuccess('Invitation declined');
      await fetchMyInvites();
      setTimeout(() => setActionSuccess(''), 2500);
    } catch (error) {
      setActionError(error.response?.data?.error?.message || 'Failed to decline');
      setTimeout(() => setActionError(''), 3000);
    }
  };

  const getEventStatusBadge = (status) => {
    switch (status) {
      case 'upcoming':
        return 'badge badge-primary';
      case 'ongoing':
        return 'badge badge-success';
      case 'past':
        return 'badge badge-danger';
      default:
        return 'badge';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
        <p className="mt-2 text-gray-600">
          All teams you've created or joined
        </p>
      </div>

      {/* Alerts */}
      {actionSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {actionError}
        </div>
      )}

      {/* Invitations Section */}
      {invites.length > 0 && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Invitations for You</h2>
            <span className="badge badge-warning">{invites.length} Pending</span>
          </div>

          <div className="space-y-4">
            {invites.map((team) => (
              <div key={team._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md">
                <div>
                  <p className="text-gray-900 font-medium">{team.name || 'Team'}</p>
                  <p className="text-sm text-gray-600">
                    Event: <span className="font-medium">{team.eventId?.title || 'Unknown'}</span>
                    {' '}• Leader: <span className="font-medium">{team.leaderId?.name || 'Unknown'}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAccept(team._id)} className="btn-primary">Accept</button>
                  <button onClick={() => handleDecline(team._id)} className="btn-secondary">Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {teams.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg mb-4">You're not part of any teams yet</p>
          <Link to="/" className="btn-primary inline-block">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Link
              key={team._id}
              to={`/teams/${team._id}`}
              className="card hover:shadow-xl transition-shadow"
            >
              {/* Team name and role */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {team.name}
                </h3>
                {team.leaderId._id === user._id ? (
                  <span className="badge badge-warning">You're the Leader</span>
                ) : (
                  <span className="badge badge-primary">Member</span>
                )}
              </div>

              {/* Event info */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Event:</p>
                <p className="font-medium text-gray-900">{team.eventId.title}</p>
                <span className={`mt-2 ${getEventStatusBadge(team.eventId.status)}`}>
                  {team.eventId.status.charAt(0).toUpperCase() + team.eventId.status.slice(1)}
                </span>
              </div>

              {/* Team stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Members:</span>
                  <span className="font-medium">{team.members.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Leader:</span>
                  <span className="font-medium">{team.leaderId.name}</span>
                </div>
                {team.invites && team.invites.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending Invites:</span>
                    <span className="font-medium text-yellow-600">{team.invites.length}</span>
                  </div>
                )}
              </div>

              {/* View details */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className="text-primary-600 font-medium text-sm hover:text-primary-700">
                  View Team Details →
                </span>
              </div>

              {/* Event dates */}
              {team.eventId.deadlines && (
                <div className="mt-4 text-xs text-gray-500">
                  {team.eventId.deadlines.eventStart && (
                    <div>
                      Starts: {new Date(team.eventId.deadlines.eventStart).toLocaleDateString()}
                    </div>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeams;
