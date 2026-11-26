---
title: "Two claimed proofs of the Riemann Hypothesis, neither verified"
date: 2026-11-20
description: "A Lean-only proof of RH from Levent Alpöge and Claude, and a 940-page all-human GRH draft posted by Ravi Vakil, appeared within hours. One no human has read in full; one no machine has checked."
excerpt: "A new proof is claimed for the 167-year-old Riemann Hypothesis, as Lean code only. Hours later, a 940-page human-written draft proposing a proof of GRH was posted. One proof no human has read in full; one no machine has checked."
image: /assets/images/writing/riemann-hypothesis-two-claims.webp
tags: [Riemann Hypothesis, Formal Verification, Lean, AI for Math]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7529638613308055552/"
---

A new proof is claimed for the 167-year-old **Riemann Hypothesis**. It comes as Lean code only, with no paper.

<figure class="post-figure">
  <img src="/assets/images/writing/riemann-hypothesis-two-claims.webp" alt="Abstract render of blue light filaments flowing over a dark wavy surface and converging into a series of points along a single glowing orange line." loading="lazy" width="1200" height="1200">
</figure>

On 20 November, Levent Alpöge (Anthropic) posted a four-page note. He writes that he believes he and Claude found a proof of the Riemann Hypothesis (RH), with a method that also covers the Generalized Riemann Hypothesis (GRH). He released only the Lean code, not a generated text of more than 250K pages. The note traces a 20-step path from 6 October to 16 November and credits Claude with a key step: choosing √X as the length of the chain of theta lifts.

Hours later, American Mathematical Society president Ravi Vakil posted a 940-page draft by Alessandro Masullo, a former PhD student of Brian Conrad, that proposes a proof of GRH. Vakil called it "all human, with no AI." It has no Lean formalization. The plan had been a year of review before any announcement; Vakil released it early and asked the community to check and formalize it. Conrad, who has reviewed it for months, says it is undergoing major revision, and readers have already reported problems.

Neither claim is verified. Andrew Sutherland (MIT) has reportedly confirmed that Alpöge's code compiles and passes independent kernel checks, but no expert audit has yet confirmed that its final theorem faithfully states RH/GRH. Every earlier claimed proof of RH has failed.

One proof no human has read in full; one no machine has checked.

- Alpöge's note: [alpo.ge/remark.pdf](https://alpo.ge/remark.pdf)
- Lean code (third-party mirror): [github.com/CocoSgt/riemann-hypothesis-lean](https://github.com/CocoSgt/riemann-hypothesis-lean)
- Vakil's post: [math216.wordpress.com](https://math216.wordpress.com/)
