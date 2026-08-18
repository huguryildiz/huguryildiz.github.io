---
title: "Context management in long-running agentic coding sessions"
date: 2026-08-12
description: "Six evidence-bounded practices for managing context in long-running agentic coding sessions, with descriptive measurements from local Claude Code logs."
excerpt: "Compaction removes accumulated context; delegation keeps task-specific reading out of the main window. Six practical guidelines separate those mechanisms and state what the observed telemetry can and cannot establish."
tags: [Context Engineering, Agentic Workflows, LLM Engineering]
linkedin: "https://www.linkedin.com/feed/update/urn:li:share:7492713085070184448/"
---

A model keeps no private memory between API calls. The harness rebuilds the model's state each turn from the conversation, tool results, files, and instructions it supplies. What is absent is unavailable to the model.

Six practices I have settled on:

1. **Context before generation:** Do not ask for code until the relevant files, decisions, and constraints are in the window. Missing evidence invites inference.
2. **Remove contradictory instructions:** Conflicting requirements make the model resolve priorities implicitly. Decide which governs before it starts.
3. **Give an observable criterion:** “Match the naming, structure, and comment density of the surrounding code” is inspectable. “Act as a 20-year expert” is not.
4. **Request verification selectively:** Specify a procedure when the task needs one. A generic “check everything” spends context without defining acceptance.
5. **Delegate high-volume reading:** In a frozen cohort from my local Claude Code logs, 351 subagent runs reached a median peak of 77,772 tokens and returned a median report of 1,949.
6. **Compact before saturation, but compaction is no substitute for delegation:** Across 960 assistant-active main sessions in the same logs, I observed 16 compaction events, with a median of 473,914 tokens before compaction and 19,271 after.

The mechanisms act at different stages. Compaction removes accumulated context; delegation keeps task-specific reading out of the main window. These are descriptive measurements, not evidence of better output, and they do not remove the need for explicit instructions.

Where do you preserve state: subagent reports, a persistent document layer, or both?
