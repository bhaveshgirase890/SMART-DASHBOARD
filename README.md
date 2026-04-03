# WanderList 2026 — Personal Trip Planner

A beginner-friendly mini project built with **HTML, CSS, and Vanilla JavaScript** that now includes:

- Register and Login pages
- User dashboard for trip planning
- CRUD trip management
- Past bookings history
- INR (₹) budget tracking
- `localStorage` persistence

## Features

- **Authentication UI**
  - `register.html` to create a user
  - `login.html` to sign in
- **User Dashboard (`dashboard.html`)**
  - Add trip: destination, date, budget, category
  - View trip cards
  - Toggle visited status
  - Delete trip
  - Search trips by destination
  - Total trips vs completed stats
  - Budget total in INR (₹)
  - Past bookings history (visited trips)

## How to run

### Option 1 (quickest)
1. Download or clone this project.
2. Open `index.html` in any modern browser.
3. Register on the first screen (`index.html`).
4. After successful registration/login, you are automatically redirected to `dashboard.html`.

### Option 2 (recommended local server)
If you have Python installed, run this in the project folder:

```bash
python3 -m http.server 5500
```

Then open:

- `http://localhost:5500/index.html`

This avoids browser restrictions and works reliably with all pages.
