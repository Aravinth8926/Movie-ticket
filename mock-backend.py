#!/usr/bin/env python3
"""
Mock Backend Server for CineBook
This provides sample data without needing Java/Maven/MongoDB
Run with: python mock-backend.py
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime, timedelta
import random
import string
import hashlib
import base64
import time

# Sample Data with Real Movie Posters
MOVIES = [
    {
        "id": "1",
        "title": "The Grand Adventure",
        "genre": ["Action", "Adventure", "Thriller"],
        "duration": 145,
        "rating": "UA",
        "userRating": 8.5,
        "language": "English",
        "releaseDate": "2024-01-15T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        "description": "An epic journey through uncharted territories where a team of explorers discovers ancient secrets that could change the world forever. Facing impossible odds and deadly challenges, they must work together to survive.",
        "cast": ["John Smith", "Emma Watson", "Michael Chen", "Sarah Johnson"],
        "director": "Christopher Nolan",
        "isActive": True
    },
    {
        "id": "2",
        "title": "Love in Paris",
        "genre": ["Romance", "Drama"],
        "duration": 120,
        "rating": "U",
        "userRating": 7.8,
        "language": "English",
        "releaseDate": "2024-02-01T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
        "description": "A heartwarming tale of two strangers who meet in the city of love and discover that sometimes the best things in life are unexpected. A journey of self-discovery and romance.",
        "cast": ["Ryan Gosling", "Emma Stone", "Tom Hanks"],
        "director": "Greta Gerwig",
        "isActive": True
    },
    {
        "id": "3",
        "title": "Space Odyssey 2024",
        "genre": ["Sci-Fi", "Adventure"],
        "duration": 160,
        "rating": "UA",
        "userRating": 9.2,
        "language": "English",
        "releaseDate": "2024-03-10T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/5a4JdoFwll5DRtKMe7JLuGQ9yJm.jpg",
        "description": "Humanity's first mission to colonize Mars faces unexpected challenges when they discover they're not alone in the universe. A thrilling space adventure that will keep you on the edge of your seat.",
        "cast": ["Matt Damon", "Jessica Chastain", "Chiwetel Ejiofor"],
        "director": "Denis Villeneuve",
        "isActive": True
    },
    {
        "id": "4",
        "title": "The Comedy Club",
        "genre": ["Comedy", "Drama"],
        "duration": 105,
        "rating": "UA",
        "userRating": 7.3,
        "language": "English",
        "releaseDate": "2024-01-20T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg",
        "description": "A struggling comedian gets one last chance to make it big, but success comes with unexpected complications. A hilarious and heartfelt story about following your dreams.",
        "cast": ["Kevin Hart", "Tiffany Haddish", "Steve Carell"],
        "director": "Judd Apatow",
        "isActive": True
    },
    {
        "id": "5",
        "title": "Mystery Manor",
        "genre": ["Mystery", "Thriller", "Horror"],
        "duration": 130,
        "rating": "A",
        "userRating": 8.1,
        "language": "English",
        "releaseDate": "2026-05-25T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
        "description": "A group of strangers are invited to a mysterious mansion where they must solve a deadly puzzle to survive the night. Every room holds a secret, and trust is a luxury they can't afford.",
        "cast": ["Benedict Cumberbatch", "Tilda Swinton", "Oscar Isaac"],
        "director": "Rian Johnson",
        "isActive": True
    },
    {
        "id": "6",
        "title": "Racing Legends",
        "genre": ["Action", "Sports", "Drama"],
        "duration": 135,
        "rating": "UA",
        "userRating": 8.7,
        "language": "English",
        "releaseDate": "2024-02-15T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
        "description": "The story of a legendary race car driver who comes out of retirement for one last championship. Speed, rivalry, and redemption collide on the world's most dangerous tracks.",
        "cast": ["Tom Cruise", "Brad Pitt", "Charlize Theron"],
        "director": "James Mangold",
        "isActive": True
    },
    {
        "id": "7",
        "title": "The Last Kingdom",
        "genre": ["Fantasy", "Adventure", "Action"],
        "duration": 155,
        "rating": "UA",
        "userRating": 8.9,
        "language": "English",
        "releaseDate": "2024-03-20T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
        "description": "In a world where magic is fading, a young warrior must unite the kingdoms to face an ancient evil. An epic fantasy adventure with stunning visuals and unforgettable characters.",
        "cast": ["Henry Cavill", "Anya Taylor-Joy", "Idris Elba"],
        "director": "Peter Jackson",
        "isActive": True
    },
    {
        "id": "8",
        "title": "Ocean's Heist",
        "genre": ["Crime", "Thriller", "Comedy"],
        "duration": 125,
        "rating": "UA",
        "userRating": 7.9,
        "language": "English",
        "releaseDate": "2024-01-25T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg",
        "description": "A master thief assembles a crew for the most daring heist ever attempted. With style, wit, and precision, they plan to steal the impossible from the world's most secure vault.",
        "cast": ["George Clooney", "Sandra Bullock", "Brad Pitt"],
        "director": "Steven Soderbergh",
        "isActive": True
    },
    {
        "id": "9",
        "title": "Haunted Memories",
        "genre": ["Horror", "Psychological", "Thriller"],
        "duration": 115,
        "rating": "A",
        "userRating": 7.6,
        "language": "English",
        "releaseDate": "2024-04-01T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/kuf6dutpsT0vSVehic3EZIqkOBt.jpg",
        "description": "A psychiatrist treating a patient with repressed memories uncovers a terrifying truth that threatens both their lives. Reality and nightmare blur in this psychological horror masterpiece.",
        "cast": ["Lupita Nyong'o", "Daniel Kaluuya", "Elisabeth Moss"],
        "director": "Jordan Peele",
        "isActive": True
    },
    {
        "id": "10",
        "title": "Summer of Dreams",
        "genre": ["Romance", "Comedy", "Drama"],
        "duration": 110,
        "rating": "U",
        "userRating": 7.4,
        "language": "English",
        "releaseDate": "2024-02-10T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg",
        "description": "A summer romance that changes everything. Two people from different worlds find love in the most unexpected place, learning that sometimes the best adventures are the ones we never planned.",
        "cast": ["Timothée Chalamet", "Zendaya", "Florence Pugh"],
        "director": "Greta Gerwig",
        "isActive": True
    },
    {
        "id": "11",
        "title": "Cyber Strike",
        "genre": ["Action", "Sci-Fi", "Thriller"],
        "duration": 140,
        "rating": "UA",
        "userRating": 8.3,
        "language": "English",
        "releaseDate": "2024-03-15T00:00:00.000Z",
        "posterUrl": "https://image.tmdb.org/t/p/w500/wWba3TaojhK7NdycRhoQpsG0FaH.jpg",
        "description": "In a future where technology controls everything, a hacker discovers a conspiracy that could end humanity. Fast-paced action meets cutting-edge sci-fi in this cyberpunk thriller.",
        "cast": ["Keanu Reeves", "Scarlett Johansson", "John Boyega"],
        "director": "Lana Wachowski",
        "isActive": True
    },

]

THEATERS = [
    {
        "id": "1",
        "name": "Cineplex Grand",
        "location": "Downtown, Main Street",
        "totalSeats": 150,
        "seatLayout": {
            "rows": 10,
            "seatsPerRow": 15,
            "categories": [
                {"name": "PLATINUM", "rows": ["A", "B"], "price": 400},
                {"name": "GOLD", "rows": ["C", "D", "E"], "price": 250},
                {"name": "SILVER", "rows": ["F", "G", "H", "I", "J"], "price": 150}
            ]
        }
    },
    {
        "id": "2",
        "name": "MovieMax Theater",
        "location": "Westside Mall",
        "totalSeats": 120,
        "seatLayout": {
            "rows": 8,
            "seatsPerRow": 15,
            "categories": [
                {"name": "PLATINUM", "rows": ["A", "B"], "price": 400},
                {"name": "GOLD", "rows": ["C", "D"], "price": 250},
                {"name": "SILVER", "rows": ["E", "F", "G", "H"], "price": 150}
            ]
        }
    }
]

# Generate shows for all movies
SHOWS = []
show_id = 1
for i in range(7):  # Next 7 days
    show_date = datetime.now() + timedelta(days=i)
    for movie in MOVIES:  # All movies now have shows
        for theater in THEATERS:
            for time in ["10:00", "14:00", "18:00", "21:00"]:
                SHOWS.append({
                    "id": str(show_id),
                    "movieId": movie["id"],
                    "theaterId": theater["id"],
                    "showDate": show_date.isoformat(),
                    "showTime": time,
                    "availableSeats": theater["totalSeats"],
                    "status": "ACTIVE",
                    "movie": {
                        "id": movie["id"],
                        "title": movie["title"],
                        "genre": movie["genre"],
                        "duration": movie["duration"],
                        "rating": movie["rating"],
                        "language": movie["language"],
                        "posterUrl": movie["posterUrl"]
                    },
                    "theater": {
                        "id": theater["id"],
                        "name": theater["name"],
                        "location": theater["location"],
                        "totalSeats": theater["totalSeats"]
                    }
                })
                show_id += 1

BOOKINGS = {}
LOCKED_SEATS = {}

# Authentication data
USERS = {}
TOKENS = {}
AVATAR_COLORS = ["#E74C3C", "#E67E22", "#F39C12", "#2ECC71", 
                 "#1ABC9C", "#3498DB", "#9B59B6", "#F84464",
                 "#16A085", "#8E44AD", "#C0392B", "#D35400"]

# Helper functions for authentication
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token(user_id):
    payload = f"{user_id}:{time.time()}"
    return base64.b64encode(payload.encode()).decode()

def validate_token(token):
    if not token:
        return None
    try:
        decoded = base64.b64decode(token).decode()
        user_id, timestamp = decoded.split(':')
        # Check if token expired (24 hours)
        if time.time() - float(timestamp) > 86400:
            return None
        return user_id
    except:
        return None

def get_random_avatar_color():
    return random.choice(AVATAR_COLORS)

class MockBackendHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        # Authentication endpoints
        if self.path == '/api/auth/me':
            auth_header = self.headers.get('Authorization', '')
            token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else None
            user_id = validate_token(token)
            
            if not user_id or user_id not in USERS:
                self._set_headers(401)
                self.wfile.write(json.dumps({"error": "Unauthorized"}).encode())
                return
            
            user = USERS[user_id]
            self._set_headers()
            self.wfile.write(json.dumps({
                "userId": user['userId'],
                "fullName": user['fullName'],
                "email": user['email'],
                "phone": user['phone'],
                "avatarColor": user['avatarColor']
            }).encode())
            return
        
        # Existing movie endpoints
        if self.path == '/api/movies':
            self._set_headers()
            self.wfile.write(json.dumps(MOVIES).encode())
        
        elif self.path.startswith('/api/movies/'):
            movie_id = self.path.split('/')[-1]
            movie = next((m for m in MOVIES if m['id'] == movie_id), None)
            if movie:
                self._set_headers()
                self.wfile.write(json.dumps(movie).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Movie not found"}).encode())
        
        elif self.path == '/api/shows':
            self._set_headers()
            self.wfile.write(json.dumps(SHOWS).encode())
        
        elif self.path.startswith('/api/shows/movie/'):
            # Handle /api/shows/movie/{movieId} - MUST come before /api/shows/{id}
            movie_id = self.path.split('/')[-1]
            movie_shows = [s for s in SHOWS if s['movieId'] == movie_id]
            self._set_headers()
            self.wfile.write(json.dumps(movie_shows).encode())
        
        elif self.path.startswith('/api/shows/') and '/seats' in self.path:
            # Handle /api/shows/{id}/seats
            show_id = self.path.split('/')[-2]
            show = next((s for s in SHOWS if s['id'] == show_id), None)
            if show:
                theater = next((t for t in THEATERS if t['id'] == show['theaterId']), None)
                seat_layout = self._generate_seat_layout(theater, show_id)
                response = {
                    "showId": show_id,
                    "totalSeats": theater['totalSeats'],
                    "availableSeats": show['availableSeats'],
                    "bookedSeats": [],
                    "lockedSeats": LOCKED_SEATS.get(show_id, []),
                    "seatLayout": seat_layout,
                    "categories": theater['seatLayout']['categories']
                }
                self._set_headers()
                self.wfile.write(json.dumps(response).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Show not found"}).encode())
        
        elif self.path.startswith('/api/shows/'):
            # Handle /api/shows/{id} - Get single show details
            show_id = self.path.split('/')[-1]
            show = next((s for s in SHOWS if s['id'] == show_id), None)
            if show:
                self._set_headers()
                self.wfile.write(json.dumps(show).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Show not found"}).encode())
        
        elif self.path.startswith('/api/bookings/user/'):
            # Handle /api/bookings/user/{userId} - Get all bookings for a user
            user_id = self.path.split('/')[-1]
            user_bookings = [b for b in BOOKINGS.values() if b.get('userId') == user_id]
            self._set_headers()
            self.wfile.write(json.dumps(user_bookings).encode())
        
        elif self.path.startswith('/api/bookings/'):
            # Handle /api/bookings/{bookingId}
            booking_id = self.path.split('/')[-1]
            booking = BOOKINGS.get(booking_id)
            if booking:
                self._set_headers()
                self.wfile.write(json.dumps(booking).encode())
            else:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Booking not found"}).encode())
        
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode())

        # Authentication endpoints
        if self.path == '/api/auth/register':
            email = data.get('email')
            password = data.get('password')
            full_name = data.get('fullName')
            phone = data.get('phone')
            
            # Check if email already exists
            if any(u['email'] == email for u in USERS.values()):
                self._set_headers(409)
                self.wfile.write(json.dumps({"message": "Email already registered"}).encode())
                return
            
            # Create user
            user_id = 'USER-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            avatar_color = get_random_avatar_color()
            
            USERS[user_id] = {
                "userId": user_id,
                "fullName": full_name,
                "email": email,
                "password": hash_password(password),
                "phone": phone,
                "avatarColor": avatar_color,
                "role": "USER",
                "createdAt": datetime.now().isoformat()
            }
            
            # Generate token
            token = generate_token(user_id)
            refresh_token = generate_token(user_id + '-refresh')
            TOKENS[token] = user_id
            
            response = {
                "token": token,
                "refreshToken": refresh_token,
                "userId": user_id,
                "fullName": full_name,
                "email": email,
                "role": "USER",
                "avatarColor": avatar_color
            }
            
            self._set_headers()
            self.wfile.write(json.dumps(response).encode())
            return
        
        elif self.path == '/api/auth/login':
            email = data.get('email')
            password = data.get('password')
            
            # Find user
            user = None
            user_id = None
            for uid, u in USERS.items():
                if u['email'] == email:
                    user = u
                    user_id = uid
                    break
            
            if not user or user['password'] != hash_password(password):
                self._set_headers(401)
                self.wfile.write(json.dumps({"message": "Invalid email or password"}).encode())
                return
            
            # Generate token
            token = generate_token(user_id)
            refresh_token = generate_token(user_id + '-refresh')
            TOKENS[token] = user_id
            
            response = {
                "token": token,
                "refreshToken": refresh_token,
                "userId": user_id,
                "fullName": user['fullName'],
                "email": user['email'],
                "role": user.get('role', 'USER'),
                "avatarColor": user['avatarColor']
            }
            
            self._set_headers()
            self.wfile.write(json.dumps(response).encode())
            return
        
        elif self.path == '/api/auth/logout':
            auth_header = self.headers.get('Authorization', '')
            token = auth_header.replace('Bearer ', '') if auth_header.startswith('Bearer ') else None
            
            if token and token in TOKENS:
                del TOKENS[token]
            
            self._set_headers()
            self.wfile.write(json.dumps({"message": "Logged out successfully"}).encode())
            return
        
        # Existing booking endpoints
        if self.path == '/api/bookings/seats/lock':
            show_id = data.get('showId')
            seat_numbers = data.get('seatNumbers', [])
            session_id = data.get('sessionId')
            
            if show_id not in LOCKED_SEATS:
                LOCKED_SEATS[show_id] = []
            
            LOCKED_SEATS[show_id].extend(seat_numbers)
            
            response = {
                "success": True,
                "sessionId": session_id,
                "lockedSeats": seat_numbers,
                "expiresAt": (datetime.now() + timedelta(minutes=10)).isoformat(),
                "message": "Seats locked successfully"
            }
            self._set_headers()
            self.wfile.write(json.dumps(response).encode())
        
        elif self.path.startswith('/api/bookings'):
            # Get show and movie details
            show_id = data.get('showId')
            show = next((s for s in SHOWS if s['id'] == show_id), None)
            
            if not show:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Show not found"}).encode())
                return
            
            booking_id = 'BK-2024-' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=5))
            
            # Calculate total amount
            num_seats = len(data.get('selectedSeats', []))
            price_per_seat = data.get('pricePerSeat', 250)
            base_price = num_seats * price_per_seat
            
            # Weekend surcharge
            show_date = datetime.fromisoformat(show['showDate'].replace('Z', '+00:00'))
            is_weekend = show_date.weekday() >= 4  # Friday, Saturday, Sunday
            weekend_surcharge = base_price * 0.20 if is_weekend else 0
            
            # First show surcharge
            show_time = show['showTime']
            hour = int(show_time.split(':')[0])
            first_show_surcharge = base_price * 0.30 if hour < 12 else 0
            
            subtotal = base_price + weekend_surcharge + first_show_surcharge
            gst = subtotal * 0.18
            total = subtotal + gst
            
            booking = {
                "id": str(len(BOOKINGS) + 1),
                "bookingId": booking_id,
                "userId": data.get('userId'),
                "showId": show_id,
                "movieName": show['movie']['title'],
                "moviePosterUrl": show['movie']['posterUrl'],
                "theaterName": show['theater']['name'],
                "showDate": show['showDate'],
                "showTime": show['showTime'],
                "selectedSeats": data.get('selectedSeats', []),
                "seatCategory": data.get('seatCategory'),
                "pricePerSeat": price_per_seat,
                "totalAmount": total,
                "bookingStatus": "CONFIRMED",
                "bookingDate": datetime.now().isoformat(),
                "paymentId": "PAY-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=8)),
                "paymentStatus": "PAID",
                "priceBreakdown": {
                    "basePrice": base_price,
                    "weekendSurcharge": weekend_surcharge,
                    "firstShowSurcharge": first_show_surcharge,
                    "subtotal": subtotal,
                    "gst": gst,
                    "total": total
                }
            }
            BOOKINGS[booking_id] = booking
            self._set_headers()
            self.wfile.write(json.dumps(booking).encode())
        
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def do_PUT(self):
        if self.path.endswith('/cancel'):
            # Handle /api/bookings/{bookingId}/cancel
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length > 0:
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode())
                reason = data.get('reason', 'No reason provided')
            else:
                reason = 'No reason provided'
            
            booking_id = self.path.split('/')[-2]
            booking = BOOKINGS.get(booking_id)
            
            if not booking:
                self._set_headers(404)
                self.wfile.write(json.dumps({"error": "Booking not found"}).encode())
                return
            
            # Check if already cancelled
            if booking.get('bookingStatus') == 'CANCELLED':
                self._set_headers(409)
                self.wfile.write(json.dumps({"error": "Booking already cancelled"}).encode())
                return
            
            # Calculate refund
            show_datetime = datetime.fromisoformat(booking['showDate'].replace('Z', '+00:00'))
            show_time_parts = booking['showTime'].split(':')
            show_datetime = show_datetime.replace(hour=int(show_time_parts[0]), minute=int(show_time_parts[1]))
            
            now = datetime.now()
            hours_until = (show_datetime - now).total_seconds() / 3600
            
            if hours_until <= 0:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Show has already started"}).encode())
                return
            
            if hours_until < 2:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Cancellation not allowed within 2 hours of show"}).encode())
                return
            
            # Calculate refund percentage
            if hours_until > 48:
                refund_pct = 100
                policy_text = "100% Refund"
            elif hours_until > 24:
                refund_pct = 75
                policy_text = "75% Refund"
            else:
                refund_pct = 50
                policy_text = "50% Refund"
            
            total_amount = booking['totalAmount']
            refund_amount = total_amount * refund_pct / 100
            cancellation_fee = total_amount - refund_amount
            
            # Update booking
            booking['bookingStatus'] = 'CANCELLED'
            booking['cancellationDate'] = now.isoformat()
            booking['cancellationReason'] = reason
            booking['refundAmount'] = refund_amount
            booking['cancellationFee'] = cancellation_fee
            booking['refundPercentage'] = refund_pct
            booking['refundStatus'] = 'INITIATED'
            booking['expectedRefundDate'] = (now + timedelta(days=7)).isoformat()
            
            BOOKINGS[booking_id] = booking
            
            response = {
                "bookingId": booking_id,
                "cancellationId": "CXL-2024-" + ''.join(random.choices(string.ascii_uppercase + string.digits, k=5)),
                "refundAmount": refund_amount,
                "cancellationFee": cancellation_fee,
                "refundPercentage": refund_pct,
                "refundStatus": "INITIATED",
                "expectedRefundDate": booking['expectedRefundDate'],
                "message": "Booking cancelled successfully"
            }
            
            self._set_headers()
            self.wfile.write(json.dumps(response).encode())
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Not found"}).encode())

    def _generate_seat_layout(self, theater, show_id):
        layout = []
        for i in range(theater['seatLayout']['rows']):
            row_letter = chr(65 + i)  # A, B, C, etc.
            category = self._get_category(row_letter, theater['seatLayout']['categories'])
            
            for j in range(1, theater['seatLayout']['seatsPerRow'] + 1):
                seat_number = f"{row_letter}{j}"
                locked = seat_number in LOCKED_SEATS.get(show_id, [])
                
                layout.append({
                    "seatNumber": seat_number,
                    "row": row_letter,
                    "column": j,
                    "category": category['name'],
                    "price": category['price'],
                    "status": "LOCKED" if locked else "AVAILABLE"
                })
        
        return layout

    def _get_category(self, row, categories):
        for cat in categories:
            if row in cat['rows']:
                return cat
        return categories[-1]  # Default to last category

    def log_message(self, format, *args):
        print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def run(port=8080):
    server_address = ('', port)
    httpd = HTTPServer(server_address, MockBackendHandler)
    print(f"""
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🎬 CineBook Mock Backend Server                         ║
║                                                            ║
║   ✅ Server running on: http://localhost:{port}            ║
║   ✅ API endpoint: http://localhost:{port}/api/movies      ║
║                                                            ║
║   📋 Available endpoints:                                  ║
║      Authentication:                                       ║
║      POST /api/auth/register                               ║
║      POST /api/auth/login                                  ║
║      POST /api/auth/logout                                 ║
║      GET  /api/auth/me                                     ║
║                                                            ║
║      Movies & Shows:                                       ║
║      GET  /api/movies                                      ║
║      GET  /api/movies/{{id}}                                ║
║      GET  /api/shows                                       ║
║      GET  /api/shows/movie/{{movieId}}                      ║
║      GET  /api/shows/{{id}}/seats                           ║
║                                                            ║
║      Bookings:                                             ║
║      POST /api/bookings/seats/lock                         ║
║      POST /api/bookings                                    ║
║      GET  /api/bookings/user/{{userId}}                     ║
║      PUT  /api/bookings/{{id}}/cancel                       ║
║                                                            ║
║   🌐 Now open: http://localhost:5500                       ║
║   📝 Press Ctrl+C to stop the server                       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    """)
    httpd.serve_forever()

if __name__ == '__main__':
    try:
        run()
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Goodbye!")
