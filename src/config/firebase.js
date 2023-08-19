import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDKcFVelezYTWDoxJ-t-xLAvynKEjsGhfc",
  authDomain: "lsl-app-e8bf6.firebaseapp.com",
  projectId: "lsl-app-e8bf6",
  storageBucket: "lsl-app-e8bf6.appspot.com",
  messagingSenderId: "412614187453",
  appId: "1:412614187453:web:1c91772d471c0dc5989ad4",
  measurementId: "G-N0EMLF3LNJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);