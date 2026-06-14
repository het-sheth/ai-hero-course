# What Is An Agents MD File — Day 2 Steering

Source: AI Hero, *AI Coding for Real Engineers* (Cohort 004), Day 2 Steering.
Lesson: "What Is An Agents MD File" (page text + 6:22 video transcript).

## Commits referenced
- `03.08.02` — Start the lesson — comments system from the previous lesson in place
- `04.01.01` — See my solution — CLAUDE.md with steering instructions added

## Page text

Have you ever felt concerned about the size of your AGENTS.md file? Maybe you should be. A bad
AGENTS.md file can confuse your agent, become a maintenance nightmare, and cost you tokens on every
request. So you'd better know how to fix it.

### What is AGENTS.md?

An AGENTS.md file is a markdown file you check into Git that customizes how AI coding agents behave in
your repository. It sits at the top of the conversation history, right below the system prompt.

Think of it as a configuration layer between the agent's base instructions and your actual codebase.
The file can contain two types of guidance:

- **Personal scope:** Your commit style preferences, coding patterns you prefer
- **Project scope:** What the project does, which package manager you use, your architecture decisions

The AGENTS.md file is an open standard supported by many — though not all — tools. (Claude Code uses
**CLAUDE.md**.)

### Why Massive AGENTS.md Files are a Problem

There's a natural feedback loop that causes AGENTS.md files to grow dangerously large:

1. The agent does something you don't like
2. You add a rule to prevent it
3. Repeat hundreds of times over months
4. File becomes a "ball of mud"

Different developers add conflicting opinions. Nobody does a full style pass. The result? An
unmaintainable mess that actually hurts agent performance.

Another culprit: auto-generated AGENTS.md files. Never use initialization scripts to auto-generate
your AGENTS.md. They flood the file with things that are "useful for most scenarios" but would be
better progressively disclosed. Generated files prioritize comprehensiveness over restraint.

### The Instruction Budget

Kyle from Humanlayer's article mentions the concept of an "instruction budget":

> Frontier thinking LLMs can follow ~150–200 instructions with reasonable consistency. Smaller models
> can attend to fewer instructions than larger models, and non-thinking models can attend to fewer
> instructions than thinking models.

Every token in your AGENTS.md file gets loaded on every single request, regardless of whether it's
relevant. This creates a hard budget problem:

| Scenario | Impact |
|---|---|
| Small, focused AGENTS.md | More tokens available for task-specific instructions |
| Large, bloated AGENTS.md | Fewer tokens for the actual work; agent gets confused |
| Irrelevant instructions | Token waste + agent distraction = worse performance |

Taken together, this means that the ideal AGENTS.md file should be as small as possible.

### Stale Documentation Poisons Context

Another issue for large AGENTS.md files is staleness. Documentation goes out of date quickly. For
human developers, stale docs are annoying, but the human usually has enough built-in memory to be
skeptical about bad docs. For AI agents that read documentation on every request, stale information
actively poisons the context.

This is especially dangerous when you document file system structure. File paths change constantly.
If your AGENTS.md says "authentication logic lives in src/auth/handlers.ts" and that file gets
renamed or moved, the agent will confidently look in the wrong place.

Instead of documenting structure, describe capabilities. Give hints about where things might be and
the overall shape of the project. Let the agent generate its own just-in-time documentation during
planning.

Domain concepts (like "organization" vs "group" vs "workspace") are more stable than file paths, so
they're safer to document. But even these can drift in fast-moving AI-assisted codebases. Keep a
light touch.

### Cutting Down Large AGENTS.md Files

Be ruthless about what goes here. Consider this the absolute minimum:

- One-sentence project description (acts like a role-based prompt)
- Package manager (if not npm; or use corepack for warnings)
- Build/typecheck commands (if non-standard)

That's honestly it. Everything else should go elsewhere.

**The One-Liner Project Description** — This single sentence gives the agent context about why they're
working in this repository. It anchors every decision they make. Example:
`This is a React component library for accessible data visualization.` That's the foundation. The
agent now understands its scope.

**Package Manager Specification** — If you're in a JavaScript project and using anything other than
npm, tell the agent explicitly: `This project uses pnpm workspaces.` Without this, the agent might
default to npm and generate incorrect commands.

### Use Progressive Disclosure

Instead of cramming everything into AGENTS.md, use progressive disclosure: give the agent only what it
needs right now, and point it to other resources when needed. Agents are fast at navigating
documentation hierarchies. They understand context well enough to find what they need.

**Move Language-Specific Rules to Separate Files** — If your AGENTS.md currently says "Always use
const instead of let. Never use var. Use interface instead of type when possible. Use strict null
checks. ..." move that to a separate file instead. In your root AGENTS.md:
`For TypeScript conventions, see docs/TYPESCRIPT.md`. Notice the light touch, no "always," no all-caps
forcing. Just a conversational reference.

