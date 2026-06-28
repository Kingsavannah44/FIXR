const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const db = require('../db');

// GET /api/gigs  (filter: category, status, location, remote)
router.get('/', async (req, res) => {
  const { category, status = 'open', is_remote, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const conditions = [`g.status = $1`];
  const params = [status];
  if (category) { conditions.push(`g.category = $${params.push(category)}`); }
  if (is_remote !== undefined) { conditions.push(`g.is_remote = $${params.push(is_remote === 'true')}`); }
  params.push(limit, offset);
  const { rows } = await db.query(
    `SELECT g.*, u.full_name AS poster_name, u.avatar_url AS poster_avatar
     FROM gigs g JOIN users u ON u.id = g.poster_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY g.created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  res.json(rows);
});

// POST /api/gigs
router.post('/', auth, async (req, res) => {
  const { title, description, category, budget_min, budget_max, location, is_remote } = req.body;
  const { rows } = await db.query(
    `INSERT INTO gigs (poster_id, title, description, category, budget_min, budget_max, location, is_remote)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.user.id, title, description, category, budget_min, budget_max, location, is_remote]
  );
  res.status(201).json(rows[0]);
});

// GET /api/gigs/:id
router.get('/:id', async (req, res) => {
  const { rows } = await db.query(
    `SELECT g.*, u.full_name AS poster_name, u.avatar_url AS poster_avatar,
       u.location AS poster_location
     FROM gigs g JOIN users u ON u.id = g.poster_id WHERE g.id=$1`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Gig not found' });
  res.json(rows[0]);
});

// POST /api/gigs/:id/apply
router.post('/:id/apply', auth, async (req, res) => {
  const { cover_note, proposed_fee } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO gig_applications (gig_id, applicant_id, cover_note, proposed_fee)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.params.id, req.user.id, cover_note, proposed_fee]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Already applied' });
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gigs/:id/applications  (poster only)
router.get('/:id/applications', auth, async (req, res) => {
  const { rows: [gig] } = await db.query(`SELECT poster_id FROM gigs WHERE id=$1`, [req.params.id]);
  if (!gig || gig.poster_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const { rows } = await db.query(
    `SELECT ga.*, u.full_name, u.avatar_url, u.location,
       (SELECT json_agg(skill) FROM user_skills WHERE user_id=u.id) AS skills
     FROM gig_applications ga JOIN users u ON u.id = ga.applicant_id
     WHERE ga.gig_id=$1`,
    [req.params.id]
  );
  res.json(rows);
});

// PATCH /api/gigs/:id/applications/:appId  (accept/reject)
router.patch('/:id/applications/:appId', auth, async (req, res) => {
  const { status } = req.body; // 'accepted' | 'rejected'
  const { rows: [gig] } = await db.query(`SELECT poster_id FROM gigs WHERE id=$1`, [req.params.id]);
  if (!gig || gig.poster_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  await db.query(`UPDATE gig_applications SET status=$1 WHERE id=$2`, [status, req.params.appId]);
  if (status === 'accepted')
    await db.query(`UPDATE gigs SET status='assigned' WHERE id=$1`, [req.params.id]);
  res.json({ message: `Application ${status}` });
});

// PATCH /api/gigs/:id  (admin — toggle status)
router.patch('/:id', auth, role('admin'), async (req, res) => {
  const { status } = req.body;
  const { rows } = await db.query(
    `UPDATE gigs SET status=$1 WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Gig not found' });
  res.json(rows[0]);
});

// DELETE /api/gigs/:id  (admin only)
router.delete('/:id', auth, role('admin'), async (req, res) => {
  await db.query(`DELETE FROM gigs WHERE id=$1`, [req.params.id]);
  res.json({ message: 'Gig deleted' });
});

module.exports = router;
