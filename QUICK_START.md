# 🚀 Quick Start Guide - CineBook

## ⚡ 3-Step Setup (Windows)

### Step 1: Start MongoDB
```bash
net start MongoDB
```

### Step 2: Initialize Data
```bash
mongosh
```
Then paste the initialization script from `SETUP.md` (Section 2)

### Step 3: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 5500
```

**Or use the batch files:**
- Double-click `start-backend.bat`
- Double-click `start-frontend.bat`

## 🌐 Access Points

- **Frontend**: http://localhost:5500
- **Backend API**: http://localhost:8080/api
- **MongoDB**: mongodb://localhost:27017/moviebooking

## 📋 Quick Test Flow

1. **Home** → Browse movies
2. **Click Movie** → View details
3. **Select Show** → Choose time
4. **Pick Seats** → Select 2-3 seats
5. **Book** → Complete booking
6. **Confirm** → View ticket
7. **History** → See all bookings

## 🎯 Key URLs

| Page | URL |
|------|-----|
| Home | http://localhost:5500/index.html |
| Movie Details | http://localhost:5500/movie-details.html?id={movieId} |
| Seat Selection | http://localhost:5500/seat-selection.html?showId={showId} |
| Confirmation | http://localhost:5500/confirmation.html?bookingId={bookingId} |
| History | http://localhost:5500/history.html |

## 🔧 Common Commands

### Check if MongoDB is running
```bash
sc query MongoDB
```

### Stop Backend (Ctrl+C in terminal)

### Stop Frontend (Ctrl+C in terminal)

### Clear MongoDB Data
```javascript
use moviebooking
db.movies.deleteMany({})
db.theaters.deleteMany({})
db.shows.deleteMany({})
db.bookings.deleteMany({})
```

## 🐛 Quick Fixes

### Port 8080 in use
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Port 5500 in use
```bash
netstat -ano | findstr :5500
taskkill /PID <PID> /F
```

### MongoDB not starting
```bash
net start MongoDB
```

### CORS Error
- Ensure backend is running on port 8080
- Check browser console for exact error
- Restart backend

## 📊 Sample Data Included

- **5 Movies** (Action, Romance, Sci-Fi, Comedy, Mystery)
- **2 Theaters** (Cineplex Grand, MovieMax Theater)
- **Multiple Shows** (Next 7 days, 4 time slots per day)

## 💡 Tips

1. **First Time Setup**: Initial Maven build takes 2-3 minutes
2. **Seat Locking**: You have 10 minutes to complete booking
3. **Weekend Shows**: Automatically get 20% surcharge
4. **Morning Shows**: Shows before 12 PM get 30% surcharge
5. **Cancellation**: Can only cancel future shows

## 📞 Need Help?

1. Check `README.md` for detailed documentation
2. See `SETUP.md` for step-by-step setup
3. Review `PROJECT_OVERVIEW.md` for architecture details
4. Check browser console for frontend errors
5. Check terminal for backend errors

## 🎬 Enjoy CineBook!

**Happy Movie Booking!** 🍿
