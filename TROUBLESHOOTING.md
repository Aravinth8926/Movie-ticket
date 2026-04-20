# 🔧 Troubleshooting Guide - CineBook

## Current Issue: No Movies Showing (Loading Spinner)

### Root Cause
The frontend is loading but can't fetch data because:
1. ❌ Backend is not running
2. ❌ MongoDB is not running or not installed

---

## ✅ Solution: Step-by-Step Fix

### Step 1: Install and Start MongoDB

#### Option A: Install MongoDB Community Edition (Recommended)

1. **Download MongoDB**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows
   - Version: Latest (7.0 or higher)
   - Package: MSI
   - Click "Download"

2. **Install MongoDB**:
   - Run the downloaded MSI file
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Run service as Network Service user"
   - Click "Install"

3. **Verify Installation**:
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**:
   ```bash
   net start MongoDB
   ```

#### Option B: Use MongoDB Atlas (Cloud - Easier)

If you don't want to install MongoDB locally:

1. **Create Free Account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster**:
   - Choose "Free Shared" tier
   - Select a region close to you
   - Click "Create Cluster"

3. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/moviebooking`

4. **Update Backend Configuration**:
   - Open: `backend/src/main/resources/application.properties`
   - Replace:
     ```properties
     spring.data.mongodb.uri=mongodb://localhost:27017/moviebooking
     ```
   - With your Atlas connection string:
     ```properties
     spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/moviebooking
     ```

---

### Step 2: Initialize MongoDB with Sample Data

#### If using Local MongoDB:

1. **Open Command Prompt or PowerShell**

2. **Start MongoDB Shell**:
   ```bash
   mongosh
   ```

3. **Copy and paste this entire script**:

```javascript
use moviebooking

// Clear existing data
db.movies.deleteMany({})
db.theaters.deleteMany({})
db.shows.deleteMany({})

// Insert Movies
db.movies.insertMany([
  {
    title: "The Grand Adventure",
    genre: ["Action", "Adventure", "Thriller"],
    duration: 145,
    rating: "UA",
    language: "English",
    releaseDate: new Date("2024-01-15"),
    posterUrl: "https://via.placeholder.com/250x350/8B1A2F/FFFFFF?text=The+Grand+Adventure",
    description: "An epic journey through uncharted territories where a team of explorers discovers ancient secrets.",
    cast: ["John Smith", "Emma Watson", "Michael Chen"],
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
    description: "A heartwarming tale of two strangers who meet in the city of love.",
    cast: ["Ryan Gosling", "Emma Stone"],
    director: "Greta Gerwig",
    isActive: true
  },
  {
    title: "Space Odyssey 2024",
    genre: ["Sci-Fi", "Adventure"],
    duration: 160,
    rating: "UA",
    language: "English",
    releaseDate: new Date("2024-03-10"),
    posterUrl: "https://via.placeholder.com/250x350/9B59B6/FFFFFF?text=Space+Odyssey",
    description: "Humanity's first mission to colonize Mars faces unexpected challenges.",
    cast: ["Matt Damon", "Jessica Chastain"],
    director: "Denis Villeneuve",
    isActive: true
  }
])

// Insert Theaters
db.theaters.insertMany([
  {
    name: "Cineplex Grand",
    location: "Downtown, Main Street",
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
  },
  {
    name: "MovieMax Theater",
    location: "Westside Mall",
    totalSeats: 120,
    seatLayout: {
      rows: 8,
      seatsPerRow: 15,
      categories: [
        { name: "PLATINUM", rows: ["A", "B"], price: 400 },
        { name: "GOLD", rows: ["C", "D"], price: 250 },
        { name: "SILVER", rows: ["E", "F", "G", "H"], price: 150 }
      ]
    }
  }
])

// Get IDs
var movies = db.movies.find().toArray()
var theaters = db.theaters.find().toArray()

// Create shows for next 7 days
var shows = []
var today = new Date()

for (var i = 0; i < 7; i++) {
  var showDate = new Date(today)
  showDate.setDate(today.getDate() + i)
  
  movies.forEach(function(movie) {
    theaters.forEach(function(theater) {
      ["10:00", "14:00", "18:00", "21:00"].forEach(function(time) {
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

print("✅ Data inserted successfully!")
print("Movies:", db.movies.countDocuments())
print("Theaters:", db.theaters.countDocuments())
print("Shows:", db.shows.countDocuments())
```

4. **Verify Data**:
   ```javascript
   db.movies.find().pretty()
   ```

#### If using MongoDB Atlas:

1. **Go to your cluster in Atlas**
2. **Click "Collections"**
3. **Click "Insert Document"**
4. **Manually add the data or use MongoDB Compass to import**

---

### Step 3: Start the Backend

1. **Open a NEW terminal/command prompt**

2. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

3. **Start the Spring Boot application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Wait for this message**:
   ```
   Started MovieBookingApplication in X.XXX seconds
   ```

5. **Test the backend**:
   - Open browser: http://localhost:8080/api/movies
   - You should see JSON data with movies

---

### Step 4: Refresh Frontend

1. **Go back to your browser**
2. **Refresh the page**: http://localhost:5500
3. **You should now see movies!**

---

## 🔍 Quick Diagnostics

### Check if MongoDB is running:
```bash
# Windows
sc query MongoDB

# Or check process
tasklist | findstr mongod
```

### Check if Backend is running:
```bash
# Test API
curl http://localhost:8080/api/movies

# Or open in browser
http://localhost:8080/api/movies
```

### Check if Frontend is running:
```bash
# Should show Python server
netstat -ano | findstr :5500
```

---

## 🐛 Common Errors and Solutions

### Error: "Unable to connect to MongoDB"
**Solution**: 
- Make sure MongoDB is running: `net start MongoDB`
- Check connection string in `application.properties`

### Error: "Port 8080 already in use"
**Solution**:
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Error: "Failed to fetch" in browser console
**Solution**:
- Backend is not running
- Start backend with: `mvn spring-boot:run`

### Error: Movies showing but can't select seats
**Solution**:
- Shows are not created in database
- Re-run the MongoDB initialization script

---

## 📋 Complete Startup Checklist

- [ ] MongoDB is installed and running
- [ ] Database has sample data (movies, theaters, shows)
- [ ] Backend is running on port 8080
- [ ] Backend API returns data: http://localhost:8080/api/movies
- [ ] Frontend is running on port 5500
- [ ] Browser shows movies on: http://localhost:5500

---

## 🆘 Still Having Issues?

### Check Browser Console:
1. Press `F12` in browser
2. Go to "Console" tab
3. Look for red error messages
4. Common errors:
   - `Failed to fetch` → Backend not running
   - `CORS error` → Backend CORS config issue
   - `404 Not Found` → Wrong API endpoint

### Check Backend Logs:
- Look at the terminal where you ran `mvn spring-boot:run`
- Look for error messages in red
- Common errors:
   - `Connection refused` → MongoDB not running
   - `Port already in use` → Kill the process using port 8080

---

## 🎯 Quick Test After Setup

1. **Test Backend API**:
   ```bash
   curl http://localhost:8080/api/movies
   ```
   Should return JSON with movies

2. **Test Frontend**:
   - Open: http://localhost:5500
   - Should see movie cards

3. **Test Full Flow**:
   - Click on a movie
   - Select a show time
   - Select seats
   - Complete booking

---

## 💡 Alternative: Use Docker (Advanced)

If you're comfortable with Docker, you can run MongoDB in a container:

```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# MongoDB is now running on localhost:27017
```

---

**Need more help? Check the error messages and refer to the specific solution above!** 🚀
