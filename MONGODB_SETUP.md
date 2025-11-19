# MongoDB Installation Guide for Windows

## Quick Setup for Windows

### Option 1: Install MongoDB Community Server (Recommended)

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Download and run the installer

2. **During Installation**
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool - optional but helpful)

3. **MongoDB will auto-start as a Windows service**
   - No need to manually start it!

### Option 2: Use MongoDB Compass Standalone

If you have MongoDB Compass installed:
- It can use its own local MongoDB instance
- Just open Compass and connect to `mongodb://localhost:27017`

### Option 3: Use Docker (if you have Docker Desktop)

```powershell
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

---

## Verify MongoDB is Running

Open PowerShell and run:

```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# Or check if port 27017 is open
Test-NetConnection -ComputerName localhost -Port 27017
```

---

## If MongoDB is Already Installed

Just start the service:

```powershell
# Start MongoDB service
net start MongoDB

# Or using Services GUI:
# Press Win + R, type "services.msc", find MongoDB, right-click, Start
```

---

## Check Connection

Once MongoDB is running, restart your app:

```powershell
# Stop the app (Ctrl+C in the terminal where npm run dev is running)
# Then start again:
npm run dev
```

You should see: ✅ MongoDB Connected: localhost

---

## Troubleshooting

### MongoDB not installed?
Download from: https://www.mongodb.com/try/download/community

### Port 27017 already in use?
Something else is using that port. Check what's running:
```powershell
netstat -ano | findstr :27017
```

### Can't start MongoDB service?
Try running PowerShell as Administrator:
```powershell
net start MongoDB
```

---

## Alternative: Use MongoDB Atlas (Cloud)

If you prefer using MongoDB Atlas (cloud), you need to:

1. Go to https://cloud.mongodb.com/
2. Login to your cluster
3. Go to "Network Access" → "IP Access List"
4. Click "Add IP Address"
5. Click "Add Current IP Address" or use "0.0.0.0/0" (allow all - for development only!)
6. Wait 1-2 minutes for changes to apply
7. In `.env`, uncomment the MongoDB Atlas URI line
8. Restart your app

---

For quickest setup, just **install MongoDB Community Server** - it's a 5-minute process!
