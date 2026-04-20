// Booking History Page Logic

let allBookings = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    await loadBookings();
    setupFilters();
    setupSearch();
});

async function loadBookings() {
    try {
        const user = getCurrentUser();
        allBookings = await APIService.getUserBookings(user.userId);
        
        // Sort by booking date (newest first)
        allBookings.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
        
        renderBookings(allBookings);
    } catch (error) {
        console.error('Error loading bookings:', error);
        showError('Failed to load booking history');
    }
}

function renderBookings(bookings) {
    const timeline = document.getElementById('bookingsTimeline');
    
    if (bookings.length === 0) {
        timeline.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎬</div>
                <h3>No bookings found</h3>
                <p>Start booking your favorite movies now!</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block; text-decoration: none;">
                    Browse Movies
                </a>
            </div>
        `;
        return;
    }

    timeline.innerHTML = bookings.map(booking => {
        const showDate = new Date(booking.showDate);
        const now = new Date();
        const isPast = showDate < now;
        const isUpcoming = showDate >= now && booking.bookingStatus === 'CONFIRMED';
        const isCancelled = booking.bookingStatus === 'CANCELLED';
        const posterUrl = booking.moviePosterUrl || 'https://via.placeholder.com/80x120?text=' + encodeURIComponent(booking.movieName);

        return `
            <div class="booking-card ${booking.bookingStatus.toLowerCase()}">
                <div class="booking-header">
                    <div style="display: flex; gap: 1rem; align-items: center;">
                        <img src="${posterUrl}" alt="${booking.movieName}" style="width: 60px; height: 90px; border-radius: 5px; object-fit: cover;">
                        <div>
                            <div class="booking-movie-title">${booking.movieName}</div>
                            <div style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                                Booking ID: <strong>${booking.bookingId}</strong>
                            </div>
                        </div>
                    </div>
                    <div class="booking-status ${booking.bookingStatus.toLowerCase()}">
                        <i data-lucide="${booking.bookingStatus === 'CONFIRMED' ? 'check-circle' : 'x-circle'}"></i>
                        ${booking.bookingStatus}
                    </div>
                </div>

                <div class="booking-details">
                    <div class="booking-detail-item">
                        <i data-lucide="map-pin"></i>
                        <span>${booking.theaterName}</span>
                    </div>
                    <div class="booking-detail-item">
                        <i data-lucide="calendar"></i>
                        <span>${formatDate(booking.showDate)}</span>
                    </div>
                    <div class="booking-detail-item">
                        <i data-lucide="clock"></i>
                        <span>${booking.showTime}</span>
                    </div>
                    <div class="booking-detail-item">
                        <i data-lucide="armchair"></i>
                        <span>${booking.selectedSeats.join(', ')}</span>
                    </div>
                </div>

                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--text-secondary);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600;">Total Amount:</span>
                        <span style="font-size: 1.3rem; font-weight: 700; color: var(--primary);">
                            ${formatCurrency(booking.totalAmount)}
                        </span>
                    </div>
                </div>

                <div class="booking-actions">
                    <a href="confirmation.html?bookingId=${booking.bookingId}" class="view-ticket-btn">
                        <i data-lucide="ticket"></i>
                        View Ticket
                    </a>
                    ${isUpcoming && !isCancelled ? `
                        <button class="cancel-btn" onclick="cancelBooking('${booking.bookingId}')">
                            <i data-lucide="x-circle"></i>
                            Cancel Booking
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    lucide.createIcons();
}

function setupFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter bookings
            currentFilter = tab.dataset.filter;
            const filtered = filterBookings(allBookings, currentFilter);
            renderBookings(filtered);
        });
    });
}

function filterBookings(bookings, filter) {
    const now = new Date();

    switch (filter) {
        case 'upcoming':
            return bookings.filter(b => 
                new Date(b.showDate) >= now && b.bookingStatus === 'CONFIRMED'
            );
        case 'past':
            return bookings.filter(b => 
                new Date(b.showDate) < now && b.bookingStatus === 'CONFIRMED'
            );
        case 'cancelled':
            return bookings.filter(b => b.bookingStatus === 'CANCELLED');
        default:
            return bookings;
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchBookingInput');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            renderBookings(filterBookings(allBookings, currentFilter));
            return;
        }

        const filtered = allBookings.filter(booking => 
            booking.bookingId.toLowerCase().includes(query) ||
            booking.movieName.toLowerCase().includes(query) ||
            booking.theaterName.toLowerCase().includes(query)
        );

        renderBookings(filtered);
    });
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        await APIService.cancelBooking(bookingId);
        showToast('Booking cancelled successfully', 'success');
        await loadBookings();
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showError(error.message || 'Failed to cancel booking');
    }
}
