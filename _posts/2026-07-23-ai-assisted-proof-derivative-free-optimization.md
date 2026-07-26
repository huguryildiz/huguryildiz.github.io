---
title: "A 30-year gap in derivative-free convex optimization, closed with AI assistance and verified in Lean 4"
date: 2026-07-23
excerpt: "Phillip Kerger reports a near-quadratic oracle-complexity lower bound for derivative-free convex optimization — open since Protasov's 1996 upper bound — drafted in a single 2.5-hour model session and formalized in Lean 4 with no remaining `sorry`."
tags: [Optimization, AI for Mathematics, Formal Verification]
linkedin: "https://www.linkedin.com/posts/huguryildiz_check-out-this-chat-activity-7485680080925601793-iGWk"
image: /assets/images/writing/covers/ai-assisted-proof-derivative-free-optimization.jpg
---

A result worth reading carefully if you work in optimization theory, and worth reading twice if you follow what large models can and cannot do in mathematics.

The question is how many function evaluations are needed to minimize a convex Lipschitz function when the oracle returns **exact function values only** — no gradients. Protasov's 1996 algorithm settles the upper side at order **d²** evaluations in dimension **d**. The best known lower bound stayed at order **d** for three decades, leaving a factor-**d** gap between what was achievable and what was provably necessary.

Phillip Kerger reports a **near-quadratic lower bound**, matching Protasov up to logarithmic and constant factors. The gap closes, and Protasov's method turns out to have been essentially optimal all along.

Two things make the announcement more interesting than the theorem alone:

- The proof was drafted in a **single 2.5-hour session** with GPT-5.6 Sol Ultra, steered by a roughly ten-page prompt carrying the specialized mathematical context. Earlier model versions reportedly failed on the same setup.
- The argument was then **formalized in Lean 4** against Mathlib and compiles without `sorry` — so the correctness claim does not rest on anyone's reading of the prose, mine included.

Kerger's own framing is the part I would keep: the proof combines existing techniques rather than introducing a fundamentally new one. That is a narrower claim than "AI proved a hard theorem," and a more useful one — it suggests the current frontier is *problems reachable from established machinery that no one had assembled in that particular order*, not the invention of new mathematics.

The formalization is what makes this reportable rather than merely impressive. A machine-checked proof turns "the model produced something plausible" into a verifiable object, which is exactly the standard this class of result needs.

- Preprint: [Closing the Oracle-Complexity Gap in Derivative-Free Convex Optimization](https://arxiv.org/abs/2607.13335)
- Kerger's write-up: [An AI-Assisted Breakthrough in Mathematical Optimization](https://medium.com/@kerger.p/an-ai-assisted-breakthrough-in-convex-optimization-an-optimization-problem-dating-back-30-years-a-db5c631119de)
