// In-memory mock DB — replaces pg when no DATABASE_URL is set
const { v4: uuidv4 } = require('uuid');

const store = {
  users: [],
  user_skills: [],
  portfolio_items: [],
  gigs: [],
  gig_applications: [],
  // ── Housing ──
  owner_verifications: [],
  property_listings: [],
  listing_bookmarks: [],
  rental_escrows: [],
  listing_messages: [],
  // ── Construction ──
  construction_projects: [],
  project_members: [],
  project_updates: [],
  project_milestones: [],
  // ── Notifications ──
  notifications: [],
  courses: [
    { id: uuidv4(), title: 'Intro to Plumbing', description: 'Learn basic plumbing skills for home and commercial work.', category: 'trades', level: 'beginner', is_ai_gen: false, content_url: null, points_reward: 10, created_at: new Date().toISOString() },
    { id: uuidv4(), title: 'Graphic Design with Canva', description: 'Create stunning visuals for social media and marketing.', category: 'creative', level: 'beginner', is_ai_gen: false, content_url: null, points_reward: 10, created_at: new Date().toISOString() },
    { id: uuidv4(), title: 'Agribusiness Finance', description: 'Manage farm finances, loans, and cooperative funds.', category: 'agribusiness', level: 'intermediate', is_ai_gen: false, content_url: null, points_reward: 20, created_at: new Date().toISOString() },
    { id: uuidv4(), title: 'AI-Generated: Solar Installation Guide', description: 'Step-by-step solar panel installation for rural homes.', category: 'trades', level: 'intermediate', is_ai_gen: true, content_url: null, points_reward: 15, created_at: new Date().toISOString() },
    { id: uuidv4(), title: 'React for Beginners', description: 'Build modern web apps with React and Tailwind CSS.', category: 'tech', level: 'beginner', is_ai_gen: false, content_url: null, points_reward: 25, created_at: new Date().toISOString() },
    { id: uuidv4(), title: 'Digital Marketing for SMEs', description: 'Grow your business with Facebook Ads, SEO, and email marketing.', category: 'business', level: 'beginner', is_ai_gen: false, content_url: null, points_reward: 10, created_at: new Date().toISOString() },
  ],
  enrollments: [],
  payments: [],
  wallets: [],
  point_transactions: [],
  analytics_events: [],
};

// Seed demo data
const DEMO_USER_ID = uuidv4();
const DEMO_LANDLORD_ID = uuidv4();
const DEMO_OWNER_ID = uuidv4();
const DEMO_PROJECT_ID = uuidv4();
const DEMO_LISTING_1_ID = uuidv4();
const DEMO_LISTING_2_ID = uuidv4();
const DEMO_VER_ID = uuidv4();

store.users.push(
  {
    id: DEMO_USER_ID, email: 'demo@fixr.africa', phone: '254700000000',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    full_name: 'Demo User', role: 'sme', country: 'KE',
    bio: 'Demo SME on FIXR Africa', location: 'Nairobi', avatar_url: null,
    points: 100, is_verified: true, created_at: new Date().toISOString(),
  },
  {
    id: DEMO_LANDLORD_ID, email: 'landlord@fixr.africa', phone: '254711111111',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    full_name: 'James Kariuki', role: 'professional', country: 'KE',
    bio: 'Verified property owner with 5 listings in Nairobi.', location: 'Nairobi', avatar_url: null,
    points: 200, is_verified: true, created_at: new Date().toISOString(),
  },
  {
    id: DEMO_OWNER_ID, email: 'builder@fixr.africa', phone: '254722222222',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    full_name: 'Sarah Wanjiku', role: 'sme', country: 'KE',
    bio: 'Property developer – residential and commercial.', location: 'Kiambu', avatar_url: null,
    points: 150, is_verified: true, created_at: new Date().toISOString(),
  }
);

