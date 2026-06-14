# RAW — Why Plan Mode Sucks (Day 1 Fundamentals, 03.07)

> Immutable source material for [[day-1-fundamentals/why-plan-mode-sucks]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 5:03.

## Lesson page content

Now that you understand how your agent behaves under normal conditions, let's explore practices that
improve its output. This is about **plan mode** — a feature Matt used to recommend enthusiastically
but no longer recommends in the same way. Most agents now ship with plan mode (Claude Code, Codex,
others); you can build your own in other tools. Accessed by shift-tabbing in the agent interface.
The point: create a plan before implementing. (You saw the agent auto-enter plan mode in the
previous Build A Feature video.)

What Plan Mode Does: In the default **implement mode**, your agent can do four things: write files,
read files, run bash scripts, call MCP servers (covered later). **Plan mode removes the ability to
write files** — the agent can still read files, run bash, and call MCP servers, but can't change
your codebase.

Why Planning Is Powerful: Talking through what you're building helps you understand it better and
aligns you with the agent. A deliberate planning step forces exploration — the agent explores the
repo, gathers context, figures out what it needs. Once you both understand what to build, it creates
an implementation plan, saved as a markdown document in your repo, used to guide implementation. The
agent often asks: do you want to clear the context before implementing? It trusts the plan that much.

The Three Phases of Plan Mode (ideally):
1. Initial prompt — you tell the agent what you want to build
2. Exploration — the agent explores the repo
3. Interview and planning — the agent interviews you, then creates a plan

The Interview Problem: In practice the interview phase is often **truncated**. The agent explores,
asks one or two questions, then jumps straight into creating a plan. You're left reviewing a wall of
text, trying to figure out if you're aligned. It's easy to skim and miss that you're completely
misaligned → the common failure mode: the agent didn't do what you wanted. Maybe the implementation
is totally different from what you imagined; maybe the feature doesn't behave right; maybe tiny
details were wrong — with massive knock-on effects.

The Concept of Shared Design: Frederick P. Brooks calls this lacking a **shared design concept** (in
*The Design of Design*). A design concept isn't an asset or a plan — it's the ephemeral understanding
shared between all participants. You and the agent are collaborators with a communication gap; you
need to establish a shared design concept before implementing. Plan mode's failure mode is that it
skips this entire stage: it explores, creates a plan, forces you to review it, and you don't know if
you're aligned.

A Better Approach: The process Matt now recommends — **Explore the repo → Interview (this can take a
while) → Implement.** The interview is where you establish that shared design concept. In practice he
built a skill called **/grill-me** that relentlessly interviews you until you reach shared
understanding and are ready to implement. It's still planning — just not eager to create a document;
it sits with you and forces you to think through what you're building, ensuring you're aligned and
that you've considered the unknown unknowns. /grill-me fills the context window with valuable
conversation about your intent; you can turn it into a spec or go straight to implementation. Almost
every one of Matt's coding sessions starts with /grill-me. (The next exercise covers using it.)

## Full video transcript

00:00 Okay, now that we've understood how our agent behaves under normal conditions, let's start imposing some practices on it. And I want to talk about one specific mode that you can enter that I used to recommend, but I no longer recommend. Most agents now ship with something called plan mode, which we can access by shift-tabbing to plan mode here. This is in Claude Co, this is in Codex, this is you can build your own version in Pi. This is everywhere in agents.

00:27 And the point of plan mode is that you create a plan before you go into implementation. We even saw this in the previous video where it automatically went into plan mode because it was detecting that I'd made a plan. Now if we think about what the default mode is, what I'm going to call implement mode, you have essentially four buckets of things that the agent can do. It can write files, it can read files, it can run bash scripts and it can call MCP servers. If you don't know what MCP servers are, don't worry, we'll touch on those later.

00:55 But plan mode essentially drops the ability to write files and discourages the agent from doing any kind of active changes to the code base. So you end up with just the ability to read files, run some bash scripts, and listen to MCP servers but not really make any changes. Now the concept of planning is a very, very good one. First of all, talking out the thing that you're building with an agent will really, really help in understanding what you're building and also help align you with the agent. Not only that, but having a deliberate step to plan before you go into implementation will help with exploration, because it's a specific moment that the agent needs to go and explore the repo, gather all the needed context so that it can then implement properly.

01:40 So once you and the agent have figured out what you want to build and once it's gone and explored the repo, it then builds an implementation plan. This plan is saved as a markdown document usually inside the repo and it can then use that plan to go and implement. It will often even ask you do you want to clear the context before going ahead and implementing the plan. So much does it trust the plan that it's created. So we can think of their inside plan mode as ideally being three phases.

02:07 You initially prompt the LLM with what you might want to build. The agent goes and explores the repo. It then interviews you about what you want to build and then creates this plan. However, in my experience, this interview phase is often extremely truncated. In many of my plan mode sessions, the agent will explore, kind of maybe ask one question, let's say, or a couple of questions, and then go straight into creating a plan.

02:32 You then need to review this entire wall of text in order to figure out if you and the agent are aligned. And this can be extremely frustrating and it's very easy to just skip over things in the plan and not realize that you and the agent are totally misaligned and aiming in different directions. And so you will inevitably hit this very common failure mode where the agent didn't do what you wanted. Maybe the implementation it created was totally different from how you imagined. Maybe the feature doesn't behave how you imagined, maybe it got some tiny details wrong but those tiny details have a massive knock-on effect over the whole thing.

03:08 In Frederick P. Brooks' The Design of Design he talks about this misalignment and he describes it as lacking a shared design concept. A design concept is not an asset, it's not a plan, it's the ephemeral thing being shared between all participants of the design. And when you're working with AI, you and the AI are collaborators and there's a communication gap there. And so you need to establish a shared design concept before you go to implementation.

03:35 And so the failure mode that I so often see with plan mode and why I don't recommend it anymore is because it skips the entire stage where you establish a design concept. It simply explores, creates a plan which the user is forced to review, and you don't know whether you're aligned or not. The process that I now recommend looks something like this, where you explore the repo, you interview and that interview can often take a while, and then you go ahead and implement. The focus is on this interview because it's in the interview I have found that it's the best place to get the shared design concept really solid. What this looks like in practice is I have designed a skill called grill me and grill me relentlessly interviews you until you reach a shared understanding and until you're ready to implement.

04:19 GrillMe is fantastic because it's still planning. It's just not so eager to directly create an asset. It really sits with you and forces you to think about the thing that you're building, to not only make sure that you're aligned with the agent, but also that you've thought about all the unknown unknowns that you can during the planning process. And the thing that GrillMe does is it fills up the context window with that conversation. Really valuable intent from the user that you can either turn into a spec, let's say, as we'll touch on later, or you can directly go to implement.

04:52 Pretty much every single one of my coding sessions and also a lot of my non-coding sessions start with a grill me. And then the next exercise, we're going to look at how to use it. Nice work and I will see you in the next one.
