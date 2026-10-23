// Firebase Configuration and Initialization Module
// Replace the placeholder values with your Firebase project configuration from Firebase Console:
// https://console.firebase.google.com/ -> Project Settings -> General -> Your apps -> Web app

if (typeof window.firebaseConfig === 'undefined') {
  window.firebaseConfig = {
    apiKey: "AIzaSyDEMO-KEY-REPLACE-WITH-YOUR-KEY",
    authDomain: "community-cleanliness-app.firebaseapp.com",
    projectId: "community-cleanliness-app",
    storageBucket: "community-cleanliness-app.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
  };
}

// Check if Firebase credentials have been configured with real keys
function isFirebaseConfigured() {
  return (
    typeof firebase !== 'undefined' &&
    window.firebaseConfig.apiKey &&
    !window.firebaseConfig.apiKey.includes("DEMO-KEY")
  );
}

// Initialize Firebase if configured, otherwise initialize simulated mode for demonstration
if (typeof window.firebaseApp === 'undefined') {
  window.firebaseApp = null;
  window.firebaseAuth = null;
  window.firestoreDb = null;
  window.firebaseStorage = null;

  try {
    if (typeof firebase !== 'undefined') {
      window.firebaseApp = firebase.initializeApp(window.firebaseConfig);
      window.firebaseAuth = firebase.auth();
      window.firestoreDb = firebase.firestore();
      try {
        window.firebaseStorage = firebase.storage();
      } catch (e) {
        console.warn("Firebase Storage optional init:", e);
      }
    }
  } catch (err) {
    console.warn("Firebase initialization notice:", err.message);
  }
}

var firebaseConfig = window.firebaseConfig;
var firebaseApp = window.firebaseApp;
var firebaseAuth = window.firebaseAuth;
var firestoreDb = window.firestoreDb;
var firebaseStorage = window.firebaseStorage;
