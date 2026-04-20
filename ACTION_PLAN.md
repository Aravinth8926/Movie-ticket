# 🎯 ACTION PLAN - Fix "No Movies Loading" Issue

## 🔴 PROBLEM IDENTIFIED

Your frontend shows: **"Oops! Failed to load movies. Please try again."**

### Root Cause:
1. ❌ **Maven is NOT installed** → Can't build/run backend
2. ❌ **Backend is NOT running** → No API to fetch movies
3. ❌ **MongoDB is NOT running** → No database

### What's Working:
- ✅ Frontend is running on port 5500
- ✅ Python is installed

---

## ✅ SOLUTION - Follow These Steps

### Step 1: Run Diagnostic (1 minute)

Double-click: **`diagnose.bat`**

This will show you exactly what's missing.

---

### Step 2: Install Missing Software (20-30 minutes)

#### Quick Install (Recommended):

1. **Open PowerShell as Administrator**
   - Press `Win + X`
   - Click "Windows PowerShell (Admin)" or "Terminal (Admin)"

2. **Copy and paste this ONE command:**

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')); choco install openjdk17 maven mongodb -y
```

3. **Wait for installation to complete** (~20 minutes)

4. **Close and reopen PowerShell**

5. **Verify installation:**
```bash
java -version
mvn --version
mongod --version
```

#### Manual Install (If above doesn't work):

See detailed instructions in: **`INSTALL_REQUIREMENTS.md`**

---

### Step 3: Start MongoDB (1 minute)

```bash
net start MongoDB
```

If that doesn't work:
```bash
mkdir C:\data\db
mongod --dbpath C:\data\db
```

---

### Step 4: Initialize Database (2 minutes)

```bash
cd "C:\Users\Aravinth\OneDrive\Desktop\Movie Ticket"
mongosh < init-mongodb.js
```

You should see:
```
✅ Database initialized successfully!
📊 Summary:
   Movies:   5
   Theaters: 2
   Shows:    XX
```

---

### Step 5: Start Backend (5 minutes first time)

Open a **NEW Command Prompt** and run:

```bash
cd "C:\Users\Aravinth\OneDrive\Desktop\Movie Ticket\backend"
mvn clean install
mvn spring-boot:run
```

**Wait for this message:**
```
Started MovieBookingApplication in X.XXX seconds
```

**DO NOT CLOSE THIS WINDOW** - Keep it running!

---

### Step 6: Test Backend API (30 seconds)

Open browser and go to:
```
http://localhost:8080/api/movies
```

You should see JSON data like:
```json
[
  {
    "id": "...",
    "title": "The Grand Adventure",
    "genre": ["Action", "Adventure"],
    ...
  }
]
```

---

### Step 7: Refresh Frontend (10 seconds)

1. Go to: `http://localhost:5500`
2. Press **`Ctrl + F5`** (hard refresh)
3. **Movies should now appear!** 🎉

---

## 📋 Quick Checklist

Before movies will show, you need:

- [ ] Java 17+ installed
- [ ] Maven 3.x installed
- [ ] MongoDB installed and running
- [ ] Database initialized with sample data
- [ ] Backend running on port 8080
- [ ] Backend API returns data: http://localhost:8080/api/movies
- [ ] Frontend refreshed with Ctrl + F5

---

## 🔍 Verification Commands

Run these to check each step:

```bash
# Check software installed
java -version
mvn --version
mongod --version

# Check MongoDB running
sc query MongoDB

# Check backend running
netstat -ano | findstr :8080

# Test backend API
curl http://localhost:8080/api/movies
```

---

## ⏱️ Time Estimate

| Step | Time |
|------|------|
| Install software | 20-30 min |
| Start MongoDB | 1 min |
| Initialize database | 2 min |
| Build backend (first time) | 5 min |
| Start backend | 1 min |
| Test and refresh | 1 min |
| **TOTAL** | **30-40 min** |

---

## 🐛 If Something Goes Wrong

### Maven installation fails:
- Try manual installation from: https://maven.apache.org/download.cgi
- See: `INSTALL_REQUIREMENTS.md`

### MongoDB won't start:
```bash
# Create data directory
mkdir C:\data\db

# Start manually
mongod --dbpath C:\data\db
```

### Backend won't start:
- Check if port 8080 is in use: `netstat -ano | findstr :8080`
- Check backend logs for errors
- Make sure MongoDB is running

### Still no movies:
- Check browser console (F12) for errors
- Make sure backend API works: http://localhost:8080/api/movies
- Re-run database initialization: `mongosh < init-mongodb.js`

---

## 🎯 Expected Result

After completing all steps, you should see:

1. **Home Page**: Movie cards with posters
2. **Click Movie**: Details page with show times
3. **Select Show**: Seat selection page
4. **Pick Seats**: Interactive seat map
5. **Complete Booking**: Confirmation ticket

---

## 📞 Need Help?

1. Run: `diagnose.bat` - Shows what's missing
2. Read: `INSTALL_REQUIREMENTS.md` - Installation guide
3. Read: `TROUBLESHOOTING.md` - Common issues
4. Check: Browser console (F12) - Frontend errors
5. Check: Backend terminal - Backend errors

---

## 🚀 Quick Start (After Software Installed)

Once Java, Maven, and MongoDB are installed:

```bash
# Terminal 1: Start MongoDB
net start MongoDB

# Terminal 2: Initialize Database
mongosh < init-mongodb.js

# Terminal 3: Start Backend
cd backend
mvn spring-boot:run

# Browser: Refresh Frontend
http://localhost:5500 (Ctrl + F5)
```

---

**Follow this action plan step by step, and your CineBook will be fully functional!** 🎬🍿

---

## 📝 Notes

- Frontend is already running - don't restart it
- Keep backend terminal open while using the app
- First backend build takes ~5 minutes
- Subsequent starts take ~30 seconds
- You only need to initialize database once

---

**Start with Step 1: Run `diagnose.bat` to see what you need to install!**
