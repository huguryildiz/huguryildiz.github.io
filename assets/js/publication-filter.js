/*!
 * publications-filter.js
 * Filters publication list items by Type + Year on /publications/
 * - Adds data-type and data-year to <li> items
 * - Populates Year dropdown
 * - Shows/hides sections based on visible items
 */

(function () {
  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    // Section anchors (IDs on headings)
    var headings = {
      journal: document.getElementById("journal-papers"),
      editorial: document.getElementById("editorials"),
      "conf-int": document.getElementById("conference-papers-international"),
      "conf-nat": document.getElementById("conference-papers-national-turkish"),
    };

    // Filter controls
    var typeSelect = document.getElementById("pubType");
    var yearSelect = document.getElementById("pubYear");
    var applyBtn = document.getElementById("pubApply");
    var resetBtn = document.getElementById("pubReset");
    var countDiv = document.getElementById("pubCount");

    // If this page doesn't have the filter UI, do nothing
    if (!typeSelect || !yearSelect) return;

    // Collect all publication list items
    var allItems = [];

    for (var type in headings) {
      var heading = headings[type];
      if (!heading) continue;

      // Find the first UL/OL after the heading
      var el = heading.nextElementSibling;
      while (el && el.tagName !== "UL" && el.tagName !== "OL") {
        el = el.nextElementSibling;
      }
      if (!el) continue;

      var items = el.getElementsByTagName("li");
      for (var i = 0; i < items.length; i++) {
        var li = items[i];
        li.setAttribute("data-type", type);

        // Extract year: first "(YYYY)" occurrence
        var match = li.textContent.match(/\((\d{4})\)/);
        if (match) li.setAttribute("data-year", match[1]);

        allItems.push(li);
      }
    }

    // Build Year dropdown
    var years = {};
    for (var i = 0; i < allItems.length; i++) {
      var y = allItems[i].getAttribute("data-year");
      if (y) years[y] = true;
    }

    var yearList = Object.keys(years).sort(function (a, b) {
      return Number(b) - Number(a);
    });

    // Avoid duplicates if the script is loaded twice
    // Keep the first "All" option and remove anything else
    while (yearSelect.options.length > 1) yearSelect.remove(1);

    for (var i = 0; i < yearList.length; i++) {
      var opt = document.createElement("option");
      opt.value = yearList[i];
      opt.textContent = yearList[i];
      yearSelect.appendChild(opt);
    }

    function applyFilter() {
      var selectedType = typeSelect.value;
      var selectedYear = yearSelect.value;

      var visibleCount = 0;
      var counts = { journal: 0, editorial: 0, "conf-int": 0, "conf-nat": 0 };

      for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        var itemType = item.getAttribute("data-type");
        var itemYear = item.getAttribute("data-year");

        var typeMatch = selectedType === "all" || itemType === selectedType;
        var yearMatch = selectedYear === "all" || itemYear === selectedYear;

        var show = typeMatch && yearMatch;
        item.style.display = show ? "" : "none";

        if (show) {
          visibleCount++;
          counts[itemType]++;
        }
      }

      // Show/hide section headings
      for (var type in headings) {
        if (!headings[type]) continue;
        headings[type].style.display = counts[type] > 0 ? "" : "none";
      }

      // Count message
      if (countDiv) {
        var total = allItems.length;
        countDiv.textContent =
          visibleCount === total
            ? "Showing all " + total + " publications"
            : "Showing " + visibleCount + " of " + total + " publications";
      }
    }

    // Events
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

    // Initial run
    applyFilter();
  }
})();