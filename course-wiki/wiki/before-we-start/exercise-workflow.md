---
title: Exercise Workflow
status: learning
created: 2026-06-03T00:00:00.000Z
tags:
  - workflow
  - git
  - exercises
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - 'https://github.com/het-sheth/cohort-004-project'
  - raw/before-we-start/how-to-take-this-course.md
related:
  - /before-we-start/repo-setup.md
first_seen: log/2026-06-03
first_seen_label: 2026-06-03 · Before We Start
order: 3
type: concept
description: >-
  The course is interactive exercises in the playground — to do one yourself you
  get your repo into the same state it was when the exercise was recorded. Three
  commands handle this: pnpm reset, pnpm cherry-pick, and pnpm pull.
timestamp: 2026-06-09T00:00:00.000Z
---

## The three commands

| Command | Purpose |
|---------|---------|
| `pnpm reset` | Completely reset your work to the recorded state |
| `pnpm cherry-pick` | Bring in a course commit while *preserving* your work |
| `pnpm pull` | Pull upstream changes the instructor pushes during the course |

<figure>
  <div class="diagram">
    <svg viewBox="0 0 620 150" role="img" aria-label="Decision guide for reset, cherry-pick, pull">
      <g font-size="12" text-anchor="middle">
        <rect x="10"  y="20" width="190" height="44" rx="8" fill="#ffb000" opacity="0.10" stroke="#ffb000"/>
        <text x="105" y="40" font-weight="700" fill="#ffb000">pnpm reset</text>
        <text x="105" y="56" font-size="10" fill="#9aa0a8">want the exact recorded state</text>

        <rect x="215" y="20" width="190" height="44" rx="8" fill="#58c7f3" opacity="0.10" stroke="#58c7f3"/>
        <text x="310" y="40" font-weight="700" fill="#58c7f3">pnpm cherry-pick</text>
        <text x="310" y="56" font-size="10" fill="#9aa0a8">have work to preserve</text>

        <rect x="420" y="20" width="190" height="44" rx="8" fill="#5af78e" opacity="0.12" stroke="#5af78e"/>
        <text x="515" y="40" font-weight="700" fill="#5af78e">pnpm pull</text>
        <text x="515" y="56" font-size="10" fill="#9aa0a8">stay up to date</text>
      </g>
      <g font-size="10.5" text-anchor="middle" fill="#c2c7d0">
        <text x="105" y="96">🗑️ destructive —</text><text x="105" y="110">deletes your changes</text>
        <text x="310" y="96">🛟 keeps your changes;</text><text x="310" y="110">may merge-conflict</text>
        <text x="515" y="96">⬇️ fetches instructor</text><text x="515" y="110">updates into your branch</text>
      </g>
    </svg>
  </div>
</figure>

*Pick by intent: match recorded state, preserve work, or sync updates.*

## `pnpm reset` — jump to a checkpoint

Running it lists commits spanning the whole course history. Reset to **main** (the starting point)
or to a **future commit** to jump ahead. Navigate with up/down arrows, or search by name (e.g.
`grill me`) or number (e.g. `04.05.01`).

You **can't reset the `main` branch directly** — it prompts you to make a new branch (e.g. `dev`,
your working branch for the course). Two things then happen at once: you switch to the new branch,
and the repo moves to that commit.

> [!NOTE] The demo
> On `main`, `package.json` reads *"awesome horse platform"*. Resetting to checkpoint `01.01.01`
> creates branch `dev` at the commit that fixed it to *"awesome course platform"*. `git status`
> shows `dev`; `git log` shows the fix commit.

> [!CAUTION] Gotcha — reset is destructive
> `pnpm reset` **deletes existing work** when it finds it — it resets the entire branch to the exact
> recorded state. Add a `pizza` script, commit it, then reset, and the pizza script is gone. Great
> for matching the instructor exactly; bad if you have work to keep.

## `pnpm cherry-pick` — keep your work

If you have changes to preserve, cherry-pick the course commit on top of them instead. If your
edits don't collide, it just works (e.g. your `pizza` script survives while the `package.json`
description gets fixed).

> [!TIP] Merge conflicts are fine
> If your change collides (e.g. you set *"awesome frog platform"* and the course commit sets
> *"awesome course platform"*), you get a merge conflict. Ask Claude to *"fix this merge conflict"*
> and it'll guide you — or bail with `git cherry-pick --abort`, which leaves your work intact.

## `pnpm pull` — stay current

The instructor pushes updates during the course (fixes, package bumps), so your `dev` branch drifts
from what's prepared. `pnpm pull` is like `git pull` but fetches from the parent/upstream repo into
your branch — it preserves everything (it's **not** a reset). Any merge conflicts? Ask Claude to
fix them.
