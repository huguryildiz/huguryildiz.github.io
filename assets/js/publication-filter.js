/* ===========================================================
   publications-filter.js
   - Default: show "Showing TOTAL publications"
   - Then enable Type/Year filtering
   - Debug-friendly + fallback selectors
   =========================================================== */

window.__PUB_FILTER_LOADED__ = true;

(function () {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function collectLisUntilNextHeading(headingId) {
    var h = document.getElementById(headingId);
    if (!h) return [];

    var lis = [];
    var el = h.nextElementSibling;

    while (el) {
      if (el.tagName === "H2" || el.tagName === "H3") break;
      if (el.querySelectorAll) {
        var found = el.querySelectorAll("li");
        for (var i = 0; i < found.length; i++) lis.push(found[i]);
      }
      el = el.nextElementSibling;
    }
    return lis;
  }

  function init() {
    var typeSelect = document.getElementById("pubType");
    var yearSelect = document.getElementById("pubYear");
    var applyBtn = document.getElementById("pubApply");
    var resetBtn = document.getElementById("pubReset");
    var countDiv = document.getElementById("pubCount");

    // If the filter UI block isn't on the page, do nothing.
    if (!typeSelect || !yearSelect || !countDiv) return;

    // --- Collect items from your four sections (preferred) ---
    var headings = {
      journal: document.getElementById("journal-papers"),
      editorial: document.getElementById("editorials"),
      "conf-int": document.getElementById("conference-papers-international"),
      "conf-nat": document.getElementById("conference-papers-national-turkish"),
    };

    var allItems = [];

    Object.keys(headings).forEach(function (type) {
      var h = headings[type];
      if (!h) return;
      var lis = collectLisUntilNextHeading(h.id);

      for (var i = 0; i < lis.length; i++) {
        var li = lis[i];
        li.setAttribute("data-type", type);

        var match = li.textContent.match(/\((\d{4})\)/);
        if (match) li.setAttribute("data-year", match[1]);

        allItems.push(li);
      }
    });

    // --- Fallback: if headings not found, just count all publication list items ---
    if (allItems.length === 0) {
      // Try a broad-but-safe fallback: list items after "## Publications" area
      // If your page has other lists, this might overcount, but it's better than showing nothing.
      allItems = Array.prototype.slice.call(document.querySelectorAll(".page__content li"));
    }

    var TOTAL = allItems.length;

    // Always show the default text immediately (this is what you want back)
    countDiv.textContent = "Showing " + TOTAL + " publications";

    // Populate years (only if we extracted any)
    var years = {};
    allItems.forEach(function (li) {
      var m = li.textContent.match(/\((\d{4})\)/);
      if (m) years[m[1]] = true;
    });

    var yearList = Object.keys(years).sort(function (a, b) { return b - a; });

    // Clear and repopulate year dropdown
    yearSelect.innerHTML = '<option value="all">All</option>';
    yearList.forEach(function (y) {
      var opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    });

    function applyFilter() {
      var selectedType = typeSelect.value;
      var selectedYear = yearSelect.value;

      var visible = 0;
      var sectionCounts = { journal: 0, editorial: 0, "conf-int": 0, "conf-nat": 0 };

      allItems.forEach(function (li) {
        var itemType = li.getAttribute("data-type");
        var itemYear = li.getAttribute("data-year") || (li.textContent.match(/\((\d{4})\)/) || [])[1];

        var typeMatch = (selectedType === "all" || itemType === selectedType);
        var yearMatch = (selectedYear === "all" || itemYear === selectedYear);
        var show = typeMatch && yearMatch;

        li.style.display = show ? "" : "none";

        if (show) {
          visible++;
          if (sectionCounts[itemType] != null) sectionCounts[itemType]++;
        }
      });

      // Show/hide headings only if we have the real headings
      Object.keys(headings).forEach(function (type) {
        if (!headings[type]) return;
        headings[type].style.display = (selectedType !== "all" && selectedType !== type)
          ? "none"
          : (sectionCounts[type] > 0 ? "" : "none");
      });

      countDiv.textContent = "Showing " + visible + " of " + TOTAL + " publications";
    }

    // Default state: All / All
    typeSelect.value = "all";
    yearSelect.value = "all";

    typeSelect.addEventListener("change", applyFilter);
    yearSelect.addEventListener("change", applyFilter);
    if (applyBtn) applyBtn.addEventListener("click", applyFilter);

    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        typeSelect.value = "all";
        yearSelect.value = "all";
        applyFilter();
      });
    }

    // Initial run (enables filtering)
    applyFilter();
  }
})();