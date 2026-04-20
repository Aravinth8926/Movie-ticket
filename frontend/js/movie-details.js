// Movie Details Page Logic

let currentMovie = null;
let movieShows = [];
let selectedDate = null;

document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    setupLogin(); // Initialize login
    
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        showError('Movie not found');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    await loadMovieDetails(movieId);
    await loadShows(movieId);
    setupDateSelector();
});

function setupLogin() {
    const loginBtn = document.getElementById('loginBtn');
    const user = getCurrentUser();
    
    if (user && user.name !== 'Guest User') {
        loginBtn.textContent = user.name;
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showUserMenu();
        });
    } else {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginModal();
        });
    }
}

function showLoginModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <h2 style="margin-bottom: 1.5rem; color: var(--primary);">Login to CineBook</h2>
            <form id="loginForm">
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Name</label>
                    <input type="text" id="userName" required style="width: 100%; padding: 0.8rem; border: 2px solid var(--text-secondary); border-radius: 8px; font-size: 1rem;">
                </div>
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Email</label>
                    <input type="email" id="userEmail" required style="width: 100%; padding: 0.8rem; border: 2px solid var(--text-secondary); border-radius: 8px; font-size: 1rem;">
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Phone</label>
                    <input type="tel" id="userPhone" required style="width: 100%; padding: 0.8rem; border: 2px solid var(--text-secondary); border-radius: 8px; font-size: 1rem;">
                </div>
                <div style="display: flex; gap: 1rem;">
                    <button type="submit" style="flex: 1; padding: 0.8rem; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                        Login
                    </button>
                    <button type="button" onclick="this.closest('[style*=fixed]').remove()" style="flex: 1; padding: 0.8rem; background: var(--text-secondary); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const phone = document.getElementById('userPhone').value;
        
        const user = {
            userId: 'USER-' + Date.now(),
            name: name,
            email: email,
            phone: phone
        };
        
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        showToast(`Welcome, ${name}!`, 'success');
        modal.remove();
        
        // Update login button
        document.getElementById('loginBtn').textContent = name;
        setupLogin();
    });
}

function showUserMenu() {
    const user = getCurrentUser();
    const menu = document.createElement('div');
    menu.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    menu.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
            <h2 style="margin-bottom: 1.5rem; color: var(--primary);">Account</h2>
            <div style="margin-bottom: 1rem;">
                <strong>Name:</strong> ${user.name}
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Email:</strong> ${user.email}
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>Phone:</strong> ${user.phone}
            </div>
            <div style="display: flex; gap: 1rem;">
                <button onclick="window.location.href='history.html'" style="flex: 1; padding: 0.8rem; background: var(--primary); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                    My Bookings
                </button>
                <button onclick="logoutUser()" style="flex: 1; padding: 0.8rem; background: var(--text-secondary); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                    Logout
                </button>
            </div>
            <button onclick="this.closest('[style*=fixed]').remove()" style="width: 100%; margin-top: 1rem; padding: 0.8rem; background: white; color: var(--text-primary); border: 2px solid var(--text-secondary); border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    document.body.appendChild(menu);
}

function logoutUser() {
    const defaultUser = {
        userId: 'USER-' + Date.now(),
        name: 'Guest User',
        email: 'guest@cinebook.com',
        phone: '9876543210'
    };
    localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
    showToast('Logged out successfully', 'success');
    window.location.reload();
}

async function loadMovieDetails(movieId) {
    try {
        currentMovie = await APIService.getMovieById(movieId);
        renderMovieDetails();
    } catch (error) {
        console.error('Error loading movie:', error);
        showError('Failed to load movie details');
    }
}

function renderMovieDetails() {
    // Set banner background
    const banner = document.getElementById('movieBanner');
    banner.style.backgroundImage = `url(${currentMovie.posterUrl || 'https://via.placeholder.com/1200x400'})`;

    // Set poster
    document.getElementById('bannerPoster').src = currentMovie.posterUrl || 'https://via.placeholder.com/250x350';

    // Set title
    document.getElementById('movieTitle').textContent = currentMovie.title;

    // Set meta
    const metaHtml = `
        <div class="meta-item">
            <i data-lucide="star"></i>
            <span>${currentMovie.rating}</span>
        </div>
        <div class="meta-item">
            <i data-lucide="clock"></i>
            <span>${currentMovie.duration} min</span>
        </div>
        <div class="meta-item">
            <i data-lucide="globe"></i>
            <span>${currentMovie.language}</span>
        </div>
        <div class="meta-item">
            <i data-lucide="calendar"></i>
            <span>${formatDate(currentMovie.releaseDate)}</span>
        </div>
    `;
    document.getElementById('movieMeta').innerHTML = metaHtml;

    // Set description
    document.getElementById('movieDescription').textContent = currentMovie.description;

    // Set director
    document.getElementById('directorName').textContent = currentMovie.director;

    // Render cast
    const castGrid = document.getElementById('castGrid');
    castGrid.innerHTML = currentMovie.cast.map(actor => `
        <div class="cast-member">
            <div class="cast-avatar">${actor.charAt(0)}</div>
            <div style="font-weight: 600;">${actor}</div>
        </div>
    `).join('');

    lucide.createIcons();
}

