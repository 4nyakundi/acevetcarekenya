/**
 * Firebase Initialization & Configuration
 * 
 * Instructions to set up:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (e.g. "acevetcare-kenya").
 * 3. Add a Web App to your project to get your Firebase configuration object.
 * 4. Enable "Cloud Firestore" in your Firebase console under Build -> Firestore Database.
 * 5. Set up security rules (for development, you can set them to allow read/write,
 *    but for production, ensure secure rules are configured).
 * 6. Replace the placeholder values in the config object below.
 */

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase if it hasn't been initialized yet
let db = null;

if (typeof firebase !== 'undefined') {
  try {
    if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
      console.warn("Firebase configuration is using placeholders. Please update assets/js/firebase-config.js with your real Firebase Web App configuration.");
    }
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    console.log("Firebase & Firestore initialized successfully.");
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.error("Firebase SDK not found! Please check that the Firebase CDN scripts are imported before this config script.");
}
