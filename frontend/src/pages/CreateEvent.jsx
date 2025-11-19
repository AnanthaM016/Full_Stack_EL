/**
 * Create Event Page (Admin Only)
 * Form to create new events
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categories: '',
    rules: '',
    teamSizeMin: 1,
    teamSizeMax: 6,
    registrationClose: '',
    eventStart: '',
    eventEnd: '',
    brochureUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare data
      const eventData = {
        title: formData.title,
        description: formData.description,
        categories: formData.categories.split(',').map(c => c.trim()).filter(c => c),
        rules: formData.rules.split('\n').map(r => r.trim()).filter(r => r),
        teamSize: {
          min: parseInt(formData.teamSizeMin),
          max: parseInt(formData.teamSizeMax)
        },
        deadlines: {},
        brochureUrl: formData.brochureUrl
      };

      if (formData.registrationClose) {
        eventData.deadlines.registrationClose = new Date(formData.registrationClose);
      }
      if (formData.eventStart) {
        eventData.deadlines.eventStart = new Date(formData.eventStart);
      }
      if (formData.eventEnd) {
        eventData.deadlines.eventEnd = new Date(formData.eventEnd);
      }

      const response = await api.post('/events', eventData);
      alert('Event created successfully!');
      navigate(`/events/${response.data.event._id}`);
    } catch (error) {
      setError(error.response?.data?.error?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Event</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., Smart India Hackathon 2024"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="input-field"
              placeholder="Describe the event..."
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories * (comma-separated)
            </label>
            <input
              type="text"
              name="categories"
              value={formData.categories}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="e.g., Hackathon, Innovation, Technology"
            />
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rules (one per line)
            </label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              rows="5"
              className="input-field"
              placeholder="Each line will be a separate rule"
            />
          </div>

          {/* Team size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Team Size *
              </label>
              <input
                type="number"
                name="teamSizeMin"
                value={formData.teamSizeMin}
                onChange={handleChange}
                required
                min="1"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Team Size *
              </label>
              <input
                type="number"
                name="teamSizeMax"
                value={formData.teamSizeMax}
                onChange={handleChange}
                required
                min="1"
                className="input-field"
              />
            </div>
          </div>

          {/* Deadlines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Close
              </label>
              <input
                type="date"
                name="registrationClose"
                value={formData.registrationClose}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Start
              </label>
              <input
                type="date"
                name="eventStart"
                value={formData.eventStart}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event End
              </label>
              <input
                type="date"
                name="eventEnd"
                value={formData.eventEnd}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          {/* Brochure URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brochure URL (optional)
            </label>
            <input
              type="url"
              name="brochureUrl"
              value={formData.brochureUrl}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/brochure.pdf"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Event'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
