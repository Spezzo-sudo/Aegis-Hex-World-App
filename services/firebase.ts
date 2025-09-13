

// FIX: Use named imports for Firebase v9+ SDK to resolve module errors.
// Namespace imports were not correctly exposing types and functions.
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

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

// Use modern v9+ SDK types
// FIX: Use types directly from named imports.
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

try {
  // Use v9+ initialization pattern
  // FIX: Use functions directly from named imports.
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
    console.warn(
        "Firebase initialization failed. This is expected if config keys are placeholders. The app will run in offline/mock mode.",
        error
    );
}

// Export the potentially null services. The app's logic will handle this.
export { app, auth, db };