/**
 * Authentication & Role-Based Access Control (RBAC) Module
 * Community Cleanliness & Waste Management System
 * Supports Firebase Authentication with fallback session management.
 */

const AUTH_KEYS = {
  CURRENT_USER: 'swachh_current_session',
  USERS_REGISTRY: 'swachh_registered_users'
};

// Seed Authorized Administrative Account (Never registered publicly)
const DEFAULT_ACCOUNTS = [
  {
    uid: 'usr_admin_official',
    fullName: 'Municipal Commissioner Desk',
    email: 'admin@municipal.gov.in',
    mobile: '+91 94000 00100',
    locality: 'Corporation Head Office',
    city: 'Pune',
    role: 'admin',
    createdAt: '2026-01-01 00:00:00'
  },
  {
    uid: 'usr_citizen_demo',
    fullName: 'Aditya Patil',
    email: 'citizen@example.com',
    mobile: '+91 98765 43210',
    locality: 'North Campus Housing',
    city: 'Pune',
    role: 'citizen',
    createdAt: '2026-10-15 10:00:00'
  }
];

// Initialize local users registry if not present
function initializeUsersRegistry() {
  if (!localStorage.getItem(AUTH_KEYS.USERS_REGISTRY)) {
    localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(DEFAULT_ACCOUNTS));
  }
}
initializeUsersRegistry();

