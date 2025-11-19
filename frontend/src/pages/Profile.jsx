/**
 * Profile Page
 * Displays user profile information
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
                {user.phone && (
                  <p className="text-gray-600 mt-1">📞 {user.phone}</p>
                )}
              <span className={`badge mt-2 ${
                user.role === 'admin' ? 'badge-warning' : 'badge-primary'
              }`}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
          <Link to="/profile/edit" className="btn-primary">
            Edit Profile
          </Link>
        </div>

        {/* Profile info */}
        <div className="space-y-6">
          {/* Academic info */}
          {user.role === 'student' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Course</p>
                  <p className="font-medium">{user.course || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="font-medium">{user.branch || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-medium">{user.year || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Skills */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
            {user.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span key={index} className="badge badge-primary">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills added yet</p>
            )}
          </div>

          {/* Achievements */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
            {user.achievements && user.achievements.length > 0 ? (
              <ul className="space-y-2">
                {user.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-600 mr-2">🏆</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No achievements added yet</p>
            )}
          </div>

          {/* Statistics */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-gray-600">Events Participated</p>
                <p className="text-3xl font-bold text-primary-600">
                  {user.stats?.eventsParticipated || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Events Won</p>
                <p className="text-3xl font-bold text-green-600">
                  {user.stats?.eventsWon || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
