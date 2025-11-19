# 🏗️ TeamFinder Architecture Guide

A beginner-friendly explanation of how everything works together.

---

## 📊 System Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Browser   │  HTTP   │   Express   │  Mongo  │   MongoDB   │
│   (React)   │ ◄────► │   Backend   │ ◄────► │  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
```

### Components:
1. **Frontend (React)**: What users see and interact with
2. **Backend (Express)**: Handles business logic and data processing
3. **Database (MongoDB)**: Stores all data persistently

---

## 🎨 Frontend Architecture (React)

### File Structure:
```
frontend/src/
├── main.jsx                 # Entry point
├── App.jsx                  # Root component with routing
├── index.css                # Global styles (Tailwind)
│
├── components/              # Reusable UI components
│   ├── Navbar.jsx          # Navigation bar
│   └── ProtectedRoute.jsx  # Auth guard for routes
│
├── context/                 # Global state management
│   └── AuthContext.jsx     # User authentication state
│
├── pages/                   # Full page components
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Main events feed
│   ├── EventDetails.jsx    # Single event view
│   ├── CreateEvent.jsx     # Admin: create events
│   ├── Profile.jsx         # User profile view
│   ├── EditProfile.jsx     # Edit user profile
│   ├── SearchTeammates.jsx # Search for teammates
│   ├── TeamView.jsx        # Single team view
│   └── MyTeams.jsx         # List of user's teams
│
└── utils/                   # Helper functions
    └── api.js              # Axios configuration & interceptors
```

### How React Components Work:

```javascript
// Example: Dashboard.jsx

1. Component loads → useEffect runs
2. useEffect calls fetchEvents()
3. fetchEvents() uses axios to GET /api/events
4. Backend responds with event data
5. setEvents() updates state
6. React re-renders with new data
```

### Authentication Flow:

```
Login Page → Submit credentials → Backend validates
   ↓
Backend returns: { user, accessToken, refreshToken }
   ↓
Store tokens in localStorage
   ↓
Update AuthContext state
   ↓
Redirect to Dashboard
   ↓
All future API calls include token in headers
```

### Protected Routes:

```javascript
// ProtectedRoute checks if user is logged in
<ProtectedRoute>
  <Dashboard />  // Only renders if authenticated
</ProtectedRoute>

// Admin-only routes
<ProtectedRoute adminOnly>
  <CreateEvent />  // Only for admins
</ProtectedRoute>
```

---

## 🔧 Backend Architecture (Express)

### File Structure:
```
backend/
├── server.js               # Entry point, middleware setup
│
├── config/
│   └── database.js         # MongoDB connection
│
├── models/                 # Database schemas
│   ├── User.js            # User model
│   ├── Event.js           # Event model
│   └── Team.js            # Team model
│
├── controllers/            # Business logic
│   ├── authController.js   # Auth operations
│   ├── userController.js   # User operations
│   ├── eventController.js  # Event operations
│   └── teamController.js   # Team operations
│
├── routes/                 # API endpoints
│   ├── authRoutes.js      # /api/auth/*
│   ├── userRoutes.js      # /api/users/*
│   ├── eventRoutes.js     # /api/events/*
│   └── teamRoutes.js      # /api/teams/*
│
├── middleware/             # Custom middleware
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Error handling
│
└── services/               # External services
    ├── aiParserService.js  # Brochure parsing (stub)
    └── chatbotService.js   # Event Q&A (stub)
```

### Request Flow:

```
Client Request → Express Server → Middleware → Route → Controller → Model → Database
                      ↓
                Error Handler (if error)
                      ↓
                JSON Response → Client
```

### Example: Creating an Event

```
1. POST /api/events
2. Rate limiter checks request count
3. CORS middleware validates origin
4. Body parser parses JSON
5. authenticate middleware verifies JWT
6. requireAdmin middleware checks role
7. eventRoutes passes to eventController.createEvent
8. Controller validates data
9. Creates Event document
10. Saves to MongoDB
11. Returns JSON response
```

### Authentication Middleware:

```javascript
// How authenticate() works:

