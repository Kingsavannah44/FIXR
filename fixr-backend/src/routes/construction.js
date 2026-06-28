const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../db');

// ─── PROJECTS ────────────────────────────────────────────────────────────────

// GET /api/construction/projects  — list projects I'm a member of
router.get('/projects', auth, async (req, res) => {
  const { rows: memberships } = await db.query(
    `SELECT project_id FROM project_members WHERE user_id=$1`, [req.user.id]
  );
  const ids = memberships.map(m => m.project_id);
  if (!ids.length) return res.json([]);

  const { rows: projects } = await db.query(
    `SELECT p.*, u.full_name AS owner_name FROM construction_projects p
     JOIN users u ON u.id = p.owner_id
     WHERE p.id = ANY($1) ORDER BY p.created_at DESC`,
    [ids]
  );

  // Attach member count and latest update
  const enriched = await Promise.all(projects.map(async (p) => {
    const { rows: [mc] } = await db.query(
      `SELECT COUNT(*) FROM project_members WHERE project_id=$1`, [p.id]
    );
    const { rows: [latest] } = await db.query(
      `SELECT created_at, percentage_complete FROM project_updates
       WHERE project_id=$1 ORDER BY created_at DESC LIMIT 1`, [p.id]
    );
    return { ...p, member_count: mc.count, latest_update: latest || null };
  }));

  res.json(enriched);
});

