---
layout: single
title: ""
permalink: /research/
author_profile: true
---

## Research Summary

My research focuses on routing, resource allocation, and energy-efficient design of networked systems, with an emphasis on wireless ad hoc networks and underwater acoustic sensor networks. I develop optimization-based models and increasingly combine them with reinforcement learning to address scalability and uncertainty.

More recently, I have been exploring hybrid classical–quantum network routing, investigating how physical constraints such as entanglement lifetime and network reliability influence routing and control decisions.

## Key Research Topics

### Operations Research and Mathematical Optimization for Networked Systems:

Development of linear, integer, and mixed-integer programming (MILP) models, including network flow–based formulations, for complex optimization problems arising in communication networks. Primary focus areas include network lifetime maximization, energy efficiency, resource allocation, energy–delay–reliability trade-offs, and resilience under physical, topological, and security constraints.

### Wireless Ad Hoc and Underwater Sensor Networks: 

Design and optimization of energy-efficient routing, topology control, and communication strategies for terrestrial wireless ad hoc networks and underwater acoustic sensor networks. Research topics span network lifetime and energy-efficiency analysis, k-connectivity–based reliability, multi-sink architectures, void regions, adversarial effects (e.g., eavesdropping and sinkhole attacks), and operation under harsh and resource-constrained environments.

### Hybrid Optimization and Learning-Based Network Control:

Integration of mathematical optimization frameworks with machine learning and reinforcement learning techniques to enable adaptive, data-driven, and scalable control of complex networked systems. Recent work explores hybrid optimization–learning methodologies for parameter prediction, dynamic decision-making, and emerging paradigms such as quantum network routing and hybrid classical–quantum architectures.

## Key Research Topics
<!-- =========================
     Key Research Topics (Option 1: Research Pillars)
     Drop this into a Minimal Mistakes page/post (Markdown) as raw HTML.
     Replace image paths + links as needed.
     ========================= -->

<section class="research-pillars">

  <header class="rp-header">
    <h2>Key Research Topics</h2>
  </header>

  <!-- Pillar 1 -->
  <article class="rp-card">
    <a class="rp-img" href="/research/optimization/">
      <img
        src="/images/research/network_flow_optimization.png"
        alt="Abstract visualization for operations research and optimization"
        loading="lazy"
      />
    </a>

    <div class="rp-content">
      <h3><a href="/research/optimization/">Operations Research and Mathematical Optimization for Networked Systems</a></h3>
      <p>
        Development of linear, integer, and mixed-integer programming (MILP) models—often
        network flow–based—for optimization problems in communication networks, with focus on
        network lifetime maximization, energy efficiency, resource allocation, energy–delay–reliability
        trade-offs, and resilience under physical, topological, and security constraints.
      </p>

      <ul class="rp-tags">
        <li>MILP</li><li>Network Flow</li><li>Lifetime</li><li>Energy</li><li>Resilience</li>
      </ul>
    </div>
  </article>

  <!-- Pillar 2 -->
  <article class="rp-card">
    <a class="rp-img" href="/research/wireless-underwater/">
      <img
        src="/images/research/wireless_ad_hoc_underwater_sensor_networks.png"
        alt="Abstract visualization for wireless ad hoc and underwater sensor networks"
        loading="lazy"
      />
    </a>

    <div class="rp-content">
      <h3><a href="/research/wireless-underwater/">Wireless Ad Hoc and Underwater Sensor Networks</a></h3>
      <p>
        Design and optimization of energy-efficient routing, topology control, and communication strategies
        for terrestrial wireless ad hoc networks and underwater acoustic sensor networks, spanning lifetime
        and energy-efficiency analysis, k-connectivity–based reliability, multi-sink architectures, void regions,
        adversarial effects, and operation under harsh and resource-constrained environments.
      </p>

      <ul class="rp-tags">
        <li>Routing</li><li>Topology</li><li>k-Connectivity</li><li>Multi-Sink</li><li>Security</li>
      </ul>
    </div>
  </article>

  <!-- Pillar 3 -->
  <article class="rp-card">
    <a class="rp-img" href="/research/hybrid-ai-control/">
      <img
        src="/images/research/hybrid_opt_rl_networks.png"
        alt="Abstract visualization for hybrid optimization and learning-based network control"
        loading="lazy"
      />
    </a>

    <div class="rp-content">
      <h3><a href="/research/hybrid-ai-control/">Hybrid Optimization and Learning-Based Network Control</a></h3>
      <p>
        Integration of mathematical optimization with machine learning and reinforcement learning for adaptive,
        data-driven, and scalable control of complex networked systems, including hybrid optimization–learning for
        parameter prediction, dynamic decision-making, and emerging paradigms such as quantum network routing and
        hybrid classical–quantum architectures.
      </p>

      <ul class="rp-tags">
        <li>ML/RL</li><li>Hybrid Control</li><li>Prediction</li><li>Dynamic Decisions</li><li>Quantum Routing</li>
      </ul>
    </div>
  </article>

</section>

<style>
  /* ===== Research Pillars (clean + responsive) ===== */
  .research-pillars{
    margin: 2rem 0;
  }
  .rp-header h2{
    margin: 0 0 1rem 0;
  }

  .rp-card{
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 1.25rem;
    align-items: center;
    padding: 1.1rem;
    margin: 1rem 0;
    border: 1px solid rgba(0,0,0,.12);
    border-radius: 16px;
    background: rgba(255,255,255,.02);
  }

  .rp-img{
    display:block;
    border-radius: 14px;
    overflow:hidden;
    line-height: 0;
  }
  .rp-img img{
    width: 100%;
    height: 220px;
    object-fit: cover;
    display:block;
    transform: scale(1);
    transition: transform .25s ease;
  }
  .rp-card:hover .rp-img img{
    transform: scale(1.03);
  }

  .rp-content h3{
    margin: 0 0 .5rem 0;
    font-size: 1.15rem;
    line-height: 1.25;
  }
  .rp-content p{
    margin: 0 0 .75rem 0;
    line-height: 1.55;
    opacity: .95;
  }

  .rp-tags{
    list-style: none;
    padding: 0;
    margin: 0;
    display:flex;
    flex-wrap: wrap;
    gap: .45rem;
  }
  .rp-tags li{
    font-size: .85rem;
    padding: .25rem .55rem;
    border-radius: 999px;
    border: 1px solid rgba(0,0,0,.15);
    opacity: .9;
  }

  /* Mobile */
  @media (max-width: 820px){
    .rp-card{
      grid-template-columns: 1fr;
    }
    .rp-img img{
      height: 200px;
    }
  }

  /* Dark mode friendliness (Minimal Mistakes dark skin) */
  @media (prefers-color-scheme: dark){
    .rp-card{
      border-color: rgba(255,255,255,.14);
      background: rgba(255,255,255,.03);
    }
    .rp-tags li{
      border-color: rgba(255,255,255,.18);
    }
  }
</style>

## Tutorials & Research Code

Selected tutorials and reference implementations accompanying my research on
network optimization and wireless sensor networks.

<!-- GitHub Repo Card -->
<div class="github-card"
     data-github="huguryildiz/wsn-opt-python"
     data-width="420"
     data-theme="default">
</div>

<script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>

<p style="margin-top:8px; font-size:0.95em; color:#666;">
This repository provides a hands-on Python tutorial for network-flow–based
optimization models in wireless sensor networks, intended for students and
researchers.
</p>