---
title: Showing Context in the Status Line
topic: day-1-fundamentals
status: learning
created: 2026-06-13
updated: 2026-06-13
lede: "Claude Code hides context usage by default, so you can't see the dumb-zone line coming. Put a live token count + percentage in your status line (the lesson uses ccstatusline) so context paranoia is always one glance away."
desc: "Surface live context usage in your status line (ccstatusline) so you can watch the dumb-zone line."
tags: [claude-code, status-line, context, ccstatusline]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/day-1-fundamentals/showing-context-in-status-line.md
related: [constraints-of-llms, build-a-feature, why-plan-mode-sucks]
first_seen: log/2026-06-13
first_seen_label: 2026-06-13 · Day 1 Fundamentals
order: 6
---

## Why

Claude Code doesn't show context usage by default — in [[build-a-feature|the last exercise]] you had
to break flow and run `/context` just to check. Tools like Cursor/OpenCode show it constantly; you
can get the same in Claude Code via a **status line**, so you always see when you're crossing into
the [[constraints-of-llms|dumb zone]].

## Setup (ccstatusline)

The lesson uses **ccstatusline**, a community tool that formats Claude Code's session data. It's a
**global** (`~/.claude`) change, not per-project.

1. `mkdir -p ~/.config/ccstatusline`
2. Write `~/.config/ccstatusline/settings.json` (see the raw for the full config) — four widgets:
   a bold yellow **`context-length`** (token count), then a dimmed **`context-percentage`** in
   parentheses, glued with `"merge": "no-padding"` and `"rawValue": true` to strip labels.
3. In `~/.claude/settings.json` (preserve existing keys):

   ```json title="~/.claude/settings.json"
   { "statusLine": { "type": "command", "command": "npx ccstatusline@latest" } }
   ```
4. Restart Claude Code → you'll see e.g. `186.2k (17.3%)`, updating as context fills.

## Tokens, not just percentage

> [!NOTE] Why the format changed
> After this was recorded, Anthropic shipped the **1M-token** window for Opus 4.6 / Sonnet 4.6, so a
> raw percentage is misleading. The config now shows the **token count** first, percentage dimmed in
> brackets. Rule of thumb: start worrying around **80k–100k tokens** (the course videos still show
> percentages — recorded at 200k, so 40% ≈ 80k). See [[constraints-of-llms]].

> [!TIP] My setup
> I don't use ccstatusline — I have a custom `~/.claude/statusline-command.sh` showing model, ctx,
> 5h/7d rate-limit bars, branch, and workdir. On 2026-06-13 I matched this lesson's idea: ctx now
> renders as **tokens then percentage** (`ctx:186.2k (17.3%)`), reordered to
> `model · ctx · 5h · 7d · branch · workdir`.