1. Extract token from Authorization header
2. Verify token using JWT_ACCESS_SECRET
3. If valid: decode → get userId → find user → attach to req.user
4. If invalid: return 401 error
5. If expired: client tries refresh token
```

### JWT Token System:

```
Access Token (15 min) → Used for API requests
Refresh Token (7 days) → Used to get new access token

When access token expires:
1. API returns 401
2. Frontend intercepts (axios interceptor)
3. Sends refresh token to /api/auth/refresh
4. Gets new access token
5. Retries original request
```

---

## 💾 Database Architecture (MongoDB)

### Collections:

```
teamfinder/
├── users         # All users (students + admins)
├── events        # All events
└── teams         # All teams
```

### Data Models:

#### User Document:
```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  passwordHash: "hashed_password",
  role: "student",
  course: "B.Tech",
  branch: "Computer Science",
  year: "3rd Year",
  skills: ["React", "Python", "ML"],
  achievements: ["Won XYZ Hackathon"],
  stats: {
    eventsParticipated: 5,
    eventsWon: 2
  },
  refreshToken: "...",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

#### Event Document:
```javascript
{
  _id: ObjectId("..."),
  title: "Smart India Hackathon 2024",
  description: "...",
  categories: ["Hackathon", "Innovation"],
  rules: ["Rule 1", "Rule 2"],
  deadlines: {
    registrationClose: ISODate("..."),
    eventStart: ISODate("..."),
    eventEnd: ISODate("...")
  },
  teamSize: { min: 4, max: 6 },
  brochureUrl: "https://...",
  status: "upcoming",
  createdBy: ObjectId("admin_user_id"),
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

#### Team Document:
```javascript
{
  _id: ObjectId("..."),
  eventId: ObjectId("event_id"),
  name: "Code Warriors",
  leaderId: ObjectId("user_id"),
  members: [
    ObjectId("user1_id"),
    ObjectId("user2_id")
  ],
  invites: [
    ObjectId("invited_user_id")
  ],
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Relationships:

```
User ────┬──── creates ────► Event
         │
         └──── leads/joins ──► Team ──── for ──► Event
```

### Indexes (for performance):

```javascript
// User model
{ email: 1 }           // Fast login lookups
{ skills: 1 }          // Fast skill-based search

// Event model
{ status: 1 }          // Fast filtering by status
{ categories: 1 }      // Fast category filtering

// Team model
{ eventId: 1 }         // Fast team lookups per event
```

---

## 🔄 Key User Flows

### 1. User Registration Flow

```
Frontend (Register.jsx)
  ↓ Submit form
POST /api/auth/register
  ↓ authController.register
  1. Validate input
  2. Check if email exists
  3. Hash password (bcrypt)
  4. Create User document
  5. Generate tokens (JWT)
  6. Save refresh token
  7. Return user + tokens
  ↓
Frontend stores tokens
  ↓
Redirect to Dashboard
```

### 2. Event Discovery Flow

```
Frontend (Dashboard.jsx)
  ↓ Page loads
GET /api/events?status=upcoming
  ↓ authenticate middleware
  ↓ eventController.getEvents
  1. Build filter query
  2. Query MongoDB
  3. Populate creator info
  4. Return events array
  ↓
Frontend displays event cards
```

### 3. Team Creation Flow

```
Frontend (EventDetails.jsx)
  ↓ User clicks "Create Team"
POST /api/teams
{
  eventId: "...",
  name: "Team Name"
}
  ↓ authenticate middleware
  ↓ teamController.createTeam
  1. Validate event exists
  2. Check user not already in team
  3. Create Team document
  4. Add user as leader & member
  5. Return team data
  ↓
Frontend shows success
```

### 4. Skill-Based Search Flow

```
Frontend (SearchTeammates.jsx)
  ↓ User enters skills
GET /api/users/search?skills=react,python
  ↓ authenticate middleware
  ↓ userController.searchUsers
  1. Parse skill string
  2. Query users with regex matching
  3. Calculate match scores
  4. Sort by score + experience
  5. Return ranked users
  ↓
Frontend displays results
```

---

## 🔐 Security Features

### 1. Password Security
```
User enters password → bcrypt.hash() → Store hash only
Login attempt → bcrypt.compare() → password vs hash
```

### 2. JWT Security
```
- Access tokens: Short-lived (15 min)
- Refresh tokens: Stored in DB, can be revoked
- Tokens signed with secret keys
- Tokens verified on every protected request
```

### 3. API Protection
```
- Rate limiting: Max 100 requests / 15 min
- Auth rate limit: Max 5 attempts / 15 min
- CORS: Only allowed origins
- Helmet: Security headers
- Input validation: Mongoose schemas
```

### 4. Role-Based Access
```
Student: Can view events, create teams, search users
Admin: All student permissions + create/edit/delete events
```

---

## 📡 API Communication

### Request Format:
```javascript
// Frontend (api.js)
const response = await api.get('/events', {
  params: { status: 'upcoming' }
});

// Translates to:
GET http://localhost:5000/api/events?status=upcoming
Headers: {
  Authorization: "Bearer <access_token>",
  Content-Type: "application/json"
}
```

### Response Format:
```javascript
// Success response
{
  events: [...],
  total: 10,
  page: 1
}

// Error response
{
  error: {
    code: 400,
    message: "Validation error"
  }
}
```

---

## 🎯 State Management

### Global State (AuthContext)
```javascript
AuthContext provides:
- user: Current user object
- loading: Auth check in progress
- login(): Login function
- register(): Register function
- logout(): Logout function
- updateProfile(): Update user function
- isAuthenticated: Boolean
- isAdmin: Boolean

Used in: All pages and components
```

### Local State (Component State)
```javascript
// Each component manages its own state
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);
const [filter, setFilter] = useState('all');

// State changes trigger re-renders
```

---

## 🚀 Performance Optimizations

### 1. Database Indexes
- Fast lookups for common queries
- Reduces query time from O(n) to O(log n)

### 2. Pagination
- Load events in chunks (default 50)
- Reduces data transfer

### 3. Lazy Loading
- Routes loaded on-demand
- Faster initial page load

### 4. Token Refresh
- Only refresh when needed
- Reduces server load

### 5. Mongoose Population
- Fetch related data efficiently
- Reduces multiple queries

---

## 🧪 Testing Strategy

### Manual Testing Checklist:

**Authentication:**
- [ ] Register new user
- [ ] Login with credentials
- [ ] Auto-refresh token
- [ ] Logout

**Events:**
- [ ] Create event (admin)
- [ ] View all events
- [ ] Filter events
- [ ] View event details
- [ ] Update event (admin)
- [ ] Delete event (admin)

**Teams:**
- [ ] Create team
- [ ] Invite member
- [ ] Accept invite
- [ ] View team
- [ ] Leave team
- [ ] Delete team

**Search:**
- [ ] Search by skills
- [ ] View results
- [ ] Check ranking

---

## 🎓 Learning Path

### Beginner:
1. Start with frontend pages
2. Understand React hooks (useState, useEffect)
3. Follow authentication flow
4. See how API calls work

### Intermediate:
1. Study backend routes
2. Understand middleware
3. Learn JWT authentication
4. Explore database models

### Advanced:
1. Implement new features
2. Add real AI integration
3. Optimize database queries
4. Add WebSocket for real-time features

---

## 💡 Key Concepts Explained

### What is Middleware?
```
Functions that run BEFORE your route handler
Example: Check if user is authenticated before allowing access
```

### What is JWT?
```
A token that proves "I am who I say I am"
Contains: userId, role, expiration time
Signed so it can't be tampered with
```

### What is Mongoose?
```
Makes MongoDB easier to use in Node.js
Provides schemas, validation, and query building
```

### What is React Context?
```
A way to share data across components without passing props
Example: User info available everywhere in the app
```

---

**This architecture is designed to be:**
- ✅ Easy to understand
- ✅ Easy to modify
- ✅ Easy to extend
- ✅ Production-ready with minor changes

Happy learning! 🎓
