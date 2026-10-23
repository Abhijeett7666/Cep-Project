/**
 * Authentication & Role-Based Access Control (RBAC) Module
 * Community Cleanliness & Waste Management System
 * Supports Firebase Authentication with fallback session management.
 */

var AUTH_KEYS = window.AUTH_KEYS || {
  CURRENT_USER: 'swachh_current_session',
  USERS_REGISTRY: 'swachh_registered_users'
};
window.AUTH_KEYS = AUTH_KEYS;

// Seed Authorized Administrative and Demo Citizen Accounts
var DEFAULT_ACCOUNTS = window.DEFAULT_ACCOUNTS || [
  {
    uid: 'usr_admin_official',
    fullName: 'Municipal Commissioner Desk',
    email: 'admin@municipal.gov.in',
    mobile: '+91 94000 00100',
    locality: 'Corporation Head Office',
    city: 'Pune',
    role: 'admin',
    password: 'Admin@2026',
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
    password: 'Citizen@123',
    createdAt: '2026-10-15 10:00:00'
  }
];
window.DEFAULT_ACCOUNTS = DEFAULT_ACCOUNTS;

// Initialize local users registry if not present
function initializeUsersRegistry() {
  try {
    const raw = localStorage.getItem(AUTH_KEYS.USERS_REGISTRY);
    if (!raw) {
      localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(DEFAULT_ACCOUNTS));
    } else {
      const existing = JSON.parse(raw);
      // Ensure default accounts are present
      DEFAULT_ACCOUNTS.forEach(defAcc => {
        if (!existing.some(u => u.email.toLowerCase() === defAcc.email.toLowerCase())) {
          existing.push(defAcc);
        }
      });
      localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(existing));
    }
  } catch (e) {
    console.warn("Registry init error:", e);
  }
}
initializeUsersRegistry();

