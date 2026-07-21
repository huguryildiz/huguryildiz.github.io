---
layout: academic
title: "Research"
description: "One research program: optimization-based models for networked systems, extended with learning where scale and uncertainty demand it. Software: VERA, KAIROS, UWA Ray Bench."
permalink: /research/
---

<div class="shell">
  <header class="pagehead">
    <h1 id="research-h1">Research</h1>
    <p class="lede">One program: optimization-based models for networked systems, extended with
      learning where scale and uncertainty demand it.</p>
  </header>

  <div class="program">
    <p style="margin-top:1.4rem;">My research focuses on routing, resource allocation, and energy-efficient design of networked
      systems, with an emphasis on wireless ad hoc networks, underwater acoustic sensor networks, and
      drone-assisted aerial networks. I develop optimization-based models and increasingly combine
      them with reinforcement learning to address scalability and uncertainty.</p>
    <p>More recently, I have been exploring hybrid classical–quantum network routing, investigating how
      physical constraints such as entanglement lifetime and network reliability influence routing and
      control decisions.</p>

    {% include research-map.html %}
  </div>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-layers"/></svg>Key research topics</h2>

  <article class="theme-item">
    <img class="thumb" src="/images/research/network_flow_optimization.png" alt="Network flow optimization illustration" loading="lazy">
    <div class="tbody">
      <div class="head"><h3>Operations research and mathematical optimization for networked systems</h3>
        <span class="status">Core</span></div>
      <p class="methods"><b>Methods:</b> linear, integer, and mixed-integer programming (MILP) · network-flow formulations · goal programming</p>
      <p>Development of linear, integer, and mixed-integer programming models, including network
        flow–based formulations, for complex optimization problems in communication networks. Core
        themes include network lifetime maximization, energy efficiency, resource allocation,
        energy–delay–reliability trade-offs, and resilience under physical, topological, and security
        constraints.</p>
      <p class="reps"><span class="lbl">Representative</span>
        <a href="/publications/">Packet size optimization for smart grid WSNs (TIE 2017)</a> ·
        <a href="/publications/">Goal programming for broadcasting backbones (Ad Hoc Netw. 2023)</a></p>
    </div>
  </article>

  <article class="theme-item">
    <img class="thumb" src="/images/research/wireless_ad_hoc_underwater_sensor_networks.png" alt="Wireless ad hoc and underwater sensor networks illustration" loading="lazy">
    <div class="tbody">
      <div class="head"><h3>Wireless ad hoc and underwater acoustic sensor networks</h3>
        <span class="status">Core</span></div>
      <p class="methods"><b>Methods:</b> MILP lifetime models · k-connectivity analysis · transmission-power and packet-size optimization</p>
      <p>Design and optimization of energy-efficient routing, topology control, and communication
        strategies for terrestrial wireless ad hoc networks and underwater acoustic sensor networks.
        Research topics span network lifetime and energy-efficiency analysis, k-connectivity–based
        reliability, multi-sink architectures, void-region mitigation, adversarial effects, and
        operation under harsh and resource-constrained environments.</p>
      <p class="reps"><span class="lbl">Representative</span>
        <a href="/publications/">Fountain codes for UWSN lifetime (TII 2019)</a> ·
        <a href="/publications/">Non-uniform k-connectivity (IoT-J 2025)</a> ·
        <a href="/publications/">Void regions &amp; sink architecture (IEEE Sensors J. 2023)</a></p>
    </div>
  </article>

  <article class="theme-item">
    <img class="thumb" src="/images/research/drone_network_resilience.png" alt="Drone network resilience illustration" loading="lazy">
    <div class="tbody">
      <div class="head"><h3>Resilient drone-assisted aerial networks</h3>
        <span class="status">Core</span></div>
      <p class="methods"><b>Methods:</b> integer programming · heuristic optimization · mobility-aware topology adaptation</p>
      <p>Design and restoration of resilient k-connected drone networks using integer programming and
        heuristic optimization techniques. This research investigates mobility-aware connectivity
        restoration, minimum-movement strategies, and topology adaptation in grid-based aerial
        deployments. Recent work develops exact optimization models and scalable heuristics to balance
        resilience, execution time, and mobility cost in drone-assisted communication systems.</p>
      <p class="reps"><span class="lbl">Representative</span>
        <a href="/publications/">k-connectivity restoration strategies (Comput. Stand. Interfaces 2025)</a></p>
    </div>
  </article>

  <article class="theme-item">
    <img class="thumb" src="/images/research/hybrid_opt_rl_networks.png" alt="Hybrid optimization and reinforcement learning illustration" loading="lazy">
    <div class="tbody">
      <div class="head"><h3>Hybrid optimization and learning-based network control</h3>
        <span class="status ongoing">Ongoing</span></div>
      <p class="methods"><b>Methods:</b> optimization–learning integration · neural parameter prediction · reinforcement learning</p>
      <p>Integration of mathematical optimization frameworks with machine learning and reinforcement
        learning techniques to enable adaptive, data-driven, and scalable control of complex networked
        systems. Current work explores hybrid optimization–learning methodologies for dynamic
        decision-making and emerging paradigms such as hybrid classical–quantum network routing
        architectures.</p>
      <p class="reps"><span class="lbl">Representative</span>
        <a href="/publications/">Neural network–based instant parameter prediction (Wireless Netw. 2019)</a></p>
    </div>
  </article>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-code"/></svg>Software</h2>

  <article class="swproject">
    <img src="/images/vera.png" alt="VERA evaluation platform screenshot" loading="lazy">
    <div>
      <h3>VERA — Visual Evaluation, Reporting &amp; Analytics</h3>
      <p>A modern platform for academic juries, capstone evaluations, and accreditation workflows.
        Jurors enter through a QR code, score projects against a configurable rubric, and
        administrators access real-time rankings and accreditation-ready reports the moment scoring
        closes.</p>
      <div class="links">
        <a class="ext" href="https://vera-eval.app" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-globe"/></svg> vera-eval.app</a>
        <a class="ext" href="https://github.com/huguryildiz/VERA" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-github"/></svg> GitHub repository</a>
      </div>
    </div>
  </article>

  <article class="swproject">
    <img src="/images/kairos.png" alt="KAIROS course timetabling logo" loading="lazy" style="object-fit:contain;">
    <div>
      <h3>KAIROS — Course timetabling</h3>
      <p>A conflict-free university course timetabling system built on OR-Tools CP-SAT. Given raw
        course and room data, KAIROS produces a weekly schedule with no double-booked rooms, no
        instructor conflicts, and every placement verified by an independent validator — then
        polishes it with soft optimization for cohort idle gaps, instructor compactness, and
        department fairness. Available as a web app and a command-line solver.</p>
      <div class="links">
        <a class="ext" href="https://kairos.huguryildiz.com" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-globe"/></svg> kairos.huguryildiz.com</a>
        <a class="ext" href="https://github.com/huguryildiz/KAIROS" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-github"/></svg> GitHub repository</a>
      </div>
    </div>
  </article>

  <article class="swproject">
    <img src="/images/uwa-ray-bench.png" alt="Underwater Acoustic Ray Bench transmission-loss field visualization" loading="lazy">
    <div>
      <h3>Underwater Acoustic Ray Bench</h3>
      <p>A benchmark pitting five LLMs against a genuine 3D BELLHOP3D reference solver on underwater
        acoustic ray tracing: each model traces a fan of rays through a synthetic ocean with a
        depth-dependent sound-speed profile and seamounts. Scoring compares each model's exported
        transmission-loss field against the reference solver on field accuracy, coverage, and
        geometry fidelity.</p>
      <div class="links">
        <a class="ext" href="https://uwa-ray-bench.vercel.app/" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-globe"/></svg> uwa-ray-bench.vercel.app</a>
        <a class="ext" href="https://github.com/huguryildiz/uwa-ray-bench" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-github"/></svg> GitHub repository</a>
      </div>
    </div>
  </article>

  <figure style="margin:1.8rem 0 0;">
    <video class="compvid" src="/assets/compare_grid_portrait.mp4" autoplay loop muted playsinline controls
      aria-label="Side-by-side comparison grid: five LLM ray-tracing outputs against the BELLHOP3D reference solver"></video>
    <figcaption class="cap" style="max-width:70ch; margin:.5rem auto 0; text-align:center;">
      UWA Ray Bench — model outputs compared against the BELLHOP3D reference solver.</figcaption>
  </figure>

  <h2 class="sec"><svg class="hicon" aria-hidden="true"><use href="#i-book"/></svg>Code &amp; learning resources</h2>
  <ul class="resourcelist">
    <li><span class="n">wsn-opt-python</span> — a hands-on Python tutorial for network-flow–based
      optimization models in wireless sensor networks, intended for students and researchers.
      <a class="ext" href="https://github.com/huguryildiz/wsn-opt-python" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-github"/></svg> GitHub</a></li>
    <li><span class="n">Underwater networks — basics</span> — an introductory document covering core
      principles of underwater acoustic communication and sensor networks.
      <a class="ext" href="https://huguryildiz.com/files/underwater_networks_basics.pdf" target="_blank" rel="noopener"><svg class="licon" aria-hidden="true"><use href="#i-file"/></svg> PDF</a></li>
  </ul>
</div>
