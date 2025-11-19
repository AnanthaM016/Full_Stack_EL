import { useState, useEffect } from 'react';
import api from '../utils/api';

const SearchTeammates = () => {
  const [skills, setSkills] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myTeams, setMyTeams] = useState([]);
  const [invitingUserId, setInvitingUserId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadAllStudents();
    loadMyTeams();
  }, []);

  const loadAllStudents = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users/all?limit=100');
      setResults(response.data.users);
    } catch (error) {
      console.error('Error loading students:', error);
      showMessage('error', 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const loadMyTeams = async () => {
    try {
      const response = await api.get('/teams/my-teams');
      setMyTeams(response.data.teams);
    } catch (error) {
      console.error('Error loading teams:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (skills.trim()) {
        const response = await api.get('/users/all', {
          params: { skills: skills.trim(), limit: 100 }
        });
        setResults(response.data.users);
      } else {
        await loadAllStudents();
      }
    } catch (error) {
      console.error('Search error:', error);
      showMessage('error', 'Failed to search students');
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setSkills('');
    loadAllStudents();
  };

  const handleInvite = async (userId) => {
    if (!selectedTeam) {
      showMessage('error', 'Please select a team first');
      return;
    }

    try {
      await api.post(`/teams/${selectedTeam}/invite`, { userId });
      showMessage('success', 'Invitation sent successfully!');
      setInvitingUserId(null);
      setSelectedTeam('');
    } catch (error) {
      console.error('Invite error:', error);
      showMessage('error', error.response?.data?.error?.message || 'Failed to send invitation');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Teammates</h1>
        <p className="text-gray-600 mb-6">
          Browse all students or filter by skills to find the perfect teammates
        </p>

        <form onSubmit={handleSearch}>
          <div className="space-y-4">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Skills (optional)
              </label>
              <input
                id="skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Python, Machine Learning (comma-separated)"
                className="input-field w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to see all students, or enter skills to filter
              </p>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {skills.trim() ? 'Apply Filter' : 'Refresh'}
              </button>
              {skills && (
                <button
                  type="button"
                  onClick={clearFilter}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">
            {skills.trim() 
              ? 'No students found with those skills. Try different keywords or clear the filter.'
              : 'No other students registered yet.'}
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {results.length} student{results.length !== 1 ? 's' : ''}
              {skills.trim() && ` matching "${skills}"`}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((user) => (
              <div key={user._id} className="card">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                    {user.branch && (
                      <p className="text-sm text-gray-600">{user.branch}</p>
                    )}
                    {user.year && (
                      <p className="text-xs text-gray-500">{user.year}</p>
                    )}
                  </div>
                </div>

                {user.matchScore > 0 && (
                  <div className="mb-3">
                    <span className="badge badge-success">
                      {user.matchScore} skill {user.matchScore === 1 ? 'match' : 'matches'}
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.slice(0, 6).map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">No skills listed</span>
                    )}
                    {user.skills && user.skills.length > 6 && (
                      <span className="text-xs text-gray-500">+{user.skills.length - 6} more</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Events</p>
                    <p className="font-bold">{user.stats?.eventsParticipated || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-600">Won</p>
                    <p className="font-bold">{user.stats?.eventsWon || 0}</p>
                  </div>
                </div>

                {myTeams.length > 0 && (
                  <div className="mt-4">
                    {invitingUserId === user._id ? (
                      <div className="space-y-3">
                        <select
                          value={selectedTeam}
                          onChange={(e) => setSelectedTeam(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Select a team...</option>
                          {myTeams.map((team) => (
                            <option key={team._id} value={team._id}>
                              {team.teamName} - {team.event?.title || 'Event'}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleInvite(user._id)}
                            className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700"
                          >
                            Send Invite
                          </button>
                          <button
                            onClick={() => {
                              setInvitingUserId(null);
                              setSelectedTeam('');
                            }}
                            className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setInvitingUserId(user._id)}
                        className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 font-medium"
                      >
                        Invite to Team
                      </button>
                    )}
                  </div>
                )}

                {myTeams.length === 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 text-center">
                      Create a team first to invite members
                    </p>
                  </div>
                )}

                <div className="mt-3">
                  <a
                    href={`mailto:${user.email}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                     Contact via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTeammates;