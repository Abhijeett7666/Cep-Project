/**
 * Community Cleanliness & Waste Awareness System
 * Client-Side JavaScript for GitHub Pages Static Deployment
 * Includes localStorage persistence, CSV export, live filtering, and tip cycler.
 */

// -----------------------------------------------------------------------------
// Environmental Tips Dataset
// -----------------------------------------------------------------------------
const APP_TIPS_DATA = [
  {
    "id": 1,
    "area": "Reducing Single-Use Plastic",
    "category_slug": "plastic",
    "icon": "bi-bag-check",
    "tip": "Carry a durable cloth or canvas tote bag whenever you step out to avoid plastic bags."
  },
  {
    "id": 2,
    "area": "Reducing Single-Use Plastic",
    "category_slug": "plastic",
    "icon": "bi-cup-straw",
    "tip": "Bring your own stainless steel water bottle and skip buying single-use bottled water."
  },
  {
    "id": 3,
    "area": "Reducing Single-Use Plastic",
    "category_slug": "plastic",
    "icon": "bi-slash-circle",
    "tip": "Decline single-use plastic cutlery and straws; carry reusable portable utensils in your bag."
  },
  {
    "id": 4,
    "area": "Saving Water",
    "category_slug": "water",
    "icon": "bi-droplet-half",
    "tip": "Turn off running taps while brushing your teeth or washing hands to save up to 6 liters per minute."
  },
  {
    "id": 5,
    "area": "Saving Water",
    "category_slug": "water",
    "icon": "bi-wrench",
    "tip": "Report and immediately repair leaky faucets and flush valves across college hostels and campus labs."
  },
  {
    "id": 6,
    "area": "Saving Water",
    "category_slug": "water",
    "icon": "bi-flower1",
    "tip": "Reuse water drained from rinsing rice, pulses, and vegetables to nourish potted garden plants."
  },
  {
    "id": 7,
    "area": "Conserving Electricity",
    "category_slug": "energy",
    "icon": "bi-lightbulb-off",
    "tip": "Switch off lights, fans, computer displays, and projectors whenever stepping out of classrooms."
  },
  {
    "id": 8,
    "area": "Conserving Electricity",
    "category_slug": "energy",
    "icon": "bi-plug",
    "tip": "Unplug chargers and idle electronic adapters; phantom standby power can consume 10% of household electricity."
  },
  {
    "id": 9,
    "area": "Conserving Electricity",
    "category_slug": "energy",
    "icon": "bi-sun",
    "tip": "Utilize natural window daylight in study spaces during daytime hours rather than artificial illumination."
  },
  {
    "id": 10,
    "area": "Recycling and Reusing Materials",
    "category_slug": "reuse",
    "icon": "bi-file-earmark-text",
    "tip": "Use blank reverse sides of printed handouts and assignments for rough calculations and brainstorming notes."
  },
  {
    "id": 11,
    "area": "Recycling and Reusing Materials",
    "category_slug": "reuse",
    "icon": "bi-box-seam",
    "tip": "Wash and repurpose glass containers and plastic jars to organize stationery, cables, and dry groceries."
  },
  {
    "id": 12,
    "area": "Recycling and Reusing Materials",
    "category_slug": "reuse",
    "icon": "bi-book",
    "tip": "Donate completed course textbooks, lab notebooks, and unused stationery to juniors or library donation boxes."
  },
  {
    "id": 13,
    "area": "Keeping Public Places Clean",
    "category_slug": "cleanliness",
    "icon": "bi-trash3",
    "tip": "Never litter in public streets or campus pathways; keep trash in your pocket until you spot an appropriate bin."
  },
  {
    "id": 14,
    "area": "Keeping Public Places Clean",
    "category_slug": "cleanliness",
    "icon": "bi-people",
    "tip": "Join or coordinate monthly cleanliness and plogging drives in campus grounds and neighborhood parks."
  },
  {
    "id": 15,
    "area": "Keeping Public Places Clean",
    "category_slug": "cleanliness",
    "icon": "bi-signpost-split",
    "tip": "Practice waste segregation at source by depositing waste into distinct wet and dry bins at public food courts."
  },
  {
    "id": 16,
    "area": "Composting Suitable Organic Waste",
    "category_slug": "composting",
    "icon": "bi-tree",
    "tip": "Set up a terracotta pot composter for fruit and vegetable peels to produce natural nutrient-rich plant fertilizer."
  },
  {
    "id": 17,
    "area": "Composting Suitable Organic Waste",
    "category_slug": "composting",
    "icon": "bi-layers",
    "tip": "Balance wet green kitchen waste with dry browns (dry leaves, shredded unprinted cardboard) to ensure odorless composting."
  },
  {
    "id": 18,
    "area": "Responsible E-Waste Disposal",
    "category_slug": "ewaste",
    "icon": "bi-phone",
    "tip": "Dispose of depleted batteries, chargers, and dead gadgets at authorized e-waste bins rather than household trash."
  },
  {
    "id": 19,
    "area": "Responsible E-Waste Disposal",
    "category_slug": "ewaste",
    "icon": "bi-tools",
    "tip": "Repair cracked screens or battery issues before deciding to replace electronic devices with new models."
  }
];

