import * as firebaseAdmin from "firebase-admin";

if (!firebaseAdmin.apps.length)
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      "project_id": process.env.FIREBASE_PROJECT_ID,
      "private_key": process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: "https://aninagori-0.firebaseio.com"
  });

const db = firebaseAdmin.firestore();

export { db };
