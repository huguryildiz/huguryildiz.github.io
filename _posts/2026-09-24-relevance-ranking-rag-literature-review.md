---
title: "Relevance ranking in RAG-based literature review: Jev versus embedding-based classifiers in quantum networking"
date: 2026-09-24
description: "A comparison of Jev and Gemini Embedding 2 baselines for ranking quantum-networking papers that contain an explicit mathematical optimization formulation."
excerpt: "A visual report compares Jev with Gemini Embedding 2 baselines on 594 quantum-networking papers, using full-text review to identify papers with explicit optimization formulations."
tags: [RAG, Literature Review, Quantum Networking, Information Retrieval]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7507553785318125568/"
image: /assets/images/writing/rag-literature-review-ranking.webp
---

How well can a relevance-ranking model find papers that state an explicit mathematical optimization formulation?

This comparison uses 594 papers on quantum networking. The ranking models score title and abstract text, while the answer key is checked against the full text. Of the 594 papers, 78 state a formulation with decision variables, an objective, and constraints; the reported reading budget is 99 papers.

<figure class="post-figure">
  <img src="/assets/images/writing/rag-literature-review-ranking.webp" alt="Infographic comparing Jev with Gemini Embedding 2 baselines for ranking quantum-networking papers, showing recall, precision, and ROC-AUC results" loading="lazy" width="4320" height="5400">
  <figcaption>Reported comparison of recall, precision, and ROC-AUC for relevance ranking in a quantum-networking literature review.</figcaption>
</figure>

The reported Jev results are 60 retrieved relevant papers, 61% precision, and a 0.915 ROC-AUC. The Gemini Embedding 2 baseline reaches 37 relevant papers, 38% precision, and a 0.778 ROC-AUC. A Gemini Embedding 2 plus logistic-regression classifier reaches 52 relevant papers, 53% precision, and a 0.885 ROC-AUC. Random order is the reference baseline with 13 relevant papers, 13% precision, and a 0.500 ROC-AUC.

The visual also reports three runs with 589 of 594 decisions identical, and an estimated cost of $0.025 versus $0.041 per 1,000 papers. The answer key is model-made; two labelers disagreed on 17 of 100 cases, with κ = 0.47. The logistic-regression result is cross-validated on the same 594 papers, so the infographic describes 52 as a floor for that baseline.
