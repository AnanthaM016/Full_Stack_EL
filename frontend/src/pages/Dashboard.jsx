/**
 * Dashboard Page
 * Main page showing event feed with filters
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, [statusFilter, categoryFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (categoryFilter) {
        params.category = categoryFilter;
      }

      const response = await api.get('/events', { params });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-2 text-gray-600">
          Discover events and find your perfect team
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-wrap gap-4">
          {/* Status filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="past">Past</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="e.g., Hackathon"
              className="input-field"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchEvents}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Events grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No events found</p>
          <p className="text-gray-500 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event._id}
              to={`/events/${event._id}`}
              className="card hover:shadow-xl transition-shadow cursor-pointer"
            >
              {/* Event status badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={getStatusBadgeClass(event.status)}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                {event.brochureUrl && (
                  <span className="text-xs text-gray-500">📄 Brochure</span>
                )}
              </div>

              {/* Event title */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {event.title}
              </h3>

              {/* Event description (truncated) */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {event.description}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {event.categories.slice(0, 3).map((category, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>

              {/* Event details */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Team Size:</span>
                  {event.teamSize.min} - {event.teamSize.max} members
                </div>
                {event.deadlines.eventStart && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Starts:</span>
                    {new Date(event.deadlines.eventStart).toLocaleDateString()}
                  </div>
                )}
                {event.deadlines.registrationClose && (
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Register by:</span>
                    {new Date(event.deadlines.registrationClose).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* View details button */}
              <div className="mt-4">
                <span className="text-primary-600 font-medium text-sm hover:text-primary-700">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
