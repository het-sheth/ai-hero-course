---
title: Non-Determinism
status: learning
created: 2026-06-13T00:00:00.000Z
desc: >-
  Same prompt → different answers. Responses sit on a probability curve; expect
  outliers and ride the wave.
tags:
  - llm
  - non-determinism
  - expectations
  - fundamentals
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - raw/day-1-fundamentals/non-determinism.md
related:
  - /day-1-fundamentals/build-a-feature.md
  - /day-1-fundamentals/constraints-of-llms.md
  - /day-5-afk-agents/afk-agents.md
first_seen: log/2026-06-13
first_seen_label: 2026-06-13 · Day 1 Fundamentals
order: 5
type: concept
description: >-
  Agents are non-deterministic — LLMs choose each next token from a probability
  distribution, so the same prompt on the same codebase can give different
  answers. Most land in the sensible middle; some are weird outliers. Expect it,
  and ride the wave.
timestamp: 2026-06-13T00:00:00.000Z
---

A quick detour to set expectations. After the [Build A Feature](/day-1-fundamentals/build-a-feature.md) exercise, the most
common question Matt got the first time he taught this was: *"Why didn't my agent do what yours did?
Same inputs, same codebase, same steps — surely it acts the same."* It doesn't.

## Agents are non-deterministic

LLMs are **next-token-chooser machines**: each next token is picked from a set of probabilities, not
fixed. So the same question asked twice can produce two different answers — even with identical
inputs and codebase.

## A probability distribution of responses

Any response your agent gives sits somewhere on a probability curve:

- **Most** responses group toward the middle — the sensible route.
- **Some** are really good.
- **Occasionally** you get weird outliers.

> [!NOTE] This is normal
> Teaching this to ~2,500 students the first time, a couple had genuinely strange runs where the
> agent did something completely different from the demo. The non-determinism is **baked in** — it's
> not a bug in your setup.

## Ride the wave

You can make agents *more* consistent — especially later in the [AFK](/day-5-afk-agents/afk-agents.md)
phase, once feedback loops enter the picture — but you'll always get a little of this odd behavior.
Set your expectations accordingly: steer, retry, and don't assume a single run is the agent's "true"
answer.
