// Publication filter script: collects list items from section headings, 
// populates a year dropdown, and filters items by type and year on demand.

(function () {
  // Run init after DOM is ready, or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    var allItems = [];

    // Map publication types to their section heading elements
    var headings = {
      'journal':   document.getElementById('journal-papers'),
      'editorial': document.getElementById('editorials'),
      'conf-int':  document.getElementById('conference-papers-international'),
      'conf-nat':  document.getElementById('conference-papers-national-turkish')
    };

    // Loop through each section and collect all list items
    for (var type in headings) {
      var heading = headings[type];
      if (!heading) continue;

      // Find the first UL or OL element after the section heading
      var el = heading.nextElementSibling;
      while (el && el.tagName !== 'UL' && el.tagName !== 'OL') {
        el = el.nextElementSibling;
      }

      if (el) {
        var items = el.getElementsByTagName('li');
        for (var i = 0; i < items.length; i++) {
          // Tag each item with its publication type
          items[i].setAttribute('data-type', type);

          // Extract 4-digit year from text, e.g. "(2023)"
          var match = items[i].textContent.match(/\((\d{4})\)/);
          if (match) {
            items[i].setAttribute('data-year', match[1]);
          }

          allItems.push(items[i]);
        }
      }
    }

    // Get filter UI elements
    var typeSelect = document.getElementById('pubType');
    var yearSelect = document.getElementById('pubYear');
    var applyBtn   = document.getElementById('pubApply');
    var resetBtn   = document.getElementById('pubReset');
    var countDiv   = document.getElementById('pubCount');

    // Exit if required filter elements are missing
    if (!typeSelect || !yearSelect) return;

    // Collect unique years from all items
    var years = {};
    for (var i = 0; i < allItems.length; i++) {
      var y = allItems[i].getAttribute('data-year');
      if (y) years[y] = true;
    }

    // Sort years descending (newest first) and populate the year dropdown
    var yearList = Object.keys(years).sort(function (a, b) {
      return b - a;
    });

    for (var i = 0; i < yearList.length; i++) {
      var opt = document.createElement('option');
      opt.value = yearList[i];
      opt.textContent = yearList[i];
      yearSelect.appendChild(opt);
    }

    // Filter and show/hide items based on selected type and year
    function applyFilter() {
      var selectedType = typeSelect.value;
      var selectedYear = yearSelect.value;
      var visibleCount = 0;

      // Track visible count per section to toggle headings
      var counts = {
        journal: 0,
        editorial: 0,
        'conf-int': 0,
        'conf-nat': 0
      };

      for (var i = 0; i < allItems.length; i++) {
        var item     = allItems[i];
        var itemType = item.getAttribute('data-type');
        var itemYear = item.getAttribute('data-year');

        // Check if item matches selected filters ('all' means no filter)
        var typeMatch = (selectedType === 'all' || itemType === selectedType);
        var yearMatch = (selectedYear === 'all' || itemYear === selectedYear);
        var show = typeMatch && yearMatch;

        // Show or hide the item
        item.style.display = show ? '' : 'none';

        if (show) {
          visibleCount++;
          counts[itemType]++;
        }
      }

      // Hide section headings that have no visible items
      for (var type in headings) {
        if (headings[type]) {
          headings[type].style.display = (counts[type] > 0) ? '' : 'none';
        }
      }

      // Update the publication count message
      if (countDiv) {
        var msg = visibleCount === allItems.length
          ? 'Showing all ' + allItems.length + ' publications'
          : 'Showing ' + visibleCount + ' of ' + allItems.length + ' publications';
        countDiv.textContent = msg;
      }
    }

    // Attach event listeners to filter controls
    if (typeSelect) typeSelect.addEventListener('change', applyFilter);
    if (yearSelect) yearSelect.addEventListener('change', applyFilter);
    if (applyBtn)   applyBtn.addEventListener('click', applyFilter);

    // Reset all filters and show everything
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        typeSelect.value = 'all';
        yearSelect.value = 'all';
        applyFilter();
      });
    }

    // Apply filters on initial load
    applyFilter();
  }

})();