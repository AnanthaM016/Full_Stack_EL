/**
 * Event Details Page
 * Shows comprehensive event information with tabs
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [teams, setTeams] = useState([]);
  const [myTeam, setMyTeam] = useState(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [chatbotQuestion, setChatbotQuestion] = useState('');
  const [chatbotAnswer, setChatbotAnswer] = useState('');
  const [chatbotLoading, setChatbotLoading] = useState(false);

  useEffect(() => {
    fetchEvent();
    fetchTeams();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.event);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get(`/teams/event/${id}`);
      setTeams(response.data.teams);

      // Check if user is already in a team
      const userTeam = response.data.teams.find(team =>
        team.members.some(member => member._id === user._id)
      );
      setMyTeam(userTeam);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.post('/teams', {
        eventId: id,
        name: teamName
      });
      setShowCreateTeam(false);
      setTeamName('');
      fetchTeams();
      alert('Team created successfully!');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to create team');
    }
  };

  const handleAskChatbot = async (e) => {
    e.preventDefault();
    if (!chatbotQuestion.trim()) return;

    setChatbotLoading(true);
    try {
      const response = await api.post(`/events/${id}/ask`, {
        question: chatbotQuestion
      });
      setChatbotAnswer(response.data.answer);
    } catch (error) {
      setChatbotAnswer('Sorry, I could not process your question. Please try again.');
    } finally {
      setChatbotLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await api.delete(`/events/${id}`);
      alert('Event deleted successfully');
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error?.message || 'Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Event header */}
      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`badge ${
              event.status === 'upcoming' ? 'badge-primary' :
              event.status === 'ongoing' ? 'badge-success' : 'badge-danger'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          {isAdmin && (
            <button
              onClick={handleDeleteEvent}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Delete Event
            </button>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.categories.map((category, index) => (
            <span key={index} className="badge badge-primary">
              {category}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Team Size:</span> {event.teamSize.min} - {event.teamSize.max}
          </div>
          {event.deadlines.registrationClose && (
            <div>
              <span className="font-medium">Register by:</span>{' '}
              {new Date(event.deadlines.registrationClose).toLocaleDateString()}
            </div>
          )}
          {event.deadlines.eventStart && (
            <div>
              <span className="font-medium">Event Date:</span>{' '}
              {new Date(event.deadlines.eventStart).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {['about', 'rules', 'teams', 'chatbot'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="card">
        {/* About tab */}
        {activeTab === 'about' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">About This Event</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>

            {event.brochureUrl && (
              <div className="mt-6">
                <a
                  href={event.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  📄 View Event Brochure
                </a>
              </div>
            )}
          </div>
        )}

        {/* Rules tab */}
        {activeTab === 'rules' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Rules & Guidelines</h2>
            {event.rules && event.rules.length > 0 ? (
              <ul className="space-y-3">
                {event.rules.map((rule, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 font-bold mr-3">{index + 1}.</span>
                    <span className="text-gray-700">{rule}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No specific rules have been added yet.</p>
            )}
          </div>
        )}

        {/* Teams tab */}
        {activeTab === 'teams' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Teams</h2>
              {!myTeam && (
                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="btn-primary"
                >
                  Create Team
                </button>
              )}
            </div>

            {/* Create team form */}
            {showCreateTeam && (
              <form onSubmit={handleCreateTeam} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                    className="input-field flex-1"
                    required
                  />
                  <button type="submit" className="btn-primary">
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateTeam(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* My team */}
            {myTeam && (
              <div className="mb-6 p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                <h3 className="font-bold text-lg mb-2">Your Team: {myTeam.name}</h3>
                <button
                  onClick={() => navigate(`/teams/${myTeam._id}`)}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View Team Details →
                </button>
              </div>
            )}

            {/* All teams */}
            {teams.length === 0 ? (
              <p className="text-gray-600">No teams have been created for this event yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div key={team._id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-2">{team.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Leader: {team.leaderId.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Members: {team.members.length} / {event.teamSize.max}
                    </p>
                    <button
                      onClick={() => navigate(`/teams/${team._id}`)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Chatbot tab */}
        {activeTab === 'chatbot' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Ask About This Event</h2>
            <p className="text-gray-600 mb-6">
              Ask me anything about the event - deadlines, team size, rules, and more!
            </p>

            <form onSubmit={handleAskChatbot} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatbotQuestion}
                  onChange={(e) => setChatbotQuestion(e.target.value)}
                  placeholder="e.g., What's the registration deadline?"
                  className="input-field flex-1"
                />
                <button
                  type="submit"
                  disabled={chatbotLoading}
                  className="btn-primary disabled:opacity-50"
                >
                  {chatbotLoading ? 'Thinking...' : 'Ask'}
                </button>
              </div>
            </form>

            {chatbotAnswer && (
              <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="font-bold mb-2">Answer:</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{chatbotAnswer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
