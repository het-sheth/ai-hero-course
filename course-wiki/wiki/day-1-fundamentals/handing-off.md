---
title: Handing Off
status: learning
created: 2026-06-14T00:00:00.000Z
desc: >-
  /handoff compacts the current conversation into a temp markdown doc a fresh
  agent can pick up — clean-context continuation without compaction sediment.
tags:
  - claude-code
  - context
  - handoff
  - skills
  - workflow
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - raw/day-1-fundamentals/handing-off.md
related:
  - /day-1-fundamentals/compaction.md
  - /day-1-fundamentals/grill-execute-clear.md
  - /day-1-fundamentals/constraints-of-llms.md
  - /day-1-fundamentals/subagents.md
first_seen: log/2026-06-14
first_seen_label: 2026-06-14 · Day 1 Fundamentals
order: 10
type: concept
description: >-
  /handoff writes a tailored markdown doc summarising the current conversation
  so a fresh agent can continue in a clean context window — the clean-context
  alternative to compaction's sediment. Enables "expand then contract" flows:
  spin a side task into its own window, then condense the result back.
timestamp: 2026-06-14T00:00:00.000Z
---

The final Day 1 lesson, and the answer to a problem [compaction](/day-1-fundamentals/compaction.md)
leaves open. Clearing context avoids sediment — but what if you're **halfway through a session** and
discover a side task (a file to update, a test to fix)?

## The problem: a side task with no budget

You're mid-session on your main task ("blue"). You spot a small unrelated task ("yellow") — a bug, a
failing test. Two bad options:

- **Do it now, inline** — but you don't know how long yellow takes; it might burn the budget you
  needed for blue.
- **`/clear` and start fresh** — wrong, because you still need blue's context to finish blue.

The insight: **yellow needs its own context window.** It doesn't need blue's context at all — you
just happened to discover it during blue. So compact *blue* into a separate window: blue can keep
growing in its own window, and yellow's fix completes in a clean one.

## The `/handoff` skill

Matt first called this `/compact-to-file`, then settled on the snappier **Handoff**. It writes a
temporary markdown file you pass between agents. This is the entire skill (cohort repo commit
`03.10.01`, verbatim):

```markdown title=".claude/skills/handoff/SKILL.md"
---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it to a path produced by `mktemp -t handoff-XXXXXX.md` (read the file before you write to it).

Suggest the skills to be used, if any, by the next session.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
```

What each line buys you:

- **Saves to a temp location** — `mktemp -t handoff-XXXXXX.md`, a file in your temp directory (not
  committed clutter).
- **Suggests the next skills** — crucially, if you were doing a `/grill-me`, it tells the next
  session to continue with `/grill-me`. The workflow survives the handoff.
- **Doesn't duplicate** — it won't re-summarise PRDs, plans, ADRs, issues, commits, or diffs; it
  **references them by path/URL** so the doc stays small and the source of truth stays single.
- **Tailors to the next session** — the `argument-hint` ("What will the next session be used for?")
  means you pass what comes next and the doc is written *for that*. A handoff aimed at "fix this
  test" looks different from one aimed at "keep grilling the auth design."

> [!NOTE] Handoff vs. compaction
> Compaction summarises a conversation **to keep the same session going** — and leaves
> [sediment](/day-1-fundamentals/compaction.md) if repeated. Handoff summarises a conversation **to
> start a clean new session**, dodging the sediment entirely. It's compaction's output without
> compaction's downside.

## Two patterns

**1. Spin off a bug/test fix.** Mid-implementation you find a broken test. Say *"hand off, let's do a
separate session to fix that test."* `/handoff` generates the doc; you open a new agent session with
it and fix the test in a clean window — your main session's budget is untouched.

**2. Expand then contract (planning).** A [`/grill-me`](/day-1-fundamentals/grill-execute-clear.md)
session gets long and there's one specific part that needs deep work. Hand off to a new session that
grills *just that*, maybe builds a prototype, burns a ton of context, does research — then **hand off
back** to the original, condensing everything learned into a small doc.

> [!TIP] The core move
> `/handoff` enables "obscenely powerful" **expand → contract** flows: blow context out wide in a
> throwaway window, then pass back only the distilled result. Documents shuttle between agents; no
> single window has to hold everything. (Compare [subagents](/day-1-fundamentals/subagents.md), which
> do the same fan-out/condense within one orchestrator session.)

## When to reach for it

The headline use: **a grilling session drifting into the
[dumb zone](/day-1-fundamentals/constraints-of-llms.md).** More generally, whenever you feel yourself
running out of context window — hand off to a fresh one to fix a bug or just to keep going on the same
thing. Handoff patterns recur throughout the rest of the course.

> [!NOTE] Day 1 complete
> This closes Day 1 · Fundamentals. The through-line: respect the context window
> ([smart vs. dumb zone](/day-1-fundamentals/constraints-of-llms.md)), design before you build
> ([grill → execute → clear](/day-1-fundamentals/grill-execute-clear.md)), and manage context
> deliberately — prefer clean starts, [compact](/day-1-fundamentals/compaction.md) sparingly, and
> **hand off** when a clean window serves you better than a growing one.
