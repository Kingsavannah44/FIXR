const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const db = require('../db');

// ─── VERIFICATION ────────────────────────────────────────────────────────────

// POST /api/housing/verify  — submit owner verification request
router.post('/verify', auth, async (req, res) => {
  const { national_id, id_doc_url, business_reg_url } = req.body;
  if (!national_id) return res.status(400).json({ error: 'national_id required' });
  try {
    const { rows } = await db.query(
      `INSERT INTO owner_verifications (user_id, national_id, id_doc_url, business_reg_url)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id) DO UPDATE
         SET national_id=$2, id_doc_url=$3, business_reg_url=$4, status='pending', updated_at=NOW()
       RETURNING *`,
      [req.user.id, national_id, id_doc_url || null, business_reg_url || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/housing/verify/me  — check own verification status
router.get('/verify/me', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT * FROM owner_verifications WHERE user_id=$1`, [req.user.id]
  );
  res.json(rows[0] || { status: 'not_submitted' });
});

// GET /api/housing/verify/pending  — admin: list pending verifications
router.get('/verify/pending', auth, role('admin'), async (req, res) => {
  const { rows } = await db.query(
    `SELECT ov.*, u.full_name, u.email, u.phone FROM owner_verifications ov
     JOIN users u ON u.id = ov.user_id
     WHERE ov.status='pending' ORDER BY ov.created_at ASC`
  );
  res.json(rows);
});

// PATCH /api/housing/verify/:id  — admin: approve/reject/revoke
router.patch('/verify/:id', auth, role('admin'), async (req, res) => {
  const { status, admin_note } = req.body; // 'approved'|'rejected'|'revoked'
  if (!['approved', 'rejected', 'revoked'].includes(status))
    return res.status(400).json({ error: 'Invalid status' });

  const { rows } = await db.query(
    `UPDATE owner_verifications
     SET status=$1, admin_note=$2, reviewed_by=$3, updated_at=NOW()
     WHERE id=$4 RETURNING *`,
    [status, admin_note || null, req.user.id, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Verification not found' });

  // Sync is_verified on user
  const isVerified = status === 'approved';
  if (status !== 'rejected') {
    await db.query(`UPDATE users SET is_verified=$1 WHERE id=$2`, [isVerified, rows[0].user_id]);
  }

  // If revoked, hide all active listings
  if (status === 'revoked') {
    await db.query(
      `UPDATE property_listings SET status='paused' WHERE owner_id=$1 AND status='active'`,
      [rows[0].user_id]
    );
  }

  res.json(rows[0]);
});

// ─── LISTINGS ────────────────────────────────────────────────────────────────

// GET /api/housing/listings  — public browse with filters
router.get('/listings', async (req, res) => {
  const { location, type, min_price, max_price, services, page = 1, limit = 20 } = req.query;
  let listings = await db.query(`SELECT * FROM property_listings WHERE status='active'`);
  let rows = listings.rows;

  if (location) rows = rows.filter(l => l.location?.toLowerCase().includes(location.toLowerCase()));
  if (type) rows = rows.filter(l => l.property_type === type);
  if (min_price) rows = rows.filter(l => parseFloat(l.rent_amount) >= parseFloat(min_price));
  if (max_price) rows = rows.filter(l => parseFloat(l.rent_amount) <= parseFloat(max_price));
  if (services) {
    const svcList = services.split(',');
    rows = rows.filter(l => svcList.every(s => (l.bundled_services || []).includes(s)));
  }

  // Enrich with owner info
  const enriched = await Promise.all(rows.map(async (l) => {
    const { rows: ownerRows } = await db.query(
      `SELECT id, full_name, avatar_url, is_verified FROM users WHERE id=$1`, [l.owner_id]
    );
    const { rows: verRows } = await db.query(
      `SELECT status FROM owner_verifications WHERE user_id=$1`, [l.owner_id]
    );
    return {
      ...l,
      owner_name: ownerRows[0]?.full_name,
      owner_avatar: ownerRows[0]?.avatar_url,
      owner_verified: verRows[0]?.status === 'approved',
    };
  }));

  const offset = (page - 1) * limit;
  res.json(enriched.slice(offset, offset + Number(limit)));
});

// POST /api/housing/listings  — verified owner creates listing
router.post('/listings', auth, async (req, res) => {
  // Check verification
  const { rows: verRows } = await db.query(
    `SELECT status FROM owner_verifications WHERE user_id=$1`, [req.user.id]
  );
  if (!verRows[0] || verRows[0].status !== 'approved')
    return res.status(403).json({ error: 'Owner verification required to list property' });

  const {
    title, description, property_type, rent_amount, deposit_amount,
    location, county, photos, available_date, bundled_services
  } = req.body;

  if (!title || !property_type || !rent_amount || !location)
    return res.status(400).json({ error: 'title, property_type, rent_amount, location required' });

  const { rows } = await db.query(
    `INSERT INTO property_listings
       (owner_id, title, description, property_type, rent_amount, deposit_amount,
        location, county, photos, available_date, bundled_services)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [req.user.id, title, description, property_type, rent_amount, deposit_amount || 0,
     location, county || null, JSON.stringify(photos || []),
     available_date || null, JSON.stringify(bundled_services || [])]
  );
  res.status(201).json(rows[0]);
});

// GET /api/housing/listings/mine  — owner's own listings
router.get('/listings/mine', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT * FROM property_listings WHERE owner_id=$1 ORDER BY created_at DESC`, [req.user.id]
  );
  res.json(rows);
});

// GET /api/housing/listings/:id  — single listing detail
router.get('/listings/:id', async (req, res) => {
  const { rows } = await db.query(
    `SELECT * FROM property_listings WHERE id=$1`, [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Listing not found' });
  const listing = rows[0];

  const { rows: ownerRows } = await db.query(
    `SELECT id, full_name, avatar_url, bio, location, is_verified FROM users WHERE id=$1`,
    [listing.owner_id]
  );
  const { rows: verRows } = await db.query(
    `SELECT status FROM owner_verifications WHERE user_id=$1`, [listing.owner_id]
  );

  res.json({
    ...listing,
    owner: ownerRows[0],
    owner_verified: verRows[0]?.status === 'approved',
  });
});

// PATCH /api/housing/listings/:id  — owner updates listing
router.patch('/listings/:id', auth, async (req, res) => {
  const { rows: [listing] } = await db.query(
    `SELECT owner_id FROM property_listings WHERE id=$1`, [req.params.id]
  );
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (listing.owner_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });

  const { title, description, rent_amount, deposit_amount, location,
          photos, available_date, bundled_services, status } = req.body;
  const { rows } = await db.query(
    `UPDATE property_listings SET
       title=COALESCE($1,title), description=COALESCE($2,description),
       rent_amount=COALESCE($3,rent_amount), deposit_amount=COALESCE($4,deposit_amount),
       location=COALESCE($5,location), photos=COALESCE($6,photos),
       available_date=COALESCE($7,available_date), bundled_services=COALESCE($8,bundled_services),
       status=COALESCE($9,status), updated_at=NOW()
     WHERE id=$10 RETURNING *`,
    [title, description, rent_amount, deposit_amount, location,
     photos ? JSON.stringify(photos) : null,
     available_date,
     bundled_services ? JSON.stringify(bundled_services) : null,
     status, req.params.id]
  );
  res.json(rows[0]);
});

// ─── BOOKMARKS ───────────────────────────────────────────────────────────────

// POST /api/housing/listings/:id/bookmark
router.post('/listings/:id/bookmark', auth, async (req, res) => {
  await db.query(
    `INSERT INTO listing_bookmarks (user_id, listing_id) VALUES ($1,$2)
     ON CONFLICT DO NOTHING`,
    [req.user.id, req.params.id]
  );
  res.json({ bookmarked: true });
});

// DELETE /api/housing/listings/:id/bookmark
router.delete('/listings/:id/bookmark', auth, async (req, res) => {
  await db.query(
    `DELETE FROM listing_bookmarks WHERE user_id=$1 AND listing_id=$2`,
    [req.user.id, req.params.id]
  );
  res.json({ bookmarked: false });
});

// GET /api/housing/bookmarks  — tenant's saved listings
router.get('/bookmarks', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT listing_id FROM listing_bookmarks WHERE user_id=$1`, [req.user.id]
  );
  const ids = rows.map(r => r.listing_id);
  if (!ids.length) return res.json([]);
  const { rows: listings } = await db.query(
    `SELECT * FROM property_listings WHERE id = ANY($1)`, [ids]
  );
  res.json(listings);
});

// ─── ESCROW ──────────────────────────────────────────────────────────────────

// POST /api/housing/escrow  — tenant initiates escrow
router.post('/escrow', auth, async (req, res) => {
  const { listing_id, method = 'wallet' } = req.body;
  if (!listing_id) return res.status(400).json({ error: 'listing_id required' });

  const { rows: [listing] } = await db.query(
    `SELECT * FROM property_listings WHERE id=$1`, [listing_id]
  );
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (listing.status !== 'active')
    return res.status(409).json({ error: 'Listing is not available' });

  // Prevent duplicate escrow
  const { rows: existing } = await db.query(
    `SELECT id FROM rental_escrows WHERE listing_id=$1 AND tenant_id=$2 AND status NOT IN ('refunded','released')`,
    [listing_id, req.user.id]
  );
  if (existing.length) return res.status(409).json({ error: 'Escrow already active for this listing' });

  const total = parseFloat(listing.rent_amount) + parseFloat(listing.deposit_amount || 0);
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const { rows } = await db.query(
    `INSERT INTO rental_escrows
       (listing_id, tenant_id, landlord_id, amount, method, expires_at)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [listing_id, req.user.id, listing.owner_id, total, method, expiresAt]
  );

  // Mark listing as under_offer
  await db.query(
    `UPDATE property_listings SET status='under_offer' WHERE id=$1`, [listing_id]
  );

  // Notify landlord
  await db.query(
    `INSERT INTO notifications (user_id, type, title, body, metadata)
     VALUES ($1,'escrow_created','New Rental Offer',$2,$3)`,
    [listing.owner_id,
     `A tenant has initiated an escrow for your property: ${listing.title}`,
     JSON.stringify({ escrow_id: rows[0].id, listing_id })]
  );

  res.status(201).json(rows[0]);
});

// GET /api/housing/escrow/mine  — view own escrows (as tenant or landlord)
router.get('/escrow/mine', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT e.*, l.title AS listing_title, l.location AS listing_location,
       l.rent_amount, l.property_type
     FROM rental_escrows e JOIN property_listings l ON l.id = e.listing_id
     WHERE e.tenant_id=$1 OR e.landlord_id=$1
     ORDER BY e.created_at DESC`,
    [req.user.id]
  );
  res.json(rows);
});

// GET /api/housing/escrow/:id
router.get('/escrow/:id', auth, async (req, res) => {
  const { rows } = await db.query(
    `SELECT e.*, l.title AS listing_title, l.rent_amount, l.deposit_amount, l.location
     FROM rental_escrows e JOIN property_listings l ON l.id = e.listing_id
     WHERE e.id=$1`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Escrow not found' });
  const escrow = rows[0];
  if (escrow.tenant_id !== req.user.id && escrow.landlord_id !== req.user.id && req.user.role !== 'admin')
    return res.status(403).json({ error: 'Forbidden' });
  res.json(escrow);
});

// POST /api/housing/escrow/:id/fund  — mark escrow as funded (after payment)
router.post('/escrow/:id/fund', auth, async (req, res) => {
  const { rows: [escrow] } = await db.query(
    `SELECT * FROM rental_escrows WHERE id=$1`, [req.params.id]
  );
  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
  if (escrow.tenant_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  if (escrow.status !== 'pending_payment')
    return res.status(409).json({ error: `Cannot fund: escrow is ${escrow.status}` });

  const { rows } = await db.query(
    `UPDATE rental_escrows SET status='funded', funded_at=NOW() WHERE id=$1 RETURNING *`,
    [req.params.id]
  );

  await db.query(
    `INSERT INTO notifications (user_id, type, title, body, metadata)
     VALUES ($1,'escrow_funded','Escrow Funded',$2,$3)`,
    [escrow.landlord_id,
     'A tenant has funded the escrow. Please confirm once they move in.',
     JSON.stringify({ escrow_id: escrow.id })]
  );

  res.json(rows[0]);
});

// POST /api/housing/escrow/:id/confirm  — dual confirmation: tenant or landlord
router.post('/escrow/:id/confirm', auth, async (req, res) => {
  const { rows: [escrow] } = await db.query(
    `SELECT * FROM rental_escrows WHERE id=$1`, [req.params.id]
  );
  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
  if (escrow.status !== 'funded')
    return res.status(409).json({ error: `Cannot confirm: escrow is ${escrow.status}` });

  let updateFields = '';
  let notifyUserId = null;
  let notifyBody = '';

  if (escrow.tenant_id === req.user.id && !escrow.tenant_confirmed) {
    updateFields = 'tenant_confirmed=true, tenant_confirmed_at=NOW()';
    notifyUserId = escrow.landlord_id;
    notifyBody = 'The tenant has confirmed move-in. Please confirm on your side to release funds.';
  } else if (escrow.landlord_id === req.user.id && !escrow.landlord_confirmed) {
    updateFields = 'landlord_confirmed=true, landlord_confirmed_at=NOW()';
    notifyUserId = escrow.tenant_id;
    notifyBody = 'The landlord has confirmed. Awaiting your confirmation to release funds.';
  } else {
    return res.status(409).json({ error: 'Already confirmed or not authorised' });
  }

  const { rows: [updated] } = await db.query(
    `UPDATE rental_escrows SET ${updateFields} WHERE id=$1 RETURNING *`,
    [req.params.id]
  );

  // Check if both confirmed — auto-release
  if (updated.tenant_confirmed && updated.landlord_confirmed) {
    await db.query(
      `UPDATE rental_escrows SET status='released', released_at=NOW() WHERE id=$1`,
      [req.params.id]
    );
    await db.query(
      `UPDATE property_listings SET status='rented' WHERE id=$1`, [escrow.listing_id]
    );
    // Credit landlord wallet
    await db.query(
      `INSERT INTO wallets (user_id, balance) VALUES ($1,$2)
       ON CONFLICT (user_id) DO UPDATE SET balance = wallets.balance + $2`,
      [escrow.landlord_id, escrow.amount]
    );
    await db.query(
      `INSERT INTO notifications (user_id, type, title, body, metadata) VALUES
       ($1,'escrow_released','Payment Released','Your escrow has been released. Funds are in your wallet.',$2),
       ($3,'escrow_released','Move-In Confirmed','Your move-in is confirmed. Enjoy your new home!',$4)`,
      [escrow.landlord_id, JSON.stringify({ escrow_id: escrow.id }),
       escrow.tenant_id, JSON.stringify({ escrow_id: escrow.id })]
    );
    return res.json({ status: 'released', message: 'Both parties confirmed. Funds released to landlord.' });
  }

  if (notifyUserId) {
    await db.query(
      `INSERT INTO notifications (user_id, type, title, body, metadata)
       VALUES ($1,'escrow_confirm','Escrow Confirmation',$2,$3)`,
      [notifyUserId, notifyBody, JSON.stringify({ escrow_id: escrow.id })]
    );
  }

  res.json(updated);
});

// POST /api/housing/escrow/:id/cancel  — cancel and trigger refund logic
router.post('/escrow/:id/cancel', auth, async (req, res) => {
  const { rows: [escrow] } = await db.query(
    `SELECT * FROM rental_escrows WHERE id=$1`, [req.params.id]
  );
  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
  if (!['pending_payment', 'funded'].includes(escrow.status))
    return res.status(409).json({ error: `Cannot cancel: escrow is ${escrow.status}` });

  const cancelledBy = escrow.tenant_id === req.user.id ? 'tenant'
    : escrow.landlord_id === req.user.id ? 'landlord'
    : req.user.role === 'admin' ? 'admin' : null;
  if (!cancelledBy) return res.status(403).json({ error: 'Forbidden' });

  let refundAmount = parseFloat(escrow.amount);
  let cancellationFee = 0;

  // Tenant cancels after funding → 10% fee to landlord
  if (cancelledBy === 'tenant' && escrow.status === 'funded') {
    cancellationFee = refundAmount * 0.10;
    refundAmount = refundAmount - cancellationFee;
    await db.query(
      `INSERT INTO wallets (user_id, balance) VALUES ($1,$2)
       ON CONFLICT (user_id) DO UPDATE SET balance = wallets.balance + $2`,
      [escrow.landlord_id, cancellationFee]
    );
  }

  await db.query(
    `UPDATE rental_escrows SET status='refunded', cancelled_by=$1, refund_amount=$2, updated_at=NOW()
     WHERE id=$3`,
    [cancelledBy, refundAmount, req.params.id]
  );
  await db.query(
    `UPDATE property_listings SET status='active' WHERE id=$1`, [escrow.listing_id]
  );

  res.json({ status: 'refunded', refund_amount: refundAmount, cancellation_fee: cancellationFee });
});

// POST /api/housing/escrow/:id/dispute  — raise a dispute
router.post('/escrow/:id/dispute', auth, async (req, res) => {
  const { reason } = req.body;
  const { rows: [escrow] } = await db.query(
    `SELECT * FROM rental_escrows WHERE id=$1`, [req.params.id]
  );
  if (!escrow) return res.status(404).json({ error: 'Escrow not found' });
  if (escrow.tenant_id !== req.user.id && escrow.landlord_id !== req.user.id)
    return res.status(403).json({ error: 'Forbidden' });

  await db.query(
    `UPDATE rental_escrows SET status='disputed' WHERE id=$1`, [req.params.id]
  );
  await db.query(
    `INSERT INTO notifications (user_id, type, title, body, metadata)
     VALUES ($1,'dispute_raised','Dispute Raised',$2,$3)`,
    [escrow.landlord_id === req.user.id ? escrow.tenant_id : escrow.landlord_id,
     `A dispute has been raised: ${reason}`,
     JSON.stringify({ escrow_id: escrow.id, raised_by: req.user.id })]
  );
  res.json({ status: 'disputed', reason });
});

// ─── MESSAGES ────────────────────────────────────────────────────────────────

// POST /api/housing/listings/:id/messages
router.post('/listings/:id/messages', auth, async (req, res) => {
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'Message body required' });

  const { rows: [listing] } = await db.query(
    `SELECT owner_id FROM property_listings WHERE id=$1`, [req.params.id]
  );
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const { rows } = await db.query(
    `INSERT INTO listing_messages (listing_id, sender_id, body)
     VALUES ($1,$2,$3) RETURNING *`,
    [req.params.id, req.user.id, body.trim()]
  );

  const recipientId = listing.owner_id === req.user.id
    ? null // owner messaging — need tenant context; skip notify for now
    : listing.owner_id;

  if (recipientId) {
    await db.query(
      `INSERT INTO notifications (user_id, type, title, body, metadata)
       VALUES ($1,'new_message','New Message',$2,$3)`,
      [recipientId, 'You have a new message about your listing.',
       JSON.stringify({ listing_id: req.params.id })]
    );
  }

  res.status(201).json(rows[0]);
});

// GET /api/housing/listings/:id/messages
router.get('/listings/:id/messages', auth, async (req, res) => {
  const { rows: [listing] } = await db.query(
    `SELECT owner_id FROM property_listings WHERE id=$1`, [req.params.id]
  );
  if (!listing) return res.status(404).json({ error: 'Listing not found' });

  const { rows } = await db.query(
    `SELECT m.*, u.full_name AS sender_name, u.avatar_url AS sender_avatar
     FROM listing_messages m JOIN users u ON u.id = m.sender_id
     WHERE m.listing_id=$1 ORDER BY m.created_at ASC`,
    [req.params.id]
  );
  res.json(rows);
});

module.exports = router;
