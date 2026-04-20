// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Endpoints
const API_ENDPOINTS = {
    movies: `${API_BASE_URL}/movies`,
    shows: `${API_BASE_URL}/shows`,
    bookings: `${API_BASE_URL}/bookings`,
    users: `${API_BASE_URL}/users`,
    seats: {
        lock: `${API_BASE_URL}/bookings/seats/lock`,
        unlock: `${API_BASE_URL}/bookings/seats/unlock`
    }
};

// Session Management
const SESSION_KEY = 'cinebook_session';
const USER_KEY = 'cinebook_user';

function getSessionId() {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = 'SESSION-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
}

function getCurrentUser() {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
        return JSON.parse(userStr);
    }
    // Create a default user for demo
    const defaultUser = {
        userId: 'USER-' + Date.now(),
        name: 'Guest User',
        email: 'guest@cinebook.com',
        phone: '9876543210'
    };
    localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
}

// Utility Functions
function formatDate(date) {
    const d = new Date(date);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
}

function formatTime(time) {
    return time;
}

function formatCurrency(amount) {
    return '₹' + amount.toFixed(2);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i data-lucide="${type === 'success' ? 'check-circle' : 'x-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'sticky-note';
    errorDiv.innerHTML = `
        <strong>Oops!</strong><br>
        ${message}
    `;
    document.body.appendChild(errorDiv);
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '50%';
    errorDiv.style.left = '50%';
    errorDiv.style.transform = 'translate(-50%, -50%)';
    errorDiv.style.zIndex = '10000';

    setTimeout(() => errorDiv.remove(), 4000);
}

// Add CSS for slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        to {
            transform: translateX(400px) rotate(-1deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
