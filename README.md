# 🎬 CineBook - Movie Ticket Booking System

A full-featured movie ticket booking system with a modern dark cinema theme, built with vanilla JavaScript and Python mock backend.

![CineBook](https://img.shields.io/badge/CineBook-Movie%20Booking-F84464?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-2ECC71?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-3498DB?style=for-the-badge)

## ✨ Features

### 🎫 Core Booking Features
- **Browse Movies** - View 11+ movies with real TMDB posters
- **Movie Details** - Comprehensive movie information with cast, director, ratings
- **Show Selection** - Multiple show times across different theaters
- **Seat Selection** - BookMyShow-style seat selection with SVG cinema seats
- **Real-time Seat Locking** - Seats locked for 10 minutes during selection
- **Price Calculation** - Dynamic pricing with weekend and first-show surcharges
- **Booking Confirmation** - QR code generation and booking details
- **Booking History** - View all past and upcoming bookings

### 🔐 Authentication System (NEW)
- **User Registration** - Create account with email and password
- **Login System** - Secure JWT-based authentication
- **Password Strength Meter** - Real-time password validation
- **Protected Routes** - Auth guards for booking pages
- **User Profile** - Avatar with colorful initials
- **Session Management** - Auto token refresh

### 🎨 Design Features
- **Dark Cinema Theme** - Professional #1A1A2E background with #F84464 accents
- **Glassmorphism Effects** - Modern frosted glass UI elements
- **Responsive Design** - Works perfectly on mobile and desktop
- **Smooth Animations** - Film strip scrolling, floating elements, seat selection
- **BookMyShow-Style Seats** - SVG cinema chair shapes with hover effects
- **Category-Based Pricing** - Platinum, Gold, Silver seat categories

### 🎯 Advanced Features
- **Location Selector** - Choose from 7 major cities
- **Movie Ratings** - User ratings out of 10 for all movies
- **Search Functionality** - Find movies quickly
- **Date Selection** - Book shows up to 7 days in advance
- **Countdown Timer** - 10-minute booking timer with urgent state
- **Toast Notifications** - Beautiful mini ticket stub notifications

## 🚀 Quick Start

### Prerequisites
- Python 3.7+ (for backend)
- Modern web browser
- Live Server (VS Code extension) or any HTTP server

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/cinebook.git
cd cinebook
```

2. **Start the backend server**
```bash
python mock-backend.py
```
The server will start on `http://localhost:8080`

3. **Start the frontend**
   - Using VS Code Live Server: Right-click `frontend/index.html` → Open with Live Server
   - Or use Python: `cd frontend && python -m http.server 5500`

4. **Open in browser**
```
http://localhost:5500
```

## 📁 Project Structure

```
cinebook/
├── frontend/
│   ├── css/
│   │   ├── styles.css              # Main styles
│   │   ├── seat-selection-new.css  # BookMyShow-style seat selection
│   │   └── auth.css                # Authentication pages styles
│   ├── js/
│   │   ├── home.js                 # Landing page logic
│   │   ├── movie-details.js        # Movie details page
│   │   ├── seat-selection-new.js   # New seat selection logic
│   │   ├── checkout.js             # Checkout page
│   │   ├── confirmation.js         # Booking confirmation
│   │   ├── history.js              # Booking history
│   │   ├── auth.js                 # Authentication service
│   │   ├── login.js                # Login page logic
│   │   ├── register.js             # Registration logic
│   │   ├── api.js                  # API service layer
│   │   └── config.js               # Configuration
│   ├── index.html                  # Landing page
│   ├── movie-details.html          # Movie details
│   ├── seat-selection-new.html     # Seat selection (BookMyShow style)
│   ├── checkout.html               # Checkout page
│   ├── confirmation.html           # Booking confirmation
│   ├── history.html                # Booking history
│   ├── login.html                  # Login page
│   └── register.html               # Registration page
├── backend/
│   └── src/main/java/...          # Java Spring Boot backend (optional)
├── mock-backend.py                 # Python mock server
├── README.md                       # This file
└── AUTHENTICATION_FEATURES_SUMMARY.md  # Auth implementation guide

```

## 🎨 Design System

### Colors
- **Background**: `#1A1A2E` (Dark Cinema)
- **Secondary**: `#0F0F1E` (Darker)
- **Accent**: `#F84464` (Red)
- **Success**: `#2ECC71` (Green)
- **Warning**: `#F39C12` (Orange)
- **Info**: `#3498DB` (Blue)

### Typography
- **Main Font**: Inter
- **Display Font**: Playfair Display

### Seat Categories
- **Platinum**: Purple `#9333EA` - ₹400
- **Gold**: Yellow `#F59E0B` - ₹250
- **Silver**: Blue `#3B82F6` - ₹150

## 🔧 API Endpoints

### Movies
```
GET  /api/movies              # Get all movies
GET  /api/movies/{id}         # Get movie by ID
```

### Shows
```
GET  /api/shows                    # Get all shows
GET  /api/shows/{id}               # Get show by ID
GET  /api/shows/movie/{movieId}    # Get shows for a movie
GET  /api/shows/{id}/seats         # Get seat availability
```

### Bookings
```
POST /api/bookings                      # Create booking
GET  /api/bookings/{id}                 # Get booking by ID
GET  /api/bookings/user/{userId}        # Get user bookings
PUT  /api/bookings/{id}/cancel          # Cancel booking
```

### Seats
```
POST /api/bookings/seats/lock    # Lock seats
POST /api/bookings/seats/unlock  # Unlock seats
```

### Authentication (NEW)
```
POST /api/auth/register          # Register new user
POST /api/auth/login             # Login user
POST /api/auth/logout            # Logout user
POST /api/auth/refresh           # Refresh token
GET  /api/auth/me                # Get current user
```

## 🎯 Key Features Explained

### BookMyShow-Style Seat Selection
- **SVG Cinema Seats**: Realistic chair shapes with armrests and backrest
- **Category Jump Bar**: Sticky navigation to jump between seat categories
- **Hover Effects**: Seats lift and glow on hover with category-specific colors
- **Seat Pills**: Selected seats appear as pills above the bottom bar
- **Countdown Timer**: 10-minute timer that turns red under 3 minutes
- **Toast Notifications**: Mini ticket stub style notifications

### Authentication System
- **JWT-Based**: Secure token-based authentication
- **Password Strength**: Real-time strength meter (weak/fair/good/strong)
- **Auto Refresh**: Tokens automatically refresh before expiry
- **Protected Routes**: Auth guards redirect to login if not authenticated
- **User Avatar**: Colorful initials-based avatars

### Booking Flow
1. Browse movies on landing page
2. Click movie → View details
3. Select date and show time
4. Choose seats (max 10)
5. Review booking at checkout
6. Confirm and pay
7. Get booking confirmation with QR code
8. View in booking history

## 📱 Responsive Design

- **Desktop**: Full split-screen layouts, hover effects
- **Tablet**: Optimized grid layouts
- **Mobile**: Single column, touch-friendly buttons

## 🎬 Sample Data

The mock backend includes:
- **11 Movies** with real TMDB posters
- **2 Theaters** (Cineplex Grand, MovieMax Theater)
- **7 Days** of show times
- **4 Show Times** per day (10:00, 14:00, 18:00, 21:00)

## 🔮 Upcoming Features

- [ ] Booking cancellation with refund calculation
- [ ] Cancelled bookings page
- [ ] User profile management
- [ ] Forgot password flow
- [ ] OTP verification
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Movie reviews and ratings
- [ ] Seat recommendations

## 🐛 Known Issues

- Backend authentication endpoints need implementation
- Booking cancellation UI pending
- Email OTP verification not implemented

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Built with ❤️ for movie lovers everywhere

## 🙏 Acknowledgments

- Movie posters from [TMDB](https://www.themoviedb.org/)
- Icons from [Lucide](https://lucide.dev/)
- Fonts from [Google Fonts](https://fonts.google.com/)
- Inspired by [BookMyShow](https://in.bookmyshow.com/)

## 📞 Support

For support, email support@cinebook.com or open an issue in the repository.

---

**⭐ Star this repo if you like it!**

Made with 🎬 and ☕
