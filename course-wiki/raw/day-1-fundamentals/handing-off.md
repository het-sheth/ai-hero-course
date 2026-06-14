# Handing Off — Day 1 Fundamentals

Source: AI Hero, *AI Coding for Real Engineers* (Cohort 004), Day 1 Fundamentals.
Lesson: "Handing Off" (page text + 3:30 video transcript). Final lesson of Day 1.

## Commit referenced
- `03.10.01` — Add handoff skill (`pnpm reset 03.10.01` / `pnpm cherry-pick 03.10.01`)

## The handoff skill — actual file (cohort repo, commit `751df2f` = `03.10.01`)

Retrieved verbatim from `.claude/skills/handoff/SKILL.md` in the upstream cohort repo
(`ai-hero-dev/cohort-004-project`, branch `live-run-through`):

```markdown title=".claude/skills/handoff/SKILL.md"
---
name: handoff
description: Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
---

Write a handoff document summarising the current conversation so a fresh agent can continue the work. Save it to a path produced by `mktemp -t handoff-XXXXXX.md` (read the file before you write to it).

Suggest the skills to be used, if any, by the next session.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.
```

## Page text

In a previous lesson we talked about compacting and specifically the dangers of auto-compacting where
you pull in a bunch of context just to shrink it down again to create another little layer of
sediment that keeps growing and growing and growing.

The way to avoid this, of course, is just to clear the context every time so you start with a fresh
session.

But what happens in situations where you're halfway through a session, let's say, and you think of an
idea that you want to do? Let's say you discover a file which needs a little bit of updating or a test
that needs fixing.

You could do this in your current session, of course, but you don't quite know how long it'll take.
And it might take so long that you don't have any budget left to do the thing that you wanted to do in
the first place.

It doesn't really make sense to clear the context in this situation because you still need to complete
the blue task here, it's just this little yellow task also needs to be done at some point.

And in fact, this little yellow task really just needs its own context window to complete. It doesn't
even need all of the context with the blue, it's just we happen to discover it during this little blue
session here.

So what would be great is if we could just take this blue session here and compact it into another
context window. Because then the blue could feel free to grow in its own context window, and this
little yellow task over here, the bug fix or the test fix, could just complete in its own context
window.

### Introducing Handoff

I've been messing about with this idea for a while and initially I thought this needs to be called
`/compact-to-file`. But then it came up with a slightly snappier name: Handoff.

`/handoff` allows you to create a temporary markdown file that you can use for handing off between
agents. And it's really, really handy in a few different situations.

### How the Skill Works

The skill says:

> Write a handoff document summarising the current conversation so a fresh agent can continue the
> work. Save it to a path produced by `mktemp -t handoff-XXXXXX.md` (read the file before you write
> to it).

The skill does a few key things:

- **Saves to a temporary location** — a path produced by `mktemp -t handoff-XXXXXX.md`, i.e. a file
  in your temporary directory.
- **Suggests skills to use** — crucially, it suggests the skills to be used, if any, by the next
  session. So if you're doing a `/grill-me`, then it will suggest to continue doing a `/grill-me`.
- **Doesn't duplicate content** — it does not duplicate content already captured in other artifacts
  (PRDs, plans, ADRs, issues, commits, diffs). Instead, it references them by path or URL.
- **Tailors to the next session** — if the user passed arguments, it treats them as a description of
  what the next session will focus on and tailors the doc accordingly.

This last point is really important because the handoff document will be tailored to what the next
session will be used for.

### Fixing Bugs in Separate Sessions

For instance, if we found a broken test during our implementation of something else, during the
implementation session, we could say, "hand off, let's do a separate session to fix that test." That
would then generate a file which we could just then pass into a new agent session.

### Using Handoff for Planning Workflows

