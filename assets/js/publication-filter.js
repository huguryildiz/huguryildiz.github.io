/**
 * pub-chart.js
 * Renders two donut charts:
 *   1. #pubCountDonut  – Publication Count by type
 *   2. #journalQDonut  – Journal Quartile (Q) distribution
 *
 * Requires: No external dependencies (pure SVG + CSS approach)
 * Usage: Drop into /assets/js/pub-chart.js and reference in the page front-matter.
 */

(function () {
  "use strict";

  /* ─── Colour palette ─────────────────────────────────────────── */
  const COLORS = {
    blue   : "#4e8fc7",   // Journal Articles / Q1
    orange : "#f28c28",   // Conf. Papers (Int.) / Q2
    green  : "#5aaa6e",   // Conf. Papers (Nat.) / Q3
    purple : "#9b59b6",   // Editorial
    gold   : "#c9a227",   // (Q1 alt if needed)
  };

  /* ─── Chart definitions ──────────────────────────────────────── */
  const CHARTS = [
    {
      id     : "pubCountDonut",
      title  : "Publication Count",
      center : { value: null /* computed */, label: "total" },
      slices : [
        { label: "Journal Articles",       value: 24, color: COLORS.blue   },
        { label: "Conf. Papers (Intl.)",   value: 13, color: COLORS.orange },
        { label: "Conf. Papers (Nat.)",    value:  5, color: COLORS.green  },
        { label: "Editorial",              value:  1, color: COLORS.purple },
      ],
    },
    {
      id     : "journalQDonut",
      title  : "Journal Quartiles (Q)",
      center : { value: null /* computed */, label: "journals" },
      slices : [
        { label: "Q1", value: 20, color: COLORS.gold   },
        { label: "Q2", value:  3, color: COLORS.orange },
        { label: "Q3", value:  1, color: COLORS.green  },
      ],
    },
  ];

  /* ─── SVG donut helpers ──────────────────────────────────────── */
  const NS = "http://www.w3.org/2000/svg";

  function polarToCart(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(cx, cy, r, startDeg, endDeg) {
    // Clamp to avoid degenerate full-circle arcs
    if (Math.abs(endDeg - startDeg) >= 360) endDeg = startDeg + 359.9999;
    const s = polarToCart(cx, cy, r, startDeg);
    const e = polarToCart(cx, cy, r, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  function createSVGEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  /* ─── Build one chart ────────────────────────────────────────── */
  function buildChart(cfg) {
    const container = document.getElementById(cfg.id);
    if (!container) return;

    const total = cfg.slices.reduce((s, d) => s + d.value, 0);
    const centerVal = cfg.center.value !== null ? cfg.center.value : total;

    /* Wrapper */
    container.innerHTML = "";
    container.style.display = "";
    container.classList.add("pub-donut-card");

    /* Title */
    const titleEl = document.createElement("h3");
    titleEl.className = "pub-donut-title";
    titleEl.textContent = cfg.title;
    container.appendChild(titleEl);

    /* Inner layout: SVG + Legend side by side */
    const inner = document.createElement("div");
    inner.className = "pub-donut-inner";
    container.appendChild(inner);

    /* ── SVG ── */
    const SIZE = 180, CX = 90, CY = 90, R_OUTER = 75, R_INNER = 45;
    const svg = createSVGEl("svg", {
      viewBox : `0 0 ${SIZE} ${SIZE}`,
      width   : SIZE,
      height  : SIZE,
      class   : "pub-donut-svg",
    });

    let startDeg = 0;
    cfg.slices.forEach((slice) => {
      const sweep  = (slice.value / total) * 360;
      const endDeg = startDeg + sweep;

      const path = createSVGEl("path", {
        d               : describeArc(CX, CY, R_OUTER, startDeg, endDeg),
        stroke          : slice.color,
        "stroke-width"  : R_OUTER - R_INNER,
        fill            : "none",
        "stroke-linecap": "butt",
        class           : "pub-donut-slice",
      });

      /* Midpoint label */
      const midDeg = startDeg + sweep / 2;
      const labelR = (R_OUTER + R_INNER) / 2;
      const lp     = polarToCart(CX, CY, labelR, midDeg);

      if (slice.value / total > 0.06) {   // only if slice is large enough
        const lbl = createSVGEl("text", {
          x              : lp.x,
          y              : lp.y,
          "text-anchor"  : "middle",
          "dominant-baseline": "central",
          fill           : "#fff",
          "font-size"    : "12",
          "font-weight"  : "700",
          class          : "pub-donut-slice-label",
        });
        lbl.textContent = slice.value;
        svg.appendChild(lbl);
      }

      svg.appendChild(path);
      startDeg = endDeg;
    });

    /* Re-append labels on top of paths */
    startDeg = 0;
    cfg.slices.forEach((slice) => {
      const sweep  = (slice.value / total) * 360;
      const endDeg = startDeg + sweep;
      const midDeg = startDeg + sweep / 2;
      const labelR = (R_OUTER + R_INNER) / 2;
      const lp     = polarToCart(CX, CY, labelR, midDeg);

      if (slice.value / total > 0.06) {
        const lbl = createSVGEl("text", {
          x                   : lp.x,
          y                   : lp.y,
          "text-anchor"       : "middle",
          "dominant-baseline" : "central",
          fill                : "#fff",
          "font-size"         : "12",
          "font-weight"       : "700",
        });
        lbl.textContent = slice.value;
        svg.appendChild(lbl);
      }
      startDeg = endDeg;
    });

    /* Centre text */
    const cNum = createSVGEl("text", {
      x                   : CX,
      y                   : CY - 8,
      "text-anchor"       : "middle",
      "dominant-baseline" : "central",
      "font-size"         : "22",
      "font-weight"       : "800",
      fill                : "#222",
      class               : "pub-donut-center-num",
    });
    cNum.textContent = centerVal;
    svg.appendChild(cNum);

    const cLbl = createSVGEl("text", {
      x                   : CX,
      y                   : CY + 14,
      "text-anchor"       : "middle",
      "dominant-baseline" : "central",
      "font-size"         : "11",
      fill                : "#666",
    });
    cLbl.textContent = cfg.center.label;
    svg.appendChild(cLbl);

    inner.appendChild(svg);

    /* ── Legend ── */
    const legend = document.createElement("ul");
    legend.className = "pub-donut-legend";

    cfg.slices.forEach((slice) => {
      const li = document.createElement("li");
      li.className = "pub-donut-legend-item";

      const swatch = document.createElement("span");
      swatch.className = "pub-donut-legend-swatch";
      swatch.style.background = slice.color;

      const labelSpan = document.createElement("span");
      labelSpan.className = "pub-donut-legend-label";
      labelSpan.textContent = slice.label;

      const countSpan = document.createElement("span");
      countSpan.className = "pub-donut-legend-count";
      countSpan.textContent = slice.value;

      li.appendChild(swatch);
      li.appendChild(labelSpan);
      li.appendChild(countSpan);
      legend.appendChild(li);
    });

    inner.appendChild(legend);
  }

  /* ─── CSS injection ──────────────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById("pub-chart-styles")) return;
    const style = document.createElement("style");
    style.id = "pub-chart-styles";
    style.textContent = `
/* ── Container: two columns ──────────────────────────── */
.pub-donuts-2col {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin: 1rem 0 1.5rem;
}

/* ── Card ─────────────────────────────────────────────── */
.pub-donut-card {
  flex: 1 1 320px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 1.1rem 1.25rem 1.25rem;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}

/* ── Title ────────────────────────────────────────────── */
.pub-donut-title {
  margin: 0 0 .85rem;
  font-size: .95rem;
  font-weight: 700;
  color: #222;
  border: none;
  padding: 0;
}

/* ── SVG + Legend row ─────────────────────────────────── */
.pub-donut-inner {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.pub-donut-svg {
  flex-shrink: 0;
}

/* ── Legend list ──────────────────────────────────────── */
.pub-donut-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: .45rem;
}

.pub-donut-legend-item {
  display: flex;
  align-items: center;
  gap: .5rem;
  font-size: .8rem;
  color: #444;
}

.pub-donut-legend-swatch {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 3px;
  flex-shrink: 0;
}

.pub-donut-legend-label {
  flex: 1;
  line-height: 1.25;
}

.pub-donut-legend-count {
  font-weight: 700;
  color: #222;
  min-width: 1.5rem;
  text-align: right;
}

/* ── Responsive ───────────────────────────────────────── */
@media (max-width: 600px) {
  .pub-donut-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
    `;
    document.head.appendChild(style);
  }

  /* ─── Entry point ────────────────────────────────────────────── */
  function init() {
    injectStyles();
    CHARTS.forEach(buildChart);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();