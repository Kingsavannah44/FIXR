const router = require('express').Router();
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const db = require('../db');
const mpesa = require('../services/mpesa');

// GET /api/payments/history  (admin)
router.get('/history', auth, role('admin'), async (req, res) => {
  const { rows } = await db.query(
    `SELECT p.*, u.full_name AS user_name, u.phone FROM payments p
     LEFT JOIN users u ON u.id = p.payer_id
     ORDER BY p.created_at DESC LIMIT 100`
  );
  res.json(rows);
});

// POST /api/payments/mpesa/stkpush
router.post('/mpesa/stkpush', auth, async (req, res) => {
  const { phone, amount, gig_id, payee_id } = req.body;
  try {
    const stkRes = await mpesa.initiateSTKPush({ phone, amount });
    const { rows } = await db.query(
      `INSERT INTO payments (payer_id, payee_id, gig_id, amount, method, mpesa_checkout_id)
       VALUES ($1,$2,$3,$4,'mpesa',$5) RETURNING *`,
      [req.user.id, payee_id, gig_id, amount, stkRes.CheckoutRequestID]
    );
    res.json({ payment: rows[0], mpesa: stkRes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments/mpesa/callback  (M-Pesa webhook)
router.post('/mpesa/callback', async (req, res) => {
  const { Body } = req.body;
  const result = Body?.stkCallback;
  if (result?.ResultCode === 0) {
    const checkoutId = result.CheckoutRequestID;
    await db.query(
      `UPDATE payments SET status='success' WHERE mpesa_checkout_id=$1`,
      [checkoutId]
    );
  }
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

// POST /api/payments/wallet/topup
router.post('/wallet/topup', auth, async (req, res) => {
  const { amount } = req.body;
  await db.query(
    `INSERT INTO wallets (user_id, balance) VALUES ($1,$2)
     ON CONFLICT (user_id) DO UPDATE SET balance = wallets.balance + $2`,
    [req.user.id, amount]
  );
  const { rows } = await db.query(`SELECT balance FROM wallets WHERE user_id=$1`, [req.user.id]);
  res.json(rows[0]);
});

// GET /api/payments/wallet
router.get('/wallet', auth, async (req, res) => {
  const { rows } = await db.query(`SELECT balance FROM wallets WHERE user_id=$1`, [req.user.id]);
  res.json(rows[0] || { balance: 0 });
});

module.exports = router;
