// BookMyShow-Style Seat Selection Logic

let currentShow = null;
let seatLayout = [];
let selectedSeats = [];
let lockTimer = null;
let timeRemaining = 600; // 10 minutes in seconds
const sessionId = getSessionId();

// Theater layout configuration
const THEATER_CONFIG = {
    categories: [
        { name: 'PLATINUM', rows: ['A', 'B'], price: 400, color: 'platinum' },
        { name: 'GOLD', rows: ['C', 'D', 'E', 'F'], price: 250, color: 'gold' },
        { name: 'SILVER', rows: ['G', 'H', 'I', 'J', 'K'], price: 150, color: 'silver' }
    ],
    seatsPerRow: 15
};

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    
    const urlParams = new URLSearchParams(window.location.search);
    const showId = urlParams.get('showId');
    
    if (!showId) {
        showToast('Show not found', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    await loadShowDetails(showId);
    await loadSeatLayout(showId);
    setupCategoryJumpBar();
    startCountdown();
});

async function loadShowDetails(showId) {
    try {
        currentShow = await APIService.getShowById(showId);
        
        if (!currentShow) {
            throw new Error('Show not found');
        }
        
        renderShowInfo();
    } catch (error) {
        console.error('Error loading show:', error);
        showToast('Failed to load show details', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
    }
}

function renderShowInfo() {
    document.getElementById('navMovieTitle').textContent = currentShow.movie.title;
    document.getElementById('navTheater').textContent = currentShow.theater.name;
    document.getElementById('navDate').textContent = formatDate(currentShow.showDate);
    document.getElementById('navTime').textContent = currentShow.showTime;
    lucide.createIcons();
}

async function loadSeatLayout(showId) {
    try {
        const data = await APIService.getSeatAvailability(showId);
        seatLayout = data.seatLayout;
        generateSeatMap();
    } catch (error) {
        console.error('Error loading seats:', error);
        showToast('Failed to load seat layout', 'error');
    }
}

function generateSeatMap() {
    const seatMapArea = document.getElementById('seatMapArea');
    
    // Group seats by category
    const seatsByCategory = {};
    THEATER_CONFIG.categories.forEach(cat => {
        seatsByCategory[cat.name] = {
            ...cat,
            rows: {}
        };
        
        cat.rows.forEach(row => {
            seatsByCategory[cat.name].rows[row] = [];
        });
    });

    // Organize seats
    seatLayout.forEach(seat => {
        const category = THEATER_CONFIG.categories.find(c => c.rows.includes(seat.row));
        if (category && seatsByCategory[category.name].rows[seat.row]) {
            seatsByCategory[category.name].rows[seat.row].push(seat);
        }
    });

    // Render categories
    seatMapArea.innerHTML = THEATER_CONFIG.categories.map(cat => {
        const categoryData = seatsByCategory[cat.name];
        const rowsHTML = Object.keys(categoryData.rows).sort().map(rowLetter => {
            const seats = categoryData.rows[rowLetter].sort((a, b) => a.column - b.column);
            return `
                <div class="seat-row">
                    <div class="row-label">${rowLetter}</div>
                    <div class="seats-row-container">
                        ${seats.map(seat => generateSeatSVG(seat)).join('')}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="category-section ${cat.color}" id="category-${cat.name.toLowerCase()}">
                <div class="category-header ${cat.color}">
                    <span class="category-name">${cat.name}</span>
                    <span class="category-price">₹ ${cat.price}</span>
                </div>
                <div class="seats-grid">
                    ${rowsHTML}
                </div>
            </div>
        `;
    }).join('');
}

function generateSeatSVG(seat) {
    let seatClass = 'seat available';
    let clickable = true;
    
    if (seat.status === 'BOOKED' || seat.status === 'LOCKED') {
        seatClass = 'seat sold';
        clickable = false;
    } else if (selectedSeats.includes(seat.seatNumber)) {
        seatClass = 'seat selected';
    }

    const onclick = clickable ? `handleSeatClick('${seat.seatNumber}', '${seat.category}', ${seat.price})` : '';
    const onmouseover = clickable ? `showSeatTooltip(event, '${seat.seatNumber}', ${seat.price})` : '';
    const onmouseout = clickable ? `hideSeatTooltip()` : '';

    // Cinema seat SVG with armrests and backrest
    return `
        <svg class="${seatClass}" 
             onclick="${onclick}"
             onmouseover="${onmouseover}"
             onmouseout="${onmouseout}"
             data-seat="${seat.seatNumber}"
             viewBox="0 0 24 24" 
             xmlns="http://www.w3.org/2000/svg">
            <!-- Backrest -->
            <path d="M4 4 C4 2, 6 2, 6 4 L6 14 C6 15, 5 16, 4 16 Z" />
            <path d="M20 4 C20 2, 18 2, 18 4 L18 14 C18 15, 19 16, 20 16 Z" />
            <!-- Seat base -->
            <rect x="6" y="10" width="12" height="8" rx="2" />
            <!-- Armrests -->
            <rect x="4" y="12" width="2" height="6" rx="1" />
            <rect x="18" y="12" width="2" height="6" rx="1" />
        </svg>
    `;
}

function handleSeatClick(seatNumber, category, price) {
    const index = selectedSeats.indexOf(seatNumber);
    
    if (index > -1) {
        // Deselect
        selectedSeats.splice(index, 1);
        removeSeatPill(seatNumber);
        showToast(`Seat ${seatNumber} removed`, 'warning');
    } else {
        // Check max seats limit
        if (selectedSeats.length >= 10) {
            showToast('Maximum 10 seats can be selected', 'error');
            return;
        }
        
        // Select
        selectedSeats.push(seatNumber);
        addSeatPill(seatNumber, price);
        showToast(`Seat ${seatNumber} selected`, 'success');
    }

    // Update UI
    updateSeatVisuals();
    updateBottomBar();

    // Lock seats if any selected
    if (selectedSeats.length > 0) {
        lockSeatsOnServer();
    }
}

function updateSeatVisuals() {
    // Update all seat SVGs
    document.querySelectorAll('.seat').forEach(seatEl => {
        const seatNumber = seatEl.getAttribute('data-seat');
        const seat = seatLayout.find(s => s.seatNumber === seatNumber);
        
        if (!seat) return;
        
        seatEl.classList.remove('available', 'selected', 'sold');
        
        if (seat.status === 'BOOKED' || seat.status === 'LOCKED') {
            seatEl.classList.add('sold');
        } else if (selectedSeats.includes(seatNumber)) {
            seatEl.classList.add('selected');
        } else {
            seatEl.classList.add('available');
        }
    });
}

function updateBottomBar() {
    const bottomBar = document.getElementById('bottomBar');
    const selectedSeatsDisplay = document.getElementById('selectedSeatsDisplay');
    const totalAmount = document.getElementById('totalAmount');
    const payBtn = document.getElementById('payBtn');

    if (selectedSeats.length === 0) {
        selectedSeatsDisplay.innerHTML = `
            <span class="select-prompt">
                <i data-lucide="mouse-pointer-2"></i>
                Select seats to continue
            </span>
        `;
        totalAmount.textContent = '₹ 0';
        payBtn.disabled = true;
    } else {
        const total = calculateTotalPrice();
        selectedSeatsDisplay.innerHTML = `
            <span style="color: var(--text-secondary); font-size: 0.875rem;">
                ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''} selected
            </span>
        `;
        totalAmount.textContent = `₹ ${total.toFixed(0)}`;
        payBtn.disabled = false;
    }

    lucide.createIcons();
}

function calculateTotalPrice() {
    let basePrice = 0;

    selectedSeats.forEach(seatNumber => {
        const seat = seatLayout.find(s => s.seatNumber === seatNumber);
        if (seat) {
            basePrice += seat.price;
        }
    });

    // Weekend surcharge
    const showDate = new Date(currentShow.showDate);
    const dayOfWeek = showDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const weekendSurcharge = isWeekend ? basePrice * 0.20 : 0;

    // First show surcharge
    const showTime = currentShow.showTime;
    const hour = parseInt(showTime.split(':')[0]);
    const isFirstShow = hour < 12;
    const firstShowSurcharge = isFirstShow ? basePrice * 0.30 : 0;

    const subtotal = basePrice + weekendSurcharge + firstShowSurcharge;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;

    return total;
}

async function lockSeatsOnServer() {
    try {
        await APIService.lockSeats(currentShow.id, selectedSeats, sessionId);
        resetCountdown();
    } catch (error) {
        console.error('Error locking seats:', error);
        showToast(error.message || 'Failed to lock seats', 'error');
    }
}

// SEAT PILLS
function addSeatPill(seatNumber, price) {
    const pillTray = document.getElementById('seatsPillTray');
    pillTray.classList.add('visible');
    
    const pill = document.createElement('div');
    pill.className = 'seat-pill';
    pill.id = `pill-${seatNumber}`;
    pill.innerHTML = `
        <span>${seatNumber}</span>
        <span style="color: var(--gold);">₹${price}</span>
        <button class="pill-remove" onclick="handleSeatClick('${seatNumber}')">
            <i data-lucide="x" style="width: 14px; height: 14px;"></i>
        </button>
    `;
    
    pillTray.appendChild(pill);
    lucide.createIcons();
}

function removeSeatPill(seatNumber) {
    const pill = document.getElementById(`pill-${seatNumber}`);
    if (pill) {
        pill.remove();
    }
    
    const pillTray = document.getElementById('seatsPillTray');
    if (pillTray.children.length === 0) {
        pillTray.classList.remove('visible');
    }
}

// SEAT TOOLTIP
function showSeatTooltip(event, seatNumber, price) {
    const tooltip = document.getElementById('seatTooltip');
    tooltip.querySelector('.tooltip-seat-id').textContent = seatNumber;
    tooltip.querySelector('.tooltip-price').textContent = `₹${price}`;
    tooltip.classList.add('visible');
    
    // Position tooltip
    const x = event.clientX + 10;
    const y = event.clientY - 40;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
}

function hideSeatTooltip() {
    const tooltip = document.getElementById('seatTooltip');
    tooltip.classList.remove('visible');
}

// COUNTDOWN TIMER
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
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timer = document.getElementById('countdownTimer');
    timer.textContent = display;

    // Change to urgent state when under 3 minutes
    if (timeRemaining < 180) {
        timer.classList.add('urgent');
    } else {
        timer.classList.remove('urgent');
    }
}

function handleTimeout() {
    showToast('Your seat hold has expired. Please select seats again.', 'error');
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

// CATEGORY JUMP BAR
function setupCategoryJumpBar() {
    const jumpButtons = document.querySelectorAll('.jump-btn');
    
    jumpButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            const section = document.getElementById(`category-${target}`);
            
            if (section) {
                // Scroll to section with offset for fixed navbar
                const offset = 150;
                const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: sectionTop, behavior: 'smooth' });
            }
        });
    });

    // Intersection Observer for active state
    const observerOptions = {
        root: null,
        rootMargin: '-150px 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const categoryName = entry.target.id.replace('category-', '');
                
                jumpButtons.forEach(btn => {
                    if (btn.getAttribute('data-target') === categoryName) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe all category sections
    document.querySelectorAll('.category-section').forEach(section => {
        observer.observe(section);
    });
}

// TOAST NOTIFICATIONS
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'check-circle';
    if (type === 'error') icon = 'x-circle';
    if (type === 'warning') icon = 'alert-circle';
    
    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.animation = 'toastSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// PAY NOW BUTTON
document.getElementById('payBtn').addEventListener('click', async () => {
    if (selectedSeats.length === 0) return;

    // Get first seat's category and price
    const firstSeat = seatLayout.find(s => s.seatNumber === selectedSeats[0]);
    const total = calculateTotalPrice();

    // Calculate breakdown
    let basePrice = 0;
    selectedSeats.forEach(seatNumber => {
        const seat = seatLayout.find(s => s.seatNumber === seatNumber);
        if (seat) basePrice += seat.price;
    });

    const showDate = new Date(currentShow.showDate);
    const isWeekend = showDate.getDay() === 0 || showDate.getDay() === 5 || showDate.getDay() === 6;
    const weekendSurcharge = isWeekend ? basePrice * 0.20 : 0;

    const hour = parseInt(currentShow.showTime.split(':')[0]);
    const firstShowSurcharge = hour < 12 ? basePrice * 0.30 : 0;

    const subtotal = basePrice + weekendSurcharge + firstShowSurcharge;
    const gst = subtotal * 0.18;

    const priceBreakdown = {
        basePrice,
        weekendSurcharge,
        firstShowSurcharge,
        subtotal,
        gst,
        total
    };

    // Prepare checkout data
    const checkoutData = {
        showId: currentShow.id,
        selectedSeats: selectedSeats,
        seatCategory: firstSeat.category,
        pricePerSeat: firstSeat.price,
        priceBreakdown: priceBreakdown
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
