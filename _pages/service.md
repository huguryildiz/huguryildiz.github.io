---
layout: academic
title: "Service"
description: "Professional service of Hüseyin Uğur Yıldız — technical program committees, chairing, peer review, memberships, institutional service, and invited talks."
permalink: /service/
---

<div class="shell">
  <header class="pagehead"><h1 id="service-h1">Service</h1></header>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-clipboard"/></svg>Technical program committee service</h2>
  <ul class="dotlist">
    {% for t in site.data.cv.service.tpc %}<li>{{ t | replace: '&', '&amp;' }}</li>
    {% endfor %}</ul>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-users"/></svg>Conference chair &amp; moderation roles</h2>
  <ul class="dotlist">
    {% for c in site.data.cv.service.chairing %}<li><i>{{ c.session }}</i>, {{ c.venue }}</li>
    {% endfor %}</ul>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-check"/></svg>Peer-review service</h2>
  <ul class="dotlist collist">
    {% for r in site.data.cv.service.reviewing %}<li>{{ r }}</li>
    {% endfor %}</ul>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-badge"/></svg>Professional memberships</h2>
  <ul class="dotlist">
    {% for m in site.data.cv.service.memberships %}<li>{{ m.name }} ({{ m.period }})</li>
    {% endfor %}</ul>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-landmark"/></svg>Academic and institutional service</h2>
  <ul class="dotlist">
    {% for i in site.data.cv.service.institutional %}<li>{{ i.role }}, {{ i.org }} ({{ i.period }})</li>
    {% endfor %}</ul>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-mic"/></svg>Invited talks &amp; research seminars</h2>
  {% for t in site.data.cv.talks %}
  <div class="cvrow">
    <div class="when tnum">{{ t.date_web }}</div>
    <div class="what">
      <div class="t">{{ t.title }}</div>
      <div class="d">{{ t.venue }}{% if t.host %} — host: {{ t.host }}{% endif %}</div>
      {% if t.slides %}<div class="links"><a class="ext" href="{{ t.slides }}" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-slides"/></svg> Slides</a></div>{% endif %}
    </div>
  </div>
  {% endfor %}
</div>
