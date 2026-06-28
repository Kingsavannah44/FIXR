const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const db = require('../db');

// GET /api/analytics/overview  (admin + business)
router.get('/overview', auth, role('admin', 'sme', 'government'), async (req, res) => {
  const [users, gigs, payments, enrollments] = await Promise.all([
    db.query(`SELECT COUNT(*) FROM users`),
    db.query(`SELECT COUNT(*), status FROM gigs GROUP BY status`),
    db.query(`SELECT SUM(amount) AS total, COUNT(*) FROM payments WHERE status='success'`),
    db.query(`SELECT COUNT(*) FROM enrollments WHERE completed=true`),
  ]);
  res.json({
    total_users: users.rows[0].count,
    gigs: gigs.rows,
    total_payments_kes: payments.rows[0].total,
    completed_courses: enrollments.rows[0].count,
  });
});

// GET /api/analytics/country  (multi-country breakdown)
router.get('/country', auth, role('admin'), async (req, res) => {
  const { rows } = await db.query(
    `SELECT country, COUNT(*) AS users FROM users GROUP BY country ORDER BY users DESC`
  );
  res.json(rows);
});

// POST /api/analytics/event  (client-side event tracking)
router.post('/event', auth, async (req, res) => {
  const { event_type, metadata } = req.body;
  await db.query(
    `INSERT INTO analytics_events (user_id, event_type, metadata, country)
     VALUES ($1,$2,$3,$4)`,
    [req.user.id, event_type, JSON.stringify(metadata), req.user.country]
  );
  res.json({ ok: true });
});

module.exports = router;
