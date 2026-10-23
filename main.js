/**
 * Community Cleanliness & Waste Intelligence System - Prototype v2.4
 * Enhanced Client-Side Logic:
 * - Waste Item Finder ("Where does this go?")
 * - Prototype Demo Data Loader
 * - LocalStorage Persistence with Sequential IDs
 * - CSV & JSON Exporters
 * - Real-time Search & Multi-criteria Filtering
 */

// -----------------------------------------------------------------------------
// Waste Item Lookup Dataset (Instant "Where does this go?" Finder)
// -----------------------------------------------------------------------------
const WASTE_ITEMS_DATABASE = [
  { item: "Banana Peel", category: "Wet Waste", bin: "Green Bin", color: "success", tip: "100% biodegradable. Great for home or community composting." },
  { item: "Apple Core / Fruit Rind", category: "Wet Waste", bin: "Green Bin", color: "success", tip: "Drain excess moisture before binning to prevent odors." },
  { item: "Vegetable Peels", category: "Wet Waste", bin: "Green Bin", color: "success", tip: "Mix with dry leaves in home compost for rich garden manure." },
  { item: "Leftover Cooked Food / Bread", category: "Wet Waste", bin: "Green Bin", color: "success", tip: "Drain gravies and liquid before disposing in wet waste." },
  { item: "Tea Leaves & Coffee Grounds", category: "Wet Waste", bin: "Green Bin", color: "success", tip: "High in nitrogen; excellent natural fertilizer for plants." },
  { item: "Egg Shells", category: "Wet Waste", bin: "Green Bin", color: "success", tip: "Crush finely to accelerate decomposition in organic compost." },
  
  { item: "Plastic Water Bottle", category: "Dry Recyclable", bin: "Blue Bin", color: "primary", tip: "Rinse, let dry, and crush flat to conserve bin storage space." },
  { item: "Cardboard Box / Amazon Carton", category: "Dry Recyclable", bin: "Blue Bin", color: "primary", tip: "Flatten carton boxes and remove excess plastic packing tape." },
  { item: "Newspapers & Old Notebooks", category: "Dry Recyclable", bin: "Blue Bin", color: "primary", tip: "Keep completely dry. Send to authorized paper recyclers." },
  { item: "Soda Can / Tin Container", category: "Dry Recyclable", bin: "Blue Bin", color: "primary", tip: "Aluminium and tin are infinitely recyclable. Rinse before disposal." },
  { item: "Glass Jar / Beverage Bottle", category: "Dry Recyclable", bin: "Blue Bin", color: "primary", tip: "Ensure bottle is clean and intact. Wrap cracked glass in paper." },
  { item: "Clean Food Wrapper / Packaging", category: "Dry Recyclable", bin: "Blue Bin", color: "primary", tip: "Only recyclable if free of oily food residues." },

  { item: "Mobile Phone / Smartphone", category: "E-Waste", bin: "Yellow/Orange E-Bin", color: "warning", tip: "Hand over to certified electronics recyclers to recover precious metals." },
  { item: "Phone Charger & USB Cables", category: "E-Waste", bin: "Yellow/Orange E-Bin", color: "warning", tip: "Never throw in general trash. Copper wires are safely reclaimed in e-drives." },
  { item: "Laptop Battery / Power Bank", category: "E-Waste", bin: "Special E-Kiosk", color: "warning", tip: "Lithium batteries pose fire hazards if crushed. Never incinerate." },
  { item: "AA / AAA Dry Cell Batteries", category: "E-Waste", bin: "Battery Drop-off Box", color: "warning", tip: "Leaches cadmium and lead into soil. Deposit at campus battery collection kiosks." },
  { item: "CFL Bulb / LED Tubelight", category: "E-Waste", bin: "Special E-Kiosk", color: "warning", tip: "Contains mercury vapor. Handle gently to prevent breakage." },

  { item: "Chemical Paint / Thinner Can", category: "Hazardous Waste", bin: "Red/Hazardous Drop", color: "danger", tip: "Toxic and flammable. NEVER pour remaining liquid down drainage sinks." },
  { item: "Pesticide / Insecticide Bottle", category: "Hazardous Waste", bin: "Red/Hazardous Drop", color: "danger", tip: "Extreme toxic hazard. Surrender to authorized municipal chemical collection drives." },
  { item: "Concentrated Toilet Cleaner", category: "Hazardous Waste", bin: "Red/Hazardous Drop", color: "danger", tip: "Strong corrosive acids. Retain in original labeled container." },
  { item: "Motor Oil / Brake Fluid", category: "Hazardous Waste", bin: "Hazardous Center", color: "danger", tip: "Poisonous to municipal waterways. Collect in sealed container for automotive recycling." },

  { item: "Sanitary Napkins / Pads", category: "Special Waste", bin: "Red Dot Bag", color: "secondary", tip: "Wrap securely in newspaper with a visible red dot. NEVER flush down toilets." },
  { item: "Baby Diapers", category: "Special Waste", bin: "Red Dot Bag", color: "secondary", tip: "Roll securely into disposal wrap. Treated in high-temperature municipal incinerators." },
  { item: "Medical Bandages & Cotton", category: "Special Waste", bin: "Biomedical Disposal", color: "secondary", tip: "Potential biological contamination. Handle with gloves and dispose safely." },
  { item: "Broken Furniture / Mattresses", category: "Special Waste", bin: "Bulky Municipal Drive", color: "secondary", tip: "Schedule on-demand municipal oversized collection." }
];

