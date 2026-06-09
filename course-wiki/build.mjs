#!/usr/bin/env node
// course-wiki generator: wiki/**/*.md + log/*.md -> site/  (deterministic, no LLM).
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, rmSync, cpSync } from 'node:fs';
import { join, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const ROOT = dirname(fileURLToPath(import.meta.url));
const WIKI_DIR = join(ROOT, 'wiki');
const LOG_DIR  = join(ROOT, 'log');
const SITE_DIR = join(ROOT, 'site');
const ASSETS_SRC = join(ROOT, 'assets');
const CHECK = process.argv.includes('--check');
const TOPICS = JSON.parse(readFileSync(join(ROOT, 'topics.json'), 'utf8'));

const ALERTS = { TIP: 'tip', NOTE: 'note', WARNING: 'warn', CAUTION: 'gotcha', IMPORTANT: 'note' };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function walk(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) out.push(...walk(p));
    else if (name.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// [[slug]] | [[slug|Label]] | [[topic/slug]] -> <a>
function preprocessWikilinks(md) {
  return md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
    const t = target.trim();
    const href = t.includes('/') ? `../${t}.html` : `${t}.html`;
    const text = (label || t.split('/').pop()).trim();
    return `<a href="${href}">${esc(text)}</a>`;
  });
}

// GitHub-style alert blockquotes -> callout HTML
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

// ```lang title="..."  -> code-block with head bar
const renderer = new marked.Renderer();
renderer.code = (code, infostring) => {
  const info = (infostring || '').trim();
  const title = (info.match(/title="([^"]*)"/) || [])[1];
  const lang = info.split(/\s+/)[0] || '';
  const head = title || lang;
  return `<div class="code-block">${head ? `<div class="code-head">${esc(head)}</div>` : ''}<pre><code>${esc(code)}</code></pre></div>`;
};
marked.use({ renderer });

const renderMarkdown = (md) => marked.parse(preprocessAlerts(preprocessWikilinks(md)));