var Auth = window.Auth || {
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
    if (!userObj) {
      localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(userObj));
    }
  },

  // Clear session & log out
  logout: async function(redirectUrl = 'index.html') {
    if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && typeof firebaseAuth !== 'undefined' && firebaseAuth) {
      try {
        await firebaseAuth.signOut();
      } catch (e) {
        console.warn("Firebase sign out error:", e);
      }
    }
    localStorage.removeItem(AUTH_KEYS.CURRENT_USER);
    window.location.replace(redirectUrl);
  },

  // Citizen Registration
  registerCitizen: async function(formData) {
    const { fullName, email, mobile, password, confirmPassword, locality, city, photoBase64 } = formData;

    // Strict validation
    if (!fullName || fullName.trim().length < 2) {
      throw new Error("Please enter your full name (at least 2 characters).");
    }
    const cleanEmail = (email || '').trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    const cleanMobile = (mobile || '').replace(/[^0-9]/g, '');
    if (!cleanMobile || cleanMobile.length < 7) {
      throw new Error("Please enter a valid phone number (minimum 7 digits).");
    }
    if (!password || password.length < 4) {
      throw new Error("Password must be at least 4 characters long.");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match. Please re-enter your password.");
    }
    if (!locality || !locality.trim()) {
      throw new Error("Please enter your area or locality.");
    }

    // Role is strictly citizen (citizens can never self-assign as admin)
    const newUser = {
      uid: 'usr_' + Date.now(),
      fullName: fullName.trim(),
      email: cleanEmail,
      mobile: '+91 ' + cleanMobile.slice(-10),
      locality: locality.trim(),
      city: city ? city.trim() : 'Pune',
      password: password, // Persist password for authentication
      photoUrl: photoBase64 || '',
      role: 'citizen',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // If Firebase Auth is configured with live production credentials
    if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && typeof firebaseAuth !== 'undefined' && firebaseAuth) {
      try {
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(cleanEmail, password);
        newUser.uid = userCredential.user.uid;
        if (typeof firestoreDb !== 'undefined' && firestoreDb) {
          await firestoreDb.collection('users').doc(newUser.uid).set(newUser);
        }
      } catch (fbErr) {
        throw new Error(fbErr.message || "Firebase registration failed.");
      }
    }

    // Check duplicate email in local registry
    const users = this.getRegisteredUsers();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error("An account with this email address already exists. Please log in instead.");
    }

    users.push(newUser);
    localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(users));

    // Auto-login newly registered citizen
    this.setCurrentUser(newUser);
    return newUser;
  },

  // Citizen Login
  loginCitizen: async function(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both email address and password.");
    }

    const cleanEmail = email.trim().toLowerCase();

    // Firebase Auth attempt
    if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && typeof firebaseAuth !== 'undefined' && firebaseAuth) {
      try {
        const cred = await firebaseAuth.signInWithEmailAndPassword(cleanEmail, password);
        let userDoc = null;
        if (typeof firestoreDb !== 'undefined' && firestoreDb) {
          const snap = await firestoreDb.collection('users').doc(cred.user.uid).get();
          if (snap.exists) userDoc = snap.data();
        }
        if (userDoc) {
          this.setCurrentUser(userDoc);
          return userDoc;
        }
      } catch (err) {
        console.warn("Firebase Auth check note:", err.message);
      }
    }

    // Local registry check
    const users = this.getRegisteredUsers();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error("No account found with this email. Click 'Create Account' to register.");
    }
    if (user.role !== 'citizen') {
      throw new Error("This account is registered for Municipal Administrators. Please use the Municipal Admin Portal.");
    }

    // Password validation: match saved password or demo master password 'Citizen@123'
    if (user.password) {
      if (user.password !== password && password !== 'Citizen@123') {
        throw new Error("Incorrect password. Please verify and try again.");
      }
    } else {
      if (password !== 'Citizen@123' && password.length < 4) {
        throw new Error("Invalid password credentials.");
      }
    }

    this.setCurrentUser(user);
    return user;
  },

  // Municipal Corporation Administrator Login
  loginAdmin: async function(email, password) {
    if (!email || !password) {
      throw new Error("Please enter both administrator email and security password.");
    }

    const cleanEmail = email.trim().toLowerCase();

    // Firebase Auth check
    if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && typeof firebaseAuth !== 'undefined' && firebaseAuth) {
      try {
        const cred = await firebaseAuth.signInWithEmailAndPassword(cleanEmail, password);
        if (typeof firestoreDb !== 'undefined' && firestoreDb) {
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
        console.warn("Firebase admin auth error:", err);
      }
    }

    // Verified administrator check
    // Default authorized account: admin@municipal.gov.in / Admin@2026
    const users = this.getRegisteredUsers();
    let admin = users.find(u => u.email.toLowerCase() === cleanEmail && u.role === 'admin');

    if (!admin && cleanEmail === 'admin@municipal.gov.in') {
      admin = DEFAULT_ACCOUNTS.find(u => u.role === 'admin');
    }

    if (!admin) {
      throw new Error("Unauthorized: No municipal administrator account found for this email. Use 'admin@municipal.gov.in'.");
    }

    if (admin.password && admin.password !== password && password !== 'Admin@2026') {
      throw new Error("Incorrect administrator password. (Default demo password is 'Admin@2026').");
    }

    this.setCurrentUser(admin);
    return admin;
  },

  // Forgot Password / Password Reset Request
  forgotPassword: async function(email) {
    if (!email || !email.includes('@')) {
      throw new Error("Please enter a valid email address.");
    }
    if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && typeof firebaseAuth !== 'undefined' && firebaseAuth) {
      await firebaseAuth.sendPasswordResetEmail(email.trim());
      return "Password reset link dispatched to your registered email address.";
    }
    return "Password reset instructions dispatched to " + email.trim() + " (For demo, default password is 'Citizen@123').";
  },

  // Update citizen profile
  updateProfile: async function(updatedFields) {
    const user = this.getCurrentUser();
    if (!user) throw new Error("No active session found.");

    if (updatedFields.fullName) user.fullName = updatedFields.fullName.trim();
    if (updatedFields.mobile) user.mobile = updatedFields.mobile.trim();
    if (updatedFields.locality) user.locality = updatedFields.locality.trim();
    if (updatedFields.city) user.city = updatedFields.city.trim();
    if (updatedFields.photoUrl) user.photoUrl = updatedFields.photoUrl;

    const users = this.getRegisteredUsers();
    const idx = users.findIndex(u => u.uid === user.uid || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...user };
      localStorage.setItem(AUTH_KEYS.USERS_REGISTRY, JSON.stringify(users));
    }

    this.setCurrentUser(user);

    if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured() && typeof firestoreDb !== 'undefined' && firestoreDb) {
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
      window.location.replace('user-login.html');
      return null;
    }
    if (user.role !== 'citizen') {
      window.location.replace('admin-dashboard.html');
      return null;
    }
    return user;
  },

  // Route Guard: Require Admin
  requireAdmin: function() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.replace('admin-login.html');
      return null;
    }
    if (user.role !== 'admin') {
      alert("Access Denied: You must be signed in as an authorized Municipal Corporation Official to access this panel.");
      window.location.replace('user-dashboard.html');
      return null;
    }
    return user;
  }
};
window.Auth = Auth;
