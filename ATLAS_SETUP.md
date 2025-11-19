# How to Whitelist Your IP in MongoDB Atlas

## Steps:

1. **Go to MongoDB Atlas**
   - Visit: https://cloud.mongodb.com/
   - Login with your account

2. **Navigate to Network Access**
   - Click on "Network Access" in the left sidebar
   - Or go to: Security → Network Access

3. **Add Your IP Address**
   - Click "Add IP Address" button
   - Click "Add Current IP Address" (auto-detects your IP)
   - Or manually enter: `0.0.0.0/0` (allows all IPs - development only!)
   - Add a comment like "Development Machine"
   - Click "Confirm"

4. **Wait 1-2 Minutes**
   - Atlas needs time to update the whitelist
   - You'll see a spinning indicator

5. **Update Your .env File**
   - Open `backend/.env`
   - Comment out the local MongoDB line
   - Uncomment the Atlas line:
   
   ```env
   # Database
   # MONGODB_URI=mongodb://localhost:27017/teamfinder
   
   # MongoDB Atlas (cloud)
   MONGODB_URI=mongodb+srv://girish4936_db_user:mB9VxUXAakd4U3H2@cluster0.bcre7it.mongodb.net/teamfinder?retryWrites=true&w=majority
   ```

6. **Restart Your App**
   ```powershell
   # Press Ctrl+C to stop
   npm run dev
   ```

## Important Notes:

- **Security**: Using `0.0.0.0/0` allows any IP to connect. This is OK for development but NOT for production!
- **Dynamic IP**: If your ISP gives you a dynamic IP, you may need to update this when your IP changes
- **Better Option**: For development, use local MongoDB (it's simpler!)

## Verify Connection

You should see:
```
✅ MongoDB Connected: cluster0.bcre7it.mongodb.net
```

Instead of the error about IP whitelisting.
