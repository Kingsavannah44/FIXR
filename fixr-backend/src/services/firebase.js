const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    const serviceAccount = require('../../serviceAccountKey.json');
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('✅ Firebase Admin initialized');
  } catch (e) {
    console.warn('⚠️  Firebase Admin not initialized — serviceAccountKey.json missing. /api/auth/firebase will be unavailable.');
  }
}

module.exports = admin;
