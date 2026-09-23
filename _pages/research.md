---
layout: academic
title: "Research Program – Hüseyin Uğur Yıldız"
description: "One research program: optimization-based models for networked systems, extended with learning where scale and uncertainty demand it."
permalink: /research/
---

<div class="shell">
  <header class="pagehead">
    <h1 id="research-h1">Research</h1>
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
    <video class="thumb topic-video" data-topic-video muted playsinline preload="metadata"
      poster="/assets/images/research/network_flow_optimization.webp" tabindex="-1" aria-hidden="true">
      <source src="/assets/video/topics/optimization.mp4" type="video/mp4">
    </video>
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
    <video class="thumb topic-video" data-topic-video muted playsinline preload="metadata"
      poster="/assets/images/research/wireless_ad_hoc_underwater_sensor_networks.webp" tabindex="-1" aria-hidden="true">
      <source src="/assets/video/topics/wireless-underwater.mp4" type="video/mp4">
    </video>
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
    <video class="thumb topic-video" data-topic-video muted playsinline preload="metadata"
      poster="/assets/images/research/drone_network_resilience.webp" tabindex="-1" aria-hidden="true">
      <source src="/assets/video/topics/aerial.mp4" type="video/mp4">
    </video>
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
    <video class="thumb topic-video" data-topic-video muted playsinline preload="metadata"
      poster="/assets/images/research/hybrid_opt_rl_networks.webp" tabindex="-1" aria-hidden="true">
      <source src="/assets/video/topics/quantum.mp4" type="video/mp4">
    </video>
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

  <script>
  (function(){
    var videos=Array.prototype.slice.call(document.querySelectorAll('[data-topic-video]'));
    if(!videos.length||!('IntersectionObserver' in window))return;
    var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced)return;
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var video=entry.target;
        if(entry.isIntersecting){
          var playback=video.play();
          if(playback&&playback.catch)playback.catch(function(){});
        }else if(!video.ended){
          video.pause();
        }
      });
    },{rootMargin:'360px 0px',threshold:.01});
    videos.forEach(function(video){
      video.muted=true;
      video.defaultMuted=true;
      observer.observe(video);
    });
  })();
  </script>

  <p class="more"><a href="/software/">Research software &amp; code resources →</a></p>
</div>
