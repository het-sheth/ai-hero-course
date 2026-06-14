#!/usr/bin/env node
// course-wiki generator: OKF bundle in wiki/ -> site/ (deterministic, no LLM).
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, cpSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { walkMd, parseIndexList, checkBundle, mdToHtmlHref, mdLinkTargets } from './lib/okf.mjs';

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
  // Valid cross-link targets: every concept page key + every log key.
  const validKeys = new Set([...pageByKey.keys(), ...logs.map((l) => `log/${l.slug}`)]);

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
    for (const { href, key } of mdLinkTargets(p.content, p.topic)) {
      if (!validKeys.has(key)) missing.push(`${p.key} -> body link ${href} (no such page)`);
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
    for (const { href, key } of mdLinkTargets(l.content, 'log')) {
      if (!validKeys.has(key)) missing.push(`log/${l.slug} -> body link ${href} (no such page)`);
    }
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

  // --- drift: index.md lists must match the actual files on disk ---
  const drift = [];
  const listedConceptKeys = new Set();
  for (const m of modules) {
    for (const c of m.concepts) {
      const key = c.href.replace(/^\//, '').replace(/\.md$/, ''); // topic/slug
      listedConceptKeys.add(key);
      if (!pageByKey.has(key)) drift.push(`${m.topic}/index.md lists ${c.href} but no such page exists`);
    }
  }
  for (const p of pages) {
    if (!listedConceptKeys.has(p.key)) drift.push(`${p.key} is not listed in ${p.topic}/index.md`);
  }
  const logKeys = new Set(logs.map((l) => `log/${l.slug}`));
  const listedLogKeys = new Set();
  for (const it of logItems) {
    const key = it.href.replace(/^\//, '').replace(/\.md$/, ''); // log/slug
    listedLogKeys.add(key);
    if (!logKeys.has(key)) drift.push(`log/index.md lists ${it.href} but no such log exists`);
  }
  for (const l of logs) {
    if (!listedLogKeys.has(`log/${l.slug}`)) drift.push(`log/${l.slug} is not listed in log/index.md`);
  }

  // validation
  const conformance = checkBundle(WIKI_DIR, allMd);
  const problems = [...conformance, ...missing.map((m) => `broken link: ${m}`), ...drift.map((m) => `drift: ${m}`)];
  if (problems.length) console.error('Problems:\n  ' + problems.join('\n  '));
  if (check) { console.log(`check ${problems.length ? 'FAILED' : 'ok'}: ${pages.length} pages, ${logs.length} logs, ${problems.length} problems`); return { pages, logs, problems }; }

  if (existsSync(SITE_DIR)) rmSync(SITE_DIR, { recursive: true, force: true });
  mkdirSync(join(SITE_DIR, 'assets'), { recursive: true });
  cpSync(join(ASSETS_SRC, 'wiki.css'), join(SITE_DIR, 'assets', 'wiki.css'));
  for (const [file, html] of writes) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html); }
  console.log(`built ${pages.length} pages + ${logs.length} logs -> site/`);
  return { pages, logs, problems };
}

// CLI entry
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const check = process.argv.includes('--check');
  const { problems } = build({ check });
  if (check && problems.length) process.exit(1);
}
