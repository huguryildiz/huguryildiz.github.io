---
title: "Fermat's Last Theorem, formalized and checked by Lean"
date: 2026-09-06
description: "Anthropic reports an end-to-end Lean formalization of Fermat's Last Theorem, completed with Claude over eleven days and checked by Lean."
excerpt: "This is not a new proof of Fermat's Last Theorem. It is a computer-checked formalization of an existing proof — and a striking demonstration of what AI-assisted formal verification can make auditable."
tags: [Formal Mathematics, Lean, AI-Assisted Research, Mathematical Verification]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7501798924823969792/"
image: /assets/images/writing/formalizing-fermats-last-theorem.webp
---

Anthropic reports an end-to-end, computer-checked formalization of **Fermat's Last Theorem**. Working largely autonomously over eleven days, Claude translated a simplified version of the proof developed from Wiles's work into the **Lean** proof assistant.

The scale is unusual:

- around **13 million lines of Lean code**;
- **30,300 theorems** proved during the effort, with **29,500 used in the final proof**;
- dozens of Claude agents coordinating through a dependency graph of theorem statements.

<figure class="post-figure">
  <img src="/assets/images/writing/formalizing-fermats-last-theorem.webp" alt="Portrait of Pierre de Fermat beside a chalkboard showing the statement of Fermat's Last Theorem and a^n + b^n = c^n" loading="lazy" width="1536" height="1024" decoding="async">
  <figcaption>Fermat's Last Theorem and its formalization in a computer-checkable proof language. The illustration is conceptual, not a visualization of the formal proof.</figcaption>
</figure>

The important qualification is that this is **not a new proof of the theorem**. The mathematical contribution lies in formalization: rewriting a long human-readable proof so that Lean can check every logical step. This makes the result closer to a mechanically auditable proof artifact than to an autonomous mathematical discovery.

Lean checked the resulting proof using its three standard axioms. Kevin Buzzard of Imperial College London also reviewed the result. The workflow used Prove2Me to maintain a directed acyclic graph of theorem dependencies, allowing agents to work in parallel while reusing intermediate results.

For research, the broader question is more interesting than the headline. If AI systems increasingly produce mathematical arguments, formalization could provide an independent verification layer for those arguments. It does not replace a human-readable explanation, and it does not by itself settle how useful or maintainable a proof is. It does, however, offer a concrete way to test whether the encoded chain of deductions compiles under a trusted proof checker.

The same idea could matter in applied mathematics, but the transfer is not automatic. Formalizing convergence, optimality, or correctness claims in engineering models would require suitable libraries, precise assumptions, and a careful match between the formal statement and the implemented system.

Read the original report: [Formalizing Fermat's Last Theorem](https://www.anthropic.com/research/formalizing-fermats-last-theorem).