// -----------------------------------------------------------------------------
// Environmental Tips Dataset
// -----------------------------------------------------------------------------
const APP_TIPS_DATA = [
  { id: 1, area: "Reducing Single-Use Plastic", category_slug: "plastic", icon: "bi-bag-check", tip: "Carry a durable cloth or canvas tote bag whenever you step out to avoid plastic bags." },
  { id: 2, area: "Reducing Single-Use Plastic", category_slug: "plastic", icon: "bi-cup-straw", tip: "Bring your own stainless steel water bottle and skip buying single-use bottled water." },
  { id: 3, area: "Reducing Single-Use Plastic", category_slug: "plastic", icon: "bi-slash-circle", tip: "Decline single-use plastic cutlery and straws; carry reusable portable utensils in your bag." },
  { id: 4, area: "Saving Water", category_slug: "water", icon: "bi-droplet-half", tip: "Turn off running taps while brushing your teeth or washing hands to save up to 6 liters per minute." },
  { id: 5, area: "Saving Water", category_slug: "water", icon: "bi-wrench", tip: "Report and immediately repair leaky faucets and flush valves across college hostels and campus labs." },
  { id: 6, area: "Saving Water", category_slug: "water", icon: "bi-flower1", tip: "Reuse water drained from rinsing rice, pulses, and vegetables to nourish potted garden plants." },
  { id: 7, area: "Conserving Electricity", category_slug: "energy", icon: "bi-lightbulb-off", tip: "Switch off lights, fans, computer displays, and projectors whenever stepping out of classrooms." },
  { id: 8, area: "Conserving Electricity", category_slug: "energy", icon: "bi-plug", tip: "Unplug chargers and idle electronic adapters; phantom standby power can consume 10% of household electricity." },
  { id: 9, area: "Conserving Electricity", category_slug: "energy", icon: "bi-sun", tip: "Utilize natural window daylight in study spaces during daytime hours rather than artificial illumination." },
  { id: 10, area: "Recycling and Reusing Materials", category_slug: "reuse", icon: "bi-file-earmark-text", tip: "Use blank reverse sides of printed handouts and assignments for rough calculations and brainstorming notes." },
  { id: 11, area: "Recycling and Reusing Materials", category_slug: "reuse", icon: "bi-box-seam", tip: "Wash and repurpose glass containers and plastic jars to organize stationery, cables, and dry groceries." },
  { id: 12, area: "Recycling and Reusing Materials", category_slug: "reuse", icon: "bi-book", tip: "Donate completed course textbooks, lab notebooks, and unused stationery to juniors or library donation boxes." },
  { id: 13, area: "Keeping Public Places Clean", category_slug: "cleanliness", icon: "bi-trash3", tip: "Never litter in public streets or campus pathways; keep trash in your pocket until you spot an appropriate bin." },
  { id: 14, area: "Keeping Public Places Clean", category_slug: "cleanliness", icon: "bi-people", tip: "Join or coordinate monthly cleanliness and plogging drives in campus grounds and neighborhood parks." },
  { id: 15, area: "Keeping Public Places Clean", category_slug: "cleanliness", icon: "bi-signpost-split", tip: "Practice waste segregation at source by depositing waste into distinct wet and dry bins at public food courts." },
  { id: 16, area: "Composting Suitable Organic Waste", category_slug: "composting", icon: "bi-tree", tip: "Set up a terracotta pot composter for fruit and vegetable peels to produce natural nutrient-rich plant fertilizer." },
  { id: 17, area: "Composting Suitable Organic Waste", category_slug: "composting", icon: "bi-layers", tip: "Balance wet green kitchen waste with dry browns (dry leaves, shredded unprinted cardboard) to ensure odorless composting." },
  { id: 18, area: "Responsible E-Waste Disposal", category_slug: "ewaste", icon: "bi-phone", tip: "Dispose of depleted batteries, chargers, and dead gadgets at authorized e-waste bins rather than household trash." },
  { id: 19, area: "Responsible E-Waste Disposal", category_slug: "ewaste", icon: "bi-tools", tip: "Repair cracked screens or battery issues before deciding to replace electronic devices with new models." }
];