async function loadShows(movieId) {
    try {
        console.log('Loading shows for movie:', movieId);
        movieShows = await APIService.getShowsByMovie(movieId);
        console.log('Loaded shows:', movieShows);
        
        if (!movieShows || movieShows.length === 0) {
            document.getElementById('theaterShowsContainer').innerHTML = 
                '<p style="text-align: center; color: var(--text-secondary);">No shows available for this movie</p>';
            return;
        }

        // Group shows by date
        const showsByDate = {};
        movieShows.forEach(show => {
            const dateKey = new Date(show.showDate).toDateString();
            if (!showsByDate[dateKey]) {
                showsByDate[dateKey] = [];
            }
            showsByDate[dateKey].push(show);
        });

        // Render date selector
        renderDateSelector(Object.keys(showsByDate));
        
        // Select first date by default
        if (Object.keys(showsByDate).length > 0) {
            selectedDate = Object.keys(showsByDate)[0];
            renderShows(showsByDate[selectedDate]);
        }
    } catch (error) {
        console.error('Error loading shows:', error);
        console.error('Error details:', error.message, error.stack);
        document.getElementById('theaterShowsContainer').innerHTML = 
            `<div class="sticky-note" style="margin: 2rem auto; max-width: 400px;">
                <strong>Oops!</strong><br>
                Failed to load show timings<br>
                <small>Error: ${error.message}</small><br>
                <small>Make sure the backend is running on port 8080</small>
            </div>`;
    }
}

function renderDateSelector(dates) {
    const container = document.getElementById('dateSelector');
    container.innerHTML = dates.map((dateStr, index) => {
        const date = new Date(dateStr);
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        
        return `
            <div class="date-card ${index === 0 ? 'active' : ''}" onclick="selectDate('${dateStr}')">
                <div class="date-day">${dayNames[date.getDay()]}</div>
                <div class="date-date">${date.getDate()}</div>
                <div style="font-size: 0.8rem;">${date.toLocaleString('default', { month: 'short' })}</div>
            </div>
        `;
    }).join('');
}

function selectDate(dateStr) {
    selectedDate = dateStr;
    
    // Update active state
    document.querySelectorAll('.date-card').forEach(card => {
        card.classList.remove('active');
    });
    event.target.closest('.date-card').classList.add('active');

    // Filter and render shows for selected date
    const filteredShows = movieShows.filter(show => 
        new Date(show.showDate).toDateString() === dateStr
    );
    renderShows(filteredShows);
}

function renderShows(shows) {
    // Group by theater
    const showsByTheater = {};
    shows.forEach(show => {
        const theaterId = show.theater.id;
        if (!showsByTheater[theaterId]) {
            showsByTheater[theaterId] = {
                theater: show.theater,
                shows: []
            };
        }
        showsByTheater[theaterId].shows.push(show);
    });

    const container = document.getElementById('theaterShowsContainer');
    container.innerHTML = Object.values(showsByTheater).map(data => `
        <div class="theater-shows">
            <div class="theater-header">
                <div>
                    <div class="theater-name">${data.theater.name}</div>
                    <div class="theater-location">
                        <i data-lucide="map-pin"></i>
                        <span>${data.theater.location}</span>
                    </div>
                </div>
            </div>
            <div class="time-slots">
                ${data.shows.map(show => renderTimeSlot(show)).join('')}
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function renderTimeSlot(show) {
    const availableSeats = show.availableSeats;
    const totalSeats = show.theater.totalSeats;
    const availabilityPercent = (availableSeats / totalSeats) * 100;

    let statusClass = 'available';
    let statusText = 'Available';

    if (show.status === 'HOUSEFULL' || availableSeats === 0) {
        statusClass = 'housefull';
        statusText = 'HOUSEFULL';
    } else if (availabilityPercent < 30) {
        statusClass = 'filling-fast';
        statusText = 'Filling Fast';
    }

    return `
        <div class="time-slot ${statusClass}" 
             onclick="${statusClass !== 'housefull' ? `goToSeatSelection('${show.id}')` : 'return false;'}">
            ${show.showTime}
            ${statusClass !== 'housefull' ? `<span class="availability-badge">${availableSeats}</span>` : ''}
        </div>
    `;
}

function goToSeatSelection(showId) {
    window.location.href = `seat-selection-new.html?showId=${showId}`;
}

function setupDateSelector() {
    // Already handled in renderDateSelector
}
