# 📁 CineBook - Complete File Structure

## Project Root
```
Movie Ticket/
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # Main project documentation
├── 📄 SETUP.md                      # Detailed setup instructions
├── 📄 QUICK_START.md                # Quick reference guide
├── 📄 PROJECT_OVERVIEW.md           # Architecture and design details
├── 📄 PROJECT_SUMMARY.md            # Project completion summary
├── 📄 SYSTEM_FLOW.md                # System flow diagrams
├── 📄 FILE_STRUCTURE.md             # This file
├── 📄 start-backend.bat             # Windows script to start backend
├── 📄 start-frontend.bat            # Windows script to start frontend
│
├── 📁 backend/                      # Java Spring Boot Backend
│   ├── 📄 pom.xml                   # Maven configuration
│   ├── 📄 sample-data.json          # Sample MongoDB data
│   │
│   └── 📁 src/main/
│       ├── 📁 java/com/moviebooking/
│       │   ├── 📄 MovieBookingApplication.java    # Main Spring Boot class
│       │   │
│       │   ├── 📁 config/
│       │   │   ├── 📄 MongoConfig.java            # MongoDB configuration
│       │   │   └── 📄 CorsConfig.java             # CORS configuration
│       │   │
│       │   ├── 📁 controller/
│       │   │   ├── 📄 MovieController.java        # Movie REST endpoints
│       │   │   ├── 📄 ShowController.java         # Show REST endpoints
│       │   │   ├── 📄 BookingController.java      # Booking REST endpoints
│       │   │   └── 📄 UserController.java         # User REST endpoints
│       │   │
│       │   ├── 📁 model/
│       │   │   ├── 📄 Movie.java                  # Movie entity
│       │   │   ├── 📄 Theater.java                # Theater entity
│       │   │   ├── 📄 Show.java                   # Show entity
│       │   │   ├── 📄 Booking.java                # Booking entity
│       │   │   └── 📄 User.java                   # User entity
│       │   │
│       │   ├── 📁 repository/
│       │   │   ├── 📄 MovieRepository.java        # Movie data access
│       │   │   ├── 📄 TheaterRepository.java      # Theater data access
│       │   │   ├── 📄 ShowRepository.java         # Show data access
│       │   │   ├── 📄 BookingRepository.java      # Booking data access
│       │   │   └── 📄 UserRepository.java         # User data access
│       │   │
│       │   ├── 📁 service/
│       │   │   ├── 📄 MovieService.java           # Movie business logic
│       │   │   ├── 📄 ShowService.java            # Show business logic
│       │   │   ├── 📄 BookingService.java         # Booking business logic
│       │   │   └── 📄 SeatService.java            # Seat locking logic
│       │   │
│       │   └── 📁 exception/
│       │       ├── 📄 SeatAlreadyBookedException.java
│       │       ├── 📄 ShowNotFoundException.java
│       │       └── 📄 GlobalExceptionHandler.java
│       │
│       └── 📁 resources/
│           └── 📄 application.properties          # Application configuration
│
└── 📁 frontend/                     # HTML/CSS/JavaScript Frontend
    ├── 📄 index.html                # Home page
    ├── 📄 movie-details.html        # Movie details page
    ├── 📄 seat-selection.html       # Seat selection page
    ├── 📄 confirmation.html         # Booking confirmation page
    ├── 📄 history.html              # Booking history page
    │
    ├── 📁 css/
    │   └── 📄 styles.css            # Main stylesheet (1000+ lines)
    │
    ├── 📁 js/
    │   ├── 📄 config.js             # Configuration and utilities
    │   ├── 📄 api.js                # API service layer
    │   ├── 📄 home.js               # Home page logic
    │   ├── 📄 movie-details.js      # Movie details logic
    │   ├── 📄 seat-selection.js     # Seat selection logic
    │   ├── 📄 confirmation.js       # Confirmation page logic
    │   └── 📄 history.js            # History page logic
    │
    ├── 📁 assets/                   # Static assets (empty, ready for use)
    └── 📁 images/                   # Images (empty, ready for use)
```

