import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

// Initialize Firebase with error handling
let app;
try {
  if (!process.env.REACT_APP_FIREBASE_API_KEY) {
    throw new Error(
      "Firebase API key is missing. Check your environment variables."
    );
  }
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error; // Re-throw to handle it in your error boundary
}

export const db = getFirestore(app);

export const auth = getAuth(app);

// Set auth persistence to LOCAL
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});