const Auth = {
  // Get active session
  getCurrentUser: function() {
    try {
      const raw = localStorage.getItem(AUTH_KEYS.CURRENT_USER);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  // Save session
  setCurrentUser: function(userObj) {
    localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(userObj));
  },

  // Clear session & log out
  logout: async function(redirectUrl = 'index.html') {
    if (isFirebaseConfigured() && firebaseAuth) {
      try {
        await firebaseAuth.signOut();
      } catch (e) {
        console.warn("Firebase sign out error:", e);
      }
    }
    localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
    window.location.href = redirectUrl;
  },

  // Citizen Registration
  registerCitizen: async function(formData) {
    const { fullName, email, mobile, password, confirmPassword, locality, city, photoBase64 } = formData;

    // Strict validation
    if (!fullName || fullName.trim().length < 3) {
      throw new Error("Full name must be at least 3 characters long.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      throw new Error("Please enter a valid email address.");
    }
    const mobileRegex = /^[6-9]\d{9}$/;
    const cleanMobile = mobile.replace(/[^0-9]/g, '').slice(-10);
    if (!mobileRegex.test(cleanMobile)) {
      throw new Error("Please enter a valid 10-digit mobile number.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      throw new Error("Password confirmation does not match.");
    }
    if (!locality || !locality.trim()) {
      throw new Error("Please enter your area or locality.");
    }

    // Role is strictly citizen (citizens can never self-assign as admin)
    const newUser = {
      uid: 'usr_' + Date.now(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile: '+91 ' + cleanMobile,
      locality: locality.trim(),
      city: city ? city.trim() : 'Pune',
      photoUrl: photoBase64 || '',
      role: 'citizen',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // If Firebase Auth is configured
    if (isFirebaseConfigured() && firebaseAuth) {
      try {
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        newUser.uid = userCredential.user.uid;
        if (firestoreDb) {
          await firestoreDb.collection('users').doc(newUser.uid).set(newUser);
        }
      } catch (fbErr) {
        throw new Error(fbErr.message || "Firebase registration failed.");
      }
    }

    // Check duplicate email in local registry
    const users = this.getRegisteredUsers();
    if (users.some(u => u.email === newUser.email)) {
      throw new Error("An account with this email address already exists.");
    }

    users.push(newUser);
    localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(users));

    // Auto-login registered citizen
    this.setCurrentUser(newUser);
    return newUser;
  },

  // Citizen Login
  loginCitizen: async function(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    const cleanEmail = email.trim().toLowerCase();

    // Firebase Auth attempt
    if (isFirebaseConfigured() && firebaseAuth) {
      try {
        const cred = await firebaseAuth.signInWithEmailAndPassword(cleanEmail, password);
        let userDoc = null;
        if (firestoreDb) {
          const snap = await firestoreDb.collection('users').doc(cred.user.uid).get();
          if (snap.exists) userDoc = snap.data();
        }
        if (userDoc) {
          this.setCurrentUser(userDoc);
          return userDoc;
        }
      } catch (err) {
        console.warn("Firebase Auth failed, checking local registry:", err.message);
      }
    }

    // Local registry check
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.email === cleanEmail);

    // Demonstration credentials support: 'Citizen@123' or any matching password
    if (!user) {
      throw new Error("No citizen account found with this email. Please create an account.");
    }
    if (user.role !== 'citizen') {
      throw new Error("This account is registered under administrative services. Please use the Municipal Admin Portal.");
    }

    // Password validation for local demo
    if (password !== 'Citizen@123' && password.length < 6) {
      throw new Error("Invalid password credentials.");
    }

    this.setCurrentUser(user);
    return user;
  },

  // Municipal Corporation Administrator Login
  loginAdmin: async function(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both administrator email and password.");
    }

    const cleanEmail = email.trim().toLowerCase();

    // Firebase Auth check
    if (isFirebaseConfigured() && firebaseAuth) {
      try {
        const cred = await firebaseAuth.signInWithEmailAndPassword(cleanEmail, password);
        if (firestoreDb) {
          const snap = await firestoreDb.collection('users').doc(cred.user.uid).get();
          if (snap.exists) {
            const data = snap.data();
            if (data.role !== 'admin') {
              await firebaseAuth.signOut();
              throw new Error("Access Denied: This account does not possess municipal administrator privileges.");
            }
            this.setCurrentUser(data);
            return data;
          }
        }
      } catch (err) {
        console.warn("Firebase admin auth error, checking authorized list:", err);
      }
    }

    // Verified administrator check
    // Default authorized account: admin@municipal.gov.in / Admin@2026
    const users = this.getRegisteredUsers();
    const admin = users.find(u => u.email === cleanEmail && u.role === 'admin');

    if (!admin) {
      throw new Error("Unauthorized: No municipal administrator account found for this email.");
    }

    if (password !== 'Admin@2026') {
      throw new Error("Incorrect administrator password.");
    }

    this.setCurrentUser(admin);
    return admin;
  },

  // Forgot Password / Password Reset Request
  forgotPassword: async function(email) {
    if (!email || !email.includes('@')) {
      throw new Error("Please enter a valid email address.");
    }
    if (isFirebaseConfigured() && firebaseAuth) {
      await firebaseAuth.sendPasswordResetEmail(email.trim());
      return "Password reset link sent to your registered email address.";
    }
    return "Password reset instructions have been dispatched to " + email.trim() + " (For demo, default password is 'Citizen@123').";
  },

  // Update citizen profile
  updateProfile: async function(updatedFields) {
    const user = this.getCurrentUser();
    if (!user) throw new Error("No active session found.");

    // Update fields
    if (updatedFields.fullName) user.fullName = updatedFields.fullName.trim();
    if (updatedFields.mobile) user.mobile = updatedFields.mobile.trim();
    if (updatedFields.locality) user.locality = updatedFields.locality.trim();
    if (updatedFields.city) user.city = updatedFields.city.trim();
    if (updatedFields.photoUrl) user.photoUrl = updatedFields.photoUrl;

    // Update in registry
    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.uid === user.uid || u.email === user.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...user };
      localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(users));
    }

    this.setCurrentUser(user);

    // Update in Firestore
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await firestoreDb.collection('users').doc(user.uid).update(user);
      } catch (e) {
        console.warn(e);
      }
    }

    return user;
  },

  // Helper to retrieve registry
  getRegisteredUsers: function() {
    try {
      const raw = localStorage.getItem(AUTH_KEYS.USERS_REGISTRY);
      return raw ? JSON.parse(raw) : DEFAULT_ACCOUNTS;
    } catch (e) {
      return DEFAULT_ACCOUNTS;
    }
  },

  // Route Guard: Require Citizen
  requireCitizen: function() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = 'user-login.html';
      return null;
    }
    if (user.role !== 'citizen') {
      window.location.href = 'admin-dashboard.html';
      return null;
    }
    return user;
  },

  // Route Guard: Require Admin
  requireAdmin: function() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = 'admin-login.html';
      return null;
    }
    if (user.role !== 'admin') {
      alert("Access Denied: You must be signed in as an authorized Municipal Corporation Official to access this panel.");
      window.location.href = 'user-dashboard.html';
      return null;
    }
    return user;
  }
};
