/**
 * Team View Page
 * View and manage a specific team
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const TeamView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const response = await api.get(`/teams/${id}`);
      setTeam(response.data.team);
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviting(true);

    try {
      // Search for user by email
      const searchResponse = await api.get('/users/search', {
        params: { skills: inviteEmail }
      });

      // Find exact email match
      const userToInvite = searchResponse.data.users.find(
        u => u.email.toLowerCase() === inviteEmail.toLowerCase()
      );

      if (!userToInvite) {
        alert('User not found with that email');
        setInviting(false);
        return;
      }

      // Send invite
      await api.post(`/teams/${id}/invite`, {
        userId: userToInvite._id
      });

      alert('Invite sent successfully!');
      setInviteEmail('');
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  const handleJoinTeam = async () => {
    try {
      await api.post(`/teams/${id}/join`);
      alert('Successfully joined the team!');
      fetchTeam();
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to join team');
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;

    try {
      await api.post(`/teams/${id}/leave`);
      alert('Left the team successfully');
      navigate('/my-teams');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to leave team');
    }
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;

    try {
      await api.delete(`/teams/${id}`);
      alert('Team deleted successfully');
      navigate('/my-teams');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to delete team');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-900">Team not found</h2>
        </div>
      </div>
    );
  }

  const isLeader = team.leaderId._id === user._id;
  const isMember = team.members.some(m => m._id === user._id);
  const hasInvite = team.invites.some(i => i._id === user._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Team header */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-gray-600 mt-2">
              For event: <span className="font-medium">{team.eventId.title}</span>
            </p>
          </div>
          <div className="flex gap-2">
            {hasInvite && (
              <button onClick={handleJoinTeam} className="btn-primary">
                Accept Invite
              </button>
            )}
            {isMember && !isLeader && (
              <button onClick={handleLeaveTeam} className="btn-secondary">
                Leave Team
              </button>
            )}
            {isLeader && (
              <button onClick={handleDeleteTeam} className="text-red-600 hover:text-red-700 font-medium">
                Delete Team
              </button>
            )}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <span className="font-medium">Team Size:</span> {team.members.length} / {team.eventId.teamSize.max}
        </div>
      </div>

      {/* Invite form (leader only) */}
      {isLeader && team.members.length < team.eventId.teamSize.max && (
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Invite Members</h2>
          <form onSubmit={handleInvite} className="flex gap-2">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="input-field flex-1"
              required
            />
            <button
              type="submit"
              disabled={inviting}
              className="btn-primary disabled:opacity-50"
            >
              {inviting ? 'Inviting...' : 'Send Invite'}
            </button>
          </form>
        </div>
      )}

      {/* Team members */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Team Members</h2>
        <div className="space-y-4">
          {team.members.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {member.name}
                    {member._id === team.leaderId._id && (
                      <span className="ml-2 badge badge-warning">Leader</span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-600">{member.email}</p>
                  {member.skills && member.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {member.skills.slice(0, 5).map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Events: {member.stats?.eventsParticipated || 0}</div>
                <div>Won: {member.stats?.eventsWon || 0}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending invites */}
      {team.invites.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Invites</h2>
          <div className="space-y-4">
            {team.invites.map((invite) => (
              <div key={invite._id} className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white text-lg font-bold">
                  {invite.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{invite.name}</h3>
                  <p className="text-sm text-gray-600">{invite.email}</p>
                  <p className="text-xs text-yellow-700 mt-1">Invite pending</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamView;
