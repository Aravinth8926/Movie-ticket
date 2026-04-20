// Login Page Logic

document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  Auth.redirectIfLoggedIn();
  
  lucide.createIcons();
  
  // Toggle password visibility
  const togglePass = document.getElementById('toggleLoginPass');
  const passwordInput = document.getElementById('loginPassword');
  
  togglePass.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePass.innerHTML = type === 'password' 
      ? '<i data-lucide="eye"></i>' 
      : '<i data-lucide="eye-off"></i>';
    lucide.createIcons();
  });
  
  // Form submission
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Clear previous errors
  hideError();
  clearFieldErrors();
  
  // Validate
  if (!validateEmail(email)) {
    showFieldError('emailError', 'Please enter a valid email');
    return;
  }
  
  if (!password) {
    showFieldError('passwordError', 'Password is required');
    return;
  }
  
  // Show loader
  showLoader();
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        showError('Invalid email or password');
      } else if (response.status === 403) {
        showError('Account deactivated. Please contact support');
      } else {
        showError(data.message || 'Login failed. Please try again');
      }
      return;
    }
    
    // Save auth data
    Auth.saveAuth(data);
    
    // Show success toast
    showToast('Welcome back!', 'success');
    
    // Redirect
    const redirectUrl = sessionStorage.getItem('redirect_after_login') || 'index.html';
    sessionStorage.removeItem('redirect_after_login');
    
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 500);
    
  } catch (error) {
    console.error('Login error:', error);
    showError('Network error. Please check your connection');
  } finally {
    hideLoader();
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showFieldError(fieldId, message) {
  const errorEl = document.getElementById(fieldId);
  errorEl.textContent = message;
  
  const inputId = fieldId.replace('Error', '');
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.add('invalid');
  }
}

function clearFieldErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-input').forEach(el => {
    el.classList.remove('invalid', 'valid');
  });
}

function showError(message) {
  const errorBox = document.getElementById('loginError');
  const errorText = document.getElementById('loginErrorText');
  errorText.textContent = message;
  errorBox.classList.add('show');
}

function hideError() {
  const errorBox = document.getElementById('loginError');
  errorBox.classList.remove('show');
}

function showLoader() {
  const btn = document.getElementById('loginBtn');
  const loader = document.getElementById('loginLoader');
  const btnText = btn.querySelector('.btn-text');
  const btnArrow = btn.querySelector('.btn-arrow');
  
  btn.disabled = true;
  loader.classList.add('active');
  btnText.style.display = 'none';
  btnArrow.style.display = 'none';
}

function hideLoader() {
  const btn = document.getElementById('loginBtn');
  const loader = document.getElementById('loginLoader');
  const btnText = btn.querySelector('.btn-text');
  const btnArrow = btn.querySelector('.btn-arrow');
  
  btn.disabled = false;
  loader.classList.remove('active');
  btnText.style.display = 'inline';
  btnArrow.style.display = 'inline';
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
