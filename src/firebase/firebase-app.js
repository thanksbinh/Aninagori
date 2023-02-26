import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import "firebase/compat/auth";
import firebaseConfig from "./firebase-config";

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

export {firebase, auth}