// Seed owner verifications
store.owner_verifications.push(
  { id: DEMO_VER_ID, user_id: DEMO_LANDLORD_ID, national_id: 'KE12345678', id_doc_url: null, business_reg_url: null, status: 'approved', admin_note: 'Verified in-person', reviewed_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuidv4(), user_id: DEMO_OWNER_ID, national_id: 'KE87654321', id_doc_url: null, business_reg_url: null, status: 'approved', admin_note: null, reviewed_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
);

// Seed property listings
store.property_listings.push(
  {
    id: DEMO_LISTING_1_ID, owner_id: DEMO_LANDLORD_ID,
    title: '2-Bedroom Apartment – Kilimani', description: 'Modern 2-bed apartment with en-suite, fitted kitchen, DSQ, and ample parking. 24hr security and backup generator.',
    property_type: 'apartment', rent_amount: 45000, deposit_amount: 45000,
    location: 'Kilimani, Nairobi', county: 'Nairobi',
    photos: JSON.stringify(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&auto=format&q=80','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&auto=format&q=80']),
    bundled_services: JSON.stringify(['cleaning','waste_management','security_guard','cctv_setup']),
    available_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: DEMO_LISTING_2_ID, owner_id: DEMO_OWNER_ID,
    title: 'Studio Bedsitter – Westlands', description: 'Compact modern studio ideal for young professionals. Fully furnished option available. Walking distance to Sarit Centre.',
    property_type: 'bedsitter', rent_amount: 18000, deposit_amount: 18000,
    location: 'Westlands, Nairobi', county: 'Nairobi',
    photos: JSON.stringify(['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&auto=format&q=80']),
    bundled_services: JSON.stringify(['cleaning','internet','waste_management']),
    available_date: new Date().toISOString().split('T')[0],
    status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: uuidv4(), owner_id: DEMO_LANDLORD_ID,
    title: '3-Bedroom Townhouse – Karen', description: 'Spacious townhouse in a gated community. Large garden, DSQ, CCTV, borehole water.',
    property_type: 'house', rent_amount: 85000, deposit_amount: 85000,
    location: 'Karen, Nairobi', county: 'Nairobi',
    photos: JSON.stringify(['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop&auto=format&q=80']),
    bundled_services: JSON.stringify(['maintenance','fire_safety','cctv_setup','security_guard','waste_management']),
    available_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  }
);

// Seed construction projects
store.construction_projects.push({
  id: DEMO_PROJECT_ID, owner_id: DEMO_OWNER_ID,
  name: 'Wanjiku Residences – Phase 1', description: '12-unit residential apartment block in Kiambu Road. RC frame construction.',
  location: 'Kiambu Road, Nairobi', project_type: 'residential',
  estimated_start: '2026-01-15', estimated_end: '2026-12-31',
  total_budget: 12500000, status: 'in_progress',
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  updated_at: new Date().toISOString(),
});

store.project_members.push(
  { id: uuidv4(), project_id: DEMO_PROJECT_ID, user_id: DEMO_OWNER_ID, member_role: 'owner', accepted: true, created_at: new Date().toISOString() },
  { id: uuidv4(), project_id: DEMO_PROJECT_ID, user_id: DEMO_LANDLORD_ID, member_role: 'engineer', accepted: true, created_at: new Date().toISOString() }
);

store.project_updates.push(
  {
    id: uuidv4(), project_id: DEMO_PROJECT_ID, submitted_by: DEMO_LANDLORD_ID,
    title: 'Foundation Complete', description: 'All footings poured and cured. Slab reinforcement underway.',
    phase: 'foundation', percentage_complete: 35,
    photos: JSON.stringify(['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop&auto=format&q=80']),
    is_fixr_verified: false,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: uuidv4(), project_id: DEMO_PROJECT_ID, submitted_by: DEMO_OWNER_ID,
    title: 'Ground Floor Columns Up', description: 'Ground floor columns cast. Formwork for first floor slab in progress.',
    phase: 'structure', percentage_complete: 45,
    photos: JSON.stringify(['https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&h=600&fit=crop&auto=format&q=80']),
    is_fixr_verified: false,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  }
);

store.project_milestones.push(
  { id: uuidv4(), project_id: DEMO_PROJECT_ID, title: 'Foundation Complete', description: 'All footings and slab done', due_date: '2026-02-28', target_percentage: 30, status: 'achieved', achieved_at: new Date(Date.now() - 10 * 86400000).toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuidv4(), project_id: DEMO_PROJECT_ID, title: 'Structure Complete', description: 'All columns, beams and slabs up to roof level', due_date: '2026-06-30', target_percentage: 60, status: 'pending', achieved_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: uuidv4(), project_id: DEMO_PROJECT_ID, title: 'Roofing Complete', description: 'Roof structure and covering done', due_date: '2026-08-31', target_percentage: 75, status: 'pending', achieved_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
);
[
  { title: 'Plumber needed – Karen', description: 'Fix bathroom pipes and install new taps in a 3-bedroom house.', category: 'trades', budget_min: 2000, budget_max: 5000, location: 'Karen, Nairobi', is_remote: false },
  { title: 'Logo Designer for Startup', description: 'Design a modern logo and brand kit for a fintech startup.', category: 'creative', budget_min: 5000, budget_max: 15000, location: null, is_remote: true },
  { title: 'Farm Manager – Nakuru', description: 'Manage a 10-acre maize and bean farm. Experience required.', category: 'agribusiness', budget_min: 15000, budget_max: 25000, location: 'Nakuru', is_remote: false },
  { title: 'React Developer (Remote)', description: 'Build and maintain a React + Node.js SaaS platform.', category: 'remote', budget_min: 50000, budget_max: 80000, location: null, is_remote: true },
  { title: 'Marketing Intern – Mombasa', description: 'Join our marketing team, support campaigns and social media.', category: 'internship', budget_min: 10000, budget_max: 15000, location: 'Mombasa', is_remote: false },
  { title: 'Electrician – Westlands', description: 'Rewire and install lighting in a new commercial office.', category: 'trades', budget_min: 3000, budget_max: 8000, location: 'Westlands, Nairobi', is_remote: false },
].forEach(g => store.gigs.push({
  id: uuidv4(), poster_id: DEMO_USER_ID, ...g,
  status: 'open', created_at: new Date().toISOString(),
  poster_name: 'Demo User', poster_avatar: null,
}));

// ── End of seed data ──────────────────────────────────────────────────────────

// ─── Query engine ────────────────────────────────────────────────────────────
function query(sql, params = []) {
  sql = sql.trim().replace(/\s+/g, ' ');
  const s = sql.toUpperCase();

  // ── users ──
  if (s.startsWith('INSERT INTO USERS')) {
    const [email, phone, hash, full_name, role, country] = params;
    const existing = store.users.find(u => (email && u.email === email) || (phone && u.phone === phone));
    if (existing) { const e = new Error('duplicate'); e.code = '23505'; throw e; }
    const user = { id: uuidv4(), email, phone, password_hash: hash, full_name, role, country: country || 'KE', bio: null, location: null, avatar_url: null, points: 0, is_verified: false, created_at: new Date().toISOString() };
    store.users.push(user);
    return { rows: [user] };
  }
  if (s.startsWith('SELECT * FROM USERS WHERE EMAIL=$1 OR PHONE=$2')) {
    const rows = store.users.filter(u => (params[0] && u.email === params[0]) || (params[1] && u.phone === params[1]));
    return { rows };
  }
  if (s.startsWith('SELECT * FROM USERS WHERE GOOGLE_ID=$1 OR EMAIL=$2')) {
    const rows = store.users.filter(u => u.google_id === params[0] || u.email === params[1]);
    return { rows };
  }
  if (s.includes('INSERT INTO USERS') && s.includes('GOOGLE_ID')) {
    const [google_id, email, full_name, avatar_url, role] = params;
    const user = { id: uuidv4(), google_id, email, full_name, avatar_url, role, country: 'KE', bio: null, location: null, phone: null, password_hash: null, points: 0, is_verified: true, created_at: new Date().toISOString() };
    store.users.push(user);
    return { rows: [user] };
  }
  if (s.startsWith('UPDATE USERS SET BIO=')) {
    const [bio, location, avatar_url, id] = params;
    const u = store.users.find(u => u.id === id);
    if (u) { u.bio = bio; u.location = location; u.avatar_url = avatar_url; }
    return { rows: [] };
  }
  if (s.startsWith('UPDATE USERS SET POINTS = POINTS +') && s.includes('WHERE ID=$')) {
    const pts = params[0]; const id = params[1];
    const u = store.users.find(u => u.id === id);
    if (u) u.points = (u.points || 0) + pts;
    return { rows: [] };
  }
  if (s.startsWith('UPDATE USERS SET POINTS = POINTS +') && s.includes('WHERE ID=')) {
    const pts = params[0]; const id = params[1];
    const u = store.users.find(u => u.id === id);
    if (u) u.points = (u.points || 0) + pts;
    return { rows: [] };
  }
  if (s.startsWith('SELECT U.*, ') && s.includes('FROM USERS U')) {
    const u = store.users.find(u => u.id === params[0]);
    if (!u) return { rows: [] };
    const skills = store.user_skills.filter(s => s.user_id === u.id).map(s => s.skill);
    const portfolio = store.portfolio_items.filter(p => p.user_id === u.id);
    return { rows: [{ ...u, skills, portfolio }] };
  }
  if (s.startsWith('SELECT ID, FULL_NAME, ROLE, BIO') && s.includes('FROM USERS U WHERE ID=')) {
    const u = store.users.find(u => u.id === params[0]);
    if (!u) return { rows: [] };
    const skills = store.user_skills.filter(s => s.user_id === u.id).map(s => s.skill);
    return { rows: [{ id: u.id, full_name: u.full_name, role: u.role, bio: u.bio, location: u.location, avatar_url: u.avatar_url, points: u.points, skills }] };
  }

  // ── user_skills ──
  if (s.startsWith('DELETE FROM USER_SKILLS WHERE USER_ID=')) {
    store.user_skills = store.user_skills.filter(s => s.user_id !== params[0]);
    return { rows: [] };
  }
  if (s.startsWith('INSERT INTO USER_SKILLS')) {
    store.user_skills.push({ id: uuidv4(), user_id: params[0], skill: params[1] });
    return { rows: [] };
  }
  if (s.startsWith('SELECT SKILL FROM USER_SKILLS WHERE USER_ID=')) {
    return { rows: store.user_skills.filter(s => s.user_id === params[0]) };
  }

  // ── point_transactions ──
  if (s.startsWith('INSERT INTO POINT_TRANSACTIONS')) {
    store.point_transactions.push({ id: uuidv4(), user_id: params[0], points: params[1], reason: params[2], created_at: new Date().toISOString() });
    return { rows: [] };
  }

  // ── gigs ──
  if (s.startsWith('INSERT INTO GIGS')) {
    const [poster_id, title, description, category, budget_min, budget_max, location, is_remote] = params;
    const poster = store.users.find(u => u.id === poster_id);
    const gig = { id: uuidv4(), poster_id, title, description, category, budget_min, budget_max, location, is_remote, status: 'open', created_at: new Date().toISOString(), poster_name: poster?.full_name, poster_avatar: poster?.avatar_url };
    store.gigs.push(gig);
    return { rows: [gig] };
  }
  if (s.startsWith('SELECT G.*, U.FULL_NAME AS POSTER_NAME') && s.includes('WHERE G.ID=')) {
    const gig = store.gigs.find(g => g.id === params[0]);
    return { rows: gig ? [gig] : [] };
  }
  if (s.startsWith('SELECT POSTER_ID FROM GIGS WHERE ID=')) {
    const gig = store.gigs.find(g => g.id === params[0]);
    return { rows: gig ? [{ poster_id: gig.poster_id }] : [] };
  }
  if (s.startsWith('UPDATE GIGS SET STATUS=')) {
    const gig = store.gigs.find(g => g.id === params[1]);
    if (gig) gig.status = params[0];
    return { rows: [] };
  }
  if (s.startsWith('SELECT G.*, U.FULL_NAME AS POSTER_NAME')) {
    // list gigs with filters
    let rows = [...store.gigs];
    // status is always first param
    rows = rows.filter(g => g.status === params[0]);
    let pi = 1;
    if (sql.includes('g.category')) { rows = rows.filter(g => g.category === params[pi++]); }
    if (sql.includes('g.is_remote')) { rows = rows.filter(g => g.is_remote === params[pi++]); }
    const limit = params[pi++] || 20;
    const offset = params[pi] || 0;
    rows = rows.slice(offset, offset + limit);
    return { rows };
  }

  // ── gig_applications ──
  if (s.startsWith('INSERT INTO GIG_APPLICATIONS')) {
    const [gig_id, applicant_id, cover_note, proposed_fee] = params;
    const exists = store.gig_applications.find(a => a.gig_id === gig_id && a.applicant_id === applicant_id);
    if (exists) { const e = new Error('duplicate'); e.code = '23505'; throw e; }
    const app = { id: uuidv4(), gig_id, applicant_id, cover_note, proposed_fee, status: 'pending', created_at: new Date().toISOString() };
    store.gig_applications.push(app);
    return { rows: [app] };
  }
  if (s.startsWith('SELECT GA.*, U.FULL_NAME')) {
    const apps = store.gig_applications.filter(a => a.gig_id === params[0]);
    const rows = apps.map(a => {
      const u = store.users.find(u => u.id === a.applicant_id) || {};
      const skills = store.user_skills.filter(s => s.user_id === a.applicant_id).map(s => s.skill);
      return { ...a, full_name: u.full_name, avatar_url: u.avatar_url, location: u.location, skills };
    });
    return { rows };
  }
  if (s.startsWith('UPDATE GIG_APPLICATIONS SET STATUS=')) {
    const app = store.gig_applications.find(a => a.id === params[1]);
    if (app) app.status = params[0];
    return { rows: [] };
  }

  // ── courses ──
  if (s.startsWith('SELECT * FROM COURSES')) {
    let rows = [...store.courses];
    if (params.length > 0 && sql.includes('category')) rows = rows.filter(c => c.category === params[0]);
    if (sql.includes('level')) rows = rows.filter(c => c.level === params[params.length - 1]);
    return { rows };
  }
  if (s.startsWith('SELECT * FROM COURSES WHERE ID=')) {
    return { rows: store.courses.filter(c => c.id === params[0]) };
  }
  if (s.startsWith('SELECT POINTS_REWARD FROM COURSES WHERE ID=')) {
    const c = store.courses.find(c => c.id === params[0]);
    return { rows: c ? [{ points_reward: c.points_reward }] : [] };
  }

  // ── enrollments ──
  if (s.startsWith('INSERT INTO ENROLLMENTS')) {
    const [user_id, course_id] = params;
    const exists = store.enrollments.find(e => e.user_id === user_id && e.course_id === course_id);
    if (exists) return { rows: [] };
    const enr = { id: uuidv4(), user_id, course_id, progress: 0, completed: false, enrolled_at: new Date().toISOString() };
    store.enrollments.push(enr);
    return { rows: [enr] };
  }
  if (s.startsWith('UPDATE ENROLLMENTS SET PROGRESS=')) {
    const [progress, completed, user_id, course_id] = params;
    const enr = store.enrollments.find(e => e.user_id === user_id && e.course_id === course_id);
    if (enr) { enr.progress = progress; enr.completed = completed; }
    return { rows: enr ? [enr] : [] };
  }
  if (s.startsWith('SELECT C.*, E.PROGRESS')) {
    const enrs = store.enrollments.filter(e => e.user_id === params[0]);
    const rows = enrs.map(e => {
      const c = store.courses.find(c => c.id === e.course_id);
      return c ? { ...c, progress: e.progress, completed: e.completed, enrolled_at: e.enrolled_at } : null;
    }).filter(Boolean);
    return { rows };
  }
  if (s.startsWith('SELECT COURSE_ID FROM ENROLLMENTS WHERE USER_ID=')) {
    return { rows: store.enrollments.filter(e => e.user_id === params[0]) };
  }
  if (s.startsWith('SELECT COUNT(*) FROM ENROLLMENTS WHERE COMPLETED=TRUE')) {
    return { rows: [{ count: store.enrollments.filter(e => e.completed).length }] };
  }

  // ── payments ──
  if (s.startsWith('INSERT INTO PAYMENTS')) {
    const [payer_id, payee_id, gig_id, amount, method, mpesa_checkout_id] = params;
    const p = { id: uuidv4(), payer_id, payee_id, gig_id, amount, currency: 'KES', method, status: 'pending', mpesa_checkout_id, created_at: new Date().toISOString() };
    store.payments.push(p);
    return { rows: [p] };
  }
  if (s.startsWith('UPDATE PAYMENTS SET STATUS=')) {
    const p = store.payments.find(p => p.mpesa_checkout_id === params[0]);
    if (p) p.status = 'success';
    return { rows: [] };
  }

  // ── wallets ──
  if (s.startsWith('INSERT INTO WALLETS')) {
    const [user_id, balance] = params;
    const w = store.wallets.find(w => w.user_id === user_id);
    if (w) { w.balance = (parseFloat(w.balance) + parseFloat(balance)).toFixed(2); }
    else { store.wallets.push({ id: uuidv4(), user_id, balance }); }
    return { rows: [] };
  }
  if (s.startsWith('SELECT BALANCE FROM WALLETS WHERE USER_ID=')) {
    const w = store.wallets.find(w => w.user_id === params[0]);
    return { rows: w ? [{ balance: w.balance }] : [] };
  }

  // ── analytics ──
  if (s.startsWith('INSERT INTO ANALYTICS_EVENTS')) {
    store.analytics_events.push({ id: uuidv4(), user_id: params[0], event_type: params[1], metadata: params[2], country: params[3], created_at: new Date().toISOString() });
    return { rows: [] };
  }
  if (s.startsWith('SELECT COUNT(*) FROM USERS')) {
    return { rows: [{ count: store.users.length }] };
  }
  if (s.startsWith('SELECT COUNT(*), STATUS FROM GIGS GROUP BY STATUS')) {
    const grouped = {};
    store.gigs.forEach(g => { grouped[g.status] = (grouped[g.status] || 0) + 1; });
    return { rows: Object.entries(grouped).map(([status, count]) => ({ status, count })) };
  }
  if (s.startsWith('SELECT SUM(AMOUNT) AS TOTAL')) {
    const total = store.payments.filter(p => p.status === 'success').reduce((s, p) => s + parseFloat(p.amount || 0), 0);
    return { rows: [{ total, count: store.payments.filter(p => p.status === 'success').length }] };
  }
  if (s.startsWith('SELECT COUNTRY, COUNT(*) AS USERS FROM USERS')) {
    const grouped = {};
    store.users.forEach(u => { grouped[u.country] = (grouped[u.country] || 0) + 1; });
    return { rows: Object.entries(grouped).map(([country, users]) => ({ country, users })) };
  }

  // ── recommendations: courses not enrolled ──
  if (s.startsWith('SELECT * FROM COURSES') && s.includes('WHERE ID != ALL')) {
    const excluded = params[0] || [];
    const rows = store.courses.filter(c => !excluded.includes(c.id)).slice(0, 6);
    return { rows };
  }

  // fallback
  console.warn('[MockDB] Unhandled query:', sql.slice(0, 120));
  return { rows: [] };
}

// ─── Housing & Construction query handlers ───────────────────────────────────
function queryHousing(sql, params, s) {
  // ── owner_verifications ──
  if (s.includes('INSERT INTO OWNER_VERIFICATIONS') && s.includes('ON CONFLICT')) {
    const [user_id, national_id, id_doc_url, business_reg_url] = params;
    const existing = store.owner_verifications.find(v => v.user_id === user_id);
    if (existing) {
      existing.national_id = national_id; existing.id_doc_url = id_doc_url;
      existing.business_reg_url = business_reg_url; existing.status = 'pending';
      existing.updated_at = new Date().toISOString();
      return { rows: [existing] };
    }
    const v = { id: uuidv4(), user_id, national_id, id_doc_url, business_reg_url, status: 'pending', admin_note: null, reviewed_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    store.owner_verifications.push(v);
    return { rows: [v] };
  }
  if (s.startsWith('SELECT * FROM OWNER_VERIFICATIONS WHERE USER_ID=')) {
    return { rows: store.owner_verifications.filter(v => v.user_id === params[0]) };
  }
  if (s.startsWith('SELECT OV.*, U.FULL_NAME') && s.includes('FROM OWNER_VERIFICATIONS')) {
    const rows = store.owner_verifications.filter(v => v.status === 'pending').map(v => {
      const u = store.users.find(u => u.id === v.user_id) || {};
      return { ...v, full_name: u.full_name, email: u.email, phone: u.phone };
    });
    return { rows };
  }
  if (s.startsWith('UPDATE OWNER_VERIFICATIONS SET STATUS=')) {
    const [status, admin_note, reviewed_by, id] = params;
    const v = store.owner_verifications.find(v => v.id === id);
    if (v) { v.status = status; v.admin_note = admin_note; v.reviewed_by = reviewed_by; v.updated_at = new Date().toISOString(); }
    return { rows: v ? [v] : [] };
  }
  if (s.startsWith('UPDATE USERS SET IS_VERIFIED=')) {
    const [is_verified, user_id] = params;
    const u = store.users.find(u => u.id === user_id);
    if (u) u.is_verified = is_verified;
    return { rows: [] };
  }

  // ── property_listings ──
  if (s.startsWith('SELECT * FROM PROPERTY_LISTINGS WHERE STATUS=')) {
    return { rows: store.property_listings.filter(l => l.status === 'active') };
  }
  if (s.startsWith('SELECT ID, FULL_NAME, AVATAR_URL, IS_VERIFIED FROM USERS WHERE ID=')) {
    const u = store.users.find(u => u.id === params[0]);
    return { rows: u ? [{ id: u.id, full_name: u.full_name, avatar_url: u.avatar_url, is_verified: u.is_verified }] : [] };
  }
  if (s.startsWith('SELECT STATUS FROM OWNER_VERIFICATIONS WHERE USER_ID=')) {
    const v = store.owner_verifications.find(v => v.user_id === params[0]);
    return { rows: v ? [{ status: v.status }] : [] };
  }
  if (s.startsWith('INSERT INTO PROPERTY_LISTINGS')) {
    const [owner_id, title, description, property_type, rent_amount, deposit_amount, location, county, photos, available_date, bundled_services] = params;
    const l = { id: uuidv4(), owner_id, title, description, property_type, rent_amount, deposit_amount, location, county, photos, available_date, bundled_services, status: 'active', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    store.property_listings.push(l);
    return { rows: [l] };
  }
  if (s.startsWith('SELECT * FROM PROPERTY_LISTINGS WHERE OWNER_ID=')) {
    const rows = store.property_listings.filter(l => l.owner_id === params[0]).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows };
  }
  if (s.startsWith('SELECT * FROM PROPERTY_LISTINGS WHERE ID=')) {
    return { rows: store.property_listings.filter(l => l.id === params[0]) };
  }
  if (s.startsWith('SELECT OWNER_ID FROM PROPERTY_LISTINGS WHERE ID=')) {
    const l = store.property_listings.find(l => l.id === params[0]);
    return { rows: l ? [{ owner_id: l.owner_id }] : [] };
  }
  if (s.startsWith('UPDATE PROPERTY_LISTINGS SET TITLE=')) {
    const [title, description, rent_amount, deposit_amount, location, photos, available_date, bundled_services, status, id] = params;
    const l = store.property_listings.find(l => l.id === id);
    if (l) {
      if (title !== undefined) l.title = title;
      if (description !== undefined) l.description = description;
      if (rent_amount !== undefined) l.rent_amount = rent_amount;
      if (deposit_amount !== undefined) l.deposit_amount = deposit_amount;
      if (location !== undefined) l.location = location;
      if (photos !== undefined) l.photos = photos;
      if (available_date !== undefined) l.available_date = available_date;
      if (bundled_services !== undefined) l.bundled_services = bundled_services;
      if (status !== undefined) l.status = status;
      l.updated_at = new Date().toISOString();
    }
    return { rows: l ? [l] : [] };
  }
  if (s.startsWith('UPDATE PROPERTY_LISTINGS SET STATUS=')) {
    const [status, id] = params;
    const l = store.property_listings.find(l => l.id === id);
    if (l) { l.status = status; l.updated_at = new Date().toISOString(); }
    return { rows: [] };
  }
  if (s.startsWith('SELECT * FROM PROPERTY_LISTINGS WHERE ID = ANY')) {
    const ids = params[0] || [];
    return { rows: store.property_listings.filter(l => ids.includes(l.id)) };
  }
  if (s.includes('SELECT ID, FULL_NAME, AVATAR_URL, BIO, LOCATION, IS_VERIFIED FROM USERS WHERE ID=')) {
    const u = store.users.find(u => u.id === params[0]);
    return { rows: u ? [{ id: u.id, full_name: u.full_name, avatar_url: u.avatar_url, bio: u.bio, location: u.location, is_verified: u.is_verified }] : [] };
  }

  // ── listing_bookmarks ──
  if (s.includes('INSERT INTO LISTING_BOOKMARKS') && s.includes('ON CONFLICT')) {
    const [user_id, listing_id] = params;
    if (!store.listing_bookmarks.find(b => b.user_id === user_id && b.listing_id === listing_id)) {
      store.listing_bookmarks.push({ id: uuidv4(), user_id, listing_id });
    }
    return { rows: [] };
  }
  if (s.startsWith('DELETE FROM LISTING_BOOKMARKS WHERE USER_ID=')) {
    store.listing_bookmarks = store.listing_bookmarks.filter(
      b => !(b.user_id === params[0] && b.listing_id === params[1])
    );
    return { rows: [] };
  }
  if (s.startsWith('SELECT LISTING_ID FROM LISTING_BOOKMARKS WHERE USER_ID=')) {
    return { rows: store.listing_bookmarks.filter(b => b.user_id === params[0]) };
  }

  // ── rental_escrows ──
  if (s.startsWith('SELECT ID FROM RENTAL_ESCROWS WHERE LISTING_ID=')) {
    const rows = store.rental_escrows.filter(e =>
      e.listing_id === params[0] && e.tenant_id === params[1] &&
      !['refunded', 'released'].includes(e.status)
    );
    return { rows };
  }
  if (s.startsWith('INSERT INTO RENTAL_ESCROWS')) {
    const [listing_id, tenant_id, landlord_id, amount, method, expires_at] = params;
    const e = { id: uuidv4(), listing_id, tenant_id, landlord_id, amount, method, status: 'pending_payment', tenant_confirmed: false, landlord_confirmed: false, tenant_confirmed_at: null, landlord_confirmed_at: null, funded_at: null, released_at: null, cancelled_by: null, refund_amount: null, expires_at, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    store.rental_escrows.push(e);
    return { rows: [e] };
  }
  if (s.startsWith('SELECT E.*, L.TITLE AS LISTING_TITLE') && s.includes('FROM RENTAL_ESCROWS')) {
    const rows = store.rental_escrows
      .filter(e => e.tenant_id === params[0] || e.landlord_id === params[0])
      .map(e => {
        const l = store.property_listings.find(l => l.id === e.listing_id) || {};
        return { ...e, listing_title: l.title, listing_location: l.location, rent_amount: l.rent_amount, property_type: l.property_type };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows };
  }
  if (s.startsWith('SELECT E.*, L.TITLE AS LISTING_TITLE') && s.includes('WHERE E.ID=')) {
    const e = store.rental_escrows.find(e => e.id === params[0]);
    if (!e) return { rows: [] };
    const l = store.property_listings.find(l => l.id === e.listing_id) || {};
    return { rows: [{ ...e, listing_title: l.title, rent_amount: l.rent_amount, deposit_amount: l.deposit_amount, location: l.location }] };
  }
  if (s.startsWith('SELECT * FROM RENTAL_ESCROWS WHERE ID=')) {
    return { rows: store.rental_escrows.filter(e => e.id === params[0]) };
  }
  if (s.startsWith('UPDATE RENTAL_ESCROWS SET STATUS=') && s.includes('FUNDED_AT=NOW()')) {
    const e = store.rental_escrows.find(e => e.id === params[0]);
    if (e) { e.status = 'funded'; e.funded_at = new Date().toISOString(); }
    return { rows: e ? [e] : [] };
  }
  if (s.startsWith('UPDATE RENTAL_ESCROWS SET TENANT_CONFIRMED=TRUE')) {
    const e = store.rental_escrows.find(e => e.id === params[0]);
    if (e) { e.tenant_confirmed = true; e.tenant_confirmed_at = new Date().toISOString(); }
    return { rows: e ? [e] : [] };
  }
  if (s.startsWith('UPDATE RENTAL_ESCROWS SET LANDLORD_CONFIRMED=TRUE')) {
    const e = store.rental_escrows.find(e => e.id === params[0]);
    if (e) { e.landlord_confirmed = true; e.landlord_confirmed_at = new Date().toISOString(); }
    return { rows: e ? [e] : [] };
  }
  if (s.startsWith('UPDATE RENTAL_ESCROWS SET STATUS=') && s.includes('RELEASED_AT=NOW()')) {
    const e = store.rental_escrows.find(e => e.id === params[0]);
    if (e) { e.status = 'released'; e.released_at = new Date().toISOString(); }
    return { rows: [] };
  }
  if (s.startsWith('UPDATE RENTAL_ESCROWS SET STATUS=') && s.includes('CANCELLED_BY=')) {
    const [status, cancelled_by, refund_amount, id] = params;
    const e = store.rental_escrows.find(e => e.id === id);
    if (e) { e.status = status; e.cancelled_by = cancelled_by; e.refund_amount = refund_amount; e.updated_at = new Date().toISOString(); }
    return { rows: [] };
  }
  if (s.startsWith('UPDATE RENTAL_ESCROWS SET STATUS=') && s.includes('DISPUTED')) {
    const e = store.rental_escrows.find(e => e.id === params[0]);
    if (e) e.status = 'disputed';
    return { rows: [] };
  }

  // ── listing_messages ──
  if (s.startsWith('INSERT INTO LISTING_MESSAGES')) {
    const [listing_id, sender_id, body] = params;
    const m = { id: uuidv4(), listing_id, sender_id, body, created_at: new Date().toISOString() };
    store.listing_messages.push(m);
    return { rows: [m] };
  }
  if (s.startsWith('SELECT M.*, U.FULL_NAME AS SENDER_NAME') && s.includes('FROM LISTING_MESSAGES')) {
    const rows = store.listing_messages.filter(m => m.listing_id === params[0]).map(m => {
      const u = store.users.find(u => u.id === m.sender_id) || {};
      return { ...m, sender_name: u.full_name, sender_avatar: u.avatar_url };
    });
    return { rows };
  }

  // ── construction_projects ──
  if (s.startsWith('INSERT INTO CONSTRUCTION_PROJECTS')) {
    const [owner_id, name, description, location, project_type, estimated_start, estimated_end, total_budget] = params;
    const p = { id: uuidv4(), owner_id, name, description, location, project_type, estimated_start, estimated_end, total_budget, status: 'planning', created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    store.construction_projects.push(p);
    return { rows: [p] };
  }
  if (s.startsWith('SELECT P.*, U.FULL_NAME AS OWNER_NAME, U.AVATAR_URL AS OWNER_AVATAR')) {
    const p = store.construction_projects.find(p => p.id === params[0]);
    if (!p) return { rows: [] };
    const u = store.users.find(u => u.id === p.owner_id) || {};
    return { rows: [{ ...p, owner_name: u.full_name, owner_avatar: u.avatar_url }] };
  }
  if (s.startsWith('SELECT P.*, U.FULL_NAME AS OWNER_NAME FROM CONSTRUCTION_PROJECTS P')) {
    const rows = store.construction_projects
      .filter(p => params[0].includes(p.id))
      .map(p => {
        const u = store.users.find(u => u.id === p.owner_id) || {};
        return { ...p, owner_name: u.full_name };
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows };
  }
  if (s.startsWith('UPDATE CONSTRUCTION_PROJECTS SET')) {
    const [name, description, status, estimated_end, total_budget, id] = params;
    const p = store.construction_projects.find(p => p.id === id);
    if (p) {
      if (name !== undefined) p.name = name;
      if (description !== undefined) p.description = description;
      if (status !== undefined) p.status = status;
      if (estimated_end !== undefined) p.estimated_end = estimated_end;
      if (total_budget !== undefined) p.total_budget = total_budget;
      p.updated_at = new Date().toISOString();
    }
    return { rows: p ? [p] : [] };
  }
  if (s.startsWith('SELECT NAME FROM CONSTRUCTION_PROJECTS WHERE ID=')) {
    const p = store.construction_projects.find(p => p.id === params[0]);
    return { rows: p ? [{ name: p.name }] : [] };
  }
  if (s.startsWith('SELECT * FROM CONSTRUCTION_PROJECTS WHERE ID=')) {
    return { rows: store.construction_projects.filter(p => p.id === params[0]) };
  }
  if (s.startsWith('SELECT OWNER_ID, NAME FROM CONSTRUCTION_PROJECTS WHERE ID=')) {
    const p = store.construction_projects.find(p => p.id === params[0]);
    return { rows: p ? [{ owner_id: p.owner_id, name: p.name }] : [] };
  }

  // ── project_members ──
  if (s.startsWith('INSERT INTO PROJECT_MEMBERS') && !s.includes('ON CONFLICT')) {
    const [project_id, user_id, member_role, accepted] = params;
    const exists = store.project_members.find(m => m.project_id === project_id && m.user_id === user_id);
    if (exists) { const e = new Error('duplicate'); e.code = '23505'; throw e; }
    const m = { id: uuidv4(), project_id, user_id, member_role, accepted: accepted !== undefined ? accepted : true, created_at: new Date().toISOString() };
    store.project_members.push(m);
    return { rows: [m] };
  }
  if (s.startsWith('INSERT INTO PROJECT_MEMBERS') && s.includes('ON CONFLICT')) {
    // auto-add owner
    const [project_id, user_id, member_role] = params;
    const exists = store.project_members.find(m => m.project_id === project_id && m.user_id === user_id);
    if (!exists) store.project_members.push({ id: uuidv4(), project_id, user_id, member_role, accepted: true, created_at: new Date().toISOString() });
    return { rows: [] };
  }
  if (s.startsWith('SELECT PROJECT_ID FROM PROJECT_MEMBERS WHERE USER_ID=')) {
    return { rows: store.project_members.filter(m => m.user_id === params[0]) };
  }
  if (s.startsWith('SELECT MEMBER_ROLE FROM PROJECT_MEMBERS WHERE PROJECT_ID=') && s.includes('AND USER_ID=') && !s.includes('AND ACCEPTED=TRUE')) {
    const m = store.project_members.find(m => m.project_id === params[0] && m.user_id === params[1]);
    return { rows: m ? [{ member_role: m.member_role }] : [] };
  }
  if (s.startsWith('SELECT MEMBER_ROLE FROM PROJECT_MEMBERS WHERE PROJECT_ID=') && s.includes('AND ACCEPTED=TRUE')) {
    const m = store.project_members.find(m => m.project_id === params[0] && m.user_id === params[1] && m.accepted);
    return { rows: m ? [{ member_role: m.member_role }] : [] };
  }
  if (s.startsWith('SELECT COUNT(*) FROM PROJECT_MEMBERS WHERE PROJECT_ID=')) {
    return { rows: [{ count: store.project_members.filter(m => m.project_id === params[0]).length }] };
  }
  if (s.startsWith('SELECT PM.*, U.FULL_NAME, U.AVATAR_URL, U.EMAIL FROM PROJECT_MEMBERS')) {
    const rows = store.project_members.filter(m => m.project_id === params[0]).map(m => {
      const u = store.users.find(u => u.id === m.user_id) || {};
      return { ...m, full_name: u.full_name, avatar_url: u.avatar_url, email: u.email };
    });
    return { rows };
  }
  if (s.startsWith('SELECT USER_ID FROM PROJECT_MEMBERS WHERE PROJECT_ID=') && s.includes('MEMBER_ROLE IN')) {
    return { rows: store.project_members.filter(m => m.project_id === params[0] && ['owner','engineer'].includes(m.member_role)) };
  }
  if (s.startsWith('UPDATE PROJECT_MEMBERS SET ACCEPTED=TRUE')) {
    const m = store.project_members.find(m => m.project_id === params[0] && m.user_id === params[1]);
    if (m) m.accepted = true;
    return { rows: m ? [m] : [] };
  }

  // ── project_updates ──
  if (s.startsWith('INSERT INTO PROJECT_UPDATES')) {
    const [project_id, submitted_by, title, description, phase, percentage_complete, photos, is_fixr_verified] = params;
    const u = { id: uuidv4(), project_id, submitted_by, title, description, phase, percentage_complete, photos, is_fixr_verified, created_at: new Date().toISOString() };
    store.project_updates.push(u);
    return { rows: [u] };
  }
  if (s.startsWith('SELECT PU.*, U.FULL_NAME AS CONTRIBUTOR_NAME')) {
    const rows = store.project_updates.filter(u => u.project_id === params[0]).map(u => {
      const user = store.users.find(usr => usr.id === u.submitted_by) || {};
      const member = store.project_members.find(m => m.user_id === u.submitted_by && m.project_id === u.project_id) || {};
      return { ...u, contributor_name: user.full_name, contributor_avatar: user.avatar_url, contributor_role: member.member_role };
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows };
  }
  if (s.startsWith('SELECT CREATED_AT FROM PROJECT_UPDATES WHERE PROJECT_ID=')) {
    const rows = store.project_updates.filter(u => u.project_id === params[0]).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: rows.length ? [{ created_at: rows[0].created_at }] : [] };
  }
  if (s.startsWith('UPDATE PROJECT_MILESTONES SET STATUS=') && s.includes('TARGET_PERCENTAGE')) {
    const [status, id, pct] = params;
    // params: status='achieved', achieved_at in SQL, project_id=$1, target_percentage <= $2
    // actual params passed: project_id, pct
    store.project_milestones
      .filter(m => m.project_id === params[0] && m.status === 'pending' && parseFloat(m.target_percentage) <= parseFloat(params[1]))
      .forEach(m => { m.status = 'achieved'; m.achieved_at = new Date().toISOString(); });
    return { rows: [] };
  }

  // ── project_milestones ──
  if (s.startsWith('SELECT * FROM PROJECT_MILESTONES WHERE PROJECT_ID=')) {
    const rows = store.project_milestones.filter(m => m.project_id === params[0]).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
    return { rows };
  }
  if (s.startsWith('SELECT COUNT(*) FROM PROJECT_MILESTONES WHERE PROJECT_ID=')) {
    return { rows: [{ count: store.project_milestones.filter(m => m.project_id === params[0]).length }] };
  }
  if (s.startsWith('INSERT INTO PROJECT_MILESTONES')) {
    const [project_id, title, description, due_date, target_percentage] = params;
    const m = { id: uuidv4(), project_id, title, description, due_date, target_percentage, status: 'pending', achieved_at: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    store.project_milestones.push(m);
    return { rows: [m] };
  }
  if (s.startsWith('UPDATE PROJECT_MILESTONES SET STATUS=') && s.includes('WHERE ID=')) {
    const [status, id] = params;
    const m = store.project_milestones.find(m => m.id === id);
    if (m) { m.status = status; m.updated_at = new Date().toISOString(); }
    return { rows: m ? [m] : [] };
  }

  // ── notifications ──
  if (s.startsWith('INSERT INTO NOTIFICATIONS')) {
    // handles both single and multi-row inserts
    const body = sql;
    // Single row: (user_id, type, title, body, metadata)
    if (params.length === 5 || (params.length <= 10 && !body.includes('VALUES ($1'))) {
      const [user_id, type, title, notif_body, metadata] = params;
      const n = { id: uuidv4(), user_id, type, title, body: notif_body, metadata, is_read: false, created_at: new Date().toISOString() };
      store.notifications.push(n);
      return { rows: [n] };
    }
    // Multi-row (2 rows, 8 params)
    if (params.length === 8) {
      for (let i = 0; i < 2; i++) {
        const offset = i * 4;
        const n = { id: uuidv4(), user_id: params[offset], type: params[offset+1], title: params[offset+2], body: params[offset+3], metadata: null, is_read: false, created_at: new Date().toISOString() };
        store.notifications.push(n);
      }
    }
    return { rows: [] };
  }
  if (s.startsWith('SELECT * FROM NOTIFICATIONS WHERE USER_ID=')) {
    const rows = store.notifications.filter(n => n.user_id === params[0]).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 50);
    return { rows };
  }
  if (s.startsWith('SELECT COUNT(*) FROM NOTIFICATIONS WHERE USER_ID=') && s.includes('IS_READ=FALSE')) {
    return { rows: [{ count: store.notifications.filter(n => n.user_id === params[0] && !n.is_read).length }] };
  }
  if (s.startsWith('UPDATE NOTIFICATIONS SET IS_READ=TRUE WHERE ID=')) {
    const n = store.notifications.find(n => n.id === params[0] && n.user_id === params[1]);
    if (n) n.is_read = true;
    return { rows: [] };
  }
  if (s.startsWith('UPDATE NOTIFICATIONS SET IS_READ=TRUE WHERE USER_ID=')) {
    store.notifications.filter(n => n.user_id === params[0]).forEach(n => n.is_read = true);
    return { rows: [] };
  }

  return null; // not handled here
}

// Wrap the original query to include housing/construction handlers
const _origQuery = query;
function queryAll(sql, params = []) {
  const normalized = sql.trim().replace(/\s+/g, ' ');
  const s = normalized.toUpperCase();

  const housingResult = queryHousing(normalized, params, s);
  if (housingResult !== null) return housingResult;
  return _origQuery(sql, params);
}

module.exports = { query: queryAll };
