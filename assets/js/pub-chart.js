/**
 * ==============================================================
 * Publications Donut Charts (Pure SVG Implementation)
 * ==============================================================
 *
 * This script dynamically generates two donut charts for the
 * Publications page:
 *
 * 1) Publication Type Distribution
 *    - Journal Articles
 *    - Intl. Conference Papers
 *    - Nat. Conference Papers
 *    - Editorials
 *
 * 2) Journal Quartile (Q1–Q4) Distribution
 *
 * The charts are:
 * - Fully auto-generated from the publication lists
 * - Based on section heading IDs
 * - Rendered using native SVG (no external libraries)
 *
 * This ensures:
 * - Automatic synchronization with page content
 * - Lightweight implementation
 * - Full theme compatibility
 *
 * ==============================================================
 */

(function () {

  // SVG namespace required when creating SVG elements dynamically
  var svgNS = "http://www.w3.org/2000/svg";

  /**
   * Convert polar coordinates (angle, radius) into Cartesian (x,y).
   * Used for positioning arc endpoints and text labels.
   *
   * @param {number} cx - center x
   * @param {number} cy - center y
   * @param {number} r  - radius
   * @param {number} angleDeg - angle in degrees
   * @returns {object} {x, y}
   */
  function polarToCartesian(cx, cy, r, angleDeg) {
    var a = (angleDeg - 90) * Math.PI / 180.0;
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a)
    };
  }

  /**
   * Generate SVG path string for a donut slice.
   * Uses outer arc + inner arc to create ring segment.
   *
   * @param {number} cx
   * @param {number} cy
   * @param {number} rOuter
   * @param {number} rInner
   * @param {number} startAngle
   * @param {number} endAngle
   * @returns {string} SVG path string
   */
  function donutPath(cx, cy, rOuter, rInner, startAngle, endAngle) {

    var p1 = polarToCartesian(cx, cy, rOuter, endAngle);
    var p2 = polarToCartesian(cx, cy, rOuter, startAngle);
    var p3 = polarToCartesian(cx, cy, rInner, startAngle);
    var p4 = polarToCartesian(cx, cy, rInner, endAngle);

    // Determines if arc > 180° (SVG arc flag requirement)
    var largeArc = (endAngle - startAngle) <= 180 ? "0" : "1";

    return [
      "M", p2.x, p2.y,
      "A", rOuter, rOuter, 0, largeArc, 1, p1.x, p1.y,
      "L", p4.x, p4.y,
      "A", rInner, rInner, 0, largeArc, 0, p3.x, p3.y,
      "Z"
    ].join(" ");
  }

  /**
   * Collect all <li> elements that belong to a section.
   * Stops when next heading (H2/H3) is encountered.
   *
   * @param {string} headingId
   * @returns {Array} list items
   */
  function collectLisUntilNextHeading(headingId) {

    var h = document.getElementById(headingId);
    if (!h) return [];

    var lis = [];
    var el = h.nextElementSibling;

    while (el) {
      if (el.tagName === "H2" || el.tagName === "H3") break;

      if (el.querySelectorAll) {
        var found = el.querySelectorAll("li");
        for (var i = 0; i < found.length; i++) {
          lis.push(found[i]);
        }
      }

      el = el.nextElementSibling;
    }

    return lis;
  }

  /**
   * Core rendering engine for donut charts.
   *
   * @param {string} containerId
   * @param {string} titleText
   * @param {string} subtitleText
   * @param {Array} items [{label,value}]
   * @param {object} colorMap
   * @param {number} centerTotal
   */
  function renderDonut(containerId, titleText, subtitleText, items, colorMap, centerTotal) {

    var chart = document.getElementById(containerId);
    if (!chart || !items || !items.length) return;

    // Compute total value
    var total = 0;
    for (var i = 0; i < items.length; i++) {
      total += items[i].value;
    }
    if (total <= 0) return;

    chart.innerHTML = "";

    // Title
    var title = document.createElement("div");
    title.className = "pub-chart__title";
    title.textContent = titleText;
    chart.appendChild(title);

    // Wrapper
    var wrap = document.createElement("div");
    wrap.className = "qdonut-wrap";
    chart.appendChild(wrap);

    // SVG setup
    var size = 240;
    var cx = size / 2;
    var cy = size / 2;
    var rOuter = 92;
    var rInner = 54;

    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "240");
    svg.classList.add("qdonut-svg");
    wrap.appendChild(svg);

    // Build slices
    var angle = 0;

    for (var k = 0; k < items.length; k++) {

      var fraction = items[k].value / total;
      var sweep = fraction * 360;

      var start = angle;
      var end = angle + sweep;

      var path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", donutPath(cx, cy, rOuter, rInner, start, end));
      path.setAttribute("fill", colorMap[items[k].label] || "#1f77b4");
      path.setAttribute("opacity", "0.95");
      svg.appendChild(path);

      // Place slice value text (if large enough)
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

    // Create donut hole
    var hole = document.createElementNS(svgNS, "circle");
    hole.setAttribute("cx", cx);
    hole.setAttribute("cy", cy);
    hole.setAttribute("r", rInner - 1);
    hole.setAttribute("class", "qdonut-hole");
    svg.appendChild(hole);

    // Center total
    var centerText = document.createElementNS(svgNS, "text");
    centerText.setAttribute("x", cx);
    centerText.setAttribute("y", cy);
    centerText.setAttribute("text-anchor", "middle");
    centerText.setAttribute("dominant-baseline", "middle");
    centerText.setAttribute("class", "qdonut-total");
    centerText.textContent = String(centerTotal != null ? centerTotal : total);
    svg.appendChild(centerText);

    // Center subtitle
    var centerSub = document.createElementNS(svgNS, "text");
    centerSub.setAttribute("x", cx);
    centerSub.setAttribute("y", cy + 18);
    centerSub.setAttribute("text-anchor", "middle");
    centerSub.setAttribute("dominant-baseline", "middle");
    centerSub.setAttribute("class", "qdonut-sub");
    centerSub.textContent = subtitleText || "";
    svg.appendChild(centerSub);

    chart.style.display = "";
  }

  /**
   * Build publication-type distribution donut
   */
  function buildPublicationCountDonutFromLists() {

    var journal = collectLisUntilNextHeading("journal-papers").length;
    var editorial = collectLisUntilNextHeading("editorials").length;
    var confInt = collectLisUntilNextHeading("conference-papers-international").length;
    var confNat = collectLisUntilNextHeading("conference-papers-national-turkish").length;

    var items = [
      { label: "Journal Articles", value: journal },
      { label: "Conf. Papers (Intl.)", value: confInt },
      { label: "Conf. Papers (Nat.)", value: confNat },
      { label: "Editorial", value: editorial }
    ].filter(function (x) { return x.value > 0; });

    var colorMap = {
      "Journal Articles": "#1f77b4",
      "Conf. Papers (Intl.)": "#ff7f0e",
      "Conf. Papers (Nat.)": "#2ca02c",
      "Editorial": "#9467bd"
    };

    renderDonut("pubCountDonut",
      "Publication Count",
      "total",
      items,
      colorMap,
      journal + confInt + confNat + editorial);
  }

  /**
   * Build journal quartile distribution donut
   */
  function buildJournalQDonutFromJournalList() {

    var lis = collectLisUntilNextHeading("journal-papers");
    if (!lis.length) return;

    var counts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Unknown: 0 };

    for (var j = 0; j < lis.length; j++) {

      var qImgs = lis[j].querySelectorAll('img[alt^="Q"]');
      if (!qImgs || !qImgs.length) {
        counts.Unknown++;
        continue;
      }

      var q = (qImgs[0].getAttribute("alt") || "").trim().toUpperCase();
      if (counts.hasOwnProperty(q)) counts[q]++;
      else counts.Unknown++;
    }

    var order = ["Q1", "Q2", "Q3", "Q4", "Unknown"];
    var items = [];

    for (var k = 0; k < order.length; k++) {
      if (counts[order[k]] > 0) {
        items.push({ label: order[k], value: counts[order[k]] });
      }
    }

    var colorMap = {
      Q1: "#d4af37",
      Q2: "#2ca02c",
      Q3: "#ff7f0e",
      Q4: "#9467bd",
      Unknown: "#7f7f7f"
    };

    renderDonut("journalQDonut",
      "Journal Quartiles (Q)",
      "journals",
      items,
      colorMap,
      lis.length);
  }

  /**
   * Initialization entry point
   */
  function init() {
    buildPublicationCountDonutFromLists();
    buildJournalQDonutFromJournalList();
  }

  // Ensure DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();