// POST /api/construction/projects  — create project
router.post('/projects', auth, async (req, res) => {
  const { name, description, location, project_type, estimated_start,
          estimated_end, total_budget } = req.body;
  if (!name || !project_type)
    return res.status(400).json({ error: 'name and project_type required' });

  const { rows } = await db.query(
    `INSERT INTO construction_projects
       (owner_id, name, description, location, project_type,
        estimated_start, estimated_end, total_budget)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.user.id, name, description, location, project_type,
     estimated_start || null, estimated_end || null, total_budget || 0]
  );
  const project = rows[0];

  // Auto-add creator as owner member
  await db.query(
    `INSERT INTO project_members (project_id, user_id, member_role)
     VALUES ($1,$2,'owner')`,
    [project.id, req.user.id]
  );

  // Auto-assign FIXR inspector if budget >= 500,000
  if (parseFloat(total_budget) >= 500000) {
    await db.query(
      `INSERT INTO notifications (user_id, type, title, body, metadata)
       VALUES ($1,'inspector_assigned','FIXR Inspector Assigned',
       'Your project budget qualifies for a FIXR inspector. One will be assigned shortly.',$2)`,
      [req.user.id, JSON.stringify({ project_id: project.id })]
    );
  }

  res.status(201).json(project);
});

// GET /api/construction/projects/:id  — project detail
router.get('/projects/:id', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT p.*, u.full_name AS owner_name, u.avatar_url AS owner_avatar
     FROM construction_projects p JOIN users u ON u.id = p.owner_id
     WHERE p.id=$1`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Project not found' });

  // Check membership
  const { rows: [member] } = await db.query(
    `SELECT member_role FROM project_members WHERE project_id=$1 AND user_id=$2`,
    [req.params.id, req.user.id]
  );
  if (!member && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Not a project member' });

  // Milestones
  const { rows: milestones } = await db.query(
    `SELECT * FROM project_milestones WHERE project_id=$1 ORDER BY due_date ASC`,
    [req.params.id]
  );

  // Members
  const { rows: members } = await db.query(
    `SELECT pm.*, u.full_name, u.avatar_url, u.email FROM project_members pm
     JOIN users u ON u.id = pm.user_id WHERE pm.project_id=$1`,
    [req.params.id]
  );

  res.json({ ...rows[0], milestones, members, my_role: member?.member_role });
});

// PATCH /api/construction/projects/:id  — update project status/details
router.patch('/projects/:id', auth, async (req, res) => {
  const { rows: [member] } = await db.query(
    `SELECT member_role FROM project_members WHERE project_id=$1 AND user_id=$2`,
    [req.params.id, req.user.id]
  );
  if (!member || !['owner', 'engineer'].includes(member.member_role))
    return res.status(403).json({ error: 'Only owner or engineer can update project' });

  const { name, description, status, estimated_end, total_budget } = req.body;
  const { rows } = await db.query(
    `UPDATE construction_projects SET
       name=COALESCE($1,name), description=COALESCE($2,description),
       status=COALESCE($3,status), estimated_end=COALESCE($4,estimated_end),
       total_budget=COALESCE($5,total_budget), updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [name, description, status, estimated_end, total_budget, req.params.id]
  );
  res.json(rows[0]);
});

// ─── TEAM MEMBERS ────────────────────────────────────────────────────────────

// POST /api/construction/projects/:id/invite
router.post('/projects/:id/invite', auth, async (req, res) => {
  const { invitee_email, invitee_phone, member_role } = req.body;
  const validRoles = ['engineer', 'supervisor', 'fundi', 'fixr_inspector'];
  if (!validRoles.includes(member_role))
    return res.status(400).json({ error: `Invalid role. Must be: ${validRoles.join(', ')}` });

  // Check requester is owner
  const { rows: [myMembership] } = await db.query(
    `SELECT member_role FROM project_members WHERE project_id=$1 AND user_id=$2`,
    [req.params.id, req.user.id]
  );
  if (!myMembership || myMembership.member_role !== 'owner')
    return res.status(403).json({ error: 'Only project owner can invite members' });

  // Find the user
  const { rows: [invitee] } = await db.query(
    `SELECT id, full_name, email FROM users WHERE email=$1 OR phone=$2 LIMIT 1`,
    [invitee_email || null, invitee_phone || null]
  );
  if (!invitee) return res.status(404).json({ error: 'User not found on FIXR' });

  // Add as member (pending acceptance)
  try {
    await db.query(
      `INSERT INTO project_members (project_id, user_id, member_role, accepted)
       VALUES ($1,$2,$3,false)`,
      [req.params.id, invitee.id, member_role]
    );
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'User already in project' });
    throw err;
  }

  // Fetch project name for notification
  const { rows: [proj] } = await db.query(
    `SELECT name FROM construction_projects WHERE id=$1`, [req.params.id]
  );

  await db.query(
    `INSERT INTO notifications (user_id, type, title, body, metadata)
     VALUES ($1,'project_invite','Project Invitation',$2,$3)`,
    [invitee.id,
     `You've been invited to join project "${proj?.name}" as ${member_role}.`,
     JSON.stringify({ project_id: req.params.id, role: member_role })]
  );

  res.status(201).json({ invited: invitee.full_name, role: member_role });
});

// POST /api/construction/projects/:id/accept  — accept project invitation
router.post('/projects/:id/accept', auth, async (req, res) => {
  const { rows } = await db.query(
    `UPDATE project_members SET accepted=true WHERE project_id=$1 AND user_id=$2 RETURNING *`,
    [req.params.id, req.user.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Invitation not found' });
  res.json(rows[0]);
});

// ─── PROGRESS UPDATES ────────────────────────────────────────────────────────

// GET /api/construction/projects/:id/updates
router.get('/projects/:id/updates', auth, async (req, res) => {
  const { rows: [member] } = await db.query(
    `SELECT member_role FROM project_members WHERE project_id=$1 AND user_id=$2`,
    [req.params.id, req.user.id]
  );
  if (!member && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Not a project member' });

  const { rows } = await db.query(
    `SELECT pu.*, u.full_name AS contributor_name, u.avatar_url AS contributor_avatar,
       pm.member_role AS contributor_role
     FROM project_updates pu
     JOIN users u ON u.id = pu.submitted_by
     JOIN project_members pm ON pm.user_id = pu.submitted_by AND pm.project_id = pu.project_id
     WHERE pu.project_id=$1 ORDER BY pu.created_at DESC`,
    [req.params.id]
  );
  res.json(rows);
});

// POST /api/construction/projects/:id/updates  — submit progress update (immutable)
router.post('/projects/:id/updates', auth, async (req, res) => {
  const { rows: [member] } = await db.query(
    `SELECT member_role FROM project_members WHERE project_id=$1 AND user_id=$2 AND accepted=true`,
    [req.params.id, req.user.id]
  );
  const allowedRoles = ['fundi', 'supervisor', 'engineer', 'fixr_inspector', 'owner'];
  if (!member || !allowedRoles.includes(member.member_role))
    return res.status(403).json({ error: 'Not authorised to submit updates' });

  const { title, description, phase, percentage_complete, photos } = req.body;
  if (!title || !phase)
    return res.status(400).json({ error: 'title and phase required' });

  const pct = Math.min(100, Math.max(0, parseInt(percentage_complete) || 0));
  const { rows } = await db.query(
    `INSERT INTO project_updates
       (project_id, submitted_by, title, description, phase, percentage_complete, photos, is_fixr_verified)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [req.params.id, req.user.id, title, description, phase, pct,
     JSON.stringify(photos || []),
     member.member_role === 'fixr_inspector']
  );

  // Notify project owner
  const { rows: [proj] } = await db.query(
    `SELECT owner_id, name FROM construction_projects WHERE id=$1`, [req.params.id]
  );
  if (proj && proj.owner_id !== req.user.id) {
    await db.query(
      `INSERT INTO notifications (user_id, type, title, body, metadata)
       VALUES ($1,'progress_update','New Progress Update',$2,$3)`,
      [proj.owner_id,
       `${member.member_role} submitted an update on "${proj.name}": ${title}`,
       JSON.stringify({ project_id: req.params.id, update_id: rows[0].id })]
    );
  }

  // Check milestone completion
  await db.query(
    `UPDATE project_milestones SET status='achieved', achieved_at=NOW()
     WHERE project_id=$1 AND status='pending' AND target_percentage <= $2`,
    [req.params.id, pct]
  );

  res.status(201).json(rows[0]);
});

// ─── MILESTONES ──────────────────────────────────────────────────────────────

// GET /api/construction/projects/:id/milestones
router.get('/projects/:id/milestones', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT * FROM project_milestones WHERE project_id=$1 ORDER BY due_date ASC`,
    [req.params.id]
  );
  // Mark overdue milestones
  const now = new Date();
  const enriched = rows.map(m => ({
    ...m,
    status: m.status === 'pending' && new Date(m.due_date) < now ? 'overdue' : m.status,
  }));
  res.json(enriched);
});

// POST /api/construction/projects/:id/milestones
router.post('/projects/:id/milestones', auth, async (req, res) => {
  const { rows: [member] } = await db.query(
    `SELECT member_role FROM project_members WHERE project_id=$1 AND user_id=$2`,
    [req.params.id, req.user.id]
  );
  if (!member || !['owner', 'engineer'].includes(member.member_role))
    return res.status(403).json({ error: 'Only owner or engineer can add milestones' });

  const { title, description, due_date, target_percentage } = req.body;
  if (!title || !due_date)
    return res.status(400).json({ error: 'title and due_date required' });

  // Max 10 milestones per project
  const { rows: [count] } = await db.query(
    `SELECT COUNT(*) FROM project_milestones WHERE project_id=$1`, [req.params.id]
  );
  if (parseInt(count.count) >= 10)
    return res.status(409).json({ error: 'Maximum 10 milestones per project' });

  const { rows } = await db.query(
    `INSERT INTO project_milestones (project_id, title, description, due_date, target_percentage)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [req.params.id, title, description, due_date, target_percentage || 0]
  );
  res.status(201).json(rows[0]);
});

// PATCH /api/construction/milestones/:id  — manually update milestone status
router.patch('/milestones/:id', auth, async (req, res) => {
  const { status } = req.body;
  const { rows } = await db.query(
    `UPDATE project_milestones SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
    [status, req.params.id]
  );
  res.json(rows[0]);
});

// ─── ALERTS CHECK  (called periodically or on-demand) ────────────────────────

// GET /api/construction/projects/:id/inactivity-check
router.get('/projects/:id/inactivity-check', auth, async (req, res) => {
  const { rows: [proj] } = await db.query(
    `SELECT * FROM construction_projects WHERE id=$1`, [req.params.id]
  );
  if (!proj || proj.status !== 'in_progress')
    return res.json({ alert: false });

  const { rows: [latest] } = await db.query(
    `SELECT created_at FROM project_updates WHERE project_id=$1
     ORDER BY created_at DESC LIMIT 1`,
    [req.params.id]
  );

  const threshold = 48 * 60 * 60 * 1000; // 48 hours
  const lastUpdate = latest ? new Date(latest.created_at) : new Date(proj.created_at);
  const elapsed = Date.now() - lastUpdate.getTime();

  if (elapsed > threshold) {
    // Notify owner + engineers
    const { rows: members } = await db.query(
      `SELECT user_id FROM project_members
       WHERE project_id=$1 AND member_role IN ('owner','engineer')`,
      [req.params.id]
    );
    for (const m of members) {
      await db.query(
        `INSERT INTO notifications (user_id, type, title, body, metadata)
         VALUES ($1,'inactivity_alert','⚠️ No Updates in 48hrs',$2,$3)`,
        [m.user_id,
         `No progress updates have been submitted on "${proj.name}" in over 48 hours.`,
         JSON.stringify({ project_id: proj.id })]
      );
    }
    return res.json({ alert: true, hours_since_last_update: Math.floor(elapsed / 3600000) });
  }

  res.json({ alert: false, hours_since_last_update: Math.floor(elapsed / 3600000) });
});

module.exports = router;
