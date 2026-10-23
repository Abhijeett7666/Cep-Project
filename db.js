/**
 * Shared Database & Data Services Layer
 * Community Cleanliness & Waste Management System
 * Supports Cloud Firestore with automatic offline/demo fallback across browser tabs.
 */

var DB_KEYS = window.DB_KEYS || {
  USERS: 'swachh_users',
  COMPLAINTS: 'swachh_complaints',
  HISTORY: 'swachh_history',
  WORKERS: 'swachh_workers',
  CURRENT_USER: 'swachh_current_session'
};
window.DB_KEYS = DB_KEYS;

// Default seed data for initial workers
const DEFAULT_WORKERS = [
  { id: 'WRK-101', name: 'Ramesh Shinde', department: 'Solid Waste Management', ward: 'Ward 1 - North Campus', contact: '+91 98230 11223', active: true },
  { id: 'WRK-102', name: 'Anita Gaikwad', department: 'Public Health & Sanitation', ward: 'Ward 2 - Central Market', contact: '+91 98230 44556', active: true },
  { id: 'WRK-103', name: 'Sunil Jadhav', department: 'Drainage & Sewage Dept', ward: 'Ward 3 - West Housing', contact: '+91 98230 77889', active: true },
  { id: 'WRK-104', name: 'Pooja Kulkarni', department: 'Special Bio-Waste Unit', ward: 'Ward 4 - East District', contact: '+91 98230 99001', active: true },
  { id: 'WRK-105', name: 'Vijay Kamble', department: 'E-Waste Recovery Cell', ward: 'City-Wide Rapid Response', contact: '+91 98230 55443', active: true }
];

// Seed sample complaints for realistic demonstration
const SEED_COMPLAINTS = [
  {
    complaintId: 'CMP-2026-001',
    userId: 'usr_citizen_demo',
    citizenName: 'Aditya Patil',
    citizenMobile: '+91 98765 43210',
    citizenEmail: 'aditya.patil@example.com',
    title: 'Severe Garbage Overflow at Science Block Entrance',
    category: 'Garbage Overflow',
    description: 'The community bin near the Science Block entrance is overflowing with cafeteria packaging and wet waste, blocking pedestrian walkway.',
    location: 'Science Block Main Gate, University Campus',
    ward: 'Ward 1 - North Campus',
    landmark: 'Opposite Chemistry Research Lab',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    status: 'In Progress',
    priority: 'High',
    assignedWorkerId: 'WRK-101',
    assignedWorkerName: 'Ramesh Shinde',
    assignedDepartment: 'Solid Waste Management',
    adminNotes: 'Inspection team dispatched. Extra 240L bin assigned to this location.',
    resolutionDetails: '',
    createdAt: '2026-10-23 09:30:00',
    updatedAt: '2026-10-23 11:15:00'
  },
  {
    complaintId: 'CMP-2026-002',
    userId: 'usr_citizen_demo',
    citizenName: 'Aditya Patil',
    citizenMobile: '+91 98765 43210',
    citizenEmail: 'aditya.patil@example.com',
    title: 'Discarded Commercial Cardboard & Plastic Dumping',
    category: 'Dry Waste',
    description: 'Bulk packaging boxes and unsegregated plastic bags dumped on the sidewalk near Central Library quadrangle.',
    location: 'Central Library Quadrangle Lane',
    ward: 'Ward 2 - Central Market',
    landmark: 'Behind Library Reading Hall',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    status: 'Resolved',
    priority: 'Medium',
    assignedWorkerId: 'WRK-102',
    assignedWorkerName: 'Anita Gaikwad',
    assignedDepartment: 'Public Health & Sanitation',
    adminNotes: 'Recycling truck cleared 45kg dry cardboard on Oct 23 afternoon.',
    resolutionDetails: 'Cardboard baled and transported to municipal Material Recovery Facility (MRF). Area disinfected.',
    createdAt: '2026-10-22 14:15:00',
    updatedAt: '2026-10-23 16:45:00'
  },
  {
    complaintId: 'CMP-2026-003',
    userId: 'usr_citizen_priya',
    citizenName: 'Priya Sharma',
    citizenMobile: '+91 98111 22334',
    citizenEmail: 'priya.sharma@example.com',
    title: 'Stagnant Storm Drain and Plastic Choking',
    category: 'Drainage / Stagnant Water Issue',
    description: 'Plastic pouches and single-use cups have blocked the storm drain, causing foul-smelling stagnant water accumulation.',
    location: 'Hostel Block B Inner Circle',
    ward: 'Ward 3 - West Housing',
    landmark: 'Near Water Purifier Shed',
    imageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    priority: 'Urgent',
    assignedWorkerId: '',
    assignedWorkerName: 'Unassigned',
    assignedDepartment: 'Drainage & Sewage Dept',
    adminNotes: '',
    resolutionDetails: '',
    createdAt: '2026-10-24 07:45:00',
    updatedAt: '2026-10-24 07:45:00'
  },
  {
    complaintId: 'CMP-2026-004',
    userId: 'usr_citizen_vikram',
    citizenName: 'Vikram Deshmukh',
    citizenMobile: '+91 99222 33445',
    citizenEmail: 'vikram.d@example.com',
    title: 'Illegal Construction Debris Left on Roadside',
    category: 'Construction Waste',
    description: 'Concrete chunks and broken tiles dumped along the public lane, posing vehicle hazard at night.',
    location: 'North Campus Link Road',
    ward: 'Ward 1 - North Campus',
    landmark: 'Corner of Metro Pillar 44',
    imageUrl: '',
    status: 'Pending',
    priority: 'High',
    assignedWorkerId: '',
    assignedWorkerName: 'Unassigned',
    assignedDepartment: 'Solid Waste Management',
    adminNotes: '',
    resolutionDetails: '',
    createdAt: '2026-10-23 18:20:00',
    updatedAt: '2026-10-23 18:20:00'
  }
];

