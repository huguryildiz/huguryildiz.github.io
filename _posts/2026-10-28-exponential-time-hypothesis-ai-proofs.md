---
title: "OpenAI and Anthropic each claim an AI-generated proof that ETH is false"
date: 2026-10-28
description: "Two AI-generated papers give subexponential algorithms for 3-SAT, claiming the Exponential Time Hypothesis is false. Both are formalized in Lean; independent review is under way."
excerpt: "OpenAI and Anthropic have each published an AI-generated proof that the Exponential Time Hypothesis is false. P vs NP remains open, but hundreds of conditional lower bounds would need re-examination. Until review concludes, these remain claims."
image: /assets/images/writing/eth-false-ai-proofs.webp
tags: [Computational Complexity, Formal Verification, Lean, AI for Math]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7521025091648978944/"
---

OpenAI and Anthropic have each published an AI-generated proof that the **Exponential Time Hypothesis (ETH)** is false.

<figure class="post-figure">
  <img src="/assets/images/writing/eth-false-ai-proofs.webp" alt="Plot of running time against number of variables n, with an orange exponential curve labelled ETH assumption rising far above a blue subexponential curve labelled claimed; below it, glass spheres and triangles linked in a small network." loading="lazy" width="1200" height="1500">
</figure>

ETH holds that 3-SAT, deciding whether true/false values can satisfy a set of three-variable logical rules, needs exponential time in the worst case. Both papers give deterministic algorithms that run in subexponential time. That is still not polynomial: P vs NP remains open, and nothing here is fast in practice.

The larger consequence is for the literature. Hundreds of papers derive lower bounds conditionally on ETH, and those bounds now need re-examination. Both proofs are formalized in Lean, and independent review is under way. Until it concludes, these remain claims.

- OpenAI: [The Exponential Time Hypothesis is False](https://github.com/openai/math/blob/main/preprints/The-Exponential-Time-Hypothesis-is-False-October-25-2026/paper.pdf)
- Anthropic: [hexagonmath.org/2610.00577v1](https://hexagonmath.org/2610.00577v1)
