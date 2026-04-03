const USERS_KEY = 'wanderlist_users_v1';
const SESSION_KEY = 'wanderlist_current_user_v1';

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const errorText = document.getElementById('auth-error');

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function setError(message = '') {
  if (errorText) errorText.textContent = message;
}

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(registerForm);

    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill all registration fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const users = getUsers();
    const exists = users.some((user) => user.email === email);
    if (exists) {
      setError('An account with this email already exists.');
      return;
    }

    const newUser = { id: crypto.randomUUID(), name, email, password };
    users.push(newUser);
    saveUsers(users);
    setSession({ id: newUser.id, name: newUser.name, email: newUser.email });
    window.location.href = 'dashboard.html';
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);

    const email = String(formData.get('email') || '').trim().toLowerCase();
    const password = String(formData.get('password') || '');

    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    const users = getUsers();
    const matched = users.find((user) => user.email === email && user.password === password);

    if (!matched) {
      setError('Invalid credentials. Please try again.');
      return;
    }

    setSession({ id: matched.id, name: matched.name, email: matched.email });
    window.location.href = 'dashboard.html';
  });
}