The benefits:
- TypeScript rules only load when the agent writes TypeScript
- Other tasks (CSS debugging, dependency management) don't waste tokens
- File stays focused and portable across model changes

**Nest Progressive Disclosure** — You can go even deeper. Your docs/TYPESCRIPT.md can reference
docs/TESTING.md. Create a discoverable resource tree:

```
docs/
├── TYPESCRIPT.md
│   └── references TESTING.md
├── TESTING.md
│   └── references specific test runners
└── BUILD.md
    └── references esbuild configuration
```

You can even link to external resources, Prisma docs, Next.js docs, etc. The agent will navigate
these hierarchies efficiently.

**Use Agent Skills** — Many tools support "agent skills" — commands or workflows the agent can invoke
to learn how to do something specific. These are another form of progressive disclosure: the agent
pulls in knowledge only when needed. (Covered in-depth in a separate article.)

### AGENTS.md in Monorepos

You're not limited to a single AGENTS.md at the root. You can place AGENTS.md files in subdirectories,
and they merge with the root level. This is powerful for monorepos:

| Level | Content |
|---|---|
| Root | Monorepo purpose, how to navigate packages, shared tools (pnpm workspaces) |
| Package | Package purpose, specific tech stack, package-specific conventions |

Root AGENTS.md:
```
This is a monorepo containing web services and CLI tools.
Use pnpm workspaces to manage dependencies.
See each package's AGENTS.md for specific guidelines.
```

Package-level AGENTS.md (in packages/api/AGENTS.md):
```
This package is a Node.js GraphQL API using Prisma.
Follow docs/API_CONVENTIONS.md for API design patterns.
```

Don't overload any level. The agent sees all merged AGENTS.md files in its context. Keep each level
focused on what's relevant at that scope.

### Fix A Broken AGENTS.md With This Prompt

If you're starting to get nervous about the AGENTS.md file in your repo, and you want to refactor it
to use progressive disclosure, try copy-pasting this prompt into your coding agent:

```
I want you to refactor my AGENTS.md file to follow progressive disclosure principles.

Follow these steps:

1. **Find contradictions**: Identify any instructions that conflict with each other. For each
   contradiction, ask me which version I want to keep.

2. **Identify the essentials**: Extract only what belongs in the root AGENTS.md:
   - One-sentence project description
   - Package manager (if not npm)
   - Non-standard build/typecheck commands
   - Anything truly relevant to every single task

3. **Group the rest**: Organize remaining instructions into logical categories (e.g., TypeScript
   conventions, testing patterns, API design, Git workflow). For each group, create a separate
   markdown file.

4. **Create the file structure**: Output:
   - A minimal root AGENTS.md with markdown links to the separate files
   - Each separate file with its relevant instructions
   - A suggested docs/ folder structure

5. **Flag for deletion**: Identify any instructions that are:
   - Redundant (the agent already knows this)
   - Too vague to be actionable
   - Overly obvious (like "write clean code")
```

### Don't Build A Ball Of Mud

When you're about to add something to your AGENTS.md, ask yourself where it belongs:

| Location | When to use |
|---|---|
| Root AGENTS.md | Relevant to every single task in the repo |
| Separate file | Relevant to one domain (TypeScript, testing, etc.) |
| Nested documentation tree | Can be organized hierarchically |

The ideal AGENTS.md is small, focused, and points elsewhere. It gives the agent just enough context to
start working, with breadcrumbs to more detailed guidance. Everything else lives in progressive
disclosure: separate files, nested AGENTS.md files, or skills. This keeps your instruction budget
efficient, your agent focused, and your setup future-proof as tools and best practices evolve.

## Video transcript (6:22)

00:00 In one of the early lessons of this course, I talked about how LLMs just forget everything as
soon as you clear the context. And immediately, you probably ended up thinking, okay, that sounds
terrible. That sounds awful constraint. Because I have preferences that I want to be able to teach my
LLM, or I have certain ways of working or certain patterns that the LLM maybe is not very good at by
default. It's gonna be absolutely brutal to tell the agent every single time about what my preferences
are before it goes and does its work.

00:30 It would be great if there was some kind of memory mechanism for Claude Code. Some way that
Claude Code could learn my preferences, or at least my repos preferences over time, and then use that
to better improve its output. Fortunately, there are multiple ways to solve this problem, both
supported by Claude Code and some supported by the community. And in this section we're going to walk
through how to use these to the best of your ability and which ones to pick. The first one we're going
to look at is Agents.md, which is a simple open format for guiding coding agents.

