# Community Cleanliness & Waste Awareness System
### Dual-Portal Civic Intelligence Platform (Citizen User Portal & Municipal Corporation Admin Panel)

A modern civic technology web application designed to promote waste segregation awareness, practical environmental habits, and real-time municipal grievance resolution. Built with clean responsive UI, full Role-Based Access Control (RBAC), and dual deployment support: **Python Flask Web App** and **GitHub Pages Serverless Architecture with Firebase / Local Shared Storage**.

**Live Demo URL:** [https://abhijeett7666.github.io/Cep-Project/](https://abhijeett7666.github.io/Cep-Project/)

---

## Table of Contents

1. [Project Overview & Key Objectives](#project-overview--key-objectives)
2. [Dual-Portal Architecture](#dual-portal-architecture)
3. [Technology Stack](#technology-stack)
4. [Portal Features & Capabilities](#portal-features--capabilities)
   - [Landing Page & Authentication Gateway](#1-landing-page--authentication-gateway)
   - [Citizen User Portal](#2-citizen-user-portal)
   - [Municipal Corporation Admin Panel](#3-municipal-corporation-admin-panel)
   - [Waste Segregation & Eco Tips Hub](#4-waste-segregation--eco-tips-hub)
5. [Pre-configured Demonstration Accounts (For College Viva)](#pre-configured-demonstration-accounts-for-college-viva)
6. [Data Persistence Architecture: Dual-Mode (Firebase & Offline Local Storage)](#data-persistence-architecture)
7. [Step-by-Step GitHub Pages Deployment Guide](#step-by-step-github-pages-deployment-guide)
8. [Firebase Setup Guide (Optional for Live Production Cloud DB)](#firebase-setup-guide)
9. [Local Python Flask Execution Guide](#local-python-flask-execution-guide)
10. [College Viva & Defense Q&A](#college-viva--defense-qa)
11. [Academic Disclaimer](#academic-disclaimer)

---

## Project Overview & Key Objectives

Traditional municipal complaints and awareness systems often suffer from two major problems:
1. **Lack of accountability & visibility:** Citizens report garbage or waterlogging issues but have no visibility into who is assigned, what actions are taken, or when the complaint is resolved.
2. **Disconnected education:** Citizens are instructed to segregate waste, but lack quick reference guides and practical habit tips in the same interface where they report issues.

The **Community Cleanliness & Waste Awareness System** bridges this gap by providing:
- **Two Dedicated Portals**: A clean citizen interface for reporting and tracking, alongside a secure operations console for Municipal Corporation sanitation officials.
- **Complete Complaint Lifecycle Management**: From submission (`Pending`) to crew dispatch (`In Progress`) to verified cleanup (`Resolved` / `Rejected`) with full audit history.
- **Interactive Educational Modules**: 5-stream waste segregation guide and 19 categorized sustainability tips.
- **Data Export & Visual Analytics**: Dynamic Chart.js visualizations (categories, ward hotspots, status funnels) and filter-aware CSV report generation.

---

## Dual-Portal Architecture

```text
                            +-------------------------------------------+
                            |       Landing Page (index.html)           |
                            |  Dual Portal Gateways & Waste Finder      |
                            +--------------------+----------------------+
                                                 |
                     +---------------------------+---------------------------+
                     |                                                       |
                     v                                                       v
        +-------------------------+                             +-------------------------+
        |   Citizen User Portal   |                             | Municipal Admin Portal  |
        |   (user-login.html)     |                             |   (admin-login.html)    |
        +------------+------------+                             +------------+------------+
                     |                                                       |
                     v                                                       v
        +-------------------------+                             +-------------------------+
        |  Citizen User Dashboard |                             | Municipal Admin Console |
        |  (user-dashboard.html)  |                             |  (admin-dashboard.html) |
        +------------+------------+                             +------------+------------+
                     |                                                       |
                     |  • Raise Complaints with Photos                       |  • Triage & Priority Setting
                     |  • Real-Time Timeline Tracking                        |  • Assign Sanitation Squads
                     |  • Personal Statistics                                |  • Status Updates & Notes
                     |  • Segregation Guide & Tips                           |  • Chart.js Visual Analytics
                     |  • Profile & Ward Settings                            |  • Filtered CSV Data Export
                     |                                                       |
                     +---------------------------+---------------------------+
                                                 |
                                                 v
                            +-------------------------------------------+
                            |         Shared Database Layer             |
                            |       (js/db.js & js/auth.js)             |
                            |                                           |
                            |  [Mode A] Cloud Firestore & Storage       |
                            |  [Mode B] Instant LocalStorage Sync       |
                            +-------------------------------------------+
```

---

## Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | HTML5, Bootstrap 5.3 CDN, Bootstrap Icons | Responsive, mobile-first layouts with accessible components |
| **Typography & Theme** | Google Fonts (Plus Jakarta Sans, Inter), Custom CSS3 | Modern environmental green & municipal navy blue color scheme |
| **Data Visualizations** | Chart.js 4.x CDN | Real-time doughnut, bar, and area density analytics |
| **Authentication & RBAC** | Firebase Auth + Custom Session Engine (`auth.js`) | Role-Based Access Control distinguishing citizens from admins |
| **Database & Cloud Storage** | Cloud Firestore + Firebase Storage (`db.js`) | Scalable document DB and image upload storage with offline fallback |
| **Fallback Persistence** | Synchronized Browser `localStorage` | Zero-configuration demo mode working across browser tabs out-of-the-box |
| **Python Backend (Optional)** | Python 3 + Flask + `unittest` | Server-rendered alternative running locally in VS Code |

---

## Portal Features & Capabilities

### 1. Landing Page & Authentication Gateway (`index.html`)
- **Portal Selection Cards**: Distinct cards with green styling for Citizens and official municipal blue styling for Administrators.
- **Smart Waste Item Finder**: Instant interactive widget ("Where does this item go?") allowing visitors to check item classifications before logging in.
- **3-Step Civic Process**: Educational guide illustrating the workflow (Report Issue &rarr; Municipal Dispatch &rarr; Verified Resolution).
- **Security Notice**: Restricts administrator self-registration and clearly states official policy.

### 2. Citizen User Portal (`user-login.html` & `user-dashboard.html`)
- **Citizen Registration & Login**: Comprehensive 8-field registration (Full Name, Email, Mobile Number, Password, Ward/Locality, City, Profile Photo).
- **Personalized KPI Cards**: Overview of citizen's own submitted reports, pending items, active investigations, and resolved tickets.
- **Complaint Submission Engine**:
  - 9 structured categories (Wet Waste, Dry Waste, E-Waste, Hazardous, Special, Littering, Garbage Overflow, Plastic Pollution, Drainage).
  - Landmark and location input with Ward selector.
  - Photographic evidence attachment with client-side preview.
  - Anti-spam submission locking to prevent duplicate tickets.
- **Live Complaint Tracking**: Tabular and card views of submitted complaints with real-time status badges (`Pending`, `In Progress`, `Resolved`, `Rejected`).
- **Detailed Audit Timeline Modal**: Chronological history showing exactly who updated the ticket, timestamp, and official municipal remarks.
- **Integrated Knowledge Base**: Direct in-dashboard access to the Waste Segregation Guide and 19 Eco Tips.
- **Citizen Profile Settings**: Update locality, phone number, and avatar photo.

### 3. Municipal Corporation Admin Panel (`admin-login.html` & `admin-dashboard.html`)
- **Restricted Government Login**: Dedicated login gateway strictly requiring provisioned administrator credentials. Public sign-up is disabled.
- **Operations Command Center KPIs**:
  - Total complaints intake
  - Pending review count (requiring triage)
  - In Progress counter (assigned to field crews)
  - Resolved complaints (closed and verified)
  - Rejected tickets (invalid or duplicates)
  - Today's complaints intake count
- **Master Complaints Management Table**:
  - Real-time search across Complaint ID, citizen name, location, and keywords.
  - Multi-criteria filter dropdowns: Status, Category, Ward Zone, Priority level, and Date sort.
  - Triage button opening the **Complaint Management Modal**.
- **Interactive Triage Modal**:
  - Full view of citizen report details, address, contact, and submitted photograph.
  - Status transitions (`Pending` &rarr; `In Progress` &rarr; `Resolved` / `Rejected`).
  - Safeguard confirmation dialogs when closing or rejecting complaints.
  - Field Worker assignment dropdown dynamically populated from active sanitation personnel.
  - Responsible Department selector (Solid Waste, Drainage, Health & Sanitation, E-Waste Cell).
  - Internal administrative notes and citizen-facing resolution reports.
- **Real-Time Visual Analytics (Chart.js)**:
  - Waste Category Distribution (Doughnut chart)
  - Complaint Status Funnel (Bar chart)
  - Ward Hotspot Density (Horizontal bar chart)
- **Sanitation Personnel Management**:
  - Directory of field workers with IDs, department, assigned ward, and contact numbers.
  - Active task counter showing assigned workload per worker.
  - "Register New Field Worker" modal for adding sanitation staff.
- **Filter-Aware CSV Report Exporter**:
  - One-click export to download official `.csv` reports for record-keeping and external analysis.

### 4. Waste Segregation & Eco Tips Hub
- **Segregation Guide (`segregation.html`)**: Interactive tabs for 5 waste streams (Wet, Dry, E-Waste, Hazardous, Special) with definitions, common examples, safe handling techniques, and municipal advisories.
- **Eco Tips Hub (`tips.html`)**: 19 categorized tips with "Tip of the Day" carousel, category filter pills, and instant search.

---

## Pre-configured Demonstration Accounts (For College Viva)

For testing and viva demonstrations, the system includes pre-seeded demonstration accounts that work out of the box without needing Firebase credentials:

| Role | Portal Link | Username / Email | Password |
|---|---|---|---|
| **Municipal Admin** | `admin-login.html` | `admin@municipal.gov.in` | `Admin@2026` |
| **Citizen User** | `user-login.html` | `citizen@example.com` | `Citizen@123` |

> Both login pages include a one-click **"Autofill Credentials"** button for quick demonstration during project evaluations.

---

## Data Persistence Architecture

The application implements an **adaptive dual-mode data layer** in `js/db.js` and `js/auth.js`:

1. **Production Mode (Cloud Firestore & Firebase Storage)**:
   - When Firebase API keys are supplied in `js/firebase-config.js`, all citizen complaints, photo uploads, user profiles, and status audit logs are synchronized in real-time to Google Cloud Firestore.
   - Enforced by production security rules (`firestore.rules` and `storage.rules`).

2. **Demonstration / Offline Mode (Local Storage Synchronizer)**:
   - If Firebase keys remain placeholders, the application seamlessly activates an internal storage layer using browser `localStorage`.
   - Seeded with sample complaints (`CMP-2026-001` through `CMP-2026-004`) and field workers (`WRK-101` through `WRK-105`).
   - Any report submitted in the Citizen Portal appears immediately in the Municipal Corporation Admin Panel when opened in another browser tab.

---

## Step-by-Step GitHub Pages Deployment Guide

Follow these steps to deploy all changes to your GitHub Pages repository:

### 1. Open Terminal in the GitHub Pages Folder
```powershell
cd "C:\Users\Abhijeet Thorat\.gemini\antigravity\scratch\community-cleanliness-web\github-pages"
```

### 2. Copy the Files to Your Local Git Clone of `Cep-Project`
```powershell
# Assuming your local clone of Cep-Project is located at C:\Users\Abhijeet Thorat\Desktop\Cep-Project (or similar path)
# Copy all files from github-pages into your repo:
Copy-Item -Path ".\*" -Destination "<PATH_TO_YOUR_CEP_PROJECT_REPO>" -Recurse -Force
```

### 3. Commit and Push to GitHub
```bash
git add .
git commit -m "Add User Login, Citizen Dashboard, and Municipal Corporation Admin Panel with Analytics"
git push origin main
```

### 4. Enable GitHub Pages in Repository Settings
1. Go to your repository on GitHub: `https://github.com/abhijeett7666/Cep-Project`.
2. Navigate to **Settings** &rarr; **Pages**.
3. Under **Branch**, select `main` and folder `/ (root)`.
4. Click **Save**.
5. Your updated website will be live in 1-2 minutes at: `https://abhijeett7666.github.io/Cep-Project/`.

---

## Firebase Setup Guide

To connect the application to your own live Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project (e.g. `swachh-community`).
2. Enable **Authentication** &rarr; Sign-in method &rarr; Enable **Email/Password**.
3. Enable **Cloud Firestore** in test or production mode.
4. Enable **Firebase Storage** for photos.
5. In Project Settings &rarr; General &rarr; **Your apps**, register a Web App (`</>`).
6. Copy the `firebaseConfig` object and paste it into `js/firebase-config.js`:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
7. Deploy the provided `firestore.rules` and `storage.rules` to enforce role-based access control.

---

## Local Python Flask Execution Guide

If presenting as a Python full-stack application:

```powershell
cd "C:\Users\Abhijeet Thorat\.gemini\antigravity\scratch\community-cleanliness-web"
python -m pip install -r requirements.txt
python app.py
```
Open your browser at `http://127.0.0.1:5000`.

To run the automated test suite:
```powershell
python -m unittest discover -s tests -p "test_*.py" -v
```

---

## College Viva & Defense Q&A

### Q1: Why are there two separate portals instead of a single page?
> **Answer:** In civic administration, separation of duties is critical. Citizens need an intuitive interface to report issues, upload photos, and track the progress of their complaints. Municipal corporation administrators require an operational command center to prioritize complaints, assign field sanitation workers, update audit trails, and review ward analytics. Combining both into one interface creates security risks and poor user experience.

### Q2: How is role-based access control (RBAC) enforced?
> **Answer:** Role-based access control is enforced at both the UI route guard level and the database level:
> - Route guards (`Auth.requireCitizen()` and `Auth.requireAdmin()`) inspect session credentials and redirect unauthorized users.
> - Public registration is restricted to citizen accounts only; users cannot self-assign administrator privileges.
> - In Firebase, `firestore.rules` enforces that only authenticated users with administrative privileges can update complaint statuses or worker assignments.

### Q3: How do the Citizen Portal and Admin Panel communicate?
> **Answer:** They share a unified database layer (`db.js`). When a citizen submits a complaint on `user-dashboard.html`, it is written to the shared complaints repository. When an administrator logs into `admin-dashboard.html`, the system reads from this same repository, enabling immediate triage, worker dispatch, and status updates that reflect back to the citizen's audit timeline.

### Q4: Why can this run on GitHub Pages without a backend server?
> **Answer:** GitHub Pages hosts static web assets (HTML, CSS, JS). By utilizing client-side Firebase SDKs (Auth, Firestore, Storage) via CDN, the application operates as a serverless Single Page Application (SPA). For offline demonstration, the built-in `localStorage` bridge provides synchronous data sharing across browser tabs without needing external servers.

---

## Academic Disclaimer

This application is an educational civic prototype developed for academic evaluation, community awareness, and technical demonstration. In demonstration mode, submitted reports are logged in persistent storage and are not dispatched to government emergency lines.
