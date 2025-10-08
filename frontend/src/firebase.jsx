// src/firebase.jsx - FIREBASE CONFIGURATION FOR BISRUN
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAubTQljHt0xPs4ThUWLkD8VKIT3PSLNkk",
  authDomain: "bisrun-d122f.firebaseapp.com",
  projectId: "bisrun-d122f",
  storageBucket: "bisrun-d122f.firebasestorage.app",
  messagingSenderId: "149798411711",
  appId: "1:149798411711:web:c7d2913719de569552d50a",
  measurementId: "G-GQ42Q2798B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;