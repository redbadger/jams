import * as admin from 'firebase-admin';

// Providing a path to a service account key JSON file
var serviceAccount = require('secrets/firebase_admin_credentials.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://jams-dev.firebaseio.com',
  });
}

export default admin;
