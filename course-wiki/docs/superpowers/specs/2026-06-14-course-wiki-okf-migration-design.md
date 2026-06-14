# course-wiki → native OKF bundle — Design

- **Date:** 2026-06-14
- **Status:** Approved (pending spec review)
- **Scope:** `course-wiki` only (pilot). `research-wiki` follows once this proves out.
- **Goal type:** Native migration — the Markdown source *becomes* a conformant OKF bundle; HTML still builds from it. Single source of truth, fully standard.

## Background

`course-wiki` already follows the Karpathy "LLM wiki" pattern (per `CONVENTIONS.md`).
Google's **Open Knowledge Format (OKF) v0.1** (published 2026-06-12) is a vendor-neutral
formalization of exactly that pattern: a directory of Markdown files with YAML frontmatter,
linked into a knowledge graph, that any AI agent can read/write/exchange without proprietary
tooling. The wiki is therefore ~90% there already; this is a metadata + structure mapping,
not a rewrite.

Authoritative sources:
- Blog: https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/
- Spec: https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md

### OKF v0.1 rules this design relies on

- **Required frontmatter:** only `type` (non-empty string). Everything else is producer's choice.
- **Recommended (queryable) fields:** `title`, `description` (single-sentence summary),
  `resource` (URI of the underlying asset), `tags` (list), `timestamp` (ISO 8601, last change).
- **Extensions:** producers MAY add any keys; consumers SHOULD preserve unknown keys.
- **Reserved filenames (only two):** `index.md` (directory listing / progressive disclosure)
  and `log.md` (chronological update history). These MUST NOT be concept documents.
  All other `.md` files are concept documents.
- **§6 — `index.md` has NO frontmatter.** Its body is sections of Markdown link lists:
  `* [Title](/path) - short description`. (Single exception below.)
- **§11 — version declaration:** a bundle MAY declare its version with `okf_version: "0.1"`
  in a frontmatter block on the **bundle-root `index.md` only** — "the only place frontmatter
  is permitted in an `index.md`."
- **§7 — `log.md`** (if used): a flat list of date-grouped entries, newest first; date
  headings MUST be ISO 8601 `YYYY-MM-DD`. (We do not use `log.md` — see Non-goals.)
- **Cross-links:** plain Markdown links. `/`-prefixed paths are **bundle-root-absolute** and
  are *recommended* (stable across file moves); relative paths are also allowed.
- **§9 — Conformance (producer):** (1) every non-reserved `.md` has a parseable YAML
  frontmatter block; (2) every such block has a non-empty `type`; (3) **every reserved
  filename follows the §6/§7 structure.** Criterion 3 means a conformance check MUST validate
  reserved files, not skip them.
- **Consumer tolerance:** consumers MUST tolerate broken links, missing optional fields,
  unknown `type` values, unknown keys, and missing `index.md`.

## Goals

1. The `wiki/` directory is a conformant OKF v0.1 bundle, traversable from `wiki/index.md`.
2. Markdown remains the single source of truth; `site/` HTML is generated from it.
3. No invented content — migration is purely structural/metadata. The "never invent content"
   rule in `CONVENTIONS.md` is untouched.
4. `npm run check` and `npm run build` continue to work; `check` stays a hard gate.

## Non-goals (YAGNI)

- OKF's reserved `log.md` (single change-history file). The dated content logs serve a
  different purpose and stay as concept documents.
- A finer `type` taxonomy beyond `concept` / `index` / `log`.
- `research-wiki` migration (separate follow-up using this recipe).
- A `resource` field — a course concept has no single "underlying asset" URI. `sources`
  (a producer extension) carries references instead.

## Target structure

The OKF bundle root is `wiki/`. `raw/` (immutable source material) and `site/` (generated)
stay outside the bundle; `build.mjs`, `node_modules`, `docs/` are tooling, also outside.

