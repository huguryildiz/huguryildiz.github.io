/* =========================================================
   pub-chart.js (Filter logic + Apply dirty state)
   - change events stay (instant filter)
   - Apply becomes active only if selection changed
   - Reset keeps same behavior
   ========================================================= */

(function(){
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initFilter);
  } else {
    initFilter();
  }

  function initFilter(){
    var typeSelect = document.getElementById('pubType');
    var yearSelect = document.getElementById('pubYear');
    var applyBtn   = document.getElementById('pubApply');
    var resetBtn   = document.getElementById('pubReset');
    var countDiv   = document.getElementById('pubCount');

    if(!typeSelect || !yearSelect) return;

    // Headings by type (IDs must exist)
    var headings = {
      'journal': document.getElementById('journal-papers'),
      'editorial': document.getElementById('editorials'),
      'conf-int': document.getElementById('conference-papers-international'),
      'conf-nat': document.getElementById('conference-papers-national-turkish')
    };

    // Collect all <li> items under each section list
    var allItems = [];
    for(var type in headings){
      var heading = headings[type];
      if(!heading) continue;

      var el = heading.nextElementSibling;
      while(el && el.tagName !== 'UL' && el.tagName !== 'OL'){
        el = el.nextElementSibling;
      }
      if(!el) continue;

      var items = el.getElementsByTagName('li');
      for(var i=0;i<items.length;i++){
        items[i].setAttribute('data-type', type);

        // Year parse: first "(YYYY)" occurrence
        var match = items[i].textContent.match(/\((\d{4})\)/);
        if(match) items[i].setAttribute('data-year', match[1]);

        allItems.push(items[i]);
      }
    }

    // Populate year dropdown
    var years = {};
    for(var i=0;i<allItems.length;i++){
      var y = allItems[i].getAttribute('data-year');
      if(y) years[y] = true;
    }
    var yearList = Object.keys(years).sort(function(a,b){ return b - a; });
    for(var i=0;i<yearList.length;i++){
      var opt = document.createElement('option');
      opt.value = yearList[i];
      opt.textContent = yearList[i];
      yearSelect.appendChild(opt);
    }

    // Apply "dirty" state
    var lastApplied = { type: typeSelect.value, year: yearSelect.value };

    function setApplyDirty(isDirty){
      if(!applyBtn) return;
      applyBtn.disabled = !isDirty;
      applyBtn.classList.toggle('is-disabled', !isDirty);
    }

    function updateDirtyState(){
      var dirty = (typeSelect.value !== lastApplied.type) || (yearSelect.value !== lastApplied.year);
      setApplyDirty(dirty);
    }

    function applyFilter(){
      var selectedType = typeSelect.value;
      var selectedYear = yearSelect.value;

      var visibleCount = 0;
      var counts = { 'journal':0, 'editorial':0, 'conf-int':0, 'conf-nat':0 };

      for(var i=0;i<allItems.length;i++){
        var item = allItems[i];
        var itemType = item.getAttribute('data-type');
        var itemYear = item.getAttribute('data-year');

        var typeMatch = (selectedType === 'all' || itemType === selectedType);
        var yearMatch = (selectedYear === 'all' || itemYear === selectedYear);
        var show = typeMatch && yearMatch;

        item.style.display = show ? '' : 'none';

        if(show){
          visibleCount++;
          counts[itemType] = (counts[itemType] || 0) + 1;
        }
      }

      // Hide empty headings
      for(var type in headings){
        if(headings[type]){
          headings[type].style.display = (counts[type] > 0) ? '' : 'none';
        }
      }

      // Counter text
      if(countDiv){
        var msg = (visibleCount === allItems.length)
          ? ('Showing all ' + allItems.length + ' publications')
          : ('Showing ' + visibleCount + ' of ' + allItems.length + ' publications');
        countDiv.textContent = msg;
      }
    }

    // Initial run
    applyFilter();
    setApplyDirty(false);

    // Change events stay: apply immediately + mark dirty
    function onSelectionChanged(){
      applyFilter();
      updateDirtyState();
    }
    typeSelect.addEventListener('change', onSelectionChanged);
    yearSelect.addEventListener('change', onSelectionChanged);

    // Apply click: confirm -> not dirty
    if(applyBtn){
      applyBtn.addEventListener('click', function(){
        lastApplied.type = typeSelect.value;
        lastApplied.year = yearSelect.value;
        setApplyDirty(false);
      });
    }

    // Reset: set all + apply + not dirty
    if(resetBtn){
      resetBtn.addEventListener('click', function(){
        typeSelect.value = 'all';
        yearSelect.value = 'all';
        applyFilter();

        lastApplied.type = 'all';
        lastApplied.year = 'all';
        setApplyDirty(false);
      });
    }
  }
})();