---
layout: academic
title: "Site Stats"
description: "Self-hosted, privacy-friendly web analytics for huguryildiz.com, powered by GoatCounter."
permalink: /stats/
---

<div class="shell">
  <header class="pagehead">
    <h1>Site Stats</h1>
    <p class="lede">Traffic on huguryildiz.com, measured with
      <a href="https://www.goatcounter.com/" target="_blank" rel="noopener">GoatCounter</a>,
      a lightweight, privacy-friendly, self-hosted analytics tool — no cookies, no
      cross-site tracking. Numbers below refresh automatically once a day.</p>
  </header>

  <div class="statgrid" role="group" aria-label="Site traffic summary">
    <div id="statTiles" style="display:contents"></div>
  </div>
  <p class="statnote" id="statFootnote"></p>
</div>

<div class="shell">
  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-chart"/></svg>Traffic over time</h2>
  <div class="tschart-wrap">
    <div class="tschart" id="tsChart"></div>
  </div>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-file"/></svg>Top pages</h2>
  <ul class="statbars" id="secPages"></ul>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-globe"/></svg>Countries</h2>
  <div class="worldmap" id="worldMap"></div>
  <p class="statnote worldmap-credit" id="mapCredit" hidden>World map: <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noopener">@svg-maps/world</a> · CC BY 4.0. Countries shaded by page views (log scale).</p>
  <ul class="statbars" id="secCountries"></ul>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-link"/></svg>Referrers</h2>
  <ul class="statbars" id="secReferrers"></ul>
  <p class="statnote" id="refFootnote">Direct visits (no referrer header, e.g. bookmarks, typed URLs, or most link-preview-stripped apps) are grouped as "(direct)".</p>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-code"/></svg>Browsers</h2>
  <div class="donutfig" id="secBrowsers"></div>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-network"/></svg>Operating systems</h2>
  <div class="donutfig" id="secSystems"></div>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-image"/></svg>Screen sizes</h2>
  <div class="donutfig" id="secSizes"></div>

  <div id="secLanguagesWrap" hidden>
    <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-flag"/></svg>Browser languages</h2>
    <ul class="statbars" id="secLanguages"></ul>
  </div>
</div>

<script>
var STATS = {{ site.data.site_stats | jsonify }};

