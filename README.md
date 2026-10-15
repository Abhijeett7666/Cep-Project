# Community Cleanliness & Waste Awareness Web Application
### A Full-Stack College Mini-Project in Python, Flask, and Responsive Modern Web UI

A responsive, beginner-friendly web application designed to promote municipal waste segregation awareness, practical everyday environmental habits, and structured community cleanliness issue reporting with local CSV persistence.

---

## Table of Contents

1. [Project Overview & Key Objectives](#project-overview--key-objectives)
2. [Technology Stack](#technology-stack)
3. [Architecture & Project Structure](#architecture--project-structure)
4. [Core Features](#core-features)
5. [Prerequisites & Environment Setup](#prerequisites--environment-setup)
6. [Step-by-Step Execution Guide (Windows / VS Code)](#step-by-step-execution-guide-windows--vs-code)
7. [CSV Data Persistence Mechanism](#csv-data-persistence-mechanism)
8. [Automated Testing & Results](#automated-testing--results)
9. [College Viva & Defense Guide (Q&A)](#college-viva--defense-guide-qa)
10. [Current Limitations & Future Enhancements](#current-limitations--future-enhancements)
11. [Academic Disclaimer](#academic-disclaimer)

---

## Project Overview & Key Objectives

The **Community Cleanliness & Waste Awareness System** has been refactored from a console prototype into an intuitive full-stack web application. It addresses campus hygiene and community waste segregation challenges through four core pillars:

- **Interactive Waste Education**: Educates users on the 5 municipal waste streams (Wet, Dry, E-Waste, Hazardous, Special).
- **Behavioral Tips Hub**: Provides 19 actionable sustainability practices across 7 key environmental categories.
- **Structured Community Reporting**: Enables students and residents to report cleanliness concerns with validation, automatic timestamping, and collision-free sequential IDs (`ENV-0001`, `ENV-0002`...).
- **Transparent Local Dashboard**: Displays logged reports in a searchable, filterable data dashboard backed by local CSV storage.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | Python 3 + Flask | Modular controller routes, session management, and server-side validation |
| **Data Storage** | Standard Library `csv` | Lightweight, collision-free local persistence in `reports.csv` |
| **Frontend Layout** | Semantic HTML5 & Jinja2 | Dynamic server-side templating with template inheritance (`base.html`) |
| **Styling** | Custom CSS3 + Bootstrap 5.3 CDN | Eco-conscious palette, responsive grid, and mobile-first card layouts |
| **Interactivity** | Vanilla JavaScript | Instant client-side search, category filter pills, and "Tip of the Day" carousel |
| **Testing** | Standard Library `unittest` | 18 automated tests verifying route responses, form validation, and CSV safety |

> **No Node.js, Webpack, or heavy JavaScript build steps required.** Runs instantly with standard Python.

---

## Architecture & Project Structure

```text
community-cleanliness-web/
├── app.py                  # Flask routes, form handlers, CSV helper functions
├── reports.csv             # Local CSV storage database
├── requirements.txt        # Flask dependency specification
├── static/
│   ├── css/
│   │   └── style.css       # Custom eco-friendly styling and responsive cards
│   └── js/
│       └── main.js         # Vanilla JS: instant search, tip cycler, form feedback
├── templates/
│   ├── base.html           # Master layout: Navbar, flash messages, footer
│   ├── index.html          # Hero section, statistics, and module cards
│   ├── segregation.html    # 5-category segregation guide with tabs & warnings
│   ├── tips.html           # 19 environmental tips with category filters & cycler
│   ├── report_issue.html   # Validated community reporting form
│   └── view_reports.html   # Searchable & filterable reports table/cards
├── tests/
│   └── test_web_app.py     # Automated test suite (18 unit/route tests)
└── README.md               # Project documentation and viva defense notes
```

---

## Core Features

### 1. Interactive Waste Segregation Guide (`/segregation`)
- Visual overview of 5 critical waste categories:
  1. **Wet Waste** (food scraps, fruit rinds, organic compostables)
  2. **Dry Recyclable Waste** (paper, clean plastic, cardboard, glass, tins)
  3. **E-Waste** (gadgets, chargers, batteries, electrical peripherals)
  4. **Hazardous Household Waste** (paints, solvents, pesticides, engine oil)
  5. **Special Waste** (sanitary hygiene items, bulky furniture, rubble)
- Detailed breakdown per category: Definition, Common Examples, Disposal Methods, and Safety Notes.
- **Municipal Notice**: Clear alert noting that recycling capabilities and schedules depend on local municipal infrastructure.

### 2. Environmental Tips Hub (`/tips`)
- 19 practical tips across 7 critical sustainability categories:
  - Reducing single-use plastics
  - Saving clean water
  - Conserving electrical energy
  - Reusing and repurposing items
  - Keeping campus/neighborhood grounds clean
  - Composting organic kitchen scraps
  - Responsible e-waste recycling
- **Tip of the Day Spotlight**: Interactive carousel box with Previous/Next buttons.
- **Client-Side Filter Pills & Live Search**: Filter by category or search by keyword instantly without page reloads.

### 3. Community Issue Reporting Form (`/report`)
- Clean user-friendly input fields:
  - **Location / Area Name**: Required, validated client-side and server-side (rejects empty/whitespace-only input; min 2 chars).
  - **Issue Category Dropdown**: 6 standardized categories (`Littering`, `Overflowing Dustbin`, `Improper Waste Segregation`, `Plastic Pollution`, `Drainage / Stagnant Water Issue`, `Other Environmental Issue`).
  - **Description**: Optional multi-line textarea.
- Auto-generates unique sequential IDs (`ENV-0001`, `ENV-0002`...) and system timestamps (`YYYY-MM-DD HH:MM:SS`).
- Stores data in `reports.csv` and displays a success alert with the generated Report ID.
- **Local Prototype Disclaimer**: Transparently clarifies that reports are saved locally for campus tracking and not automatically sent to civic municipal servers.

### 4. Saved Reports Dashboard (`/reports`)
- Responsive data table for desktops and card grid for mobile devices.
- Dynamic search bar matching Report ID, Location, or Description.
- Dropdown filter by Issue Category.
- Gracefully handles empty states ("No reports submitted yet") and corrupt/malformed CSV rows.
- Bonus JSON API endpoint: `GET /api/reports`.

---

## Prerequisites & Environment Setup

- **Python**: Python 3.8 or higher.
- **Operating System**: Windows, macOS, or Linux.
- **Editor**: Visual Studio Code (recommended).

---

## Step-by-Step Execution Guide (Windows / VS Code)

### 1. Open the Project Folder in VS Code
1. Launch **Visual Studio Code**.
2. Click **File > Open Folder...** and select:
   ```text
   C:\Users\Abhijeet Thorat\.gemini\antigravity\scratch\community-cleanliness-web
   ```
3. Open the integrated terminal with `` Ctrl + ` `` (Backtick).

### 2. (Optional but Recommended) Create a Virtual Environment
```powershell
py -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```
*(Or with the Python launcher: `py -m pip install -r requirements.txt`)*

### 4. Launch the Web Server
```powershell
python app.py
```
*(Or `py app.py`)*

### 5. Access the Web Application
Open your web browser and navigate to:
```text
http://127.0.0.1:5000
```

---

## CSV Data Persistence Mechanism

Reports are stored in `reports.csv` in the root folder.

### Header Format:
```csv
Report ID,Timestamp,Location,Issue Type,Description
```

### Sample Record:
```csv
ENV-0001,2026-10-15 19:55:00,Chemistry Lab Backyard,Improper Waste Segregation,Reagent bottles mixed with dry cardboard
```

### Key Safety Guarantees:
- **Collision-Free IDs**: `get_next_report_id()` inspects existing CSV records to find the highest numerical ID before generating the next sequence number.
- **Malformed Line Tolerance**: `get_all_reports()` skips corrupted rows (< 5 columns) and blank lines without crashing the server.
- **Safe Escaping**: Python's `csv.writer` handles commas, quotes, and newlines in user text automatically.

---

## Automated Testing & Results

The project includes 18 automated unit and integration tests in `tests/test_web_app.py` utilizing temporary directories so your actual `reports.csv` database remains untouched.

### Running the Test Suite:
```powershell
py -m unittest discover -s tests -p "test_*.py" -v
```

### Test Results:
```text
test_ensure_csv_file_creation (test_web_app.TestCSVHelpers.test_ensure_csv_file_creation) ... ok
test_read_malformed_csv_graceful (test_web_app.TestCSVHelpers.test_read_malformed_csv_graceful) ... ok
test_save_report_invalid_issue_type (test_web_app.TestCSVHelpers.test_save_report_invalid_issue_type) ... ok
test_save_report_invalid_location (test_web_app.TestCSVHelpers.test_save_report_invalid_location) ... ok
test_save_report_validation_and_writing (test_web_app.TestCSVHelpers.test_save_report_validation_and_writing) ... ok
test_sequential_id_generation (test_web_app.TestCSVHelpers.test_sequential_id_generation) ... ok
test_environmental_tips_count_and_areas (test_web_app.TestDataAndConstants.test_environmental_tips_count_and_areas) ... ok
test_issue_types_list (test_web_app.TestDataAndConstants.test_issue_types_list) ... ok
test_waste_categories_coverage (test_web_app.TestDataAndConstants.test_waste_categories_coverage) ... ok
test_api_reports_endpoint (test_web_app.TestFlaskWebRoutes.test_api_reports_endpoint) ... ok
test_index_route (test_web_app.TestFlaskWebRoutes.test_index_route) ... ok
test_report_issue_get_form (test_web_app.TestFlaskWebRoutes.test_report_issue_get_form) ... ok
test_report_issue_post_empty_location_rejects (test_web_app.TestFlaskWebRoutes.test_report_issue_post_empty_location_rejects) ... ok
test_report_issue_post_valid_redirects_and_persists (test_web_app.TestFlaskWebRoutes.test_report_issue_post_valid_redirects_and_persists) ... ok
test_segregation_guide_route (test_web_app.TestFlaskWebRoutes.test_segregation_guide_route) ... ok
test_tips_route (test_web_app.TestFlaskWebRoutes.test_tips_route) ... ok
test_view_reports_empty_state (test_web_app.TestFlaskWebRoutes.test_view_reports_empty_state) ... ok
test_view_reports_with_data_and_filtering (test_web_app.TestFlaskWebRoutes.test_view_reports_with_data_and_filtering) ... ok

----------------------------------------------------------------------
Ran 18 tests in 0.148s

OK
```

---

## College Viva & Defense Guide (Q&A)

### Q1: Why did you choose Flask instead of Django or FastAPI?
**Answer**: Flask is a lightweight micro-framework ideal for college mini-projects. It gives complete control over routes and views without introducing heavy boilerplate like Django ORMs or ASGI dependencies that are unnecessary for file-based CSV storage.

### Q2: How does the application prevent duplicate or conflicting Report IDs?
**Answer**: Through the helper function `get_next_report_id()`. When saving, the application reads `reports.csv`, extracts the numerical part of all existing IDs starting with `ENV-`, identifies the maximum integer, and increments it by 1 (e.g., `max(1, 2) + 1 = 3 -> ENV-0003`).

### Q3: How is data persisted without an SQL database?
**Answer**: Using Python's built-in `csv` module with `csv.writer` and `csv.reader`. When a user submits a report, the application safely appends a row with proper delimiters to `reports.csv`. When viewing, `get_all_reports()` reads the rows, checks for malformed lines, and passes dictionary records to Jinja2 templates.

### Q4: How is client-side and server-side validation handled?
**Answer**:
- **Client-Side**: In `main.js`, form listeners check the location field on typing and before submit, giving immediate green/red input outlines without waiting for network round-trips.
- **Server-Side**: In `app.py`, `validate_report_data()` trims whitespace, rejects inputs shorter than 2 characters, and ensures the selected issue type matches the permitted list.

### Q5: What design pattern is used here?
**Answer**: A clean **MVC (Model-View-Controller)** pattern:
- **Model**: Python CSV helper functions and data structures (`save_report`, `get_all_reports`, `WASTE_CATEGORIES`).
- **View**: Jinja2 HTML templates (`base.html`, `report_issue.html`, etc.) styled with CSS.
- **Controller**: Flask route functions in `app.py` receiving HTTP requests and returning rendered responses.

---

## Current Limitations & Future Enhancements

### Current Limitations:
1. **Local Storage**: Data is saved to local disk in CSV format; concurrent write operations from thousands of simultaneous web users are not supported.
2. **No Image Uploads**: Citizens cannot yet attach photo evidence of overflowing bins.
3. **No Automatic Civic Dispatch**: Reports are tracked locally for academic awareness and not forwarded to municipal authorities.

### Future Enhancements:
- **Database Migration**: Upgrade CSV storage to SQLite or PostgreSQL via SQLAlchemy.
- **Photo Uploads**: Allow photo attachments stored in a local static directory or AWS S3.
- **Geolocation**: Integrate OpenStreetMap / Leaflet.js to pinpoint report coordinates on an interactive map.
- **Municipal API Hook**: Connect to civic redressal systems (e.g., Swachhata API) for automated municipal complaint logging.

---

## Academic Disclaimer

> **Note**: This application is an educational prototype developed for academic coursework. All data is stored locally in `reports.csv` on the host machine. It is not affiliated with any government municipal department. For public municipal emergencies, contact your local municipal corporation directly.
