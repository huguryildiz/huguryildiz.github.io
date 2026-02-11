function renderDonut(containerId, titleText, subtitleText, items, colorMap, centerTotal) {
  var chart = document.getElementById(containerId);
  if (!chart) return;
  if (!items || !items.length) return;

  var total = 0;
  for (var i = 0; i < items.length; i++) total += items[i].value;
  if (total <= 0) return;

  chart.innerHTML = "";

  // --- Theme-typography helpers (INLINE = cannot be overridden by theme CSS)
  function applyThemeTextStyle(el, opts) {
    if (!el) return;
    el.style.fontFamily = "inherit";
    el.style.color = "inherit";
    if (opts && opts.size) el.style.fontSize = opts.size;
    if (opts && opts.weight) el.style.fontWeight = String(opts.weight);
    if (opts && opts.lineHeight) el.style.lineHeight = opts.lineHeight;
    if (opts && opts.opacity != null) el.style.opacity = String(opts.opacity);
  }

  function applyThemeSvgTextStyle(el, opts) {
    if (!el) return;
    // SVG uses attributes or style; style is fine here.
    el.style.fontFamily = "inherit";
    el.style.fill = (opts && opts.fill) ? opts.fill : "currentColor";
    if (opts && opts.size) el.style.fontSize = opts.size;
    if (opts && opts.weight) el.style.fontWeight = String(opts.weight);
    if (opts && opts.opacity != null) el.style.opacity = String(opts.opacity);
  }

  // Title
  var title = document.createElement("div");
  title.className = "pub-chart__title";
  title.textContent = titleText;
  applyThemeTextStyle(title, { size: "1rem", weight: 600, lineHeight: "1.2" });
  title.style.margin = "0 0 0.75rem 0";
  chart.appendChild(title);

  var wrap = document.createElement("div");
  wrap.className = "qdonut-wrap";
  chart.appendChild(wrap);

  // --- Size tuning (adjust here if charts feel too large)
  var size = 240, cx = size / 2, cy = size / 2;
  var rOuter = 92, rInner = 54;

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

    // Segment count text (skip tiny slices)
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

      // Softer, theme-like label
      applyThemeSvgTextStyle(text, { size: "14px", weight: 600, fill: "#ffffff", opacity: 0.95 });

      svg.appendChild(text);
    }

    angle = end;
  }

  /* Hole color should match card background via CSS (keep class) */
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

  // Less “heavy” than 800 bold
  applyThemeSvgTextStyle(centerText, { size: "34px", weight: 600, fill: "currentColor", opacity: 1 });

  svg.appendChild(centerText);

  // Center subtitle
  var centerSub = document.createElementNS(svgNS, "text");
  centerSub.setAttribute("x", cx);
  centerSub.setAttribute("y", cy + 20);
  centerSub.setAttribute("text-anchor", "middle");
  centerSub.setAttribute("dominant-baseline", "middle");
  centerSub.setAttribute("class", "qdonut-sub");
  centerSub.textContent = subtitleText || "";

  applyThemeSvgTextStyle(centerSub, { size: "14px", weight: 400, fill: "currentColor", opacity: 0.75 });

  svg.appendChild(centerSub);

  // Legend
  var legend = document.createElement("div");
  legend.className = "qdonut-legend";
  applyThemeTextStyle(legend, { size: "0.95rem", weight: 400, lineHeight: "1.4" });
  legend.style.marginTop = "0.75rem";
  wrap.appendChild(legend);

  for (var m = 0; m < items.length; m++) {
    var row = document.createElement("div");
    row.className = "qdonut-legend__row";
    row.style.display = "flex";
    row.style.alignItems = "center";
    row.style.gap = "10px";
    row.style.margin = "0.35rem 0";

    var sw = document.createElement("span");
    sw.className = "qdonut-legend__swatch";
    sw.style.background = colorMap[items[m].label] || "#1f77b4";
    sw.style.width = "10px";
    sw.style.height = "10px";
    sw.style.borderRadius = "3px";
    sw.style.flex = "0 0 auto";

    var txt = document.createElement("span");
    txt.textContent = items[m].label + " (" + items[m].value + ")";
    applyThemeTextStyle(txt, { size: "0.95rem", weight: 400, lineHeight: "1.35" });

    row.appendChild(sw);
    row.appendChild(txt);
    legend.appendChild(row);
  }

  chart.style.display = "";
}