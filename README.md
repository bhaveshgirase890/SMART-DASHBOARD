# Smart Waste Monitoring Dashboard (HTML/CSS/JavaScript + Simple Backend)

This project now includes a **simple backend** and a short front-end dashboard inspired by your workflow image:

1. Data Acquisition & Monitoring
2. Route Optimization & Collection
3. Waste Segregation & Transformation
4. Feedback, Tracking, & Analytics

## Tech stack

- Frontend: HTML + CSS + Vanilla JavaScript
- Backend: Node.js built-in `http` module (no external dependencies)

## Run

```bash
node server.js
```

Open: `http://localhost:3000`

## API endpoints

- `GET /api/dashboard` → live dashboard data
- `GET /api/feedback` → feedback log list
- `POST /api/feedback` → add a feedback message

Example POST body:

```json
{
  "message": "Bin #21 overflow near school"
}
```
