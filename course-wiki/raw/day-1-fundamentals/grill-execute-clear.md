# The Grill Execute Clear Loop — Day 1 Fundamentals (Problem + Solution)

Source: AI Hero, *AI Coding for Real Engineers* (Cohort 004), Day 1 Fundamentals.
Lesson: "The Grill Execute Clear Loop" (Problem / Solution).

## Commits referenced
- `03.08.01` — /grill-me skill added
- `03.08.02` — See my solution — lesson comments with soft-delete and moderation built

## Solution — overview

You're ready to try out the `/grill-me` skill. Instead of jumping straight into implementation,
you're going to use an agent to design a feature first.

The feature you're building is a **lesson comments system**. Students should be able to comment on
lessons, but there are lots of design questions to answer first:

- Should instructors be able to comment?
- Can they moderate?
- Can they delete comments?
- Are comments visible to everyone, or only to enrolled students?
- Can students see other people's comments?
- Are comments visible to anyone looking at the course?

These decisions matter, and they're interconnected. The `/grill-me` skill is designed to help you
think through them systematically.

## Steps To Complete

### Start a New Agent Session
- Create a new agent code session.
- Use the default mode (not plan mode, not auto mode).

### Load the /grill-me Skill
- Find the grill-me skill in your repository. It should be at `.claude/skills/grill-me/SKILL.md`.
- Invoke the `/grill-me` skill in your agent session. This skill will interview you relentlessly
  about every aspect of your design until you reach a shared understanding. It will walk down each
  branch of the design tree, resolving dependencies one by one. For each question, it provides a
  recommended answer. If a question can be answered by exploring the codebase, it will explore the
  codebase instead of asking you.

### Design the Feature With the Agent
- Let the agent ask you clarifying questions about the comments feature. Answer honestly. There are
  no wrong answers here.
- Write down any observations you have. Notice how the agent approaches design. Does it ask the
  right questions? Does it resolve dependencies in a logical order?
- Note any improvements you'd make to the skill. The skill is simple, but it's not perfect. How
  would you improve it?
- Continue until you reach a shared understanding with the agent. At this point, you should both
  agree on what the feature looks like. The agent might say something like "okay, we're ready to
  implement, let's go."
- Go ahead and implement the feature. Implement the feature, and see if what is produced matches
  your shared understanding.

## Video Transcript

00:00 So at this point you are probably itching to try GrillMe. So I won't stand in your way, let's
get started. We're going to use GrillMe to build a lesson comments feature, where students can
comment on the lessons. I've deliberately left this pretty vague so that you will have to spend
some time with the agent to figure out what this looks like. Are instructors able to comment?

00:20 Are they able to moderate? Are they able to delete or hide comments? Can students see other
people's comments? Are comments visible to anyone looking at the course or are they only visible to
other students? You get the idea.

00:32 But what you're going to do is kick off a new Claude code session. You're not going to use
plan mode, you're gonna toggle probably to not accept edits on yet, certainly not auto mode, I
think just the default mode will be fine. And then you'll be able to invoke the grill me skill here,
which I have added to the repo under .claude skills grill me skill.md up here. We can give it a read
just for now. This is all the skill is.

00:55 It's incredibly, incredibly simple. Interview me relentlessly about every aspect of this plan
until we reach a shared understanding. Walk down each branch of the design tree, resolving
dependencies between decisions one by one. For each question, provide your recommended answer. Ask
the questions one at a time, and if a question can be answered by exploring the code base, explore
the code base instead.

01:16 This means it's not going to ask you any erroneous questions that it could go and check
itself. We're using the explore verb so it should go out and actually do some exploration. It's
going to give us recommended answers as well which is so convenient. Oh, I just can't wait for you
to try it. I want you to treat this lesson like a sandbox you're just messing about with Grillme.

01:35 It will take a little while for you to reach a shared understanding and at some point you'll
be able to say, okay, we're ready to implement, let's freaking go. Write down any observations that
you have, write down any notes, write down any ways that you think you might improve this skill and
I will see you in the solution. Good luck.

## The grill-me skill (quoted from the lesson)

The entire skill is short. Its instruction is essentially:

> Interview me relentlessly about every aspect of this plan until we reach a shared understanding.
> Walk down each branch of the design tree, resolving dependencies between decisions one by one.
> For each question, provide your recommended answer. Ask the questions one at a time, and if a
> question can be answered by exploring the code base, explore the code base instead.
