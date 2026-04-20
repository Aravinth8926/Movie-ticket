// Home Page Logic

let allMovies = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    await loadMovies();
    setupSearch();
    setupLogin();
});

async function loadMovies() {
    try {
        allMovies = await APIService.getAllMovies();
        
        // Separate now showing and coming soon
        const now = new Date();
        const nowShowing = allMovies.filter(movie => {
            const releaseDate = new Date(movie.releaseDate);
            return releaseDate <= now;
        });
        
        const comingSoon = allMovies.filter(movie => {
            const releaseDate = new Date(movie.releaseDate);
            return releaseDate > now;
        });

        renderMovies(nowShowing, 'nowShowingGrid');
        renderMovies(comingSoon, 'comingSoonGrid', true);
    } catch (error) {
        console.error('Error loading movies:', error);
        showError('Failed to load movies. Please try again.');
    }
}

function renderMovies(movies, containerId, isComingSoon = false) {
    const container = document.getElementById(containerId);
    
    if (movies.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No movies available</p>';
        return;
    }

    container.innerHTML = movies.map((movie, index) => `
        <div class="movie-card" onclick="goToMovieDetails('${movie.id}')" style="animation-delay: ${index * 0.1}s;">
            ${!isComingSoon ? '<div class="now-showing-badge">NOW SHOWING</div>' : ''}
            <div class="rating-badge">${movie.rating}</div>
            ${movie.userRating ? `<div class="user-rating-badge">⭐ ${movie.userRating}/10</div>` : ''}
            <img src="${movie.posterUrl || 'https://via.placeholder.com/250x350?text=' + encodeURIComponent(movie.title)}" 
                 alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span><i data-lucide="clock" style="width: 16px; height: 16px;"></i> ${movie.duration} min</span>
                    <span><i data-lucide="globe" style="width: 16px; height: 16px;"></i> ${movie.language}</span>
                </div>
                <div class="genre-tags">
                    ${movie.genre.slice(0, 3).map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
                <button class="book-btn" onclick="event.stopPropagation(); goToMovieDetails('${movie.id}')">
                    <i data-lucide="ticket"></i> Book Now
                </button>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function goToMovieDetails(movieId) {
    window.location.href = `movie-details.html?id=${movieId}`;
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query === '') {
                loadMovies();
                return;
            }

            const filtered = allMovies.filter(movie => 
                movie.title.toLowerCase().includes(query) ||
                movie.genre.some(g => g.toLowerCase().includes(query)) ||
                movie.language.toLowerCase().includes(query)
            );

            renderMovies(filtered, 'nowShowingGrid');
            document.getElementById('comingSoonGrid').innerHTML = '';
        }, 300);
    });
}

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