const SEED_HISTORY = [
  {
    historyId: 'HIST-101',
    complaintId: 'CMP-2026-001',
    previousStatus: 'Pending',
    newStatus: 'In Progress',
    updatedBy: 'Admin (Munc. Sanitation Officer)',
    note: 'Complaint validated by Ward Inspector. Assigned to Worker Ramesh Shinde.',
    timestamp: '2026-10-23 11:15:00'
  },
  {
    historyId: 'HIST-102',
    complaintId: 'CMP-2026-002',
    previousStatus: 'Pending',
    newStatus: 'In Progress',
    updatedBy: 'Admin (Munc. Sanitation Officer)',
    note: 'Assigned to Anita Gaikwad for recovery vehicle pickup.',
    timestamp: '2026-10-22 16:30:00'
  },
  {
    historyId: 'HIST-103',
    complaintId: 'CMP-2026-002',
    previousStatus: 'In Progress',
    newStatus: 'Resolved',
    updatedBy: 'Admin (Chief Sanitation Inspector)',
    note: 'Debris successfully cleared. Disinfection spray completed.',
    timestamp: '2026-10-23 16:45:00'
  }
];

// Helper to initialize database with seed records if empty
function initializeLocalDatabase() {
  if (!localStorage.getItem(DB_KEYS.WORKERS)) {
    localStorage.setItem(DB_KEYS.WORKERS, JSON.stringify(DEFAULT_WORKERS));
  }
  if (!localStorage.getItem(DB_KEYS.COMPLAINTS)) {
    localStorage.setItem(DB_KEYS.COMPLAINTS, JSON.stringify(SEED_COMPLAINTS));
  }
  if (!localStorage.getItem(DB_KEYS.HISTORY)) {
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify(SEED_HISTORY));
  }
}

initializeLocalDatabase();

