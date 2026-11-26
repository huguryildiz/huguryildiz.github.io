---
title: "How deep should delegation go? A blast-radius rule for multi-agent systems"
date: 2026-08-16
description: "An agent error costs as much as the work built on top of it. Blast radius, not delegation depth, decides which outputs need sources and an independent check."
excerpt: "An agent error costs as much as the work built on top of it. Each agent can do its task correctly and the system can still fail when a mis-framed problem early on becomes a premise for every agent that follows."
image: /assets/images/writing/blast-radius-delegation.webp
tags: [Multi-Agent Systems, AI Agents, AI Reliability]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7494876181897596928/"
---

An agent error costs as much as the work built on top of it. Each agent can do its task correctly and the system can still fail: a mis-framed problem early on becomes a premise for every agent that follows.

**Blast radius** is the faulty node plus every downstream node it affects. Depth limits miss it: the figure shows three faults at uniform depth reaching ten agents, three, and one.

<figure class="post-figure">
  <img src="/assets/images/writing/blast-radius-delegation.webp" alt="Animated tree of agents titled How Deep Should Delegation Go?: a root agent delegates to three subtrees of equal depth, and a fault in each subtree spreads to a different number of downstream agents. Caption: blast radius is the source fault and every downstream node it affects." loading="lazy" width="1080" height="1080">
  <figcaption>Similar depths can produce very different blast radii.</figcaption>
</figure>

The rule:

- Estimate how much of the workflow fails if an output is wrong.
- High-radius outputs carry sources and pass an independent check before others use them.
- Narrow, easily tested tasks can be delegated freely.
- Stop once the parent can no longer inspect the evidence or test the result.

Which outputs do you verify before other agents build on them?
