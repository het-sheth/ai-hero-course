# Copilot instructions — ai-hero-course

This repo is a **living HTML wiki** ("second brain") for Matt Pocock's *AI Coding for Real
Engineers* cohort, plus a workspace. The wiki lives in `course-wiki/` and is maintained by the
`/course-wiki` skill. When reviewing PRs, enforce the rules below and flag any violation.

## Content integrity (most important)

- Wiki pages must be written **only from material the author actually studied/shared** — never
  invented or padded from general knowledge. Flag any concept/log page whose prose reads like
  generic AI-written filler, makes claims with no source, or adds "takeaways"/examples that don't
  trace back to a cited lesson.
- **Every** concept and log page must include a `<h2>References</h2>` + `<ul class="refs">` near
  the end (typically just before the `<footer class="foot">`), citing its source (course lesson +
  module/lesson id, plus any docs). Flag pages with no References section.

## Design system (consistency + clean diffs)

- **One source of style truth: `course-wiki/assets/wiki.css`.** Flag any inline `style="..."`
  beyond trivial one-offs and any `<style>` block in a page — new styling belongs in `wiki.css`
  and should be demonstrated in `course-wiki/meta/style-guide.html`.
- Pages must use the existing component classes (`wrap`/`wrap--wide`, `topbar`/`crumb`, `lede`,
  `meta-row`, `tag`, `callout {tip|gotcha|warn|note}`, `code-block`, `table`, `figure.diagram`,
  `related`, `refs`, `cards`/`card`/`card.stub`, `timeline`, `foot`).
- Diagrams must be **inline SVG**, not raster images. Flag `<img>` used for diagrams.
- Don't hardcode colors outside SVG — use the CSS variables (light/dark is automatic).

## Structure & links

- Concept pages: `course-wiki/concepts/<slug>.html`. Daily logs: `course-wiki/log/YYYY-MM-DD.html`
  (dated, not "day-N"). The course's "Day N" labels are concept **groups** on the hub, not logs.
- All internal links must be **relative** (the site is served via GitHub Pages). Flag absolute
  `file://` or hardcoded `https://het-sheth.github.io/...` self-links.
- New/renamed concepts must be reflected on the hub (`course-wiki/index.html`): flip the stub card
  to a real card, and add `Related` cross-links both ways.

## Identity & workflow

- `main` is protected — changes come via PR only (this is expected, not a finding).
- Commits should use the personal identity (no `radsquared.ai` work email). Flag commits authored
  with a work email.
