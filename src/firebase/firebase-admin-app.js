const firebaseAdmin = require('firebase-admin');

if (!firebaseAdmin.apps.length)
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      "projectId": process.env.FIREBASE_PROJECT_ID,
      "privateKey": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      "clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: "https://aninagori-0.firebaseio.com"
  });

const db = firebaseAdmin.firestore();

export { db };