// -----------------------------------------------------------------------------
// Sample Prototype Data (Provides instant realistic data for demos)
// -----------------------------------------------------------------------------
const SAMPLE_PROTOTYPE_REPORTS = [
  {
    id: "ENV-0001",
    timestamp: "2026-10-15 09:30:15",
    location: "Science Block Canteen Lawn",
    issue_type: "Littering",
    severity: "Medium",
    status: "Investigating",
    description: "Plastic food wrappers and disposable tea cups accumulated near the lawn benches after lunch hour."
  },
  {
    id: "ENV-0002",
    timestamp: "2026-10-15 11:15:40",
    location: "Central Library Quadrangle",
    issue_type: "Overflowing Dustbin",
    severity: "High",
    status: "Pending Review",
    description: "Blue recycling bin is overflowing with cardboard packaging and needs immediate municipal clearing."
  },
  {
    id: "ENV-0003",
    timestamp: "2026-10-15 14:05:22",
    location: "Hostel Block B Pathway",
    issue_type: "Drainage / Stagnant Water Issue",
    severity: "High",
    status: "Investigating",
    description: "Stagnant puddle formed due to clogged rainwater gutter; risk of mosquito breeding."
  },
  {
    id: "ENV-0004",
    timestamp: "2026-10-15 16:45:10",
    location: "Main Sports Complex Entrance",
    issue_type: "Improper Waste Segregation",
    severity: "Low",
    status: "Resolved",
    description: "Plastic beverage bottles deposited into the green wet-waste bin. Advised students and signage updated."
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

function saveReportToStorage(location, issueType, description, severity = "Medium") {
  const reports = getStoredReports();
  
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
    severity: severity,
    status: "Pending Review",
    description: description.trim() || "No description provided"
  };

  reports.unshift(newReport);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  return newReport;
}

function loadSampleDemoData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROTOTYPE_REPORTS));
}

function clearAllStoredReports() {
  localStorage.removeItem(STORAGE_KEY);
}

// -----------------------------------------------------------------------------
// CSV Exporter (RFC 4180 standard)
// -----------------------------------------------------------------------------
function exportReportsToCSV() {
  const reports = getStoredReports();
  if (reports.length === 0) {
    alert("No reports found to export. You can click 'Load Demo Data' to test the export!");
    return;
  }

  let csvContent = "Report ID,Timestamp,Location,Issue Type,Severity,Status,Description\r\n";
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
      escapeCsv(r.severity || "Medium"),
      escapeCsv(r.status || "Pending"),
      escapeCsv(r.description)
    ].join(",") + "\r\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "community_reports.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// -----------------------------------------------------------------------------
// Page Initializers
// -----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  initItemFinderWidget();
  initIndexPage();
  initTipsPage();
  initReportFormPage();
  initViewReportsPage();
});

