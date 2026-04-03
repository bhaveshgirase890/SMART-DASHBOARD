const destinations = [
  {
    id: 'bali',
    name: 'Bali, Indonesia',
    mood: 'beach',
    description: 'Tropical beaches, wellness retreats, and vibrant sunsets.',
    duration: '6 days',
    price: 1399,
    rating: 4.8,
    availability: 'Limited spots',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'barcelona',
    name: 'Barcelona, Spain',
    mood: 'city',
    description: 'Architecture, nightlife, and Mediterranean city culture.',
    duration: '5 days',
    price: 1240,
    rating: 4.6,
    availability: 'Open',
    image:
      'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'banff',
    name: 'Banff, Canada',
    mood: 'nature',
    description: 'Mountain trails, glacier lakes, and outdoor adventure.',
    duration: '7 days',
    price: 1510,
    rating: 4.9,
    availability: 'Selling fast',
    image:
      'https://images.unsplash.com/photo-1616628182509-6f6f5be98b9f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'kyoto',
    name: 'Kyoto, Japan',
    mood: 'culture',
    description: 'Historic temples, tea districts, and seasonal beauty.',
    duration: '6 days',
    price: 1675,
    rating: 4.9,
    availability: 'Open',
    image:
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
  },
];

const grid = document.getElementById('destination-grid');
const tableBody = document.getElementById('package-table-body');
const feedback = document.getElementById('feedback');
const promptForm = document.getElementById('prompt-form');
const moodSelect = document.getElementById('travel-mood');
const refreshOffersBtn = document.getElementById('refresh-offers');
const template = document.getElementById('destination-template');

function setFeedback(title, message, isSuccess = false) {
  feedback.innerHTML = `
    <h3>${title}</h3>
    <p class="${isSuccess ? 'success' : ''}">${message}</p>
  `;
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function clearHighlights() {
  document.querySelectorAll('.card').forEach((card) => card.classList.remove('highlight'));
}

function renderCards() {
  destinations.forEach((destination) => {
    const node = template.content.cloneNode(true);
    const card = node.querySelector('.card');
    card.dataset.id = destination.id;

    const image = node.querySelector('img');
    image.src = destination.image;
    image.alt = `${destination.name} destination photo`;

    node.querySelector('h3').textContent = destination.name;
    node.querySelector('.card-description').textContent = destination.description;
    node.querySelector('.duration').textContent = destination.duration;
    node.querySelector('.rating').textContent = `★ ${destination.rating}`;
    node.querySelector('.price').textContent = formatPrice(destination.price);

    const bookBtn = node.querySelector('.book-btn');
    bookBtn.addEventListener('click', () => {
      clearHighlights();
      card.classList.add('highlight');
      setFeedback(
        'Booking Confirmed',
        `You selected the ${destination.name} package for ${formatPrice(destination.price)}.`,
        true
      );
    });

    grid.appendChild(node);
  });
}

function renderTable() {
  tableBody.innerHTML = destinations
    .map(
      (destination) => `
      <tr>
        <td>${destination.name}</td>
        <td>${destination.duration}</td>
        <td>${formatPrice(destination.price)}</td>
        <td>${destination.rating}</td>
        <td>${destination.availability}</td>
      </tr>
    `
    )
    .join('');
}

function recommendDestination(mood) {
  const result = destinations.find((destination) => destination.mood === mood);
  if (!result) {
    setFeedback('No Match Found', 'Try a different travel style to see a recommendation.');
    return;
  }

  clearHighlights();
  const matchedCard = document.querySelector(`[data-id="${result.id}"]`);
  matchedCard?.classList.add('highlight');
  setFeedback(
    'Recommended Destination',
    `${result.name} is a great match. Package starts at ${formatPrice(result.price)} for ${result.duration}.`
  );
}

promptForm.addEventListener('submit', (event) => {
  event.preventDefault();
  recommendDestination(moodSelect.value);
});

refreshOffersBtn.addEventListener('click', () => {
  const discounted = [...destinations].sort((a, b) => a.price - b.price).slice(0, 2);
  const offerMessage = discounted
    .map((destination) => `${destination.name} (${formatPrice(destination.price)})`)
    .join(' and ');

  setFeedback('Special Offers', `This week: save more with ${offerMessage}.`);
});

renderCards();
renderTable();
