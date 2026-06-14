# course-wiki — schema & conventions

Markdown-canonical knowledge base (Karpathy LLM-wiki pattern). **Markdown in `wiki/` is the
source of truth. `site/` is generated — never edit it by hand.**

## Layout

- `raw/<module>/` — immutable source material (transcripts, pasted notes). Read, never rewrite.
- `wiki/<module>/<slug>.md` — atomic concept pages. One concept per file.
- `wiki/log/<date>.md` — dated entries.
- `wiki/index.md` — bundle root nav (reserved; carries only `okf_version: "0.1"` frontmatter).
- `wiki/<module>/index.md` — per-module nav (reserved; NO frontmatter).
- `site/` — generated HTML output.

## Page frontmatter

`type` is **required**. Recommended fields:

```yaml
---
type: concept               # REQUIRED — "concept" or "log"
title: Human Title
description: One-sentence summary shown on hub cards.
timestamp: 2026-06-08T00:00:00.000Z   # ISO 8601; last-updated date
---
```

Additional fields in active use (all optional):

```yaml
status: stub | learning | solid
created: 2026-06-08T00:00:00.000Z
desc: Shorter hub-card blurb (overrides description on cards)
tags: [a, b]
sources: ["https://www.aihero.dev/...", "raw/module/file.md"]  # → References section
related: [/module/slug.md]                                      # bundle-root-absolute paths → Related section
first_seen: log/2026-06-01       # site path (no .html) to the log entry where concept first appeared
first_seen_label: 2026-06-01 · Short label
order: 1                         # optional hub-card ordering
```

**Field notes:**
- `type` — replaces the old `topic` field. Module identity comes from the folder, not frontmatter.
- `description` — replaces `lede`. Single sentence summary.
- `timestamp` — replaces `updated`. ISO 8601.
- No `topic` field. The module is the folder.

## Cross-links

Use bundle-root-absolute Markdown links (wikilink-style double-bracket syntax is NOT supported):

```markdown
[Label](/module/slug.md)
```

The build rewrites `.md` → `.html` automatically. `related:` values follow the same convention
(`/module/slug.md`). All links are validated by `npm run check` — a broken link is a build failure.

## Navigation (`index.md` files)

Reserved `index.md` files drive navigation. They must **not** contain page frontmatter
(exception: the bundle root `wiki/index.md` may carry `okf_version: "0.1"` only).
Their bodies are §6 link lists:

```markdown
* [Title](/module/slug.md) - one-sentence description
```

`index.md` files are never rendered as concept pages and never collected as hub cards.
Navigation is driven entirely by these `index.md` files; the old JSON topics file has been removed.

## Body conventions the generator understands

- `> [!TIP]` / `[!NOTE]` / `[!WARNING]` / `[!CAUTION]` / `[!IMPORTANT]` → callout
- ` ```lang title="…" ` → code block with a head bar
- Inline `<svg>` for diagrams passes through verbatim. Tables/lists/headings → standard Markdown.
- Do NOT hand-write `## Related` / `## References` — generated from `related:` / `sources:`.

## Commands

```bash
npm run build    # generate site/ from wiki/
npm run check    # hard gate: validates §9 OKF conformance + all cross-links (no writes)
npm test         # node:test suite for lib/okf.mjs + build integration
```

`npm run check` is the hard gate — fix any reported errors before committing.

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
