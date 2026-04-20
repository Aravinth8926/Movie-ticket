# Quick Setup Guide

## Step-by-Step Setup

### 1. Install Prerequisites

#### Java 17
**Windows:**
- Download from [Oracle](https://www.oracle.com/java/technologies/downloads/#java17) or [Adoptium](https://adoptium.net/)
- Run installer and follow instructions
- Verify: `java -version`

**macOS:**
```bash
brew install openjdk@17
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

#### Maven
**Windows:**
- Download from [Maven website](https://maven.apache.org/download.cgi)
- Extract and add to PATH
- Verify: `mvn -version`

**macOS:**
```bash
brew install maven
```

**Linux:**
```bash
sudo apt install maven
```

#### MongoDB
**Windows:**
- Download from [MongoDB website](https://www.mongodb.com/try/download/community)
- Run installer
- Start MongoDB: `net start MongoDB`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

### 2. Initialize MongoDB Data

Open MongoDB shell:
```bash
mongosh
```

Copy and paste this script:

```javascript
use moviebooking

// Clear existing data (optional)
db.movies.deleteMany({})
db.theaters.deleteMany({})
db.shows.deleteMany({})
db.bookings.deleteMany({})

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
    description: "An epic journey through uncharted territories where a team of explorers discovers ancient secrets that could change the world forever.",
    cast: ["John Smith", "Emma Watson", "Michael Chen", "Sarah Johnson"],
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
    description: "A heartwarming tale of two strangers who meet in the city of love and discover that sometimes the best things in life are unexpected.",
    cast: ["Ryan Gosling", "Emma Stone", "Tom Hanks"],
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
    description: "Humanity's first mission to colonize Mars faces unexpected challenges when they discover they're not alone in the universe.",
    cast: ["Matt Damon", "Jessica Chastain", "Chiwetel Ejiofor"],
    director: "Denis Villeneuve",
    isActive: true
  },
  {
    title: "The Comedy Club",
    genre: ["Comedy", "Drama"],
    duration: 105,
    rating: "UA",
    language: "English",
    releaseDate: new Date("2024-01-20"),
    posterUrl: "https://via.placeholder.com/250x350/2D7A4F/FFFFFF?text=Comedy+Club",
    description: "A struggling comedian gets one last chance to make it big, but success comes with unexpected complications.",
    cast: ["Kevin Hart", "Tiffany Haddish", "Steve Carell"],
    director: "Judd Apatow",
    isActive: true
  },
  {
    title: "Mystery Manor",
    genre: ["Mystery", "Thriller", "Horror"],
    duration: 130,
    rating: "A",
    language: "English",
    releaseDate: new Date("2026-05-25"),
    posterUrl: "https://via.placeholder.com/250x350/1A0A0F/FFFFFF?text=Mystery+Manor",
    description: "A group of strangers are invited to a mysterious mansion where they must solve a deadly puzzle to survive the night.",
    cast: ["Benedict Cumberbatch", "Tilda Swinton", "Oscar Isaac"],
    director: "Rian Johnson",
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
    location: "Westside Mall, 2nd Floor",
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

// Get IDs for creating shows
var movies = db.movies.find().toArray()
var theaters = db.theaters.find().toArray()

// Create shows for next 7 days
var showDates = []
for (var i = 0; i < 7; i++) {
  var date = new Date()
  date.setDate(date.getDate() + i)
  showDates.push(date)
}

var shows = []
movies.slice(0, 3).forEach(function(movie) {
  theaters.forEach(function(theater) {
    showDates.forEach(function(date) {
      ["10:00", "14:00", "18:00", "21:00"].forEach(function(time) {
        shows.push({
          movieId: movie._id.toString(),
          theaterId: theater._id.toString(),
          showDate: date,
          showTime: time,
          availableSeats: theater.totalSeats,
          bookedSeats: [],
          lockedSeats: [],
          status: "ACTIVE"
        })
      })
    })
  })
})

db.shows.insertMany(shows)

print("✅ Sample data inserted successfully!")
print("📊 Movies:", db.movies.countDocuments())
print("🎭 Theaters:", db.theaters.countDocuments())
print("🎬 Shows:", db.shows.countDocuments())
```

### 3. Start Backend

Open a terminal in the project root:

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Wait for the message: `Started MovieBookingApplication`

### 4. Start Frontend

Open another terminal:

**Using Python:**
```bash
cd frontend
python -m http.server 5500
```

**Using Node.js:**
```bash
cd frontend
npx http-server -p 5500
```

**Using VS Code:**
- Install "Live Server" extension
- Right-click `index.html` → "Open with Live Server"

### 5. Access the Application

Open your browser and go to:
```
http://localhost:5500
```

## Testing the Application

### Test Flow:
1. **Home Page** - Browse movies
2. **Movie Details** - Click on a movie → View details and shows
3. **Seat Selection** - Select a show → Choose seats
4. **Confirmation** - Complete booking → View ticket
5. **History** - View "My Bookings" → See all bookings

### Test Scenarios:

#### Scenario 1: Normal Booking
1. Select a movie
2. Choose a show time
3. Select 2-3 seats
4. Complete booking
5. Verify confirmation page

#### Scenario 2: Seat Locking
1. Select seats
2. Wait for timer to count down
3. Verify seats remain locked
4. Complete booking before timer expires

#### Scenario 3: Cancel Booking
1. Go to "My Bookings"
2. Find an upcoming booking
3. Click "Cancel Booking"
4. Verify status changes to CANCELLED

#### Scenario 4: Price Calculation
1. Select seats on a weekend (Friday/Saturday/Sunday)
2. Verify 20% weekend surcharge is applied
3. Select a morning show (before 12 PM)
4. Verify 30% first show surcharge is applied

## Troubleshooting

### Port Already in Use

**Backend (8080):**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9
```

**Frontend (5500):**
```bash
# Windows
netstat -ano | findstr :5500
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5500 | xargs kill -9
```

### MongoDB Connection Error

1. Check if MongoDB is running:
```bash
# Windows
sc query MongoDB

# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongod
```

2. Start MongoDB if not running:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### CORS Error

If you see CORS errors in browser console:
1. Check backend is running on port 8080
2. Verify frontend URL in `CorsConfig.java`
3. Restart backend after changes

### Transactions Not Supported

If you see "Transactions are not supported" error:
1. MongoDB needs to run as a replica set for transactions
2. For development, you can disable transactions in code
3. Or set up MongoDB replica set:

```bash
# Start MongoDB with replica set
mongod --replSet rs0

# In mongosh
rs.initiate()
```

## Next Steps

1. **Add More Data**: Insert more movies, theaters, and shows
2. **Customize Design**: Modify colors in `styles.css`
3. **Add Features**: Implement user authentication, payment gateway
4. **Deploy**: Deploy to cloud platforms (AWS, Azure, Heroku)

## Support

For issues or questions:
1. Check the main README.md
2. Review MongoDB logs
3. Check browser console for frontend errors
4. Review Spring Boot logs for backend errors

---

**Happy Coding! 🎬**
