const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const admin = require('../services/firebase');

const sign = (user) =>
  jwt.sign({ id: user.id, role: user.role, country: user.country }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, phone, password, full_name, role, country = 'KE' } = req.body;
  if (!full_name || !role) return res.status(400).json({ error: 'full_name and role required' });
  try {
    const hash = password ? await bcrypt.hash(password, 10) : null;
    const { rows } = await db.query(
      `INSERT INTO users (email, phone, password_hash, full_name, role, country)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, email, role, country, full_name`,
      [email, phone, hash, full_name, role, country]
    );
    const user = rows[0];
    // Award points for registration
    await db.query(
      `INSERT INTO point_transactions (user_id, points, reason) VALUES ($1, 50, 'registration')`,
      [user.id]
    );
    await db.query(`UPDATE users SET points = points + 50 WHERE id = $1`, [user.id]);
    res.status(201).json({ token: sign(user), user });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email or phone already exists' });
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT * FROM users WHERE email=$1 OR phone=$2 LIMIT 1`,
      [email, phone]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: sign(user), user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/google  (exchange google id_token for FIXR token)
router.post('/google', async (req, res) => {
  const { google_id, email, full_name, avatar_url, role = 'gig_worker' } = req.body;
  try {
    let { rows } = await db.query(`SELECT * FROM users WHERE google_id=$1 OR email=$2`, [google_id, email]);
    let user = rows[0];
    if (!user) {
      ({ rows } = await db.query(
        `INSERT INTO users (google_id, email, full_name, avatar_url, role, is_verified)
         VALUES ($1,$2,$3,$4,$5,true) RETURNING *`,
        [google_id, email, full_name, avatar_url, role]
      ));
      user = rows[0];
    }
    res.json({ token: sign(user), user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/firebase  (verify Firebase ID token → FIXR JWT)
router.post('/firebase', async (req, res) => {
  if (!admin.apps.length) return res.status(503).json({ error: 'Firebase not configured on server' });
  const { id_token, role = 'gig_worker' } = req.body;
  if (!id_token) return res.status(400).json({ error: 'id_token required' });
  try {
    const decoded = await admin.auth().verifyIdToken(id_token);
    const { uid, email, name: full_name, picture: avatar_url } = decoded;

    let { rows } = await db.query(
      `SELECT * FROM users WHERE google_id=$1 OR (email=$2 AND email IS NOT NULL) LIMIT 1`,
      [uid, email]
    );
    let user = rows[0];

    if (!user) {
      ({ rows } = await db.query(
        `INSERT INTO users (google_id, email, full_name, avatar_url, role, is_verified)
         VALUES ($1,$2,$3,$4,$5,true) RETURNING *`,
        [uid, email, full_name || email, avatar_url, role]
      ));
      user = rows[0];
      await db.query(
        `INSERT INTO point_transactions (user_id, points, reason) VALUES ($1, 50, 'registration')`,
        [user.id]
      );
      await db.query(`UPDATE users SET points = points + 50 WHERE id = $1`, [user.id]);
    } else if (!user.google_id) {
      // link firebase uid to existing email account
      await db.query(`UPDATE users SET google_id=$1 WHERE id=$2`, [uid, user.id]);
    }

    res.json({ token: sign(user), user: { id: user.id, email: user.email, role: user.role, full_name: user.full_name, avatar_url: user.avatar_url } });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
