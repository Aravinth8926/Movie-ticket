// Register Page Logic

document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  Auth.redirectIfLoggedIn();
  
  lucide.createIcons();
  
  // Toggle password visibility
  setupPasswordToggles();
  
  // Password strength meter
  const passwordInput = document.getElementById('password');
  passwordInput.addEventListener('input', checkPasswordStrength);
  
  // Confirm password match
  const confirmPasswordInput = document.getElementById('confirmPassword');
  confirmPasswordInput.addEventListener('input', checkPasswordMatch);
  
  // Form submission
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', handleRegister);
});

function setupPasswordToggles() {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.innerHTML = type === 'password' 
      ? '<i data-lucide="eye"></i>' 
      : '<i data-lucide="eye-off"></i>';
    lucide.createIcons();
  });
  
  const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  toggleConfirmPassword.addEventListener('click', () => {
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    toggleConfirmPassword.innerHTML = type === 'password' 
      ? '<i data-lucide="eye"></i>' 
      : '<i data-lucide="eye-off"></i>';
    lucide.createIcons();
  });
}

function checkPasswordStrength() {
  const password = document.getElementById('password').value;
  const strengthFill = document.getElementById('strengthFill');
  const strengthText = document.getElementById('strengthText');
  
  if (!password) {
    strengthFill.className = 'strength-fill';
    strengthText.textContent = '';
    return;
  }
  
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const strengths = ['', 'weak', 'fair', 'good', 'strong'];
  const labels = ['', 'Weak password', 'Fair password', 'Good password', 'Strong password'];
  
  const strength = strengths[score];
  strengthFill.className = `strength-fill ${strength}`;
  strengthText.className = `strength-text ${strength}`;
  strengthText.textContent = labels[score];
}

function checkPasswordMatch() {
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errorEl = document.getElementById('confirmPasswordError');
  const input = document.getElementById('confirmPassword');
  
  if (!confirmPassword) {
    errorEl.textContent = '';
    input.classList.remove('invalid', 'valid');
    return;
  }
  
  if (password !== confirmPassword) {
    errorEl.textContent = 'Passwords do not match';
    input.classList.add('invalid');
    input.classList.remove('valid');
  } else {
    errorEl.textContent = '';
    input.classList.remove('invalid');
    input.classList.add('valid');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const agreeTerms = document.getElementById('agreeTerms').checked;
  
  // Clear previous errors
  hideError();
  clearFieldErrors();
  
  // Validate
  if (!fullName || fullName.length < 2) {
    showFieldError('nameError', 'Please enter your full name');
    return;
  }
  
  if (!validateEmail(email)) {
    showFieldError('emailError', 'Please enter a valid email');
    return;
  }
  
  if (!phone || phone.length < 10) {
    showFieldError('phoneError', 'Please enter a valid phone number');
    return;
  }
  
  if (password.length < 8) {
    showFieldError('passwordError', 'Password must be at least 8 characters');
    return;
  }
  
  if (!/[A-Z]/.test(password)) {
    showFieldError('passwordError', 'Password must contain at least one uppercase letter');
    return;
  }
  
  if (!/[0-9]/.test(password)) {
    showFieldError('passwordError', 'Password must contain at least one number');
    return;
  }
  
  if (password !== confirmPassword) {
    showFieldError('confirmPasswordError', 'Passwords do not match');
    return;
  }
  
  if (!agreeTerms) {
    showError('Please agree to the Terms & Conditions');
    return;
  }
  
  // Show loader
  showLoader();
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        password,
        confirmPassword
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 409) {
        showError('Email already registered. Please sign in instead');
      } else {
        showError(data.message || 'Registration failed. Please try again');
      }
      return;
    }
    
    // Save auth data and redirect
    Auth.saveAuth(data);
    
    // Show success toast
    showToast('Account created successfully!', 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 500);
    
  } catch (error) {
    console.error('Register error:', error);
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
  const errorBox = document.getElementById('registerError');
  const errorText = document.getElementById('registerErrorText');
  errorText.textContent = message;
  errorBox.classList.add('show');
}

function hideError() {
  const errorBox = document.getElementById('registerError');
  errorBox.classList.remove('show');
}

function showLoader() {
  const btn = document.getElementById('registerBtn');
  const loader = document.getElementById('registerLoader');
  const btnText = btn.querySelector('.btn-text');
  const btnArrow = btn.querySelector('.btn-arrow');
  
  btn.disabled = true;
  loader.classList.add('active');
  btnText.style.display = 'none';
  btnArrow.style.display = 'none';
}

function hideLoader() {
  const btn = document.getElementById('registerBtn');
  const loader = document.getElementById('registerLoader');
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
