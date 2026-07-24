---
layout: academic
title: "Writing"
description: "Notes, announcements, and longer pieces on operations research, network optimization, and machine learning for wireless, underwater, and aerial networks."
permalink: /writing/
---

<div class="shell">
  <header class="pagehead">
    <h1 id="writing-h1">Writing</h1>
    <p class="lede">Notes, announcements, and longer pieces — shared first on LinkedIn, kept here for the record.</p>
  </header>

  {%- if site.posts.size > 0 -%}
  <ul class="post-list">
    {%- for post in site.posts -%}
    {%- assign words = post.content | number_of_words -%}
    {%- assign minutes = words | divided_by: 200 | plus: 1 -%}
    <li class="post-card">
      <a class="post-card-link" href="{{ post.url | relative_url }}">
        {%- if post.image -%}
        <div class="post-card-cover"><img src="{{ post.image | relative_url }}" alt="" loading="lazy"></div>
        {%- endif -%}
        <div class="post-card-body">
          <div class="post-card-meta">
            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
            <span class="dot" aria-hidden="true">·</span>
            <span>{{ minutes }} min read</span>
          </div>
          <h2 class="post-card-title">{{ post.title }}</h2>
          <p class="post-card-excerpt">{{ post.excerpt | strip_html | strip_newlines | truncatewords: 34 }}</p>
          {%- if post.tags and post.tags.size > 0 -%}
          <ul class="chiprow">
            {%- for tag in post.tags -%}<li class="chip">{{ tag }}</li>{%- endfor -%}
          </ul>
          {%- endif -%}
        </div>
      </a>
    </li>
    {%- endfor -%}
  </ul>
  {%- else -%}
  <p class="lede" style="margin-top:2rem;">No posts yet — check back soon.</p>
  {%- endif -%}
</div>
