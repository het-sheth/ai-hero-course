---
title: Permissions
topic: gtk-claude-code
status: learning
created: 2026-06-09
updated: 2026-06-09
lede: "Claude Code's permission model is strict by default. Approve actions once or for a whole category, store rules in .claude/settings.local.json (allow/deny, wildcards), share them with your team via settings.json, and gate things like web fetches."
desc: "Approve/deny model, settings.local.json allow/deny + wildcards, team sharing, web perms."
tags: [claude-code, permissions, settings, security]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/gtk-claude-code/permissions.md
related: [running-bash-commands]
first_seen: log/2026-06-09
first_seen_label: 2026-06-09 · Getting to Know Claude Code
order: 6
---

When you work with an agent, you have to weigh risk against reward. Give Claude Code too much power and it might accidentally delete your entire file system. That's why Claude Code ships with a detailed permissions model that is very strict by default about what it lets the agent do. You stay in complete control of what Claude Code can access: approve actions one at a time, create rules for entire categories of commands, and even share those permissions with your team so everyone gets the same safe setup.

> [!CAUTION]
> An agent with too much power is dangerous — give it free rein and it might accidentally delete your entire file system. The strict-by-default permission model is what keeps that from happening.

## Understanding the permissions flow

Safe commands run immediately, without asking. Try one:

```text title="prompt"
run echo hello
```

Commands that carry more risk require approval. Try one that does:

```text title="prompt"
run a type check on the project
```

Instead of just running it, Claude Code now shows you:

- the exact command it wants to run,
- the reason it wants to run it, and
- three options: **approve this time**, **approve all similar commands**, or **deny**.

## Working with permission files

The permissions you grant are stored in your project at `.claude/settings.local.json`. Open it and look for a `permissions` property with `allow` and `deny` arrays:

```json
{
  "permissions": {
    "allow": [],
    "deny": []
  }
}
```

You can add a permission by hand. Edit the file to pre-approve a specific command — for example, add `pnpm type check` to the `allow` array so it never asks again. Then test it:

```text title="prompt"
run pnpm type check
```

It should execute without asking.

## Creating rules with wildcards

You don't have to list commands one at a time. Wildcards let you allow a whole category. Edit `settings.local.json` and replace a specific command with a pattern — change `pnpm type check` to `pnpm *` to allow all `pnpm` commands.

The `deny` array works the same way for blocking. Add a command to `deny` to stop Claude from running it — for instance, add `bash git push` to block all git pushes and prevent accidental commits.

| Array | Effect | Example |
| --- | --- | --- |
| `allow` | Pre-approve a command so it runs without asking | `pnpm type check`, `pnpm *` |
| `deny` | Block a command entirely | `bash git push` |

## Sharing permissions with your team

The `.local.json` part of the filename is what keeps these rules to yourself. To share them:

1. Rename `settings.local.json` to `settings.json` — this changes the file from local-only to shareable.
2. Commit `settings.json` to your repository.

Now any teammate running Claude Code on this project automatically picks up the shared permissions, without setting them up by hand.

> [!TIP]
> Rename `settings.local.json` to `settings.json` and commit it so your whole team inherits the same safe permission setup automatically — no manual configuration on each machine.

## Working with web permissions

Web access is gated too. Ask Claude to fetch something from the web:

```text title="prompt"
fetch information about react-router-typegen from the web
```

Claude Code asks for permission to search the web. When you grant it, Claude fetches the page and reports back. Like other approvals, this permission is recorded in `settings.local.json`.
