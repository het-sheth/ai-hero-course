---
title: What Is An AGENTS.md File
status: learning
created: 2026-06-14T00:00:00.000Z
desc: >-
  A git-checked-in markdown file that steers agents — loaded on every request,
  so keep it tiny. Claude Code reads CLAUDE.md, not AGENTS.md.
tags:
  - claude-code
  - steering
  - agents-md
  - context
  - progressive-disclosure
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - raw/day-2-steering/agents-md-files.md
related:
  - /day-2-steering/progressive-disclosure.md
  - /day-2-steering/agent-skills.md
  - /day-2-steering/automatic-memory.md
  - /day-1-fundamentals/constraints-of-llms.md
first_seen: log/2026-06-14
first_seen_label: 2026-06-14 · Day 2 Steering
order: 1
type: concept
description: >-
  AGENTS.md (CLAUDE.md for Claude Code) is a git-checked-in markdown file that
  customises agent behaviour. It sits just below the system prompt and loads on
  every single request — so it costs tokens every time and should be as small as
  possible. The fix for bloat is progressive disclosure.
timestamp: 2026-06-14T00:00:00.000Z
---

The first lesson of Day 2 · Steering, and the answer to a Day 1 worry: if the agent
[forgets everything on clear](/day-1-fundamentals/constraints-of-llms.md), how do you teach it your
preferences without repeating them every session? The first mechanism: **AGENTS.md**.

## What it is

An **AGENTS.md** file is a markdown file you check into Git that customises how AI coding agents
behave in your repository. It sits at the **top of the conversation history, right below the system
prompt** — a configuration layer between the agent's base instructions and your codebase. Think of it
as a **README for agents**: a predictable place to put context and instructions.

It holds two kinds of guidance:

- **Personal scope** — your commit style, coding patterns you prefer.
- **Project scope** — what the project does, which package manager you use, architecture decisions.

> [!IMPORTANT] Claude Code uses CLAUDE.md, not AGENTS.md
> AGENTS.md is an open standard adopted by **Gemini CLI, Devin, Codex, Cursor** — but the notable
> exception is **Claude Code**, which doesn't recognise AGENTS.md and reads **`CLAUDE.md`** instead.
> They're otherwise the same idea. (Matt's "desperate hope" is that Claude Code adds AGENTS.md
> support.)

## It's global, loaded every request, and sometimes ignored

Three properties make CLAUDE.md a double-edged tool. The lesson demos them with `touch CLAUDE.md` →
*"always reply to me in pirate language"* → a fresh session immediately replies in pirate-speak:

1. **You never opt in — it's global.** You didn't ask for the pirate rule in that session; it was
   pulled in automatically. Everything in CLAUDE.md applies to *every* conversation in the repo.
2. **It costs tokens on every request.** Paste the rule ~1000× into a 2000-line file and a new
   session warns *"a large CLAUDE.md will affect performance"* — `/context` shows **~10% of the
   window burned** on the memory file alone. Whatever you put there, you pay for on every request.
3. **It's often ignored — by design.** Claude Code injects a system reminder alongside CLAUDE.md:
   *"this context may or may not be relevant… you should not respond to it unless it's highly
   relevant."* So Claude can silently skip it — **steering via CLAUDE.md is not always reliable.**

> [!WARNING] Don't run `claude init`
> The bundled `init` command spawns an [Explore subagent](/day-1-fundamentals/codebase-exploration.md)
> to auto-generate a CLAUDE.md of repo conventions — ~1000 tokens / ~0.4% of the window on **every**
> request. Most of it (e.g. `package.json` scripts) the agent could trivially discover itself, and it
> **goes stale** the moment those scripts change. The UI nags you to run it repeatedly; don't. Matt's
> default attitude is **paranoia** about what goes in CLAUDE.md.

## Why massive files are a problem

**The ball-of-mud feedback loop:** agent does something you dislike → you add a rule → repeat hundreds
of times over months → unmaintainable mess. Different devs add conflicting opinions, nobody does a
style pass, and it actively *hurts* performance.

