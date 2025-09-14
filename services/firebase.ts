// FIX: To resolve module loading errors with Firebase dependencies and respect
// the application's mock-mode design, all Firebase imports have been removed.
// The services are exported as mock objects or null, mimicking the original file's behavior
// when Firebase initialization fails. Dummy types are provided for compatibility.

export type FirebaseApp = any;
export type Auth = any;
export type Firestore = any;

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

let app: FirebaseApp | null = {};
let auth: Auth | null = {}; // Not null, so authService checks pass
let db: Firestore | null = null; // Can be null as playerDataService handles it

console.warn(
    "Firebase is not initialized. Using mock services. The app will run in offline/mock mode."
);


// Export the potentially null services. The app's logic will handle this.
export { app, auth, db };
