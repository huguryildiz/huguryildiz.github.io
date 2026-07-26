---
title: "A 30,000-variable knapsack, solved on a GPU in ten seconds"
date: 2026-01-14
excerpt: "NVIDIA cuOpt on a large-scale Multi-Dimensional Knapsack Problem — 30K binary variables, 10 knapsack constraints, ~300k nonzeros. Solved on a Tesla T4 under a 10-second limit to a ~0.035% relative MIP gap."
tags: [Operations Research, GPU Optimization, Integer Programming]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7417308257074999296/"
image: /assets/images/writing/covers/cuopt-gpu-multidimensional-knapsack.jpg
---

**NVIDIA cuOpt** was evaluated on a large-scale **Multi-Dimensional Knapsack Problem (MKP)** with **30K binary variables** and **10 knapsack constraints** (~300k nonzeros).

The model was solved on an NVIDIA Tesla T4 GPU under a **10-second time limit**, yielding a feasible solution with a **~0.035% relative MIP gap**.

<figure class="post-figure">
  <img src="/assets/images/writing/cuopt/mkp-cuopt-code.jpg" alt="mkp.py — a 54-line Python script building the multi-dimensional knapsack model with cuopt.linear_programming: 30000 binary variables and 10 capacity constraints over a random instance, a maximize objective, a 10-second time limit, and a print of status, objective value, MIP gap, and wall-clock time" loading="lazy">
  <figcaption>The cuOpt implementation used for this experiment.</figcaption>
</figure>
