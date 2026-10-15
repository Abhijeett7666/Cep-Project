/**
 * Community Cleanliness & Waste Awareness System - Client-Side Enhancements
 * Pure vanilla JavaScript with no third-party build requirements.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTipFilters();
  initTipOfTheDay();
  initReportSearchFilter();
  initFormValidation();
});

/**
 * Feature 2: Interactive Filtering of Environmental Tips
 */
function initTipFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const tipCards = document.querySelectorAll('.tip-item');
  const searchInput = document.getElementById('tipSearchInput');

  if (!filterPills.length || !tipCards.length) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    let visibleCount = 0;
    tipCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchesCat = activeCategory === 'all' || cardCategory === activeCategory;
      const matchesSearch = searchQuery === '' || cardText.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const emptyNotice = document.getElementById('tipsEmptyNotice');
    if (emptyNotice) {
      emptyNotice.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-filter');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyFilters();
    });
  }
}

/**
 * Feature 2: "Tip of the Day" interactive cycler
 */
function initTipOfTheDay() {
  const tipTextElem = document.getElementById('dailyTipText');
  const tipAreaElem = document.getElementById('dailyTipArea');
  const nextBtn = document.getElementById('nextTipBtn');
  const prevBtn = document.getElementById('prevTipBtn');

  if (!tipTextElem || !window.APP_TIPS_DATA || window.APP_TIPS_DATA.length === 0) return;

  const tips = window.APP_TIPS_DATA;
  let currentIndex = Math.floor(Math.random() * tips.length);

  function renderTip(index) {
    const tip = tips[index];
    tipTextElem.textContent = `"${tip.tip}"`;
    if (tipAreaElem) {
      tipAreaElem.textContent = `${tip.area} (${index + 1} of ${tips.length})`;
    }
  }

  renderTip(currentIndex);

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % tips.length;
      renderTip(currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + tips.length) % tips.length;
      renderTip(currentIndex);
    });
  }
}

/**
 * Feature 4: Client-side instant search & filter on Saved Reports Dashboard
 */
function initReportSearchFilter() {
  const searchInput = document.getElementById('clientSearchInput');
  const typeFilter = document.getElementById('clientTypeFilter');
  const tableRows = document.querySelectorAll('.report-row');
  const reportCards = document.querySelectorAll('.report-card-item');
  const countBadge = document.getElementById('visibleReportsCount');
  const noMatchMsg = document.getElementById('noMatchRow');

  if (!searchInput && !typeFilter) return;

  function filterReports() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedType = typeFilter ? typeFilter.value.trim() : '';
    let matchCount = 0;

    // Filter table rows (for desktop view)
    tableRows.forEach((row) => {
      const loc = (row.getAttribute('data-location') || '').toLowerCase();
      const id = (row.getAttribute('data-id') || '').toLowerCase();
      const desc = (row.getAttribute('data-description') || '').toLowerCase();
      const type = row.getAttribute('data-type') || '';

      const matchesQuery = query === '' || loc.includes(query) || id.includes(query) || desc.includes(query);
      const matchesType = selectedType === '' || type === selectedType;

      if (matchesQuery && matchesType) {
        row.style.display = '';
        matchCount++;
      } else {
        row.style.display = 'none';
      }
    });

    // Filter card items (for mobile view)
    reportCards.forEach((card) => {
      const loc = (card.getAttribute('data-location') || '').toLowerCase();
      const id = (card.getAttribute('data-id') || '').toLowerCase();
      const desc = (card.getAttribute('data-description') || '').toLowerCase();
      const type = card.getAttribute('data-type') || '';

      const matchesQuery = query === '' || loc.includes(query) || id.includes(query) || desc.includes(query);
      const matchesType = selectedType === '' || type === selectedType;

      card.style.display = (matchesQuery && matchesType) ? 'block' : 'none';
    });

    if (countBadge) {
      countBadge.textContent = matchCount;
    }

    if (noMatchMsg) {
      noMatchMsg.style.display = matchCount === 0 && (tableRows.length > 0 || reportCards.length > 0) ? 'block' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterReports);
  }
  if (typeFilter) {
    typeFilter.addEventListener('change', filterReports);
  }
}

/**
 * Feature 3: Real-time form feedback and validation
 */
function initFormValidation() {
  const form = document.getElementById('reportIssueForm');
  const locationInput = document.getElementById('location');
  const locationFeedback = document.getElementById('locationFeedback');

  if (!form || !locationInput) return;

  locationInput.addEventListener('input', () => {
    const val = locationInput.value.trim();
    if (val.length === 0) {
      locationInput.classList.add('is-invalid');
      locationInput.classList.remove('is-valid');
      if (locationFeedback) locationFeedback.textContent = 'Location cannot be empty.';
    } else if (val.length < 2) {
      locationInput.classList.add('is-invalid');
      locationInput.classList.remove('is-valid');
      if (locationFeedback) locationFeedback.textContent = 'Please enter at least 2 characters.';
    } else {
      locationInput.classList.remove('is-invalid');
      locationInput.classList.add('is-valid');
    }
  });

  form.addEventListener('submit', (e) => {
    const val = locationInput.value.trim();
    if (val.length < 2) {
      e.preventDefault();
      locationInput.classList.add('is-invalid');
      locationInput.focus();
    }
  });
}
