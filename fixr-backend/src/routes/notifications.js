const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db');

// GET /api/notifications  — own notifications
router.get('/', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT * FROM notifications WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50`,
    [req.user.id]
  );
  res.json(rows);
});

// GET /api/notifications/unread-count
router.get('/unread-count', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT COUNT(*) FROM notifications WHERE user_id=$1 AND is_read=false`,
    [req.user.id]
  );
  res.json({ count: parseInt(rows[0].count) });
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', auth, async (req, res) => {
  await db.query(
    `UPDATE notifications SET is_read=true WHERE id=$1 AND user_id=$2`,
    [req.params.id, req.user.id]
  );
  res.json({ ok: true });
});

// PATCH /api/notifications/read-all
router.patch('/read-all', auth, async (req, res) => {
  await db.query(
    `UPDATE notifications SET is_read=true WHERE user_id=$1`, [req.user.id]
  );
  res.json({ ok: true });
});

module.exports = router;
