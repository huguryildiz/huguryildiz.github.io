---
layout: academic
title: "Site Reach"
description: "An aggregated public report of page views and geographic reach for huguryildiz.com."
permalink: /stats/
---

{% assign stats = site.data.site_stats %}
{% if stats.pages %}{% assign pages = stats.pages | sort: "count" | reverse %}{% else %}{% assign pages = "" | split: "," %}{% endif %}
{% if stats.countries %}{% assign countries = stats.countries | sort: "count" | reverse %}{% else %}{% assign countries = "" | split: "," %}{% endif %}
{% if stats.referrers %}{% assign referrers = stats.referrers | sort: "count" | reverse %}{% else %}{% assign referrers = "" | split: "," %}{% endif %}

<article class="shell reach-report">
  <header class="pagehead reach-head">
    <p class="reach-kicker">Public analytics report</p>
    <h1>Site Reach</h1>
    <p class="lede">The figures published here come from GoatCounter and are refreshed daily when the data pipeline is available. This report presents aggregated page-view activity—not individual visitors—and reflects the measurement coverage and limitations stated below.</p>

    <dl class="reach-meta" aria-label="Report metadata">
      <div><dt>Last updated</dt><dd>{% if stats.updated %}{{ stats.updated | date: "%d %b %Y, %H:%M UTC" }}{% else %}Awaiting refresh{% endif %}</dd></div>
      <div><dt>Coverage</dt><dd>{% if stats.range.start and stats.range.end %}{{ stats.range.start | date: "%d %b %Y" }}–{{ stats.range.end | date: "%d %b %Y" }}{% else %}Not available{% endif %}</dd></div>
      <div><dt>Source</dt><dd><a href="https://www.goatcounter.com/" target="_blank" rel="noopener">GoatCounter<span class="sr-only"> (opens in a new tab)</span></a></dd></div>
    </dl>
  </header>

  <dl class="reach-metrics" aria-label="Site reach summary">
    {% if stats.totals.pageviews != nil %}
    <div>
      <dt>Page views</dt>
      <dd>{{ stats.totals.pageviews }}</dd>
    </div>
    {% endif %}
    {% if countries and countries.size > 0 %}
    <div>
      <dt>Countries reached</dt>
      <dd>{{ countries.size }}</dd>
    </div>
    {% endif %}
    {% if stats.range.start %}
    <div>
      <dt>Tracked since</dt>
      <dd>{{ stats.range.start | date: "%b %Y" }}</dd>
    </div>
    {% endif %}
  </dl>

  <div class="reach-grid reach-grid-primary">
    <section class="reach-panel reach-traffic" aria-labelledby="traffic-title">
      <header class="reach-section-head">
        <div>
          <p class="reach-index">01 / Temporal coverage</p>
          <h2 id="traffic-title">Traffic over time</h2>
        </div>
        {% unless stats._seeded %}<span class="reach-unit">Weekly page views</span>{% endunless %}
      </header>

      {% if stats._seeded %}
      <div class="reach-empty" role="status">
        <svg aria-hidden="true" viewBox="0 0 72 32"><path d="M1 27h70M5 22l12-7 10 4 13-12 11 8 16-10"/></svg>
        <div>
          <h3>Trend awaiting a verified refresh</h3>
          <p>The stored daily series is placeholder data, so it is intentionally not plotted. Verified page, country, and referrer totals remain available in this report.</p>
        </div>
      </div>
      {% elsif stats.timeseries and stats.timeseries.size > 0 %}
      <div class="reach-chart" id="reachChart" aria-live="polite"></div>
      <ol class="sr-only" id="reachTrendData">
        {% for point in stats.timeseries %}<li data-date="{{ point.date | escape }}" data-views="{{ point.views }}">{{ point.date | escape }}: {{ point.views }} page views</li>{% endfor %}
      </ol>
      <noscript><p class="reach-note">The visual trend requires JavaScript. The report totals and ranked lists remain available.</p></noscript>
      {% else %}
      <div class="reach-empty" role="status"><div><h3>No verified trend available</h3><p>A chart will appear after the daily pipeline provides a valid time series.</p></div></div>
      {% endif %}
    </section>

    <section class="reach-panel reach-pages" aria-labelledby="pages-title">
      <header class="reach-section-head">
        <div>
          <p class="reach-index">02 / Readership</p>
          <h2 id="pages-title">Most viewed pages</h2>
        </div>
        <span class="reach-unit">Top five</span>
      </header>

      {% if pages and pages.size > 0 %}
      <ol class="reach-bars" aria-label="Most viewed content pages">
        {% assign shown_pages = 0 %}
        {% for item in pages %}
          {% unless item.path == "/404.html" or item.path == "/stats" or item.path == "/stats/" %}
            {% if shown_pages < 5 %}
              {% assign page_label = item.path %}
              {% assign page_href = item.path %}
              {% case item.path %}
                {% when "/" %}{% assign page_label = "Home" %}{% assign page_href = "/" %}
                {% when "/cv" %}{% assign page_label = "Curriculum Vitae" %}{% assign page_href = "/cv/" %}
                {% when "/publications" %}{% assign page_label = "Publications" %}{% assign page_href = "/publications/" %}
                {% when "/research" %}{% assign page_label = "Research" %}{% assign page_href = "/research/" %}
                {% when "/service" %}{% assign page_label = "Service" %}{% assign page_href = "/service/" %}
                {% when "/teaching" %}{% assign page_label = "Teaching" %}{% assign page_href = "/teaching/" %}
                {% when "/students" %}{% assign page_label = "Students" %}{% assign page_href = "/students/" %}
              {% endcase %}
              <li style="--reach-value:{{ item.count }};--reach-max:{{ pages.first.count }}">
                <span class="reach-rank" aria-hidden="true">0{{ shown_pages | plus: 1 }}</span>
                <a href="{{ page_href | relative_url }}">{{ page_label | escape }}</a>
                <span class="reach-bar" aria-hidden="true"><i></i></span>
                <strong>{{ item.count }}<span class="sr-only"> page views</span></strong>
              </li>
              {% assign shown_pages = shown_pages | plus: 1 %}
            {% endif %}
          {% endunless %}
        {% endfor %}
      </ol>
      {% else %}
      <div class="reach-empty" role="status"><div><h3>No page ranking available</h3><p>Content rankings will appear after the next successful data refresh.</p></div></div>
      {% endif %}
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

      {% if countries and countries.size > 0 %}
      <div class="reach-map-layout">
        <div class="worldmap" id="worldMap" data-map-url="{{ '/assets/maps/world.svg' | relative_url }}">
          <p class="reach-map-fallback">The interactive map is loading. The ranked country list remains available.</p>
        </div>
        <ol class="reach-bars reach-country-list" aria-label="Countries with the most page views">
          {% for country in countries limit:5 %}
          <li style="--reach-value:{{ country.count }};--reach-max:{{ countries.first.count }}">
            <span class="reach-rank" aria-hidden="true">0{{ forloop.index }}</span>
            <span>{{ country.name | escape }}</span>
            <span class="reach-bar" aria-hidden="true"><i></i></span>
            <strong>{{ country.count }}<span class="sr-only"> page views</span></strong>
          </li>
          {% endfor %}
        </ol>
      </div>
      <ul class="sr-only" id="reachMapData">
        {% for country in countries %}<li data-code="{{ country.code | escape }}" data-count="{{ country.count }}">{{ country.name | escape }}</li>{% endfor %}
      </ul>
      <p class="reach-note worldmap-credit" id="mapCredit" hidden>Map geometry: <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noopener">@svg-maps/world<span class="sr-only"> (opens in a new tab)</span></a>, CC BY 4.0. Shading uses a logarithmic scale; country names and exact counts are available by keyboard focus and in the ranked list.</p>
      {% else %}
      <div class="reach-empty" role="status"><div><h3>No geographic aggregate available</h3><p>The report does not currently contain country-level data.</p></div></div>
      {% endif %}
    </section>

    <section class="reach-panel reach-discovery" aria-labelledby="discovery-title">
      <header class="reach-section-head">
        <div>
          <p class="reach-index">04 / Discovery</p>
          <h2 id="discovery-title">Discovery sources</h2>
        </div>
      </header>

      {% if referrers and referrers.size > 0 %}
      <ol class="reach-bars" aria-label="Top referrer sources">
        {% for source in referrers limit:5 %}
        <li style="--reach-value:{{ source.count }};--reach-max:{{ referrers.first.count }}">
          <span class="reach-rank" aria-hidden="true">0{{ forloop.index }}</span>
          <span>{{ source.name | escape }}</span>
          <span class="reach-bar" aria-hidden="true"><i></i></span>
          <strong>{{ source.count }}<span class="sr-only"> page views</span></strong>
        </li>
        {% endfor %}
      </ol>
      <p class="reach-note"><strong>Direct</strong> means that no referrer header was available—for example, after a typed URL, bookmark, or a link opened by an app that strips referral information. It is not a known acquisition source.</p>
      {% else %}
      <div class="reach-empty" role="status"><div><h3>No discovery data available</h3><p>Referrer aggregates will appear after a successful refresh.</p></div></div>
      {% endif %}
    </section>
  </div>

  <aside class="reach-method" aria-labelledby="method-title">
    <p class="reach-index">Method note</p>
    <h2 id="method-title">How to read this report</h2>
    <div>
      <p>Published counts are aggregated from GoatCounter over the single coverage period shown above. GoatCounter's basic API output used here does not provide separate unique visitors, sessions, bounce rate, or average session duration; none are inferred or substituted.</p>
      <p>Maintenance and measurement paths such as <code>/404.html</code> and <code>/stats/</code> are excluded from the public content ranking without altering the source data. Browser, operating-system, screen-size, language, and city breakdowns are intentionally omitted because they add little public scholarly context and can create unnecessary privacy detail.</p>
      {% if stats._seeded %}<p><strong>Data status:</strong> the stored trend and device breakdowns are seeded placeholders. They are not published as observations; only the stored page, country, and referrer totals are shown.</p>{% endif %}
      <p>This statement describes the source of the figures on this page only. It is not a site-wide claim about every analytics service loaded by huguryildiz.com.</p>
    </div>
  </aside>
