(function () {
  var svgNS = "http://www.w3.org/2000/svg";

  // ---------- DOM helpers ----------
  function byId(id) { return document.getElementById(id); }

  // Collect <li> from a section heading until the next H2/H3
  function collectLisUntilNextHeading(headingId) {
    var h = byId(headingId);
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

  // ---------- SVG geometry ----------
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

  // ---------- Donut renderer ----------
  function renderDonut(containerId, titleText, subtitleText, items, colorMap) {
    var chart = byId(containerId);
    if (!chart) return;
    if (!items || !items.length) return;

    var total = 0;
    for (var i = 0; i < items.length; i++) total += items[i].value;
    if (total <= 0) return;

    chart.innerHTML = "";

    // title
    var title = document.createElement("div");
    title.className = "pub-chart__title";
    title.textContent = titleText;
    chart.appendChild(title);

    var wrap = document.createElement("div");
    wrap.className = "qdonut-wrap";
    chart.appendChild(wrap);

    var size = 240, cx = size / 2, cy = size / 2;
    var rOuter = 92, rInner = 54;

    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "240");
    svg.classList.add("qdonut-svg");
    wrap.appendChild(svg);

    // segments
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

      // slice count label (skip too tiny slices)
      if (sweep >= 16) {
        var mid = (start + end) / 2;
        var rText = (rOuter + rInner) / 2;
        var pt = polarToCartesian(cx, cy, rText, mid);

        var t = document.createElementNS(svgNS, "text");
        t.setAttribute("x", pt.x);
        t.setAttribute("y", pt.y);
        t.setAttribute("text-anchor", "middle");
        t.setAttribute("dominant-baseline", "middle");
        t.setAttribute("class", "qdonut-count");
        t.textContent = String(items[k].value);
        svg.appendChild(t);
      }

      angle = end;
    }

    // IMPORTANT: draw a hole circle ON TOP to force theme background inside donut
    var hole = document.createElementNS(svgNS, "circle");
    hole.setAttribute("cx", cx);
    hole.setAttribute("cy", cy);
    hole.setAttribute("r", rInner - 0.5);
    hole.setAttribute("class", "qdonut-hole");
    svg.appendChild(hole);

    // center total
    var centerText = document.createElementNS(svgNS, "text");
    centerText.setAttribute("x", cx);
    centerText.setAttribute("y", cy - 2);
    centerText.setAttribute("text-anchor", "middle");
    centerText.setAttribute("dominant-baseline", "middle");
    centerText.setAttribute("class", "qdonut-total");
    centerText.textContent = String(total);
    svg.appendChild(centerText);

    var centerSub = document.createElementNS(svgNS, "text");
    centerSub.setAttribute("x", cx);
    centerSub.setAttribute("y", cy + 20);
    centerSub.setAttribute("text-anchor", "middle");
    centerSub.setAttribute("dominant-baseline", "middle");
    centerSub.setAttribute("class", "qdonut-sub");
    centerSub.textContent = subtitleText || "";
    svg.appendChild(centerSub);

    // legend
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

  // ---------- Build donuts from YOUR LISTS ----------
  function buildPublicationCountDonut() {
    var journalLis = collectLisUntilNextHeading("journal-papers");
    var editorialLis = collectLisUntilNextHeading("editorials");
    var confIntLis = collectLisUntilNextHeading("conference-papers-international");
    var confNatLis = collectLisUntilNextHeading("conference-papers-national-turkish");

    var items = [
      { label: "Journals", value: journalLis.length },
      { label: "Conf. (Int.)", value: confIntLis.length },
      { label: "Conf. (Nat.)", value: confNatLis.length },
      { label: "Editorials", value: editorialLis.length }
    ].filter(function (x) { return x.value > 0; });

    if (!items.length) return;

    var colorMap = {
      "Journals": "#1f77b4",
      "Conf. (Int.)": "#ff7f0e",
      "Conf. (Nat.)": "#2ca02c",
      "Editorials": "#9467bd"
    };

    renderDonut("pubCountDonut", "Publication Count", "total", items, colorMap);
  }

  function buildJournalQDonut() {
    var lis = collectLisUntilNextHeading("journal-papers");
    if (!lis.length) return;

    var counts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Unknown: 0 };

    for (var i = 0; i < lis.length; i++) {
      // Your badges are like: ![Q1](...Q1...)
      // That becomes <img alt="Q1" ...>
      var qImgs = lis[i].querySelectorAll('img[alt^="Q"]');
      if (!qImgs || !qImgs.length) { counts.Unknown++; continue; }

      var q = (qImgs[0].getAttribute("alt") || "").trim().toUpperCase();
      if (counts.hasOwnProperty(q)) counts[q]++; else counts.Unknown++;
    }

    var order = ["Q1", "Q2", "Q3", "Q4", "Unknown"];
    var items = [];
    for (var k = 0; k < order.length; k++) {
      var key = order[k];
      if (counts[key] > 0) items.push({ label: key, value: counts[key] });
    }
    if (!items.length) return;

    // badge-like colors
    var colorMap = {
      Q1: "#d4af37",   // gold
      Q2: "#2ca02c",   // green
      Q3: "#ff7f0e",   // orange
      Q4: "#9467bd",   // purple
      Unknown: "#7f7f7f"
    };

    renderDonut("journalQDonut", "Journal Quartiles (Q)", "journals", items, colorMap);
  }

  function init() {
    // Only run if containers exist
    if (byId("pubCountDonut")) buildPublicationCountDonut();
    if (byId("journalQDonut")) buildJournalQDonut();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();