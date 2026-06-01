# Design: course-wiki (AI Coding for Real Engineers second brain)

**Date:** 2026-06-01 · **Status:** implemented (MVP)

## Goal

A living second brain for Matt Pocock's *AI Coding for Real Engineers* cohort, as a set of
interlinked, self-contained **HTML** pages (Karpathy "LLM wiki" feel + Thariq's
[*Unreasonable Effectiveness of HTML*](https://www.anthropic.com/engineering/unreasonable-effectiveness-of-html)),
authored through a reusable `/course-wiki` skill. Designed to outlive the cohort.

## Key decisions

| Decision | Choice |
| --- | --- |
| Purpose | Living second brain (grows beyond the course) |
| Authoring | A reusable skill (`/course-wiki`), kept **global + local** |
| Location | `~/projects/ai-hero-course/` — outside the `~/Developer` GHE workspace (org rule: no github.com clones there) |
| Hosting | Local now, GitHub-Pages-ready (relative links + shared CSS) |
| Remote | Public repo `het-sheth/ai-hero-course` (shareable with colleagues) |
| Cohort repo | Forked to `het-sheth/cohort-004-project`, cloned in-tree, gitignored |
| Structure | Hybrid: atomic concept pages backbone + dated course log threading through |
| Style | One shared `assets/wiki.css` (consistency + content-only diffs); never inline |
| **Content source** | **Only material Het shares — never invented.** Every page cites sources. |

## The content rule (most important)

An early draft auto-generated a plausible but fabricated concept page. That is the failure mode to
avoid. Pages are built **only** from lesson material / Het's notes / what he says. Missing material →
skeleton + "awaiting notes", or a stub card. The skill enforces this.

## Layout

```
course-wiki/
  index.html              hub: "The process" + module groups + dated log
  assets/wiki.css         design system (only style source)
  meta/style-guide.html   component reference
  meta/concept-template.html  skeleton to copy
  concepts/<slug>.html    atomic concept pages
  log/YYYY-MM-DD.html      dated study log
```

Course "Day N" labels are **concept groups** on the hub; the **log is dated** (separates "course
Day 1 Fundamentals" from "my first calendar day").

## MVP shipped

- Design system (`wiki.css`) + `style-guide.html` + `concept-template.html`.
- Hub with all 8 course modules (stubs) + "The process" group.
- First real concept: `seven-phase-process.html` (from lesson 01.01).
- First log entry: `2026-06-01.html` (setup + lessons 01.01, 01.02).
- `/course-wiki` skill (global + local).

## Deferred (YAGNI)

`wiki.js` search/backlinks, automated link-checker, theme toggle, hosting wiring.
