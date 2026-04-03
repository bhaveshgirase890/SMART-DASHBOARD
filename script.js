const SESSION_KEY = 'wanderlist_current_user_v1';

const tripForm = document.getElementById('trip-form');
const destinationInput = document.getElementById('destination');
const dateInput = document.getElementById('date');
const budgetInput = document.getElementById('budget');
const categoryInput = document.getElementById('category');
const searchInput = document.getElementById('search-input');
const formError = document.getElementById('form-error');
const tripGrid = document.getElementById('trip-grid');
const emptyState = document.getElementById('empty-state');
const totalTrips = document.getElementById('total-trips');
const visitedTrips = document.getElementById('visited-trips');
const budgetTotal = document.getElementById('budget-total');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');
const welcomeUser = document.getElementById('welcome-user');
const logoutBtn = document.getElementById('logout-btn');
const cardTemplate = document.getElementById('trip-card-template');

const currentUser = getSession();
if (!currentUser) {
  window.location.href = 'login.html';
}

const STORAGE_KEY = currentUser ? `wanderlist_trips_${currentUser.email}` : 'wanderlist_trips_guest';
const DEFAULT_TRIPS = [
  { id: 'seed-goa', destination: 'Goa', date: '2026-05-14', budget: 18000, category: 'Relax', visited: false },
  { id: 'seed-manali', destination: 'Manali', date: '2026-06-22', budget: 24000, category: 'Adventure', visited: false },
  { id: 'seed-jaipur', destination: 'Jaipur', date: '2026-08-03', budget: 15000, category: 'Culture', visited: true },
  { id: 'seed-kerala', destination: 'Kerala', date: '2026-09-12', budget: 27000, category: 'Relax', visited: false },
];

let trips = loadTrips();

function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function loadTrips() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_TRIPS;

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTrips() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

function formatBudget(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function setError(message = '') {
  formError.textContent = message;
}

function validateForm(data) {
  if (!data.destination || !data.date || !data.category || !data.budgetRaw) {
    return 'Please fill in all fields before adding a trip.';
  }

  if (Number.isNaN(data.budget) || data.budget <= 0) {
    return 'Budget must be a positive number.';
  }

  return '';
}

function getFilteredTrips() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return trips;
  return trips.filter((trip) => trip.destination.toLowerCase().includes(query));
}

function updateSummary() {
  const total = trips.length;
  const completed = trips.filter((trip) => trip.visited).length;
  const budgetSum = trips.reduce((sum, trip) => sum + trip.budget, 0);

  totalTrips.textContent = String(total);
  visitedTrips.textContent = String(completed);
  budgetTotal.textContent = formatBudget(budgetSum);
}

function toggleEmptyState(filteredCount) {
  emptyState.hidden = filteredCount !== 0;
}

function renderHistory() {
  const visited = trips.filter((trip) => trip.visited);
  historyList.innerHTML = '';

  visited.forEach((trip) => {
    const item = document.createElement('li');
    item.textContent = `${trip.destination} • ${formatDate(trip.date)} • ${formatBudget(trip.budget)}`;
    historyList.appendChild(item);
  });

  historyEmpty.hidden = visited.length !== 0;
}

function handleToggleVisited(id) {
  trips = trips.map((trip) => (trip.id === id ? { ...trip, visited: !trip.visited } : trip));
  saveTrips();
  render();
}

function handleDelete(id) {
  trips = trips.filter((trip) => trip.id !== id);
  saveTrips();
  render();
}

function createTripCard(trip) {
  const node = cardTemplate.content.cloneNode(true);
  const card = node.querySelector('.trip-card');
  card.dataset.id = trip.id;

  if (trip.visited) card.classList.add('visited');

  node.querySelector('.trip-destination').textContent = trip.destination;
  node.querySelector('.trip-date').textContent = formatDate(trip.date);
  node.querySelector('.trip-budget').textContent = formatBudget(trip.budget);
  node.querySelector('.trip-category').textContent = trip.category;

  const visitedInput = node.querySelector('.visited-input');
  visitedInput.checked = trip.visited;
  visitedInput.addEventListener('change', () => handleToggleVisited(trip.id));

  const deleteButton = node.querySelector('.delete-btn');
  deleteButton.addEventListener('click', () => handleDelete(trip.id));

  return node;
}

function render() {
  const filteredTrips = getFilteredTrips();
  tripGrid.innerHTML = '';
  filteredTrips.forEach((trip) => tripGrid.appendChild(createTripCard(trip)));

  toggleEmptyState(filteredTrips.length);
  updateSummary();
  renderHistory();
}

if (!localStorage.getItem(STORAGE_KEY)) {
  saveTrips();
}

if (welcomeUser && currentUser?.name) {
  welcomeUser.textContent = `Hello, ${currentUser.name}`;
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  });
}

tripForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const tripData = {
    destination: destinationInput.value.trim(),
    date: dateInput.value,
    budgetRaw: budgetInput.value,
    budget: Number(budgetInput.value),
    category: categoryInput.value,
  };

  const validationError = validateForm(tripData);
  if (validationError) {
    setError(validationError);
    return;
  }

  const newTrip = {
    id: crypto.randomUUID(),
    destination: tripData.destination,
    date: tripData.date,
    budget: tripData.budget,
    category: tripData.category,
    visited: false,
  };

  trips = [newTrip, ...trips];
  saveTrips();
  tripForm.reset();
  setError();
  render();
});

searchInput.addEventListener('input', render);
render();
