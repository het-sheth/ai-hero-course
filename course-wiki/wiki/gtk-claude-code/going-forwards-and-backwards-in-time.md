---
title: Going Forwards & Backwards in Time
topic: gtk-claude-code
status: learning
created: 2026-06-09
updated: 2026-06-09
lede: "Navigating Claude Code's history like time travel: double-Esc rewind mode restores code and/or conversation to an earlier point, and sessions persist locally so you can always resume where you left off."
desc: "Rewind mode (restore code/conversation) + locally-persisted, resumable sessions."
tags: [claude-code, sessions, rewind]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/gtk-claude-code/going-forwards-and-backwards-in-time.md
related: [managing-your-session, claude-and-your-ide]
first_seen: log/2026-06-09
first_seen_label: 2026-06-09 · Getting to Know Claude Code
order: 4
---

Claude Code lets you navigate your conversation history like you're moving through time. Made a change you want to undo? Just ask Claude to revert it. Need to go back further? You can rewind your entire session to any previous point. This is useful when experimenting — try something, and if it doesn't work, step back without losing your conversation history. Claude also persists all your sessions locally, so if a session gets interrupted you can resume exactly where you left off.

## Reverting a single change

The lightest-weight undo is just asking. For instance, after a change that removed a dev script, you can say:

```text
revert that, please
```

Claude undoes what it just did — here, by re-adding the script back in. Accept the diff by pressing `Ctrl-S` to save.

## Understanding rewind mode

For going back further than a single revert, there's rewind mode.

- Make a change to your codebase (ask Claude to add a file, modify code, or remove something).
- Press `Escape` twice in quick succession to enter rewind mode — this opens your conversation history showing every step. The current state is at the bottom; earlier interactions are above.
- Select a previous point with the arrow keys, then press `Enter` to select.

> [!TIP]
> You can keep going back: open the terminal again and press `Escape` twice to rewind further — for example, all the way back to the point before a command was removed completely.

## Choosing what to restore

When you select a point, Claude Code gives three choices:

| Option | What It Does |
| --- | --- |
| Restore code and conversation | Rewind your entire session to that point |
| Restore conversation only | Keep the conversation, but reset the code |
| Restore code only | Keep the code as-is, but rewind the conversation |

"Restore code and conversation" is the most common choice — it takes you back to exactly how things were before that change.

> [!NOTE]
> If you change your mind, exit rewind mode by pressing `Escape` or selecting "Nevermind" to stay at the current point. (There's also a "summarize from here" option, covered later.)

## Pausing and resuming sessions

Claude persists its sessions locally, so an interrupted session is never lost — you can quit and resume in a few different ways.

- Quit Claude Code by pressing `Ctrl-C` twice — this stops the session, but Claude remembers everything.
- Resume your exact session with the command Claude outputs:

```bash title="Resume by UUID"
claude resume <uuid>
```

- Alternatively, press `Ctrl-C` twice again, then start a fresh session by typing `claude`.
- Inside a fresh session, use `/resume` to browse all your previous conversations in this repository. Type to filter, then press `Enter` to jump back into a session (code + conversation intact).

## Testing session persistence

To confirm it all works: make a change, exit with `Ctrl-C` twice, then run a shortcut that puts you right back without copying the UUID:

```bash title="Resume the most recent session"
claude --continue
```

Verify that the code and conversation are exactly as you left them.

> [!TIP]
> See [[managing-your-session]] for more on shaping the conversation, and [[claude-and-your-ide]] for working alongside your editor while you rewind and resume.