</article>

<script>
(function(){
  'use strict';
  var ns = 'http://www.w3.org/2000/svg';
  var fmt = function(n){ return Number(n || 0).toLocaleString('en-US'); };

  function makeSvg(name, attrs, text){
    var node = document.createElementNS(ns, name);
    Object.keys(attrs || {}).forEach(function(key){ node.setAttribute(key, attrs[key]); });
    if (text != null) node.textContent = text;
    return node;
  }

  function renderTrend(){
    var host = document.getElementById('reachChart');
    var dataHost = document.getElementById('reachTrendData');
    if (!host || !dataHost) return;
    var daily = Array.prototype.map.call(dataHost.querySelectorAll('li'), function(item){
      return { date:item.dataset.date, views:Number(item.dataset.views) || 0 };
    }).filter(function(item){ return item.date; });
    if (!daily.length) return;

    var weeks = [];
    daily.forEach(function(item){
      var date = new Date(item.date + 'T00:00:00Z');
      var monday = new Date(date);
      monday.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
      var key = monday.toISOString().slice(0, 10);
      var last = weeks[weeks.length - 1];
      if (!last || last.date !== key) weeks.push({date:key, views:item.views});
      else last.views += item.views;
    });

    var W=720, H=260, left=48, right=14, top=16, bottom=42;
    var plotW=W-left-right, plotH=H-top-bottom;
    var max=Math.max.apply(null, weeks.map(function(item){ return item.views; })) || 1;
    var peak=weeks.reduce(function(best,item){ return item.views > best.views ? item : best; }, weeks[0]);
    var total=weeks.reduce(function(sum,item){ return sum + item.views; }, 0);
    var svg=makeSvg('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-labelledby':'reachChartTitle reachChartDesc'});
    svg.appendChild(makeSvg('title',{id:'reachChartTitle'},'Weekly page views'));
    svg.appendChild(makeSvg('desc',{id:'reachChartDesc'},'From '+weeks[0].date+' to '+weeks[weeks.length-1].date+', '+fmt(total)+' page views across '+weeks.length+' weeks. Peak week: '+peak.date+', '+fmt(peak.views)+' views.'));

    for(var yTick=0;yTick<=4;yTick++){
      var value=Math.round(max*(4-yTick)/4), y=top+(plotH*yTick/4);
      svg.appendChild(makeSvg('line',{class:'reach-chart-grid',x1:left,y1:y,x2:W-right,y2:y}));
      svg.appendChild(makeSvg('text',{class:'reach-chart-y',x:left-9,y:y+4,'text-anchor':'end'},fmt(value)));
    }
    var points=weeks.map(function(item,index){
      var x=left+(weeks.length>1 ? index/(weeks.length-1)*plotW : plotW/2);
      var y=top+plotH*(1-item.views/max);
      return [x,y];
    });
    var line=points.map(function(point,index){ return (index?'L':'M')+point[0].toFixed(1)+' '+point[1].toFixed(1); }).join(' ');
    var area=line+' L'+points[points.length-1][0].toFixed(1)+' '+(top+plotH)+' L'+points[0][0].toFixed(1)+' '+(top+plotH)+' Z';
    svg.appendChild(makeSvg('path',{class:'reach-chart-area',d:area}));
    svg.appendChild(makeSvg('path',{class:'reach-chart-line',d:line,'vector-effect':'non-scaling-stroke'}));

    var tickIndexes=[0,Math.round((weeks.length-1)/4),Math.round((weeks.length-1)/2),Math.round((weeks.length-1)*3/4),weeks.length-1]
      .filter(function(value,index,array){ return array.indexOf(value)===index; });
    tickIndexes.forEach(function(index){
      var date=new Date(weeks[index].date+'T00:00:00Z');
      svg.appendChild(makeSvg('text',{class:'reach-chart-x',x:points[index][0],y:H-13,'text-anchor':index===0?'start':(index===weeks.length-1?'end':'middle')},date.toLocaleDateString('en-US',{month:'short',day:'numeric'})));
    });
    host.replaceChildren(svg);
    var summary=document.createElement('p');
    summary.className='reach-chart-summary';
    summary.textContent=fmt(total)+' views across '+weeks.length+' weeks · Peak week of '+peak.date+': '+fmt(peak.views);
    host.appendChild(summary);
  }

  function renderMap(){
    var host=document.getElementById('worldMap');
    var dataHost=document.getElementById('reachMapData');
    if (!host || !dataHost || !window.fetch) return;
    var countries={};
    Array.prototype.forEach.call(dataHost.querySelectorAll('li'),function(item){
      var code=(item.dataset.code || '').toLowerCase();
      if (code) countries[code]={name:item.textContent.trim(),count:Number(item.dataset.count)||0};
    });
    var counts=Object.keys(countries).map(function(code){ return countries[code].count; });
    if (!counts.length) return;
    var max=Math.max.apply(null,counts);
    var bucket=function(value){ return Math.max(1,Math.min(5,Math.ceil(Math.log(value+1)/Math.log(max+1)*5))); };

    fetch(host.dataset.mapUrl).then(function(response){
      if (!response.ok) throw new Error('Map request failed: '+response.status);
      return response.text();
    }).then(function(source){
      var doc=new DOMParser().parseFromString(source,'image/svg+xml');
      if (doc.querySelector('parsererror')) throw new Error('Map SVG could not be parsed');
      var svg=document.importNode(doc.documentElement,true);
      svg.classList.add('worldmap-svg');
      svg.setAttribute('role','group');
      svg.setAttribute('aria-label','World map of page views by country. Use Tab to inspect countries with recorded views.');
      var tip=document.createElement('div');
      tip.className='worldmap-tip';
      tip.hidden=true;
      svg.querySelectorAll('path[data-code]').forEach(function(path){
        var country=countries[(path.getAttribute('data-code')||'').toLowerCase()];
        if (!country) return;
        path.classList.add('wm-b'+bucket(country.count),'wm-on');
        path.setAttribute('tabindex','0');
        path.setAttribute('role','img');
        path.setAttribute('aria-label',country.name+', '+fmt(country.count)+' page views');
        var show=function(event){
          tip.textContent=country.name+' · '+fmt(country.count)+' views';
          tip.hidden=false;
          var bounds=host.getBoundingClientRect(), target=path.getBoundingClientRect();
          var x=event && Number.isFinite(event.clientX) ? event.clientX-bounds.left : target.left-bounds.left+target.width/2;
          var y=event && Number.isFinite(event.clientY) ? event.clientY-bounds.top : target.top-bounds.top;
          tip.style.left=x+'px'; tip.style.top=y+'px';
        };
        path.addEventListener('mouseenter',show);
        path.addEventListener('mousemove',show);
        path.addEventListener('mouseleave',function(){ tip.hidden=true; });
        path.addEventListener('focus',show);
        path.addEventListener('blur',function(){ tip.hidden=true; });
      });
      host.replaceChildren(svg,tip);
      var credit=document.getElementById('mapCredit');
      if (credit) credit.hidden=false;
    }).catch(function(){
      var fallback=host.querySelector('.reach-map-fallback');
      if (fallback) fallback.textContent='The map could not be loaded. The ranked country list remains available.';
    });
  }

  renderTrend();
  renderMap();
})();
</script>
