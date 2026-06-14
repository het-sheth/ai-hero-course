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
