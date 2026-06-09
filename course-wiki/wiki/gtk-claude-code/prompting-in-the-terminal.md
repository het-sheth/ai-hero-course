---
title: Prompting in the Terminal
topic: gtk-claude-code
status: learning
created: 2026-06-09
updated: 2026-06-09
lede: "Practical prompting tips for the Claude Code terminal: reference files with @, stash a prompt with Ctrl+S to send something else first, and paste images for visual context."
desc: "@ file references, Ctrl+S stash, pasting images — terminal prompting tips."
tags: [claude-code, prompting, files]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/gtk-claude-code/prompting-in-the-terminal.md
related: [managing-your-session, claude-and-your-ide]
first_seen: log/2026-06-09
first_seen_label: 2026-06-09 · Getting to Know Claude Code
order: 2
---

When working with Claude Code, you want to give Claude exactly the right context to succeed. The better you can reference files, manage your prompts, and provide visual context, the better results you'll get. These are a few practical techniques for communicating with Claude in the terminal.

## Referencing files with the @ symbol

When you want Claude to focus on specific files, use the `@` symbol to reference them directly.

- Type `@` and start typing a filename — autocomplete suggestions appear (e.g. typing `@routes` might show `routes.ts`).
- Navigate suggestions with the arrow keys; press `Tab` to select a file.
- Add multiple files by repeating the process (type `@` again for each).

```text title="prompt"
Tell me about @routes.ts and @schema.ts
```

When you run it (`Return`), Claude automatically reads both files into the context window. This saves Claude from finding them manually and gives it exactly what it needs. Finding the files costs a little upfront time, but it's worth it.

## Stashing commands with Ctrl+S

Sometimes you're working on a complex prompt but realize you need to ask Claude something else first. Instead of losing your work, stash it.

- Write a detailed prompt, then press `Ctrl+S` to stash it. Your prompt is saved in Claude's memory and won't be submitted.
- Type a new prompt and press `Return` to submit it.

```text title="prompt"
@myfile.ts - why is this broken?
```

- After Claude responds, your stashed prompt automatically reappears; press `Return` to submit it.

> [!TIP]
> This is especially useful when you're about to give Claude feedback, realize you need to provide more context first, and don't want to lose your original detailed instructions.

### Clearing stashed commands

If you stash a prompt and decide you don't need it, press `Ctrl+C` to clear the stashed command. The prompt is removed and you're back to a blank input field.

## Adding images to your prompts

Claude can analyze images — useful for visual designs, screenshots, or other image content.

- Copy an image (right-click → "Copy image").
- Click in the Claude Code input field and paste (`Ctrl+V` / `Cmd+V` on Mac).
- Type your prompt below or above the image, then press `Return`; Claude analyzes the image and responds.

```text title="prompt"
What location is this? Tell me about it.
```

> [!NOTE]
> Image pasting works on most systems, but may not work on Windows Subsystem for Linux (WSL).
