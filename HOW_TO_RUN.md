# 🚀 How to Run ROMS - Step by Step Guide

**Last Updated**: October 30, 2025

---

## ⚠️ IMPORTANT: Before You Start

### 1. MongoDB Atlas IP Whitelist
Your backend **WILL NOT WORK** until you whitelist your IP in MongoDB Atlas.

**Your Current IP**: `27.34.71.123`

**Steps**:
1. Go to https://cloud.mongodb.com/
2. Click on your project (Cluster0)
3. Go to **Network Access** (left sidebar)
4. Click **"ADD IP ADDRESS"**
5. Choose one:
   - **Add Current IP**: Enter `27.34.71.123`
   - **Allow Access from Anywhere**: Enter `0.0.0.0/0` (for development only)
6. Click **"Confirm"**
7. Wait 1-2 minutes for changes to apply

---

## 🎯 Quick Start (3 Methods)

### Method 1: Automated Script (EASIEST) ⭐

Open PowerShell in project root and run:

```powershell
.\start-dev.ps1
```

This will:
- ✅ Check if ports are available
- ✅ Start backend in a new window
- ✅ Start frontend in a new window
- ✅ Show you connection info

**Wait 10-15 seconds for both servers to start!**

---

### Method 2: Manual Start (2 Terminals)

#### Terminal 1 - Start Backend
```powershell
cd D:\Project\ROMS\backend
npm start
```

**Expected Output**:
```
MongoDB Connected: cluster0.x0irxir.mongodb.net
Database Name: ROMS
ROMS backend running on port 4000
```

**Keep this terminal open!**

#### Terminal 2 - Start Frontend
Open a **NEW** PowerShell terminal:

```powershell
cd D:\Project\ROMS
npm run dev
```

**Expected Output**:
```
▲ Next.js 15.5.2
- Local:        http://localhost:3000
✓ Ready in 2.3s
```

**Keep this terminal open too!**

---

### Method 3: Using npm-run-all (Alternative)

Install concurrently (one-time):
```powershell
npm install -D concurrently
```

Add to `package.json`:
```json
"scripts": {
  "dev:all": "concurrently \"cd backend && npm start\" \"npm run dev\""
}
```

Then run:
```powershell
npm run dev:all
```

---

## 🔍 Verify Everything is Working

### Step 1: Check Backend Health
Open browser: http://localhost:4000/health

**Expected Response**:
```json
{
  "status": "OK",
  "timestamp": "2025-10-30T...",
  "uptime": 123.45,
  "environment": "development"
}
```

✅ If you see this = Backend is running!  
❌ If you get error = Backend not started or MongoDB issue

---

### Step 2: Check Frontend
Open browser: http://localhost:3000

You should see the restaurant homepage with:
- Hero section
- "Browse Menu" button
- Navigation menu

---

### Step 3: Test API Connection
1. Click **"Browse Menu"** or go to http://localhost:3000/menu
2. Watch the menu items load
3. Open browser console (F12)
4. Look for API calls to `http://localhost:4000/api/menu`

**Success**: Menu items display from database  
**Warning Banner**: "Using sample menu data - backend may not be running"

---

## 🐛 Troubleshooting

### Problem 1: Backend Won't Start

#### Error: "Cannot find module"
```powershell
cd backend
npm install
npm start
```

#### Error: "Port 4000 already in use"
Find and kill the process:
```powershell
# Find process using port 4000
netstat -ano | findstr :4000

# Kill it (replace <PID> with actual number)
taskkill /PID <PID> /F
```

#### Error: "MongooseServerSelectionError"
**Cause**: Your IP is not whitelisted in MongoDB Atlas

**Solution**:
1. Whitelist IP `27.34.71.123` in Atlas (see top of this guide)
2. Wait 1-2 minutes
3. Restart backend

---

### Problem 2: Frontend Shows "Failed to fetch"

**Cause**: Backend is not running

**Solution**:
1. Check backend terminal - is it running?
2. Test: http://localhost:4000/health in browser
3. If not working, check MongoDB whitelist
4. Restart backend

---

### Problem 3: Frontend Shows Sample Data

**Warning**: "Using sample menu data - backend may not be running"

**Cause**: Frontend can't reach backend API

**Checklist**:
- [ ] Backend running on port 4000?
- [ ] Check http://localhost:4000/health
- [ ] Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:4000`
- [ ] Check browser console for CORS errors
- [ ] MongoDB connection working?

**Fix**:
```powershell
# Stop frontend (Ctrl+C)
# Check .env.local exists
Get-Content .env.local

