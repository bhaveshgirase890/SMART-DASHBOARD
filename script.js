const STORAGE_KEY = 'wanderlist_trips_v1';

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
const cardTemplate = document.getElementById('trip-card-template');

let trips = loadTrips();

function loadTrips() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

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
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
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

function handleToggleVisited(id) {
  trips = trips.map((trip) =>
    trip.id === id
      ? {
          ...trip,
          visited: !trip.visited,
        }
      : trip
  );

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

  if (trip.visited) {
    card.classList.add('visited');
  }

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

  filteredTrips.forEach((trip) => {
    tripGrid.appendChild(createTripCard(trip));
  });

  toggleEmptyState(filteredTrips.length);
  updateSummary();
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
