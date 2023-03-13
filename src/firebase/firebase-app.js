import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebase-config";
import { getAuth } from "firebase/auth"
import firebase from "firebase/compat/app";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);;
const auth = getAuth();

export { firebase, app, db, auth, storage }