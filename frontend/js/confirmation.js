// Confirmation Page Logic

let currentBooking = null;

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    
    // Trigger confetti
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId');
    
    if (!bookingId) {
        showError('Booking not found');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    await loadBookingDetails(bookingId);
});

async function loadBookingDetails(bookingId) {
    try {
        currentBooking = await APIService.getBookingById(bookingId);
        renderTicket();
    } catch (error) {
        console.error('Error loading booking:', error);
        showError('Failed to load booking details');
    }
}

function renderTicket() {
    // Use the poster URL from booking data
    const posterUrl = currentBooking.moviePosterUrl || 'https://via.placeholder.com/200x280?text=' + encodeURIComponent(currentBooking.movieName);
    
    document.getElementById('ticketPoster').src = posterUrl;
    document.getElementById('ticketMovieTitle').textContent = currentBooking.movieName;
    document.getElementById('ticketTheater').textContent = currentBooking.theaterName;
    document.getElementById('ticketDate').textContent = formatDate(currentBooking.showDate);
    document.getElementById('ticketTime').textContent = currentBooking.showTime;
    document.getElementById('ticketCategory').textContent = currentBooking.seatCategory;
    document.getElementById('ticketAmount').textContent = formatCurrency(currentBooking.totalAmount);
    document.getElementById('ticketBookingId').textContent = currentBooking.bookingId;

    // Render seats
    const seatsContainer = document.getElementById('ticketSeats');
    seatsContainer.innerHTML = currentBooking.selectedSeats.map(seat => 
        `<span class="seat-badge">${seat}</span>`
    ).join('');

    // Generate QR code using an API
    const qrCodeContainer = document.querySelector('.qr-code');
    const qrData = encodeURIComponent(currentBooking.bookingId);
    qrCodeContainer.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${qrData}" alt="QR Code" style="width: 100%; height: 100%;">`;

    lucide.createIcons();
}

function downloadTicket() {
    showToast('Download feature coming soon!', 'success');
    // In a real app, you would generate a PDF here
}

function shareBooking() {
    if (navigator.share) {
        navigator.share({
            title: 'Movie Ticket Booking',
            text: `I just booked tickets for ${currentBooking.movieName}! Booking ID: ${currentBooking.bookingId}`,
            url: window.location.href
        }).catch(err => console.error('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        const text = `Movie: ${currentBooking.movieName}\nBooking ID: ${currentBooking.bookingId}\nSeats: ${currentBooking.selectedSeats.join(', ')}`;
        navigator.clipboard.writeText(text).then(() => {
            showToast('Booking details copied to clipboard!', 'success');
        });
    }
}
