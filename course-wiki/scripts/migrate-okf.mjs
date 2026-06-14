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