---

## File Count Summary

### Backend Files
| Category | Count | Files |
|----------|-------|-------|
| Configuration | 3 | MongoConfig, CorsConfig, application.properties |
| Controllers | 4 | Movie, Show, Booking, User |
| Models | 5 | Movie, Theater, Show, Booking, User |
| Repositories | 5 | Movie, Theater, Show, Booking, User |
| Services | 4 | Movie, Show, Booking, Seat |
| Exceptions | 3 | SeatAlreadyBooked, ShowNotFound, GlobalHandler |
| Main | 1 | MovieBookingApplication |
| Build | 1 | pom.xml |
| **Total** | **26** | |

### Frontend Files
| Category | Count | Files |
|----------|-------|-------|
| HTML Pages | 5 | index, movie-details, seat-selection, confirmation, history |
| CSS | 1 | styles.css |
| JavaScript | 7 | config, api, home, movie-details, seat-selection, confirmation, history |
| **Total** | **13** | |

### Documentation Files
| Category | Count | Files |
|----------|-------|-------|
| Documentation | 7 | README, SETUP, QUICK_START, PROJECT_OVERVIEW, PROJECT_SUMMARY, SYSTEM_FLOW, FILE_STRUCTURE |
| Scripts | 2 | start-backend.bat, start-frontend.bat |
| Config | 1 | .gitignore |
| **Total** | **10** | |

### Grand Total: **49 Files**

---

## File Sizes (Approximate)

### Backend
```
MovieBookingApplication.java    ~50 lines
MongoConfig.java                 ~40 lines
CorsConfig.java                  ~30 lines
MovieController.java             ~80 lines
ShowController.java              ~70 lines
BookingController.java           ~90 lines
UserController.java              ~60 lines
Movie.java                       ~30 lines
Theater.java                     ~40 lines
Show.java                        ~50 lines
Booking.java                     ~60 lines
User.java                        ~30 lines
MovieRepository.java             ~20 lines
TheaterRepository.java           ~20 lines
ShowRepository.java              ~25 lines
BookingRepository.java           ~25 lines
UserRepository.java              ~20 lines
MovieService.java                ~80 lines
ShowService.java                 ~120 lines
BookingService.java              ~180 lines
SeatService.java                 ~280 lines
SeatAlreadyBookedException.java  ~10 lines
ShowNotFoundException.java       ~10 lines
GlobalExceptionHandler.java      ~60 lines
application.properties           ~20 lines
pom.xml                          ~80 lines
────────────────────────────────────────
Total Backend:                   ~1,500 lines
```

### Frontend
```
index.html                       ~100 lines
movie-details.html               ~150 lines
seat-selection.html              ~200 lines
confirmation.html                ~150 lines
history.html                     ~150 lines
styles.css                       ~1,000 lines
config.js                        ~100 lines
api.js                           ~120 lines
home.js                          ~120 lines
movie-details.js                 ~200 lines
seat-selection.js                ~350 lines
confirmation.js                  ~80 lines
history.js                       ~150 lines
────────────────────────────────────────
Total Frontend:                  ~2,870 lines
```

### Documentation
```
README.md                        ~400 lines
SETUP.md                         ~350 lines
QUICK_START.md                   ~150 lines
PROJECT_OVERVIEW.md              ~600 lines
PROJECT_SUMMARY.md               ~500 lines
SYSTEM_FLOW.md                   ~700 lines
FILE_STRUCTURE.md                ~300 lines
────────────────────────────────────────
Total Documentation:             ~3,000 lines
```

### **Grand Total: ~7,370 lines of code + documentation**

---

## Key Files Description

### Backend Core Files

#### 🔧 Configuration
- **MongoConfig.java**: Sets up MongoDB transactions with proper isolation levels
- **CorsConfig.java**: Enables cross-origin requests from frontend
- **application.properties**: Database connection and app settings

#### 🎯 Controllers (REST APIs)
- **MovieController.java**: CRUD operations for movies
- **ShowController.java**: Show management and seat availability
- **BookingController.java**: Booking creation, cancellation, seat locking
- **UserController.java**: User management

