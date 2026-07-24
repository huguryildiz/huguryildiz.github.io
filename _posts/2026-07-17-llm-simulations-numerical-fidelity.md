---
title: "Visually convincing LLM simulations can conceal substantial differences in numerical fidelity"
date: 2026-07-17
excerpt: "Five frontier models built the same 3D underwater-acoustic solver in isolation. Judged against BELLHOP3D by numerical output rather than screenshots, visually convincing simulations concealed large gaps in fidelity."
tags: [LLM Evaluation, Underwater Acoustics, Computational Physics]
linkedin: "https://www.linkedin.com/in/huguryildiz/"
---

GPT 5.6 Sol Ultra, Sakana Fugu Ultra, Fable 5 Max, Opus 4.8 Max, and Gemini 3.1 Pro High each received the same prompt in a separate, isolated session:

> Build a 3D underwater-acoustic simulation that traces sound through a depth-dependent water column, reflects it from a sloped seabed, and identifies the resulting coverage and shadow zones — the regions where sonar detection becomes difficult.

Each produced a self-contained solver. None saw the other submissions, the reference implementation, or the scoring code. I compared their computed transmission-loss fields against BELLHOP3D using numerical output rather than screenshots.

## Provisional composite (0–100)

- **GPT 5.6 Sol Ultra** — 71.3
- **Sakana Fugu Ultra** — 66.8
- **Fable 5 Max** — 64.0
- **Opus 4.8 Max** — 56.4
- **Gemini 3.1 Pro High** — 35.4

GPT leads under the provisional composite, but the metric-level picture is less uniform:

- **GPT 5.6 Sol Ultra** led field fidelity, coverage agreement, receiver-level accuracy, and shadow-boundary localization.
- **Sakana Fugu** produced the lowest error in the robust core region.
- **Fable 5** achieved the lowest full-field and spatially smoothed transmission-loss errors.

This is a single synthetic scenario, not a general model ranking. The composite remains provisional because geometry fidelity is not yet scored, and BELLHOP3D is a reference, not ground truth.

<figure class="post-figure">
  <video class="post-video" controls playsinline preload="metadata">
    <source src="/assets/video/compare_grid_portrait.mp4" type="video/mp4">
  </video>
  <figcaption>Side-by-side transmission-loss fields from each model against the BELLHOP3D reference.</figcaption>
</figure>

If you evaluate LLMs on specialized engineering or physics tasks: which metrics actually matter to you?
