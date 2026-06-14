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
