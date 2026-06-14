# Day 1 · Fundamentals

* [The Constraints of LLMs](/day-1-fundamentals/constraints-of-llms.md) - Smart zone vs dumb zone, fuzzy-JPEG memory, statelessness, knowledge cutoff — the four LLM constraints.
* [Subagents](/day-1-fundamentals/subagents.md) - Context-saving delegation: orchestrator spawns fresh-context subagents that do focused work and report a summary back.
* [Codebase Exploration](/day-1-fundamentals/codebase-exploration.md) - Use the word "explore" to trigger a dedicated Explore subagent for deep, aggressive repo analysis.
* [Build A Feature](/day-1-fundamentals/build-a-feature.md) - First feature (star ratings) — observe Claude's default workflow and watch /context for the 40% dumb-zone line.
* [Non-Determinism](/day-1-fundamentals/non-determinism.md) - Same prompt → different answers. Responses sit on a probability curve; expect outliers and ride the wave.
* [Showing Context in the Status Line](/day-1-fundamentals/showing-context-in-status-line.md) - Surface live context usage in your status line (ccstatusline) so you can watch the dumb-zone line.
* [Why Plan Mode Sucks](/day-1-fundamentals/why-plan-mode-sucks.md) - Plan mode skips the shared design concept. Better: explore → interview (grill-me) → implement.
* [Grill → Execute → Clear](/day-1-fundamentals/grill-execute-clear.md) - The core session loop: /grill-me interviews you into a shared design concept, you execute, then clear. Practised by designing a lesson-comments feature.
* [Compaction](/day-1-fundamentals/compaction.md) - Claude Code summarizes a full conversation into a smaller form to keep going past the limit — but repeated compaction leaves "sediment". Prefer clean context.
* [Handing Off](/day-1-fundamentals/handing-off.md) - /handoff writes a tailored temp markdown doc so a fresh agent continues in a clean window — compaction's output without the sediment. Enables expand→contract flows.
