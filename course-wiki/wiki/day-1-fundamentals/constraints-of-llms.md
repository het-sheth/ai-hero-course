---
title: The Constraints of LLMs
topic: day-1-fundamentals
status: learning
created: 2026-06-09
updated: 2026-06-09
lede: "LLMs aren't junior devs — they're weirder. Four constraints shape everything: the smart zone / dumb zone (attention scales quadratically), they're a fuzzy-JPEG database (hallucinations), they're stateless, and they have a knowledge cutoff. Work with these, not against them."
desc: "Smart zone vs dumb zone, fuzzy-JPEG memory, statelessness, knowledge cutoff — the four LLM constraints."
tags: [llm, context-window, attention, fundamentals]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
  - raw/day-1-fundamentals/constraints-of-llms.md
related: [subagents, gtk-claude-code/managing-your-session]
first_seen: log/2026-06-09
first_seen_label: 2026-06-09 · Day 1 Fundamentals
order: 1
---

LLMs aren't junior developers who can work 24/7. They're something fundamentally weirder and more constrained. Working against these constraints produces garbage output. Working with them makes Claude Code a genuinely powerful coding partner.

## Smart Zone vs. Dumb Zone

Every token added to the context window must store its relationships to every other token. That relationship count scales quadratically — like adding a team to a football league where every new team plays every other team.

| Tokens | Relationships |
|--------|--------------|
| 4      | 6            |
| 8      | 28           |
| 100    | ~5,000       |

Early in the context window the model has ample attention budget and reasons clearly — the **smart zone**. As the window fills, attention relationships become strained: hallucinations creep in, reasoning degrades, and the model sometimes fails to recall information sitting right there in its context. This is the **dumb zone**.

> [!CAUTION] Dumb zone threshold
> In a 200k-token window, the instructor starts getting concerned around the **80,000-token mark** (~40%). Some say 60–70% is safer, but everyone agrees the dumb zone exists. Past 80–90% of your context window, you are in serious trouble.

<svg viewBox="0 0 520 72" width="520" xmlns="http://www.w3.org/2000/svg" aria-label="Smart zone vs dumb zone in a 200k token context window">
  <!-- track -->
  <rect x="20" y="24" width="480" height="24" rx="4" fill="#1b1e25"/>
  <!-- smart zone: 0–80k = 80/200 = 192px wide -->
  <rect x="20" y="24" width="192" height="24" rx="4" fill="#5af78e" fill-opacity="0.13" stroke="#5af78e" stroke-width="1.5"/>
  <!-- dumb zone: 80k–200k = 288px wide -->
  <rect x="212" y="24" width="288" height="24" rx="0" fill="#ffb000" fill-opacity="0.13" stroke="#ffb000" stroke-width="1.5"/>
  <!-- divider -->
  <line x1="212" y1="20" x2="212" y2="52" stroke="#9aa0a8" stroke-width="1" stroke-dasharray="4 3"/>
  <!-- labels -->
  <text x="116" y="40" text-anchor="middle" font-size="11" fill="#5af78e" font-family="monospace">smart zone</text>
  <text x="356" y="40" text-anchor="middle" font-size="11" fill="#ffb000" font-family="monospace">dumb zone</text>
  <!-- tick labels -->
  <text x="20"  y="64" font-size="9" fill="#9aa0a8" font-family="monospace">0</text>
  <text x="200" y="64" font-size="9" fill="#9aa0a8" font-family="monospace">80k</text>
  <text x="480" y="64" font-size="9" fill="#9aa0a8" font-family="monospace">200k</text>
</svg>

*Context window (200k tokens): smart zone runs ~0–80k tokens; dumb zone covers the remainder.*

## LLMs as a Fuzzy-JPEG Database

A common failure mode is treating LLMs as a reliable database for their pre-trained knowledge. The training process compresses terabytes of text into a fixed set of parameters small enough to fit on a GPU. The result is not a database — it is a **fuzzy JPEG** of all human knowledge. The model cannot reference original training data directly; it references this lossy compression, which makes its answers about training-time knowledge unreliable by design.

**Context window is different.** The model has access to the full, raw text of whatever is in its current context window — so it can answer those questions much more reliably. This is why you should include documentation and code examples in your prompts rather than relying on the model's background knowledge.

> [!NOTE] Implication for hallucinations
> Hallucinations are not bugs. They happen when the model is asked about something outside its compressed knowledge and fills the gap with plausible-sounding content. The fuzzy-JPEG framing predicts this: asking a blurry image to reproduce fine detail will produce invented detail.

## Statelessness

LLMs are completely stateless. Every new conversation begins from zero — no memory of previous sessions, no accumulated understanding of your codebase. Clearing the context wipes everything: the "tribal knowledge" the model built up while working on your project is gone.

Think of it as a new developer joining your team every 20 minutes with zero institutional knowledge. The quality and organization of your codebase directly determines how fast that new developer can get oriented and contribute effectively.

- Is your repo friendly to someone who has never seen it?
- Can a newcomer get oriented quickly from documentation alone?
- Are related pieces of code grouped together?

These questions matter more for Claude Code than they do for human onboarding.

## Knowledge Cutoff

Pre-training is prohibitively expensive and is not repeated continuously. Once a model is deployed, its parametric knowledge is frozen at the training cutoff date. Any library version, framework release, or world event that occurred after that date is invisible to the model's background knowledge.

Because the model's background knowledge is a fuzzy JPEG anyway, the instructor's mental model is to distrust it entirely — assume the model has no reliable background knowledge and always provide the necessary information in the context window.

## The 1M-Token Window Update

> [!NOTE] Edit Matt — recorded after initial release
> Claude shipped 1 million token context windows for Opus 4.6 and Sonnet 4.6. The default context window in Claude Code is now 1M tokens.
>
> **This does not change the smart zone.** The smart zone is still roughly the first **80,000–100,000 tokens**. What changed is the size of the dumb zone — there is now a lot more of it. Think in raw token counts, not percentages: percentage-based calculations in the rest of the course assume a 200k window.

## Summary

| Constraint | What it means | What to do |
|---|---|---|
| Smart zone / dumb zone | Attention scales quadratically; quality degrades past ~80–100k tokens | Keep context lean; clear and restart before you hit the dumb zone — see [[grill-execute-clear]] and [[compaction-and-handing-off]] |
| Fuzzy-JPEG memory | Background knowledge is lossy; hallucinations are structural, not accidental | Include docs and code examples in the prompt; never rely on model memory |
| Statelessness | Every session starts blank; codebase tribal knowledge is lost on `/clear` | Invest in codebase quality and documentation; see [[gtk-claude-code/managing-your-session]] |
| Knowledge cutoff | Training data has a hard end date; anything newer is unknown | Provide relevant docs/changelogs in context |