```
wiki/                          # OKF bundle root
├── index.md                   # reserved: NO frontmatter (except optional okf_version); lists modules in order
├── before-we-start/
│   ├── index.md               # reserved: NO frontmatter; body lists this module's concepts
│   ├── navigating-the-discord.md   # type: concept
│   └── ...
├── day-1-fundamentals/
│   ├── index.md
│   └── ...
├── ...                        # one folder per module (process, gtk-claude-code, day-1..6)
└── log/
    ├── index.md               # reserved: NO frontmatter; body lists dated entries
    ├── 2026-06-01.md          # type: log  (moved in from top-level log/)
    └── ...
```

Top-level `log/` is **moved into** `wiki/log/` so the whole graph is reachable from one root.
Only the *filename* `log.md` is reserved — the directory name `log/` and the dated filenames
(`2026-06-01.md`) are valid concept documents.

## Frontmatter mapping (concept pages)

| Field | Action | Notes |
|---|---|---|
| `type` | **add** | `concept` for pages, `index` for `index.md`, `log` for dated entries. Satisfies the one OKF requirement. |
| `topic` | **drop** | Already derived from path in `build.mjs` (`rel.split('/')[0]`); redundant. |
| `lede` | **rename → `description`** | OKF's recommended single-sentence summary field. |
| `desc` | keep | Producer extension: short hub-card override. |
| `updated` | **rename → `timestamp`** | OKF's recommended last-change field (ISO 8601 date). |
| `created` | keep | Producer extension. |
| `sources` | keep | Producer extension → References section. (We do **not** use `resource`.) |
| `related` | keep, repath | Values become bundle-root-absolute `.md` paths (see Cross-links). |
| `tags` | keep | Matches OKF `tags`. |
| `status`, `first_seen`, `first_seen_label`, `order` | keep | Producer extensions. |

`index.md` files are **reserved** and carry **no frontmatter** (§6) — not even `type`. The
build distinguishes them by filename. The bundle-root `wiki/index.md` MAY carry a frontmatter
block containing **only** `okf_version: "0.1"` (§11) to declare conformance; no other index.md
may have frontmatter. Module titles, subtitles, and concept ledes are read from index.md
**bodies** (§6 link lists), not frontmatter — see Navigation.

### Example concept page (after migration)

```yaml
---
type: concept
title: Navigating The Discord
status: solid
created: 2026-06-09
timestamp: 2026-06-09
description: "The Discord server is the main support resource for the cohort — community channels open to everyone, plus cohort-only channels for questions and office hours."
desc: The cohort's main support channel — community vs cohort-only channels, where to ask.
tags: [discord, community, cohort, logistics]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/before-we-start/navigating-the-discord.md
related: ["/before-we-start/exercise-workflow.md"]
first_seen: log/2026-06-01
first_seen_label: 2026-06-01 · Navigating The Discord
order: 0
---
```

## Navigation via `index.md` (topics.json retired)

`topics.json` is removed. Its data moves into `index.md` **bodies** (§6 link-list structure),
which become the canonical, hand-authored navigation source. No nav data lives in frontmatter.

- **`wiki/index.md`** (bundle root) — optional `okf_version: "0.1"` frontmatter only; body
  lists modules in order, each link carrying its subtitle as the §6 description:
  ```markdown
  * [Day 1 · Fundamentals](/day-1-fundamentals/index.md) - How LLM agents actually work, and the core Claude Code loop.
  ```
  Module **order = list order**; module **title = link text**; module **subtitle = the
  `- description` after the link** (was `topics.json` `order` / `title` / `subtitle`).
- **`wiki/<module>/index.md`** — no frontmatter; body lists that module's concept pages as a
  §6 link list in display order. Concept **title = link text**, optional **lede = description**.
- `build.mjs` parses these bodies (link lists) to generate the HTML hub instead of reading
  `topics.json`. Module section title/subtitle come from the **root** index.md list; concept
  card order comes from the **module** index.md list.

A page-list drift check is added (see Validation) so each module's `index.md` list and the
actual concept `.md` files in that directory stay in sync.

## Cross-links → plain Markdown (bundle-root-absolute)

