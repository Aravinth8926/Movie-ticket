// MongoDB Initialization Script for CineBook
// Run this with: mongosh < init-mongodb.js

use moviebooking

print("🎬 Initializing CineBook Database...\n")

// Clear existing data
print("Clearing existing data...")
db.movies.deleteMany({})
db.theaters.deleteMany({})
db.shows.deleteMany({})
db.bookings.deleteMany({})
db.users.deleteMany({})

// Insert Movies
print("Inserting movies...")
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
print("Inserting theaters...")
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
print("Creating shows...")
var movies = db.movies.find().toArray()
var theaters = db.theaters.find().toArray()

// Create shows for next 7 days
var shows = []
var today = new Date()

for (var i = 0; i < 7; i++) {
  var showDate = new Date(today)
  showDate.setDate(today.getDate() + i)
  showDate.setHours(0, 0, 0, 0) // Reset time to midnight
  
  // Only create shows for first 3 movies to keep it manageable
  movies.slice(0, 3).forEach(function(movie) {
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

// Summary
print("\n✅ Database initialized successfully!\n")
print("📊 Summary:")
print("   Movies:   " + db.movies.countDocuments())
print("   Theaters: " + db.theaters.countDocuments())
print("   Shows:    " + db.shows.countDocuments())
print("\n🎬 You can now start the backend and frontend!")
print("   Backend:  cd backend && mvn spring-boot:run")
print("   Frontend: cd frontend && python -m http.server 5500")
print("\n")
