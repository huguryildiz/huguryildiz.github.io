(function() {
  // Wait for page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('Publication filter initializing...');
    
    // Find all list items in publication sections
    var allItems = [];
    var headings = {
      'journal': document.getElementById('journal-papers'),
      'editorial': document.getElementById('editorials'),
      'conf-int': document.getElementById('conference-papers-international'),
      'conf-nat': document.getElementById('conference-papers-national-turkish')
    };

    console.log('Headings found:', headings);

    // Process each section
    for (var type in headings) {
      var heading = headings[type];
      if (!heading) {
        console.log('Heading not found for:', type);
        continue;
      }
      
      // Find the list after the heading
      var el = heading.nextElementSibling;
      while (el && el.tagName !== 'UL' && el.tagName !== 'OL') {
        el = el.nextElementSibling;
      }
      
      if (el) {
        var items = el.getElementsByTagName('li');
        console.log('Found', items.length, 'items for', type);
        for (var i = 0; i < items.length; i++) {
          items[i].setAttribute('data-type', type);
          // Extract year
          var match = items[i].textContent.match(/\((\d{4})\)/);
          if (match) {
            items[i].setAttribute('data-year', match[1]);
          }
          allItems.push(items[i]);
        }
      }
    }

    console.log('Total items found:', allItems.length);

    // Get UI elements
    var typeSelect = document.getElementById('pubType');
    var yearSelect = document.getElementById('pubYear');
    var applyBtn = document.getElementById('pubApply');
    var resetBtn = document.getElementById('pubReset');
    var countDiv = document.getElementById('pubCount');

    if (!typeSelect || !yearSelect) {
      console.error('Filter controls not found!');
      return;
    }

    // Populate year dropdown
    var years = {};
    for (var i = 0; i < allItems.length; i++) {
      var y = allItems[i].getAttribute('data-year');
      if (y) years[y] = true;
    }
    var yearList = Object.keys(years).sort(function(a, b) { return b - a; });
    
    console.log('Years found:', yearList);
    
    for (var i = 0; i < yearList.length; i++) {
      var opt = document.createElement('option');
      opt.value = yearList[i];
      opt.textContent = yearList[i];
      yearSelect.appendChild(opt);
    }

    // Filter function
    function applyFilter() {
      var selectedType = typeSelect.value;
      var selectedYear = yearSelect.value;
      var visibleCount = 0;
      var counts = { journal: 0, editorial: 0, 'conf-int': 0, 'conf-nat': 0 };

      console.log('Filtering - Type:', selectedType, 'Year:', selectedYear);

      // Filter items
      for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        var itemType = item.getAttribute('data-type');
        var itemYear = item.getAttribute('data-year');
        
        var typeMatch = (selectedType === 'all' || itemType === selectedType);
        var yearMatch = (selectedYear === 'all' || itemYear === selectedYear);
        var show = typeMatch && yearMatch;
        
        item.style.display = show ? '' : 'none';
        
        if (show) {
          visibleCount++;
          counts[itemType]++;
        }
      }

      // Show/hide headings
      for (var type in headings) {
        if (headings[type]) {
          headings[type].style.display = (counts[type] > 0) ? '' : 'none';
        }
      }

      // Update count message
      if (countDiv) {
        var msg = visibleCount === allItems.length
          ? 'Showing all ' + allItems.length + ' publications'
          : 'Showing ' + visibleCount + ' of ' + allItems.length + ' publications';
        countDiv.textContent = msg;
      }

      console.log('Visible:', visibleCount, 'Section counts:', counts);
    }

    // Attach events
    if (typeSelect) typeSelect.addEventListener('change', applyFilter);
    if (yearSelect) yearSelect.addEventListener('change', applyFilter);
    if (applyBtn) applyBtn.addEventListener('click', applyFilter);
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        typeSelect.value = 'all';
        yearSelect.value = 'all';
        applyFilter();
      });
    }

    // Initial run
    console.log('Running initial filter...');
    applyFilter();
  }
})();