> [!NOTE] The instruction budget (Humanlayer / Kyle)
> Frontier *thinking* LLMs follow **~150–200 instructions** with reasonable consistency. Smaller
> models attend to fewer; non-thinking models attend to fewer than thinking models. Every CLAUDE.md
> token loads on every request whether relevant or not — so:
>
> | CLAUDE.md | Impact |
> |---|---|
> | Small, focused | More budget for task-specific instructions |
> | Large, bloated | Less budget for the work; agent gets confused |
> | Irrelevant rules | Token waste + distraction = worse output |

**Staleness poisons context.** Docs rot fast. A human is skeptical of bad docs; an agent reading them
every request *trusts* them. The worst offender is documenting **file structure** — "auth lives in
`src/auth/handlers.ts`" sends the agent to the wrong place the moment that file moves. Instead,
**describe capabilities**, not paths; let the agent generate just-in-time docs during planning. Domain
concepts ("organization" vs "group" vs "workspace") are more stable than paths and safer to document —
but still, keep a light touch.

## The fix: keep it tiny + progressive disclosure

Be ruthless. The absolute minimum root CLAUDE.md:

- **One-sentence project description** — acts like a role prompt; anchors every decision.
  *(`This is a React component library for accessible data visualization.`)*
- **Package manager** — if not npm. *(`This project uses pnpm workspaces.`)* Otherwise the agent
  defaults to npm and emits wrong commands.
- **Build/typecheck commands** — only if non-standard.

> *"That's honestly it. Everything else should go elsewhere."*

[Progressive disclosure](/day-2-steering/progressive-disclosure.md) handles the rest: give the agent
only what it needs now, and point elsewhere. Move language rules out — instead of a wall of "always
use const / never var / interface over type", write one light-touch line:

```markdown title="root CLAUDE.md"
For TypeScript conventions, see docs/TYPESCRIPT.md
```

No "always", no all-caps. The TS rules then load **only when the agent writes TypeScript**; CSS or
dependency tasks don't pay for them, and the file stays portable across models. You can **nest** it
(`docs/TYPESCRIPT.md` → `docs/TESTING.md` → test-runner docs), link to external docs (Prisma,
Next.js), or push knowledge into [agent skills](/day-2-steering/agent-skills.md) — another form of
progressive disclosure the agent pulls in on demand.

## Monorepos: nested files merge

You can place CLAUDE.md/AGENTS.md files in subdirectories; they **merge** with the root. Keep each
level scoped:

| Level | Content |
|---|---|
| Root | Monorepo purpose, how to navigate packages, shared tooling (e.g. pnpm workspaces) |
| Package | Package purpose, its tech stack, package-specific conventions |

The agent sees all merged files — don't overload any level.

## Don't build a ball of mud

Before adding anything, ask *where it belongs*:

| Location | When |
|---|---|
| Root CLAUDE.md | Relevant to **every** task in the repo |
| Separate file | Relevant to one domain (TypeScript, testing…) |
| Nested doc tree | Can be organised hierarchically |

> [!TIP] The refactor prompt
> To unstick an existing ball-of-mud file, paste this into your agent: ask it to **(1)** find
> contradictions (ask you which to keep), **(2)** extract only the essentials (one-line description,
> package manager, non-standard build/typecheck, truly-universal rules), **(3)** group the rest into
> categories as separate markdown files, **(4)** output a minimal root CLAUDE.md that links to them
> plus a suggested `docs/` tree, and **(5)** flag for deletion anything redundant, too vague, or
> obvious ("write clean code"). Full prompt in `raw/day-2-steering/agents-md-files.md`.

**Summary:** AGENTS.md and CLAUDE.md are the same idea, but Claude Code only listens to CLAUDE.md; it's
*global* (every request), *costly* (every token, every time), and *sometimes ignored* by design. So
make sure everything in it is relevant to every request — and push everything else into progressive
disclosure.
