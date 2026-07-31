---
title: "Can LLMs really not jump, or are we defining the jump incorrectly?"
date: 2026-07-29
description: "Two recent AI results challenge a categorical claim about abductive reasoning without yet demonstrating autonomous theory creation."
excerpt: "Co-Scientist and an AI-assisted graph-theory counterexample complicate the claim that LLMs cannot make abductive jumps, but neither settles how scientific novelty should be defined."
tags: [AI for Science, Scientific Discovery, Philosophy of Science]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7488212255067508736/"
image: /assets/images/writing/covers/llms-scientific-jump.jpg
---

Tom Zahavy of Google DeepMind argues in *LLMs can't jump* that models are strong at induction and deduction but structurally inadequate at abduction, which requires proposing a new explanatory framework. His central example is Einstein's local equivalence between gravity and acceleration [1].

Two developments challenge that categorical claim:

- **Co-Scientist**, published in *Nature*, independently reconstructed a then-unpublished hypothesis about bacterial gene transfer. Selected hypotheses were tested in vitro [2].
- On July 22, **GPT-5.6** produced a seven-node counterexample to the Dinitz-Garg-Goemans conjecture concerning cost-preserving rounding [3], [4]. The result had not been peer reviewed when announced and should not be treated as an established theorem. The counterexample is finite and directly checkable.

<figure class="post-figure">
  <img src="/assets/images/writing/covers/llms-scientific-jump.jpg" alt="A glowing arc crosses a gap between a dense network and a curved grid holding a dark sphere" loading="lazy" width="800" height="800">
  <figcaption>The question is whether an unexpected, testable connection counts as a jump, and what evidence would establish that classification.</figcaption>
</figure>

Do these examples refute Zahavy's thesis? I do not think so.

In both cases, people set the goal and the evaluation framework. There is still no publicly available, verified example of a model constructing a theory on the scale of General Relativity using only the knowledge and observations available at the time.

But a categorical claim carries a burden of proof. If a system produces a previously unknown, verifiable, and meaningful structure, what objective criterion makes it "only search" rather than a jump?

The paper does not operationalize this distinction, and the field does not appear to have an agreed criterion. Even if a model solved P versus NP with a verified proof, the result could still be classified as "only deduction" because it worked within fixed axioms.

Hallucinations also need a more careful interpretation. Most are unsupported or incorrect outputs, not scientific hypotheses. Still, models can generate many candidate explanations. The missing component may be a reliable epistemic selection mechanism that rejects candidates through evidence, consistency checks, and experiments.

The question is therefore not only whether LLMs can jump. Should scientific novelty be defined by the resulting discovery, the mechanism that produced it, or both?

## References

1. Tom Zahavy, [*LLMs can't jump*](https://philsci-archive.pitt.edu/28024/), PhilSci-Archive, January 2026.
2. Juraj Gottweis et al., ["Accelerating scientific discovery with Co-Scientist"](https://doi.org/10.1038/s41586-026-10644-y), *Nature*, 2026.
3. Dmitry Rybin, [counterexample announcement](https://x.com/DmitryRybin1/status/2079904005652893709), July 22, 2026.
4. Vera Traub, Laura Vargas Koch, and Rico Zenklusen, ["Single-Source Unsplittable Flows in Planar Graphs"](https://arxiv.org/abs/2308.02651), arXiv:2308.02651.
