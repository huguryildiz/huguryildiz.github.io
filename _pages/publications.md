---
layout: academic
title: "Publications"
description: "Peer-reviewed journal articles, an editorial, and international and national conference papers by Hüseyin Uğur Yıldız. Metrics from Google Scholar, refreshed weekly."
permalink: /publications/
---

{% assign sm = site.data.scholar_metrics %}
<div class="shell">
  <header class="pagehead">
    <h1 id="pubs-h1">Publications</h1>
    <p class="lede">Peer-reviewed journal articles, an editorial, and international and national
      conference papers. Metrics are sourced from
      <a href="{{ sm.profile_url }}" target="_blank" rel="noopener">Google Scholar<span class="sr-only"> (external)</span></a> and refreshed weekly.
      Scholar reports {{ sm.works }} indexed works; the {{ site.data.publications | size }} records below
      are the curated list — Scholar also indexes preprints, duplicate venue entries, and items outside
      this record.</p>
  </header>

  <div class="statgrid" role="group" aria-label="Publication metrics">
    <div id="statTiles" style="display:contents"></div>
    <div class="stat wide">
      <div class="qchart" id="qChart"></div>
    </div>
    <div class="stat wide">
      <div class="yearchart" id="yearChart"></div>
    </div>
    {%- if sm.citations_per_year %}
    <div class="stat wide">
      <div class="yearchart static" id="citeChart"></div>
    </div>
    {%- endif %}
  </div>
  <p class="statnote" id="pubBreakdown"></p>
</div>

<div class="filters">
  <div class="shell rows">
    <fieldset class="seg" aria-label="Filter by publication type" id="typeSeg">
      <button type="button" data-type="all" aria-pressed="true">All</button>
      <button type="button" data-type="journal" aria-pressed="false">Journal</button>
      <button type="button" data-type="editorial" aria-pressed="false">Editorial</button>
      <button type="button" data-type="confint" aria-pressed="false">Conf. (Intl.)</button>
      <button type="button" data-type="confnat" aria-pressed="false">Conf. (Natl.)</button>
    </fieldset>
    <div class="selects">
      <label class="selectwrap">Year
        <select id="yearSel"><option value="all">All</option></select>
      </label>
      <label class="selectwrap">Quartile
        <select id="qSel">
          <option value="all">All</option>
          <option value="Q1">Q1</option><option value="Q2">Q2</option><option value="Q3">Q3</option>
        </select>
      </label>
    </div>
    <div class="meta">
      <span id="pubCount" aria-live="polite"></span>
      <button class="btn btn-quiet" id="resetBtn" type="button" disabled>Reset</button>
    </div>
  </div>
</div>

