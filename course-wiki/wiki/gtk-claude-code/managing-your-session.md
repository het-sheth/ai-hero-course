---
title: Managing Your Claude Code Session
topic: gtk-claude-code
status: learning
created: 2026-06-04
updated: 2026-06-09
lede: "Pure mechanics: how to send prompts, inspect what's happening (usage + context), interrupt mid-run, and clear the session for a fresh start. The when and why come later in the course — this is just the buttons."
tags: [claude-code, basics, context]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - "https://code.claude.com/docs/en/interactive-mode"
  - raw/gtk-claude-code/managing-your-session.md
related: [before-we-start/claude-setup, prompting-in-the-terminal, day-1-fundamentals/compaction-and-handing-off]
first_seen: log/2026-06-04
first_seen_label: 2026-06-04 · Getting to Know Claude Code
order: 1
---

## The core controls

| Action | How |
|--------|-----|
| Send a prompt | Type in the big input box → `Return` (works like any AI chat) |
| Multi-line input | `Shift+Enter` — after running `/terminal-setup` once |
| Run a command | `/` then the name; `Tab` autocompletes |
| Plan usage | `/usage` (then `Esc` to close) |
| Context usage | `/context` |
| Interrupt Claude | `Esc` |
| Resume after interrupt | type `go` |
| Clear the session | `/clear` (or `Ctrl+C` twice to quit & start fresh) |

## Setup: `/terminal-setup`

Run `/terminal-setup` (the input turns lilac) and hit enter — it installs key bindings, most
importantly **`Shift+Enter` for new lines** so you can write multi-line prompts. On macOS/Windows
it's set up for you; on WSL you install it manually.

## `/usage` — plan limits

Shows how much Claude Code usage you have left in the current **session** and current **week**
(with a separate figure for weekly Sonnet usage). Looks different by plan. Useful to monitor;
nothing to act on right now. `Esc` closes it.

## `/context` — what's filling the window

Shows a graph of how the context window is being used. In the lesson it was about
**21,000 / 200,000 tokens (~10%)**. This is how you introspect what Claude currently "remembers"
and how much room is left — the course returns to context a lot.

<figure>
  <div class="diagram">
    <svg viewBox="0 0 460 54" role="img" aria-label="Context usage bar: about 21k of 200k tokens used">
      <rect x="6" y="14" width="380" height="22" rx="6" fill="#1b1e25" stroke="#262a32"/>
      <rect x="6" y="14" width="38" height="22" rx="6" fill="#ffb000" opacity="0.7"/>
      <text x="52" y="30" font-size="12" fill="#c2c7d0" font-family="monospace">~21k</text>
      <text x="392" y="30" font-size="12" fill="#9aa0a8" font-family="monospace">200k</text>
    </svg>
  </div>
</figure>

*/context visualises usage — here ~10% of the window.*

## `/clear` — reset to zero

Clears the entire conversation history and resets the context window to zero — like starting a
brand-new chat; Claude forgets the previous conversation. Verify it worked by running `/context`
again (history is empty), then a quick `Say hello` confirms the session still works.

> [!NOTE] Just the mechanics
> This lesson is deliberately "where the buttons are," not *when* to push them. The strategy for
> when to `/clear` and how to manage context comes later.

## The full cycle

Send → monitor (`/usage`, `/context`) → interrupt (`Esc`) → clear (`/clear`) → resume. That's the
basic loop of operating a session.
