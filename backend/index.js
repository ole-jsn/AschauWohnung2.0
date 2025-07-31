require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const bcrypt = require('bcrypt');
const csurf = require('csurf');
const helmet = require('helmet');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// DB setup
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    isAdmin INTEGER NOT NULL DEFAULT 0,
    isActive INTEGER NOT NULL DEFAULT 1
  )`);
});

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Frontend-URL ggf. anpassen
  credentials: true
}));
app.use(session({
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: __dirname }),
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // auf true setzen, wenn HTTPS verwendet wird
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 2 // 2 Stunden
  }
}));
app.use(csurf());

// CSRF-Token für das Frontend bereitstellen
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Middleware: Authentifizierung prüfen
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Nicht eingeloggt' });
  next();
}
// Middleware: Adminrechte prüfen
function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.isAdmin) return res.status(403).json({ error: 'Keine Adminrechte' });
  next();
}

// Startpunkt
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// User registrieren (nur für Admins, Beispiel: initialer Admin-User)
app.post('/api/register', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Fehlende Felder' });
  try {
    const hash = await bcrypt.hash(password, 12);
    db.run('INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)', [username, hash, isAdmin ? 1 : 0], function(err) {
      if (err) return res.status(400).json({ error: 'Benutzername bereits vergeben' });
      res.json({ id: this.lastID, username, isAdmin: !!isAdmin });
    });
  } catch (e) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Fehlende Felder' });
  db.get('SELECT * FROM users WHERE username = ? AND isActive = 1', [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Ungültige Zugangsdaten' });
    req.session.user = { id: user.id, username: user.username, isAdmin: !!user.isAdmin };
    res.json({ id: user.id, username: user.username, isAdmin: !!user.isAdmin });
  });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// Auth-Status
app.get('/api/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Nicht eingeloggt' });
  res.json(req.session.user);
});

// Benutzerübersicht (nur Admin)
app.get('/api/users', requireAuth, requireAdmin, (req, res) => {
  db.all('SELECT id, username, isAdmin, isActive FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB-Fehler' });
    res.json(rows);
  });
});

// Benutzer anlegen (nur Admin)
app.post('/api/users', requireAuth, requireAdmin, async (req, res) => {
  const { username, password, isAdmin } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Fehlende Felder' });
  try {
    const hash = await bcrypt.hash(password, 12);
    db.run('INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)', [username, hash, isAdmin ? 1 : 0], function(err) {
      if (err) return res.status(400).json({ error: 'Benutzername bereits vergeben' });
      res.json({ id: this.lastID, username, isAdmin: !!isAdmin });
    });
  } catch (e) {
    res.status(500).json({ error: 'Serverfehler' });
  }
});

// Benutzer aktivieren/deaktivieren (nur Admin)
app.patch('/api/users/:id/active', requireAuth, requireAdmin, (req, res) => {
  const { isActive } = req.body;
  db.run('UPDATE users SET isActive = ? WHERE id = ?', [isActive ? 1 : 0, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'DB-Fehler' });
    res.json({ ok: true });
  });
});

// Benutzer löschen (nur Admin)
app.delete('/api/users/:id', requireAuth, requireAdmin, (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'DB-Fehler' });
    res.json({ ok: true });
  });
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
}); 