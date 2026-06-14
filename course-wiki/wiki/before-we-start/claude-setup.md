---
title: Setting Up Claude For The Course
status: learning
created: 2026-06-02T00:00:00.000Z
tags:
  - claude-code
  - models
  - setup
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - 'https://code.claude.com/docs/en/setup'
related:
  - /before-we-start/repo-setup.md
  - /gtk-claude-code/managing-your-session.md
first_seen: log/2026-06-02
first_seen_label: 2026-06-02 · Before We Start
order: 4
type: concept
description: >-
  Picking the agent, model, effort level, and subscription tier for the cohort.
  Short version: use Claude Code on your tier's default model at medium effort.
timestamp: 2026-06-02T00:00:00.000Z
---

## Which agent

The course works with **any CLI-based coding agent**, but Matt uses and recommends **Claude Code**
— especially if you've never used a coding agent before.

## Which model

Set it with `/model`. The recommendation is to **go with the defaults**, which differ by
subscription tier:

| Tier | Default model | Note |
|------|---------------|------|
| Pro | Sonnet 4.6 | Good enough to get through the course |
| Max 5× | Opus 4.6 | What the course was built on |
| Max 20× | Opus (highest) | More headroom on usage |

> [!CAUTION] Don't use Haiku
> Matt explicitly recommends **not** using Haiku at any point in the course — it's fast but not
> capable enough for the workflows you'll throw at it.

## Effort level

Choose **medium** effort (adjustable low ↔ high). The guidance is to take whatever the harness
defaults to — defaults are tuned by Anthropic's internal evals and medium is fine for most work.

## Which subscription

No universal recommendation — it depends on your cost constraints and how much you'll use it.

- **Max 5×** — if you want the best model (Opus), this is what the course was made on; worth it even
  for a single month.
- **Pro** — Sonnet is good enough to complete the course, though you *may* hit usage limits if you
  dive deep into every lesson.

> [!NOTE] Editor's note (models move)
> The specific model versions have changed since the course was first recorded, but the **tiers and
> the underlying idea haven't**: every provider has an Opus-level top model, a mid-tier model, and a
> cheap Haiku-level model. Pick the top or mid model, skip the cheap one. Unsure about agent/model
> setup? Ask in the Discord.
