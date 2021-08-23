import * as admin from 'firebase-admin';

// Providing a path to a service account key JSON file
var serviceAccount = require('secrets/firebase_admin_credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://jams-dev.firebaseio.com',
});

export default admin;
