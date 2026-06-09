---
title: Database Migrations
topic: before-we-start
status: learning
created: 2026-06-02
updated: 2026-06-09
lede: "Keeping the database in sync with your code via a three-step Drizzle workflow: edit the schema, generate migration files, apply them. And how to reset when things go wrong."
tags: [database, drizzle, sqlite]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - "https://orm.drizzle.team/"
  - raw/before-we-start/database-migrations.md
related: [repo-setup, day-1-fundamentals/codebase-exploration]
first_seen: log/2026-06-02
first_seen_label: 2026-06-02 · Before We Start
order: 2
---

## SQLite is just a file

The playground uses **SQLite** — unlike Postgres (which runs on a remote server or in a Docker
container), SQLite stores the whole database as files on your filesystem: `data.db` (plus
`data.db-shm` / `data.db-wal`).

> [!TIP] Reset trick
> To wipe the database completely, just **delete `data.db`** and re-run `pnpm db:seed`. It's only
> dummy data — no real users rely on it, so delete and refresh anytime you get into trouble.

If the DB file is missing, the app can't find its tables. Running `pnpm dev` and visiting
`localhost:5175` then shows an error like `no such table: courses`. Stop the server, run
`pnpm db:seed`, and `data.db` reappears.

## The schema is the source of truth

`schema.ts` is the **Drizzle** schema — the source of truth for the database structure. It defines
tables like `users`, `categories`, `courses`, `modules`, `lessons`, `enrollments`, and more.
[Drizzle ORM](https://orm.drizzle.team/) is the library managing it all.

Editing `schema.ts` does **not** automatically change the database — you have to deliberately sync
it across.

## The three-step process

<figure>
  <div class="diagram">
    <svg viewBox="0 0 660 110" role="img" aria-label="schema.ts to db:generate to migration files to db:migrate to database">
      <defs><marker id="m" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#9aa0a8"/></marker></defs>
      <g font-size="12" text-anchor="middle">
        <rect x="8"  y="38" width="120" height="40" rx="8" fill="#ffb000" opacity="0.10" stroke="#ffb000"/>
        <text x="68" y="55" font-weight="700" fill="#ffb000">schema.ts</text>
        <text x="68" y="70" font-size="10" fill="#9aa0a8">source of truth</text>

        <rect x="270" y="38" width="120" height="40" rx="8" fill="#58c7f3" opacity="0.10" stroke="#58c7f3"/>
        <text x="330" y="55" font-weight="700" fill="#58c7f3">migration files</text>
        <text x="330" y="70" font-size="10" fill="#9aa0a8">generated SQL</text>

        <rect x="532" y="38" width="120" height="40" rx="8" fill="#5af78e" opacity="0.12" stroke="#5af78e"/>
        <text x="592" y="55" font-weight="700" fill="#5af78e">data.db</text>
        <text x="592" y="70" font-size="10" fill="#9aa0a8">the database</text>
      </g>
      <g stroke="#9aa0a8" stroke-width="1.5" marker-end="url(#m)" fill="none">
        <line x1="128" y1="58" x2="268" y2="58"/>
        <line x1="390" y1="58" x2="530" y2="58"/>
      </g>
      <g font-size="11" text-anchor="middle" fill="#58c7f3" font-family="monospace">
        <text x="198" y="34">pnpm db:generate</text>
        <text x="461" y="34">pnpm db:migrate</text>
      </g>
    </svg>
  </div>
</figure>

*Edit schema → generate migrations → apply them. This mirrors many production setups.*

| Step | Command | What it does |
|------|---------|--------------|
| 1 | edit `schema.ts` | Change a table (add/modify a column) |
| 2 | `pnpm db:generate` | Creates new migration files (SQL) in the migrations folder |
| 3 | `pnpm db:migrate` | Runs any not-yet-applied migrations against `data.db` |

> [!CAUTION] Gotcha — the agent forgets to migrate
> An agent is usually smart enough to run `db:generate` after a schema change, but often **doesn't
> know to run `db:migrate`**. Migrations only apply when you deliberately run migrate — so keep the
> database in sync yourself.

## Practice loop

1. Find the `db:*` scripts in `package.json`.
2. Delete `data.db` → `pnpm dev` → see the `no such table` error.
3. Stop server → `pnpm db:seed` → `data.db` is back.
4. Edit a table in `schema.ts` → `pnpm db:generate` → see new migration files.
5. `pnpm db:migrate` → verify the change landed (SQLite viewer / inspect `data.db`).
6. Reset to build confidence: delete `data.db` → `pnpm db:seed` → confirm it all works.
