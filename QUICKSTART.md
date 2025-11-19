# 🚀 Quick Start Guide

Get TeamFinder up and running in 5 minutes!

## Prerequisites Check

Open a terminal and run:

```bash
# Check Node.js (should be v16+)
node --version

# Check npm
npm --version

# Check MongoDB
mongod --version
```

If any are missing, install them first!

---

## Installation Steps

### 1️⃣ Install All Dependencies

```bash
# From the root directory
npm run install:all
```

This installs dependencies for the root, backend, and frontend.

### 2️⃣ Configure Environment

The backend already has a `.env` file. You can use it as-is for development!

**Optional**: Edit `backend/.env` if needed:
- Change JWT secrets for production
- Modify MongoDB connection string
- Update CORS origin if needed

### 3️⃣ Start MongoDB

**Windows**: MongoDB should auto-start as a service. If not:
```bash
mongod
```

**macOS/Linux**:
```bash
# Using brew
brew services start mongodb-community

# Or manually
sudo systemctl start mongod
```

### 4️⃣ Run the Application

```bash
# From the root directory
npm run dev
```

This starts both backend and frontend:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

---

## 🎉 You're Ready!

Open your browser and go to: **http://localhost:5173**

### First Steps:

1. **Register as a Student**
   - Click "Register here"
   - Fill in your details
   - Add some skills (e.g., React, Python, ML)

2. **Register as an Admin** (open in incognito/another browser)
   - Register another account
   - Choose role: "Admin"

3. **Create an Event** (as Admin)
   - Go to "Create Event"
   - Fill in event details
   - Submit

4. **Browse and Join Events** (as Student)
   - View events on dashboard
   - Click on an event
   - Create a team

5. **Search for Teammates**
   - Go to "Find Teammates"
   - Search by skills
   - View matching users

---

## 🛑 Troubleshooting

### Backend not starting?
```bash
cd backend
npm install
npm run dev
```

### Frontend not starting?
```bash
cd frontend
npm install
npm run dev
```

### MongoDB connection error?
- Make sure MongoDB is running: `mongod`
- Check if port 27017 is available
- Verify `MONGODB_URI` in `backend/.env`

### Can't login after registering?
- Clear browser's localStorage
- Check backend terminal for errors
- Verify JWT secrets are set in `.env`

---

## 📝 Test Credentials

Create these accounts for full testing:

**Admin Account**:
- Name: Admin User
- Email: admin@test.com
- Password: admin123
- Role: admin

**Student Account**:
- Name: John Doe
- Email: john@test.com
- Password: student123
- Role: student
- Skills: React, Node.js, MongoDB

---

## 🎯 Quick Feature Tour

### As Admin:
1. Create Event → Fill form → Submit
2. View all events
3. Delete events you created

### As Student:
1. Dashboard → Browse events
2. Event Details → Create team
3. Find Teammates → Search by skills
4. My Teams → View all your teams
5. Profile → Edit skills and achievements
6. Chatbot → Ask questions about events

---

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the code - it's heavily commented!
- Try creating multiple teams and events
- Test the invite system
- Experiment with the skill-based search

---

## 💡 Tips

1. **Keep terminals open**: You need both backend and frontend running
2. **Use multiple browsers**: Test student and admin features simultaneously
3. **Check console**: Browser and terminal consoles show helpful errors
4. **Read comments**: Every file is well-documented for learning

---

**Happy Building! 🎓**

If you face any issues, check the main README or review the error messages.