<div class="shell">
  <div class="cvlayout">
    <div>
      {%- comment -%}
        The list is rendered here, from _data/publications.yml, and not by the script
        below: without JavaScript the page used to be a set of empty containers, and a
        publication record that only exists once a script runs is not a record. The
        script's remaining job is filtering — it hides list items, it never builds them.
        data-type/-year/-q are what it filters on.

        The GoatCounter event key mirrors pubKey() in the script it replaced: PDF
        basename, else the bare DOI, else year + slug.
      {%- endcomment -%}
      {%- assign gdefs = "journal;Journal articles;book;Journal articles|editorial;Editorial;pen;Editorial|confint;Conference papers (international);globe;Conf. (international)|confnat;Conference papers (national, in Turkish);flag;Conf. (national)" | split: "|" -%}
      <div id="pubGroups">
        {%- for gdef in gdefs -%}
        {%- assign g = gdef | split: ";" -%}
        {%- assign items = site.data.publications | where: "type", g[0] -%}
        {%- if items.size > 0 -%}
        <div class="pubgroup" data-group="{{ g[0] }}">
          <h2 class="sec" id="pub-{{ g[0] }}"><svg class="hicon" aria-hidden="true"><use href="#i-{{ g[2] }}"/></svg>{{ g[1] }}<span class="count tnum">{{ items.size }}</span></h2>
          <ol class="publist">
            {%- for p in items -%}
            {%- if p.pdf -%}{%- assign pubkey = p.pdf | split: "/" | last | split: ".pdf" | first -%}
            {%- elsif p.doi -%}{%- assign pubkey = p.doi | remove_first: "https://doi.org/" | remove_first: "http://doi.org/" | remove_first: "https://dx.doi.org/" -%}
            {%- else -%}{%- assign pubkey = p.year | append: "-" | append: p.title | slugify | truncate: 40, "" -%}{%- endif -%}
            {%- if p.doi -%}{%- assign href = p.doi -%}{%- assign kind = "doi" -%}
            {%- elsif p.pdf -%}{%- assign href = site.url | append: p.pdf -%}{%- assign kind = "pdf" -%}
            {%- else -%}{%- assign href = nil -%}{%- endif -%}
            <li class="pub" data-type="{{ p.type }}" data-year="{{ p.year }}"{% if p.q %} data-q="{{ p.q }}"{% endif %}>
              <span class="year tnum" aria-hidden="true">{{ p.year }}</span>
              <div>
                {%- comment -%} The heading points at the same destination as the DOI or PDF
                  button and reports the same event: the question is which paper was opened,
                  not which of the two controls did it. {%- endcomment -%}
                <p class="t">{% if href %}<a data-goatcounter-click="{{ kind }}/{{ pubkey }}" data-goatcounter-title="{{ p.title | escape }}" href="{{ href }}" target="_blank" rel="noopener">{{ p.title }}<span class="sr-only"> (external)</span></a>{% else %}{{ p.title }}{% endif %}</p>
                {%- comment -%} Author lists carry neutral **…** emphasis in the data file;
                  odd split segments are the emphasised ones. {%- endcomment -%}
                <p class="authors">{% assign chunks = p.authors | split: "**" %}{% for chunk in chunks %}{% assign odd = forloop.index0 | modulo: 2 %}{% if odd == 1 %}<b>{{ chunk }}</b>{% else %}{{ chunk }}{% endif %}{% endfor %}</p>
                <p class="venue"><i>{{ p.venue }}</i>{% if p.detail %}, {{ p.detail }}{% endif %} <span class="sr-only">({{ p.year }})</span></p>
                <div class="row">
                  {%- if p.q %}<span class="tag-q {{ p.q | downcase }}" title="Journal quartile in publication year">{{ p.q }}</span>{% endif -%}
                  {%- if p.scie %}<span class="tag-scie" title="Indexed in Science Citation Index Expanded">SCIE</span>{% endif -%}
                  {%- if p.award %}<span class="tag tag-award">{{ p.award }}</span>{% endif -%}
                  {%- if p.mostCited %}<span class="tag tag-award">Most cited</span>{% endif -%}
                  {%- if p.doi %}<a class="publink ext" data-goatcounter-click="doi/{{ pubkey }}" data-goatcounter-title="{{ p.title | escape }}" href="{{ p.doi }}" target="_blank" rel="noopener"><i class="ai ai-doi" aria-hidden="true"></i> DOI<span class="sr-only"> (external)</span></a>{% endif -%}
                  {%- if p.pdf %}<a class="publink ext" data-goatcounter-click="pdf/{{ pubkey }}" data-goatcounter-title="{{ p.title | escape }}" href="{{ site.url }}{{ p.pdf }}" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-file"/></svg> PDF<span class="sr-only"> (external)</span></a>{% endif -%}
                  {%- if p.slides %}<a class="publink ext" data-goatcounter-click="slides/{{ pubkey }}" data-goatcounter-title="{{ p.title | escape }}" href="{{ p.slides }}" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-slides"/></svg> Slides<span class="sr-only"> (external)</span></a>{% endif -%}
                  {%- if p.poster %}<a class="publink ext" data-goatcounter-click="poster/{{ pubkey }}" data-goatcounter-title="{{ p.title | escape }}" href="{{ p.poster }}" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-image"/></svg> Poster<span class="sr-only"> (external)</span></a>{% endif -%}
                </div>
              </div>
            </li>
            {%- endfor -%}
          </ol>
        </div>
        {%- endif -%}
        {%- endfor -%}
      </div>
      <div class="emptystate" id="pubEmpty" hidden>
        <p><strong>No publications match these filters.</strong><br>
          For example, there are no national conference papers ranked Q1 — quartiles apply to journals only.</p>
        <button class="btn btn-quiet" type="button" onclick="resetFilters()">Clear all filters</button>
      </div>
    </div>

    <nav class="cvtoc" id="pubToc" aria-label="Publication sections">
      <div class="toctitle">On this page</div>
      <ul>
        {%- for gdef in gdefs -%}
        {%- assign g = gdef | split: ";" -%}
        {%- assign items = site.data.publications | where: "type", g[0] -%}
        {%- if items.size > 0 %}<li id="toc-{{ g[0] }}"><a href="#pub-{{ g[0] }}">{{ g[3] }}</a></li>{% endif -%}
        {%- endfor -%}
      </ul>
    </nav>
  </div>
