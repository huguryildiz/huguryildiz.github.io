(function () {
  function buildJournalQChart() {
    var chart = document.getElementById("journalQChart");
    if (!chart) return;

    // Journal section heading must exist
    var h = document.getElementById("journal-papers");
    if (!h) return;

    // Collect <li> items until next H2/H3
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
    if (!lis.length) return;

    // Count Q badges by reading image alt: Q1/Q2/Q3/...
    var counts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Unknown: 0 };

    for (var j = 0; j < lis.length; j++) {
      var qImgs = lis[j].querySelectorAll('img[alt^="Q"]'); // alt="Q1" etc.
      if (!qImgs || !qImgs.length) {
        counts.Unknown++;
        continue;
      }
      // If multiple, take first Q badge
      var q = (qImgs[0].getAttribute("alt") || "").trim().toUpperCase();
      if (counts.hasOwnProperty(q)) counts[q]++;
      else counts.Unknown++;
    }

    // Build items list (only show nonzero categories, but keep order)
    var order = ["Q1", "Q2", "Q3", "Q4", "Unknown"];
    var items = [];
    for (var k = 0; k < order.length; k++) {
      var key = order[k];
      if (counts[key] > 0) items.push({ label: key, value: counts[key] });
    }
    if (!items.length) return;

    // Compute max for scaling
    var maxVal = 1;
    for (var t = 0; t < items.length; t++) if (items[t].value > maxVal) maxVal = items[t].value;

    // Clear chart
    chart.innerHTML = "";

    // Title
    var title = document.createElement("div");
    title.className = "pub-chart__title";
    title.textContent = "Journal Quartiles (Q)";
    chart.appendChild(title);

    // Colors
    var colorMap = {
      Q1: "#d4af37",   // gold-ish
      Q2: "#2ca02c",   // green
      Q3: "#ff7f0e",   // orange
      Q4: "#9467bd",   // purple
      Unknown: "#7f7f7f"
    };

    // Rows
    for (var r = 0; r < items.length; r++) {
      var row = document.createElement("div");
      row.className = "pub-chart__row";

      var lab = document.createElement("div");
      lab.className = "pub-chart__label";
      lab.textContent = items[r].label;

      var bar = document.createElement("div");
      bar.className = "pub-chart__bar";

      var fill = document.createElement("div");
      fill.className = "pub-chart__fill";
      fill.style.background = colorMap[items[r].label] || "#1f77b4";

      var pct = (items[r].value / maxVal) * 100;
      fill.setAttribute("data-pct", pct.toFixed(2));
      bar.appendChild(fill);

      var val = document.createElement("div");
      val.className = "pub-chart__value";
      val.textContent = String(items[r].value);

      row.appendChild(lab);
      row.appendChild(bar);
      row.appendChild(val);
      chart.appendChild(row);
    }

    chart.style.display = "";

    requestAnimationFrame(function () {
      var fills = chart.querySelectorAll(".pub-chart__fill");
      for (var u = 0; u < fills.length; u++) {
        fills[u].style.width = (fills[u].getAttribute("data-pct") || "0") + "%";
      }
    });
  }

  // Hook into existing DOM ready flow
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildJournalQChart);
  } else {
    buildJournalQChart();
  }
})();