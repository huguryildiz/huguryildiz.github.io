---
title: "OpenAI's 722 mathematics manuscripts: citations, withdrawals, and proof dependencies"
date: 2026-10-10
description: "A look at citation patterns in OpenAI's release of 722 AI-produced mathematics manuscripts and at the withdrawals that followed a sign error."
excerpt: "One day after OpenAI released 722 AI-produced mathematics manuscripts, three were withdrawn. The withdrawals show why a release of this size needs a record of which results each proof relies on."
image: /assets/images/writing/openai-math-citation-network.webp
tags: [Mathematics, AI-Assisted Research, Research Integrity, Formal Verification, Scholarly Publishing]
---

OpenAI released 722 AI-produced mathematics manuscripts on 6 October. The next day, three were withdrawn and 14 others revised.

Benjamin Laufer found that 390 of the 722 cite at least one OpenAI-authored work. Using his code, we reproduced the counts. OpenAI-authored work accounts for 3.5% of all cited references. Most citation loops connect manuscripts with the same date label, as companion papers would. As Laufer notes, a citation loop alone does not establish a circular proof.

<figure class="post-figure">
  <img src="/assets/images/writing/openai-math-citation-network.webp" alt="Citation network of the largest cluster in the OpenAI mathematics release: 39 papers and 72 links. Six papers are numbered, with Log abundance cited most often. One citation loop runs through three papers: 4 cites 5, 5 cites 6, and 6 cites 4." loading="lazy" width="1600" height="2000">
  <figcaption>Largest citation cluster in the release: 39 papers, 72 links. Links are references cited in the text; a citation is not a proof dependency, and node positions carry no meaning.</figcaption>
</figure>

The withdrawals show why proof dependencies matter. A sign error invalidated an argument in one manuscript. The only two manuscripts citing it were also withdrawn. OpenAI says two dependent papers used the flawed construction.

<figure class="post-figure">
  <img src="/assets/images/writing/openai-math-sign-error-withdrawals.webp" alt="Citation diagram showing the manuscript on Weil classes on split abelian eightfolds, withdrawn for a sign error, and the only two manuscripts that cite it, both withdrawn on 7 October." loading="lazy" width="1600" height="2000">
  <figcaption>One sign error, three withdrawals: the only two papers citing the flawed manuscript were withdrawn with it on 7 October.</figcaption>
</figure>

OpenAI reports that about 42% of the main results have been formalized in Lean. A release of this size also needs a clear record of what was checked, which results each proof relies on, and what must be reviewed again when an argument fails.

With releases like this, the bottleneck in mathematics may be shifting from proving to believing.
