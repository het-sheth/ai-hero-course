---
title: The Seven-Phase Process
topic: process
status: learning
created: 2026-06-01
updated: 2026-06-01
lede: "The spine of the whole course: a repeatable process you wrap around any coding agent so it ships code on a real codebase. The point isn't a rigid framework — it's a process you own and iterate on."
tags: [process, workflow, afk]
sources:
  - "https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04"
related: [day-1-fundamentals/grill-execute-clear, day-3-planning/prds, day-5-afk-agents/afk-agents]
first_seen: log/2026-06-01
first_seen_label: 2026-06-01 · Where We're Going
order: 1
---

## The philosophy: own your process

Coding agents took a big leap from around December 2025, which set off a wave of heavy
frameworks built on top of them (GSD, Spec Kit, BMAD, and similar). Matt's stance is the
opposite: **you, the developer, should own your process**. The course teaches a process you can
then iterate on and make your own, grounded in real engineering skills and heuristics built up
over decades of industry practice — not a framework you adopt wholesale.

## The seven phases

<figure>
  <div class="diagram">
    <svg viewBox="0 0 720 150" role="img" aria-label="Seven-phase pipeline: Grill, Research, Prototype, PRD, Issues, Implement, Review">
      <defs>
        <marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#9aa0a8"/>
        </marker>
      </defs>
      <g font-size="11.5" text-anchor="middle">
        <!-- phases 1..7 -->
        <g>
          <rect x="6"   y="50" width="86" height="44" rx="8" fill="#ffb000" opacity="0.10" stroke="#ffb000"/>
          <text x="49" y="70" font-weight="700" fill="#ffb000">1 Grill</text>
          <text x="49" y="85" font-size="9.5" fill="#9aa0a8">requirements</text>
        </g>
        <g>
          <rect x="104" y="50" width="86" height="44" rx="8" fill="#58c7f3" opacity="0.10" stroke="#58c7f3"/>
          <text x="147" y="70" font-weight="700" fill="#58c7f3">2 Research</text>
          <text x="147" y="85" font-size="9.5" fill="#9aa0a8">approaches</text>
        </g>
        <g>
          <rect x="202" y="50" width="86" height="44" rx="8" fill="#58c7f3" opacity="0.10" stroke="#58c7f3"/>
          <text x="245" y="70" font-weight="700" fill="#58c7f3">3 Prototype</text>
          <text x="245" y="85" font-size="9.5" fill="#9aa0a8">test ideas</text>
        </g>
        <g>
          <rect x="300" y="50" width="86" height="44" rx="8" fill="#58c7f3" opacity="0.10" stroke="#58c7f3"/>
          <text x="343" y="70" font-weight="700" fill="#58c7f3">4 PRD</text>
          <text x="343" y="85" font-size="9.5" fill="#9aa0a8">spec + plan</text>
        </g>
        <g>
          <rect x="398" y="50" width="86" height="44" rx="8" fill="#58c7f3" opacity="0.10" stroke="#58c7f3"/>
          <text x="441" y="70" font-weight="700" fill="#58c7f3">5 Issues</text>
          <text x="441" y="85" font-size="9.5" fill="#9aa0a8">structure work</text>
        </g>
        <g>
          <rect x="496" y="44" width="86" height="56" rx="8" fill="#5af78e" opacity="0.14" stroke="#5af78e" stroke-width="2"/>
          <text x="539" y="66" font-weight="700" fill="#5af78e">6 Implement</text>
          <text x="539" y="80" font-size="9.5" fill="#5af78e">AFK — agent ships</text>
          <text x="539" y="92" font-size="9.5" fill="#9aa0a8">you plan next</text>
        </g>
        <g>
          <rect x="594" y="50" width="86" height="44" rx="8" fill="#ffb000" opacity="0.10" stroke="#ffb000"/>
          <text x="637" y="70" font-weight="700" fill="#ffb000">7 Review</text>
          <text x="637" y="85" font-size="9.5" fill="#9aa0a8">evaluate</text>
        </g>
      </g>
      <g stroke="#9aa0a8" stroke-width="1.4" marker-end="url(#a)">
        <line x1="92"  y1="72" x2="102" y2="72"/>
        <line x1="190" y1="72" x2="200" y2="72"/>
        <line x1="288" y1="72" x2="298" y2="72"/>
        <line x1="386" y1="72" x2="396" y2="72"/>
        <line x1="484" y1="72" x2="494" y2="72"/>
        <line x1="582" y1="72" x2="592" y2="72"/>
      </g>
    </svg>
  </div>
</figure>

*Phase 6 (Implement) runs AFK — that's the pillar that lets you parallelize with the agent.*

| # | Phase | What it's for |
|---|-------|---------------|
| 1 | **Grill** | Understanding the requirements |
| 2 | **Research** | Exploring solutions and approaches |
| 3 | **Prototype** | Testing ideas quickly |
| 4 | **PRD** | Building specifications and plans |
| 5 | **Issues** | Structuring work for the agent |
| 6 | **Implement** | The agent ships the code |
| 7 | **Review** | Evaluating what's been done |

## The key pillar: AFK implementation

> [!NOTE] Note
> The implementation step should run **completely AFK (away from keyboard)**. That's what lets you
> parallelize with the agent — you plan the next phase while it ships the current one, instead of
> sitting and watching.

Getting the agent to produce good code reliably while AFK is the hard part, and it's where real
engineering skills matter.

## What it's for

By the end of the course the goal is to take any coding agent and wrap it in this process so you
can ship code on your own codebases — moving faster by parallelizing yourself with the AI, knowing
when to step in as the human (to prototype, research, and impose taste), and keeping the codebase
healthy because agents thrive in good codebases.
