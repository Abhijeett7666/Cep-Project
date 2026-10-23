// Firebase Configuration and Initialization Module
// Replace the placeholder values with your Firebase project configuration from Firebase Console:
// https://console.firebase.google.com/ -> Project Settings -> General -> Your apps -> Web app

const firebaseConfig = {
  apiKey: "AIzaSyDEMO-KEY-REPLACE-WITH-YOUR-KEY",
  authDomain: "community-cleanliness-app.firebaseapp.com",
  projectId: "community-cleanliness-app",
  storageBucket: "community-cleanliness-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Check if Firebase credentials have been configured with real keys
function isFirebaseConfigured() {
  return (
    typeof firebase !== 'undefined' &&
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("DEMO-KEY")
  );
}

// Initialize Firebase if configured, otherwise initialize simulated mode for demonstration
let firebaseApp = null;
let firebaseAuth = null;
let firestoreDb = null;
let firebaseStorage = null;

try {
  if (typeof firebase !== 'undefined') {
    firebaseApp = firebase.initializeApp(firebaseConfig);
    firebaseAuth = firebase.auth();
    firestoreDb = firebase.firestore();
    try {
      firebaseStorage = firebase.storage();
    } catch (e) {
      console.warn("Firebase Storage optional init:", e);
    }
  }
} catch (err) {
  console.warn("Firebase initialization notice:", err.message);
}
