import { getApps, getApp, initializeApp } from "firebase-admin/app";
import firebaseConfig from "./firebase-config";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app }