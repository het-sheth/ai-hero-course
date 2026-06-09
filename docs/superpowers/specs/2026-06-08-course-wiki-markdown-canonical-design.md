# course-wiki → Markdown-Canonical (Karpathy-style) — Design

**Date:** 2026-06-08
**Status:** approved (brainstorm complete)
**Repo:** `~/projects/ai-hero-course` (personal, github.com/het-sheth/ai-hero-course)

## Problem

The course-wiki is currently **HTML-canonical**: every concept/log page is hand-written
`.html` (after Thariq's *Unreasonable Effectiveness of HTML*). Two costs:

1. **LLMs can't easily "talk to" it** — they must wade through HTML markup to read the
   knowledge base.
2. Diffs are noisy and authoring is heavy.

Het wants two things at once:
- **Colleagues/humans** keep seeing the live rendered site exactly as it looks now.
- The **actual knowledge base** becomes a Karpathy-style Markdown wiki so **any LLM can read
  and contribute to it directly**.

## Solution: two layers, one build step

Adopt the **research-wiki** (`~/projects/research-wiki`) Markdown-canonical pattern, in place,
keeping everything inside the `ai-hero-course` repo.

- **Source layer (canonical):** Markdown + YAML frontmatter. This is what LLMs and Het edit.
- **View layer (generated):** HTML built into `site/` by `build.mjs`. Never hand-edited;
  gitignored. This is what colleagues browse.
- The repo is **self-describing**: a `START_HERE.md` entry point + `CONVENTIONS.md` schema mean
  any LLM that clones the repo can read and author pages without Het's personal `/course-wiki`
  skill.

## Decisions (locked during brainstorm)

| Decision | Choice |
|----------|--------|
| Migration style | Migrate **in place**, stay in `ai-hero-course` repo |
| "topic" maps to | **course module** (preserves the existing hub grouping) |
| HTML publishing | **Auto-build in CI** — GitHub Actions builds + deploys to Pages; `site/` gitignored |
| Hub roadmap | **Keep the full roadmap** — future lessons rendered as `status: stub` cards |
| Source material | **Add a `raw/` layer** — transcripts/notes dropped in, cited by pages |
| Status vocabulary | `stub \| learning \| solid` |
| Self-describing repo | Add `START_HERE.md` + `CONVENTIONS.md` |

## Directory layout (target)

```
course-wiki/
  START_HERE.md              # LLM entry point
  CONVENTIONS.md             # frontmatter schema + body rules + no-invention rule
  topics.json                # 9 modules, ordered, with titles/subtitles
  build.mjs  package.json    # generator (marked@12 + gray-matter@4)
  assets/wiki.css            # UNCHANGED phosphor theme
  wiki/<module>/<slug>.md    # atomic concept pages  ← source of truth
  log/<date>.md              # dated entries
  raw/<module>/              # immutable source material (cited by pages)
  site/                      # GENERATED, gitignored
  meta/style-guide.html      # kept as a static human reference (not generated)
```

**Modules (= topics), in order:** `process`, `before-we-start`, `gtk-claude-code`,
`day-1-fundamentals`, `day-2-steering`, `day-3-planning`, `day-4-feedback-loops`,
`day-5-afk-agents`, `day-6-hitl`.

## Class-compatibility (verified)

The course-wiki phosphor `wiki.css` uses the **same class names** the research-wiki generator
emits (`card`/`card-title`/`card-desc`/`cards`/`group`/`group-sub`/`callout`/`code-block`/
`code-head`/`meta-row`/`tag`/`related`/`refs`/`timeline`/`lede`/`crumb`/`brand`/`spacer`/`sep`/
`wrap`/`wrap--wide`/`foot`/`day`/`day-body`/`day-title`). So `build.mjs` ports nearly verbatim;
the only emission change is adding the `stub` class to roadmap cards/pages.

## Content to port (faithful — no invention)

- **6 concept pages** → Markdown:
  - `process/seven-phase-process`
  - `before-we-start/{repo-setup, database-migrations, exercise-workflow, claude-setup}`
  - `gtk-claude-code/managing-your-session`
- **4 logs** → `log/2026-06-0{1..4}.md`
- **32 roadmap stubs** (`status: stub`) using the one-line teasers already on the hub.

Conversions: callouts `<div class="callout X">` → `> [!TIP/NOTE/WARNING/CAUTION]`;
`<div class="code-block">` → fenced ```` ```lang title="…" ````; `Related`/`References` →
frontmatter `related:`/`sources:` (the generator regenerates those sections); inline `<svg>`
diagrams pass through verbatim inside the Markdown body.

## Publishing (CI)

`.github/workflows/pages.yml`: on push to `main`, `npm ci && npm run build` inside `course-wiki`,
upload `course-wiki/site` as the Pages artifact, deploy. **One-time:** flip the Pages source from
"Deploy from branch" → "GitHub Actions" (via `gh` if authed for github.com, else Het clicks it
once). Public URL `het-sheth.github.io/ai-hero-course/` is unchanged; the old root redirect
`index.html` is retired (the uploaded artifact root becomes the site root).

## The `/course-wiki` skill

Both copies (global `~/.claude/skills/course-wiki/SKILL.md` + repo-local
`.claude/skills/course-wiki/SKILL.md`, kept identical) rewritten to document the **Markdown**
workflow. The inviolable **never-invent-content** rule stays the heart of it.

## Verification

- `npm run check` reports **0 broken `[[wikilinks]]`/`related:`** before any commit.
- Local build + open `site/index.html`; confirm it matches the current live site.
- Branch `wiki/migrate-markdown-canonical` → PR → squash-merge (`main` is protected).

## Non-goals (YAGNI)

- No CSS/theme redesign — `wiki.css` is unchanged.
- No new content authored — this is a structural migration only.
- No search, tags index, or graph view — not requested.
