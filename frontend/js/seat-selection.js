// Seat Selection Page Logic

let currentShow = null;
let seatLayout = [];
let selectedSeats = [];
let seatPrices = {};
let lockTimer = null;
let timeRemaining = 600; // 10 minutes in seconds
const sessionId = getSessionId();

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    
    const urlParams = new URLSearchParams(window.location.search);
    const showId = urlParams.get('showId');
    
    if (!showId) {
        showError('Show not found');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    await loadShowDetails(showId);
    await loadSeatLayout(showId);
    startCountdown();
});

async function loadShowDetails(showId) {
    try {
        console.log('Loading show details for:', showId);
        currentShow = await APIService.getShowById(showId);
        console.log('Loaded show:', currentShow);
        
        if (!currentShow) {
            throw new Error('Show not found');
        }
        
        renderShowInfo();
    } catch (error) {
        console.error('Error loading show:', error);
        console.error('Error details:', error.message, error.stack);
        
        // Show detailed error
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem;">
                <div class="sticky-note" style="max-width: 500px;">
                    <strong>Oops!</strong><br>
                    Failed to load show details<br>
                    <small>Error: ${error.message}</small><br>
                    <small>Make sure the backend is running on port 8080</small><br>
                    <button onclick="window.location.href='index.html'" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Go Back Home
                    </button>
                </div>
            </div>
        `;
    }
}

function renderShowInfo() {
    document.getElementById('showMovieTitle').textContent = currentShow.movie.title;
    document.getElementById('showTheater').textContent = currentShow.theater.name;
    document.getElementById('showDate').textContent = formatDate(currentShow.showDate);
    document.getElementById('showTime').textContent = currentShow.showTime;
    lucide.createIcons();
}

async function loadSeatLayout(showId) {
    try {
        const data = await APIService.getSeatAvailability(showId);
        seatLayout = data.seatLayout;
        
        // Build price map
        data.categories.forEach(cat => {
            cat.rows.forEach(row => {
                seatPrices[row] = { category: cat.name, price: cat.price };
            });
        });

        renderSeatMap();
    } catch (error) {
        console.error('Error loading seats:', error);
        showError('Failed to load seat layout');
    }
}

function renderSeatMap() {
    const seatMap = document.getElementById('seatMap');
    
    // Group seats by row
    const seatsByRow = {};
    seatLayout.forEach(seat => {
        if (!seatsByRow[seat.row]) {
            seatsByRow[seat.row] = [];
        }
        seatsByRow[seat.row].push(seat);
    });

    // Render rows with category labels
    seatMap.innerHTML = Object.keys(seatsByRow).sort().map(row => {
        const seats = seatsByRow[row].sort((a, b) => a.column - b.column);
        const category = seats[0].category;
        const price = seats[0].price;
        
        return `
            <div class="seat-row">
                <div class="row-label-container">
                    <div class="row-label">${row}</div>
                    <div class="row-category">${category}<br>₹${price}</div>
                </div>
                ${seats.map(seat => renderSeat(seat)).join('')}
            </div>
        `;
    }).join('');
}

function renderSeat(seat) {
    let seatClass = 'seat available';
    
    if (seat.status === 'BOOKED') {
        seatClass = 'seat booked';
    } else if (seat.status === 'LOCKED') {
        seatClass = 'seat booked'; // Show locked seats as booked to other users
    } else if (selectedSeats.includes(seat.seatNumber)) {
        seatClass = 'seat selected';
    }

    const onclick = seat.status === 'AVAILABLE' ? `toggleSeat('${seat.seatNumber}', '${seat.category}', ${seat.price})` : '';

    return `
        <div class="${seatClass}" 
             onclick="${onclick}"
             data-seat="${seat.seatNumber}"
             title="${seat.seatNumber} - ${seat.category} - ₹${seat.price}">
            ${seat.column}
        </div>
    `;
}

async function toggleSeat(seatNumber, category, price) {
    const index = selectedSeats.indexOf(seatNumber);
    
    if (index > -1) {
        // Deselect
        selectedSeats.splice(index, 1);
    } else {
        // Select
        selectedSeats.push(seatNumber);
    }

    // Re-render seat map
    renderSeatMap();
    updateBookingSummary(category, price);

    // Lock seats if any selected
    if (selectedSeats.length > 0) {
        try {
            await APIService.lockSeats(currentShow.id, selectedSeats, sessionId);
            resetCountdown();
        } catch (error) {
            console.error('Error locking seats:', error);
            showError(error.message);
            // Remove the seat from selection
            selectedSeats.splice(selectedSeats.indexOf(seatNumber), 1);
            renderSeatMap();
            updateBookingSummary(category, price);
        }
    }
}

function updateBookingSummary(category, pricePerSeat) {
    const summaryList = document.getElementById('selectedSeatsList');
    const priceBreakdown = document.getElementById('priceBreakdown');
    const proceedBtn = document.getElementById('proceedBtn');

    if (selectedSeats.length === 0) {
        summaryList.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">No seats selected</p>';
        priceBreakdown.style.display = 'none';
        proceedBtn.disabled = true;
        return;
    }

    // Render selected seats
    summaryList.innerHTML = selectedSeats.map(seat => {
        const seatInfo = seatLayout.find(s => s.seatNumber === seat);
        return `
            <div class="seat-item">
                <span><strong>${seat}</strong> (${seatInfo.category})</span>
                <span>₹${seatInfo.price}</span>
            </div>
        `;
    }).join('');

    // Calculate price
    const breakdown = calculatePrice();
    
    document.getElementById('basePrice').textContent = formatCurrency(breakdown.basePrice);
    document.getElementById('weekendSurcharge').textContent = formatCurrency(breakdown.weekendSurcharge);
    document.getElementById('firstShowSurcharge').textContent = formatCurrency(breakdown.firstShowSurcharge);
    document.getElementById('gst').textContent = formatCurrency(breakdown.gst);
    document.getElementById('totalPrice').textContent = formatCurrency(breakdown.total);

    // Show/hide surcharge rows
    document.getElementById('weekendSurchargeRow').style.display = 
        breakdown.weekendSurcharge > 0 ? 'flex' : 'none';
    document.getElementById('firstShowSurchargeRow').style.display = 
        breakdown.firstShowSurcharge > 0 ? 'flex' : 'none';

    priceBreakdown.style.display = 'block';
    proceedBtn.disabled = false;

    lucide.createIcons();
}

function calculatePrice() {
    let basePrice = 0;
    let category = '';

    selectedSeats.forEach(seatNumber => {
        const seat = seatLayout.find(s => s.seatNumber === seatNumber);
        if (seat) {
            basePrice += seat.price;
            category = seat.category;
        }
    });

    // Weekend surcharge
    const showDate = new Date(currentShow.showDate);
    const dayOfWeek = showDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6; // Sun, Fri, Sat
    const weekendSurcharge = isWeekend ? basePrice * 0.20 : 0;

    // First show surcharge
    const showTime = currentShow.showTime;
    const hour = parseInt(showTime.split(':')[0]);
    const isFirstShow = hour < 12;
    const firstShowSurcharge = isFirstShow ? basePrice * 0.30 : 0;

    const subtotal = basePrice + weekendSurcharge + firstShowSurcharge;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return {
        basePrice,
        weekendSurcharge,
        firstShowSurcharge,
        subtotal,
        gst,
        total,
        category
    };
}

function startCountdown() {
    updateTimerDisplay();
    lockTimer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            clearInterval(lockTimer);
            handleTimeout();
        }
    }, 1000);
}

function resetCountdown() {
    timeRemaining = 600; // Reset to 10 minutes
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;

    // Change color when time is running out
    const timer = document.getElementById('countdownTimer');
    if (timeRemaining < 60) {
        timer.style.background = 'var(--primary)';
    } else if (timeRemaining < 180) {
        timer.style.background = 'var(--warning)';
    }
}

function handleTimeout() {
    showError('Your seat hold has expired. Please select seats again.');
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// Proceed to payment
document.getElementById('proceedBtn')?.addEventListener('click', async () => {
    if (selectedSeats.length === 0) return;

    const breakdown = calculatePrice();
    
    // Get first seat's category
    const firstSeat = seatLayout.find(s => s.seatNumber === selectedSeats[0]);

    // Prepare checkout data
    const checkoutData = {
        showId: currentShow.id,
        selectedSeats: selectedSeats,
        seatCategory: firstSeat.category,
        pricePerSeat: firstSeat.price,
        priceBreakdown: breakdown
    };

    // Store in sessionStorage
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

    // Clear timer
    clearInterval(lockTimer);

    // Redirect to checkout page
    window.location.href = 'checkout.html';
});

// Cleanup on page unload
window.addEventListener('beforeunload', async () => {
    if (selectedSeats.length > 0) {
        try {
            await APIService.unlockSeats(currentShow.id, sessionId);
        } catch (error) {
            console.error('Error unlocking seats:', error);
        }
    }
});
