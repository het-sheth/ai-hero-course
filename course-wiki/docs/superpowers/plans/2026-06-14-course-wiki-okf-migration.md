# course-wiki → native OKF — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `course-wiki`'s Markdown source into a conformant OKF v0.1 bundle that remains the single source of truth, with `build.mjs` generating the same `site/` HTML from it.

**Architecture:** Extract the novel, testable logic (link rewriting, index parsing, conformance) into a `lib/okf.mjs` module unit-tested with `node:test` against fixtures. Refactor `build.mjs` so `build()` accepts a root dir (enabling fixture-based integration tests) and consumes the new format: navigation parsed from reserved `index.md` bodies (§6 link lists, replacing `topics.json`), cross-links as bundle-root-absolute Markdown links rewritten to `.html`, daily logs moved under `wiki/log/`. One-time scripts perform the bulk content migration and generate the `index.md` files.

**Tech Stack:** Node.js 25 (ESM, `type: module`), `gray-matter` 4.0.3, `marked` 12.0.2, built-in `node:test` + `node:assert`. No new dependencies.

**Spec:** `course-wiki/docs/superpowers/specs/2026-06-14-course-wiki-okf-migration-design.md`

**Working dir for all paths below:** `~/projects/ai-hero-course/course-wiki/` (the repo root is `~/projects/ai-hero-course`; commit from there). Branch `wiki/okf-migration` already exists and is checked out.

---

## Key conventions used throughout

- **Bundle root = `wiki/`.** A bundle-root-absolute link `/day-2-steering/steering.md` resolves to `wiki/day-2-steering/steering.md` and, in output, to `site/day-2-steering/steering.html`.
- **`pageDir`** = a page's directory relative to the bundle root (e.g. `day-1-fundamentals`, or `log` for daily logs, or `''` for the root).
- **Reserved files** (`index.md`, `log.md`) are never rendered as concept pages and never collected as cards; `index.md` bodies are parsed for navigation only.

---

## File Structure

- **Create `lib/okf.mjs`** — pure helpers: `mdToHtmlHref`, `parseIndexList`, `checkBundle`, `walkMd`. One responsibility: OKF-format logic, no HTML/site concerns.
- **Create `test/okf.test.mjs`** — unit tests for `lib/okf.mjs`.
- **Create `test/build.test.mjs`** — integration test that runs `build()` against `test/fixtures/bundle/`.
- **Create `test/fixtures/bundle/`** — a tiny conformant bundle (root + one module + log) for the integration test.
- **Create `scripts/migrate-okf.mjs`** — one-time: rewrites concept/log frontmatter + converts `[[wikilinks]]` and `related:` to absolute Markdown links.
- **Create `scripts/gen-index.mjs`** — one-time: generates all reserved `index.md` files from `topics.json` + page frontmatter.
- **Modify `build.mjs`** — make `build()` take a root dir; consume the new format; delete `preprocessWikilinks` and the `topics.json` read.
- **Modify `package.json`** — add `"test": "node --test"`.
- **Delete `topics.json`** — superseded by `wiki/index.md`.
- **Move `log/` → `wiki/log/`** — daily logs join the bundle.

---

## Task 1: Test harness + `lib/okf.mjs` skeleton

**Files:**
- Modify: `package.json` (scripts)
- Create: `lib/okf.mjs`
- Create: `test/okf.test.mjs`

- [ ] **Step 1: Add the test script**

Edit `package.json` `scripts` to:

```json
  "scripts": {
    "build": "node build.mjs",
    "check": "node build.mjs --check",
    "test": "node --test"
  },
```

- [ ] **Step 2: Create the module with a `walkMd` helper**

Create `lib/okf.mjs`:

```js
// OKF v0.1 format helpers for course-wiki. Pure logic, no site/HTML concerns.
import { readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

// Recursively list every .md file under dir (absolute paths).
export function walkMd(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(p));
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}
```

- [ ] **Step 3: Write a smoke test**

Create `test/okf.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { walkMd } from '../lib/okf.mjs';

test('walkMd returns [] for a missing dir', () => {
  assert.deepEqual(walkMd('/no/such/dir/here'), []);
});
```

- [ ] **Step 4: Run the test**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
cd ~/projects/ai-hero-course
git add course-wiki/lib/okf.mjs course-wiki/test/okf.test.mjs course-wiki/package.json
git commit -m "test: add node:test harness and okf lib skeleton"
```

---

## Task 2: `mdToHtmlHref` — link rewriting

Converts a Markdown link href to a relative `.html` href from the current page's directory. Only touches hrefs ending in `.md`; leaves `http(s)`, anchors, and other links untouched. Preserves `#fragment`.

**Files:**
- Modify: `lib/okf.mjs`
- Modify: `test/okf.test.mjs`

- [ ] **Step 1: Write the failing tests**

Add to `test/okf.test.mjs`:

