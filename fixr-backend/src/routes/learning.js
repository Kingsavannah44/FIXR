const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const db = require('../db');

// POST /api/learning/courses  (admin — create course)
router.post('/courses', auth, role('admin'), async (req, res) => {
  const { title, description, category, level, points_reward, content_url } = req.body;
  const { rows } = await db.query(
    `INSERT INTO courses (title, description, category, level, points_reward, content_url)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description, category, level || 'beginner', points_reward || 50, content_url]
  );
  res.status(201).json(rows[0]);
});

// DELETE /api/learning/courses/:id  (admin only)
router.delete('/courses/:id', auth, role('admin'), async (req, res) => {
  await db.query(`DELETE FROM courses WHERE id=$1`, [req.params.id]);
  res.json({ message: 'Course deleted' });
});

// GET /api/learning/courses
router.get('/courses', async (req, res) => {
  const { category, level } = req.query;
  const conditions = [];
  const params = [];
  if (category) conditions.push(`category = $${params.push(category)}`);
  if (level) conditions.push(`level = $${params.push(level)}`);
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await db.query(`SELECT * FROM courses ${where} ORDER BY created_at DESC`, params);
  res.json(rows);
});

// GET /api/learning/courses/:id
router.get('/courses/:id', async (req, res) => {
  const { rows } = await db.query(`SELECT * FROM courses WHERE id=$1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Course not found' });
  res.json(rows[0]);
});

// POST /api/learning/courses/:id/enroll
router.post('/courses/:id/enroll', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `INSERT INTO enrollments (user_id, course_id) VALUES ($1,$2)
       ON CONFLICT (user_id, course_id) DO NOTHING RETURNING *`,
      [req.user.id, req.params.id]
    );
    res.status(201).json(rows[0] || { message: 'Already enrolled' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/learning/courses/:id/progress
router.patch('/courses/:id/progress', auth, async (req, res) => {
  const { progress } = req.body; // 0-100
  const completed = progress >= 100;
  const { rows } = await db.query(
    `UPDATE enrollments SET progress=$1, completed=$2
     WHERE user_id=$3 AND course_id=$4 RETURNING *`,
    [progress, completed, req.user.id, req.params.id]
  );
  if (completed) {
    const { rows: [course] } = await db.query(`SELECT points_reward FROM courses WHERE id=$1`, [req.params.id]);
    if (course) {
      await db.query(`UPDATE users SET points = points + $1 WHERE id=$2`, [course.points_reward, req.user.id]);
      await db.query(
        `INSERT INTO point_transactions (user_id, points, reason) VALUES ($1,$2,'course_completed')`,
        [req.user.id, course.points_reward]
      );
    }
  }
  res.json(rows[0]);
});

// GET /api/learning/my-courses
router.get('/my-courses', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT c.*, e.progress, e.completed, e.enrolled_at
     FROM enrollments e JOIN courses c ON c.id = e.course_id
     WHERE e.user_id=$1`,
    [req.user.id]
  );
  res.json(rows);
});

module.exports = router;