#### 📦 Models (Entities)
- **Movie.java**: Movie information with cast, genre, etc.
- **Theater.java**: Theater with seat layout configuration
- **Show.java**: Show timings with seat tracking and version field
- **Booking.java**: Booking details with price breakdown
- **User.java**: User information and booking history

#### 💼 Services (Business Logic)
- **MovieService.java**: Movie operations
- **ShowService.java**: Show operations with enrichment
- **BookingService.java**: Booking creation with price calculation
- **SeatService.java**: ⭐ Core seat locking with transactions

#### 🗄️ Repositories
- MongoDB data access interfaces using Spring Data

#### ⚠️ Exceptions
- Custom exceptions with user-friendly messages

### Frontend Core Files

#### 🌐 HTML Pages
- **index.html**: Home page with movie browsing
- **movie-details.html**: Detailed movie view with shows
- **seat-selection.html**: Interactive seat map
- **confirmation.html**: Booking ticket display
- **history.html**: User booking timeline

#### 🎨 Styling
- **styles.css**: Complete design system with animations

#### ⚙️ JavaScript
- **config.js**: API endpoints, session management, utilities
- **api.js**: Centralized API service layer
- **home.js**: Movie listing and search
- **movie-details.js**: Show selection logic
- **seat-selection.js**: ⭐ Seat locking and booking flow
- **confirmation.js**: Ticket display with confetti
- **history.js**: Booking management

---

## Important Directories

### 📁 backend/src/main/java/com/moviebooking/
The main Java package containing all backend code

### 📁 backend/src/main/resources/
Configuration files and static resources

### 📁 frontend/
All frontend HTML, CSS, and JavaScript files

### 📁 frontend/css/
Stylesheets (currently 1 main file)

### 📁 frontend/js/
JavaScript modules (7 files)

### 📁 frontend/assets/
Ready for static assets (images, fonts, etc.)

### 📁 frontend/images/
Ready for image files

---

## File Dependencies

### Backend Dependencies (pom.xml)
```xml
- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- spring-boot-starter-validation
- lombok
- spring-boot-devtools
- spring-boot-starter-test
```

### Frontend Dependencies (CDN)
```html
- Lucide Icons (https://unpkg.com/lucide@latest)
- Canvas Confetti (https://cdn.jsdelivr.net/npm/canvas-confetti)
- Google Fonts (Playfair Display, Inter, Caveat)
```

---

## Configuration Files

### application.properties
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/moviebooking
spring.data.mongodb.database=moviebooking
server.port=8080
seat.lock.duration.minutes=10
booking.id.prefix=BK
```

### config.js
```javascript
const API_BASE_URL = 'http://localhost:8080/api';
const SESSION_KEY = 'cinebook_session';
const USER_KEY = 'cinebook_user';
```

---

## Build and Run Files

### Maven (Backend)
- **pom.xml**: Maven project configuration
- **mvn clean install**: Build command
- **mvn spring-boot:run**: Run command

### Frontend
- **No build required**: Pure HTML/CSS/JS
- **python -m http.server 5500**: Simple server
- **npx http-server -p 5500**: Alternative server

---

## Documentation Files Purpose

| File | Purpose |
|------|---------|
| README.md | Main project documentation with overview |
| SETUP.md | Step-by-step setup instructions |
| QUICK_START.md | Quick reference for rapid deployment |
| PROJECT_OVERVIEW.md | Architecture, design, and technical details |
| PROJECT_SUMMARY.md | Project completion summary |
| SYSTEM_FLOW.md | Visual flow diagrams |
| FILE_STRUCTURE.md | This file - complete file listing |

---

## Ready for Development

All files are complete and ready to use:
- ✅ Backend compiles and runs
- ✅ Frontend loads and functions
- ✅ MongoDB schema defined
- ✅ API endpoints documented
- ✅ Sample data provided
- ✅ Helper scripts included
- ✅ Comprehensive documentation

---

**Total Project Size: ~49 files, ~7,370 lines** 🎬