```js
import { mdToHtmlHref } from '../lib/okf.mjs';

test('mdToHtmlHref: absolute link to another module', () => {
  assert.equal(
    mdToHtmlHref('/day-2-steering/steering.md', 'day-1-fundamentals'),
    '../day-2-steering/steering.html',
  );
});

test('mdToHtmlHref: absolute link within same module', () => {
  assert.equal(mdToHtmlHref('/day-1-fundamentals/foo.md', 'day-1-fundamentals'), 'foo.html');
});

test('mdToHtmlHref: relative link', () => {
  assert.equal(mdToHtmlHref('foo.md', 'day-1-fundamentals'), 'foo.html');
});

test('mdToHtmlHref: from a log page to a module page', () => {
  assert.equal(mdToHtmlHref('/gtk-claude-code/permissions.md', 'log'), '../gtk-claude-code/permissions.html');
});

test('mdToHtmlHref: preserves fragment', () => {
  assert.equal(mdToHtmlHref('/process/seven-phase-process.md#step-3', 'log'),
    '../process/seven-phase-process.html#step-3');
});

test('mdToHtmlHref: leaves non-md links alone', () => {
  assert.equal(mdToHtmlHref('https://example.com', 'log'), 'https://example.com');
  assert.equal(mdToHtmlHref('#anchor', 'log'), '#anchor');
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL — `mdToHtmlHref is not a function` / import error.

- [ ] **Step 3: Implement `mdToHtmlHref`**

Add to `lib/okf.mjs`:

```js
// Rewrite a markdown link href to a relative .html href from pageDir (a dir
// relative to the bundle root, e.g. "day-1-fundamentals" or "log" or "").
// Absolute hrefs start with "/" (bundle-root relative). Only .md hrefs change.
export function mdToHtmlHref(href, pageDir = '') {
  const hash = href.indexOf('#');
  const frag = hash >= 0 ? href.slice(hash) : '';
  const p = hash >= 0 ? href.slice(0, hash) : href;
  if (!/\.md$/i.test(p)) return href;
  const targetRel = p.startsWith('/')
    ? p.slice(1)
    : path.posix.normalize(path.posix.join(pageDir, p));
  const html = targetRel.replace(/\.md$/i, '.html');
  const rel = path.posix.relative(pageDir || '.', html) || path.posix.basename(html);
  return rel + frag;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: PASS (all `mdToHtmlHref` tests green).

- [ ] **Step 5: Commit**

```bash
cd ~/projects/ai-hero-course
git add course-wiki/lib/okf.mjs course-wiki/test/okf.test.mjs
git commit -m "feat: add mdToHtmlHref link rewriter"
```

---

## Task 3: `parseIndexList` — §6 link-list parsing

Parses an `index.md` body into nav items. A §6 line looks like `* [Title](/href) - description` (also accepts `-` bullet and `—` em-dash separator; description optional).

**Files:**
- Modify: `lib/okf.mjs`
- Modify: `test/okf.test.mjs`

- [ ] **Step 1: Write the failing tests**

Add to `test/okf.test.mjs`:

```js
import { parseIndexList } from '../lib/okf.mjs';

test('parseIndexList: parses title, href, description', () => {
  const body = `# Day 1 · Fundamentals

* [Constraints of LLMs](/day-1-fundamentals/constraints-of-llms.md) - What models can and can't do.
* [Subagents](/day-1-fundamentals/subagents.md) — Spawning helpers.
- [No desc](/day-1-fundamentals/x.md)
`;
  assert.deepEqual(parseIndexList(body), [
    { title: 'Constraints of LLMs', href: '/day-1-fundamentals/constraints-of-llms.md', description: "What models can and can't do." },
    { title: 'Subagents', href: '/day-1-fundamentals/subagents.md', description: 'Spawning helpers.' },
    { title: 'No desc', href: '/day-1-fundamentals/x.md', description: '' },
  ]);
});

test('parseIndexList: ignores non-list lines', () => {
  assert.deepEqual(parseIndexList('# Heading\n\nSome prose.\n'), []);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test`
Expected: FAIL — `parseIndexList is not a function`.

- [ ] **Step 3: Implement `parseIndexList`**

Add to `lib/okf.mjs`:

```js
// Parse a §6 index.md body into [{ title, href, description }].
export function parseIndexList(body) {
  const re = /^\s*[-*]\s*\[([^\]]+)\]\(([^)]+)\)\s*(?:[—-]\s*(.*\S))?\s*$/;
  const items = [];
  for (const line of body.split('\n')) {
    const m = line.match(re);
    if (m) items.push({ title: m[1].trim(), href: m[2].trim(), description: (m[3] || '').trim() });
  }
  return items;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd ~/projects/ai-hero-course
git add course-wiki/lib/okf.mjs course-wiki/test/okf.test.mjs
git commit -m "feat: add parseIndexList for index.md bodies"
```

---

## Task 4: `checkBundle` — §9 conformance validation

Validates a bundle's files: concept docs MUST have frontmatter with a non-empty `type`; reserved `index.md` MUST have no frontmatter, except the bundle-root `index.md` which may contain **only** `okf_version`.

**Files:**
- Modify: `lib/okf.mjs`
- Create: `test/fixtures/conformance/` (good + bad fixtures)
- Modify: `test/okf.test.mjs`

- [ ] **Step 1: Create conformance fixtures**

```bash
cd ~/projects/ai-hero-course/course-wiki
mkdir -p test/fixtures/conformance/good/mod test/fixtures/conformance/bad/mod
```

Create `test/fixtures/conformance/good/index.md`:

```markdown
---
okf_version: "0.1"
---
# Good bundle

* [Mod](/mod/index.md) - a module
```

Create `test/fixtures/conformance/good/mod/index.md`:

```markdown
# Mod

* [A](/mod/a.md) - first
```

Create `test/fixtures/conformance/good/mod/a.md`:

```markdown
---
type: concept
title: A
---
Body.
```

Create `test/fixtures/conformance/bad/index.md` (root with a forbidden key):

```markdown
---
okf_version: "0.1"
title: Nope
---
# Bad
```

Create `test/fixtures/conformance/bad/mod/index.md` (reserved file with frontmatter):

```markdown
---
type: index
---
# Mod
```

Create `test/fixtures/conformance/bad/mod/a.md` (concept missing type):

```markdown
---
title: A
---
Body.
```

- [ ] **Step 2: Write the failing tests**

Add to `test/okf.test.mjs`:

```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkBundle, walkMd } from '../lib/okf.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

test('checkBundle: good bundle has no problems', () => {
  const dir = path.join(HERE, 'fixtures/conformance/good');
  assert.deepEqual(checkBundle(dir, walkMd(dir)), []);
});

test('checkBundle: bad bundle reports all three problems', () => {
  const dir = path.join(HERE, 'fixtures/conformance/bad');
  const problems = checkBundle(dir, walkMd(dir)).join('\n');
  assert.match(problems, /root index\.md may only contain okf_version/);
  assert.match(problems, /index\.md must have no frontmatter/);
  assert.match(problems, /missing non-empty 'type'/);
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npm test`
Expected: FAIL — `checkBundle is not a function`.

- [ ] **Step 4: Implement `checkBundle`**

Add to `lib/okf.mjs`:

```js
import { readFileSync } from 'node:fs';
import matter from 'gray-matter';

// Validate §9 conformance. files = absolute paths (e.g. from walkMd(wikiDir)).
export function checkBundle(wikiDir, files) {
  const problems = [];
  const rootIndex = path.join(wikiDir, 'index.md');
  for (const f of files) {
    const base = path.basename(f);
    const raw = readFileSync(f, 'utf8');
    const hasFrontmatter = /^---\r?\n/.test(raw);
    if (base === 'index.md') {
      if (f === rootIndex) {
        const { data } = matter(raw);
        const extra = Object.keys(data).filter((k) => k !== 'okf_version');
        if (extra.length) problems.push(`${f}: root index.md may only contain okf_version frontmatter (found: ${extra.join(', ')})`);
      } else if (hasFrontmatter) {
        problems.push(`${f}: index.md must have no frontmatter (§6)`);
      }
    } else if (base === 'log.md') {
      // Not produced by this bundle; nothing to validate.
    } else {
      if (!hasFrontmatter) { problems.push(`${f}: concept doc missing frontmatter`); continue; }
      const { data } = matter(raw);
      if (!data.type || !String(data.type).trim()) problems.push(`${f}: missing non-empty 'type'`);
    }
  }
  return problems;
}
```

- [ ] **Step 5: Run to verify pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd ~/projects/ai-hero-course
git add course-wiki/lib/okf.mjs course-wiki/test/okf.test.mjs course-wiki/test/fixtures/conformance
git commit -m "feat: add checkBundle §9 conformance validation"
```

---

## Task 5: Refactor `build.mjs` to the new format (fixture-verified)

Rewrite `build.mjs` so `build({ rootDir, check })` is exported and consumes the OKF format: nav from `index.md` bodies (via `parseIndexList`), links via `mdToHtmlHref`, reserved files skipped, logs under `wiki/log/`, conformance via `checkBundle`. Verify against a fixture bundle (the real wiki is migrated in Task 6).

**Files:**
- Modify: `build.mjs` (full rewrite of the listed sections)
- Create: `test/fixtures/bundle/` (a runnable mini bundle)
- Create: `test/build.test.mjs`

- [ ] **Step 1: Build the fixture bundle**

```bash
cd ~/projects/ai-hero-course/course-wiki
mkdir -p test/fixtures/bundle/wiki/mod test/fixtures/bundle/wiki/log test/fixtures/bundle/assets
cp assets/wiki.css test/fixtures/bundle/assets/wiki.css
```

Create `test/fixtures/bundle/topics-not-used.txt` is NOT needed. Create these files:

`test/fixtures/bundle/wiki/index.md`:
```markdown
---
okf_version: "0.1"
---
# Test Bundle

* [Mod](/mod/index.md) - the only module
```

`test/fixtures/bundle/wiki/mod/index.md`:
```markdown
# Mod

* [Alpha](/mod/alpha.md) - first page
* [Beta](/mod/beta.md) - second page
```

`test/fixtures/bundle/wiki/mod/alpha.md`:
```markdown
---
type: concept
title: Alpha
status: solid
description: first page
order: 0
related: ["/mod/beta.md"]
---
Link to [Beta](/mod/beta.md).
```

`test/fixtures/bundle/wiki/mod/beta.md`:
```markdown
---
type: concept
title: Beta
status: stub
description: second page
order: 1
---
```

`test/fixtures/bundle/wiki/log/index.md`:
```markdown
# Log

* [2026-06-01 · Kickoff](/log/2026-06-01.md) - day one
```

`test/fixtures/bundle/wiki/log/2026-06-01.md`:
```markdown
---
type: log
title: 2026-06-01 · Kickoff
---
Saw [Alpha](/mod/alpha.md).
```

- [ ] **Step 2: Rewrite `build.mjs`**

Replace the **entire contents** of `build.mjs` with:

```js
#!/usr/bin/env node
// course-wiki generator: OKF bundle in wiki/ -> site/ (deterministic, no LLM).
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, cpSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { walkMd, parseIndexList, checkBundle, mdToHtmlHref } from './lib/okf.mjs';

const ALERTS = { TIP: 'tip', NOTE: 'note', WARNING: 'warn', CAUTION: 'gotcha', IMPORTANT: 'note' };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- markdown rendering -------------------------------------------------
let CURRENT_DIR = ''; // pageDir of the page currently being rendered
const renderer = new marked.Renderer();
renderer.code = (code, infostring) => {
  const info = (infostring || '').trim();
  const title = (info.match(/title="([^"]*)"/) || [])[1];
  const lang = info.split(/\s+/)[0] || '';
  const head = title || lang;
  return `<div class="code-block">${head ? `<div class="code-head">${esc(head)}</div>` : ''}<pre><code>${esc(code)}</code></pre></div>`;
};
renderer.link = (href, title, text) => {
  const h = mdToHtmlHref(href, CURRENT_DIR);
  return `<a href="${esc(h)}"${title ? ` title="${esc(title)}"` : ''}>${text}</a>`;
};
marked.use({ renderer });

function preprocessAlerts(md) {
  const lines = md.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const m = lines[i].match(/^>\s*\[!(TIP|NOTE|WARNING|CAUTION|IMPORTANT)\]\s*(.*)$/);
    if (m) {
      const cls = ALERTS[m[1]];
      const label = (m[2].trim() || (m[1][0] + m[1].slice(1).toLowerCase()));
      const buf = [];
      i++;
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, '')); i++; }
      out.push(`<div class="callout ${cls}"><span class="label">${esc(label)}</span>\n${marked.parse(buf.join('\n'))}\n</div>`);
    } else { out.push(lines[i]); i++; }
  }
  return out.join('\n');
}
const renderMarkdown = (md, pageDir) => { CURRENT_DIR = pageDir; return marked.parse(preprocessAlerts(md)); };

