(function () {
  var svgNS = "http://www.w3.org/2000/svg";

  function polarToCartesian(cx, cy, r, angleDeg) {
    var a = (angleDeg - 90) * Math.PI / 180.0;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function donutPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
    var p1 = polarToCartesian(cx, cy, rOuter, endAngle);
    var p2 = polarToCartesian(cx, cy, rOuter, startAngle);
    var p3 = polarToCartesian(cx, cy, rInner, startAngle);
    var p4 = polarToCartesian(cx, cy, rInner, endAngle);
    var largeArc = (endAngle - startAngle) <= 180 ? "0" : "1";

    return [
      "M", p2.x, p2.y,
      "A", rOuter, rOuter, 0, largeArc, 1, p1.x, p1.y,
      "L", p4.x, p4.y,
      "A", rInner, rInner, 0, largeArc, 0, p3.x, p3.y,
      "Z"
    ].join(" ");
  }

  // Collect <li> items from heading until next H2/H3
  function collectLisUntilNextHeading(headingEl) {
    if (!headingEl) return [];
    var lis = [];
    var el = headingEl.nextElementSibling;

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

  // If duplicate IDs exist, pick the one that actually has <li> after it
  function findHeadingWithLis(id) {
    var nodes = document.querySelectorAll("#" + CSS.escape(id));
    if (!nodes || !nodes.length) return null;

    var best = null;
    var bestCount = -1;

    for (var i = 0; i < nodes.length; i++) {
      var lis = collectLisUntilNextHeading(nodes[i]);
      if (lis.length > bestCount) {
        bestCount = lis.length;
        best = nodes[i];
      }
    }
    return bestCount > 0 ? best : nodes[0];
  }

  function renderDonut(containerId, titleText, subtitleText, items, colorMap) {
    var chart = document.getElementById(containerId);
    if (!chart) return;
    if (!items || !items.length) return;

    var total = 0;
    for (var i = 0; i < items.length; i++) total += items[i].value;
    if (total <= 0) return;

    chart.innerHTML = "";

    var title = document.createElement("div");
    title.className = "pub-chart__title";
    title.textContent = titleText;
    chart.appendChild(title);

    var wrap = document.createElement("div");
    wrap.className = "qdonut-wrap";
    chart.appendChild(wrap);

    var size = 240, cx = size / 2, cy = size / 2, rOuter = 92, rInner = 54;

    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "240");
    svg.classList.add("qdonut-svg");
    wrap.appendChild(svg);

    var angle = 0;
    for (var k = 0; k < items.length; k++) {
      var frac = items[k].value / total;
      var sweep = frac * 360;
      var start = angle;
      var end = angle + sweep;

      var path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", donutPath(cx, cy, rOuter, rInner, start, end));
      path.setAttribute("fill", colorMap[items[k].label] || "#1f77b4");
      path.setAttribute("opacity", "0.95");
      svg.appendChild(path);

      // segment count (skip tiny slices)
      if (sweep >= 18) {
        var mid = (start + end) / 2;
        var rText = (rOuter + rInner) / 2;
        var pt = polarToCartesian(cx, cy, rText, mid);

        var text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", pt.x);
        text.setAttribute("y", pt.y);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("class", "qdonut-count");
        text.textContent = String(items[k].value);
        svg.appendChild(text);
      }

      angle = end;
    }

    // Center total
    var centerText = document.createElementNS(svgNS, "text");
    centerText.setAttribute("x", cx);
    centerText.setAttribute("y", cy);
    centerText.setAttribute("text-anchor", "middle");
    centerText.setAttribute("dominant-baseline", "middle");
    centerText.setAttribute("class", "qdonut-total");
    centerText.textContent = String(total);
    svg.appendChild(centerText);

    var centerSub = document.createElementNS(svgNS, "text");
    centerSub.setAttribute("x", cx);
    centerSub.setAttribute("y", cy + 18);
    centerSub.setAttribute("text-anchor", "middle");
    centerSub.setAttribute("dominant-baseline", "middle");
    centerSub.setAttribute("class", "qdonut-sub");
    centerSub.textContent = subtitleText || "";
    svg.appendChild(centerSub);

    // Legend
    var legend = document.createElement("div");
    legend.className = "qdonut-legend";
    wrap.appendChild(legend);

    for (var m = 0; m < items.length; m++) {
      var row = document.createElement("div");
      row.className = "qdonut-legend__row";

      var sw = document.createElement("span");
      sw.className = "qdonut-legend__swatch";
      sw.style.background = colorMap[items[m].label] || "#1f77b4";

      var txt = document.createElement("span");
      txt.textContent = items[m].label + " (" + items[m].value + ")";

      row.appendChild(sw);
      row.appendChild(txt);
      legend.appendChild(row);
    }

    chart.style.display = "";
  }

  function buildPublicationCountDonutFromLists() {
    var hJ = findHeadingWithLis("journal-papers");
    var hE = findHeadingWithLis("editorials");
    var hCI = findHeadingWithLis("conference-papers-international");
    var hCN = findHeadingWithLis("conference-papers-national-turkish");

    var journalLis = collectLisUntilNextHeading(hJ);
    var editorialLis = collectLisUntilNextHeading(hE);
    var confIntLis = collectLisUntilNextHeading(hCI);
    var confNatLis = collectLisUntilNextHeading(hCN);

    var journal = journalLis.length;
    var editorial = editorialLis.length;
    var confInt = confIntLis.length;
    var confNat = confNatLis.length;

    var items = [
      { label: "Journals", value: journal },
      { label: "Conf. (Int.)", value: confInt },
      { label: "Conf. (Nat.)", value: confNat },
      { label: "Editorials", value: editorial }
    ].filter(function (x) { return x.value > 0; });

    var colorMap = {
      "Journals": "#1f77b4",
      "Conf. (Int.)": "#ff7f0e",
      "Conf. (Nat.)": "#2ca02c",
      "Editorials": "#9467bd"
    };

    renderDonut("pubCountDonut", "Publication Count", "total", items, colorMap);
  }

  function buildJournalQDonut() {
    var h = findHeadingWithLis("journal-papers");
    var lis = collectLisUntilNextHeading(h);
    if (!lis.length) return;

    var counts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Unknown: 0 };

    for (var i = 0; i < lis.length; i++) {
      // Your Q badge images: alt="Q1" etc.
      var qImgs = lis[i].querySelectorAll('img[alt^="Q"]');
      if (!qImgs || !qImgs.length) { counts.Unknown++; continue; }

      var q = (qImgs[0].getAttribute("alt") || "").trim().toUpperCase();
      if (counts.hasOwnProperty(q)) counts[q]++;
      else counts.Unknown++;
    }

    var order = ["Q1", "Q2", "Q3", "Q4", "Unknown"];
    var items = [];
    for (var k = 0; k < order.length; k++) {
      var key = order[k];
      if (counts[key] > 0) items.push({ label: key, value: counts[key] });
    }
    if (!items.length) return;

    var colorMap = {
      Q1: "#d4af37",
      Q2: "#2ca02c",
      Q3: "#ff7f0e",
      Q4: "#9467bd",
      Unknown: "#7f7f7f"
    };

    renderDonut("journalQDonut", "Journal Quartiles (Q)", "journals", items, colorMap);
  }

  function init() {
    buildPublicationCountDonutFromLists();
    buildJournalQDonut();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();