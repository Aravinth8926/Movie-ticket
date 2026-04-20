// Authentication Management

const Auth = {
  
  TOKEN_KEY: 'cinebook_token',
  USER_KEY: 'cinebook_user',
  REFRESH_KEY: 'cinebook_refresh',
  
  // Save auth data
  saveAuth(authResponse) {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_KEY, authResponse.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify({
      userId: authResponse.userId,
      fullName: authResponse.fullName,
      email: authResponse.email,
      role: authResponse.role,
      avatarColor: authResponse.avatarColor,
      initials: this.getInitials(authResponse.fullName)
    }));
  },
  
  // Get current user
  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  
  // Get token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  },
  
  // Check if logged in
  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
  
  // Logout
  async logout() {
    const token = this.getToken();
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    window.location.href = 'login.html';
  },
  
  // Refresh token
  async refreshIfNeeded() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const timeLeft = payload.exp * 1000 - Date.now();
      // Refresh if less than 30 minutes left
      if (timeLeft < 30 * 60 * 1000) {
        const refresh = localStorage.getItem(this.REFRESH_KEY);
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: refresh })
        });
        if (res.ok) {
          const data = await res.json();
          this.saveAuth(data);
          return true;
        }
      }
    } catch (e) {
      console.error('Refresh error:', e);
    }
    return false;
  },
  
  // Require auth (redirect to login if not)
  requireAuth() {
    if (!this.isLoggedIn()) {
      sessionStorage.setItem('redirect_after_login', window.location.href);
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },
  
  // Redirect if already logged in
  redirectIfLoggedIn() {
    if (this.isLoggedIn()) {
      window.location.href = 'index.html';
    }
  },
  
  // Get initials from name
  getInitials(fullName) {
    return fullName
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  },
  
  // Authenticated fetch wrapper
  async authFetch(url, options = {}) {
    await this.refreshIfNeeded();
    const token = this.getToken();
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
  }
};
