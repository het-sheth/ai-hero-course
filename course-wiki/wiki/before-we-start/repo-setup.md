---
title: Repo Setup
topic: before-we-start
status: how-to
created: 2026-06-01
updated: 2026-06-09
lede: "Getting the course playground running locally: clone the repo, install Node + pnpm, seed the database, run the dev server, and connect an agent."
tags: [setup, pnpm, playground]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - "https://github.com/ai-hero-dev/cohort-004-project"
  - raw/before-we-start/repo-setup.md
related: [database-migrations, claude-setup, process/seven-phase-process]
first_seen: log/2026-06-01
first_seen_label: 2026-06-01 · Before We Start
order: 1
---

## 1 · Clone the repository

From the [cohort-004 project](https://github.com/ai-hero-dev/cohort-004-project), press
*Code → HTTPS*, copy the URL, then clone and `cd` in:

```bash title="terminal"
git clone https://github.com/ai-hero-dev/cohort-004-project.git
cd cohort-004-project
```

> [!NOTE] My setup
> I cloned my **fork** instead ([het-sheth/cohort-004-project](https://github.com/het-sheth/cohort-004-project)),
> with `upstream` pointed at the course org for `reset` / `cherry-pick` / `pull`.

## 2 · Install Node.js

Download from [nodejs.org](https://nodejs.org/en/download) — **v22 or v24**, either works. Then verify:

```bash title="terminal"
node -v   # should print a version number
```

## 3 · Set up the package manager

Enable `pnpm` (faster than npm, saves disk space) via corepack, then verify:

```bash title="terminal"
corepack enable
pnpm -v   # should print a version number
```

## 4 · Install dependencies

```bash title="terminal"
pnpm install
```

Downloads all required packages into `node_modules`.

## 5 · Seed the database

```bash title="terminal"
pnpm db:seed
```

Creates the tables and populates them with sample data. The project is a course platform, so the
DB includes users, courses, categories, quizzes, enrollments, lesson-progress records, quiz
attempts, video-watch events, and more.

## 6 · Run the dev server

```bash title="terminal"
pnpm dev          # runs on http://localhost:5173 (or similar)
```

Visit the URL — you'll see the **Cadence** video platform. Click *Courses* to see what's available.
There's a **dev UI at the bottom of the page** to log in as different users. Press `CTRL-C` to stop
the server when done.

## 7 · Install & connect your agent

The course works with any CLI-based agent. For Claude Code, follow the
[Claude Code setup docs](https://code.claude.com/docs/en/setup), then:

```bash title="terminal"
claude            # opens the agent (log in with API key / subscription)
# type "hello" — it should reply
```

> [!TIP] Stuck?
> Setup problems go to the [AI Hero Discord](https://aihero.dev/discord) — `#cohort-004-questions`.
