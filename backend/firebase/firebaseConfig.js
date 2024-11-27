const admin = require('firebase-admin');
const serviceAccount = require('../config/service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // storageBucket: 'paper-management-system-441816.appspot.com', 
});

const db = admin.firestore();
const auth = admin.auth();
// const bucket = admin.storage().bucket();

// module.exports = { admin, db, auth, bucket };
module.exports = { admin, db, auth };
