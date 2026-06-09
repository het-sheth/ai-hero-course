---
title: Subagents
topic: day-1-fundamentals
status: learning
created: 2026-06-09
updated: 2026-06-09
lede: "Subagents are a context-saving delegation mechanism: the orchestrator (the agent you talk to) spawns a subagent with a fresh context window to do focused work — like exploration — then gets back just a summary, keeping the main context clean for implementation."
desc: "Context-saving delegation: orchestrator spawns fresh-context subagents that do focused work and report a summary back."
tags: [claude-code, subagents, context-window, fundamentals]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/day-1-fundamentals/subagents.md
related: [constraints-of-llms, codebase-exploration]
first_seen: log/2026-06-09
first_seen_label: 2026-06-09 · Day 1 Fundamentals
order: 2
---

## Why subagents matter

Claude Code's context window is finite — and part of it is always consumed before any real work begins. The system prompt, tools, and built-in instructions that make Claude Code behave like an agent occupy a fixed slice. What remains has to cover everything in the session: [[day-1-fundamentals/codebase-exploration]], understanding the task, making decisions, writing code, and responding to feedback.

This creates a direct tradeoff:

| Spend more tokens on... | Effect |
|---|---|
| Exploration | Less space left for implementation |
| Implementation | Less repo context → worse output |

Subagents are the mechanism Claude Code uses to escape that tradeoff. See [[day-1-fundamentals/constraints-of-llms]] for the underlying limits that make this necessary.

## The orchestrator and the subagent

The agent you talk to is the **orchestrator**. When it needs focused work done — say, exploring a repo — it spawns a **subagent** with a fresh context window. That subagent burns its own tokens on the task without touching the orchestrator's context. When it finishes, it sends a summary back.

A useful mental model:

- Orchestrator = lead developer
- Subagent = delegated helper
- Helper does the work, returns findings
- Lead gets the findings without carrying every intermediate detail

This keeps the orchestrator's context window clean and available for the work that actually matters.

## Parallelism and different models

The orchestrator can spawn multiple subagents at once. They work on different parts of a task in parallel and each report back independently. Subagents can also be configured with different system prompts or different models entirely.

> [!TIP]
> For simpler tasks like exploration, Claude Code often uses a faster, cheaper model — Haiku, for instance. It is really fast and really high quality for that kind of work, which means less time and cost without sacrificing the findings the orchestrator needs.

## The key idea

Subagents are a **context-saving delegation mechanism**. They let Claude Code keep the orchestrator's context cleaner, preserve more space for implementation, and gather useful information without dragging every intermediate tool call and detail into the main conversation.

Claude Code uses them extremely aggressively — you will see them throughout the course. When you notice Claude Code spawning a new agent mid-task, this is why.
