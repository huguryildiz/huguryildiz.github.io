---
title: "Still uploading your .tex files to Overleaf's servers?"
date: 2026-06-24
description: "A local-first LaTeX workflow using VS Code, LaTeX Workshop, Git, and Claude Code, with a review of ClaudePrism for offline scientific writing."
excerpt: "I stopped a while ago. VS Code + LaTeX Workshop + Claude Code — files on disk, version control in Git, compilation on my own machine. Overleaf still wins on real-time collaboration; local control wins for solo, code-heavy work."
tags: [LaTeX, Scientific Writing, Research Workflow]
linkedin: "https://www.linkedin.com/feed/update/urn:li:ugcPost:7475571468345434112/"
image: /assets/images/writing/covers/local-first-latex-workflow.jpg
---

My usual workflow is **VS Code + LaTeX Workshop + Claude Code**: files on my disk, version control in Git, compilation on my own machine. No sync wait, no cloud queue.

Now there's an open-source project packaging much of that into a single local-first workspace: [**ClaudePrism**](https://claudeprism.delibae.dev/).

<div class="carousel" role="group" aria-label="ClaudePrism screenshots — swipeable slides">
  <img src="/assets/images/writing/claudeprism/slide-1.jpg" alt="ClaudePrism workspace — main.tex editor with proposed changes to accept or reject, live PDF preview, and an inline Claude Code chat" loading="lazy">
  <img src="/assets/images/writing/claudeprism/slide-2.jpg" alt="Template picker — research paper, IEEE conference, ACM conference, thesis, and presentation starters" loading="lazy">
  <img src="/assets/images/writing/claudeprism/slide-3.jpg" alt="Capture &amp; Ask — selecting a region of the compiled PDF and asking Claude about it" loading="lazy">
  <img src="/assets/images/writing/claudeprism/slide-4.jpg" alt="Scientific Skills panel — 148 skills across 16 domains, from bioinformatics to engineering and simulation" loading="lazy">
  <img src="/assets/images/writing/claudeprism/slide-5.jpg" alt="Built-in Python environment — uv-managed virtual environment active for the project" loading="lazy">
</div>
<p class="carousel-hint">Swipe / scroll for the editor, templates, PDF capture, skills, and Python environment →</p>

## What earned my attention as a researcher

- **Offline LaTeX compilation** with embedded Tectonic — no TeX Live setup, no cloud queue
- **Built-in Python environment** for analysis, plots, and data processing, right inside the editor
- **100+ scientific workflows and domain skills**, loaded when relevant
- **Claude Code** integrated directly into the writing environment
- **Local Git history with diffs** — review edits and accept or reject them chunk by chunk
- **Zotero + BibTeX support**, plus selecting a region of a PDF and asking Claude about it

The honest nuance: the workspace is local-first, but AI-assisted features still send relevant content to the model API — same as any cloud LLM tool.

## Not a replacement for Overleaf

I'm not trying to replace Overleaf. **Real-time collaboration** is still one of its strongest advantages. But for solo, code-heavy, simulation-heavy research, local files, reproducible builds, and a tighter AI workflow are getting hard to ignore.

Where do you land — Overleaf's collaboration, or local control?
