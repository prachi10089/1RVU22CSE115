const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5000;
const DB_FILE = './urls.json';

function readDB() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.use(cors({ origin: "http://localhost:3000", methods: ["GET","POST","OPTIONS"] }));

app.use((req, res, next) => {
  console.log(`[LOG] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use(bodyParser.json());

let shortUrls = readDB();

app.post('/shorturls', (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  const code = shortcode || Math.random().toString(36).substring(2, 8);
  if (shortUrls[code]) return res.status(400).json({ error: 'Shortcode already exists' });
  const expiry = new Date(Date.now() + validity * 60 * 1000);
  shortUrls[code] = { shortcode: code, url, createdAt: new Date(), expiry, clicks: 0, clickDetails: [] };
  writeDB(shortUrls);
  res.json({ shortUrl: `http://localhost:${PORT}/${code}`, expiry });
});

app.get('/shorturls', (req, res) => {
  res.json(Object.values(shortUrls));
});

app.get('/shorturls/:shortcode', (req, res) => {
  const data = shortUrls[req.params.shortcode];
  if (!data) return res.status(404).json({ error: 'Shortcode not found' });
  res.json(data);
});

app.get('/:shortcode', (req, res) => {
  const data = shortUrls[req.params.shortcode];
  if (!data) return res.status(404).send('Shortcode not found');
  if (new Date() > new Date(data.expiry)) return res.status(410).send('URL expired');
  data.clicks += 1;
  data.clickDetails.push({ timestamp: new Date(), ip: req.ip });
  writeDB(shortUrls);
  res.redirect(data.url);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
