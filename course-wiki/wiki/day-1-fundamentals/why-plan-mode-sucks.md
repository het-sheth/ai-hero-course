---
title: Why Plan Mode Sucks
topic: day-1-fundamentals
status: learning
created: 2026-06-13
updated: 2026-06-13
lede: "Plan mode (shift-tab) makes the agent plan before writing — good in theory, but it truncates the interview and hands you a wall-of-text plan you can't tell you're aligned with. The fix: explore → interview hard (the missing 'shared design concept') → implement. Matt's /grill-me skill does the interview."
desc: "Plan mode skips the shared design concept. Better: explore → interview (grill-me) → implement."
tags: [claude-code, plan-mode, planning, grill-me]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/day-1-fundamentals/why-plan-mode-sucks.md
related: [build-a-feature, grill-execute-clear, constraints-of-llms]
first_seen: log/2026-06-13
first_seen_label: 2026-06-13 · Day 1 Fundamentals
order: 7
---

Matt used to recommend **plan mode** enthusiastically; he no longer does. (You saw the agent
auto-enter it during [[build-a-feature|Build A Feature]].)

## What plan mode does

Access it by **shift-tab**. In the default *implement mode* the agent can do four things: write
files, read files, run bash, call MCP servers. **Plan mode removes writing files** — it can still
read, run bash, and call MCP, but can't change your codebase. The idea: plan before implementing.

## Why planning is genuinely good

- Talking through what you're building deepens *your* understanding and aligns you with the agent.
- A deliberate step **forces exploration** — the agent gathers repo context before implementing.
- It produces a plan saved as a markdown doc; the agent trusts it enough to often ask *"clear the
  context before implementing?"*

Ideal phases: **(1) prompt → (2) explore → (3) interview + plan.**

## Where it breaks: the truncated interview

In practice phase 3 collapses — the agent explores, asks **one or two questions**, then dumps a
**wall-of-text plan**. You skim it, miss a misalignment, and hit the classic failure mode: *the
agent didn't build what you wanted* — sometimes via tiny details with massive knock-on effects.

> [!NOTE] The shared design concept
> Frederick P. Brooks (*The Design of Design*) calls this lacking a **shared design concept** — not
> an asset or a plan, but the *ephemeral understanding shared between collaborators*. You and the
> agent have a communication gap; you must establish that shared concept **before** implementing.
> Plan mode skips this stage entirely.

## A better approach

> [!TIP] Explore → Interview → Implement
> Put the weight on the **interview** — that's where the shared design concept gets solid (it can
> take a while). Matt's **`/grill-me`** skill relentlessly interviews you until you're genuinely
> ready: still planning, but not eager to spit out a document. It fills the context window with
> valuable intent you can turn into a spec or take straight to implementation. Almost every one of
> his sessions starts with `/grill-me`.

Next: [[grill-execute-clear|the Grill → Execute → Clear loop]] puts this into practice.