# Restart frontend
npm run dev
```

---

### Problem 4: Port Already in Use (3000 or 4000)

**Check what's using the port**:
```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :4000
```

**Kill the process**:
```powershell
# Replace <PID> with the number from netstat
taskkill /PID <PID> /F
```

---

## 📍 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main website |
| Backend API | http://localhost:4000 | REST API |
| Health Check | http://localhost:4000/health | Backend status |
| Menu API | http://localhost:4000/api/menu | Menu items |
| MongoDB Atlas | https://cloud.mongodb.com/ | Database |

---

## 🔑 Test Accounts

After seeding the database, use these:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@roms.com | admin123 |
| Staff | staff@roms.com | admin123 |
| Customer | john@example.com | admin123 |
| Customer |  jane@example.com| admin123 |

---

## 📊 Checklist for First Run

Before starting servers:

- [ ] MongoDB Atlas IP whitelisted (27.34.71.123 or 0.0.0.0/0)
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Frontend dependencies installed (`node_modules` exists)
- [ ] `.env.local` file exists in root with API URL
- [ ] Database seeded (`npm run seed` in backend directory)
- [ ] No process using port 3000
- [ ] No process using port 4000

---

## 🎯 Complete Startup Workflow

**Step-by-Step First Time Setup**:

```powershell
# 1. Go to project root
cd D:\Project\ROMS

# 2. Check MongoDB IP whitelist (see top of guide)

# 3. Install dependencies (if needed)
cd backend
npm install
cd ..
npm install

# 4. Seed database (one time only)
cd backend
npm run seed
cd ..

# 5. Create .env.local if missing
"NEXT_PUBLIC_API_URL=http://localhost:4000" | Out-File -FilePath .env.local -Encoding utf8

# 6. Start servers
.\start-dev.ps1

# OR manually:
# Terminal 1: cd backend; npm start
# Terminal 2: npm run dev
```

---

## 🎨 What You Should See

### Backend Terminal (Port 4000)
```
[timestamp] MongoDB Connected: cluster0.x0irxir.mongodb.net
[timestamp] Database Name: ROMS
[timestamp] ROMS backend running on port 4000
```

### Frontend Terminal (Port 3000)
```
▲ Next.js 15.5.2
- Local:        http://localhost:3000
- Network:      http://YOUR_IP:3000

✓ Compiled in 2.3s
```

### Browser (http://localhost:3000/menu)
- Menu items loading from database
- Categories: Appetizers, Mains, Pasta, Desserts, Beverages
- 10 menu items total
- "Add to Cart" buttons working

---

## 🔧 Configuration Files Check

### Verify .env.local (project root)
```powershell
Get-Content .env.local
```

**Should show**:
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Verify backend/.env
```powershell
Get-Content backend\.env | Select-String "MONGODB_URI", "PORT"
```

**Should show**:
```
MONGODB_URI=mongodb+srv://zocrohit_db_user:...
PORT=4000
```

---

## 🚦 Server Status Commands

### Check if servers are running
```powershell
# Check backend (should show process on port 4000)
Test-NetConnection -ComputerName localhost -Port 4000

# Check frontend (should show process on port 3000)
Test-NetConnection -ComputerName localhost -Port 3000
```

### Stop servers
```
Press Ctrl+C in each terminal window
```

---

## 🎓 Common Commands Reference

### Backend Commands
```powershell
cd backend

npm start              # Start production server
npm run dev           # Start development server (hot reload)
npm run build         # Compile TypeScript
npm run seed          # Seed database (one time)
```

### Frontend Commands
```powershell
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Check code quality
```

---

## 📝 Quick Test Sequence

After starting both servers:

1. ✅ **Backend Health**: http://localhost:4000/health
2. ✅ **Frontend Home**: http://localhost:3000
3. ✅ **Menu Page**: http://localhost:3000/menu (should fetch from API)
4. ✅ **Login**: http://localhost:3000/login (test with admin@roms.com)
5. ✅ **QR Order**: http://localhost:3000/?table=5 (should show table number)
6. ✅ **Cart**: Add items and go to http://localhost:3000/cart

---

## 🆘 Still Having Issues?

### Get Help
1. Check `QUICK_START.md` for quick fixes
2. Check `INTEGRATION_COMPLETE.md` for detailed info
3. Check backend logs in `backend/logs/`
4. Check browser console (F12) for errors

### Useful Debug Commands
```powershell
# Check backend logs
Get-Content backend\logs\combined.log -Tail 50

# Check if node is running
Get-Process node

# Kill all node processes (CAREFUL!)
Stop-Process -Name node -Force
```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Backend terminal shows "MongoDB Connected"
2. ✅ Frontend terminal shows "Ready in X.Xs"
3. ✅ http://localhost:4000/health returns JSON
4. ✅ http://localhost:3000 shows restaurant homepage
5. ✅ Menu page loads real items from database
6. ✅ No error messages in browser console
7. ✅ Can login with test credentials
8. ✅ Can add items to cart

---

## 🎉 You're Ready!

Once both servers are running and verified:

1. Browse the menu at http://localhost:3000/menu
2. Test login at http://localhost:3000/login
3. Try QR ordering: http://localhost:3000/?table=5
4. Build new features!

**Need more help?** Check other documentation files:
- `QUICK_START.md` - Quick reference
- `SETUP_GUIDE.md` - Detailed setup
- `PROJECT_STATUS.md` - Feature status
- `INTEGRATION_COMPLETE.md` - Integration details

---

**Happy Coding! 🚀**