</div>

<script>
/* Publication data — sourced from _data/publications.yml, injected via jsonify.
   The list above is rendered from the same file by Liquid; this copy exists only
   for the counts and the two charts, which need the whole set regardless of what
   the current filter shows. */
var PUBS = {{ site.data.publications | jsonify }};

(function(){
  var $ = function(s){return document.querySelector(s);};
  var $$ = function(s){return Array.prototype.slice.call(document.querySelectorAll(s));};

  var state = {type:"all", year:"all", q:"all"};
  var n = function(t){return PUBS.filter(function(p){return p.type === t;}).length;};
  var nq = function(q){return PUBS.filter(function(p){return p.type === "journal" && p.q === q;}).length;};

  var tiles = [
    ["link", "{{ sm.citations_display }}", "Citations"],
    ["target", "{{ sm.h_index }}", "h-index"],
    ["file", PUBS.length, "Publications listed"],
    ["book", n("journal"), "Journal articles"],
    ["pen", n("editorial"), "Editorial"],
    ["globe", n("confint"), "Conf. papers (intl.)"],
    ["flag", n("confnat"), "Conf. papers (natl.)"]
  ];
  $("#statTiles").innerHTML = tiles.map(function(t){
    return '<div class="stat"><svg class="ic" aria-hidden="true"><use href="#i-' + t[0] +
    '"/></svg><b>' + t[1] + '</b><span>' + t[2] + '</span></div>';}).join("");
  $("#pubBreakdown").innerHTML =
    "Journal quartiles reflect the journal's rank in the publication year. " +
    "Citations, h-index, and the per-year citation counts: Google Scholar, updated {{ sm.updated_utc | date: '%b %-d, %Y' }} — refreshed weekly; the current year is still accruing. " +
    "Select a publication-year bar or a quartile below to filter the list.";

  /* Quartile distribution — clickable rows that drive the quartile filter. */
  var qCounts = {Q1: nq("Q1"), Q2: nq("Q2"), Q3: nq("Q3")};
  (function(){
    var qmax = Math.max(qCounts.Q1, qCounts.Q2, qCounts.Q3) || 1;
    var rows = ["Q1", "Q2", "Q3"].map(function(q){
      var c = qCounts[q];
      var w = c ? Math.max(6, Math.round(c / qmax * 100)) : 0;
      return '<button type="button" class="qrow" data-q="' + q + '" aria-pressed="false" ' +
        'aria-label="' + q + ' journal articles: ' + c + '. Filter to ' + q + '.">' +
        '<span class="ql">' + q + '</span>' +
        '<span class="qtrack"><span class="qbar ' + q.toLowerCase() + '" style="width:' + w + '%"></span></span>' +
        '<span class="qn">' + c + '</span></button>';
    }).join("");
    $("#qChart").innerHTML = rows + '<div class="cap" id="qCap">Journal articles by quartile</div>';
  })();

  /* Publications per year — clickable bars that drive the year filter. */
  var yearCounts = {}, yMeta = {};
  (function(){
    var years = PUBS.map(function(p){return p.year;});
    var y0 = Math.min.apply(null, years), y1 = Math.max.apply(null, years), y;
    for (y = y0; y <= y1; y++) yearCounts[y] = 0;
    years.forEach(function(yy){yearCounts[yy]++;});
    yMeta.y0 = y0; yMeta.y1 = y1;
    yMeta.max = Math.max.apply(null, Object.keys(yearCounts).map(function(k){return yearCounts[k];}));
    yMeta.cum = [];
    var run = 0;
    for (y = y0; y <= y1; y++){ run += yearCounts[y]; yMeta.cum.push(run); }
  })();

  /* Shared bar geometry for both per-year charts. o.pick marks the bars as filter
     controls; without it they are plain marks with a hover title only. o.title overrides
     the tooltip text, and o.sparse labels only every other bar (plus the last) so wide
     running totals do not collide. */
  function barsSVG(W, y0, y1, valueOf, max, o){
    var nb = y1 - y0 + 1, y;
    var LT = 12, plotH = 34, base = LT + plotH, H = base + 16;
    var pitch = W / nb, gap = Math.max(4, Math.min(18, pitch * 0.3)), bw = pitch - gap;
    var body = '<line class="axline" x1="0" y1="' + base + '" x2="' + W + '" y2="' + base + '"/>';
    for (y = y0; y <= y1; y++){
      var c = valueOf(y), i = y - y0, edge = (i % 2 === 0 || y === y1);
      var h = c ? Math.max(3, Math.round(c / max * plotH)) : 1.5;
      var cx = i * pitch + pitch / 2, x = (cx - bw / 2).toFixed(1), top = base - h;
      var lab = y + ": " + c + " " + o.noun + (c === 1 ? "" : "s");
      var hit = o.pick
        ? ' data-year="' + y + '" tabindex="0" role="button" aria-pressed="false" aria-label="' +
          lab + '. Filter to this year."'
        : "";
      var hi = c === max;
      body += '<rect class="bar' + (hi ? " hi" : "") + '"' + hit + ' x="' + x +
        '" y="' + top + '" width="' + bw.toFixed(1) + '" height="' + h + '"><title>' +
        (o.title ? o.title(y, c) : lab) + '</title></rect>';
      if (!o.sparse || edge){
        body += '<text class="blab' + (hi ? " hi" : "") + '" x="' + cx.toFixed(1) +
          '" y="' + (top - 3) + '" text-anchor="middle">' + c.toLocaleString("en-US") + '</text>';
      }
      if (edge){
        body += '<line class="axtick" x1="' + cx.toFixed(1) + '" y1="' + base +
          '" x2="' + cx.toFixed(1) + '" y2="' + (base + 3) + '"/>';
        body += '<text class="axyr" x="' + cx.toFixed(1) + '" y="' + (H - 3) +
          '" text-anchor="middle">' + y + '</text>';
      }
    }
    return '<svg width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + " " + H +
      '" role="' + (o.pick ? "group" : "img") + '" aria-label="' + o.aria + '">' + body + '</svg>';
  }

  function fmt(v){ return v.toLocaleString("en-US"); }
  /* Per-year / cumulative switch shared by both charts. */
  function segHTML(label, cum){
    return '<div class="chartseg" role="group" aria-label="' + label + '">' +
      '<button type="button" data-mode="year" aria-pressed="' + String(!cum) + '">Per year</button>' +
      '<button type="button" data-mode="cum" aria-pressed="' + String(cum) + '">Cumulative</button>' +
      '</div>';
  }

  /* Draw (or redraw) the year chart to fill the given pixel width. Only the per-year bars
     drive the filter — a cumulative bar spans every year up to it, so there is no single
     year to select. */
  var pubMode = "year";
  function drawYearChart(W){
    var cum = pubMode === "cum", total = yMeta.cum[yMeta.cum.length - 1];
    var svg = cum
      ? barsSVG(W, yMeta.y0, yMeta.y1, function(y){return yMeta.cum[y - yMeta.y0];}, total,
          {pick:false, noun:"publication", sparse:true,
           title:function(y, c){return "Through " + y + ": " + c + " publications";},
           aria:"Cumulative publications through each year, " + yMeta.y0 + " to " + yMeta.y1 +
                ", ending at " + total + "."})
      : barsSVG(W, yMeta.y0, yMeta.y1, function(y){return yearCounts[y];}, yMeta.max,
          {pick:true, noun:"publication",
           aria:"Publications per year, " + yMeta.y0 + " to " + yMeta.y1 +
                ". Select a bar to filter."});
    /* Kept so paintCharts can restore it when the year filter is cleared. */
    yMeta.capHTML = "Publications" +
      (cum ? ' <span class="capnote">· ' + total + ' total</span>' : "");
    $("#yearChart").classList.toggle("static", cum);
    $("#yearChart").innerHTML = svg +
      '<div class="capline"><div class="cap" id="yearCap">' + yMeta.capHTML + '</div>' +
      segHTML("Publication chart scale", cum) + '</div>';
  }
  var lastYW = Math.round($("#yearChart").clientWidth) || 480;
  drawYearChart(lastYW);

  /* Citations per year — Google Scholar's own profile histogram, verbatim. It is a
     sliding window and its last year is still accruing, so the bars are read-only:
     the year filter above works on publication year, which is a different quantity. */
  var CITES = {{ sm.citations_per_year | jsonify }} || [];
  var citeHost = $("#citeChart"), lastCW = 0, cMeta = {};
  (function(){
    if (!citeHost || !CITES.length) return;
    var i, sum = 0;
    cMeta.y0 = CITES[0].year;
    cMeta.y1 = CITES[CITES.length - 1].year;
    cMeta.byYear = {};
    for (i = 0; i < CITES.length; i++){
      cMeta.byYear[CITES[i].year] = CITES[i].citations;
      sum += CITES[i].citations;
    }
    cMeta.max = Math.max.apply(null, CITES.map(function(d){return d.citations;})) || 1;
    /* Scholar's histogram is a sliding window, so it can start above zero. The running
       total is offset by the citations earned before the window, which is what the
       profile total minus the window sum leaves. If the two disagree the other way, the
       offset is dropped and the line shows the window's own running total. */
    var offset = {{ sm.citations }} - sum;
    cMeta.pre = offset > 0 ? offset : 0;
    cMeta.cum = [];
    var run = cMeta.pre;
    for (i = 0; i < CITES.length; i++){ run += CITES[i].citations; cMeta.cum.push(run); }
  })();
  var citeMode = "year";
  function drawCiteChart(W){
    var cum = citeMode === "cum", total = cMeta.cum[cMeta.cum.length - 1];
    var svg = cum
      ? barsSVG(W, cMeta.y0, cMeta.y1, function(y){return cMeta.cum[y - cMeta.y0];}, total,
          {pick:false, noun:"citation", sparse:true,
           title:function(y, c){return "Through " + y + ": " + fmt(c) + " citations";},
           aria:"Cumulative citations through each year, " + cMeta.y0 + " to " + cMeta.y1 +
                ", ending at " + fmt(total) + "."})
      : barsSVG(W, cMeta.y0, cMeta.y1, function(y){return cMeta.byYear[y] || 0;}, cMeta.max,
          {pick:false, noun:"citation",
           title:function(y, c){return y + ": " + c + " citations · " +
             fmt(cMeta.cum[y - cMeta.y0]) + " cumulative";},
           aria:"Citations per year from Google Scholar, " + cMeta.y0 + " to " + cMeta.y1 + "."});
    citeHost.innerHTML = svg +
      '<div class="capline"><div class="cap">Citations' +
      (cum ? ' <span class="capnote">· ' + fmt(total) + ' total</span>' : "") +
      '</div>' + segHTML("Citation chart scale", cum) + '</div>';
  }
  if (citeHost && CITES.length){
    lastCW = Math.round(citeHost.clientWidth) || 480;
    drawCiteChart(lastCW);
    citeHost.addEventListener("click", function(e){
      var b = e.target.closest(".chartseg button");
      if (!b || b.dataset.mode === citeMode) return;
      citeMode = b.dataset.mode;
      drawCiteChart(lastCW);
      citeHost.querySelector('.chartseg button[data-mode="' + citeMode + '"]').focus();
    });
  }

  var yearSel = $("#yearSel"), qSel = $("#qSel");
  var uniqueYears = PUBS.map(function(p){return p.year;}).filter(function(v,i,a){return a.indexOf(v)===i;}).sort(function(a,b){return b - a;});
  uniqueYears.forEach(function(yy){
    var o = document.createElement("option");
    o.value = yy; o.textContent = yy; yearSel.appendChild(o);
  });

  function match(p){
    if (state.type !== "all" && p.type !== state.type) return false;
    if (state.year !== "all" && p.year !== Number(state.year)) return false;
    if (state.q !== "all" && p.q !== state.q) return false;
    return true;
  }
  /* The list itself is rendered by Liquid, above. Filtering only toggles what is
     already in the document: an entry is hidden, never destroyed and rebuilt, so
     the outbound-click bindings survive and the record stays in the markup. */
  function render(){
    var shown = 0, groups = 0;
    $$("#pubGroups .pubgroup").forEach(function(g){
      var count = 0;
      $$('#pubGroups .pubgroup[data-group="' + g.dataset.group + '"] li.pub').forEach(function(li){
        var on = match({type: li.dataset.type, year: Number(li.dataset.year), q: li.dataset.q || null});
        li.hidden = !on;
        if (on) count += 1;
      });
      g.hidden = count === 0;
      g.querySelector(".count").textContent = count;
      shown += count;
      if (count) groups += 1;
      /* The table of contents follows the sections it points at, and disappears
         once a filter leaves a single group — a one-entry list navigates nothing. */
      var tocItem = document.getElementById("toc-" + g.dataset.group);
      if (tocItem) tocItem.hidden = count === 0;
    });
    $("#pubToc").hidden = groups < 2;
    if (window.initTocHighlight) window.initTocHighlight();
    $("#pubEmpty").hidden = shown !== 0;
    $("#pubCount").textContent = "Showing " + shown + " of " + PUBS.length;
    var isDefault = state.type === "all" && state.year === "all" && state.q === "all";
    $("#resetBtn").disabled = isDefault;
  }
  /* Repaint every control (selects, segment, charts) from the current state, then render. */
  function paintCharts(){
    /* Cumulative bars carry no single year, so the selection highlight and the
       year caption only apply in per-year mode. */
    var sel = pubMode === "year" && state.year !== "all";
    var svg = $("#yearChart svg");
    if (svg) svg.classList.toggle("hasSel", sel);
    $$("#yearChart .bar").forEach(function(b){
      var on = sel && b.dataset.year === String(state.year);
      b.classList.toggle("sel", on);
      b.setAttribute("aria-pressed", String(on));
    });
    var yCap = $("#yearCap");
    if (yCap){
      if (sel){
        var yc = yearCounts[state.year] || 0;
        yCap.textContent = state.year + " · " + yc + " publication" + (yc === 1 ? "" : "s");
      } else yCap.innerHTML = yMeta.capHTML;
    }
    var qc = $("#qChart");
    if (qc) qc.classList.toggle("hasSel", state.q !== "all");
    $$("#qChart .qrow").forEach(function(r){
      var on = state.q !== "all" && r.dataset.q === state.q;
      r.classList.toggle("sel", on);
      r.setAttribute("aria-pressed", String(on));
    });
    var qCap = $("#qCap");
    if (qCap){
      if (state.q !== "all"){
        var qn = qCounts[state.q] || 0;
        qCap.textContent = state.q + " · " + qn + " journal article" + (qn === 1 ? "" : "s");
      } else qCap.textContent = "Journal articles by quartile";
    }
  }
  function sync(){
    yearSel.value = state.year;
    qSel.value = state.q;
    $$("#typeSeg button").forEach(function(x){x.setAttribute("aria-pressed", String(x.dataset.type === state.type));});
    paintCharts();
    render();
  }

  $$("#typeSeg button").forEach(function(b){b.addEventListener("click", function(){
    state.type = b.dataset.type; sync();
  });});
  yearSel.addEventListener("change", function(){ state.year = yearSel.value; sync(); });
  qSel.addEventListener("change", function(){ state.q = qSel.value; sync(); });

  function pickYear(y){ state.year = (String(state.year) === String(y)) ? "all" : String(y); sync(); }
  $("#yearChart").addEventListener("click", function(e){
    var s = e.target.closest(".chartseg button");
    if (s){
      if (s.dataset.mode === pubMode) return;
      pubMode = s.dataset.mode;
      drawYearChart(lastYW);
      paintCharts();
      $('#yearChart .chartseg button[data-mode="' + pubMode + '"]').focus();
      return;
    }
    var b = e.target.closest(".bar");
    if (b && b.dataset.year) pickYear(b.dataset.year);
  });
  $("#yearChart").addEventListener("keydown", function(e){
    if (e.key !== "Enter" && e.key !== " ") return;
    var b = e.target.closest(".bar");
    if (!b || !b.dataset.year) return;
    e.preventDefault(); pickYear(b.dataset.year);
  });
  $("#qChart").addEventListener("click", function(e){
    var r = e.target.closest(".qrow"); if (!r) return;
    state.q = (state.q === r.dataset.q) ? "all" : r.dataset.q; sync();
  });

  window.resetFilters = function(){
    state.type = "all"; state.year = "all"; state.q = "all"; sync();
  };
  $("#resetBtn").addEventListener("click", window.resetFilters);

  if (window.ResizeObserver){
    var ro = new ResizeObserver(function(){
      var w = Math.round($("#yearChart").clientWidth);
      if (w && w !== lastYW){ lastYW = w; drawYearChart(w); paintCharts(); }
    });
    ro.observe($("#yearChart"));
    if (citeHost && CITES.length){
      var cro = new ResizeObserver(function(){
        var w = Math.round(citeHost.clientWidth);
        if (w && w !== lastCW){ lastCW = w; drawCiteChart(w); }
      });
      cro.observe(citeHost);
    }
  }
  sync();
})();
</script>
