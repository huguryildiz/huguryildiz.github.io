(function () {
  const svgNS = "http://www.w3.org/2000/svg";

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

  // Collect <li> items after a heading id until next H2/H3
  function collectLisUntilNextHeading(headingId) {
    const h = document.getElementById(headingId);
    if (!h) return [];
    const lis = [];
    let el = h.nextElementSibling;

    while (el && !["H2", "H3"].includes(el.tagName)) {
      el.querySelectorAll?.("li")?.forEach(li => lis.push(li));
      el = el.nextElementSibling;
    }
    return lis;
  }

  function renderDonut(containerId, titleText, subtitleText, items, colorMap) {
    const chart = document.getElementById(containerId);
    if (!chart || !items || !items.length) return;

    const total = items.reduce((s, x) => s + (x.value || 0), 0);
    if (total <= 0) return;

    // ✅ REAL theme colors from computed styles (no CSS-var guesswork)
    const cs = getComputedStyle(chart);
    const cardBg = cs.backgroundColor || "#fff";
    const textColor = cs.color || "#222";

    // Stroke color depends on theme brightness (simple heuristic)
    const strokeColor = (function () {
      // parse rgb(a)
      const m = cardBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (!m) return "rgba(0,0,0,.35)";
      const r = +m[1], g = +m[2], b = +m[3];
      const luminance = (0.2126*r + 0.7152*g + 0.0722*b);
      return luminance < 90 ? "rgba(255,255,255,.35)" : "rgba(0,0,0,.35)";
    })();

    chart.innerHTML = "";

    const title = document.createElement("div");
    title.className = "pub-chart__title";
    title.textContent = titleText;
    chart.appendChild(title);

    const wrap = document.createElement("div");
    wrap.className = "qdonut-wrap";
    chart.appendChild(wrap);

    const size = 240, cx = size / 2, cy = size / 2, rOuter = 92, rInner = 54;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "240");
    svg.classList.add("qdonut-svg");
    wrap.appendChild(svg);

    // segments
    let angle = 0;
    items.forEach((it) => {
      const frac = it.value / total;
      const sweep = frac * 360;
      const start = angle;
      const end = angle + sweep;

      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", donutPath(cx, cy, rOuter, rInner, start, end));
      path.setAttribute("fill", colorMap[it.label] || "#1f77b4");
      path.setAttribute("opacity", "0.95");
      svg.appendChild(path);

      // segment value text (skip tiny slices)
      if (sweep >= 18) {
        const mid = (start + end) / 2;
        const rText = (rOuter + rInner) / 2;
        const pt = polarToCartesian(cx, cy, rText, mid);

        const t = document.createElementNS(svgNS, "text");
        t.setAttribute("x", pt.x.toFixed(2));
        t.setAttribute("y", pt.y.toFixed(2));
        t.setAttribute("text-anchor", "middle");
        t.setAttribute("dominant-baseline", "middle");
        t.setAttribute("class", "qdonut-count");
        t.setAttribute("fill", textColor);
        t.style.stroke = strokeColor;
        t.textContent = String(it.value);
        svg.appendChild(t);
      }

      angle = end;
    });

    // ✅ hole LAST so it covers the middle cleanly (no “black disk”)
    const hole = document.createElementNS(svgNS, "circle");
    hole.setAttribute("cx", cx);
    hole.setAttribute("cy", cy);
    hole.setAttribute("r", rInner - 2);
    hole.setAttribute("fill", cardBg);
    svg.appendChild(hole);

    // center total
    const totalText = document.createElementNS(svgNS, "text");
    totalText.setAttribute("x", cx);
    totalText.setAttribute("y", cy - 2);
    totalText.setAttribute("text-anchor", "middle");
    totalText.setAttribute("dominant-baseline", "middle");
    totalText.setAttribute("class", "qdonut-total");
    totalText.setAttribute("fill", textColor);
    totalText.style.stroke = strokeColor;
    totalText.textContent = String(total);
    totalText.style.fontSize = "34px";
    totalText.style.fontWeight = "800";
    svg.appendChild(totalText);

    const subText = document.createElementNS(svgNS, "text");
    subText.setAttribute("x", cx);
    subText.setAttribute("y", cy + 20);
    subText.setAttribute("text-anchor", "middle");
    subText.setAttribute("dominant-baseline", "middle");
    subText.setAttribute("class", "qdonut-sub");
    subText.setAttribute("fill", textColor);
    subText.style.stroke = "transparent"; // ✅ keep crisp
    subText.textContent = subtitleText || "";
    subText.style.fontSize = "15px";
    subText.style.fontWeight = "650";
    svg.appendChild(subText);

    // legend
    const legend = document.createElement("div");
    legend.className = "qdonut-legend";
    wrap.appendChild(legend);

    items.forEach((it) => {
      const row = document.createElement("div");
      row.className = "qdonut-legend__row";

      const sw = document.createElement("span");
      sw.className = "qdonut-legend__swatch";
      sw.style.background = colorMap[it.label] || "#1f77b4";

      const txt = document.createElement("span");
      txt.textContent = `${it.label} (${it.value})`;

      row.appendChild(sw);
      row.appendChild(txt);
      legend.appendChild(row);
    });

    chart.style.display = "";
  }

  // ---- Data builders (AUTO from lists) ----

  function buildPublicationCountDonut() {
    // count list items from your sections
    const journals = collectLisUntilNextHeading("journal-papers").length;
    const editorials = collectLisUntilNextHeading("editorials").length;
    const confInt = collectLisUntilNextHeading("conference-papers-international").length;
    const confNat = collectLisUntilNextHeading("conference-papers-national-turkish").length;

    const items = [
      { label: "Journals", value: journals },
      { label: "Conf. (Int.)", value: confInt },
      { label: "Conf. (Nat.)", value: confNat },
      { label: "Editorials", value: editorials },
    ].filter(x => x.value > 0);

    const colorMap = {
      "Journals": "#1f77b4",
      "Conf. (Int.)": "#ff7f0e",
      "Conf. (Nat.)": "#2ca02c",
      "Editorials": "#9467bd"
    };

    renderDonut("pubCountDonut", "Publication Count", "total", items, colorMap);
  }

  function buildJournalQDonut() {
    const lis = collectLisUntilNextHeading("journal-papers");
    if (!lis.length) return;

    const counts = { Q1: 0, Q2: 0, Q3: 0, Q4: 0, Unknown: 0 };

    lis.forEach(li => {
      // Your badges are like: ![Q1](...)
      const qImg = li.querySelector('img[alt^="Q"]');
      if (!qImg) { counts.Unknown++; return; }
      const q = (qImg.getAttribute("alt") || "").trim().toUpperCase();
      if (counts[q] != null) counts[q]++; else counts.Unknown++;
    });

    const order = ["Q1", "Q2", "Q3", "Q4", "Unknown"];
    const items = order
      .filter(k => counts[k] > 0)
      .map(k => ({ label: k, value: counts[k] }));

    // badge-like colors
    const colorMap = {
      Q1: "#d4af37",
      Q2: "#2ca02c",
      Q3: "#ff7f0e",
      Q4: "#9467bd",
      Unknown: "#7f7f7f"
    };

    renderDonut("journalQDonut", "Journal Quartiles (Q)", "journals", items, colorMap);
  }

  function init() {
    buildPublicationCountDonut();
    buildJournalQDonut();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();