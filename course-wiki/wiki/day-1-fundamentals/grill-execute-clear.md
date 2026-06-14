---
title: Grill → Execute → Clear
status: learning
created: 2026-06-14T00:00:00.000Z
desc: The core working loop for a session — grill-me to design, execute, then clear.
tags:
  - claude-code
  - workflow
  - grill-me
  - planning
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - raw/day-1-fundamentals/grill-execute-clear.md
related:
  - /day-1-fundamentals/why-plan-mode-sucks.md
  - /day-1-fundamentals/build-a-feature.md
  - /day-1-fundamentals/codebase-exploration.md
  - /day-1-fundamentals/compaction-and-handing-off.md
first_seen: log/2026-06-14
first_seen_label: 2026-06-14 · Day 1 Fundamentals
order: 8
type: concept
description: >-
  The core session loop: grill (interview hard with /grill-me to reach a shared
  design concept) → execute (implement against that understanding) → clear (wipe
  context for the next task). Practised by designing a lesson-comments feature
  before writing any code.
timestamp: 2026-06-14T00:00:00.000Z
---

The loop that replaces [plan mode](/day-1-fundamentals/why-plan-mode-sucks.md): **grill → execute →
clear**. You design *first* by being interviewed, implement against that shared understanding, then
clear the context before the next task.

## The exercise: a lesson comments feature

Build a **lesson comments system** — students can comment on lessons. It's deliberately left vague,
so you have to spend time with the agent figuring out what it actually means. The open questions are
interconnected:

- Should instructors be able to comment?
- Can they moderate?
- Can they delete or hide comments?
- Are comments visible to everyone, or only to enrolled students?
- Can students see other people's comments?
- Are comments visible to anyone looking at the course?

These decisions matter, and they depend on each other — exactly the kind of design tree the
`/grill-me` skill is built to walk.

## The `/grill-me` skill

The whole skill is tiny. Its instruction is essentially:

> [!NOTE] The entire skill
> Interview me relentlessly about every aspect of this plan until we reach a shared understanding.
> Walk down each branch of the design tree, resolving dependencies between decisions one by one.
> For each question, provide your recommended answer. Ask the questions **one at a time**, and if a
> question can be answered by exploring the code base, **explore the code base instead**.

Two details do a lot of work here:

- **"Ask one at a time" + "recommended answer"** — you're never staring at a wall of questions, and
  you can often just accept the recommendation and keep moving.
- **The "explore" verb** — it won't ask you anything it could check itself; it goes out and reads
  the repo (see [Codebase Exploration](/day-1-fundamentals/codebase-exploration.md)), so the
  interview stays focused on genuine *intent*.

This is the opposite of plan mode's truncated interview: the weight is on building the **shared
design concept** before any code exists.

## Steps to run it

1. **Start a new session.** Use the **default mode** — not plan mode, not auto mode. Toggle accept-edits
   *off* for now.
2. **Load the skill.** It lives at `.claude/skills/grill-me/SKILL.md`. Invoke `/grill-me`.
3. **Get grilled.** Answer the agent's questions honestly — there are no wrong answers. Let it walk
   the design tree and resolve dependencies in order.
4. **Take notes as you go:**
   - Observations on *how* it designs — does it ask the right questions? Resolve dependencies in a
     logical order?
   - Improvements you'd make to the skill — it's simple, not perfect.
5. **Reach a shared understanding.** Continue until you both agree what the feature is. The agent
   will signal it: *"okay, we're ready to implement, let's go."*
6. **Execute.** Implement the feature and check whether what's produced matches the understanding
   you reached.

> [!TIP] Treat it as a sandbox
> The point isn't a perfect comments feature — it's *feeling* the loop. Mess about with grill-me,
> watch how the interview fills the context window with valuable intent, then turn that into an
> implementation.

## Where this sits

- **Grill** — `/grill-me` (this lesson), the fix for the
  [missing shared design concept](/day-1-fundamentals/why-plan-mode-sucks.md).
- **Execute** — implement against the shared understanding, like the first
  [Build A Feature](/day-1-fundamentals/build-a-feature.md) exercise.
- **Clear** — wipe context before the next task; covered next in
  [Compaction & handing off](/day-1-fundamentals/compaction-and-handing-off.md).

> [!NOTE] Matt's solution
> Matt's own run (commit `03.08.02`) shipped lesson comments **with soft-delete and moderation**
> built in — a concrete answer to the "can instructors moderate / delete?" branches of the design
> tree.
