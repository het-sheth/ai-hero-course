# course-wiki — schema & conventions

Markdown-canonical knowledge base (Karpathy LLM-wiki pattern). **Markdown in `wiki/` and `log/`
is the source of truth. `site/` is generated — never edit it by hand.**

## Layout
- `raw/<module>/` — immutable source material (transcripts, pasted notes). Read, never rewrite.
- `wiki/<module>/<slug>.md` — atomic concept pages. One concept per file.
- `log/<date>.md` — dated entries.
- `build.mjs` — `npm run build` regenerates `site/`; `npm run check` validates links without writing.

## Page frontmatter (required: title, topic, status)
```
---
title: Human Title
topic: gtk-claude-code        # must match the folder under wiki/
status: stub | learning | solid
created: 2026-06-08
updated: 2026-06-08
lede: one-sentence summary (also the hub card description unless `desc:` is set)
desc: optional shorter hub-card description
tags: [a, b]
sources: ["https://www.aihero.dev/...", raw/gtk-claude-code/file.md]   # -> References
related: [other-slug, othermodule/slug]                                # -> Related
first_seen: log/2026-06-04                                             # optional; path under site, no .html
first_seen_label: 2026-06-04 · Getting to Know Claude Code
order: 1                                                               # optional hub-card ordering
---
```

## Body conventions the generator understands
- `> [!TIP]` / `[!NOTE]` / `[!WARNING]` / `[!CAUTION]` / `[!IMPORTANT]` → callout (tip/note/warn/gotcha/note)
- ` ```lang title="…" ` → code block with a head bar
- `[[slug]]`, `[[slug|Label]]`, `[[module/slug]]` → cross-links (must resolve, or `npm run check` fails)
- Inline `<svg>` for diagrams passes through verbatim. Tables/lists/headings → standard Markdown.
- Do NOT hand-write `## Related` / `## References` — generated from `related:` / `sources:`.

## The one inviolable rule: never invent content
Pages capture only what Het provided — lesson text/transcripts, his notes, or what he says in the
conversation. Do NOT fill a page from general knowledge. Missing material → leave a `status: stub`
page (empty body renders an "awaiting notes" callout), and ask Het for the material. Flag anything
uncertain as `{{unverified}}` rather than asserting it.

## Always cite sources
Every concept/log lists its sources in frontmatter `sources:` — at minimum the course lesson
(title + module/lesson id) and any real doc/repo the material drew on.

## Workflow
1. Drop source into `raw/<module>/` (optional) → create/update `wiki/<module>/<slug>.md`.
2. `npm run check` → fix any broken links.
3. Branch + PR (`main` is protected): `git checkout -b wiki/<topic>` → commit → `gh pr create --fill`.
