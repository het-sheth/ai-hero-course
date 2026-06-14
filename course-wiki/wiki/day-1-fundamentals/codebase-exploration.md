---
title: Codebase Exploration
status: learning
created: 2026-06-09T00:00:00.000Z
desc: >-
  Use the word "explore" to trigger a dedicated Explore subagent for deep,
  aggressive repo analysis.
tags:
  - claude-code
  - exploration
  - subagents
  - fundamentals
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - raw/day-1-fundamentals/codebase-exploration.md
related:
  - /day-1-fundamentals/subagents.md
  - /day-1-fundamentals/constraints-of-llms.md
first_seen: log/2026-06-09
first_seen_label: 2026-06-09 · Day 1 Fundamentals
order: 3
type: concept
description: >-
  Getting Claude Code to deeply map an unfamiliar repo. The trick: use the word
  "explore" in your prompt — it triggers Claude Code to spawn a dedicated
  Explore subagent that aggressively reads files and returns a rich summary,
  instead of a shallow few-file skim.
timestamp: 2026-06-09T00:00:00.000Z
---

## Why exploration is foundational

LLMs are [stateless](/day-1-fundamentals/constraints-of-llms.md) — every interaction is like a brand-new developer who's
never seen your codebase. So exploration isn't a one-time setup task; it's the foundation of every
single agent interaction. Used well, an agent maps an unfamiliar repo faster than you could by hand
— and that skill unlocks everything else in the course.

## The Problem with a Generic Prompt

A prompt like `tell me the tech stack of this repo` kicks off a shallow scan — Claude Code searched two patterns and read only six files. No [subagents](/day-1-fundamentals/subagents.md) were spawned. Six files is not enough to understand what is really happening in a non-trivial codebase.

You can verify this with `Ctrl-O`, which expands the turn into verbose mode showing every bash command and file read Claude Code executed. Six reads is the whole story.

## The Fix: Use the Word "explore"

> [!TIP]
> Putting the word **explore** in your prompt triggers Claude Code to spawn a dedicated **Explore subagent** — a separate agent with a customised system prompt whose only job is aggressive, wide-net file discovery.

Example contrast:

| Prompt | Subagent spawned? | Files read |
|---|---|---|
| `tell me the tech stack of this repo` | No | ~6 |
| `explore how PPP works in this repo` | Yes — Explore | Many more |

The difference is not just cosmetic. The Explore subagent ran independently inside its own context window, burning real resources to produce a thorough summary.

## What the Explore Subagent Does

When spawned, the Explore subagent:

- Receives a customised system prompt scoped to the exploration task
- Runs tool calls (bash commands, file reads/writes) very aggressively
- Returns a summary back to the **orchestrator agent** (the one you are talking to), which then relays it to you

You can watch it in action: the turn label shows `explore [title]` inside brackets, and `Ctrl-O` reveals a much longer list of reads and searches compared to the shallow run.

## Run Statistics (PPP Example)

| Metric | Value |
|---|---|
| Wall-clock time | 60 seconds |
| Tokens used (subagent context) | 64,000 (~32% of context window) |
| Tools called | 25 |

> [!NOTE]
> `Ctrl-O` while a turn is running expands it into verbose mode so you can see every tool call in real time. Toggle it off again to let the run finish without interruption.

32% of a context window spent on a single exploration task is significant — see [constraints-of-llms](/day-1-fundamentals/constraints-of-llms.md) for why context budget matters, and [compaction](/day-1-fundamentals/compaction.md) for what to do when you run low.

## Why Word Choice Matters

The word `explore` is not just a hint to you — it appears to activate something in Claude Code's latent space that routes the request to the Explore subagent machinery. A semantically similar prompt that omits the word does not trigger the same behaviour. This is an example of prompt precision having a non-linear effect on output quality.

> [!CAUTION]
> Do not assume a prompt is equivalent to another just because the intent feels the same. Test both; the token cost and depth of analysis can differ dramatically.

## Try it yourself (the exercise)

Run the same flow on the playground repo and watch for subagent activity:

1. **Start broad:** `Tell me what the tech stack of this repo is and what its intended purpose is.`
2. **Dig deeper** with targeted follow-ups, noting what Claude checks for each:
   - `How does PPP (Purchasing Power Parity) work in this repo?`
   - `What user roles and permission levels exist in this application?`
   - `Where is the authentication and authorization logic?`
   - `How does the React Router setup work specifically?`
   - `What does the database schema look like?`
3. **Find hidden details** — the app uses React Router, which has three modes:
   `Which React Router mode is this app using, and how can you tell from the codebase?`

> [!NOTE] Validate your understanding
> Afterward, write down: the app's main purpose, the key tech-stack technologies, how users and
> permissions are structured, and which React Router mode it uses and why that matters.

## Workflow Recommendation

Before building any feature in an unfamiliar repo, run at least one `explore ...` prompt targeted at the area you are about to change. The subagent's summary is dense and usually accurate enough to plan against — and you pay the context cost up front rather than discovering surprises mid-implementation.