(function(){
  var $ = function(s){ return document.querySelector(s); };
  var fmt = function(n){ return (n || 0).toLocaleString('en-US'); };

  function dayCount(range){
    if (!range || !range.start || !range.end) return null;
    var a = new Date(range.start + 'T00:00:00Z'), b = new Date(range.end + 'T00:00:00Z');
    return Math.round((b - a) / 86400000) + 1;
  }
  function fmtDate(iso){
    if (!iso) return '—';
    var d = new Date(iso);
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /* ---- KPI tiles ---- */
  (function(){
    var visitors = (STATS.totals && STATS.totals.visitors != null) ? fmt(STATS.totals.visitors) : '—';
    var days = dayCount(STATS.range);
    var tiles = [
      ['chart', fmt(STATS.totals && STATS.totals.pageviews), 'Page views'],
      ['users', visitors, 'Unique visitors'],
      ['globe', fmt((STATS.countries || []).length), 'Countries reached'],
      ['link', fmt((STATS.referrers || []).length), 'Referrer sources'],
      ['calendar', days != null ? fmt(days) : '—', 'Days tracked'],
      ['clock', fmtDate(STATS.updated), 'Last updated']
    ];
    $('#statTiles').innerHTML = tiles.map(function(t){
      return '<div class="stat"><svg class="ic" aria-hidden="true"><use href="#i-' + t[0] +
        '"/></svg><b>' + t[1] + '</b><span>' + t[2] + '</span></div>';
    }).join('');

    var note = 'Range: ' + (STATS.range ? STATS.range.start + ' – ' + STATS.range.end : 'n/a') +
      '. Unique-visitor counts require a GoatCounter plan tier this site does not use, so that tile shows page views only where marked "—".';
    if (STATS._seeded) {
      note += ' Page, country, and referrer totals below are real; the daily chart and the browser/OS/screen-size breakdowns are placeholder shapes seeded until the first automated refresh runs.';
    }
    $('#statFootnote').textContent = note;
  })();

  /* ---- daily time-series area/line chart (pure SVG, no libraries) ---- */
  (function(){
    var ts = STATS.timeseries || [];
    var host = $('#tsChart');
    if (!ts.length) { host.innerHTML = '<p class="statnote">No time-series data yet.</p>'; return; }
    var n = ts.length;
    var max = Math.max.apply(null, ts.map(function(p){ return p.views; }));
    var W = 640, H = 160, padT = 8, padB = 22;
    var pts = ts.map(function(p, i){
      var x = n > 1 ? (i / (n - 1)) * W : 0;
      var y = padT + (H - padT - padB) * (1 - (max ? p.views / max : 0));
      return [x, y];
    });
    var line = pts.map(function(p, i){ return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('');
    var area = line + ' L' + W + ',' + (H - padB) + ' L0,' + (H - padB) + ' Z';
    var peak = 0;
    ts.forEach(function(p, i){ if (p.views > ts[peak].views) peak = i; });
    var total = ts.reduce(function(s, p){ return s + p.views; }, 0);
    var label = 'Daily page views from ' + ts[0].date + ' to ' + ts[n - 1].date +
      '. Total ' + total + ' views over ' + n + ' days. Peak day ' + ts[peak].date +
      ' with ' + ts[peak].views + ' views.';
    host.innerHTML =
      '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="' + label + '">' +
        '<line class="tsbase" x1="0" y1="' + (H - padB) + '" x2="' + W + '" y2="' + (H - padB) + '"></line>' +
        '<path class="tsarea" d="' + area + '"></path>' +
        '<path class="tsline" d="' + line + '" vector-effect="non-scaling-stroke"></path>' +
      '</svg>' +
      '<div class="tsaxis"><span>' + ts[0].date + '</span><span>' + ts[n - 1].date + '</span></div>' +
      '<div class="cap">' + fmt(total) + ' views total · peak ' + ts[peak].date + ' (' + fmt(ts[peak].views) + ')</div>';
  })();

  /* ---- generic horizontal bar list ---- */
  function barList(id, items, ariaLabel, labelFn){
    var host = $(id);
    if (!host) return;
    items = items || [];
    if (!items.length) { host.innerHTML = '<li class="statnote">No data yet.</li>'; return; }
    host.setAttribute('aria-label', ariaLabel);
    var max = Math.max.apply(null, items.map(function(i){ return i.count; }));
    var total = items.reduce(function(s, i){ return s + i.count; }, 0);
    host.innerHTML = items.map(function(it){
      var label = labelFn ? labelFn(it) : it.name;
      var pct = max ? (it.count / max * 100) : 0;
      var share = total ? (it.count / total * 100) : 0;
      return '<li><span class="lbl" title="' + label + '">' + label + '</span>' +
        '<span class="track"><span class="fill" style="width:' + pct.toFixed(1) + '%"></span></span>' +
        '<span class="val tnum">' + fmt(it.count) + '</span>' +
        '<span class="sr-only">, ' + share.toFixed(1) + '% of shown total</span></li>';
    }).join('');
  }

  /* ---- donut chart (pure SVG, no libraries) ---- */
  function donut(id, items, ariaLabel){
    var host = $(id);
    if (!host) return;
    items = (items || []).slice().sort(function(a, b){ return b.count - a.count; });
    if (!items.length) { host.innerHTML = '<p class="statnote">No data yet.</p>'; return; }
    if (items.length > 6) {
      var top = items.slice(0, 5);
      var rest = items.slice(5).reduce(function(s, i){ return s + i.count; }, 0);
      if (rest > 0) top.push({ name: 'Other', count: rest });
      items = top;
    }
    var pal = ['var(--cc-net)', 'var(--cc-opt)', 'var(--cc-ai)', 'var(--cc-q)', 'var(--accent-strong)', 'var(--ink-faint)'];
    var total = items.reduce(function(s, i){ return s + i.count; }, 0) || 1;
    var R = 52, SW = 20, C = 2 * Math.PI * R, off = 0, segs = '', legend = '';
    items.forEach(function(it, i){
      var frac = it.count / total, len = frac * C, col = pal[i % pal.length];
      segs += '<circle class="dseg" r="' + R + '" cx="60" cy="60" fill="none" stroke="' + col +
        '" stroke-width="' + SW + '" stroke-dasharray="' + len.toFixed(2) + ' ' + (C - len).toFixed(2) +
        '" stroke-dashoffset="' + (-off).toFixed(2) + '"><title>' + it.name + ': ' + fmt(it.count) +
        ' (' + (frac * 100).toFixed(1) + '%)</title></circle>';
      off += len;
      legend += '<li><span class="sw" style="background:' + col + '"></span>' +
        '<span class="ln" title="' + it.name + '">' + it.name + '</span>' +
        '<span class="lv tnum">' + fmt(it.count) + '</span>' +
        '<span class="lp">' + (frac * 100).toFixed(0) + '%</span></li>';
    });
    host.setAttribute('aria-label', ariaLabel);
    host.innerHTML =
      '<svg class="donutsvg" viewBox="0 0 120 120" role="img" aria-label="' + ariaLabel + '">' +
        '<g transform="rotate(-90 60 60)">' + segs + '</g>' +
        '<text class="dtot" x="60" y="60" text-anchor="middle" dominant-baseline="central">' + fmt(total) + '</text>' +
      '</svg>' +
      '<ul class="donutleg">' + legend + '</ul>';
  }

  /* ---- world choropleth (self-hosted SVG, colored by traffic) ---- */
  function worldMap(id, countries){
    var host = $(id);
    if (!host || !countries || !countries.length) return;
    var byCode = {}, counts = [];
    countries.forEach(function(c){ if (c.code) { byCode[c.code.toLowerCase()] = c; counts.push(c.count); } });
    if (!counts.length) return;
    var maxc = Math.max.apply(null, counts);
    function bucket(v){ var b = Math.ceil(Math.log(v + 1) / Math.log(maxc + 1) * 5); return Math.max(1, Math.min(5, b)); }
    fetch('{{ "/assets/maps/world.svg" | relative_url }}').then(function(r){
      if (!r.ok) throw new Error('map ' + r.status);
      return r.text();
    }).then(function(svg){
      host.innerHTML = svg;
      var tip = document.createElement('div');
      tip.className = 'worldmap-tip'; tip.hidden = true;
      host.appendChild(tip);
      var hostRect = function(){ return host.getBoundingClientRect(); };
      host.querySelectorAll('path[data-code]').forEach(function(p){
        var c = byCode[(p.getAttribute('data-code') || '').toLowerCase()];
        if (!c) return;
        p.classList.add('wm-b' + bucket(c.count), 'wm-on');
        p.setAttribute('tabindex', '0');
        p.setAttribute('role', 'img');
        p.setAttribute('aria-label', c.name + ', ' + c.count + ' views');
        var txt = c.name + ' · ' + fmt(c.count) + ' views';
        var moveTip = function(e){
          tip.textContent = txt; tip.hidden = false;
          var hr = hostRect(), x, y;
          if (e && e.touches && e.touches[0]) { x = e.touches[0].clientX; y = e.touches[0].clientY; }
          else { x = e.clientX; y = e.clientY; }
          tip.style.left = (x - hr.left) + 'px'; tip.style.top = (y - hr.top) + 'px';
        };
        p.addEventListener('mouseenter', moveTip);
        p.addEventListener('mousemove', moveTip);
        p.addEventListener('mouseleave', function(){ tip.hidden = true; });
        p.addEventListener('focus', function(){
          tip.textContent = txt; tip.hidden = false;
          var hr = hostRect(), pr = p.getBoundingClientRect();
          tip.style.left = (pr.left - hr.left + pr.width / 2) + 'px';
          tip.style.top = (pr.top - hr.top) + 'px';
        });
        p.addEventListener('blur', function(){ tip.hidden = true; });
      });
      $('#mapCredit').hidden = false;
      host.classList.add('ready');
    }).catch(function(){ /* bar list below remains as the fallback */ });
  }

  barList('#secPages', STATS.pages, 'Top pages by views', function(p){ return p.path; });
  barList('#secCountries', STATS.countries, 'Views by country', function(c){ return c.name + ' (' + c.code + ')'; });
  barList('#secReferrers', STATS.referrers, 'Views by referrer source');
  donut('#secBrowsers', STATS.browsers, 'Views by browser');
  donut('#secSystems', STATS.systems, 'Views by operating system');
  donut('#secSizes', STATS.sizes, 'Views by screen size');
  worldMap('#worldMap', STATS.countries);
  if (STATS.languages && STATS.languages.length) {
    $('#secLanguagesWrap').hidden = false;
    barList('#secLanguages', STATS.languages, 'Views by browser language');
  }
})();
</script>