// -----------------------------------------------------------------------------
// LocalStorage Persistence Helpers
// -----------------------------------------------------------------------------
const STORAGE_KEY = "cleanliness_community_reports";

function getStoredReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading localStorage:", e);
    return [];
  }
}

function saveReportToStorage(location, issueType, description) {
  const reports = getStoredReports();
  
  // Calculate next sequential ID (ENV-0001, ENV-0002...)
  let maxId = 0;
  reports.forEach(r => {
    if (r.id && r.id.startsWith("ENV-")) {
      const num = parseInt(r.id.replace("ENV-", ""), 10);
      if (!isNaN(num) && num > maxId) maxId = num;
    }
  });
  
  const nextNumber = maxId + 1;
  const nextId = "ENV-" + String(nextNumber).padStart(4, "0");
  
  const now = new Date();
  const timestamp = now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0") + " " +
    String(now.getHours()).padStart(2, "0") + ":" +
    String(now.getMinutes()).padStart(2, "0") + ":" +
    String(now.getSeconds()).padStart(2, "0");

  const newReport = {
    id: nextId,
    timestamp: timestamp,
    location: location.trim(),
    issue_type: issueType.trim(),
    description: description.trim() || "No description provided"
  };

  reports.unshift(newReport); // Add newest first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return newReport;
}

// -----------------------------------------------------------------------------
// CSV Exporter for GitHub Pages (Exports true reports.csv from browser)
// -----------------------------------------------------------------------------
function exportReportsToCSV() {
  const reports = getStoredReports();
  if (reports.length === 0) {
    alert("No reports recorded yet to export.");
    return;
  }

  let csvContent = "Report ID,Timestamp,Location,Issue Type,Description\r\n";
  reports.forEach(r => {
    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };
    csvContent += [
      escapeCsv(r.id),
      escapeCsv(r.timestamp),
      escapeCsv(r.location),
      escapeCsv(r.issue_type),
      escapeCsv(r.description)
    ].join(",") + "\r\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "reports.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// -----------------------------------------------------------------------------
// Page Initializers
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initIndexPage();
  initTipsPage();
  initReportFormPage();
  initViewReportsPage();
});

