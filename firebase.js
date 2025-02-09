// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import getAuth

const firebaseConfig = {
  apiKey: "AIzaSyB5koHF_sAxRM75MQ1XYbol1vJM813PgGA",
  authDomain: "zenflector-9bbba.firebaseapp.com",
  projectId: "zenflector-9bbba",
  storageBucket: "zenflector-9bbba.appspot.com",  // ✅ Corrected here
  messagingSenderId: "1078175017564",
  appId: "1:1078175017564:web:74d6b8ece1ee4018c8d499",
  measurementId: "G-48EZ6SVZST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, db, storage, analytics, auth };
