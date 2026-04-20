# 🎬 CineBook - Complete Project Overview

## Project Summary

CineBook is a full-stack movie ticket booking system featuring a warm, human-crafted UI design with MongoDB transactions to prevent double-booking race conditions.

## 🎯 Key Features Implemented

### Frontend Features
✅ **Home Page (index.html)**
- Hero section with typewriter animation
- Search functionality for movies
- Now Showing section with movie cards
- Coming Soon section
- Hand-drawn style elements and warm color palette

✅ **Movie Details Page (movie-details.html)**
- Full-width banner with movie poster
- Cast and crew information
- Date selector for show timings
- Theater-wise show listings
- Color-coded availability (Green/Orange/Red)

✅ **Seat Selection Page (seat-selection.html)**
- Cinema screen with glow effect
- Interactive seat map with categories (PLATINUM/GOLD/SILVER)
- Real-time seat locking mechanism
- 10-minute countdown timer
- Live price calculation with breakdown
- Booking summary sidebar

✅ **Confirmation Page (confirmation.html)**
- Ticket design with perforated edges
- QR code display
- Booking ID generation
- Confetti animation on load
- Download and share options

✅ **Booking History Page (history.html)**
- Timeline view of all bookings
- Filter tabs (All/Upcoming/Past/Cancelled)
- Search by booking ID
- Cancel booking functionality
- Status indicators

### Backend Features

✅ **MongoDB Collections**
- `movies` - Movie information
- `theaters` - Theater and seat layout
- `shows` - Show timings with availability
- `bookings` - Booking records with price breakdown
- `users` - User information

✅ **RESTful APIs**
- Movies CRUD operations
- Shows management
- Seat availability checking
- Seat locking/unlocking
- Booking creation and cancellation
- User booking history

✅ **Advanced Features**
- **MongoDB Transactions** - Atomic seat booking operations
- **Optimistic Locking** - Version field to prevent conflicts
- **Seat Lock Mechanism** - 10-minute TTL with automatic expiration
- **Scheduled Tasks** - Automatic cleanup of expired locks
- **Price Calculation** - Dynamic pricing with surcharges
- **Global Exception Handling** - User-friendly error messages

## 🏗️ Architecture

### Backend Architecture
```
Controller Layer (REST APIs)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (MongoDB Access)
    ↓
MongoDB Database
```

### Frontend Architecture
```
HTML Pages
    ↓
JavaScript Modules (home.js, movie-details.js, etc.)
    ↓
API Service Layer (api.js)
    ↓
Backend REST APIs
```

## 💾 Database Schema

### Movies Collection
```javascript
{
  _id: ObjectId,
  title: String,
  genre: [String],
  duration: Number,
  rating: String,
  language: String,
  releaseDate: Date,
  posterUrl: String,
  description: String,
  cast: [String],
  director: String,
  isActive: Boolean
}
```

### Shows Collection
```javascript
{
  _id: ObjectId,
  movieId: String,
  theaterId: String,
  showDate: Date,
  showTime: String,
  availableSeats: Number,
  bookedSeats: [String],
  lockedSeats: [{
    seatNumber: String,
    sessionId: String,
    lockedAt: Date,
    expiresAt: Date
  }],
  status: String,
  version: Long  // For optimistic locking
}
```

### Bookings Collection
```javascript
{
  _id: ObjectId,
  bookingId: String,  // BK-2024-XXXXX
  userId: String,
  showId: String,
  movieName: String,
  theaterName: String,
  showDate: Date,
  showTime: String,
  selectedSeats: [String],
  seatCategory: String,
  pricePerSeat: Number,
  totalAmount: Number,
  bookingStatus: String,
  bookingDate: Date,
  paymentId: String,
  paymentStatus: String,
  priceBreakdown: {
    basePrice: Number,
    weekendSurcharge: Number,
    firstShowSurcharge: Number,
    subtotal: Number,
    gst: Number,
    total: Number
  }
}
```

## 🔐 Seat Booking Transaction Flow

```
1. User selects seats
   ↓
2. Frontend calls /api/bookings/seats/lock
   ↓
3. Backend starts MongoDB transaction
   ↓
4. Check if seats are available
   ↓
5. Lock seats with session ID and expiry time
   ↓
6. Use optimistic locking (version field)
   ↓
7. Commit transaction
   ↓
8. Return success with expiry time
   ↓
9. Frontend starts 10-minute countdown
   ↓
10. User completes booking
    ↓
11. Backend converts locks to bookings
    ↓
12. Update show availability
    ↓
13. Return booking confirmation
```

## 💰 Price Calculation Logic

```javascript
Base Price = Seat Category Price × Number of Seats

Weekend Surcharge = Base Price × 20% (if Fri/Sat/Sun)

First Show Surcharge = Base Price × 30% (if before 12 PM)

Subtotal = Base Price + Weekend Surcharge + First Show Surcharge

GST = Subtotal × 18%

Total = Subtotal + GST
```

**Example:**
- 2 GOLD seats (₹250 each) = ₹500
- Weekend (Saturday) = ₹500 × 20% = ₹100
- Subtotal = ₹600
- GST = ₹600 × 18% = ₹108
- **Total = ₹708**

## 🎨 Design System