`[[slug]]`, `[[module/slug]]`, `[[slug|Label]]` become standard Markdown links using
**bundle-root-absolute** paths (recommended by the spec; stable when files move):

```markdown
See [Steering agents](/day-2-steering/steering.md) for the persistent-instructions pattern.
```

- `/` is interpreted relative to the bundle root (`wiki/`).
- In `build.mjs`, `preprocessWikilinks` is removed; a `marked` renderer (or post-pass)
  rewrites link hrefs ending in `.md`: resolve `/`-absolute against `wiki/` → emit the
  corresponding `site/...html` path; relative `.md` links handled equivalently.
- `related:` values use the same absolute `.md` form.

## `log/` handling

- Daily entries move to `wiki/log/<date>.md`, `type: log`, otherwise unchanged.
- Add `wiki/log/index.md` (reserved, **no frontmatter**; §6 link list of entries, newest
  first), feeding the hub timeline (replaces the current frontmatter-`date`-sort).
- The generated **site output for logs stays `site/log/<slug>.html`** (only the *source*
  moves). `first_seen` is a *site* path (`log/<date>`, per `CONVENTIONS.md`), so it needs
  **no change**.

## `build.mjs` changes (≈60–80 lines touched; no rewrite)

1. Remove the `topics.json` read; parse the §6 link-list **bodies** of `wiki/index.md`
   (module order + title + subtitle) and each `wiki/<module>/index.md` (concept order/list).
   Ignore index.md frontmatter except an optional root `okf_version`.
2. Replace `preprocessWikilinks` with `.md`→`.html` link rewriting (absolute `/` resolved
   against `wiki/`) plus target-existence validation.
3. Treat `index.md` as reserved: it drives sections/crumbs/nav, never a concept card.
4. Read logs from `wiki/log/`; drive the timeline from `wiki/log/index.md`.
5. Read `description` with a `lede` fallback during transition (`data.description || data.lede`)
   so the rename is non-breaking; same `timestamp || updated` fallback.

## Migration mechanics (one-time)

A throwaway Node script performs the bulk edit across all concept pages (~45) and logs (6):

1. Add `type` (`concept` / `log`).
2. Drop `topic`.
3. Rename `lede` → `description`, `updated` → `timestamp`.
4. Convert `[[…]]` and `related:` entries to bundle-root-absolute Markdown links, resolving
   each target against the known page set so nothing silently breaks.
5. Move `log/` → `wiki/log/` (`git mv`). `first_seen` (a site path) is unchanged because
   the build keeps emitting logs to `site/log/`.

Then hand-author the reserved `index.md` files (§6 link-list bodies, **no frontmatter**) from
the current `topics.json`: `wiki/index.md` lists modules (`title` → link text, `subtitle` →
`- description`, in `order`) and may include an `okf_version: "0.1"` frontmatter block;
each `wiki/<module>/index.md` lists its concepts. Delete `topics.json`.

## Validation

- `npm run check` stays a **hard gate** (exit 1 on broken links). This is a stricter
  producer-side policy than OKF requires (OKF consumers must *tolerate* broken links) — kept
  intentionally for quality.
- New check: every non-`index.md` `.md` in a module dir is listed in that dir's `index.md`,
  and every listed link resolves (drift detection).
- New check (§9 conformance) — **validates reserved files too, never skips them**:
  - every non-reserved `.md` has parseable frontmatter with a non-empty `type`;
  - every `index.md` has **no frontmatter**, except the bundle-root `index.md` which may
    contain **only** `okf_version` (§6/§11) — fail if any index.md carries `type`/`title`/etc.;
  - every `index.md` body parses as §6 link-list sections.
- Keep the existing "stub page renders an awaiting-notes callout" behavior.
- Acceptance: `npm run check` passes, `npm run build` produces a `site/` visually equivalent
  to today's, and `wiki/` validates as a conformant OKF v0.1 bundle.

## Rollout

Branch `wiki/okf-migration` → migrate → `npm run check` + `npm run build` + eyeball `site/`
→ PR against `main` (protected). Once merged and proven, repeat the recipe for `research-wiki`.
