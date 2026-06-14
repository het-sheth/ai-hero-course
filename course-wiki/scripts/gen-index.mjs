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
