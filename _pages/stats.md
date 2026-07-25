---
layout: academic
title: "Site Reach"
description: "An aggregated public report of page views, geographic reach and reading environment for huguryildiz.com."
permalink: /stats/
---

{% assign stats = site.data.site_stats %}

<article class="shell reach-report">
  <header class="pagehead reach-head">
    <p class="reach-kicker">Public analytics report</p>
    <h1>Site Reach</h1>
    <p class="lede">The figures published here come from GoatCounter and are refreshed daily when the data pipeline is available. This report presents aggregated page-view activity—not individual visitors—and reflects the measurement coverage and limitations stated below.</p>

    <dl class="reach-meta" aria-label="Report metadata">
      <div><dt>Last updated</dt><dd>{% if stats.updated %}{{ stats.updated | date: "%d %b %Y, %H:%M UTC" }}{% else %}Awaiting refresh{% endif %}</dd></div>
      <div><dt>Tracked since</dt><dd>{% if stats.range.start %}{{ stats.range.start | date: "%d %b %Y" }}{% else %}Not available{% endif %}</dd></div>
      <div><dt>Source</dt><dd><a href="https://www.goatcounter.com/" target="_blank" rel="noopener">GoatCounter<span class="sr-only"> (opens in a new tab)</span></a></dd></div>
    </dl>
  </header>

  <div class="reach-toolbar" id="reachToolbar" hidden>
    <div class="reach-field">
      <span class="reach-field-label" id="reachRangeLabel">Date range</span>
      <div class="reach-picker">
        <button type="button" class="reach-picker-btn" id="reachRangeBtn"
                aria-haspopup="dialog" aria-expanded="false" aria-describedby="reachRangeLabel">
          <span id="reachRangeValue">All time</span>
          <svg viewBox="0 0 10 6" aria-hidden="true" focusable="false"><path d="M1 1l4 4 4-4"/></svg>
        </button>
        <div class="reach-picker-pop" id="reachRangePop" role="dialog" aria-label="Choose a date range" hidden></div>
      </div>
    </div>
    <p class="reach-scope" id="reachScope"></p>
  </div>

  <dl class="reach-metrics" id="reachMetrics" aria-label="Site reach summary" aria-live="polite"></dl>

  <noscript>
    <div class="reach-empty" role="status">
      <div>
        <h3>Interactive report requires JavaScript</h3>
        <p>This report is rendered in the browser so that a single stored snapshot can be re-sliced across date ranges. Without JavaScript the totals below remain available: {{ stats.totals.pageviews }} page views recorded across {{ stats.countries.size }} countries since {{ stats.range.start | date: "%b %Y" }}.</p>
      </div>
    </div>
  </noscript>

  <div class="reach-grid reach-grid-primary">
    <section class="reach-panel reach-traffic" aria-labelledby="traffic-title">
      <header class="reach-section-head">
        <div>
          <p class="reach-index">01 / Temporal coverage</p>
          <h2 id="traffic-title">Traffic over time</h2>
        </div>
        <div class="reach-toggle" id="reachChartMode" role="group" aria-label="Trend display">
          <button type="button" data-mode="raw" aria-pressed="true">Raw</button>
          <button type="button" data-mode="cumulative" aria-pressed="false">Cumulative</button>
        </div>
      </header>
      <div class="reach-chart" id="reachChart"></div>
      <p class="reach-chart-summary" id="reachChartSummary"></p>
    </section>

    <section class="reach-panel reach-pages" aria-labelledby="pages-title">
      <header class="reach-section-head">
        <div>
          <p class="reach-index">02 / Readership</p>
          <h2 id="pages-title">Most viewed pages</h2>
        </div>
        <span class="reach-unit">Top five</span>
      </header>
      <div id="reachPages"></div>
    </section>
  </div>

  <div class="reach-grid reach-grid-secondary">
    <section class="reach-panel reach-geography" aria-labelledby="geography-title">
      <header class="reach-section-head">
        <div>
          <p class="reach-index">03 / Geographic reach</p>
          <h2 id="geography-title">Where readers arrived from</h2>
        </div>
        <span class="reach-unit">Top five listed</span>
      </header>
      <div class="reach-map-layout">
        <div class="worldmap" id="worldMap" data-map-url="{{ '/assets/maps/world.svg' | relative_url }}">
          <p class="reach-map-fallback">The interactive map is loading. The ranked country list remains available.</p>
        </div>
        <div id="reachCountries"></div>
      </div>
      <div id="reachRegions"></div>
      <p class="reach-note worldmap-credit" id="mapCredit" hidden>Map geometry: <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noopener">@svg-maps/world<span class="sr-only"> (opens in a new tab)</span></a>, CC BY 4.0. Shading uses a logarithmic scale; country names and exact counts are available by keyboard focus and in the ranked list.</p>
    </section>

    <section class="reach-panel reach-discovery" aria-labelledby="discovery-title">
      <header class="reach-section-head">
        <div>
          <p class="reach-index">04 / Discovery</p>
          <h2 id="discovery-title">Discovery sources</h2>
        </div>
      </header>
      <div id="reachReferrers"></div>
      <p class="reach-note"><strong>Direct</strong> means that no referrer header was available—for example, after a typed URL, bookmark, or a link opened by an app that strips referral information. It is not a known acquisition source.</p>
    </section>
  </div>

  <section class="reach-panel reach-environment" aria-labelledby="environment-title">
    <header class="reach-section-head">
      <div>
        <p class="reach-index">05 / Reading environment</p>
        <h2 id="environment-title">How the site was read</h2>
      </div>
      <span class="reach-unit">Share of page views</span>
    </header>
    <div class="reach-stacks" id="reachEnvironment"></div>
  </section>

  <aside class="reach-method" aria-labelledby="method-title">
    <p class="reach-index">Method note</p>
    <h2 id="method-title">How to read this report</h2>
    <div>
      <p>Every figure is an aggregate page-view count from GoatCounter for the selected date range. GoatCounter does not track sessions, so this report contains no sessions, bounce rate, average session duration, or new-versus-returning split; those measures are absent rather than estimated. It resolves a visitor's location to a country and, below that, to a region—a province or state—but never to a city, so no city breakdown exists to publish.</p>
      <p>The date-range control re-slices one stored daily snapshot. Page-view totals, averages and period-over-period changes are computed from that daily series, so they are exact for any range, including one picked from the calendar. A change is shown only when the whole preceding period of equal length falls inside the tracked window—otherwise it is omitted rather than compared against partial data.</p>
      <p>The ranked breakdowns (pages, countries, sources, and reading environment) are a different case: GoatCounter aggregates them server-side, so only the preset ranges carry their own figures. Choosing a custom range leaves those panels showing all-time totals, and each one says so rather than implying the numbers match the selected dates.</p>
      <p>The trend can be read two ways. <strong>Raw</strong> plots the page views recorded in each day or week on its own; <strong>Cumulative</strong> adds them up as the range progresses, so the final point equals the range total shown above. Neither adds information the other lacks—the axis label states which one is on screen.</p>
      <p>Browser, operating-system, and screen-class shares are reported as coarse aggregates over page views. They carry no per-visitor detail and are not linked to any other dimension in this report. Maintenance and measurement paths such as <code>/404.html</code> and <code>/stats/</code> are excluded from the public content ranking without altering the source data.</p>
      <p>This statement describes the source of the figures on this page only. It is not a site-wide claim about every analytics service loaded by huguryildiz.com.</p>
    </div>
  </aside>
