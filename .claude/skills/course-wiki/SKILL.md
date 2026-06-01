---
name: course-wiki
description: Maintain Het's "AI Coding for Real Engineers" HTML wiki (a living second brain). Use when adding/updating a concept page, writing a daily course log, or refreshing the hub. Builds rich self-contained HTML pages ONLY from material Het shares — never invents learning content.
---

# course-wiki

A living second-brain wiki for Matt Pocock's *AI Coding for Real Engineers* cohort, written as
rich self-contained **HTML** (not markdown), after Thariq's *Unreasonable Effectiveness of HTML*.
Atomic concept pages are the backbone; a dated log threads through them.

**Wiki root:** `~/projects/ai-hero-course/course-wiki/`
(This skill exists in two places — global `~/.claude/skills/course-wiki/` and local
`~/projects/ai-hero-course/.claude/skills/course-wiki/`. Keep them identical when you edit either.)

## The one inviolable rule: never invent content

This wiki captures **Het's** learning. Page prose comes **only** from material he provides —
lesson text/transcripts, his notes, or what he tells you in the conversation. Do **not** fill a
page from your own general knowledge.

- If Het hasn't shared the material for a concept, create the page as a skeleton (copy
  `meta/concept-template.html`) and leave a `callout note` saying it's awaiting his notes —
  or just leave it a stub card on the hub. Ask him for the material.
- Faithfully summarise and structure what he gives you; you may tighten wording, but don't add
  claims, examples, or "takeaways" he didn't provide.
- If you're unsure whether something came from the source, leave it out or mark it
  `{{unverified}}` and ask.

(This rule exists because an earlier version auto-wrote a plausible-sounding page that wasn't from
the lesson — exactly the failure to avoid.)

## File layout

```
course-wiki/
  index.html              hub: "The process" + module groups + dated course log
  assets/wiki.css         the ONLY source of style truth
  meta/style-guide.html   renders every component (your visual reference)
  meta/concept-template.html   skeleton to copy for new concept pages
  concepts/<slug>.html    one atomic page per concept
  log/YYYY-MM-DD.html      one entry per day Het studies
```

## Design-system rules (non-negotiable for consistency + clean diffs)

1. Every page links `assets/wiki.css` (adjust `../` depth by folder). **Never inline styles**
   and never add `<style>` blocks — if a component is missing, add it to `wiki.css` and to
   `meta/style-guide.html`, then use the class.
2. Use the existing classes: `wrap` / `wrap--wide`, `topbar`+`crumb`, `lede`, `meta-row`,
   `tag`, `callout {tip|gotcha|warn|note}`, `code-block`, `table`, `figure.diagram` (inline SVG),
   `related`, `refs`, `cards`/`card`/`card.stub`, `timeline`, `foot`. See `meta/style-guide.html`.
3. Diagrams: inline **SVG**, not images — crisp, themeable, no hosting.
4. Light/dark is automatic via CSS variables; don't hardcode colours outside SVG (and in SVG,
   use the palette hexes from the style guide).

## Always cite sources

Every concept and log page ends with a `<h2>References</h2>` + `<ul class="refs">`. Include the
course lesson (title + module/lesson id like `01-before-we-start/01.01-where-were-going` when
known), and any other real source the material drew on (docs, the HTML article, the exercise repo).
No page ships without a References section.

## Interlinking (keeps it a "web", not a pile)

- Each concept page has a `Related` list and a `first seen:` link back to the log entry where Het met it.
- Each log entry links **into** the concept pages it touched.
- After adding/renaming a concept, update `index.html`: turn its stub card into a real `card`
  (remove `stub`), and add/refresh any `Related` cross-links on adjacent pages.

## Common intents

**"Add/Write the concept page for X"** (Het has shared material)
1. `cp meta/concept-template.html concepts/<slug>.html`.
2. Fill every `{{...}}` from his material only. Add callouts/SVG/table only where the material warrants.
3. Add `first seen:` → the relevant log entry; add a `References` section.
4. In `index.html`, flip the matching stub card to a real card (or add one in the right group).
5. Add `Related` links both ways with neighbouring concepts.

**"Log today" / "Add today's notes"**
1. `cp` an existing `log/YYYY-MM-DD.html` (or build from template structure) → new dated file.
2. Record what he did + per-lesson notes from his material; link into any concept pages created.
3. Prepend a new `<li>` to the `timeline` in `index.html#log` (newest first).

**"Update concept X"** — edit `concepts/<slug>.html` in place from new material; refresh `Related`/refs.

**"Refresh the hub"** — reconcile `index.html` cards/log against what's actually in `concepts/` and `log/`.

## Viewing

Local: open `course-wiki/index.html` in a browser (`open` on macOS). The repo
(`het-sheth/ai-hero-course`, public) is GitHub-Pages-ready — relative links + shared CSS work as-is.

## References

- Course: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
- The Unreasonable Effectiveness of HTML: https://www.anthropic.com/engineering/unreasonable-effectiveness-of-html
- Exercise repo (fork): https://github.com/het-sheth/cohort-004-project
