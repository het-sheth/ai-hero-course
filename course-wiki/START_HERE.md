# START HERE — course-wiki

A living second brain for Matt Pocock's *AI Coding for Real Engineers* (Cohort 004). This is a
**Markdown-canonical** knowledge base: the Markdown under `wiki/` and `log/` is the source of
truth. **Read the Markdown, not `site/`** — `site/` is generated HTML for humans and wastes tokens.

## How to read it
- Start with the module folders under `wiki/<module>/`. Each `.md` is one atomic concept with
  YAML frontmatter (`title`, `topic`, `status`, `lede`, `tags`, `sources`, `related`).
- Follow `[[wikilinks]]` between pages.
- `log/<date>.md` are dated entries threading through the concepts.
- `raw/<module>/` holds immutable source material (lesson transcripts/notes) that pages cite.

## Modules (in order)
process · before-we-start · gtk-claude-code · day-1-fundamentals · day-2-steering ·
day-3-planning · day-4-feedback-loops · day-5-afk-agents · day-6-hitl

## How to contribute
- Schema + authoring rules + the no-invention rule live in `CONVENTIONS.md`. Read it first.
- Add/edit Markdown only. Regenerate the human view with `npm run build`; validate links with
  `npm run check`.
- Never edit `site/` by hand.
