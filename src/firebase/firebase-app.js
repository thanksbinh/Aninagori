import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "./firebase-config";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore();

export { app, db }