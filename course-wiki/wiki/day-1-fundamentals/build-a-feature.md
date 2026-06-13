---
title: Build A Feature
topic: day-1-fundamentals
status: learning
created: 2026-06-13
updated: 2026-06-13
lede: "Your first feature with Claude Code: a course star-rating system. The goal isn't a perfect feature — it's observing Claude's default behavior (does it spawn an Explore subagent? what does it ask?) and practising context paranoia, watching /context for the ~40% dumb-zone line."
desc: "First feature (star ratings) — observe Claude's default workflow and watch /context for the 40% dumb-zone line."
tags: [claude-code, workflow, context, feature]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/day-1-fundamentals/build-a-feature.md
related: [codebase-exploration, constraints-of-llms, subagents]
first_seen: log/2026-06-13
first_seen_label: 2026-06-13 · Day 1 Fundamentals
order: 4
---

## The exercise: a star-rating system

Having [[codebase-exploration|explored the repo]], you build your first feature: a **course review
system** where students leave a **1–5 star rating** (no written reviews). The average rating shows
on the courses list page and the course detail page. It's chosen because it's meaty enough to touch
all areas of the codebase, but not so complex the UI gets overwhelming.

> [!NOTE] What this is really about
> Not building the perfect feature first try — it's about learning the prompting workflow,
> **observing what Claude naturally does**, and iterating. And practising *context paranoia* as you
> build.

## The workflow

1. **Start fresh** — open Claude Code, or `/clear` an existing session.
2. **Prompt lightly** — 1–2 sentences, just enough to point Claude in the right direction. Matt's:

   ```text title="initial prompt"
   I would like to create a course review system where students can review
   courses by leaving a star rating. We don't want to add written reviews,
   just star rating. These reviews will then be visible everywhere that
   courses are visible. We want to show the average rating on the courses in
   the list page and on the course page itself.
   ```
3. **Observe, don't drive** — watch what Claude does: Does it spawn an [[subagents|Explore subagent]]?
   What files does it read first? What questions does it ask? Take notes.
4. **Review the plan** — read the steps, files, and verification it proposes. Push back if it
   doesn't match your vision (e.g. you don't want ratings on the dashboard) — steer *before*
   implementation.
5. **Build** — once the plan looks right, flip to "accept all edits" mode (**shift+tab** cycles
   submission modes) so it moves faster. It handles schema changes, service functions, route
   updates, UI components, migrations, and setup commands.

## Context paranoia

Run `/context` repeatedly as you go — it shows a bar chart of token consumption for the main
orchestrator agent.

> [!CAUTION] The 40% line
> Around **40% usage (~80K tokens)** of the orchestrator's window is when to start getting nervous
> about the [[constraints-of-llms|dumb zone]]. At that point, ask Claude to summarize what's left,
> wrap up the current phase, or start a fresh session. (See [[constraints-of-llms]] for why.)

## Testing the feature

- **As an enrolled student:** on a course detail page you should see a rating widget in the sidebar.
  Click a star → a toast confirms the save and the average updates immediately. Click a different
  star → it updates (upsert) without errors.
- **Courses list (`/courses`):** the average rating shows on course cards next to the instructor
  name — a filled star icon, then the rating and count.
- **Other user types:** a non-enrolled user sees the rating display but no submit widget; an
  instructor sees no rating widget on their own course.

## When it breaks

Describe the problem to Claude in plain language — what you expected vs. what happened — rather than
fixing it yourself; that conversation is part of the natural build cycle. Check `/context` again; if
you're low, wrap up or start a fresh session for the next phase.

> [!NOTE] Solution sub-page
> The course has a separate **Solution** walkthrough for this lesson (commit `03.04.01` — "built
> star ratings"). Its content isn't captured here yet.
