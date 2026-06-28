const https = require('https');

// M-Pesa Daraja API helpers
async function getAccessToken() {
  const auth = Buffer.from(`${process.env.MPESA_API_KEY}:${process.env.MPESA_API_SECRET}`).toString('base64');
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'sandbox.safaricom.co.ke',
        path: '/oauth/v1/generate?grant_type=client_credentials',
        method: 'GET',
        headers: { Authorization: `Basic ${auth}` },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data).access_token));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function initiateSTKPush({ phone, amount }) {
  const token = await getAccessToken();
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  const payload = JSON.stringify({
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(amount),
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: 'FIXR Africa',
    TransactionDesc: 'Gig Payment',
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'sandbox.safaricom.co.ke',
        path: '/mpesa/stkpush/v1/processrequest',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

module.exports = { initiateSTKPush };
