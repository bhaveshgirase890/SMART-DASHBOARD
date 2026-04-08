async function getDashboardData() {
  const response = await fetch('/api/dashboard');
  if (!response.ok) throw new Error('Unable to load dashboard data');
  return response.json();
}

async function getFeedbackLogs() {
  const response = await fetch('/api/feedback');
  if (!response.ok) throw new Error('Unable to load feedback logs');
  return response.json();
}

function statusClass(level) {
  if (level >= 85) return 'status-danger';
  if (level >= 50) return 'status-warn';
  return 'status-ok';
}

function renderDashboard(data) {
  const sensorStatus = document.getElementById('sensor-status');
  const fillLevels = document.getElementById('fill-levels');
  const routeAlert = document.getElementById('route-alert');
  const gpsStatus = document.getElementById('gps-status');
  const classificationSummary = document.getElementById('classification-summary');
  const wasteBreakdown = document.getElementById('waste-breakdown');

  sensorStatus.innerHTML = `System status: <span class="${data.systemOk ? 'status-ok' : 'status-danger'}">${data.systemOk ? 'NORMAL' : 'ISSUE DETECTED'}</span>`;

  fillLevels.innerHTML = data.fillLevels
    .map((item) => `<span class="chip ${statusClass(item.level)}">${item.bin}: ${item.level}%</span>`)
    .join('');

  const needsCollection = data.fillLevels.some((item) => item.level >= 85);
  routeAlert.textContent = needsCollection
    ? 'DUSTBIN FULL! Generate Alert + Route Collection Vehicle'
    : 'All bins below critical threshold. Normal route.';

  gpsStatus.textContent = `${data.vehicle.name}: ${data.vehicle.location}`;

  classificationSummary.textContent = `Latest AI result: ${data.classification.latestItem}`;

  wasteBreakdown.innerHTML = Object.entries(data.classification.categories)
    .map(([type, count]) => `<li>${type}: ${count} items</li>`)
    .join('');
}

function renderLogs(logs) {
  const logList = document.getElementById('feedback-logs');
  logList.innerHTML = logs
    .map((log) => `<li><strong>${log.user}</strong>: ${log.message}</li>`)
    .join('');
}

async function postFeedback(message) {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) throw new Error('Unable to save feedback');
  return response.json();
}

async function bootstrap() {
  try {
    const [dashboardData, logs] = await Promise.all([getDashboardData(), getFeedbackLogs()]);
    renderDashboard(dashboardData);
    renderLogs(logs);
  } catch (error) {
    console.error(error);
  }
}

document.getElementById('feedback-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = document.getElementById('query');
  const message = query.value.trim();
  if (!message) return;

  try {
    await postFeedback(message);
    const updatedLogs = await getFeedbackLogs();
    renderLogs(updatedLogs);
    query.value = '';
  } catch (error) {
    console.error(error);
  }
});

bootstrap();
