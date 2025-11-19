# 📡 API Testing Guide

Use these examples to test the API with tools like Postman, Thunder Client, or curl.

---

## 🔐 Authentication Endpoints

### 1. Register User

**POST** `/api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "course": "B.Tech",
  "branch": "Computer Science",
  "year": "3rd Year"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    ...
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### 2. Login

**POST** `/api/auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

### 3. Refresh Token

**POST** `/api/auth/refresh`

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "new_access_token..."
}
```

---

### 4. Logout

**POST** `/api/auth/logout`

```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

---

## 👤 User Endpoints

**Note:** All require `Authorization: Bearer <access_token>` header

### 1. Get Current User Profile

**GET** `/api/users/me`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "skills": ["React", "Python"],
    "stats": {
      "eventsParticipated": 5,
      "eventsWon": 2
    }
  }
}
```

---

### 2. Update Profile

**PUT** `/api/users/me`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Body:**
```json
{
  "name": "John Doe Updated",
  "skills": ["React", "Python", "Machine Learning"],
  "achievements": ["Winner of XYZ Hackathon 2023"]
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

---

### 3. Search Users by Skills

**GET** `/api/users/search?skills=react,python&limit=20`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "users": [
    {
      "_id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "skills": ["React", "Python", "Node.js"],
      "matchScore": 2,
      "stats": {
        "eventsParticipated": 8,
        "eventsWon": 3
      }
    }
  ],
  "total": 5
}
```

---

### 4. Get User by ID

**GET** `/api/users/60d5f...`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "user": { ... }
}
```

---

## 📅 Event Endpoints

### 1. Create Event (Admin Only)

**POST** `/api/events`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Body:**
```json
{
  "title": "Smart India Hackathon 2024",
  "description": "A nationwide initiative to provide students with a platform to solve pressing problems.",
  "categories": ["Hackathon", "Innovation", "Technology"],
  "rules": [
    "Teams must consist of 4-6 members",
    "All team members must be currently enrolled students",
    "Original ideas only"
  ],
  "teamSize": {
    "min": 4,
    "max": 6
  },
  "deadlines": {
    "registrationClose": "2024-12-31T23:59:59.999Z",
    "eventStart": "2025-01-15T09:00:00.000Z",
    "eventEnd": "2025-01-17T18:00:00.000Z"
  },
  "brochureUrl": "https://example.com/brochure.pdf"
}
```

**Response:**
```json
{
  "message": "Event created successfully",
  "event": {
    "_id": "...",
    "title": "Smart India Hackathon 2024",
    "status": "upcoming",
    ...
  }
}
```

---

### 2. Get All Events

**GET** `/api/events?status=upcoming&category=hackathon&page=1&limit=50`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Query Parameters:**
- `status`: upcoming | ongoing | past
- `category`: Filter by category name
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 50)

**Response:**
```json
{
  "events": [ ... ],
  "total": 25,
  "page": 1,
  "pages": 1
}
```

---

### 3. Get Event by ID

**GET** `/api/events/60d5f...`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "event": {
    "_id": "...",
    "title": "Smart India Hackathon 2024",
    "description": "...",
    "categories": ["Hackathon"],
    "rules": ["Rule 1", "Rule 2"],
    "teamSize": { "min": 4, "max": 6 },
    "status": "upcoming",
    "createdBy": {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

---

### 4. Update Event (Admin Only)

**PUT** `/api/events/60d5f...`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "ongoing"
}
```

**Response:**
```json
{
  "message": "Event updated successfully",
  "event": { ... }
}
```

---

### 5. Delete Event (Admin Only)

**DELETE** `/api/events/60d5f...`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

---

### 6. Ask Chatbot (Stub)

**POST** `/api/events/60d5f.../ask`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Body:**
```json
{
  "question": "What is the registration deadline?"
}
```

**Response:**
```json
{
  "question": "What is the registration deadline?",
  "answer": "The registration deadline for Smart India Hackathon 2024 is 12/31/2024. Make sure to register before this date!"
}
```

---

## 👥 Team Endpoints

### 1. Create Team

**POST** `/api/teams`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Body:**
```json
{
  "eventId": "60d5f...",
  "name": "Code Warriors"
}
```

**Response:**
```json
{
  "message": "Team created successfully",
  "team": {
    "_id": "...",
    "name": "Code Warriors",
    "leaderId": { ... },
    "members": [ ... ],
    "invites": [],
    "eventId": { ... }
  }
}
```

---

### 2. Get My Teams

**GET** `/api/teams/my-teams`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "teams": [
    {
      "_id": "...",
      "name": "Code Warriors",
      "leaderId": { ... },
      "members": [ ... ],
      "eventId": { ... }
    }
  ],
  "total": 3
}
```

---

### 3. Get Teams for Event

**GET** `/api/teams/event/60d5f...`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "teams": [ ... ],
  "total": 15
}
```

---

### 4. Get Team by ID

**GET** `/api/teams/60d5f...`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "team": {
    "_id": "...",
    "name": "Code Warriors",
    "leaderId": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "skills": ["React", "Python"]
    },
    "members": [ ... ],
    "invites": [ ... ],
    "eventId": { ... }
  }
}
```

