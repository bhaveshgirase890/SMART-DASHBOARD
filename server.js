const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const dashboardData = {
  systemOk: true,
  fillLevels: [
    { bin: 'Bin-01', level: 22 },
    { bin: 'Bin-08', level: 67 },
    { bin: 'Bin-21', level: 91 },
  ],
  vehicle: {
    name: 'Truck GPS #A3',
    location: 'Heading to Bin-21 (City Center)',
  },
  classification: {
    latestItem: 'Dry waste (plastic bottle)',
    categories: {
      'Wet Waste': 14,
      Dry: 29,
      Plastic: 11,
      'E-Waste': 3,
    },
  },
};

const feedbackLogs = [
  { user: 'Citizen-07', message: 'Bin near market is almost full.' },
  { user: 'Driver-A3', message: 'Route updated, ETA 12 minutes.' },
];

function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';

  if (url === '/api/dashboard' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dashboardData));
    return;
  }

  if (url === '/api/feedback' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(feedbackLogs));
    return;
  }

  if (url === '/api/feedback' && req.method === 'POST') {
    try {
      const payload = await parseBody(req);
      if (!payload.message || typeof payload.message !== 'string') {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'message is required' }));
        return;
      }

      feedbackLogs.unshift({ user: 'MobileAppUser', message: payload.message.trim() });
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
    return;
  }

  const basePath = path.join(__dirname);
  if (url === '/' || url === '/index.html') {
    serveFile(path.join(basePath, 'index.html'), 'text/html', res);
  } else if (url === '/styles.css') {
    serveFile(path.join(basePath, 'styles.css'), 'text/css', res);
  } else if (url === '/script.js') {
    serveFile(path.join(basePath, 'script.js'), 'application/javascript', res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Smart dashboard running at http://localhost:${PORT}`);
});