// Centralized Data Access Object (DAO)
var DB = window.DB || {
  // Generate a collision-free sequential Complaint ID (e.g. CMP-2026-005)
  generateComplaintId: async function() {
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        const snap = await firestoreDb.collection('complaints').orderBy('createdAt', 'desc').limit(1).get();
        if (!snap.empty) {
          const lastId = snap.docs[0].data().complaintId || '';
          const parts = lastId.split('-');
          const seq = parseInt(parts[parts.length - 1] || '0', 10);
          return `CMP-${new Date().getFullYear()}-${String(seq + 1).padStart(3, '0')}`;
        }
      } catch (e) {
        console.warn("Firestore ID generation fallback:", e);
      }
    }

    const complaints = this.getLocalComplaints();
    let maxSeq = 4;
    complaints.forEach(c => {
      const parts = (c.complaintId || '').split('-');
      const num = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(num) && num > maxSeq) maxSeq = num;
    });
    return `CMP-${new Date().getFullYear()}-${String(maxSeq + 1).padStart(3, '0')}`;
  },

  // Save new citizen complaint
  saveComplaint: async function(complaintData) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const complaintId = await this.generateComplaintId();

    const record = {
      complaintId: complaintId,
      userId: complaintData.userId,
      citizenName: complaintData.citizenName || 'Citizen User',
      citizenMobile: complaintData.citizenMobile || '',
      citizenEmail: complaintData.citizenEmail || '',
      title: complaintData.title.trim(),
      category: complaintData.category,
      description: complaintData.description.trim(),
      location: complaintData.location.trim(),
      ward: complaintData.ward,
      landmark: complaintData.landmark ? complaintData.landmark.trim() : '',
      imageUrl: complaintData.imageUrl || '',
      status: 'Pending',
      priority: complaintData.priority || 'Medium',
      assignedWorkerId: '',
      assignedWorkerName: 'Unassigned',
      assignedDepartment: complaintData.assignedDepartment || 'Sanitation Dept',
      adminNotes: '',
      resolutionDetails: '',
      createdAt: timestamp,
      updatedAt: timestamp
    };

    // If live Firestore is available
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await firestoreDb.collection('complaints').doc(complaintId).set(record);
        // Also write initial history event
        await firestoreDb.collection('complaintHistory').add({
          historyId: 'HIST-' + Date.now(),
          complaintId: complaintId,
          previousStatus: 'None',
          newStatus: 'Pending',
          updatedBy: 'Citizen (' + record.citizenName + ')',
          note: 'Complaint registered by citizen.',
          timestamp: timestamp
        });
      } catch (err) {
        console.error("Firestore save error, falling back to local:", err);
      }
    }

    // Always maintain local cache / local sync
    const complaints = this.getLocalComplaints();
    complaints.unshift(record);
    localStorage.setItem(DB_KEYS.COMPLAINTS, JSON.stringify(complaints));

    const history = this.getLocalHistory();
    history.push({
      historyId: 'HIST-' + Date.now(),
      complaintId: complaintId,
      previousStatus: 'None',
      newStatus: 'Pending',
      updatedBy: 'Citizen (' + record.citizenName + ')',
      note: 'Complaint registered by citizen.',
      timestamp: timestamp
    });
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify(history));

    return record;
  },

  // Retrieve complaints for currently logged-in citizen only
  getComplaintsForUser: async function(userId) {
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        const snap = await firestoreDb.collection('complaints')
          .where('userId', '==', userId)
          .orderBy('createdAt', 'desc')
          .get();
        if (!snap.empty) {
          return snap.docs.map(doc => doc.data());
        }
      } catch (e) {
        console.warn("Firestore query error, using local:", e);
      }
    }
    const all = this.getLocalComplaints();
    return all.filter(c => c.userId === userId);
  },

  // Retrieve all complaints for administrators with filtering & search
  getAllComplaints: async function(filters = {}) {
    let list = [];
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        const snap = await firestoreDb.collection('complaints').orderBy('createdAt', 'desc').get();
        if (!snap.empty) {
          list = snap.docs.map(doc => doc.data());
        }
      } catch (e) {
        console.warn("Firestore read all complaints error:", e);
      }
    }
    if (list.length === 0) {
      list = this.getLocalComplaints();
    }

    // Apply multi-criteria filters
    return list.filter(item => {
      // Status filter
      if (filters.status && filters.status !== 'All' && item.status !== filters.status) return false;
      // Category filter
      if (filters.category && filters.category !== 'All' && item.category !== filters.category) return false;
      // Ward filter
      if (filters.ward && filters.ward !== 'All' && item.ward !== filters.ward) return false;
      // Priority filter
      if (filters.priority && filters.priority !== 'All' && item.priority !== filters.priority) return false;
      // Worker filter
      if (filters.workerId && filters.workerId !== 'All' && item.assignedWorkerId !== filters.workerId) return false;
      // Search query (matches ID, title, citizen name, location, landmark)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const textToMatch = `${item.complaintId} ${item.title} ${item.citizenName} ${item.location} ${item.landmark} ${item.description}`.toLowerCase();
        if (!textToMatch.includes(q)) return false;
      }
      return true;
    });
  },

  // Update complaint status & record audit history
  updateComplaintStatus: async function(complaintId, newStatus, adminNote = '', resolutionDetails = '', adminName = 'Admin Official') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let previousStatus = 'Pending';

    // Update local record
    const complaints = this.getLocalComplaints();
    const idx = complaints.findIndex(c => c.complaintId === complaintId);
    if (idx !== -1) {
      previousStatus = complaints[idx].status;
      complaints[idx].status = newStatus;
      complaints[idx].updatedAt = timestamp;
      if (adminNote) complaints[idx].adminNotes = adminNote;
      if (resolutionDetails) complaints[idx].resolutionDetails = resolutionDetails;
      localStorage.setItem(DB_KEYS.COMPLAINTS, JSON.stringify(complaints));
    }

    // Record audit event
    const historyEvent = {
      historyId: 'HIST-' + Date.now(),
      complaintId: complaintId,
      previousStatus: previousStatus,
      newStatus: newStatus,
      updatedBy: adminName,
      note: adminNote || (newStatus === 'Resolved' ? 'Complaint marked resolved.' : 'Status changed to ' + newStatus),
      timestamp: timestamp
    };
    const history = this.getLocalHistory();
    history.push(historyEvent);
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify(history));

    // Update Firestore if configured
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await firestoreDb.collection('complaints').doc(complaintId).update({
          status: newStatus,
          adminNotes: adminNote,
          resolutionDetails: resolutionDetails,
          updatedAt: timestamp
        });
        await firestoreDb.collection('complaintHistory').add(historyEvent);
      } catch (err) {
        console.error("Firestore update status error:", err);
      }
    }

    return true;
  },

  // Assign worker or department to complaint
  assignWorker: async function(complaintId, workerId, department, adminName = 'Admin Official') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const workers = this.getWorkers();
    const worker = workers.find(w => w.id === workerId);
    const workerName = worker ? worker.name : 'Municipal Team';

    const complaints = this.getLocalComplaints();
    const idx = complaints.findIndex(c => c.complaintId === complaintId);
    if (idx !== -1) {
      complaints[idx].assignedWorkerId = workerId;
      complaints[idx].assignedWorkerName = workerName;
      if (department) complaints[idx].assignedDepartment = department;
      if (complaints[idx].status === 'Pending') {
        complaints[idx].status = 'In Progress'; // Auto advance status upon assignment
      }
      complaints[idx].updatedAt = timestamp;
      localStorage.setItem(DB_KEYS.COMPLAINTS, JSON.stringify(complaints));
    }

    const historyEvent = {
      historyId: 'HIST-' + Date.now(),
      complaintId: complaintId,
      previousStatus: 'Assigned',
      newStatus: 'In Progress',
      updatedBy: adminName,
      note: `Task assigned to ${workerName} (${department || 'Sanitation Team'}).`,
      timestamp: timestamp
    };
    const history = this.getLocalHistory();
    history.push(historyEvent);
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify(history));

    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await firestoreDb.collection('complaints').doc(complaintId).update({
          assignedWorkerId: workerId,
          assignedWorkerName: workerName,
          assignedDepartment: department,
          status: 'In Progress',
          updatedAt: timestamp
        });
        await firestoreDb.collection('complaintHistory').add(historyEvent);
      } catch (e) {
        console.error("Firestore assign worker error:", e);
      }
    }
    return true;
  },

  // Update Priority
  updatePriority: async function(complaintId, newPriority) {
    const complaints = this.getLocalComplaints();
    const idx = complaints.findIndex(c => c.complaintId === complaintId);
    if (idx !== -1) {
      complaints[idx].priority = newPriority;
      complaints[idx].updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      localStorage.setItem(DB_KEYS.COMPLAINTS, JSON.stringify(complaints));
    }
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        await firestoreDb.collection('complaints').doc(complaintId).update({ priority: newPriority });
      } catch (e) {
        console.error(e);
      }
    }
    return true;
  },

  // Get status history timeline for a complaint
  getComplaintHistory: async function(complaintId) {
    if (isFirebaseConfigured() && firestoreDb) {
      try {
        const snap = await firestoreDb.collection('complaintHistory')
          .where('complaintId', '==', complaintId)
          .orderBy('timestamp', 'asc')
          .get();
        if (!snap.empty) {
          return snap.docs.map(d => d.data());
        }
      } catch (e) {
        console.warn("Firestore history read error:", e);
      }
    }
    const all = this.getLocalHistory();
    return all.filter(h => h.complaintId === complaintId);
  },

  // Worker Management
  getWorkers: function() {
    try {
      const raw = localStorage.getItem(DB_KEYS.WORKERS);
      return raw ? JSON.parse(raw) : DEFAULT_WORKERS;
    } catch (e) {
      return DEFAULT_WORKERS;
    }
  },

  addWorker: function(workerData) {
    const workers = this.getWorkers();
    const newId = 'WRK-' + (100 + workers.length + 1);
    const worker = {
      id: newId,
      name: workerData.name.trim(),
      department: workerData.department,
      ward: workerData.ward,
      contact: workerData.contact.trim(),
      active: true
    };
    workers.push(worker);
    localStorage.setItem(DB_KEYS.WORKERS, JSON.stringify(workers));
    return worker;
  },

  // Statistics calculation for citizen dashboard
  getUserStats: async function(userId) {
    const complaints = await this.getComplaintsForUser(userId);
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In Progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
      rejected: complaints.filter(c => c.status === 'Rejected').length
    };
  },

  // Statistics calculation for admin dashboard
  getAdminStats: async function() {
    const all = await this.getAllComplaints();
    const todayStr = new Date().toISOString().substring(0, 10);
    return {
      total: all.length,
      pending: all.filter(c => c.status === 'Pending').length,
      inProgress: all.filter(c => c.status === 'In Progress').length,
      resolved: all.filter(c => c.status === 'Resolved').length,
      rejected: all.filter(c => c.status === 'Rejected').length,
      today: all.filter(c => (c.createdAt || '').startsWith(todayStr)).length
    };
  },

  // Aggregated analytics data for Chart.js
  getAnalyticsData: async function() {
    const all = await this.getAllComplaints();

    // Category Counts
    const categoriesMap = {};
    const statusMap = { 'Pending': 0, 'In Progress': 0, 'Resolved': 0, 'Rejected': 0 };
    const wardMap = {};

    all.forEach(c => {
      // Categories
      categoriesMap[c.category] = (categoriesMap[c.category] || 0) + 1;
      // Status
      if (statusMap[c.status] !== undefined) statusMap[c.status]++;
      else statusMap[c.status] = 1;
      // Wards
      const w = c.ward || 'General';
      wardMap[w] = (wardMap[w] || 0) + 1;
    });

    return {
      categories: {
        labels: Object.keys(categoriesMap),
        data: Object.values(categoriesMap)
      },
      statuses: {
        labels: Object.keys(statusMap),
        data: Object.values(statusMap)
      },
      wards: {
        labels: Object.keys(wardMap),
        data: Object.values(wardMap)
      },
      total: all.length
    };
  },

  // Export complaints as downloadable CSV
  exportToCSV: function(complaintsList, filename = 'municipal_complaints_report.csv') {
    if (!complaintsList || complaintsList.length === 0) {
      alert("No complaints available for export.");
      return;
    }

    const headers = ["Complaint ID", "Citizen Name", "Contact", "Title", "Category", "Location", "Ward", "Date Submitted", "Status", "Priority", "Assigned Worker", "Department", "Admin Notes", "Resolution Details"];
    let csv = headers.join(",") + "\r\n";

    complaintsList.forEach(c => {
      const escape = (val) => {
        if (val === null || val === undefined) return '""';
        return `"${String(val).replace(/"/g, '""')}"`;
      };
      const row = [
        escape(c.complaintId),
        escape(c.citizenName),
        escape(c.citizenMobile),
        escape(c.title),
        escape(c.category),
        escape(c.location),
        escape(c.ward),
        escape(c.createdAt),
        escape(c.status),
        escape(c.priority || 'Medium'),
        escape(c.assignedWorkerName || 'Unassigned'),
        escape(c.assignedDepartment || 'Sanitation'),
        escape(c.adminNotes || ''),
        escape(c.resolutionDetails || '')
      ];
      csv += row.join(",") + "\r\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Local helper utilities
  getLocalComplaints: function() {
    try {
      const raw = localStorage.getItem(DB_KEYS.COMPLAINTS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  getLocalHistory: function() {
    try {
      const raw = localStorage.getItem(DB_KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }
};
window.DB = DB;
