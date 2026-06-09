---
title: Claude & Your IDE
topic: gtk-claude-code
status: learning
created: 2026-06-09
updated: 2026-06-09
lede: "Connecting Claude Code to your IDE with /ide. The big payoff is diff management — rich, reviewable diffs in your editor instead of awkward terminal diffs, so you can scroll, tweak, and accept changes in context."
desc: "/ide integration — its main value is rich, editable diffs in your editor."
tags: [claude-code, ide, diffs]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/gtk-claude-code/claude-and-your-ide.md
related: [running-bash-commands, going-forwards-and-backwards-in-time]
first_seen: log/2026-06-09
first_seen_label: 2026-06-09 · Getting to Know Claude Code
order: 3
---

When working with Claude Code, you'll want it to integrate smoothly with your development environment. The IDE integration isn't just a nice-to-have — it shapes how you interact with Claude's output, especially managing code changes. The most useful part is how Claude Code handles diffs: instead of a hard-to-read terminal format, your IDE displays them in a rich, interactive way. You can scroll through files, review changes line-by-line, and even make tweaks before accepting them.

It works across editors. VS Code is used here, but Cursor, Windsurf, Antigravity, and others are supported too.

## Set up your IDE integration

Run the `/ide` command in Claude Code. It shows your IDE connection status and guides installation if needed — the output tells you which IDE you're connected to and provides installation instructions for other supported IDEs (Cursor, Windsurf, others).

```text title="terminal"
/ide
```

- **Install the Claude Code extension for your IDE.** Claude Code communicates with your IDE through an extension; for VS Code it's "Claude for VS Code". Follow the installation link from the `/ide` output.
- **Press enter to confirm and close the IDE status check.** Once installed and connected, your IDE is ready to handle diffs.

## Experience diff management in your IDE

Ask Claude to make a file change, for example:

```text title="prompt"
Remove the test watch command from package.json
```

Then watch Claude read and modify the file — it reads `package.json` and proposes changes.

Close the terminal diff view and observe the change in your IDE. Instead of a confusing terminal diff, the proposed change appears directly in your editor — a richer experience. You can review the change in context: scroll through the file and see the surrounding code.

To accept or modify:

- Click **"Accept Proposed Changes"** in your IDE, OR
- Manually edit the file and save to accept, OR
- Reject and ask Claude to try again.

> [!TIP]
> Saving the file is itself an acceptance — by saving, you agree to the changes.

## When to use IDE integration

- **IDE integration primarily powers diff management** — the feature that shows up most and delivers the most value (the one used 99% of the time).
- **You can tweak Claude's output before accepting it** — quick adjustments without re-running the prompt.
- **Your IDE provides better visibility than the terminal** — syntax highlighting, line numbers, and file context.

There are more features and more ways your IDE integrates with Claude Code, but diff management is the standout.
