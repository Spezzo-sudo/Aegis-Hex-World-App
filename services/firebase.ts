import { initializeApp } from 'firebase/app';
// FIX: Changed import path to firebase/auth/browser to resolve module export error.
import { getAuth } from 'firebase/auth/browser';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// IMPORTANT: In a real production app, use environment variables for this sensitive data.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Placeholder
  authDomain: "YOUR_AUTH_DOMAIN", // Placeholder
  projectId: "YOUR_PROJECT_ID", // Placeholder
  storageBucket: "YOUR_STORAGE_BUCKET", // Placeholder
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Placeholder
  appId: "YOUR_APP_ID" // Placeholder
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
