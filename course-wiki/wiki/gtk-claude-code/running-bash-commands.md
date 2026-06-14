---
title: Running Bash Commands
status: learning
created: 2026-06-09T00:00:00.000Z
desc: '! bash mode, Ctrl+B background, Ctrl+Z/fg suspend — driving bash from Claude.'
tags:
  - claude-code
  - bash
  - dev-server
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - raw/gtk-claude-code/running-bash-commands.md
related:
  - /gtk-claude-code/claude-and-your-ide.md
  - /gtk-claude-code/permissions.md
first_seen: log/2026-06-09
first_seen_label: 2026-06-09 · Getting to Know Claude Code
order: 5
type: concept
description: >-
  Three ways to drive bash from Claude Code: ! bash mode (output goes into
  Claude's context), Ctrl+B to background a long-running process like a dev
  server, and Ctrl+Z to suspend Claude entirely so your commands stay hidden
  from it (fg to resume).
timestamp: 2026-06-09T00:00:00.000Z
---

Bash commands turn the agent from a passive code writer into something that can seek feedback loops, work with your project, and use the full power of bash to find information and do things. Claude can run tests, check files, and respond to real output. There are three ergonomic ways to drive bash while Claude Code is running, and each serves a different purpose.

## Bash mode: run a quick command Claude can see

When you just know the command you want to run and want its result in Claude's context, use bash mode. Type a `!` prefix to enter bash mode; whatever you type is turned into a bash command and run.

```bash title="bash mode"
! npm run typecheck
```

The output appears in the terminal and is automatically incorporated into Claude's context. Claude can then see and respond to it — if there are errors, it can analyze them and suggest fixes. In the lesson, running `npm run typecheck` without having run `npm install` produced errors; Claude saw them and figured out that Zod was in `package.json` but not installed, suggesting `npm install`.

This is perfect for quick checks with a clear start and end: running tests, checking file contents, verifying setup.

## Ctrl+B: background a long-running process

Bash mode works for commands that have a start and an end, but some commands are meant to persist — like a dev server. Run one in bash mode, then background it:

```bash title="long-running dev server"
! npm run dev
```

While it's running, press **Ctrl+B** to move it to the background. A status message appears noting the command was manually backgrounded with a task ID, and any output goes into a local file. A background task indicator shows underneath the status line.

- Press the **down arrow** to navigate to the background task indicator.
- Press **return** to open it and view the shell — you can see what's happening, including the localhost URL it's running on (e.g. `localhost:5175`). You also get options here, such as stopping it with **X**.
- Press the **left arrow** to return to Claude Code; the process keeps running in the background.

> [!TIP]
> This shines when debugging a dev server. Claude can see where the logs are written, try something out in the UI or send a curl request, and then read the output of the dev server while it debugs.

## Ctrl+Z / fg: suspend Claude and take the terminal

If you want to run something you don't want Claude to see — while preserving the state inside your Claude session — suspend it.

- Press **Ctrl+Z** to suspend Claude Code completely. The terminal is now yours, and you can run any commands you want.
- Anything you run while suspended is hidden from Claude (e.g. `echo foo`). Claude won't see or act on it.
- Type `fg` to resume Claude Code. It comes back exactly where it left off with all previous state intact; the commands you ran during suspension aren't visible to it, but the session continues seamlessly.

```bash title="suspend / resume"
# Ctrl+Z suspends Claude Code — terminal is yours
echo foo        # hidden from Claude
fg              # resume Claude Code with all state intact
```

## Which one to reach for

The decision comes down to whether you want the command's output visible to Claude:

| Want | Mode | How |
| --- | --- | --- |
| Output **visible** to Claude | bash mode | `!` prefix (e.g. `! npm run typecheck`) |
| A persistent process (dev server) Claude can interact with | background | run in bash mode, then **Ctrl+B**, manage from the background task indicator |
| Command **totally hidden** from Claude | suspend | **Ctrl+Z** to suspend, `fg` to resume |

Backgrounding isn't an every-time tool — in the lesson it's mostly used for debugging some kind of dev server issue.

> [!NOTE]
> The shortcuts shown here are Windows shortcuts. If you're on Mac you may need to do something different.
