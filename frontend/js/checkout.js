// Checkout Page Logic

let bookingData = null;
let showData = null;
let movieData = null;

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    
    // Get booking data from sessionStorage
    const bookingDataStr = sessionStorage.getItem('checkoutData');
    if (!bookingDataStr) {
        showError('No booking data found');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    bookingData = JSON.parse(bookingDataStr);
    await loadBookingDetails();
    setupPaymentMethods();
    setupTermsCheckbox();
    setupConfirmButton();
});

async function loadBookingDetails() {
    try {
        // Load show details
        showData = await APIService.getShowById(bookingData.showId);
        
        // Load movie details
        movieData = showData.movie;

        renderBookingDetails();
    } catch (error) {
        console.error('Error loading booking details:', error);
        showError('Failed to load booking details');
    }
}

function renderBookingDetails() {
    // Movie Info
    document.getElementById('checkoutMovieTitle').textContent = movieData.title;
    document.getElementById('checkoutRating').textContent = movieData.rating;
    document.getElementById('checkoutDuration').textContent = movieData.duration;
    document.getElementById('checkoutLanguage').textContent = movieData.language;

    // Booking Details
    document.getElementById('checkoutTheater').textContent = showData.theater.name;
    document.getElementById('checkoutDate').textContent = formatDate(showData.showDate);
    document.getElementById('checkoutTime').textContent = showData.showTime;
    document.getElementById('checkoutCategory').textContent = bookingData.seatCategory;
    document.getElementById('checkoutTicketCount').textContent = bookingData.selectedSeats.length;

    // Seats
    const seatsContainer = document.getElementById('checkoutSeats');
    seatsContainer.innerHTML = bookingData.selectedSeats.map(seat => 
        `<span class="seat-badge">${seat}</span>`
    ).join('');

    // Price Breakdown
    renderPriceBreakdown();

    lucide.createIcons();
}

function renderPriceBreakdown() {
    const breakdown = bookingData.priceBreakdown;

    document.getElementById('summaryBasePrice').textContent = formatCurrency(breakdown.basePrice);
    document.getElementById('summaryGst').textContent = formatCurrency(breakdown.gst);
    document.getElementById('summaryTotal').textContent = formatCurrency(breakdown.total);

    // Show/hide surcharges
    if (breakdown.weekendSurcharge > 0) {
        document.getElementById('summaryWeekendRow').style.display = 'flex';
        document.getElementById('summaryWeekendSurcharge').textContent = formatCurrency(breakdown.weekendSurcharge);
    }

    if (breakdown.firstShowSurcharge > 0) {
        document.getElementById('summaryFirstShowRow').style.display = 'flex';
        document.getElementById('summaryFirstShowSurcharge').textContent = formatCurrency(breakdown.firstShowSurcharge);
    }
}

function setupPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('selected'));
            method.classList.add('selected');
            method.querySelector('input[type="radio"]').checked = true;
        });
    });
}

function setupTermsCheckbox() {
    const checkbox = document.getElementById('termsCheckbox');
    const confirmBtn = document.getElementById('confirmPaymentBtn');

    checkbox.addEventListener('change', () => {
        confirmBtn.disabled = !checkbox.checked;
    });
}

function setupConfirmButton() {
    const confirmBtn = document.getElementById('confirmPaymentBtn');
    
    confirmBtn.addEventListener('click', async () => {
        if (confirmBtn.disabled) return;

        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i data-lucide="loader"></i> Processing Payment...';
        lucide.createIcons();

        try {
            // Create booking
            const user = getCurrentUser();
            const sessionId = getSessionId();

            const bookingPayload = {
                userId: user.userId,
                showId: bookingData.showId,
                selectedSeats: bookingData.selectedSeats,
                seatCategory: bookingData.seatCategory,
                pricePerSeat: bookingData.pricePerSeat
            };

            const booking = await APIService.createBooking(bookingPayload, sessionId);
            
            // Clear checkout data
            sessionStorage.removeItem('checkoutData');
            
            // Show success message
            showToast('Payment successful! Redirecting to confirmation...', 'success');
            
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = `confirmation.html?bookingId=${booking.bookingId}`;
            }, 1500);

        } catch (error) {
            console.error('Error creating booking:', error);
            showError(error.message || 'Payment failed. Please try again.');
            
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i data-lucide="lock"></i> Confirm & Pay';
            lucide.createIcons();
        }
    });
}
