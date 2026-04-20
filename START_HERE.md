# 🚀 START HERE - Quick Setup for CineBook

## ⚠️ Current Issue
You're seeing a loading spinner because:
1. **Backend is NOT running** (needs to run on port 8080)
2. **MongoDB might not be installed or running**
3. **Database has no data**

---

## ✅ 3-Step Solution

### Step 1: Install MongoDB (If Not Installed)

**Check if MongoDB is installed:**
```bash
mongod --version
```

**If you see an error, install MongoDB:**

1. Download from: https://www.mongodb.com/try/download/community
2. Choose: Windows → MSI → Download
3. Install with default settings
4. ✅ Check "Install MongoDB as a Service"

**Start MongoDB:**
```bash
net start MongoDB
```

---

### Step 2: Initialize Database with Sample Data

**Option A: Using the script file (Easiest)**

1. Open Command Prompt or PowerShell
2. Navigate to project folder:
   ```bash
   cd "C:\Users\Aravinth\OneDrive\Desktop\Movie Ticket"
   ```
3. Run:
   ```bash
   mongosh < init-mongodb.js
   ```

**Option B: Manual (Copy-Paste)**

1. Open MongoDB Shell:
   ```bash
   mongosh
   ```

2. Copy and paste this ENTIRE script:

```javascript
use moviebooking

db.movies.deleteMany({})
db.theaters.deleteMany({})
db.shows.deleteMany({})

db.movies.insertMany([
  {
    title: "The Grand Adventure",
    genre: ["Action", "Adventure"],
    duration: 145,
    rating: "UA",
    language: "English",
    releaseDate: new Date("2024-01-15"),
    posterUrl: "https://via.placeholder.com/250x350/8B1A2F/FFFFFF?text=The+Grand+Adventure",
    description: "An epic journey through uncharted territories.",
    cast: ["John Smith", "Emma Watson"],
    director: "Christopher Nolan",
    isActive: true
  },
  {
    title: "Love in Paris",
    genre: ["Romance", "Drama"],
    duration: 120,
    rating: "U",
    language: "English",
    releaseDate: new Date("2024-02-01"),
    posterUrl: "https://via.placeholder.com/250x350/D4AF37/FFFFFF?text=Love+in+Paris",
    description: "A heartwarming tale of two strangers.",
    cast: ["Ryan Gosling", "Emma Stone"],
    director: "Greta Gerwig",
    isActive: true
  },
  {
    title: "Space Odyssey",
    genre: ["Sci-Fi"],
    duration: 160,
    rating: "UA",
    language: "English",
    releaseDate: new Date("2024-03-10"),
    posterUrl: "https://via.placeholder.com/250x350/9B59B6/FFFFFF?text=Space+Odyssey",
    description: "Mars colonization mission.",
    cast: ["Matt Damon"],
    director: "Denis Villeneuve",
    isActive: true
  }
])

db.theaters.insertMany([
  {
    name: "Cineplex Grand",
    location: "Downtown",
    totalSeats: 150,
    seatLayout: {
      rows: 10,
      seatsPerRow: 15,
      categories: [
        { name: "PLATINUM", rows: ["A", "B"], price: 400 },
        { name: "GOLD", rows: ["C", "D", "E"], price: 250 },
        { name: "SILVER", rows: ["F", "G", "H", "I", "J"], price: 150 }
      ]
    }
  }
])

var movies = db.movies.find().toArray()
var theaters = db.theaters.find().toArray()
var shows = []
var today = new Date()

for (var i = 0; i < 7; i++) {
  var showDate = new Date(today)
  showDate.setDate(today.getDate() + i)
  
  movies.forEach(function(movie) {
    theaters.forEach(function(theater) {
      ["10:00", "14:00", "18:00"].forEach(function(time) {
        shows.push({
          movieId: movie._id.toString(),
          theaterId: theater._id.toString(),
          showDate: showDate,
          showTime: time,
          availableSeats: theater.totalSeats,
          bookedSeats: [],
          lockedSeats: [],
          status: "ACTIVE",
          version: NumberLong(0)
        })
      })
    })
  })
}

db.shows.insertMany(shows)

print("✅ Done! Movies:", db.movies.countDocuments(), "Shows:", db.shows.countDocuments())
```

3. Press Enter and wait for "✅ Done!"

---

### Step 3: Start Backend

1. **Open a NEW Command Prompt/PowerShell**

2. **Navigate to backend folder:**
   ```bash
   cd "C:\Users\Aravinth\OneDrive\Desktop\Movie Ticket\backend"
   ```

3. **Start the backend:**
   ```bash
   mvn spring-boot:run
   ```

4. **Wait for this message:**
   ```
   Started MovieBookingApplication in X.XXX seconds
   ```

5. **Test it works:**
   - Open browser: http://localhost:8080/api/movies
   - You should see JSON data with movies

---

## 🎉 Now Refresh Your Browser!

1. Go back to: http://localhost:5500
2. Press `Ctrl + F5` (hard refresh)
3. **You should now see movies!** 🎬

---

## 🔍 Quick Status Check

**Run this to check everything:**
```bash
check-status.bat
```

This will tell you:
- ✓ MongoDB status
- ✓ Backend status
- ✓ Frontend status
- ✓ API connectivity

---

## 📋 Complete Checklist

- [ ] MongoDB installed and running
- [ ] Database initialized with sample data
- [ ] Backend running on port 8080
- [ ] Backend API works: http://localhost:8080/api/movies
- [ ] Frontend running on port 5500
- [ ] Movies showing on: http://localhost:5500

---

## 🐛 Still Not Working?

### Check Backend Logs
Look at the terminal where you ran `mvn spring-boot:run`:
- **Red errors?** → MongoDB connection issue
- **"Port already in use"?** → Kill process on port 8080
- **"Connection refused"?** → MongoDB not running

### Check Browser Console
Press `F12` in browser → Console tab:
- **"Failed to fetch"?** → Backend not running
- **"CORS error"?** → Backend needs restart
- **"404"?** → Wrong URL

### Common Fixes

**MongoDB not starting:**
```bash
# Check if installed
mongod --version

# Start service
net start MongoDB

# Or start manually
mongod --dbpath C:\data\db
```

**Backend won't start:**
```bash
# Kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Try again
mvn spring-boot:run
```

**No movies showing:**
```bash
# Re-run database initialization
mongosh < init-mongodb.js
```

---

## 🎯 Test the Complete Flow

Once everything is running:

1. **Home Page** → See movie cards
2. **Click a movie** → See details and show times
3. **Select a show** → Go to seat selection
4. **Pick seats** → Select 2-3 seats
5. **Complete booking** → See confirmation ticket

---

## 📞 Need More Help?

1. **Detailed troubleshooting**: See `TROUBLESHOOTING.md`
2. **System check**: Run `check-status.bat`
3. **Full documentation**: See `README.md`

---

## 🚀 Quick Commands Reference

```bash
# Check MongoDB
mongod --version
net start MongoDB

# Initialize Database
mongosh < init-mongodb.js

# Start Backend
cd backend
mvn spring-boot:run

# Frontend is already running on port 5500

# Test Backend API
curl http://localhost:8080/api/movies
# Or open in browser: http://localhost:8080/api/movies

# Check Status
check-status.bat
```

---

**Follow these steps and your CineBook will be up and running!** 🎬🍿
