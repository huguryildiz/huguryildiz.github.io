/* /assets/js/pub-chart.js
   - Builds TWO donuts side-by-side:
     (1) Publication Count (Journals / Conf Int / Conf Nat / Editorial)
     (2) Journal Quartiles (Q1..Q4 + Unknown) computed from journal list badges
   - Counts are derived from your publication lists (NOT from .pub-stats tiles).
*/
(function () {
  "use strict";

  var svgNS = "http://www.w3.org/2000/svg";

  // ---------- Geometry helpers ----------
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

  // ---------- DOM helpers ----------
  function textIncludes(label, needle) {
    return String(label || "").toLowerCase().indexOf(String(needle || "").toLowerCase()) !== -1;
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

  // Try to extract badge colors from shields images:
  // e.g. .../badge/...-Q1-gold?... => "gold"
  // If parsing fails, return null (we fall back to defaults).
  function parseShieldsColorFromImgSrc(src) {
    if (!src) return null;
    // shields pattern: /badge/<label>-<message>-<color>
    // message may contain '-' so we capture last '-' segment before '?' (or end)
    var m = String(src).match(/\/badge\/[^/]+-([^/?#]+)(?:\?|$)/i);
    if (!m) return null;
    // m[1] is "blue?style=..."? no, due to regex it stops at ?.
    // But could still contain extra '-' segments depending on label/message.
    // We want the LAST hyphen-separated token.
    var token = m[1];
    var parts = token.split("-");
    return parts[parts.length - 1] || null;
  }

  // Resolve a CSS variable to a computed value (e.g. var(--text-color) -> rgb(...))
  function cssVarValue(varName, fallback) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(varName);
      v = (v || "").trim();
      return v || fallback;
    } catch (e) {
      return fallback;
    }
  }

  // ---------- Donut renderer ----------
  function renderDonut(opts) {
    var containerId = opts.containerId;
    var titleText   = opts.titleText || "";
    var subtitleText= opts.subtitleText || "";
    var items       = opts.items || [];
    var colorMap    = opts.colorMap || {};
    var centerLabel = opts.centerLabel || "total";

    var chart = document.getElementById(containerId);
    if (!chart || !items.length) return;

    var total = 0;
    for (var i = 0; i < items.length; i++) total += (items[i].value || 0);
    if (total <= 0) return;

    chart.innerHTML = "";

    // Title
    var title = document.createElement("div");
    title.className = "pub-chart__title";
    title.textContent = titleText;
    chart.appendChild(title);

    // Layout container
    var wrap = document.createElement("div");
    wrap.className = "qdonut-wrap";
    chart.appendChild(wrap);

    // SVG canvas (use integral viewBox for crispness)
    var size = 260;
    var cx = size / 2;
    var cy = size / 2;
    var rOuter = 98;
    var rInner = 58;

    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + size + " " + size);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", String(size));
    svg.setAttribute("shape-rendering", "geometricPrecision");
    svg.setAttribute("text-rendering", "geometricPrecision");
    svg.setAttribute("style", "display:block;");
    svg.classList.add("qdonut-svg");
    wrap.appendChild(svg);

    // Slices
    var angle = 0;
    for (var k = 0; k < items.length; k++) {
      var frac = (items[k].value || 0) / total;
      var sweep = frac * 360;
      var start = angle;
      var end = angle + sweep;

      var path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", donutPath(cx, cy, rOuter, rInner, start, end));
      path.setAttribute("fill", colorMap[items[k].label] || "#1f77b4");
      path.setAttribute("opacity", "0.96");
      svg.appendChild(path);

      // Segment counts (skip tiny slices)
      if (sweep >= 18) {
        var mid = (start + end) / 2;
        var rText = (rOuter + rInner) / 2;
        var pt = polarToCartesian(cx, cy, rText, mid);

        var segText = document.createElementNS(svgNS, "text");
        segText.setAttribute("x", pt.x);
        segText.setAttribute("y", pt.y);
        segText.setAttribute("text-anchor", "middle");
        segText.setAttribute("dominant-baseline", "middle");
        segText.setAttribute("class", "qdonut-count");
        segText.textContent = String(items[k].value);
        svg.appendChild(segText);
      }

      angle = end;
    }

    // ---- Inner hole (theme-aware via CSS .qdonut-hole) ----
    // Put hole ABOVE slices, BELOW texts
    var hole = document.createElementNS(svgNS, "circle");
    hole.setAttribute("cx", cx);
    hole.setAttribute("cy", cy);
    hole.setAttribute("r", rInner - 1);
    hole.setAttribute("class", "qdonut-hole");
    svg.appendChild(hole);

    // Center total
    var centerTotal = document.createElementNS(svgNS, "text");
    centerTotal.setAttribute("x", cx);
    centerTotal.setAttribute("y", cy - 2);
    centerTotal.setAttribute("text-anchor", "middle");
    centerTotal.setAttribute("dominant-baseline", "middle");
    centerTotal.setAttribute("class", "qdonut-total");
    centerTotal.textContent = String(total);
    svg.appendChild(centerTotal);

    // Center subtitle
    var centerSub = document.createElementNS(svgNS, "text");
    centerSub.setAttribute("x", cx);
    centerSub.setAttribute("y", cy + 22);
    centerSub.setAttribute("text-anchor", "middle");
    centerSub.setAttribute("dominant-baseline", "middle");
    centerSub.setAttribute("class", "qdonut-sub");
    centerSub.textContent = subtitleText || centerLabel;
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

  // ---------- Build Publication Count from lists ----------
  function buildPublicationCountDonutFromLists() {
    // Your section ids:
    var ids = {
      journal:  "journal-papers",
      editorial:"editorials",
      confInt:  "conference-papers-international",
      confNat:  "conference-papers-national-turkish"
    };

    var journalLis  = collectLisUntilNextHeading(ids.journal);
    var editorialLis= collectLisUntilNextHeading(ids.editorial);
    var confIntLis  = collectLisUntilNextHeading(ids.confInt);
    var confNatLis  = collectLisUntilNextHeading(ids.confNat);

    var journal = journalLis.length;
    var editorial = editorialLis.length;
    var confInt = confIntLis.length;
    var confNat = confNatLis.length;

    // If all zero, nothing to render
    if (journal + editorial + confInt + confNat === 0) return;

    var items = [
      { label: "Journals",     value: journal },
      { label: "Conf. (Int.)", value: confInt },
      { label: "Conf. (Nat.)", value: confNat },
      { label: "Editorials",   value: editorial }
    ].filter(function (x) { return x.value > 0; });

    // Defaults (match your current palette)
    var colorMap = {
      "Journals": "#1f77b4",
      "Conf. (Int.)": "#ff7f0e",
      "Conf. (Nat.)": "#2ca02c",
      "Editorials": "#9467bd"
    };

    renderDonut({
      containerId: "pubCountDonut",
      titleText: "Publication Count",
      subtitleText: "total",
      items: items,
      colorMap: colorMap,
      centerLabel: "total"
    });
  }

  // ---------- Build Journal Quartiles donut from badges inside Journal list ----------
  function buildJournalQDonutFromBadges() {
    var journalHeadingId = "journal-papers";
    var lis = collectLisUntilNextHeading(journalHeadingId);
    if (!lis.length) return;

    var counts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Unknown: 0 };

    for (var i = 0; i < lis.length; i++) {
      // Your badge markdown creates: <img alt="Q1" ...>
      var qImgs = lis[i].querySelectorAll('img[alt^="Q"]');
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
      var key = order[k];
      if (counts[key] > 0) items.push({ label: key, value: counts[key] });
    }
    if (!items.length) return;

    // Try to match badge colors by parsing one example src (optional),
    // otherwise fall back to the palette you’ve been using.
    var fallback = { Q1: "#d4af37", Q2: "#2ca02c", Q3: "#ff7f0e", Q4: "#9467bd", Unknown: "#7f7f7f" };
    var colorMap = {
      Q1: fallback.Q1,
      Q2: fallback.Q2,
      Q3: fallback.Q3,
      Q4: fallback.Q4,
      Unknown: fallback.Unknown
    };

    // Optional: detect your Q badge colors from first occurrence
    // (If shields uses "gold"/"green"/"orange" this will still end up as CSS named colors)
    for (var j = 0; j < lis.length; j++) {
      var imgs = lis[j].querySelectorAll('img[alt^="Q"]');
      if (!imgs || !imgs.length) continue;

      var alt = (imgs[0].getAttribute("alt") || "").trim().toUpperCase();
      var src = imgs[0].getAttribute("src") || "";
      var c = parseShieldsColorFromImgSrc(src);
      if (alt && c && colorMap[alt]) {
        // Only override if parse seems meaningful
        colorMap[alt] = c;
      }
    }

    renderDonut({
      containerId: "journalQDonut",
      titleText: "Journal Quartiles (Q)",
      subtitleText: "journals",
      items: items,
      colorMap: colorMap,
      centerLabel: "journals"
    });
  }

  // ---------- Init ----------
  function init() {
    // Ensure the containers exist before rendering
    buildPublicationCountDonutFromLists();
    buildJournalQDonutFromBadges();

    // If your theme toggles dark/light by changing data-theme after load,
    // you can re-render to ensure hole/text stays consistent:
    // (Optional) watch attribute changes on <html>
    try {
      var html = document.documentElement;
      var obs = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          if (mutations[i].type === "attributes" && mutations[i].attributeName === "data-theme") {
            // re-render
            buildPublicationCountDonutFromLists();
            buildJournalQDonutFromBadges();
            break;
          }
        }
      });
      obs.observe(html, { attributes: true });
    } catch (e) {
      // ignore
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();