// Interactive Waste Item Lookup Widget
function initItemFinderWidget() {
  const input = document.getElementById("itemFinderInput");
  const resultCard = document.getElementById("itemFinderResult");
  const quickTags = document.querySelectorAll(".quick-finder-tag");

  if (!input || !resultCard) return;

  function lookupItem(query) {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      resultCard.style.display = "none";
      return;
    }

    const match = WASTE_ITEMS_DATABASE.find(item => 
      item.item.toLowerCase().includes(q) || q.includes(item.item.toLowerCase())
    );

    if (match) {
      resultCard.style.display = "block";
      resultCard.innerHTML = `
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 p-3 rounded-3" style="background-color: #f8fafc; border: 1.5px solid #cbd5e1;">
          <div class="d-flex align-items-center gap-3">
            <span class="fs-2 text-${match.color}"><i class="bi bi-box-seam-fill"></i></span>
            <div>
              <h6 class="fw-bold mb-1 text-dark">${match.item}</h6>
              <span class="badge bg-${match.color} px-2.5 py-1.5 me-2">${match.category}</span>
              <span class="badge bg-light text-dark border"><i class="bi bi-trash3 me-1"></i>${match.bin}</span>
            </div>
          </div>
          <div class="text-secondary small max-w-md">
            <strong>Disposal Tip:</strong> ${match.tip}
          </div>
        </div>
      `;
    } else {
      resultCard.style.display = "block";
      resultCard.innerHTML = `
        <div class="p-3 text-center small text-muted bg-light rounded-3">
          <i class="bi bi-search me-1"></i> No exact match for <strong>"${query}"</strong>. Check the <a href="segregation.html" class="fw-bold text-success">5 Segregation Categories</a> for general guidance.
        </div>
      `;
    }
  }

  input.addEventListener("input", (e) => lookupItem(e.target.value));

  quickTags.forEach(tag => {
    tag.addEventListener("click", () => {
      input.value = tag.getAttribute("data-item");
      lookupItem(input.value);
    });
  });
}

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
      const latest = reports.slice(0, 4);
      latest.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td><span class="badge-id">${r.id}</span></td>
          <td class="small text-muted">${r.timestamp}</td>
          <td class="fw-semibold">${r.location}</td>
          <td><span class="badge bg-light text-dark border">${r.issue_type}</span></td>
          <td><span class="badge-status status-${(r.status || 'pending').toLowerCase().replace(' ', '')}">${r.status || 'Pending'}</span></td>
        `;
        recentTableBody.appendChild(tr);
      });
    }
  }
}

// Environmental Tips Page
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
  const quickPills = document.querySelectorAll(".quick-loc-pill");
  const issueCards = document.querySelectorAll(".issue-option-card");
  const severityInputs = document.querySelectorAll('input[name="severity"]');

  if (!form || !locationInput) return;

  // Quick Landmark Autocomplete Pills
  quickPills.forEach(pill => {
    pill.addEventListener("click", () => {
      locationInput.value = pill.getAttribute("data-loc");
      locationInput.classList.remove("is-invalid");
      locationInput.classList.add("is-valid");
    });
  });

  // Visual Issue Type Cards
  issueCards.forEach(card => {
    card.addEventListener("click", () => {
      issueCards.forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      const chosen = card.getAttribute("data-issue");
      if (issueSelect) issueSelect.value = chosen;
    });
  });

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
    
    let chosenSeverity = "Medium";
    severityInputs.forEach(radio => {
      if (radio.checked) chosenSeverity = radio.value;
    });

    if (locVal.length < 2) {
      locationInput.classList.add("is-invalid");
      locationInput.focus();
      return;
    }
    if (!issueVal) {
      alert("Please select an issue category.");
      return;
    }

    const saved = saveReportToStorage(locVal, issueVal, descVal, chosenSeverity);
    sessionStorage.setItem("last_submission_flash", JSON.stringify(saved));
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
  const statusFilter = document.getElementById("clientStatusFilter");
  const noMatchMsg = document.getElementById("noMatchRow");
  const flashContainer = document.getElementById("flashMessageContainer");
  const exportBtn = document.getElementById("exportCsvBtn");
  const loadDemoBtn = document.getElementById("loadDemoDataBtn");
  const clearDataBtn = document.getElementById("clearDataBtn");

  if (!tableBody && !cardsList) return;

  // Flash Message Handlers
  const flashData = sessionStorage.getItem("last_submission_flash");
  if (flashData && flashContainer) {
    try {
      const rep = JSON.parse(flashData);
      flashContainer.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show border-0 shadow-sm p-4 mb-4" role="alert" style="background-color: #d1fae5; border-left: 6px solid #10b981 !important;">
          <div class="d-flex align-items-start gap-3">
            <i class="bi bi-check-circle-fill fs-2 text-success mt-1"></i>
            <div class="flex-grow-1">
              <h5 class="alert-heading fw-bold text-success mb-1">Cleanliness Report Successfully Logged!</h5>
              <div class="mb-2">
                <span class="badge bg-success fs-6 me-2">ID: ${rep.id}</span>
                <span class="badge bg-light text-dark border me-2"><i class="bi bi-geo-alt me-1"></i>${rep.location}</span>
                <span class="badge bg-light text-dark border"><i class="bi bi-tag me-1"></i>${rep.issue_type}</span>
              </div>
              <p class="mb-0 text-muted">Your report has been safely indexed into the local prototype database. You can export the updated data anytime as <code>reports.csv</code>.</p>
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

  if (exportBtn) exportBtn.addEventListener("click", exportReportsToCSV);

  if (loadDemoBtn) {
    loadDemoBtn.addEventListener("click", () => {
      loadSampleDemoData();
      renderReports();
      alert("✅ Sample prototype reports loaded! You can now test search, filters, and CSV export.");
    });
  }

  if (clearDataBtn) {
    clearDataBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear all stored reports in this browser?")) {
        clearAllStoredReports();
        renderReports();
      }
    });
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
    const selectedStatus = statusFilter ? statusFilter.value.trim() : "";

    let matchCount = 0;
    if (tableBody) tableBody.innerHTML = "";
    if (cardsList) cardsList.innerHTML = "";

    reports.forEach(r => {
      const loc = (r.location || "").toLowerCase();
      const id = (r.id || "").toLowerCase();
      const desc = (r.description || "").toLowerCase();
      const itype = r.issue_type || "";
      const istatus = r.status || "Pending Review";

      const matchesQuery = query === "" || loc.includes(query) || id.includes(query) || desc.includes(query);
      const matchesType = selectedType === "" || itype === selectedType;
      const matchesStatus = selectedStatus === "" || istatus === selectedStatus;

      if (matchesQuery && matchesType && matchesStatus) {
        matchCount++;

        // Status badge class
        const statusClass = istatus.toLowerCase().replace(/[^a-z]/g, "");

        // Desktop Table Row
        if (tableBody) {
          const tr = document.createElement("tr");
          tr.className = "report-row";
          tr.innerHTML = `
            <td><span class="badge-id">${r.id}</span></td>
            <td class="small text-muted text-nowrap"><i class="bi bi-calendar3 me-1"></i>${r.timestamp}</td>
            <td class="fw-semibold text-dark"><i class="bi bi-geo-alt-fill text-danger me-1 small"></i>${r.location}</td>
            <td><span class="badge bg-light text-dark border"><i class="bi bi-tag me-1 text-primary"></i>${r.issue_type}</span></td>
            <td><span class="badge-status status-${statusClass.includes('resolved') ? 'resolved' : (statusClass.includes('investigating') ? 'investigating' : 'pending')}">${istatus}</span></td>
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
              <span class="badge-status status-${istatus.toLowerCase().includes('resolved') ? 'resolved' : (istatus.toLowerCase().includes('investigating') ? 'investigating' : 'pending')}">${istatus}</span>
            </div>
            <h5 class="fw-bold mb-1"><i class="bi bi-geo-alt text-danger me-1"></i>${r.location}</h5>
            <div class="d-flex gap-2 mb-2 small text-muted">
              <span><i class="bi bi-clock me-1"></i>${r.timestamp}</span>
              <span>•</span>
              <span class="badge bg-light text-dark border">${r.issue_type}</span>
            </div>
            <p class="small text-secondary mb-0 bg-light p-2.5 rounded">${r.description}</p>
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
  if (statusFilter) statusFilter.addEventListener("change", renderReports);
}