---

### 5. Invite User to Team

**POST** `/api/teams/60d5f.../invite`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Body:**
```json
{
  "userId": "60d5f..."
}
```

**Response:**
```json
{
  "message": "Invite sent successfully",
  "team": { ... }
}
```

---

### 6. Join Team (Accept Invite)

**POST** `/api/teams/60d5f.../join`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "message": "Successfully joined team",
  "team": { ... }
}
```

---

### 7. Leave Team

**POST** `/api/teams/60d5f.../leave`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "message": "Successfully left team"
}
```

---

### 8. Delete Team (Leader Only)

**DELETE** `/api/teams/60d5f...`

**Headers:**
```
Authorization: Bearer eyJhbGc...
```

**Response:**
```json
{
  "message": "Team deleted successfully"
}
```

---

## 🧪 Testing Workflow

### Complete Test Scenario:

#### 1. Register Two Users

**User 1 (Admin):**
```bash
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

**User 2 (Student):**
```bash
POST /api/auth/register
{
  "name": "Student User",
  "email": "student@test.com",
  "password": "student123",
  "role": "student",
  "skills": ["React", "Python"]
}
```

Save both access tokens!

---

#### 2. Create Event (as Admin)

```bash
POST /api/events
Authorization: Bearer <admin_access_token>

{
  "title": "Test Hackathon",
  "description": "A test event",
  "categories": ["Hackathon"],
  "teamSize": { "min": 2, "max": 4 }
}
```

Save the event ID!

---

#### 3. Create Team (as Student)

```bash
POST /api/teams
Authorization: Bearer <student_access_token>

{
  "eventId": "<event_id>",
  "name": "Test Team"
}
```

Save the team ID!

---

#### 4. Search for Teammates

```bash
GET /api/users/search?skills=react
Authorization: Bearer <student_access_token>
```

---

#### 5. Invite User to Team

```bash
POST /api/teams/<team_id>/invite
Authorization: Bearer <student_access_token>

{
  "userId": "<user_id_from_search>"
}
```

---

#### 6. Ask Chatbot

```bash
POST /api/events/<event_id>/ask
Authorization: Bearer <student_access_token>

{
  "question": "What is the team size?"
}
```

---

## ⚠️ Common Error Responses

### 400 Bad Request
```json
{
  "error": {
    "code": 400,
    "message": "Validation error message"
  }
}
```

### 401 Unauthorized
```json
{
  "error": {
    "code": 401,
    "message": "No token provided"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": 403,
    "message": "Admin access required"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": 404,
    "message": "Resource not found"
  }
}
```

### 429 Too Many Requests
```json
{
  "error": {
    "code": 429,
    "message": "Too many requests, please try again later"
  }
}
```

---

## 🔧 Using curl

### Register:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"student"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Get Events:
```bash
curl http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 💡 Tips

1. **Save tokens**: After login/register, save the access token for subsequent requests
2. **Use Postman**: Create a collection for easier testing
3. **Environment variables**: Store tokens in Postman environment
4. **Check console**: Backend logs helpful debugging info
5. **Refresh tokens**: If you get 401, your token may have expired

---

Happy Testing! 🚀