00:59 You can think of Agents.md as a readme for agents, a dedicated predictable place to provide the
context and instructions to help AI coding agents work on your project. The appeal of agents.md is how
many places it is supported by, or rather how many tools use it. Gemini CLI, Devin, Codex, Cursor. The
very notable exception here is actually Claude Code. Claude Code doesn't use Agents.md and doesn't
recognise it.

01:21 Instead, it writes it as Claude.md. My desperate hope is that Claude Code will start supporting
Agents.md because it's just so stupid that it doesn't. And so because I'm very helpful and maybe a bit
naive, I'm just going to refer to it as agents.md, whereas in fact we will be writing claude.md. What
we're going to do first is go into our project and run touch claude.md here just to see how it works.
And we end up with an empty claude.md file in the root of our repository.

01:46 I'm gonna say to it, always reply to me in pirate language. And then we're gonna save this file
and then open up Claude inside my terminal here. I'll then say to it, hello, how are you doing today?
And when we run this, we can see that it's now replying in pirate language, wonderful. So we have
successfully steered our coding agent.

02:03 There's a really important thing to note here though, I didn't at any point opt into this
claude.md, it just was pulled into the conversation. In other words, things inside claude.md are
global for the entire repository. This means that no matter what I do in this repo, Claude.md will now
be responding to me in pirate language. And so this is the biggest downside with Agents.md or
Claude.md, it is global. So this means that our Claude.md will be included in every conversation that
we have with Claude.

02:31 I'm going to copy and paste this about a thousand times here until I end up with an enormous file
just to show you the impact on the context window. Okay we now have a 2000 line file where it just
says always reply to me in pirate language. I'm now going to kick off a new Claude code instance to
make sure it picks up the changes in my Claude.md and we can see an error here saying a large Claude.md
will affect performance. If I go into my context here by visualising the current context usage, we can
see that I have burned about 10% of my entire context here on this memory file, on the Claude.md file.
So everything you put in Claude.md costs you tokens.

03:10 And I have, no joke, out there in the wild, seen Claude.mds that are not this stupid, but
certainly have around 500 lines or 1000 lines of stuff in them. So my default attitude with Claude.md
files is paranoia and not wanting to put too much stuff in there, not only because it's global but also
because it costs you tokens on every single request. You notice I have quite a lot of paranoia when I
come to working with AI agents. I think that's relatively healthy. I especially have paranoia about a
specific command that Claude bundles with, which is the init command.

03:42 If I run this here, you'll see what it does. It initializes a new Claude.md file by looking at
your repository, exploring it and putting some of the code based conventions inside a Claude.md file at
the root. We can see it's kicked off an explore sub-agent here so we'll wait for this to complete. You
can try this too if you like. I sort of don't recommend you do it for reasons we'll explain in a
minute.

04:01 OK, we can now see the edit that it has proposed to make and the edit is a pretty large Claude.md
file. If we open up Claude again, if we cancel out of it and then run a new Claude session, we can see
by running context just how much this is filling up our context window, and we should see that the
memory file, it's nearly a thousand tokens here that it's created. Now that might not sound very much,
that's just sort of 0.4% of the context window, but if you imagine that's on every single request,
that is just going to push you closer to the dumb zone and cost you tokens on every request. And a lot
of this stuff is just stuff that it could discover very simply by itself and stuff that will probably
go out of date quite quickly too. For instance, the stuff inside the package.json here is incredibly
easy for it to discover.

04:48 Just check the package.json file. And if you ever change any of these scripts, you'll need to
remember to go into claude.md and update this too. So for that reason, I really don't recommend you run
claude init, even though the UI will tell you to a bunch of different times. It's also worth saying
that Claude often actually ignores the stuff inside Claude.md. Claude code injects the following system
reminder with your Claude.md file in the user message to the agent, which is this context may or may
not be relevant to your tasks. You should not respond to it unless it's highly relevant.

05:15 In other words, Claude will just ignore anything inside your Claude.md file if it thinks that
it's not relevant to its current task. This, by the way, is from an excellent article from Human Layer
on optimizing your Claude.md file, which I'll link below. So even if you put stuff in there, Claude has
the option to just ignore it if it wants to, which means that steering it is not always reliable. So
now you understand a bit more of what Claude.md is or what Agents.md is, when should you actually use
it?

05:43 Well, we're going to be getting into this and talking about it a lot more during this section
because it's not an easy question to answer. But anyway, let's summarise. Essentially agents.md and
claude.md are the same thing, except that Claude Code never listens to agents.md and will only listen
to claude.md files. Claude.md is often ignored and that's kind of by design because Claude Code
actually tells the agent or tells the LLM do not always use this. And finally Claude.md is global so
it's included on every single request you make to the agent.

06:15 So you better make sure that the stuff you put in there is relevant to every single request
you're gonna make of the agent. So nice work folks, I will see you in the next one.
