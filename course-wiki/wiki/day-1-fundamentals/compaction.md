---
title: Compaction
status: learning
created: 2026-06-14T00:00:00.000Z
desc: >-
  Claude Code summarizes a full conversation into a smaller form so a session
  can keep going — but repeated compaction leaves "sediment". Prefer clean
  context.
tags:
  - claude-code
  - context
  - compaction
  - workflow
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - raw/day-1-fundamentals/compaction.md
related:
  - /day-1-fundamentals/constraints-of-llms.md
  - /day-1-fundamentals/grill-execute-clear.md
  - /day-1-fundamentals/showing-context-in-status-line.md
  - /day-1-fundamentals/handing-off.md
first_seen: log/2026-06-14
first_seen_label: 2026-06-14 · Day 1 Fundamentals
order: 9
type: concept
description: >-
  Compaction is Claude Code's mechanism for turning a large conversation into a
  smaller LLM-written summary so the session can keep going past the context
  limit. Understand it — but don't build your workflow on it: repeated
  compaction leaves "sediment" that makes output less predictable. Prefer clean
  context and clear handoffs.
timestamp: 2026-06-14T00:00:00.000Z
---

> [!NOTE] The key idea
> **Compaction** is Claude Code's mechanism for turning a large conversation into a smaller summary
> so the session can keep going after the context window fills up. It's useful to understand — but
> it is **not** the workflow this course optimizes for.

This is the "open the lid" lesson: what actually happens when a session runs all the way through the
[dumb zone](/day-1-fundamentals/constraints-of-llms.md) to the context limit (~200k tokens in a
single session).

## What happens at the context limit

A session starts with plenty of room. As you work, the conversation fills with prompts, tool calls,
code, summaries, and implementation details, and creeps out of the smart zone toward the limit.

Claude Code reserves part of the window as an **auto-compact buffer** — in the lesson, **33k tokens
(~16.5%)** sitting at the far end of `/context`. It holds no tokens and doesn't affect the LLM; it's
a stopgap. When the session crosses into that reserved region, Claude Code automatically runs
**compact**.

> [!NOTE] What compaction actually is
> It takes the large "wodge" of context — repeated tool calls, stuff that doesn't need to be there —
> and asks **an LLM to summarize the useful parts** into a much smaller form. Because an LLM does the
> summarizing, **compaction itself costs tokens** (though re-exploring the repo from scratch would
> cost tokens too).

## What compacting preserves

When you compact, Claude Code tries to keep the important context:

- what was implemented
- which files were touched
- what the user asked for (it preserves the user messages)
- pending tasks
- useful references to files or plans (a file may be *referenced* even if its contents aren't kept)
- any extra instructions you provide before compacting

You also get to pass **custom summarization instructions** — Matt uses these to tell the LLM *why*
he's compacting, i.e. what he's about to do next. His example: *"I've just implemented a feature and
I want to do some QA on it."* That one line gives the summarizer a much better chance of preserving
the context the next step needs.

> [!TIP] What it looks like in practice
> In the lesson, a session at **49%** (lesson comments implemented: table, comment service, lesson
> page, add/delete actions, comment section + card components) compacts down to a markdown summary —
> just bullet points and a few code samples, plus the file references and a pending "QA the feature"
> task. `Ctrl-O` shows the full summary; the **full prior transcript is also saved to a file** and
> referenced, so nothing is truly lost. After compaction `/context` reads **12% (~23k tokens)**.
> (There's a display bug where the status line still shows the *original* context immediately after.)

## Why clearing is usually better

So why clear at all — why not just ride the context up, hit the auto-compact buffer, zoom down, and
repeat forever?

Because every compaction leaves a little **sediment** in the context. Compact repeatedly and those
summaries layer up — the agent starts each stretch from compressed leftovers of earlier (sometimes
unrelated) work, which shifts it into a different state and makes output less predictable.

Optimizing for **clean context** instead gives you:

- more time in the smart zone (more smart zone to work with, less dumb zone)
- fewer tokens spent on summarization
- more predictable agent behavior → higher code-quality outputs
- cleaner separation between tasks

This is the same instinct behind the [grill → execute → **clear**](/day-1-fundamentals/grill-execute-clear.md)
loop: design in one clean session, implement, then clear before the next task.

> [!IMPORTANT] Compacting multiple times = anti-pattern
> Repeated compaction across a conversation is, in Matt's view (and much of the community's), an
> anti-pattern — those "gunky layers of sediment" carry unrelated assumptions forward. Organize your
> setup/harness so you rarely *need* to compact. *(He flags this is opinion — some prominent people
> say just ride the auto-compact buffer and never think about context. Tooling may also improve
> compaction over time.)*

## When compaction is genuinely useful

It still earns its place in a few cases — and notice they're all times you're **working with the LLM
directly**, in the conversation:

- You just finished a **large implementation** and want to add focused feedback without making the
  agent re-explore everything.
- A **long debugging session** where your context holds everything you've already tried — compact,
  tell the LLM "we tried these, now try more," and keep going rather than clearing back to nothing.

Matt compacts **rarely — usually once per conversation at most**, on a difficult long-running task
where he wants to stay in the smart zone and add a bit of extra feedback. (He admits he "usually
feels bad about it afterwards.")

The course's direction is different: toward workflows where the agent runs **more autonomously** —
clear setup, clean context, less sitting there managing the conversation. Relying on compaction
means relying on *you* being present to trigger it, which is the opposite of where this is going.
Next: [handing off](/day-1-fundamentals/handing-off.md) cleanly between clean-context sessions.
