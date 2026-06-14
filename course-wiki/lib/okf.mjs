// OKF v0.1 format helpers for course-wiki. Pure logic, no site/HTML concerns.
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

// True for hrefs that must never be rewritten as bundle-local paths:
// a URL scheme (https:, mailto:) or protocol-relative (//host).
const isExternalHref = (href) => /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//');

// For a bundle-local .md link, return its bundle-root-relative path (no leading
// slash, fragment stripped). Returns null for external/anchor/non-.md links.
function localMdTargetRel(href, pageDir) {
  if (isExternalHref(href)) return null;
  const hash = href.indexOf('#');
  const p = hash >= 0 ? href.slice(0, hash) : href;
  if (!/\.md$/i.test(p)) return null;
  return p.startsWith('/') ? p.slice(1) : path.posix.normalize(path.posix.join(pageDir, p));
}

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

// Rewrite a markdown link href to a relative .html href from pageDir (a dir
// relative to the bundle root, e.g. "day-1-fundamentals" or "log" or "").
// Absolute hrefs start with "/" (bundle-root relative). Only .md hrefs change.
export function mdToHtmlHref(href, pageDir = '') {
  const targetRel = localMdTargetRel(href, pageDir);
  if (targetRel === null) return href; // external, anchor, or non-.md link
  const hash = href.indexOf('#');
  const frag = hash >= 0 ? href.slice(hash) : '';
  const html = targetRel.replace(/\.md$/i, '.html');
  const rel = path.posix.relative(pageDir || '.', html) || path.posix.basename(html);
  return rel + frag;
}

// Extract bundle-local .md link targets from a markdown body. Returns
// [{ href, key }] where key is the bundle-root-relative path without .md
// (e.g. "day-1-fundamentals/subagents" or "log/2026-06-01"). Uses the marked
// lexer so links inside code fences are ignored. External/anchor/non-.md
// links are skipped.
export function mdLinkTargets(body, pageDir = '') {
  const out = [];
  marked.walkTokens(marked.lexer(body), (t) => {
    if (t.type !== 'link') return;
    const rel = localMdTargetRel(t.href, pageDir);
    if (rel !== null) out.push({ href: t.href, key: rel.replace(/\.md$/i, '') });
  });
  return out;
}

// Validate §9 conformance. files = absolute paths (e.g. from walkMd(wikiDir)).
export function checkBundle(wikiDir, files) {
  const problems = [];
  const rootIndex = path.join(wikiDir, 'index.md');
  for (const f of files) {
    const base = path.basename(f);
    const raw = readFileSync(f, 'utf8');
    const hasFrontmatter = matter.test(raw);
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
