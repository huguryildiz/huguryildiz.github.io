---
layout: academic
title: "CV – Hüseyin Uğur Yıldız"
description: "Curriculum vitae of Hüseyin Uğur Yıldız — appointments, education, theses, honors, technical toolbox, and professional development."
permalink: /cv/
---

<div class="shell">
  <header class="pagehead">
    <h1 id="cv-h1">Curriculum Vitae</h1>
    <div class="cvhead-actions">
      <a class="btn btn-primary" href="/files/Yildiz_HuseyinUgur_CV.pdf" target="_blank" rel="noopener"
         data-goatcounter-click="cv-pdf" data-goatcounter-title="CV (PDF), from the CV page">
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 2v8m0 0L5 7m3 3l3-3M3 13h10"/></svg>
        Download PDF<span class="sr-only"> (external)</span></a>
      <a class="btn btn-quiet" href="/publications/">Publication list</a>
    </div>
  </header>

  {% assign sm = site.data.scholar_metrics %}
  <div class="statgrid" role="group" aria-label="At a glance">
    <div class="stat"><svg class="ic" aria-hidden="true"><use href="#i-book"/></svg><b>40+</b><span>Publications</span></div>
    <div class="stat"><svg class="ic" aria-hidden="true"><use href="#i-link"/></svg><b>{{ sm.citations_display }}</b><span>Citations<small>Google Scholar · {{ sm.updated_utc | date: "%b %Y" }}</small></span></div>
    <div class="stat"><svg class="ic" aria-hidden="true"><use href="#i-target"/></svg><b>{{ sm.h_index }}</b><span>h-index<small>Google Scholar · {{ sm.updated_utc | date: "%b %Y" }}</small></span></div>
    <div class="stat"><svg class="ic" aria-hidden="true"><use href="#i-cap"/></svg><b>7</b><span>Graduate theses supervised</span></div>
    <div class="stat"><svg class="ic" aria-hidden="true"><use href="#i-users"/></svg><b>40+</b><span>Senior design teams</span></div>
  </div>

  <div class="cvlayout" style="margin-top:1rem;">
    <div>
      <h2 class="sec" id="cv-summary"><svg class="hicon" aria-hidden="true"><use href="#i-user"/></svg>Summary</h2>
      <p>{{ site.data.cv.summary_web }}</p>

      <h2 class="sec" id="cv-ids"><svg class="hicon" aria-hidden="true"><use href="#i-badge"/></svg>Persistent identifiers</h2>
      <ul class="profilelinks">
        <li><a href="https://orcid.org/0000-0002-1556-2634" target="_blank" rel="noopener">
          <i class="ai ai-orcid" aria-hidden="true"></i>
          ORCID <span class="tnum">0000-0002-1556-2634</span><span class="sr-only"> (external)</span></a></li>
        <li><a href="https://www.scopus.com/authid/detail.uri?authorId=56242674200" target="_blank" rel="noopener">
          <i class="ai ai-scopus" aria-hidden="true"></i>
          Scopus Author ID <span class="tnum">56242674200</span><span class="sr-only"> (external)</span></a></li>
        <li><a href="https://www.webofscience.com/wos/author/record/S-6587-2016" target="_blank" rel="noopener">
          <i class="ai ai-researcherid" aria-hidden="true"></i>
          ResearcherID <span class="tnum">S-6587-2016</span><span class="sr-only"> (external)</span></a></li>
        <li><a href="https://scholar.google.com/citations?user=nQwHS1gAAAAJ" target="_blank" rel="noopener">
          <i class="ai ai-google-scholar" aria-hidden="true"></i>
          Google Scholar <span class="tnum">nQwHS1gAAAAJ</span><span class="sr-only"> (external)</span></a></li>
      </ul>

      <h2 class="sec" id="cv-appointments"><svg class="hicon" aria-hidden="true"><use href="#i-briefcase"/></svg>Academic &amp; professional appointments</h2>
      {% for a in site.data.cv.appointments %}
      <div class="cvrow">
        <div class="when tnum">{{ a.years }}</div>
        <div class="what">
          <div class="t"><a class="instlink" href="{{ a.org_url }}" target="_blank" rel="noopener">{{ a.org }}<span class="sr-only"> (external)</span></a>, {{ a.location }}</div>
          {% if a.unit %}<div class="w">{{ a.unit }}</div>{% endif %}
          <div class="d">{% for r in a.roles %}{{ r.title }} ({{ r.period }}{% if r.note %}; {{ r.note }}{% endif %}){% unless forloop.last %} · {% endunless %}{% endfor %}</div>
          <ul class="dotlist">
            {% for b in a.bullets_web %}<li>{{ b }}</li>
            {% endfor %}</ul>
        </div>
      </div>
      {% endfor %}

      <h2 class="sec" id="cv-education"><svg class="hicon" aria-hidden="true"><use href="#i-cap"/></svg>Education</h2>
      {% for e in site.data.cv.education %}
      <div class="cvrow">
        <div class="when tnum">{{ e.years }}</div>
        <div class="what">
          <div class="t">{{ e.degree }}</div>
          <div class="w"><a class="instlink" href="{{ e.org_url }}" target="_blank" rel="noopener">{{ e.org }}<span class="sr-only"> (external)</span></a>, {{ e.location }}</div>
        </div>
      </div>
      {% endfor %}

      <h2 class="sec" id="cv-theses"><svg class="hicon" aria-hidden="true"><use href="#i-file"/></svg>Graduate theses</h2>
      {% for t in site.data.cv.theses_own %}
      <div class="cvrow">
        <div class="when tnum">{{ t.year }}</div>
        <div class="what">
          <div class="t">{{ t.kind }}</div>
          <div class="d"><i>{{ t.title }}</i> — advisor: {{ t.advisor }}{% if t.co_advisor %} · co-advisor: {{ t.co_advisor }}{% endif %}</div>
          <div class="links">
            <a class="ext" href="{{ t.pdf }}" target="_blank" rel="noopener" data-goatcounter-click="{{ t.pdf_goatcounter }}" data-goatcounter-title="{{ t.pdf_goatcounter_title }}"><svg class="licon" aria-hidden="true"><use href="#i-file"/></svg> PDF</a>
            <a class="ext" href="{{ t.yok_url }}" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-archive"/></svg> YÖK thesis record</a>
          </div>
        </div>
      </div>
      {% endfor %}

      <h2 class="sec" id="cv-honors"><svg class="hicon" aria-hidden="true"><use href="#i-award"/></svg>Honors &amp; recognition</h2>
      {% for h in site.data.cv.honors %}
      <div class="cvrow">
        <div class="when tnum">{{ h.year }}</div>
        <div class="what">
          <div class="t">{% if h.icon %}<i class="ai ai-{{ h.icon }}" aria-hidden="true" style="color:var(--accent);"></i>{% else %}<svg class="licon" aria-hidden="true" style="color:var(--accent);"><use href="#i-award"/></svg>{% endif %} {{ h.title }}</div>
          <div class="d">{{ h.detail_web }}{% if h.certificate_pdf %} <a href="{{ h.certificate_pdf | relative_url }}">Certificate (PDF)</a>{% endif %}</div>
        </div>
      </div>
      {% endfor %}

      <h2 class="sec" id="cv-toolbox"><svg class="hicon" aria-hidden="true"><use href="#i-tool"/></svg>Technical toolbox</h2>
      <div class="toolgroups">
        {% for g in site.data.cv.toolbox %}
        <div>
          <h3 class="sub">{{ g.group | replace: '&', '&amp;' }}</h3>
          <ul class="chiprow">
            {% for it in g.items %}<li class="chip"><img class="clogo" src="/assets/images/icons/{{ it.icon }}" alt="" aria-hidden="true">{{ it.name }}</li>
            {% endfor %}</ul>
        </div>
        {% endfor %}
      </div>

      <h2 class="sec" id="cv-development"><svg class="hicon" aria-hidden="true"><use href="#i-check"/></svg>Professional development</h2>
      {% for c in site.data.cv.certificates %}
      <div class="cvrow">
        <div class="when tnum">{{ c.year }}</div>
        <div class="what">
          <div class="t">{{ c.title }}</div>
          <div class="w">{{ c.org }}</div>
          <div class="links"><a class="ext" href="{{ c.url }}" target="_blank" rel="noopener"><i class="ai ai-coursera" aria-hidden="true"></i> Credential</a></div>
        </div>
      </div>
      {% endfor %}

      <h2 class="sec" id="cv-languages"><svg class="hicon" aria-hidden="true"><use href="#i-globe"/></svg>Languages</h2>
      <p>{% for l in site.data.cv.languages %}<b style="color:var(--head);">{{ l.name }}</b> — {{ l.level_web | replace: '&', '&amp;' }}{% unless forloop.last %} &nbsp;·&nbsp;
        {% endunless %}{% endfor %}</p>

      <h2 class="sec" id="cv-elsewhere"><svg class="hicon" aria-hidden="true"><use href="#i-link"/></svg>Elsewhere on this site</h2>
      <p style="font-size:.95rem;">The full publication list lives on <a href="/publications/">Publications</a>;
        teaching history on <a href="/teaching/">Teaching</a>; supervision on <a href="/students/">Students</a>;
        and committee, review, and editorial activity — together with invited talks and research
        seminars — on <a href="/service/">Service</a>.</p>
    </div>

    <nav class="cvtoc" aria-label="CV sections">
      <div class="toctitle">On this page</div>
      <ul>
        <li><a href="#cv-summary">Summary</a></li>
        <li><a href="#cv-ids">Identifiers</a></li>
        <li><a href="#cv-appointments">Appointments</a></li>
        <li><a href="#cv-education">Education</a></li>
        <li><a href="#cv-theses">Theses</a></li>
        <li><a href="#cv-honors">Honors</a></li>
        <li><a href="#cv-toolbox">Toolbox</a></li>
        <li><a href="#cv-development">Development</a></li>
        <li><a href="#cv-languages">Languages</a></li>
        <li><a href="#cv-elsewhere">Elsewhere</a></li>
      </ul>
    </nav>
  </div>
</div>
