(function () {
  const svgNS = "http://www.w3.org/2000/svg";

  // ---------- Helpers ----------
  function isDarkMode() {
    const root = document.documentElement;
    const body = document.body;

    // Common patterns across themes
    const attr = (root.getAttribute("data-theme") || "").toLowerCase();
    const cls  = (root.className + " " + (body ? body.className : "")).toLowerCase();

    if (attr.includes("dark")) return true;
    if (cls.includes("dark") || cls.includes("theme-dark")) return true;

    // Fallback: OS preference
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function getCardColors() {
    // Try to use theme CSS vars if they exist; otherwise set sensible defaults.
    const cs = getComputedStyle(document.documentElement);

    const varText = (cs.getPropertyValue("--text-color") || "").trim();
    const varBg   = (cs.getPropertyValue("--background-color") || "").trim();
    const varBdr  = (cs.getPropertyValue("--border-color") || "").trim();

    const dark = isDarkMode();

    // If theme vars are missing / not changing, fall back to robust values
    const text = varText || (dark ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.86)");
    const bg   = varBg   || (dark ? "rgb(48,48,48)" : "rgb(255,255,255)");
    const bdr  = varBdr  || (dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)");

    // Card background should be slightly “card-like” vs page bg
    // If theme bg is the page bg, we nudge it a little:
    const cardBg = dark ? "rgba(32,32,32,0.92)" : "rgba(255,255,255,0.98)";
    const cardBorder = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.10)";

    return { dark, text, pageBg: bg, border: bdr, cardBg, cardBorder };
  }

  function polarToCartesian(cx, cy, r, angleDeg) {
    const a = (angleDeg - 90) * Math.PI / 180.0;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function donutPath(cx, cy, rOuter, rInner, startAngle, endAngle) {
    const p1 = polarToCartesian(cx, cy, rOuter, endAngle);
    const p2 = polarToCartesian(cx, cy, rOuter, startAngle);
    const p3 = polarToCartesian(cx, cy, rInner, startAngle);
    const p4 = polarToCartesian(cx, cy, rInner, endAngle);
    const largeArc = (endAngle - startAngle) <= 180 ? "0" : "1";

    return [
      "M", p2.x, p2.y,
      "A", rOuter, rOuter, 0, largeArc, 1, p1.x, p1.y,
      "L", p4.x, p4.y,
      "A", rInner, rInner, 0, largeArc, 0, p3.x, p3.y,
      "Z"
    ].join(" ");
  }

  // Collect <li> items under a heading until next H2/H3 starts
  function collectLisUntilNextHeading(headingId) {
    const h = document.getElementById(headingId);
    if (!h) return [];

    const lis = [];
    let el = h.nextElementSibling;

    while (el) {
      if (el.tagName === "H2" || el.tagName === "H3") break;
      const found = el.querySelectorAll ? el.querySelectorAll("li") : [];
      for (let i = 0; i < found.length; i++) lis.push(found[i]);
      el = el.nextElementSibling;
    }
    return lis;
  }

  // ---------- Donut renderer ----------
  function renderDonut(containerId, titleText, subtitleText, items, colorMap, centerLabel) {
    const chart = document.getElementById(containerId);
    if (!chart || !items || !items.length) return;

    const { dark, text, cardBg } = getCardColors();

    // Apply theme-aware card styling via inline vars (reliable across themes)
    chart.style.setProperty("--pub-card-bg", cardBg);
    chart.style.setProperty("--pub-text", text);
    chart.style.setProperty("--pub-dark", dark ? "1" : "0");

    let total = 0;
    for (let i = 0; i < items.length; i++) total += items[i].value;
    if (total <= 0) return;

    chart.innerHTML = "";

    const title = document.createElement("div");
    title.className = "pub-chart__title";
    title.textContent = titleText;
    chart.appendChild(title);

    const wrap = document.createElement("div");
    wrap.className = "qdonut-wrap";
    chart.appendChild(wrap);

    const size = 240, cx = size / 2, cy = size / 2;
    const rOuter = 92, rInner = 54;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "240");
    svg.classList.add("qdonut-svg");
    wrap.appendChild(svg);

    // Draw segments
    let angle = 0;
    for (let k = 0; k < items.length; k++) {
      const frac = items[k].value / total;
      const sweep = frac * 360;
      const start = angle;
      const end = angle + sweep;

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", donutPath(cx, cy, rOuter, rInner, start, end));
      path.setAttribute("fill", colorMap[items[k].label] || "#1f77b4");
      path.setAttribute("opacity", "0.95");
      svg.appendChild(path);

      // Count label on slice (skip tiny slices)
      if (sweep >= 18) {
        const mid = (start + end) / 2;
        const rText = (rOuter + rInner) / 2;
        const pt = polarToCartesian(cx, cy, rText, mid);

        const t = document.createElementNS(svgNS, "text");
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

    // Inner hole circle (MUST match card bg)
    const hole = document.createElementNS(svgNS, "circle");
    hole.setAttribute("cx", cx);
    hole.setAttribute("cy", cy);
    hole.setAttribute("r", rInner - 1);
    hole.setAttribute("class", "qdonut-hole");
    svg.appendChild(hole);

    // Center text
    const centerTotal = document.createElementNS(svgNS, "text");
    centerTotal.setAttribute("x", cx);
    centerTotal.setAttribute("y", cy - 4);
    centerTotal.setAttribute("text-anchor", "middle");
    centerTotal.setAttribute("dominant-baseline", "middle");
    centerTotal.setAttribute("class", "qdonut-total");
    centerTotal.textContent = String(total);
    svg.appendChild(centerTotal);

    const centerSub = document.createElementNS(svgNS, "text");
    centerSub.setAttribute("x", cx);
    centerSub.setAttribute("y", cy + 18);
    centerSub.setAttribute("text-anchor", "middle");
    centerSub.setAttribute("dominant-baseline", "middle");
    centerSub.setAttribute("class", "qdonut-sub");
    centerSub.textContent = centerLabel || subtitleText || "";
    svg.appendChild(centerSub);

    // Legend
    const legend = document.createElement("div");
    legend.className = "qdonut-legend";
    wrap.appendChild(legend);

    for (let m = 0; m < items.length; m++) {
      const row = document.createElement("div");
      row.className = "qdonut-legend__row";

      const sw = document.createElement("span");
      sw.className = "qdonut-legend__swatch";
      sw.style.background = colorMap[items[m].label] || "#1f77b4";

      const txt = document.createElement("span");
      txt.textContent = `${items[m].label} (${items[m].value})`;

      row.appendChild(sw);
      row.appendChild(txt);
      legend.appendChild(row);
    }

    // Set hole fill to the computed card background (most reliable)
    const computedCardBg = getComputedStyle(chart).backgroundColor || cardBg;
    hole.setAttribute("fill", computedCardBg);

    chart.style.display = "";
  }

  // ---------- Build donuts from your publication lists ----------
  function buildPublicationCountDonutFromLists() {
    const journalLis  = collectLisUntilNextHeading("journal-papers");
    const editorialLis = collectLisUntilNextHeading("editorials");
    const confIntLis  = collectLisUntilNextHeading("conference-papers-international");
    const confNatLis  = collectLisUntilNextHeading("conference-papers-national-turkish");

    const journal = journalLis.length;
    const confInt = confIntLis.length;
    const confNat = confNatLis.length;
    const editorial = editorialLis.length;

    const items = [
      { label: "Journals", value: journal },
      { label: "Conf. (Int.)", value: confInt },
      { label: "Conf. (Nat.)", value: confNat },
      { label: "Editorials", value: editorial }
    ].filter(x => x.value > 0);

    const colorMap = {
      "Journals": "#1f77b4",     // blue (matches your badge theme)
      "Conf. (Int.)": "#ff7f0e", // orange
      "Conf. (Nat.)": "#2ca02c", // green
      "Editorials": "#9467bd"    // purple
    };

    renderDonut("pubCountDonut", "Publication Count", "total", items, colorMap, "total");
  }

  function buildJournalQDonutFromList() {
    const journalLis = collectLisUntilNextHeading("journal-papers");
    if (!journalLis.length) return;

    const counts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Unknown: 0 };

    for (let i = 0; i < journalLis.length; i++) {
      // Your Q badge is like: ![Q1](...Q1...)
      const qImgs = journalLis[i].querySelectorAll('img[alt^="Q"]');
      if (!qImgs || !qImgs.length) {
        counts.Unknown++;
        continue;
      }
      const q = (qImgs[0].getAttribute("alt") || "").trim().toUpperCase();
      if (counts.hasOwnProperty(q)) counts[q]++;
      else counts.Unknown++;
    }

    const order = ["Q1", "Q2", "Q3", "Q4", "Unknown"];
    const items = [];
    for (let k = 0; k < order.length; k++) {
      const key = order[k];
      if (counts[key] > 0) items.push({ label: key, value: counts[key] });
    }
    if (!items.length) return;

    // Badge-consistent colors
    const colorMap = {
      Q1: "#d4af37",    // gold
      Q2: "#2ca02c",    // green
      Q3: "#ff7f0e",    // orange
      Q4: "#9467bd",    // purple
      Unknown: "#7f7f7f"
    };

    renderDonut("journalQDonut", "Journal Quartiles (Q)", "journals", items, colorMap, "journals");
  }

  function init() {
    buildPublicationCountDonutFromLists();
    buildJournalQDonutFromList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();