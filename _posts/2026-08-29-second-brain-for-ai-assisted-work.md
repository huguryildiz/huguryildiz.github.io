---
title: "A second brain for AI-assisted work does not require Obsidian"
date: 2026-08-29 11:00:00 +03:00
description: "A simple Markdown directory and an explicit agent-readable map can provide durable, searchable context for AI-assisted work."
excerpt: "Files alone do not prevent hallucinations; the agent's map must require evidence, citations where possible, and an explicit ‘not found’ when evidence is absent."
tags: [Second Brain, AI Agents, Agentic Coding, Context Engineering]
linkedin: "https://www.linkedin.com/feed/update/urn:li:activity:7499375307712380928/"
image: /assets/images/writing/linkedin-2026-08/second-brain-tree.jpg
---

You do not need Obsidian to build a second brain for AI-assisted work.

Start with a folder of Markdown files and an arrangement that an agent can follow. An instruction file at the root—such as `CLAUDE.md` or `AGENTS.md`—is the map. It should state where information lives, how files are named, and what the agent should do when it cannot find an answer.

Keep the structure explicit:

- `notes/` for topics
- `people/` for people and contact context
- `projects/` for active work
- `MEMORY.md`, `LEARNINGS.md`, and `decisions.md` for durable context

<figure class="post-figure">
  <img src="/assets/images/writing/linkedin-2026-08/second-brain-tree.jpg" alt="Terminal-style directory tree for a Markdown-based second brain, including notes, people, projects, memory, learnings, and decisions files" loading="lazy" width="800" height="647">
  <figcaption>One possible agent-readable directory map for a Markdown-based second brain.</figcaption>
</figure>

One file per topic is enough. Clear, searchable files make it easier for both you and the agent to retrieve the right context.

The file arrangement alone does not prevent hallucinations. The map should instruct the agent to answer only from the information in the files, cite sources where possible, and say “not found” when evidence is absent. This reduces the problem; it does not eliminate it.