// Home Page Metrics
function initIndexPage() {
  const reportCountElem = document.getElementById("homeReportCount");
  const recentTableBody = document.getElementById("homeRecentReportsBody");
  const noReportsAlert = document.getElementById("homeNoReportsAlert");
  const recentSection = document.getElementById("homeRecentSection");

  if (!reportCountElem) return;

  const reports = getStoredReports();
  reportCountElem.textContent = reports.length;

  if (reports.length === 0) {
    if (noReportsAlert) noReportsAlert.style.display = "block";
    if (recentSection) recentSection.style.display = "none";
  } else {
    if (noReportsAlert) noReportsAlert.style.display = "none";
    if (recentSection) recentSection.style.display = "block";

    if (recentTableBody) {
      recentTableBody.innerHTML = "";
      const latest = reports.slice(0, 3);
      latest.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><span class="badge-id">${r.id}</span></td>
          <td class="small text-muted">${r.timestamp}</td>
          <td class="fw-semibold">${r.location}</td>
          <td><span class="badge bg-light text-dark border">${r.issue_type}</span></td>
          <td class="small text-muted">${r.description.length > 60 ? r.description.substring(0, 57) + "..." : r.description}</td>
        `;
        recentTableBody.appendChild(tr);
      });
    }
  }
}

// Tips Page
function initTipsPage() {
  const filterPills = document.querySelectorAll(".filter-pill");
  const tipCards = document.querySelectorAll(".tip-item");
  const searchInput = document.getElementById("tipSearchInput");

  if (filterPills.length && tipCards.length) {
    let activeCategory = "all";
    let searchQuery = "";

    function applyFilters() {
      let count = 0;
      tipCards.forEach(card => {
        const cat = card.getAttribute("data-category");
        const txt = card.textContent.toLowerCase();
        const matchesCat = activeCategory === "all" || cat === activeCategory;
        const matchesSearch = searchQuery === "" || txt.includes(searchQuery);

        if (matchesCat && matchesSearch) {
          card.style.display = "block";
          count++;
        } else {
          card.style.display = "none";
        }
      });

      const emptyNotice = document.getElementById("tipsEmptyNotice");
      if (emptyNotice) {
        emptyNotice.style.display = count === 0 ? "block" : "none";
      }
    }

    filterPills.forEach(pill => {
      pill.addEventListener("click", () => {
        filterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        activeCategory = pill.getAttribute("data-filter");
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", e => {
        searchQuery = e.target.value.trim().toLowerCase();
        applyFilters();
      });
    }
  }

  // Tip of the Day Cycler
  const tipText = document.getElementById("dailyTipText");
  const tipArea = document.getElementById("dailyTipArea");
  const nextBtn = document.getElementById("nextTipBtn");
  const prevBtn = document.getElementById("prevTipBtn");

  if (tipText) {
    let currentIdx = Math.floor(Math.random() * APP_TIPS_DATA.length);
    function render(idx) {
      const t = APP_TIPS_DATA[idx];
      tipText.textContent = `"${t.tip}"`;
      if (tipArea) {
        tipArea.textContent = `${t.area} (${idx + 1} of ${APP_TIPS_DATA.length})`;
      }
    }
    render(currentIdx);

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        currentIdx = (currentIdx + 1) % APP_TIPS_DATA.length;
        render(currentIdx);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        currentIdx = (currentIdx - 1 + APP_TIPS_DATA.length) % APP_TIPS_DATA.length;
        render(currentIdx);
      });
    }
  }
}

// Issue Reporting Form Page
function initReportFormPage() {
  const form = document.getElementById("reportIssueForm");
  const locationInput = document.getElementById("location");
  const issueSelect = document.getElementById("issue_type");
  const descInput = document.getElementById("description");
  const feedback = document.getElementById("locationFeedback");

  if (!form || !locationInput) return;

  locationInput.addEventListener("input", () => {
    const val = locationInput.value.trim();
    if (val.length >= 2) {
      locationInput.classList.remove("is-invalid");
      locationInput.classList.add("is-valid");
    } else {
      locationInput.classList.remove("is-valid");
      locationInput.classList.add("is-invalid");
      if (feedback) feedback.textContent = "Please enter at least 2 characters.";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const locVal = locationInput.value.trim();
    const issueVal = issueSelect ? issueSelect.value.trim() : "";
    const descVal = descInput ? descInput.value.trim() : "";

    if (locVal.length < 2) {
      locationInput.classList.add("is-invalid");
      locationInput.focus();
      return;
    }
    if (!issueVal) {
      issueSelect.classList.add("is-invalid");
      issueSelect.focus();
      return;
    }

    const saved = saveReportToStorage(locVal, issueVal, descVal);
    // Flash notification message via sessionStorage
    sessionStorage.setItem("last_submission_flash", JSON.stringify(saved));
    // Redirect to view_reports.html
    window.location.href = "view_reports.html";
  });
}

// Saved Reports Dashboard Page
function initViewReportsPage() {
  const tableBody = document.getElementById("reportsTableBody");
  const cardsList = document.getElementById("reportsCardsList");
  const totalCountSpan = document.getElementById("visibleReportsCount");
  const overallCountSpan = document.getElementById("overallReportsCount");
  const emptyState = document.getElementById("reportsEmptyState");
  const contentSection = document.getElementById("reportsContentSection");
  const searchInput = document.getElementById("clientSearchInput");
  const typeFilter = document.getElementById("clientTypeFilter");
  const noMatchMsg = document.getElementById("noMatchRow");
  const flashContainer = document.getElementById("flashMessageContainer");
  const exportBtn = document.getElementById("exportCsvBtn");

  if (!tableBody && !cardsList) return;

  // Check for newly submitted flash alert
  const flashData = sessionStorage.getItem("last_submission_flash");
  if (flashData && flashContainer) {
    try {
      const rep = JSON.parse(flashData);
      flashContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm p-4 mb-4" role="alert" style="background-color: #d1e7dd; border-left: 6px solid #198754 !important;">
          <div class="d-flex align-items-start gap-3">
            <i class="bi bi-check-circle-fill fs-2 text-success mt-1"></i>
            <div class="flex-grow-1">
              <h5 class="alert-heading fw-bold text-success mb-1">Report Submitted Successfully!</h5>
              <div class="mb-2">
                <span class="badge bg-success fs-6 me-2">ID: ${rep.id}</span>
                <span class="badge bg-light text-dark border me-2"><i class="bi bi-geo-alt me-1"></i>${rep.location}</span>
                <span class="badge bg-light text-dark border"><i class="bi bi-tag me-1"></i>${rep.issue_type}</span>
              </div>
              <p class="mb-0 text-muted">Your issue has been recorded with ID ${rep.id} and saved locally. Note: This is an academic community prototype; reports are stored locally in browser storage / CSV and not dispatched automatically to municipal authorities.</p>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </div>
      `;
      sessionStorage.removeItem("last_submission_flash");
    } catch (e) {
      console.error(e);
    }
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", exportReportsToCSV);
  }

  function renderReports() {
    const reports = getStoredReports();
    if (overallCountSpan) overallCountSpan.textContent = reports.length;

    if (reports.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      if (contentSection) contentSection.style.display = "none";
      return;
    }

    if (emptyState) emptyState.style.display = "none";
    if (contentSection) contentSection.style.display = "block";

    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedType = typeFilter ? typeFilter.value.trim() : "";

    let matchCount = 0;
    if (tableBody) tableBody.innerHTML = "";
    if (cardsList) cardsList.innerHTML = "";

    reports.forEach(r => {
      const loc = (r.location || "").toLowerCase();
      const id = (r.id || "").toLowerCase();
      const desc = (r.description || "").toLowerCase();
      const itype = r.issue_type || "";

      const matchesQuery = query === "" || loc.includes(query) || id.includes(query) || desc.includes(query);
      const matchesType = selectedType === "" || itype === selectedType;

      if (matchesQuery && matchesType) {
        matchCount++;

        // Desktop Table Row
        if (tableBody) {
          const tr = document.createElement("tr");
          tr.className = "report-row";
          tr.innerHTML = `
            <td><span class="badge-id">${r.id}</span></td>
            <td class="small text-muted text-nowrap"><i class="bi bi-calendar3 me-1"></i>${r.timestamp}</td>
            <td class="fw-semibold text-dark"><i class="bi bi-geo-alt-fill text-danger me-1 small"></i>${r.location}</td>
            <td><span class="badge bg-light text-dark border"><i class="bi bi-tag me-1 text-primary"></i>${r.issue_type}</span></td>
            <td class="small text-secondary">${r.description}</td>
          `;
          tableBody.appendChild(tr);
        }

        // Mobile Card
        if (cardsList) {
          const card = document.createElement("div");
          card.className = "eco-card p-3 report-card-item";
          card.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge-id">${r.id}</span>
              <span class="badge bg-light text-dark border">${r.issue_type}</span>
            </div>
            <h5 class="fw-bold mb-1"><i class="bi bi-geo-alt text-danger me-1"></i>${r.location}</h5>
            <p class="small text-muted mb-2"><i class="bi bi-clock me-1"></i>${r.timestamp}</p>
            <p class="small text-secondary mb-0 bg-light p-2 rounded">${r.description}</p>
          `;
          cardsList.appendChild(card);
        }
      }
    });

    if (totalCountSpan) totalCountSpan.textContent = matchCount;
    if (noMatchMsg) noMatchMsg.style.display = matchCount === 0 ? "block" : "none";
  }

  renderReports();

  if (searchInput) searchInput.addEventListener("input", renderReports);
  if (typeFilter) typeFilter.addEventListener("change", renderReports);
}
