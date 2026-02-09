(function () {
  function buildChart() {
    var stats = document.querySelectorAll(".pub-stats .pub-stat");
    var chart = document.getElementById("pubAutoChart");
    if (!chart || !stats || !stats.length) return;

    var items = [];
    for (var i = 0; i < stats.length; i++) {
      var numEl = stats[i].querySelector(".pub-stat__num");
      var labEl = stats[i].querySelector(".pub-stat__label");
      if (!numEl || !labEl) continue;

      var value = parseInt((numEl.textContent || "").replace(/[^\d]/g, ""), 10);
      var label = (labEl.textContent || "").trim();
      if (!isFinite(value) || !label) continue;

      items.push({ label: label, value: value });
    }
    if (!items.length) return;

    var maxVal = 1;
    for (var j = 0; j < items.length; j++) if (items[j].value > maxVal) maxVal = items[j].value;

    chart.innerHTML = "";
    var title = document.createElement("div");
    title.className = "pub-chart__title";
    title.textContent = "Publications";
    chart.appendChild(title);

    var colors = ["#1f77b4", "#ff7f0e", "#2ca02c", "#9467bd"];

    for (var k = 0; k < items.length; k++) {
      var row = document.createElement("div");
      row.className = "pub-chart__row";

      var lab = document.createElement("div");
      lab.className = "pub-chart__label";
      lab.title = items[k].label;
      lab.textContent = items[k].label;

      var bar = document.createElement("div");
      bar.className = "pub-chart__bar";

      var fill = document.createElement("div");
      fill.className = "pub-chart__fill";
      fill.style.background = colors[k % colors.length];
      var pct = (items[k].value / maxVal) * 100;
      fill.setAttribute("data-pct", pct.toFixed(2));
      bar.appendChild(fill);

      var val = document.createElement("div");
      val.className = "pub-chart__value";
      val.textContent = String(items[k].value);

      row.appendChild(lab);
      row.appendChild(bar);
      row.appendChild(val);
      chart.appendChild(row);
    }

    chart.style.display = "";

    requestAnimationFrame(function () {
      var fills = chart.querySelectorAll(".pub-chart__fill");
      for (var t = 0; t < fills.length; t++) {
        fills[t].style.width = (fills[t].getAttribute("data-pct") || "0") + "%";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildChart);
  } else {
    buildChart();
  }
})();