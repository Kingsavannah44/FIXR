const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const db = require('../db');

// GET /api/users  (admin — list all users)
router.get('/', auth, role('admin'), async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, full_name, email, phone, role, country, avatar_url, points, is_verified, created_at FROM users ORDER BY created_at DESC`
  );
  res.json(rows);
});

// GET /api/users/me
router.get('/me', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT u.*,
       COALESCE(json_agg(DISTINCT s.skill) FILTER (WHERE s.skill IS NOT NULL), '[]') AS skills,
       COALESCE(json_agg(DISTINCT p) FILTER (WHERE p.id IS NOT NULL), '[]') AS portfolio
     FROM users u
     LEFT JOIN user_skills s ON s.user_id = u.id
     LEFT JOIN portfolio_items p ON p.user_id = u.id
     WHERE u.id = $1 GROUP BY u.id`,
    [req.user.id]
  );
  res.json(rows[0]);
});

// PATCH /api/users/me
router.patch('/me', auth, async (req, res) => {
  const { bio, location, avatar_url, skills } = req.body;
  await db.query(
    `UPDATE users SET bio=$1, location=$2, avatar_url=$3 WHERE id=$4`,
    [bio, location, avatar_url, req.user.id]
  );
  if (skills?.length) {
    await db.query(`DELETE FROM user_skills WHERE user_id=$1`, [req.user.id]);
    for (const skill of skills) {
      await db.query(`INSERT INTO user_skills (user_id, skill) VALUES ($1,$2)`, [req.user.id, skill]);
    }
    await db.query(`UPDATE users SET points = points + 20 WHERE id=$1`, [req.user.id]);
    await db.query(
      `INSERT INTO point_transactions (user_id, points, reason) VALUES ($1,20,'profile_completed')`,
      [req.user.id]
    );
  }
  res.json({ message: 'Profile updated' });
});

// PATCH /api/users/:id  (admin — update role)
router.patch('/:id', auth, role('admin'), async (req, res) => {
  const { role: newRole } = req.body;
  const { rows } = await db.query(
    `UPDATE users SET role=$1 WHERE id=$2 RETURNING id, full_name, role`,
    [newRole, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

// DELETE /api/users/:id  (admin only)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  await db.query(`DELETE FROM users WHERE id=$1`, [req.params.id]);
  res.json({ message: 'User deleted' });
});

// GET /api/users/:id  (public profile)
router.get('/:id', async (req, res) => {
  const { rows } = await db.query(
    `SELECT id, full_name, role, bio, location, avatar_url, points,
       (SELECT json_agg(skill) FROM user_skills WHERE user_id=u.id) AS skills
     FROM users u WHERE id=$1`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

module.exports = router;