This can also be super useful in planning. Let's say you're doing a `/grill-me` session that gets a
little bit long, and you think, "oh, there's like a really specific part of this that I need to
grill." So you could hand off to a new session that just grills about that specific thing, maybe even
builds a prototype, burns a ton of context, even does some research. And then once you've done that
big session, you can then hand off back to the original session just by condensing everything you
learned into a little hand-off doc.

Overall, `/handoff` just allows these obscenely powerful flows where you're expanding and then
contracting, making these documents that you pass back and forth.

### When to Use Handoff

I wanted to give it to you as an example of what you should do if a grilling session goes out into
the dumb zone. And we'll be revisiting handoff patterns as we work throughout the course.

Take a moment now to just review the skill. And if you feel yourself throughout the course running out
of context window, then consider it as a nice option to just hand off to a new context window to fix a
bug or just to continue working on the same thing.

## Video transcript (3:30)

00:00 In the previous lesson, we talked about compacting and specifically the dangers of
auto-compacting where you pull in a bunch of context just to shrink it down again to create another
little layer of sediment that keeps growing and growing and growing. Now the way to avoid this, of
course, is just to clear the context every time so you start with a fresh session. But what happens in
situations where you're halfway through a session, let's say, and you think of an idea that you want
to do? Let's say you discover a file which needs a little bit of updating, or a test that needs
fixing. You could do this in your current session of course, but you don't quite know how long it'll
take and it might take so long that you don't have any budget left to do the thing that you wanted to
do in the first place.

00:39 It doesn't really make sense to clear the context in this situation because you still need to
complete the blue task here. It's just this little yellow task also needs to be done at some point.
And in fact this little yellow task really just needs its own context window to complete. It doesn't
even need all of the context with the blue. It's just we happen to discover it during this little blue
session here.

00:59 So what would be great is if we could just take this blue session here and compact it into
another context window. Because then the blue could feel free to grow in its own context window and
this little yellow task over here, the bug fix or the test fix, could just complete in its own context
window. So I've been messing about with this idea for a while and initially I thought this needs to be
called compact to file but then I came up with a slightly snappier name, handoff. Handoff allows you
to create a temporary markdown file that you can use for handing off between agents and it's really
really handy in a few different situations which we're going to talk about. First, let's take a little
look at the skill itself.

01:35 What the skill says is write a handoff document summarizing the current conversation so a fresh
agent can continue the work. We're saving it to a path produced by make temp T handoff X, X, X, X, X.
In other words, it's creating a file in your temporary directory. Crucially, it then says suggest the
skills to be used, if any, by the next session. So if you're doing a grill me, then it will suggest to
continue doing a grill me.

01:56 Don't duplicate content already captured in other artifacts. This means that it will just add
links to other artifacts if there's important stuff inside them. And then if the user passed any
instructions, treat them as a description of what the next session will focus on and tailor the doc
accordingly. This is really important because the handoff document will be tailored to what the next
session will be used for. For instance, if we found a broken test during our implementation of
something else, during the implementation session, we could say, hand off, let's do a separate session
to fix that test.

02:25 That would then generate a file like this, which we could just then pass into a new Claude
session. This can also be super useful in planning. Let's say you're doing a grill me session that
gets a little bit long here, and you think, oh, there's like a really specific part of this that I need
to grill. So you could hand off to a new session that just grills about that specific thing, maybe
even builds a prototype, burns a ton of context, even does some research. And then once you've done
that big session, you can then hand off back to the original session just by condensing everything you
learned into a little handoff doc.

02:56 Overall, handoff just allows these obscenely powerful flows where you're expanding and then
contracting, making these documents that you pass back and forth. And I wanted to give it to you as an
example of what you should do if a grilling session goes out into the dumb zone. And we'll be
revisiting handoff patterns as we work throughout the course. Take a moment now to just review the
skill, and if you feel yourself throughout the course running out of context window then consider it
as a nice option to just hand off to a new context window to fix a bug or just to continue working on
the same thing. Nice work and I'll see you in the next one.
