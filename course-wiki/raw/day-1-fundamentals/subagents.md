# RAW — What Are Subagents (Day 1 Fundamentals, 03.02)

> Immutable source material for [[day-1-fundamentals/subagents]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 2:31.

## Lesson page content

Subagents are one of the main ways Claude Code keeps the main conversation useful. They let the orchestrator agent hand off focused work to a separate context window, then bring back a summary instead of filling the parent context with every detail.

Why subagents matter: Claude Code has a limited context window. Some of that window is always taken up by the system prompt, tools, and other instructions Claude Code needs in order to behave like an agent. After that, the session still needs room for real work: exploring the repo, understanding the task, making implementation decisions, writing code, responding to feedback. The more tokens Claude Code spends on exploration, the fewer tokens remain for implementation. But if it explores too little, the implementation gets worse because the model has less context about the repo. Subagents help with this tradeoff.

The orchestrator and the subagent: The agent you talk to directly is the orchestrator agent. When it needs help with a focused task, it can spawn a subagent with a fresh context window. That subagent can spend its own tokens doing the task (such as exploring a repo or gathering information) without polluting the parent conversation. When it finishes, it reports a summary back to the orchestrator. A useful way to think about it: the orchestrator is the lead developer; the subagent is a delegated helper; the helper does focused work; the helper returns findings to the lead. This gives the orchestrator useful context without forcing it to carry every tool call and detail from the delegated work.

Subagents can run in parallel: Claude Code can spawn multiple subagents. They can work on different parts of a task at the same time, then each report back to the parent orchestrator. Subagents can also be configured differently — they may use different prompts or different models. For simpler tasks like exploration, Claude Code may use a faster, cheaper model while still returning high-quality findings.

The key idea: Subagents are a context-saving delegation mechanism. They help Claude Code keep the orchestrator's context window cleaner, preserve more space for implementation, and gather useful information without dragging every intermediate detail into the main conversation. You will see Claude Code use them aggressively throughout the course.

## Full video transcript

00:00 Now we understand some of the constraints of LLMs, let's start talking about how Claude Code tries to mitigate them. Specifically, there's a super important strategy that Claude Code implements to squeeze more juice out of its context window. I've got a little visualization of the context window here. We can imagine that each of these sections are different tasks that Claude Code needs to do in that session. This grey bit I'm imagining is the system prompt, the bit that we saw in the context, the stuff that's always in there, the system prompt, the system tools, the stuff that's always being passed to the LLM to tell it how to behave like Claude Code.

00:32 Then the first thing the agent might need to do is let's say explore the repo. It comes in with zero memory right so it needs to do a bit of exploration before it then goes on to the green which in this case is implementation. And then in this example this dark grey is stuff that's just empty space in the context window that hasn't been filled up yet. Now the dream for any kind of harness, any kind of Claude code-like application would be to make these chunks smaller, right? Because the less tokens we spend on exploration, the more tokens we have available in the smart zone for the implementation.

01:01 But of course if we spend less effort in the exploration mode we are probably going to end up with a worse exploration which means probably the LLM will have fewer, less context about our repo, which probably means a worse implementation. So it's hard to see how you bridge this divide. So Claude Code and agent tools like it employ a really smart solution. In the agent that you talk to, which is the orchestrator agent, it then spawns a sub-agent. In other words, it creates a new context window and prompts that sub-agent to do this task here.

01:34 So the sub-agent can then spend lots of tokens doing the task all within its smart zone, and then it reports a summary of its results back to the orchestrator agent. In other words, this is a delegation mechanism. It's kind of like the orchestrator is the lead developer and it just pawns off a task to a junior developer to say explore this repo for me and then report back your findings. The orchestrator can spawn multiple sub-agents too so you can have multiple sub-agents doing work in parallel and when they're all finished they report back to the parent orchestrator. These sub-agents can be spawned with different system prompts and different models too.

02:07 So we can even use a cheaper model for the sub-agents if it's a relatively simple task like exploration. It's super common to see Claude Code spawn with Haiku, for instance, for exploration, which is really fast and really high quality. So this is what sub-agents are. They are a context saving mechanism for the orchestrator agent. And Claude Code uses them extremely aggressively, so you're gonna see them everywhere when you use Claude Code.

02:29 Nice work, and I'll see you in the next one.