</article>

<script type="application/json" id="reachData">{{ stats | jsonify | replace: "</", "<\/" }}</script>
<script>
(function(){
  'use strict';
  var host = document.getElementById('reachData');
  if (!host) return;
  var DATA;
  try { DATA = JSON.parse(host.textContent); } catch (e) { return; }

  var SERIES = (DATA.timeseries || []).map(function(p){
    return { date:p.date, views:Number(p.views) || 0 };
  }).filter(function(p){ return p.date; });
  if (!SERIES.length) return;

  var NS = 'http://www.w3.org/2000/svg';
  var DAY = 86400000;
  /* days = length of the window, offset = how many days back it ends. Every
     preset is measured from the last day in the snapshot, not the wall clock,
     so the figures always match the data that is actually stored. */
  var WINDOW_SPEC = {
    'today':     { days:1,    offset:0 },
    'yesterday': { days:1,    offset:1 },
    '7d':        { days:7,    offset:0 },
    '30d':       { days:30,   offset:0 },
    '90d':       { days:90,   offset:0 },
    '12m':       { days:365,  offset:0 },
    'all':       { days:null, offset:0 }
  };
  var WINDOW_LABELS = { 'today':'Today', 'yesterday':'Yesterday', '7d':'Last 7 days',
                        '30d':'Last 30 days', '90d':'Last 90 days',
                        '12m':'Last 12 months', 'all':'All time' };
  var PRESET_ORDER = ['today', 'yesterday', '7d', '30d', '90d', '12m', 'all'];
  var FIRST = SERIES[0].date, LAST = SERIES[SERIES.length - 1].date;

  var fmt = function(n){ return Number(n || 0).toLocaleString('en-US'); };
  var toDate = function(s){ return new Date(s + 'T00:00:00Z'); };
  var toKey = function(d){ return d.toISOString().slice(0, 10); };
  var shortDate = function(s){
    return toDate(s).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric', timeZone:'UTC' });
  };
  var tickDate = function(s){
    return toDate(s).toLocaleDateString('en-GB', { day:'numeric', month:'short', timeZone:'UTC' });
  };

  function plural(n, word){ return fmt(n) + ' ' + word + (n === 1 ? '' : 's'); }
  function el(tag, cls, text){
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function svgEl(name, attrs, text){
    var node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function(k){ node.setAttribute(k, attrs[k]); });
    if (text != null) node.textContent = text;
    return node;
  }
  function empty(host, title, body){
    var box = el('div', 'reach-empty'); box.setAttribute('role', 'status');
    var inner = el('div');
    inner.appendChild(el('h3', null, title));
    inner.appendChild(el('p', null, body));
    box.appendChild(inner);
    host.replaceChildren(box);
  }

  /* ---- window arithmetic; every total is derived from the one daily series --- */
  var customRange = null;
  var chartMode = 'raw';  /* 'raw' | 'cumulative' */
  var lastBounds = null, lastPoints = null;

  function dayCount(start, end){
    return Math.round((toDate(end).getTime() - toDate(start).getTime()) / DAY) + 1;
  }
  function bounds(key){
    if (key === 'custom' && customRange) {
      return { key:key, start:customRange.start, end:customRange.end,
               days:dayCount(customRange.start, customRange.end) };
    }
    var spec = WINDOW_SPEC[key] || WINDOW_SPEC.all;
    if (spec.days == null) return { key:key, start:FIRST, end:LAST, days:SERIES.length };
    var end = toKey(new Date(toDate(LAST).getTime() - spec.offset * DAY));
    var start = toKey(new Date(toDate(end).getTime() - (spec.days - 1) * DAY));
    return { key:key, start:start < FIRST ? FIRST : start, end:end, days:spec.days };
  }
  function slice(start, end){
    return SERIES.filter(function(p){ return p.date >= start && p.date <= end; });
  }
  function total(points){
    return points.reduce(function(t, p){ return t + p.views; }, 0);
  }
  /* Only compare against a preceding period that is fully inside the tracked
     window — a partial one would understate the previous total. */
  function previousTotal(b){
    if (b.key === 'all') return null;
    var prevEnd = new Date(toDate(b.start).getTime() - DAY);
    var prevStart = new Date(prevEnd.getTime() - (b.days - 1) * DAY);
    if (toKey(prevStart) < FIRST) return null;
    return total(slice(toKey(prevStart), toKey(prevEnd)));
  }

  /* ---- breakdowns: exact when the range was aggregated server-side --------- */
  function windowBlock(key){ return (DATA.windows || {})[key] || null; }
  function breakdown(key, name){
    var w = windowBlock(key);
    if (w && w[name] && w[name].length) {
      return { rows:w[name], count:w[name + '_total'], exact:true };
    }
    var all = windowBlock('all');
    if (all && all[name] && all[name].length) {
      return { rows:all[name], count:all[name + '_total'], exact:(key === 'all') };
    }
    return { rows:[], count:0, exact:false };
  }
  function staleNote(host, info){
    /* Nothing to qualify when the panel is empty — it already says so. */
    if (info.exact || !info.rows.length) return;
    var note = el('p', 'reach-flag', 'Range-specific breakdown not yet in the snapshot — showing all-time figures for this panel.');
    host.appendChild(note);
  }

  /* ---- KPI row ------------------------------------------------------------ */
  function metric(label, value, sub){
    var wrap = el('div');
    wrap.appendChild(el('dt', null, label));
    wrap.appendChild(el('dd', null, value));
    if (sub) wrap.appendChild(sub);
    return wrap;
  }
  function deltaNode(current, previous){
    if (previous == null) return el('p', 'reach-delta reach-delta-none', 'No comparable prior period');
    if (previous === 0) return el('p', 'reach-delta reach-delta-none', 'No views in prior period');
    var pct = (current - previous) / previous * 100;
    var dir = pct > 0.05 ? 'up' : (pct < -0.05 ? 'down' : 'flat');
    var node = el('p', 'reach-delta reach-delta-' + dir);
    var arrow = el('span', 'reach-delta-mark', dir === 'up' ? '▲' : (dir === 'down' ? '▼' : '–'));
    arrow.setAttribute('aria-hidden', 'true');
    node.appendChild(arrow);
    var word = dir === 'up' ? 'up' : (dir === 'down' ? 'down' : 'level');
    node.appendChild(el('span', null, (dir === 'flat' ? 'Level' : (Math.abs(pct) >= 100 ? Math.round(Math.abs(pct)) : Math.abs(pct).toFixed(1)) + '%') + ' vs previous period'));
    node.setAttribute('aria-label', word + ' ' + Math.abs(pct).toFixed(1) + ' percent versus the previous period');
    return node;
  }
  function renderMetrics(b, points){
    var host = document.getElementById('reachMetrics');
    var views = total(points);
    var peak = points.reduce(function(best, p){ return p.views > best.views ? p : best; }, points[0]);
    var avg = points.length ? views / points.length : 0;
    var countries = breakdown(b.key, 'countries');

    var nodes = [
      metric('Page views', fmt(views), deltaNode(views, previousTotal(b))),
      metric('Daily average', avg >= 10 ? fmt(Math.round(avg)) : avg.toFixed(1),
             el('p', 'reach-delta reach-delta-none', 'Across ' + plural(points.length, 'day'))),
      metric('Busiest day', fmt(peak.views),
             el('p', 'reach-delta reach-delta-none', peak.views ? shortDate(peak.date) : 'No activity recorded')),
      metric('Countries reached', countries.count ? fmt(countries.count) : '—',
             el('p', 'reach-delta reach-delta-none', countries.exact ? 'In this range' : 'All time'))
    ];
    host.replaceChildren.apply(host, nodes);
  }

  /* ---- trend chart -------------------------------------------------------- */
  function bucket(points, weekly){
    if (!weekly) return points.slice();
    var out = [];
    points.forEach(function(p){
      var d = toDate(p.date);
      var monday = new Date(d);
      monday.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
      var key = toKey(monday);
      var last = out[out.length - 1];
      if (!last || last.date !== key) out.push({ date:key, views:p.views });
      else last.views += p.views;
    });
    return out;
  }
  function renderChart(b, points){
    var host = document.getElementById('reachChart');
    var summary = document.getElementById('reachChartSummary');
    var weekly = b.days > 92;
    var rawRows = bucket(points, weekly);
    var cumulative = chartMode === 'cumulative';
    var bucketWord = weekly ? 'week' : 'day';
    /* Cumulative runs within the selected range, so the last point equals the
       "Page views" figure above and the two can always be reconciled. */
    var rows = rawRows;
    if (cumulative) {
      var run = 0;
      rows = rawRows.map(function(r){ run += r.views; return { date:r.date, views:run }; });
    }

    if (!rawRows.length || !total(rawRows)) {
      summary.textContent = '';
      empty(host, 'No activity in this range', 'Select a longer date range to see recorded page views.');
      return;
    }

    var W = 720, H = 260, left = 48, right = 16, top = 28, bottom = 42;
    var plotW = W - left - right, plotH = H - top - bottom;
    var peakValue = Math.max.apply(null, rows.map(function(r){ return r.views; })) || 1;
    /* Round the axis up to a clean step so the ticks read 0/5/10 rather than 0/6.5/13. */
    var step = (function(v){
      var target = v / 5, mag = Math.pow(10, Math.floor(Math.log(target) / Math.LN10));
      return [1, 2, 2.5, 5, 10].map(function(m){ return m * mag; })
        .filter(function(s){ return s >= target; })[0] || mag * 10;
    })(peakValue);
    var max = Math.ceil(peakValue / step) * step;
    var tickCount = Math.round(max / step);
    var peak = rawRows.reduce(function(best, r){ return r.views > best.views ? r : best; }, rawRows[0]);
    var sum = total(rawRows);
    var unitText = cumulative ? 'cumulative page views' : 'page views / ' + bucketWord;

    var svg = svgEl('svg', { viewBox:'0 0 ' + W + ' ' + H, role:'img',
                             'aria-labelledby':'reachChartTitle reachChartDesc' });
    svg.appendChild(svgEl('title', { id:'reachChartTitle' },
      (cumulative ? 'Cumulative page views' : (weekly ? 'Weekly' : 'Daily') + ' page views')));
    svg.appendChild(svgEl('desc', { id:'reachChartDesc' },
      'From ' + shortDate(rawRows[0].date) + ' to ' + shortDate(rawRows[rawRows.length - 1].date) + ', ' + fmt(sum) +
      ' page views in total' + (cumulative ? ', accumulating across the range.'
        : '. Busiest ' + bucketWord + ': ' + shortDate(peak.date) + ', ' + fmt(peak.views) + '.')));
    /* Name the y unit on the axis itself, not only in the panel header. */
    svg.appendChild(svgEl('text', { class:'reach-chart-unit', x:left, y:14, 'text-anchor':'start' }, unitText));

    for (var t = 0; t <= tickCount; t++){
      var value = Math.round(step * (tickCount - t)), y = top + plotH * t / tickCount;
      svg.appendChild(svgEl('line', { class:'reach-chart-grid', x1:left, y1:y, x2:W - right, y2:y }));
      svg.appendChild(svgEl('text', { class:'reach-chart-y', x:left - 9, y:y + 4, 'text-anchor':'end' }, fmt(value)));
    }

    var xAt = function(i){ return left + (rows.length > 1 ? i / (rows.length - 1) * plotW : plotW / 2); };
    var yAt = function(v){ return top + plotH * (1 - v / max); };
    var pts = rows.map(function(r, i){ return [xAt(i), yAt(r.views)]; });
    var line = pts.map(function(p, i){ return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    svg.appendChild(svgEl('path', { class:'reach-chart-area',
      d:line + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (top + plotH) + ' L' + pts[0][0].toFixed(1) + ' ' + (top + plotH) + ' Z' }));
    svg.appendChild(svgEl('path', { class:'reach-chart-line', d:line, 'vector-effect':'non-scaling-stroke' }));
    /* A single-day range has no line to draw, so mark the one value instead. */
    if (pts.length === 1) svg.appendChild(svgEl('circle', { class:'reach-chart-dot', r:4.5, cx:pts[0][0], cy:pts[0][1] }));

    var ticks = [0, Math.round((rows.length - 1) / 3), Math.round((rows.length - 1) * 2 / 3), rows.length - 1]
      .filter(function(v, i, a){ return a.indexOf(v) === i; });
    ticks.forEach(function(i){
      svg.appendChild(svgEl('text', { class:'reach-chart-x', x:xAt(i), y:H - 13,
        'text-anchor':i === 0 ? 'start' : (i === rows.length - 1 ? 'end' : 'middle') }, tickDate(rows[i].date)));
    });

    /* Crosshair layer: the reader aims at a date, never at a 2px line. */
    var cross = svgEl('line', { class:'reach-chart-cross', x1:0, y1:top, x2:0, y2:top + plotH });
    cross.setAttribute('opacity', '0');
    var dot = svgEl('circle', { class:'reach-chart-dot', r:4.5, cx:0, cy:0 });
    dot.setAttribute('opacity', '0');
    svg.appendChild(cross); svg.appendChild(dot);
    host.replaceChildren(svg);

    var tip = el('div', 'reach-tip'); tip.hidden = true;
    host.appendChild(tip);

    function pick(clientX){
      var box = svg.getBoundingClientRect();
      var x = (clientX - box.left) / box.width * W;
      var i = Math.round((x - left) / plotW * (rows.length - 1));
      return Math.max(0, Math.min(rows.length - 1, i));
    }
    function show(clientX){
      var i = pick(clientX), r = rows[i];
      cross.setAttribute('x1', xAt(i)); cross.setAttribute('x2', xAt(i)); cross.setAttribute('opacity', '1');
      dot.setAttribute('cx', xAt(i)); dot.setAttribute('cy', yAt(r.views)); dot.setAttribute('opacity', '1');
      tip.replaceChildren(el('strong', null, plural(r.views, 'view')),
                          el('span', null, cumulative
                            ? 'total by ' + shortDate(r.date)
                            : (weekly ? 'Week of ' : '') + shortDate(r.date)));
      tip.hidden = false;
      var box = svg.getBoundingClientRect();
      tip.style.left = (xAt(i) / W * box.width) + 'px';
      tip.style.top = (yAt(r.views) / H * box.height) + 'px';
    }
    function hide(){ cross.setAttribute('opacity', '0'); dot.setAttribute('opacity', '0'); tip.hidden = true; }
    svg.addEventListener('pointermove', function(e){ show(e.clientX); });
    svg.addEventListener('pointerleave', hide);

    summary.textContent = rows.length === 1
      ? fmt(sum) + ' views on ' + shortDate(rows[0].date)
      : fmt(sum) + ' views across ' + plural(rows.length, bucketWord) +
        (cumulative ? ' · Running total, reset at the start of the range'
                    : ' · Busiest ' + bucketWord + ' ' + shortDate(peak.date) + ': ' + fmt(peak.views));
  }

  /* ---- ranked bar lists --------------------------------------------------- */
  var PAGE_LABELS = { '/':'Home', '/cv':'Curriculum Vitae', '/publications':'Publications',
    '/research':'Research', '/service':'Service', '/teaching':'Teaching',
    '/students':'Students', '/writing':'Writing', '/stats':'Site Reach' };
  var HIDDEN_PAGES = { '/404.html':1, '/stats':1, '/stats/':1 };

  function barList(host, rows, opts){
    if (!rows.length) {
      empty(host, opts.emptyTitle, opts.emptyBody);
      return;
    }
    var max = rows[0].count || 1;
    var list = el('ol', 'reach-bars');
    list.setAttribute('aria-label', opts.label);
    rows.forEach(function(row, i){
      var li = el('li');
      li.style.setProperty('--reach-value', row.count);
      li.style.setProperty('--reach-max', max);
      var rank = el('span', 'reach-rank', ('0' + (i + 1)).slice(-2));
      rank.setAttribute('aria-hidden', 'true');
      li.appendChild(rank);
      if (row.href) {
        var a = el('a', null, row.name);
        a.href = row.href;
        li.appendChild(a);
      } else {
        li.appendChild(el('span', null, row.name));
      }
      var bar = el('span', 'reach-bar'); bar.setAttribute('aria-hidden', 'true');
      bar.appendChild(el('i'));
      li.appendChild(bar);
      var strong = el('strong', null, fmt(row.count));
      strong.appendChild(el('span', 'sr-only', ' page views'));
      li.appendChild(strong);
      list.appendChild(li);
    });
    host.replaceChildren(list);
  }

  function renderPages(key){
    var host = document.getElementById('reachPages');
    var info = breakdown(key, 'pages');
    var rows = info.rows.filter(function(r){ return !HIDDEN_PAGES[r.path]; }).slice(0, 5)
      .map(function(r){
        var label = PAGE_LABELS[r.path] || r.path;
        var href = r.path === '/' ? '/' : (r.path.charAt(r.path.length - 1) === '/' ? r.path : r.path + '/');
        return { name:label, count:r.count, href:href };
      });
    barList(host, rows, { label:'Most viewed content pages',
      emptyTitle:'No page ranking available',
      emptyBody:'Content rankings will appear after the next successful data refresh.' });
    staleNote(host, info);
  }

  function renderReferrers(key){
    var host = document.getElementById('reachReferrers');
    var info = breakdown(key, 'referrers');
    barList(host, info.rows.slice(0, 5), { label:'Top referrer sources',
      emptyTitle:'No discovery data available',
      emptyBody:'Referrer aggregates will appear after a successful refresh.' });
    staleNote(host, info);
  }

  function renderCountries(key){
    var host = document.getElementById('reachCountries');
    var info = breakdown(key, 'countries');
    barList(host, info.rows.slice(0, 5), { label:'Countries with the most page views',
      emptyTitle:'No geographic aggregate available',
      emptyBody:'The report does not currently contain country-level data.' });
    staleNote(host, info);
    paintMap(info.rows);
    renderRegions(key);
  }

  /* Regions are the finest location GoatCounter records — it has no city
     data — so the panel only appears once the pipeline has stored some. */
  function renderRegions(key){
    var host = document.getElementById('reachRegions');
    if (!host) return;
    var info = breakdown(key, 'regions');
    if (!info.rows.length) { host.replaceChildren(); return; }

    var head = el('div', 'reach-subhead');
    head.appendChild(el('h3', null, 'Regions within those countries'));
    head.appendChild(el('span', 'reach-unit', 'Top five'));
    var list = el('div');
    barList(list, info.rows.slice(0, 5).map(function(r){
      return { name:r.country ? r.name + ', ' + r.country : r.name, count:r.count };
    }), { label:'Regions with the most page views',
          emptyTitle:'No regional aggregate available', emptyBody:'' });
    host.replaceChildren(head, list);
    staleNote(host, info);
  }

  /* ---- world map ---------------------------------------------------------- */
  var mapSvg = null, mapTip = null;
  function paintMap(rows){
    if (!mapSvg) return;
    var byCode = {};
    rows.forEach(function(r){ if (r.code) byCode[r.code.toLowerCase()] = r; });
    var max = rows.length ? rows[0].count : 0;
    var bucketOf = function(v){ return Math.max(1, Math.min(5, Math.ceil(Math.log(v + 1) / Math.log(max + 1) * 5))); };

    mapSvg.querySelectorAll('path[data-code]').forEach(function(path){
      var row = byCode[(path.getAttribute('data-code') || '').toLowerCase()];
      path.classList.remove('wm-on', 'wm-b1', 'wm-b2', 'wm-b3', 'wm-b4', 'wm-b5');
      path.removeAttribute('tabindex');
      path.removeAttribute('aria-label');
      if (!row || !max) return;
      path.classList.add('wm-on', 'wm-b' + bucketOf(row.count));
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'img');
      path.setAttribute('aria-label', row.name + ', ' + fmt(row.count) + ' page views');
      path.__reach = row;
    });
  }
  function loadMap(onReady){
    var host = document.getElementById('worldMap');
    if (!host || !window.fetch) return;
    fetch(host.dataset.mapUrl).then(function(res){
      if (!res.ok) throw new Error('Map request failed: ' + res.status);
      return res.text();
    }).then(function(source){
      var doc = new DOMParser().parseFromString(source, 'image/svg+xml');
      if (doc.querySelector('parsererror')) throw new Error('Map SVG could not be parsed');
      mapSvg = document.importNode(doc.documentElement, true);
      mapSvg.classList.add('worldmap-svg');
      mapSvg.setAttribute('role', 'group');
      mapSvg.setAttribute('aria-label', 'World map of page views by country. Use Tab to inspect countries with recorded views.');
      mapTip = el('div', 'worldmap-tip'); mapTip.hidden = true;

      var show = function(e){
        var path = e.currentTarget, row = path.__reach;
        if (!row) return;
        mapTip.textContent = row.name + ' · ' + fmt(row.count) + ' views';
        mapTip.hidden = false;
        var box = host.getBoundingClientRect(), mark = path.getBoundingClientRect();
        mapTip.style.left = ((e && Number.isFinite(e.clientX) ? e.clientX - box.left : mark.left - box.left + mark.width / 2)) + 'px';
        mapTip.style.top = ((e && Number.isFinite(e.clientY) ? e.clientY - box.top : mark.top - box.top)) + 'px';
      };
      var hide = function(){ mapTip.hidden = true; };
      mapSvg.querySelectorAll('path[data-code]').forEach(function(path){
        path.addEventListener('mouseenter', show);
        path.addEventListener('mousemove', show);
        path.addEventListener('mouseleave', hide);
        path.addEventListener('focus', show);
        path.addEventListener('blur', hide);
      });

      host.replaceChildren(mapSvg, mapTip);
      var credit = document.getElementById('mapCredit');
      if (credit) credit.hidden = false;
      onReady();
    }).catch(function(){
      var fallback = host.querySelector('.reach-map-fallback');
      if (fallback) fallback.textContent = 'The map could not be loaded. The ranked country list remains available.';
    });
  }

  /* ---- reading environment: part-to-whole stacked bars --------------------- */
  var STACKS = [
    { key:'browsers', title:'Browsers' },
    { key:'systems', title:'Operating systems' },
    { key:'sizes', title:'Screen classes' }
  ];
  var SLOTS = 4; /* four brand hues, then a neutral "Other" */

  /* Colour follows the entity, not its rank in the current range: slots are
     assigned once from the all-time ordering, so filtering never repaints. */
  var slotIndex = {};
  STACKS.forEach(function(stack){
    var all = windowBlock('all');
    var rows = (all && all[stack.key]) || [];
    slotIndex[stack.key] = {};
    rows.slice(0, SLOTS).forEach(function(r, i){ slotIndex[stack.key][r.name] = i + 1; });
  });

  function renderStacks(key){
    var host = document.getElementById('reachEnvironment');
    var blocks = [];
    STACKS.forEach(function(stack){
      var info = breakdown(key, stack.key);
      if (!info.rows.length) return;
      var sum = info.rows.reduce(function(t, r){ return t + r.count; }, 0);
      if (!sum) return;

      /* Named slots keep their hue; everything else folds into "Other". */
      var named = info.rows.filter(function(r){ return slotIndex[stack.key][r.name]; });
      var rest = info.rows.filter(function(r){ return !slotIndex[stack.key][r.name]; });
      var segments = named.map(function(r){
        return { name:r.name, count:r.count, slot:slotIndex[stack.key][r.name] };
      });
      var otherCount = rest.reduce(function(t, r){ return t + r.count; }, 0);
      if (otherCount) segments.push({ name:'Other', count:otherCount, slot:0 });
      segments.sort(function(a, b){ return b.count - a.count; });

      var wrap = el('section', 'reach-stack');
      var head = el('div', 'reach-stack-head');
      head.appendChild(el('h3', null, stack.title));
      head.appendChild(el('span', 'reach-stack-total', fmt(sum) + ' views'));
      wrap.appendChild(head);

      var track = el('div', 'reach-stack-track');
      track.setAttribute('role', 'img');
      track.setAttribute('aria-label', stack.title + ': ' + segments.map(function(s){
        return s.name + ' ' + (s.count / sum * 100).toFixed(1) + '%';
      }).join(', '));
      segments.forEach(function(s){
        var seg = el('span', 'reach-seg reach-seg-' + s.slot);
        seg.style.setProperty('--reach-share', (s.count / sum * 100).toFixed(3) + '%');
        seg.setAttribute('tabindex', '0');
        seg.setAttribute('role', 'button');
        seg.setAttribute('aria-label', s.name + ', ' + fmt(s.count) + ' views, ' + (s.count / sum * 100).toFixed(1) + ' percent');
        track.appendChild(seg);
      });
      wrap.appendChild(track);

      /* The legend carries every value, so nothing is gated behind hover. */
      var legend = el('ul', 'reach-legend');
      segments.forEach(function(s){
        var li = el('li');
        var swatch = el('span', 'reach-swatch reach-seg-' + s.slot);
        swatch.setAttribute('aria-hidden', 'true');
        li.appendChild(swatch);
        li.appendChild(el('span', 'reach-legend-name', s.name));
        li.appendChild(el('span', 'reach-legend-value', (s.count / sum * 100).toFixed(1) + '% · ' + fmt(s.count)));
        legend.appendChild(li);
      });
      wrap.appendChild(legend);
      if (!info.exact) wrap.appendChild(el('p', 'reach-flag', 'Range-specific breakdown not yet in the snapshot — showing all-time figures.'));
      blocks.push(wrap);
    });

    if (!blocks.length) {
      empty(host, 'No environment breakdown available',
        'Browser, operating-system and screen-class aggregates will appear after the next successful refresh.');
      return;
    }
    host.replaceChildren.apply(host, blocks);
  }

  /* ---- date-range picker: presets first, calendar behind the hairline ------ */
  var scope = document.getElementById('reachScope');
  var toolbar = document.getElementById('reachToolbar');
  var pickBtn = document.getElementById('reachRangeBtn');
  var pickValue = document.getElementById('reachRangeValue');
  var pickPop = document.getElementById('reachRangePop');

  /* Presets come from this fixed list rather than the snapshot: totals and
     trends are derived from the daily series, so every one of them is exact
     even before the pipeline has stored a matching breakdown block. */
  var presets = PRESET_ORDER.filter(function(k){
    var spec = WINDOW_SPEC[k];
    /* Never offer a window that reaches back further than the data itself. */
    return spec.days == null || spec.days + spec.offset <= SERIES.length;
  });
  if (presets.indexOf('all') < 0) presets.push('all');

  var current = presets.indexOf('30d') >= 0 ? '30d' : presets[0];
  var viewMonth = null;   /* first day of the month shown in the calendar */
  var pendingDay = null;  /* first click of a range, waiting for the second */
  var calView = 'day';    /* 'day' | 'month' | 'year' */

  var MONTH_FIRST = new Date(Date.UTC(toDate(FIRST).getUTCFullYear(), toDate(FIRST).getUTCMonth(), 1));
  var MONTH_LAST = new Date(Date.UTC(toDate(LAST).getUTCFullYear(), toDate(LAST).getUTCMonth(), 1));

  function monthLabel(d){
    return d.toLocaleDateString('en-GB', { month:'long', year:'numeric', timeZone:'UTC' });
  }
  function shiftMonth(d, by){
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + by, 1));
  }
  function currentLabel(){
    if (current === 'custom' && customRange) {
      return shortDate(customRange.start) + ' – ' + shortDate(customRange.end);
    }
    return WINDOW_LABELS[current] || current;
  }

  function buildPresets(){
    var list = el('div', 'reach-presets');
    list.setAttribute('role', 'group');
    list.setAttribute('aria-label', 'Preset ranges');
    presets.forEach(function(key){
      var row = el('button', 'reach-preset');
      row.type = 'button';
      row.setAttribute('aria-pressed', current === key ? 'true' : 'false');
      var mark = el('span', 'reach-preset-mark', current === key ? '✓' : '');
      mark.setAttribute('aria-hidden', 'true');
      row.appendChild(mark);
      row.appendChild(el('span', null, WINDOW_LABELS[key] || key));
      row.addEventListener('click', function(){
        current = key;
        customRange = null;
        pendingDay = null;
        closePicker(true);
        apply();
      });
      list.appendChild(row);
    });
    return list;
  }

  /* The calendar drills up: days -> months of a year -> years of a decade.
     Clicking a month or a year only navigates; a range is always chosen by
     clicking two days. */
  var YEAR_MIN = toDate(FIRST).getUTCFullYear();
  var YEAR_MAX = toDate(LAST).getUTCFullYear();

  function decadeStart(year){ return Math.floor(year / 10) * 10; }
  function monthHasData(year, month){
    var first = toKey(new Date(Date.UTC(year, month, 1)));
    var last = toKey(new Date(Date.UTC(year, month + 1, 0)));
    return !(last < FIRST || first > LAST);
  }
  function yearHasData(year){ return !(year < YEAR_MIN || year > YEAR_MAX); }

  function buildHead(){
    var head = el('div', 'reach-cal-head');
    var prev = el('button', 'reach-cal-nav', '‹');
    prev.type = 'button';
    var next = el('button', 'reach-cal-nav', '›');
    next.type = 'button';
    var year = viewMonth.getUTCFullYear();
    var title;

    if (calView === 'day') {
      prev.setAttribute('aria-label', 'Previous month');
      next.setAttribute('aria-label', 'Next month');
      prev.disabled = viewMonth <= MONTH_FIRST;
      next.disabled = viewMonth >= MONTH_LAST;
      prev.addEventListener('click', function(){ viewMonth = shiftMonth(viewMonth, -1); paintPicker(); });
      next.addEventListener('click', function(){ viewMonth = shiftMonth(viewMonth, 1); paintPicker(); });
      title = el('button', 'reach-cal-title', monthLabel(viewMonth));
      title.type = 'button';
      title.setAttribute('aria-label', monthLabel(viewMonth) + ' — choose a different month');
      title.addEventListener('click', function(){ calView = 'month'; paintPicker(); });
    } else if (calView === 'month') {
      prev.setAttribute('aria-label', 'Previous year');
      next.setAttribute('aria-label', 'Next year');
      prev.disabled = year <= YEAR_MIN;
      next.disabled = year >= YEAR_MAX;
      prev.addEventListener('click', function(){ viewMonth = shiftMonth(viewMonth, -12); paintPicker(); });
      next.addEventListener('click', function(){ viewMonth = shiftMonth(viewMonth, 12); paintPicker(); });
      title = el('button', 'reach-cal-title', String(year));
      title.type = 'button';
      title.setAttribute('aria-label', year + ' — choose a different year');
      title.addEventListener('click', function(){ calView = 'year'; paintPicker(); });
    } else {
      var from = decadeStart(year);
      prev.setAttribute('aria-label', 'Previous decade');
      next.setAttribute('aria-label', 'Next decade');
      prev.disabled = from <= decadeStart(YEAR_MIN);
      next.disabled = from >= decadeStart(YEAR_MAX);
      prev.addEventListener('click', function(){ viewMonth = shiftMonth(viewMonth, -120); paintPicker(); });
      next.addEventListener('click', function(){ viewMonth = shiftMonth(viewMonth, 120); paintPicker(); });
      title = el('span', 'reach-cal-title is-static', from + ' – ' + (from + 9));
    }

    head.appendChild(prev); head.appendChild(title); head.appendChild(next);
    return head;
  }

  function buildDayGrid(){
    var frag = document.createDocumentFragment();
    var names = el('div', 'reach-cal-names');
    names.setAttribute('aria-hidden', 'true');
    ['Mo','Tu','We','Th','Fr','Sa','Su'].forEach(function(n){ names.appendChild(el('span', null, n)); });
    frag.appendChild(names);

    var grid = el('div', 'reach-cal-grid');
    grid.setAttribute('role', 'grid');
    grid.setAttribute('aria-label', monthLabel(viewMonth));
    var firstWeekday = (viewMonth.getUTCDay() + 6) % 7;
    for (var pad = 0; pad < firstWeekday; pad++) grid.appendChild(el('span', 'reach-cal-pad'));

    var daysInMonth = new Date(Date.UTC(viewMonth.getUTCFullYear(), viewMonth.getUTCMonth() + 1, 0)).getUTCDate();
    var focusSet = false;
    for (var d = 1; d <= daysInMonth; d++){
      var iso = toKey(new Date(Date.UTC(viewMonth.getUTCFullYear(), viewMonth.getUTCMonth(), d)));
      var cell = el('button', 'reach-cal-day', String(d));
      cell.type = 'button';
      cell.dataset.date = iso;
      cell.setAttribute('role', 'gridcell');
      var outside = iso < FIRST || iso > LAST;
      cell.disabled = outside;
      if (outside) {
        cell.setAttribute('aria-disabled', 'true');
      } else {
        var inRange = customRange && iso >= customRange.start && iso <= customRange.end;
        if (inRange) cell.classList.add('is-in');
        if (customRange && (iso === customRange.start || iso === customRange.end)) cell.classList.add('is-edge');
        if (pendingDay === iso) cell.classList.add('is-edge');
        cell.setAttribute('aria-label', shortDate(iso));
        if (inRange || pendingDay === iso) cell.setAttribute('aria-selected', 'true');
        cell.tabIndex = focusSet ? -1 : 0;
        focusSet = true;
        cell.addEventListener('click', function(){ pickDay(this.dataset.date); });
      }
      grid.appendChild(cell);
    }
    grid.addEventListener('keydown', onCalendarKey);
    frag.appendChild(grid);
    return frag;
  }

  function buildMonthGrid(){
    var year = viewMonth.getUTCFullYear();
    var grid = el('div', 'reach-cal-months');
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Months of ' + year);
    for (var m = 0; m < 12; m++){
      var label = new Date(Date.UTC(year, m, 1)).toLocaleDateString('en-GB', { month:'short', timeZone:'UTC' });
      var cell = el('button', 'reach-cal-cell', label);
      cell.type = 'button';
      cell.dataset.month = m;
      if (!monthHasData(year, m)) {
        cell.disabled = true;
        cell.setAttribute('aria-disabled', 'true');
      } else {
        if (year === viewMonth.getUTCFullYear() && m === viewMonth.getUTCMonth()) cell.classList.add('is-edge');
        cell.addEventListener('click', function(){
          viewMonth = new Date(Date.UTC(year, Number(this.dataset.month), 1));
          calView = 'day';
          paintPicker();
        });
      }
      grid.appendChild(cell);
    }
    return grid;
  }

  function buildYearGrid(){
    var from = decadeStart(viewMonth.getUTCFullYear());
    var grid = el('div', 'reach-cal-years');
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Years ' + from + ' to ' + (from + 9));
    for (var i = 0; i < 10; i++){
      var y = from + i;
      var cell = el('button', 'reach-cal-cell', String(y));
      cell.type = 'button';
      cell.dataset.year = y;
      if (!yearHasData(y)) {
        cell.disabled = true;
        cell.setAttribute('aria-disabled', 'true');
      } else {
        if (y === viewMonth.getUTCFullYear()) cell.classList.add('is-edge');
        cell.addEventListener('click', function(){
          var picked = Number(this.dataset.year);
          var month = picked === viewMonth.getUTCFullYear() ? viewMonth.getUTCMonth() : 0;
          viewMonth = new Date(Date.UTC(picked, month, 1));
          calView = 'month';
          paintPicker();
        });
      }
      grid.appendChild(cell);
    }
    return grid;
  }

  function buildCalendar(){
    var wrap = el('div', 'reach-cal');
    wrap.appendChild(buildHead());
    if (calView === 'day') wrap.appendChild(buildDayGrid());
    else if (calView === 'month') wrap.appendChild(buildMonthGrid());
    else wrap.appendChild(buildYearGrid());

    var hint;
    if (calView !== 'day') {
      hint = calView === 'month' ? 'Choose a month to open its days.' : 'Choose a year to see its months.';
    } else {
      hint = pendingDay ? 'Start ' + shortDate(pendingDay) + ' — now pick the end date.'
                        : 'Pick a start date, then an end date.';
    }
    wrap.appendChild(el('p', 'reach-cal-hint', hint));
    return wrap;
  }

  function onCalendarKey(e){
    var step = { ArrowLeft:-1, ArrowRight:1, ArrowUp:-7, ArrowDown:7 }[e.key];
    if (!step) return;
    var focused = document.activeElement;
    if (!focused || !focused.dataset || !focused.dataset.date) return;
    e.preventDefault();
    var target = toKey(new Date(toDate(focused.dataset.date).getTime() + step * DAY));
    if (target < FIRST || target > LAST) return;
    var targetMonth = new Date(Date.UTC(toDate(target).getUTCFullYear(), toDate(target).getUTCMonth(), 1));
    if (targetMonth.getTime() !== viewMonth.getTime()) { viewMonth = targetMonth; paintPicker(); }
    var cell = pickPop.querySelector('.reach-cal-day[data-date="' + target + '"]');
    if (cell) {
      pickPop.querySelectorAll('.reach-cal-day').forEach(function(c){ c.tabIndex = -1; });
      cell.tabIndex = 0;
      cell.focus();
    }
  }

  function pickDay(iso){
    if (!pendingDay) { pendingDay = iso; paintPicker(); return; }
    var start = pendingDay <= iso ? pendingDay : iso;
    var end = pendingDay <= iso ? iso : pendingDay;
    pendingDay = null;
    customRange = { start:start, end:end };
    current = 'custom';
    closePicker(true);
    apply();
  }

  function paintPicker(){
    pickPop.replaceChildren(buildPresets(), el('div', 'reach-picker-rule'), buildCalendar());
  }

  function openPicker(){
    if (!viewMonth) viewMonth = MONTH_LAST;
    calView = 'day';
    paintPicker();
    pickPop.hidden = false;
    pickBtn.setAttribute('aria-expanded', 'true');
    document.addEventListener('mousedown', onOutside, true);
    document.addEventListener('keydown', onEscape, true);
  }
  function closePicker(focusBtn){
    /* Drop a half-finished range so reopening never shows a stale start date. */
    pendingDay = null;
    pickPop.hidden = true;
    pickBtn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('mousedown', onOutside, true);
    document.removeEventListener('keydown', onEscape, true);
    if (focusBtn) pickBtn.focus();
  }
  function onOutside(e){
    if (!pickPop.contains(e.target) && e.target !== pickBtn && !pickBtn.contains(e.target)) closePicker(false);
  }
  function onEscape(e){
    if (e.key === 'Escape') closePicker(true);
  }

  pickBtn.addEventListener('click', function(){
    if (pickPop.hidden) openPicker(); else closePicker(true);
  });

  var modeGroup = document.getElementById('reachChartMode');
  modeGroup.addEventListener('click', function(e){
    var btn = e.target.closest('button[data-mode]');
    if (!btn || btn.dataset.mode === chartMode) return;
    chartMode = btn.dataset.mode;
    modeGroup.querySelectorAll('button[data-mode]').forEach(function(b){
      b.setAttribute('aria-pressed', b.dataset.mode === chartMode ? 'true' : 'false');
    });
    if (lastBounds) renderChart(lastBounds, lastPoints);
  });

  function apply(){
    var b = bounds(current);
    var points = slice(b.start, b.end);
    lastBounds = b; lastPoints = points;
    pickValue.textContent = currentLabel();
    scope.textContent = (b.start === b.end ? shortDate(b.start) : shortDate(b.start) + ' – ' + shortDate(b.end))
      + ' · ' + plural(points.length, 'day');
    renderMetrics(b, points);
    renderChart(b, points);
    renderPages(current);
    renderCountries(current);
    renderReferrers(current);
    renderStacks(current);
  }

  toolbar.hidden = false;
  apply();
  loadMap(function(){ renderCountries(current); });
})();
</script>