### Color Palette
```css
--primary: #8B1A2F        /* Deep Burgundy */
--primary-light: #C23152  /* Light Burgundy */
--gold: #D4AF37           /* Gold */
--gold-light: #F0D060     /* Light Gold */
--cream: #FFF8F0          /* Cream */
--dark: #1A0A0F           /* Dark Brown */
--dark-card: #2D1520      /* Dark Card */
--success: #2D7A4F        /* Green */
--warning: #E67E22        /* Orange */
```

### Typography
- **Headings**: Playfair Display (Serif)
- **Body**: Inter (Sans-serif)
- **Handwritten**: Caveat (Cursive)

### Special Effects
1. **Film Grain Overlay** - Subtle texture on all pages
2. **Typewriter Animation** - Hero text animation
3. **Hand-drawn Underlines** - SVG wavy lines
4. **Sticky Notes** - Error messages
5. **Perforated Edges** - Ticket design
6. **Cinema Screen Glow** - CSS box-shadow
7. **Seat Hover Animation** - Cubic bezier transitions
8. **Card Rotations** - Random -1deg to 1deg
9. **Toast Notifications** - Slide-in animations
10. **Confetti** - Booking confirmation

## 📊 API Endpoints Reference

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | Get all active movies |
| GET | `/api/movies/{id}` | Get movie by ID |
| GET | `/api/movies/search?title={title}` | Search movies |
| POST | `/api/movies` | Add new movie |
| PUT | `/api/movies/{id}` | Update movie |
| DELETE | `/api/movies/{id}` | Deactivate movie |

### Shows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shows` | Get all shows |
| GET | `/api/shows/{id}` | Get show by ID |
| GET | `/api/shows/movie/{movieId}` | Get shows by movie |
| GET | `/api/shows/{id}/seats` | Get seat availability |
| POST | `/api/shows` | Create new show |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings?sessionId={id}` | Create booking |
| GET | `/api/bookings/{bookingId}` | Get booking details |
| GET | `/api/bookings/user/{userId}` | Get user bookings |
| PUT | `/api/bookings/{bookingId}/cancel` | Cancel booking |
| POST | `/api/bookings/seats/lock` | Lock seats |
| POST | `/api/bookings/seats/unlock` | Unlock seats |

## 🔧 Configuration

### Backend (application.properties)
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/moviebooking
spring.data.mongodb.database=moviebooking
server.port=8080
seat.lock.duration.minutes=10
booking.id.prefix=BK
```

### Frontend (config.js)
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
const SESSION_KEY = 'cinebook_session';
const USER_KEY = 'cinebook_user';
```

## 🚀 Deployment Considerations

### Backend Deployment
1. **MongoDB Atlas** - Cloud MongoDB database
2. **Heroku/AWS/Azure** - Spring Boot deployment
3. **Environment Variables** - Configure connection strings
4. **Replica Set** - Required for transactions

### Frontend Deployment
1. **Netlify/Vercel** - Static site hosting
2. **AWS S3 + CloudFront** - CDN distribution
3. **Update API_BASE_URL** - Point to production backend

## 🧪 Testing Checklist

### Functional Testing
- [ ] Browse movies on home page
- [ ] Search movies by title/genre
- [ ] View movie details
- [ ] Select show date and time
- [ ] Select seats (single and multiple)
- [ ] Verify seat locking
- [ ] Complete booking
- [ ] View booking confirmation
- [ ] Check booking history
- [ ] Cancel booking
- [ ] Verify price calculation

### Edge Cases
- [ ] Double booking prevention
- [ ] Seat lock expiration
- [ ] Concurrent seat selection
- [ ] Invalid booking ID
- [ ] Cancel past show
- [ ] Housefull show
- [ ] Weekend pricing
- [ ] First show pricing

### Performance Testing
- [ ] Load 100+ movies
- [ ] Multiple concurrent bookings
- [ ] Seat map rendering speed
- [ ] API response times

## 📈 Future Enhancements

### Phase 2 Features
1. **User Authentication** - Login/Register with JWT
2. **Payment Gateway** - Razorpay/Stripe integration
3. **Email Notifications** - Booking confirmations
4. **SMS Alerts** - Show reminders
5. **Movie Reviews** - User ratings and reviews
6. **Seat Recommendations** - AI-based suggestions
7. **Food & Beverage** - Add-on ordering
8. **Loyalty Program** - Points and rewards
9. **Admin Dashboard** - Manage movies, shows, theaters
10. **Analytics** - Booking trends and reports

### Technical Improvements
1. **Redis Caching** - Improve performance
2. **WebSocket** - Real-time seat updates
3. **Microservices** - Split into services
4. **Docker** - Containerization
5. **CI/CD Pipeline** - Automated deployment
6. **Unit Tests** - JUnit and Jest
7. **Load Balancing** - Handle high traffic
8. **CDN** - Static asset delivery

## 📚 Learning Resources

### Technologies Used
- **Spring Boot**: https://spring.io/projects/spring-boot
- **MongoDB**: https://docs.mongodb.com/
- **Lucide Icons**: https://lucide.dev/
- **Canvas Confetti**: https://github.com/catdad/canvas-confetti

### Concepts Implemented
- RESTful API Design
- MongoDB Transactions
- Optimistic Locking
- Scheduled Tasks
- CORS Configuration
- Exception Handling
- Responsive Design
- CSS Animations

## 🤝 Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ for movie lovers everywhere!** 🎬🍿
