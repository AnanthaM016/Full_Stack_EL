# TeamFinder - Feature Updates Implementation Guide

## Overview
This document contains all the changes needed to implement the requested features:
1. Show ALL students in search page (not just skill-based matches)
2. Filter students by skills (optional)
3. Direct invite buttons on search results
4. Add skills during registration
5. Basic notifications system

## ✅ COMPLETED Backend Changes

### 1. New API Endpoint: GET /api/users/all
**File**: `backend/controllers/userController.js`
- Added `getAllStudents()` function that returns all students
- Skills parameter is now optional
- When skills provided, filters and ranks by match score
- When no skills, returns all students sorted by experience

### 2. Updated Route
**File**: `backend/routes/userRoutes.js`
- Added route: `GET /api/users/all` - Get all students with optional filtering

## 📝 MANUAL CHANGES NEEDED

### 1. Fix SearchTeammates.jsx

**Current Issue**: The file got corrupted during automated editing. You need to replace it manually.

**Location**: `frontend/src/pages/SearchTeammates.jsx`

**Action**: Delete the existing `SearchTeammates.jsx` and rename `SearchTeammates2.jsx` to `SearchTeammates.jsx`, OR manually replace the entire content with the code below:

```jsx
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
                    📧 Contact via Email
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
```

### 2. Add Skills Field to Registration

**File**: `frontend/src/pages/Register.jsx`

**Changes needed**:

1. Add `skills` to the formData state (around line 17):
```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'student',
  course: '',
  branch: '',
  year: '',
  skills: ''  // ADD THIS LINE
});
```

2. Add skills input field in the form (after the "year" field, around line 180):
```jsx
{/* Skills field - ADD THIS ENTIRE BLOCK */}
<div>
  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
    Skills (comma-separated)
  </label>
  <input
    type="text"
    id="skills"
    name="skills"
    value={formData.skills}
    onChange={handleChange}
    placeholder="e.g., React, Python, UI/UX, Machine Learning"
    className="input-field w-full"
  />
  <p className="text-xs text-gray-500 mt-1">
    Enter your skills separated by commas. This helps teammates find you!
  </p>
</div>
```

3. Update the register call to include skills (in handleSubmit function, around line 60):
```jsx
await register({
  name: formData.name,
  email: formData.email,
  password: formData.password,
  role: formData.role,
  course: formData.course,
  branch: formData.branch,
  year: formData.year,
  skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)  // ADD THIS LINE
});
```

### 3. Update Backend Register Controller

**File**: `backend/controllers/authController.js`

Find the `register` function and add skills handling (around line 20):

```jsx
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, course, branch, year, skills } = req.body;  // ADD skills here

    // ... existing validation code ...

    // Create new user
    const user = new User({
      name,
      email,
      passwordHash,
      role: role || 'student',
      course,
      branch,
      year,
      skills: skills || []  // ADD THIS LINE
    });

    // ... rest of the function ...
  }
};
```

## 🎯 Testing the New Features

After making these changes:

1. **Test Registration with Skills**:
   - Register a new student
   - Add skills like "React, Python, JavaScript"
   - Verify skills are saved in profile

2. **Test Browse All Students**:
   - Go to "Find Teammates" page
   - Should see ALL students immediately (no need to enter skills)
   - Verify you can see student1, student3, and any other registered students

3. **Test Skill Filtering**:
   - Enter skills in the filter box (e.g., "React, Python")
   - Click "Apply Filter"
   - Should see only students with matching skills
   - Click "Clear Filter" to see all students again

4. **Test Direct Invitations**:
   - Create a team first
   - Go to "Find Teammates"
   - Click "Invite to Team" button on a student card
   - Select your team from dropdown
   - Click "Send Invite"
   - Should see success message

## 📋 Summary of What Changed

### ✅ What Works Now:
- **Browse all students**: No skills required, see everyone immediately
- **Optional filtering**: Enter skills to narrow down results
- **Direct invitations**: Invite button on each student card with team selection
- **Skill matching**: When filtering, shows match score
- **Better UX**: Clear messaging, loading states, success/error feedback

### 🔮 Future Enhancements (Not Implemented Yet):
- Real-time notifications system
- In-app notification bell icon
- Email notifications for invites
- Notification history page
- Mark notifications as read

## 🚀 Quick Start Commands

```bash
# Start backend (from project root)
cd backend
npm run dev

# Start frontend (from project root, in new terminal)
cd frontend
npm run dev
```

## ❓ Troubleshooting

### If SearchTeammates page shows errors:
1. Delete `frontend/src/pages/SearchTeammates.jsx`
2. Copy the complete code from section "1. Fix SearchTeammates.jsx" above
3. Create new file with that content
4. Restart frontend dev server

### If students don't appear:
1. Make sure you have multiple students registered
2. Check browser console for API errors
3. Verify backend is running and MongoDB is connected
4. Check that `/api/users/all` endpoint returns data in browser Network tab

### If invitations don't work:
1. Make sure you have created at least one team
2. Check that you're logged in
3. Verify the team belongs to you
4. Check backend logs for errors

## 📝 Notes

- The skills field accepts comma-separated values
- Existing users without skills will show "No skills listed"
- Skills are case-insensitive for searching
- Maximum 50 skills per user (defined in User model)
- Invitations require you to have at least one team
