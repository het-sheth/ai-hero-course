# ai-hero-course

My workspace and living-second-brain wiki for Matt Pocock's
[**AI Coding for Real Engineers**](https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04)
cohort (004, June 2026).

## What's here

| Path | What it is |
| --- | --- |
| [`course-wiki/`](course-wiki/index.html) | The wiki — rich self-contained HTML pages. Open `course-wiki/index.html` in a browser. |
| `.claude/skills/course-wiki/` | Local copy of the `/course-wiki` skill that maintains the wiki (also installed globally). |
| `cohort-004-project/` | The forked exercise repo (gitignored here — it's its own repo). |
| `docs/` | Design notes for this workspace. |

## The wiki

Built as **HTML, not markdown**, following Thariq's
[*Unreasonable Effectiveness of HTML*](https://www.anthropic.com/engineering/unreasonable-effectiveness-of-html):
richer than markdown, easy to read, easy to share. Structure:

- **Concept pages** (`course-wiki/concepts/`) — one atomic, cross-linked page per concept.
- **Course log** (`course-wiki/log/`) — one dated entry per study day, linking into the concepts.
- **Design system** — a single `course-wiki/assets/wiki.css`; see `course-wiki/meta/style-guide.html`.

**Content rule:** pages are written *only* from material I've actually worked through — never
auto-generated from the model's general knowledge. Every page cites its sources.

### Add to the wiki

```
/course-wiki    # then: "add the concept page for X" or "log today's notes"
```

Open it: `open course-wiki/index.html`. The repo is public and GitHub-Pages-ready.

## The exercise repo

`cohort-004-project/` is a fork of
[`ai-hero-dev/cohort-004-project`](https://github.com/ai-hero-dev/cohort-004-project)
(`origin` → my fork, `upstream` → course org). Course exercise workflow:

```bash
cd cohort-004-project
pnpm install
pnpm db:migrate && pnpm db:seed
pnpm dev          # http://localhost:5173
# pull/reset/cherry-pick exercises via the ai-hero-cli scripts in package.json
```
