---
title: "What a Lean-verified forced Euler blow-up does — and does not — show"
date: 2026-09-08
description: "Tristan Buckmaster and Levent Alpöge report finite-time blow-up constructions for forced Euler, Boussinesq, and IPM equations, accompanied by Lean formalizations."
excerpt: "A remarkable development in AI-assisted analysis: finite-time singularity constructions for several forced fluid equations, paired with machine-checked formalizations. The qualification matters: the results concern forced equations, not the Clay Navier–Stokes problem."
tags: [Fluid Mechanics, Mathematical Analysis, Lean, AI-Assisted Research, Formal Verification]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7503119914476544000/"
image: /assets/images/writing/forced-3d-euler-vortex.png
---

Tristan Buckmaster and Levent Alpöge have released three results on finite-time singularity formation with smooth forcing: for the incompressible porous media (IPM) equation, the inviscid Boussinesq system, and the three-dimensional incompressible Euler equations. The accompanying statement says that large language models helped advance a research programme whose underlying ideas are credited to Diego Córdoba and Luis Martínez-Zoroa.

The most important qualification is also the easiest to lose in the headline: these are **forced** equations. The Euler paper constructs a smooth space–time force that sustains an axisymmetric solution whose vorticity becomes singular in finite time. This is not a solution of the unforced three-dimensional Euler problem, and it does not resolve the Navier–Stokes Millennium Prize problem. Buckmaster also says that the related hypodissipative Navier–Stokes work is not being released because its Lean verification is unfinished.

<figure class="post-figure">
  <img src="/assets/images/writing/forced-3d-euler-vortex.png" alt="Abstract illustration of fine streamlines forming a three-dimensional vortex" loading="lazy" width="1254" height="1254">
  <figcaption>Conceptual vortex illustration. This image is not a figure from the cited papers.</figcaption>
</figure>

The technical results are substantial within that scope. The Euler paper describes smooth initial data and a force that remains smooth in space and time through the blow-up time, while the vorticity norm and its time integral diverge. The Boussinesq paper reports finite-time blow-up with smooth forcing in both equations. The IPM paper extends an earlier construction to a uniformly space–time smooth force on the torus, with divergent density and velocity gradients.

The second story is methodological. The authors report using Claude and Codex during the work, including for proof development, bookkeeping, and exposition. The formalization is valuable because it turns a long chain of analytic claims into an artifact that a proof assistant can check. It does not, by itself, remove the need to understand the mathematical statement, the assumptions, the role of the forcing, or the correspondence between the formal code and the paper.

This is therefore a useful case study in AI-assisted mathematics, but not a license to collapse several different claims into “AI solved fluid dynamics.” A careful reading should keep at least four layers separate: the inherited multiscale construction, the new forced-equation results, the human-readable papers, and the Lean verification. Those layers reinforce one another, but they are not interchangeable evidence.

### Sources

- [Buckmaster's statement](https://cims.nyu.edu/~tristanb/statement.pdf)
- [Blow-up for the Euler equations with smooth forcing](https://cims.nyu.edu/~tristanb/euler.pdf)
- [Blow-up for the Boussinesq equations with smooth forcing](https://cims.nyu.edu/~tristanb/boussinesq.pdf)
- [Extending the Córdoba–Martínez-Zoroa IPM blow-up](https://cims.nyu.edu/~tristanb/ipm.pdf)
- [Lean formalization](https://github.com/tristanbuckmaster/fluid_lean)
- [Sebastien Bubeck's response](https://x.com/SebastienBubeck/status/2097214122471432349)
