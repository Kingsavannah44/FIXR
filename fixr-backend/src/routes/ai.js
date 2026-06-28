const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db');

// POST /api/ai/cv-builder
router.post('/cv-builder', auth, async (req, res) => {
  const { rows: [user] } = await db.query(
    `SELECT u.full_name, u.bio, u.location, u.role,
       (SELECT json_agg(skill) FROM user_skills WHERE user_id=u.id) AS skills,
       (SELECT json_agg(json_build_object('title',title,'description',description))
        FROM portfolio_items WHERE user_id=u.id) AS portfolio
     FROM users u WHERE u.id=$1`,
    [req.user.id]
  );
  // Rule-based CV template (swap with OpenAI call when key available)
  const cv = {
    name: user.full_name,
    role: user.role,
    summary: user.bio || `Experienced ${user.role} based in ${user.location || 'Kenya'}.`,
    skills: user.skills || [],
    portfolio: user.portfolio || [],
    generated_at: new Date().toISOString(),
  };
  res.json(cv);
});

// POST /api/ai/gig-pricing
router.post('/gig-pricing', auth, async (req, res) => {
  const { category, skills = [], location } = req.body;
  // Market-rate lookup table (extendable to ML model)
  const rates = {
    trades: { min: 500, max: 5000, unit: 'KES/day' },
    creative: { min: 2000, max: 25000, unit: 'KES/project' },
    agribusiness: { min: 300, max: 3000, unit: 'KES/day' },
    internship: { min: 10000, max: 30000, unit: 'KES/month' },
    remote: { min: 3000, max: 80000, unit: 'KES/month' },
  };
  const base = rates[category] || rates.remote;
  const skillBonus = Math.min(skills.length * 500, 5000);
  res.json({
    recommended_min: base.min + skillBonus,
    recommended_max: base.max + skillBonus,
    unit: base.unit,
    tips: [
      'Add portfolio samples to justify higher rates',
      'Location affects pricing — Nairobi rates are typically 20% higher',
      'Verified profiles earn 30% more on average',
    ],
  });
});

// GET /api/ai/learning-recommendations
router.get('/learning-recommendations', auth, async (req, res) => {
  const { rows: skills } = await db.query(
    `SELECT skill FROM user_skills WHERE user_id=$1`, [req.user.id]
  );
  const { rows: enrolled } = await db.query(
    `SELECT course_id FROM enrollments WHERE user_id=$1`, [req.user.id]
  );
  const enrolledIds = enrolled.map(e => e.course_id);
  const userSkills = skills.map(s => s.skill.toLowerCase());

  // Recommend courses NOT already enrolled, ordered by relevance
  const { rows } = await db.query(
    `SELECT * FROM courses
     WHERE id != ALL($1::uuid[])
     ORDER BY created_at DESC LIMIT 6`,
    [enrolledIds.length ? enrolledIds : [null]]
  );
  res.json(rows);
});

module.exports = router;
