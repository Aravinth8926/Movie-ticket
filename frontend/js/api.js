// API Service Layer

class APIService {
    static async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.userMessage || error.message || 'Request failed');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Movies
    static async getAllMovies() {
        return this.request(API_ENDPOINTS.movies);
    }

    static async getMovieById(id) {
        return this.request(`${API_ENDPOINTS.movies}/${id}`);
    }

    static async searchMovies(title) {
        return this.request(`${API_ENDPOINTS.movies}/search?title=${encodeURIComponent(title)}`);
    }

    // Shows
    static async getAllShows() {
        return this.request(API_ENDPOINTS.shows);
    }

    static async getShowById(id) {
        return this.request(`${API_ENDPOINTS.shows}/${id}`);
    }

    static async getShowsByMovie(movieId) {
        return this.request(`${API_ENDPOINTS.shows}/movie/${movieId}`);
    }

    static async getSeatAvailability(showId) {
        return this.request(`${API_ENDPOINTS.shows}/${showId}/seats`);
    }

    // Seats
    static async lockSeats(showId, seatNumbers, sessionId) {
        return this.request(API_ENDPOINTS.seats.lock, {
            method: 'POST',
            body: JSON.stringify({
                showId,
                seatNumbers,
                sessionId
            })
        });
    }

    static async unlockSeats(showId, sessionId) {
        return this.request(API_ENDPOINTS.seats.unlock, {
            method: 'POST',
            body: JSON.stringify({
                showId,
                sessionId
            })
        });
    }

    // Bookings
    static async createBooking(bookingData, sessionId) {
        return this.request(`${API_ENDPOINTS.bookings}?sessionId=${sessionId}`, {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    static async getBookingById(bookingId) {
        return this.request(`${API_ENDPOINTS.bookings}/${bookingId}`);
    }

    static async getUserBookings(userId) {
        return this.request(`${API_ENDPOINTS.bookings}/user/${userId}`);
    }

    static async cancelBooking(bookingId) {
        return this.request(`${API_ENDPOINTS.bookings}/${bookingId}/cancel`, {
            method: 'PUT'
        });
    }
}