// --- html fragments -----------------------------------------------------
function metaRow(data, firstSeenHref) {
  const parts = [];
  if (firstSeenHref) parts.push(`<span><span class="k">first seen:</span> <a href="${firstSeenHref}">${esc(data.first_seen_label || 'log')}</a></span>`);
  if (data.status) parts.push(`<span><span class="k">status:</span> ${esc(data.status)}</span>`);
  if (data.confidence) parts.push(`<span><span class="k">confidence:</span> ${esc(data.confidence)}</span>`);
  const tags = (data.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('\n');
  if (tags) parts.push(`<span class="tags">${tags}</span>`);
  return `<div class="meta-row">${parts.join('\n')}</div>`;
}

// related: array of "/topic/slug.md" absolute links. pageDir is the page's dir.
function relatedList(related, titleByKey, pageDir) {
  if (!related || !related.length) return '';
  const items = related.map((href) => {
    const key = String(href).replace(/^\//, '').replace(/\.md$/, ''); // topic/slug
    const title = titleByKey.get(key) || key;
    return `<li><a href="${esc(mdToHtmlHref(href, pageDir))}"><strong>${esc(title)}</strong></a></li>`;
  }).join('\n');
  return `<h2>Related</h2>\n<ul class="related">\n${items}\n</ul>`;
}

function refsList(sources) {
  if (!sources || !sources.length) return '';
  const items = sources.map((s) => {
    if (/^https?:\/\//.test(s)) return `<li><a href="${esc(s)}">${esc(s)}</a></li>`;
    return `<li><code>${esc(s)}</code> <span class="src">— local source</span></li>`;
  }).join('\n');
  return `<h2>References</h2>\n<ul class="refs">\n${items}\n</ul>`;
}

function shell({ title, crumb, css, body, backHref }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · course-wiki</title>
<link rel="stylesheet" href="${css}">
</head>
<body>
<header class="topbar">
  <div class="wrap">
    <span class="brand"><a href="${backHref}">course-wiki</a></span>
    <span class="crumb">${crumb}</span>
    <span class="spacer"></span>
    <span class="crumb"><a href="${backHref}">all concepts</a></span>
  </div>
</header>
<main class="wrap">
${body}
  <footer class="foot"><a href="${backHref}">← back to the map</a></footer>
</main>
</body>
</html>
`;
}

// --- build --------------------------------------------------------------
export function build({ rootDir, check = false } = {}) {
  const ROOT = rootDir ?? dirname(fileURLToPath(import.meta.url));
  const WIKI_DIR = join(ROOT, 'wiki');
  const LOG_DIR = join(WIKI_DIR, 'log');
  const SITE_DIR = join(ROOT, 'site');
  const ASSETS_SRC = join(ROOT, 'assets');
  const cssHref = (outFile) => relative(dirname(outFile), join(SITE_DIR, 'assets', 'wiki.css')) || 'assets/wiki.css';

  const allMd = walkMd(WIKI_DIR);

  // Concept pages = non-reserved .md outside log/.
  const pages = allMd
    .filter((f) => basename(f) !== 'index.md' && basename(f) !== 'log.md')
    .filter((f) => !f.startsWith(LOG_DIR + '/') && f !== LOG_DIR)
    .map((file) => {
      const rel = relative(WIKI_DIR, file);            // topic/slug.md
      const topic = rel.split('/')[0];
      const slug = basename(file, '.md');
      const { data, content } = matter(readFileSync(file, 'utf8'));
      return { file, topic, slug, key: `${topic}/${slug}`, data, content };
    });
  const pageByKey = new Map(pages.map((p) => [p.key, p]));
  const titleByKey = new Map(pages.map((p) => [p.key, p.data.title || p.slug]));

  // Daily logs = non-reserved .md under log/.
  const logs = walkMd(LOG_DIR)
    .filter((f) => basename(f) !== 'index.md')
    .map((file) => {
      const { data, content } = matter(readFileSync(file, 'utf8'));
      return { file, slug: basename(file, '.md'), data, content };
    });
  const logByKey = new Map(logs.map((l) => [`log/${l.slug}`, l]));

  // Navigation from reserved index.md bodies.
  const rootIndex = join(WIKI_DIR, 'index.md');
  const rootItems = existsSync(rootIndex) ? parseIndexList(matter(readFileSync(rootIndex, 'utf8')).content) : [];
  const modules = rootItems.map((it) => {
    const topic = it.href.replace(/^\//, '').replace(/\/index\.md$/, '');
    const modIndex = join(WIKI_DIR, topic, 'index.md');
    const concepts = existsSync(modIndex) ? parseIndexList(matter(readFileSync(modIndex, 'utf8')).content) : [];
    return { topic, title: it.title, subtitle: it.description, concepts };
  });
  const logIndex = join(LOG_DIR, 'index.md');
  const logItems = existsSync(logIndex) ? parseIndexList(matter(readFileSync(logIndex, 'utf8')).content) : [];

  const missing = [];
  const writes = [];

  // concept pages -> site/<topic>/<slug>.html
  for (const p of pages) {
    const outFile = join(SITE_DIR, p.topic, `${p.slug}.html`);
    const css = cssHref(outFile);
    const desc = p.data.description ?? p.data.lede;
    const lede = desc ? `<p class="lede">${esc(desc)}</p>` : '';
    const firstSeenHref = p.data.first_seen ? `../${p.data.first_seen}.html` : '';
    const isStub = p.data.status === 'stub';
    const stubNote = (isStub && !p.content.trim())
      ? `<div class="callout note"><span class="label">Stub</span>\n<p>Awaiting Het's notes for this lesson — no content captured yet.</p>\n</div>`
      : '';
    const body = [
      `<h1>${esc(p.data.title || p.slug)}</h1>`,
      lede,
      metaRow(p.data, firstSeenHref),
      stubNote,
      renderMarkdown(p.content, p.topic),
      relatedList(p.data.related, titleByKey, p.topic),
      refsList(p.data.sources),
    ].filter(Boolean).join('\n');
    const mod = modules.find((m) => m.topic === p.topic);
    const topicTitle = mod ? mod.title : p.topic;
    const crumb = `<span class="sep">/</span> ${esc(topicTitle)} <span class="sep">/</span> ${esc(p.data.title || p.slug)}`;
    writes.push([outFile, shell({ title: p.data.title || p.slug, crumb, css, body, backHref: relative(dirname(outFile), join(SITE_DIR, 'index.html')) })]);
    for (const r of (p.data.related || [])) {
      const k = String(r).replace(/^\//, '').replace(/\.md$/, '');
      if (!titleByKey.has(k)) missing.push(`${p.key} -> related ${r} (no such page)`);
    }
  }

  // log pages -> site/log/<slug>.html
  for (const l of logs) {
    const outFile = join(SITE_DIR, 'log', `${l.slug}.html`);
    const css = cssHref(outFile);
    const desc = l.data.description ?? l.data.lede;
    const body = [
      `<h1>${esc(l.data.title || l.slug)}</h1>`,
      desc ? `<p class="lede">${esc(desc)}</p>` : '',
      renderMarkdown(l.content, 'log'),
      refsList(l.data.sources),
    ].filter(Boolean).join('\n');
    writes.push([outFile, shell({ title: l.data.title || l.slug, crumb: `<span class="sep">/</span> log <span class="sep">/</span> ${esc(l.data.title || l.slug)}`, css, body, backHref: relative(dirname(outFile), join(SITE_DIR, 'index.html')) })]);
  }

  // portal -> site/index.html
  const sections = modules.map((m) => {
    const cards = m.concepts.map((c) => {
      const key = c.href.replace(/^\//, '').replace(/\.md$/, '');
      const p = pageByKey.get(key);
      const stubClass = p && p.data.status === 'stub' ? ' stub' : '';
      const cardDesc = (p && (p.data.desc || p.data.description || p.data.lede)) || c.description || '';
      return `      <a class="card${stubClass}" href="${esc(mdToHtmlHref(c.href, ''))}"><div class="card-title">${esc(c.title)}</div><div class="card-desc">${esc(cardDesc)}</div></a>`;
    }).join('\n');
    return `  <section class="group">\n    <h2>${esc(m.title)}</h2>\n    <p class="group-sub">${esc(m.subtitle || '')}</p>\n    <div class="cards">\n${cards}\n    </div>\n  </section>`;
  }).join('\n');
  const timeline = logItems.map((it) => {
    const slug = it.href.replace(/^\//, '').replace(/^log\//, '').replace(/\.md$/, '');
    return `      <li><span class="day">${esc(slug)}</span><div class="day-body"><div class="day-title"><a href="${esc(mdToHtmlHref(it.href, ''))}">${esc(it.title)}</a></div></div></li>`;
  }).join('\n');
  const indexBody = `  <h1>AI Coding for Real Engineers</h1>
  <p class="lede">A living second brain for Matt Pocock's Claude Code cohort. Markdown is the source of truth; this HTML is generated. Agents read <code>wiki/&lt;module&gt;/*.md</code>; humans browse here.</p>
  <div class="meta-row"><span><span class="k">cohort:</span> 004 · June 2026</span><span><span class="k">structure:</span> one module = one folder</span><span><span class="k">add a page:</span> <code>/course-wiki</code></span></div>
${sections}
  <section class="group" id="log"><h2>Course log</h2><ul class="timeline">\n${timeline}\n</ul></section>`;
  const indexOut = join(SITE_DIR, 'index.html');
  writes.push([indexOut, `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>course-wiki · AI Coding for Real Engineers</title>
<link rel="stylesheet" href="${cssHref(indexOut)}"></head>
<body>
<header class="topbar"><div class="wrap--wide"><span class="brand"><a href="index.html">course-wiki</a></span><span class="spacer"></span><span class="crumb">generated · do not edit site/</span></div></header>
<main class="wrap--wide" style="padding-top:8px">
${indexBody}
  <footer class="foot"><p>Generated by <code>build.mjs</code> from Markdown in <code>wiki/</code>. Do not edit <code>site/</code> by hand.</p></footer>
</main>
</body>
</html>
`]);

  // validation
  const conformance = checkBundle(WIKI_DIR, allMd);
  const problems = [...conformance, ...missing.map((m) => `broken link: ${m}`)];
  if (problems.length) {
    console.error('Problems:\n  ' + problems.join('\n  '));
    if (check) process.exit(1);
  }
  if (check) { console.log(`check ok: ${pages.length} pages, ${logs.length} logs, ${problems.length} problems`); return { pages, logs, problems }; }

  if (existsSync(SITE_DIR)) rmSync(SITE_DIR, { recursive: true, force: true });
  mkdirSync(join(SITE_DIR, 'assets'), { recursive: true });
  cpSync(join(ASSETS_SRC, 'wiki.css'), join(SITE_DIR, 'assets', 'wiki.css'));
  for (const [file, html] of writes) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html); }
  console.log(`built ${pages.length} pages + ${logs.length} logs -> site/`);
  return { pages, logs, problems };
}

// CLI entry
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  build({ check: process.argv.includes('--check') });
}
```

- [ ] **Step 3: Write the integration test**

Create `test/build.test.mjs`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, rmSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from '../build.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIX = path.join(HERE, 'fixtures/bundle');

test('build: generates site from a conformant fixture bundle', () => {
  rmSync(path.join(FIX, 'site'), { recursive: true, force: true });
  build({ rootDir: FIX, check: false });

  const index = readFileSync(path.join(FIX, 'site/index.html'), 'utf8');
  assert.match(index, /Mod/);                       // module section from root index.md
  assert.match(index, /the only module/);           // subtitle from §6 description
  assert.match(index, /mod\/alpha\.html/);          // concept card link
  assert.match(index, /2026-06-01/);                // log timeline

  const alpha = readFileSync(path.join(FIX, 'site/mod/alpha.html'), 'utf8');
  assert.match(alpha, /href="beta\.html"/);         // body link rewritten .md -> .html (same dir)
  assert.match(alpha, /<h2>Related<\/h2>/);         // related rendered
  assert.match(alpha, /Beta/);

  const log = readFileSync(path.join(FIX, 'site/log/2026-06-01.html'), 'utf8');
  assert.match(log, /href="\.\.\/mod\/alpha\.html"/); // log -> module link rewritten

  rmSync(path.join(FIX, 'site'), { recursive: true, force: true });
});

test('build --check: fixture bundle is conformant (no problems)', () => {
  const r = build({ rootDir: FIX, check: true });
  assert.equal(r.problems.length, 0);
});
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: PASS (all `okf.test.mjs` + both `build.test.mjs` tests). The real `npm run build` is expected to fail until Task 6 — do **not** run it yet.

- [ ] **Step 5: Commit**

```bash
cd ~/projects/ai-hero-course
git add course-wiki/build.mjs course-wiki/test/build.test.mjs course-wiki/test/fixtures/bundle
git commit -m "refactor: build.mjs consumes OKF format (fixture-verified)"
```

---

## Task 6: Migration script + run it on real content

Transform every real concept page and daily log: add `type`, drop `topic`, `lede`→`description`, `updated`→`timestamp`, convert `[[wikilinks]]` and `related:` to bundle-root-absolute Markdown links. Then move `log/` into `wiki/log/`.

**Files:**
- Create: `scripts/migrate-okf.mjs`
- Move: `log/*.md` → `wiki/log/*.md`
- Modify (by script): all `wiki/**/*.md` + `wiki/log/*.md`

- [ ] **Step 1: Write the migration script**

Create `scripts/migrate-okf.mjs`:

```js
// One-time: migrate course-wiki concept pages + logs to OKF frontmatter and links.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { walkMd } from '../lib/okf.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WIKI = join(ROOT, 'wiki');
const LOG = join(WIKI, 'log');

// "/topic/slug.md" from a related value ("slug" | "module/slug") in topic context.
const relToHref = (val, topic) => (String(val).includes('/') ? `/${val}.md` : `/${topic}/${val}.md`);

function convertWikilinks(body, topic) {
  return body.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
    const t = target.trim();
    const href = relToHref(t, topic);
    const text = (label || t.split('/').pop()).trim();
    return `[${text}](${href})`;
  });
}

function migrateConcept(file) {
  const topic = relative(WIKI, file).split('/')[0];
  const { data, content } = matter(readFileSync(file, 'utf8'));
  data.type = 'concept';
  delete data.topic;
  if ('lede' in data) { data.description = data.lede; delete data.lede; }
  if ('updated' in data) { data.timestamp = data.updated; delete data.updated; }
  if (Array.isArray(data.related)) data.related = data.related.map((r) => relToHref(r, topic));
  writeFileSync(file, matter.stringify(convertWikilinks(content, topic), data));
}

function migrateLog(file) {
  const { data, content } = matter(readFileSync(file, 'utf8'));
  data.type = 'log';
  if ('lede' in data) { data.description = data.lede; delete data.lede; }
  // log bodies reference module pages by [[module/slug]]; topic context is irrelevant
  // because those are always module-qualified. Use '' so bare slugs (rare) stay literal.
  writeFileSync(file, matter.stringify(convertWikilinks(content, ''), data));
}

const conceptFiles = walkMd(WIKI).filter((f) => basename(f) !== 'index.md' && !f.startsWith(LOG + '/'));
const logFiles = walkMd(LOG).filter((f) => basename(f) !== 'index.md');
conceptFiles.forEach(migrateConcept);
logFiles.forEach(migrateLog);
console.log(`migrated ${conceptFiles.length} concepts + ${logFiles.length} logs`);
```

- [ ] **Step 2: Move daily logs into the bundle (preserves git history)**

```bash
cd ~/projects/ai-hero-course/course-wiki
mkdir -p wiki/log
git mv log/*.md wiki/log/
rmdir log 2>/dev/null || true
```

Expected: `wiki/log/2026-06-01.md` … now exist; top-level `log/` is gone.

- [ ] **Step 3: Run the migration**

```bash
cd ~/projects/ai-hero-course/course-wiki
node scripts/migrate-okf.mjs
```

Expected: `migrated 45 concepts + 6 logs` (counts approximate).

- [ ] **Step 4: Spot-check the result**

```bash
cd ~/projects/ai-hero-course/course-wiki
sed -n '1,16p' wiki/before-we-start/navigating-the-discord.md
grep -rn '\[\[' wiki && echo "STILL HAS WIKILINKS (bad)" || echo "no wikilinks remain (good)"
```

Expected: frontmatter shows `type: concept`, `description:`, `timestamp:`, no `topic:`, no `lede:`/`updated:`; `related:` entries look like `/before-we-start/exercise-workflow.md`; the grep prints "no wikilinks remain (good)".

- [ ] **Step 5: Commit**

```bash
cd ~/projects/ai-hero-course
git add -A course-wiki/wiki course-wiki/scripts/migrate-okf.mjs
git commit -m "refactor: migrate wiki content to OKF frontmatter + links"
```

---

## Task 7: Generate `index.md` files; delete `topics.json`

Generate the reserved `index.md` files (root, each module, log) from `topics.json` (still present) + page frontmatter, then remove `topics.json`.

**Files:**
- Create: `scripts/gen-index.mjs`
- Create (by script): `wiki/index.md`, `wiki/<module>/index.md`, `wiki/log/index.md`
- Delete: `topics.json`

- [ ] **Step 1: Write the generator**

Create `scripts/gen-index.mjs`:

```js
// One-time: generate reserved index.md files from topics.json + page frontmatter.
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { walkMd } from '../lib/okf.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WIKI = join(ROOT, 'wiki');
const LOG = join(WIKI, 'log');
const TOPICS = JSON.parse(readFileSync(join(ROOT, 'topics.json'), 'utf8'));

const line = (title, href, desc) => `* [${title}](${href})${desc ? ` - ${desc}` : ''}`;

// root index.md (with okf_version frontmatter)
const rootLines = TOPICS.order.map((topic) => {
  const t = TOPICS.topics[topic];
  return line(t.title, `/${topic}/index.md`, t.subtitle || '');
});
writeFileSync(join(WIKI, 'index.md'),
  `---\nokf_version: "0.1"\n---\n# AI Coding for Real Engineers\n\n${rootLines.join('\n')}\n`);

// per-module index.md (concepts ordered by frontmatter `order`, then title)
for (const topic of TOPICS.order) {
  const dir = join(WIKI, topic);
  const pages = walkMd(dir)
    .filter((f) => basename(f) !== 'index.md')
    .map((f) => ({ slug: basename(f, '.md'), ...matter(readFileSync(f, 'utf8')) }))
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || String(a.data.title).localeCompare(String(b.data.title)));
  const lines = pages.map((p) =>
    line(p.data.title || p.slug, `/${topic}/${p.slug}.md`, p.data.desc || p.data.description || ''));
  writeFileSync(join(dir, 'index.md'), `# ${TOPICS.topics[topic].title}\n\n${lines.join('\n')}\n`);
}

// log index.md (newest first, by slug = ISO date)
const logs = walkMd(LOG)
  .filter((f) => basename(f) !== 'index.md')
  .map((f) => ({ slug: basename(f, '.md'), ...matter(readFileSync(f, 'utf8')) }))
  .sort((a, b) => b.slug.localeCompare(a.slug));
const logLines = logs.map((l) => line(l.data.title || l.slug, `/log/${l.slug}.md`, l.data.description || ''));
writeFileSync(join(LOG, 'index.md'), `# Course log\n\n${logLines.join('\n')}\n`);

console.log(`generated ${TOPICS.order.length} module index.md + root + log`);
```

- [ ] **Step 2: Run it**

```bash
cd ~/projects/ai-hero-course/course-wiki
node scripts/gen-index.mjs
```

Expected: `generated 9 module index.md + root + log`.

- [ ] **Step 3: Verify a couple of generated files**

```bash
cd ~/projects/ai-hero-course/course-wiki
sed -n '1,8p' wiki/index.md
sed -n '1,6p' wiki/day-1-fundamentals/index.md
sed -n '1,6p' wiki/log/index.md
```

Expected: root has `okf_version: "0.1"` frontmatter then a module list; module/log index files have a heading + a `* [Title](/path.md) - desc` list and **no frontmatter**.

- [ ] **Step 4: Delete `topics.json`**

```bash
cd ~/projects/ai-hero-course/course-wiki
git rm topics.json
```

- [ ] **Step 5: Commit**

```bash
cd ~/projects/ai-hero-course
git add -A course-wiki/wiki course-wiki/scripts/gen-index.mjs
git commit -m "feat: generate OKF index.md navigation, drop topics.json"
```

---

## Task 8: Integration — build the real bundle green

**Files:** none (verification + fixups only)

- [ ] **Step 1: Run conformance check**

Run: `cd ~/projects/ai-hero-course/course-wiki && npm run check`
Expected: `check ok: <N> pages, 6 logs, 0 problems` and exit code 0.

If it reports problems: fix the offending source file (e.g. a broken link target, a stray `index.md` frontmatter key) and re-run. Do not weaken the check.

- [ ] **Step 2: Build the site**

Run: `cd ~/projects/ai-hero-course/course-wiki && npm run build`
Expected: `built <N> pages + 6 logs -> site/`, exit 0.

- [ ] **Step 3: Eyeball the output**

```bash
cd ~/projects/ai-hero-course/course-wiki
grep -c 'class="card' site/index.html        # expect ~45
grep -o 'href="[^"]*\.md"' site/index.html | head || echo "no raw .md links (good)"
grep -rl 'href="[^"]*\.md"' site && echo "RAW .md LINKS IN OUTPUT (bad)" || echo "all links resolved to .html (good)"
```

Expected: card count roughly matches the page count; **no** `*.md` hrefs anywhere under `site/` (every link rewritten to `.html`).

- [ ] **Step 4: Run the full test suite once more**

Run: `cd ~/projects/ai-hero-course/course-wiki && npm test`
Expected: all tests PASS.

- [ ] **Step 5: Commit the generated site (if site/ is tracked)**

```bash
cd ~/projects/ai-hero-course
git status --short course-wiki/site
# If site/ is tracked and changed:
git add course-wiki/site && git commit -m "build: regenerate site from OKF bundle"
# If site/ is gitignored, skip this step.
```

---

## Task 9: Update conventions doc + open PR

**Files:**
- Modify: `CONVENTIONS.md`

- [ ] **Step 1: Update `CONVENTIONS.md` to describe the OKF format**

Replace the "Page frontmatter" and "Body conventions" / layout sections so they describe: `type` required, `description`/`timestamp`/`created` fields, no `topic`, bundle-root-absolute Markdown links (not `[[wikilinks]]`), `index.md` as no-frontmatter §6 nav, `wiki/log/` location, and `npm test`. Keep the "never invent content" and "always cite sources" rules verbatim. (Exact wording is author's discretion; ensure no instruction still references `[[wikilinks]]` or `topics.json`.)

- [ ] **Step 2: Verify no stale references remain**

```bash
cd ~/projects/ai-hero-course/course-wiki
grep -rn 'topics.json\|\[\[' CONVENTIONS.md START_HERE.md && echo "STALE REFS (fix)" || echo "clean"
```

Expected: `clean` (or fix any hits in those docs).

- [ ] **Step 3: Commit**

```bash
cd ~/projects/ai-hero-course
git add course-wiki/CONVENTIONS.md course-wiki/START_HERE.md
git commit -m "docs: update conventions for OKF format"
```

- [ ] **Step 4: Push and open the PR**

```bash
cd ~/projects/ai-hero-course
git push -u origin wiki/okf-migration
gh pr create --fill --base main
```

Expected: PR created against `main` (protected). Include in the body a summary, the spec link, and the test plan (`npm test`, `npm run check`, `npm run build`).

---

## Self-Review (completed during authoring)

**Spec coverage:**
- Bundle root = `wiki/`; raw/site outside → Task 5 (`build()` dirs), Task 6 (log move). ✓
- Frontmatter mapping (add `type`, drop `topic`, `lede`→`description`, `updated`→`timestamp`, keep `created`/`sources`, repath `related`) → Task 6. ✓
- No `resource` field → nothing adds it. ✓
- `index.md` no frontmatter (root `okf_version` only); §6 body nav; `topics.json` retired → Tasks 5, 7. ✓
- Bundle-root-absolute Markdown links; `.md`→`.html` rewrite → Tasks 2, 5, 6. ✓
- Logs → `wiki/log/`; `site/log/` output + `first_seen` unchanged → Tasks 5, 6 (output path stays `site/log/<slug>.html`; `first_seen` is a site path, untouched). ✓
- `check` is a hard gate AND validates reserved files (§9) → Task 4 + Task 5 (`checkBundle` wired into `--check`). ✓
- Stub callout behavior preserved → Task 5 (stubNote retained). ✓

**Placeholder scan:** No TBD/TODO; every code step shows complete code; Task 9 Step 1 intentionally leaves prose wording to the author but states exact required content and a grep gate. ✓

**Type consistency:** `mdToHtmlHref(href, pageDir)`, `parseIndexList(body)→[{title,href,description}]`, `checkBundle(wikiDir, files)→string[]`, `walkMd(dir)→string[]`, `build({rootDir, check})→{pages,logs,problems}` — names/signatures match across Tasks 2–8. `relatedList` uses absolute `/topic/slug.md` values produced by Task 6's migration. ✓

**Note on transient state:** the real `npm run build`/`check` is expected to fail between Tasks 5 and 8 (code expects OKF format before content is migrated). All correctness in that window is covered by fixture-based tests (`npm test`), which stay green. Task 8 is the real-content integration gate.