function metaRow(data, firstSeenHref) {
  const parts = [];
  if (firstSeenHref) parts.push(`<span><span class="k">first seen:</span> <a href="${firstSeenHref}">${esc(data.first_seen_label || 'log')}</a></span>`);
  if (data.status) parts.push(`<span><span class="k">status:</span> ${esc(data.status)}</span>`);
  if (data.confidence) parts.push(`<span><span class="k">confidence:</span> ${esc(data.confidence)}</span>`);
  const tags = (data.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('\n');
  if (tags) parts.push(`<span class="tags">${tags}</span>`);
  return `<div class="meta-row">${parts.join('\n')}</div>`;
}

function relatedList(related, titleMap, topic) {
  if (!related || !related.length) return '';
  const items = related.map((slug) => {
    const key = slug.includes('/') ? slug : `${topic}/${slug}`;
    const title = titleMap.get(key) || slug;
    const href = slug.includes('/') ? `../${slug}.html` : `${slug}.html`;
    return `<li><a href="${href}"><strong>${esc(title)}</strong></a></li>`;
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

function cssHref(outFile) {
  return relative(dirname(outFile), join(SITE_DIR, 'assets', 'wiki.css')) || 'assets/wiki.css';
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

function build() {
  const pages = walk(WIKI_DIR).map((file) => {
    const rel = relative(WIKI_DIR, file);             // topic/slug.md
    const topic = rel.split('/')[0];
    const slug = basename(file, '.md');
    const { data, content } = matter(readFileSync(file, 'utf8'));
    return { file, topic, slug, key: `${topic}/${slug}`, data, content };
  });
  const titleMap = new Map(pages.map((p) => [p.key, p.data.title || p.slug]));

  const logs = walk(LOG_DIR).map((file) => {
    const { data, content } = matter(readFileSync(file, 'utf8'));
    return { file, slug: basename(file, '.md'), data, content };
  }).sort((a, b) => String(b.data.date || '').localeCompare(String(a.data.date || '')));

  const missing = [];
  const writes = [];

  // concept pages -> site/<topic>/<slug>.html
  for (const p of pages) {
    const outFile = join(SITE_DIR, p.topic, `${p.slug}.html`);
    const css = cssHref(outFile);
    const lede = p.data.lede ? `<p class="lede">${esc(p.data.lede)}</p>` : '';
    const firstSeenHref = p.data.first_seen ? `../${p.data.first_seen}.html` : '';
    const isStub = p.data.status === 'stub';
    const emptyBody = !p.content.trim();
    const stubNote = (isStub && emptyBody)
      ? `<div class="callout note"><span class="label">Stub</span>\n<p>Awaiting Het's notes for this lesson — no content captured yet.</p>\n</div>`
      : '';
    const body = [
      `<h1>${esc(p.data.title || p.slug)}</h1>`,
      lede,
      metaRow(p.data, firstSeenHref),
      stubNote,
      renderMarkdown(p.content),
      relatedList(p.data.related, titleMap, p.topic),
      refsList(p.data.sources),
    ].filter(Boolean).join('\n');
    const topicTitle = (TOPICS.topics[p.topic] || {}).title || p.topic;
    const crumb = `<span class="sep">/</span> ${esc(topicTitle)} <span class="sep">/</span> ${esc(p.data.title || p.slug)}`;
    writes.push([outFile, shell({ title: p.data.title || p.slug, crumb, css, body, backHref: relative(dirname(outFile), join(SITE_DIR, 'index.html')) })]);
    // validate related targets
    for (const r of (p.data.related || [])) {
      const k = r.includes('/') ? r : `${p.topic}/${r}`;
      if (!titleMap.has(k)) missing.push(`${p.key} -> related [[${r}]] (no such page)`);
    }
  }

  // log pages -> site/log/<slug>.html
  for (const l of logs) {
    const outFile = join(SITE_DIR, 'log', `${l.slug}.html`);
    const css = cssHref(outFile);
    const body = [
      `<h1>${esc(l.data.title || l.slug)}</h1>`,
      l.data.lede ? `<p class="lede">${esc(l.data.lede)}</p>` : '',
      renderMarkdown(l.content),
      refsList(l.data.sources),
    ].filter(Boolean).join('\n');
    writes.push([outFile, shell({ title: l.data.title || l.slug, crumb: `<span class="sep">/</span> log <span class="sep">/</span> ${esc(l.data.title || l.slug)}`, css, body, backHref: relative(dirname(outFile), join(SITE_DIR, 'index.html')) })]);
  }

  // portal -> site/index.html
  const sections = TOPICS.order.map((topic) => {
    const t = TOPICS.topics[topic];
    const cards = pages.filter((p) => p.topic === topic)
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99) || String(a.data.title).localeCompare(String(b.data.title)))
      .map((p) => `      <a class="card${p.data.status === 'stub' ? ' stub' : ''}" href="${topic}/${p.slug}.html"><div class="card-title">${esc(p.data.title || p.slug)}</div><div class="card-desc">${esc(p.data.desc || p.data.lede || '')}</div></a>`)
      .join('\n');
    return `  <section class="group">\n    <h2>${esc(t.title)}</h2>\n    <p class="group-sub">${esc(t.subtitle || '')}</p>\n    <div class="cards">\n${cards}\n    </div>\n  </section>`;
  }).join('\n');
  const timeline = logs.map((l) => `      <li><span class="day">${esc(l.data.date || '')}</span><div class="day-body"><div class="day-title"><a href="log/${l.slug}.html">${esc(l.data.title || l.slug)}</a></div></div></li>`).join('\n');
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

  if (missing.length) {
    console.error('Broken [[wikilinks]] / related:\n  ' + missing.join('\n  '));
    if (CHECK) process.exit(1);
  }
  if (CHECK) { console.log(`check ok: ${pages.length} pages, ${logs.length} logs, ${missing.length} link problems`); return; }

  // write everything
  if (existsSync(SITE_DIR)) rmSync(SITE_DIR, { recursive: true, force: true });
  mkdirSync(join(SITE_DIR, 'assets'), { recursive: true });
  cpSync(join(ASSETS_SRC, 'wiki.css'), join(SITE_DIR, 'assets', 'wiki.css'));
  for (const [file, html] of writes) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, html); }
  console.log(`built ${pages.length} pages + ${logs.length} logs -> site/`);
}

build();
