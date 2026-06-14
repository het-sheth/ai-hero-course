# Compaction — Day 1 Fundamentals

Source: AI Hero, *AI Coding for Real Engineers* (Cohort 004), Day 1 Fundamentals.
Lesson: "Compaction" (page text + 7:56 video transcript).

## On this page / key idea

Compaction is Claude Code's mechanism for turning a large conversation into a smaller summary so the
session can keep going after the context window fills up.

It is useful to understand, but it is not the workflow we are optimizing for in this course.

## What happens at the context limit

A Claude Code session starts with plenty of room in the context window. As you work, the
conversation fills up with prompts, tool calls, code, summaries, and implementation details.

Eventually, the session can move out of the smart zone and toward the context limit. Claude Code
reserves part of the context window as an **auto-compact buffer**. When the session crosses into
that reserved region, Claude Code can automatically compact the conversation.

Compaction takes the existing conversation and asks an LLM to summarize the useful parts into a
smaller form.

## What compacting preserves

When you compact, Claude Code tries to preserve the important context from the session:

- what was implemented
- which files were touched
- what the user asked for
- pending tasks
- useful references to files or plans
- any extra instructions you provide before compacting

For example, if you just implemented a feature and want to do QA, you can tell the compaction step
that your next goal is QA. That gives the summarizer a better chance of preserving the context you
need next.

After compaction, the session may drop from a large context usage percentage down to a much smaller
one. The conversation can continue, but now it is continuing from a summary of the previous session
rather than the full original context.

## Why clearing is usually better

Compaction sounds convenient, but it has tradeoffs.

Every compacted conversation leaves a little **sediment** in the context. If you keep compacting
repeatedly, those summaries layer on top of each other. The agent is now starting from a context
that contains compressed leftovers from previous work, which can make the output less predictable.

In this course, the goal is to build a workflow where the agent can repeatedly start from clean
context and still do good work. Clean starts are easier to reason about, easier to reproduce, and
less likely to carry unrelated assumptions from older work.

Clearing the context usually gives you:

- more time in the smart zone
- fewer tokens spent on summarization
- more predictable agent behavior
- cleaner separation between tasks

## When compacting is useful

Compaction is still useful in some cases.

It can help when you have just completed a large implementation and want to add focused feedback
without forcing the agent to explore everything again. It can also help during long debugging
sessions where you want to preserve what you already tried.

The common pattern is that compaction is most useful when you are still actively working with the
LLM in the conversation.

But the direction of this course is different. We are building toward workflows where the agent can
work more autonomously, with clear setup, clean context, and less need for you to sit there managing
the conversation.

## The key idea

Compaction lets Claude Code keep a conversation going by summarizing the previous context into a
smaller form.

Use it when you need to preserve hard-won context for a difficult follow-up, but do not build your
whole workflow around repeated compaction. For most course workflows, prefer clean context and clear
handoffs.

## Video transcript (7:56)

00:00 Throughout this course so far, I've been leaving something unexplained and it's time to open
the lid and see what's actually in the box. I wanna talk about what happens when your context window
goes all the way into the dumb zone and actually goes all the way up to the context limit. In other
words, you start your session in the smart zone, you do a good job in the smart zone, but let's just
say you carry on, carry on, carry on through the dumb zone. What actually happens when you reach the
end of the context window? In other words you have spent 200,000 tokens in a single session.

00:30 What is going to happen then? Well we can examine this by running Claude and inside our project
of course. And we can do a context command here. Now this context command shows the context usage
that we have here, currently sitting at 7%, very nice. But right at the end of the context, we can
see an auto-compact buffer here.

00:48 So this is 33k tokens, so 16.5% of the context is reserved as an auto-compact buffer. Now this
is not being used by the context window, so it's not affecting the LLM. There's no tokens actually
being put here. It's basically a stopgap. In other words, when we cross into the auto-compact region
here, it's going to automatically run something called compact.

01:09 What is compact, you may ask? Well, let me show you what it does. So I've gone back to a
previous session here where we had used 49% of the context window. In this session we implemented
the lesson comments table here. We added the comment service, we added a lesson page, add and delete
comment actions, and we had comment section and comment card components.

01:28 Now let's imagine for a second that I wanted to carry on this session and give it some feedback
on its implementation. 49% feels a little bit freaky deaky here, so I might be tempted to clear the
context. But clearing the context would mean I would need to explore the entire repo again, I would
lose all of this nice context of what was actually implemented. My context window kind of looks like
this at the moment where I have this nice wodge of good context. I just want to fit it into a smaller
space so that I can do some work in the smart zone.

01:57 This is what compacting in theory does. It takes a large wodge of context here with a bunch of
repeated tool calls with maybe some stuff that doesn't really need to be there. And it just gives
you a summary of what the most useful stuff is. And crucially, it uses an LLM to do this. So this
process of reducing the large context into a small context does cost you tokens.

02:20 But of course, exploring the repo again would also cost you tokens. So I'm gonna try this out
by going into the Cloud Code session and running compact here. I now get the option to pass in
custom summarization instructions. This allows me to pass some information and maybe some guidance to
the LLM that's doing the summarization. And I tend to use this to tell the LLM why I'm compacting.

02:40 In other words, what I'm about to do after I compact. So for this one, I'm gonna say, I've just
implemented a feature and I want to do some QA on it. That really is it. That's all the LLM needs in
order to do a better job I've found. So let's actually run this and see what happens.

02:54 We can see a compacting conversation thing comes up. This does usually take a fair chunk of
time, maybe a minute, maybe two minutes, depending on the size of the conversation. Okay, and we can
see it is now compacted. There's a little bug here where it still shows the original context in the
status line there. So this is deceiving.

03:11 But we can see it also gives us a little printed summary here. It keeps some of the main files
in context. So it keeps apps routes in context, keeps this lesson.lesson ID in context, it keeps
references to some files as well, so this file is not in context but it's still referenced. And it's
also got the plan file referenced as well, so it knows that the plan file is there. We can also press
Control zero to see the full summary here.

03:35 So here we go, this is the full summary of everything that was in the conversation. Along with
the files and the references above, this is all the LLM has in its context. And we can see it's
simply a markdown file here. So you see how little remains here. I mean, like there really isn't that
much.

03:51 It's just a set of bullet points and some code samples saying what was in the conversation. We
can see it preserves all the user messages here, so anything that we might have said, I suppose. And
we can also see that there's a pending task to QA the feature. The user's additional instruction
says, I've just implemented a feature and I want to do QA on it. So there's our intention being
preserved in the compacted conversation.

04:11 This is nice too, it also preserves the full transcript in a file. So if it needs to reference
anything that was said in the previous transcript it has a reference to it. We can then exit out of
here by pressing ctrl o again and I'm just going to show you what's in the context by running forward
slash context. We zoom up to the top here we can see we are now at 12% tokens. So we've compacted all
that big conversation into just 23K tokens.

04:36 So this is what compacting does. And this is what would happen if you were to hit the
auto-compact buffer. So a natural question becomes why do we bother clearing the context at all? Why
not just allow the context to grow until we hit the auto-compact buffer, then we zoom down again,
zoom up again, zoom down again, and just keep on going like this? Well, the reason is that every time
you hit the auto-compact buffer and you go back and you compact, it leaves what I like to think of as
a little sediment inside the context.

05:04 When you then go up again and you hit the auto-compact buffer again, you leave another little
piece of sediment. And these layer up and up and up and they affect the output in unpredictable
ways. Whenever you start a session with an agent that has some of this sort of sediment in its
context, it means that it's in a different state from the way you usually work with it. Whereas if
you optimize your workflow to work with an agent that always has nothing in its context, then you
find you end up with more predictable outputs each time. Not only that, but you spend fewer tokens of
course, because you're not spending tokens on compacting.

05:36 You're spending more time in the smart zone because you've got more smart zone to work with and
less time in the dumb zone. So your code quality outputs tend to be higher. I have to caveat this
with, this is my mental model and this is what I have found best results with. In other words, this
is my opinion. It also happens to be the view of lots of people in the community as well.

05:56 So this is kind of an agreed upon idea. However, there are prominent people that say, you
should just, you know, continue working and just hit the auto-compact buffer and not have to worry
about context ever. So the question then becomes when should you compact? I find myself compacting
relatively rarely. It tends to be in cases like we discussed where I have just finished a large
session and I just want to add some extra feedback on top.

06:19 I've also found this really useful when debugging or trying to solve a complex error. For
instance, you fill up your context window with things that you've tried and you don't want to lose
them by clearing the context and just going back to nothing. So you compact, you say to the LLM,
okay, we tried these things, let's now try some more. But you should notice that the times that I'm
using compact are times where I'm working with the LLM directly. Our end goal with this course is to
get to a place where you should not need to touch the LLM, it should be working relatively
autonomously.

06:48 And so relying on compact for your workflows means that you're also relying on you being there
to tell the LLM when to compact. Which of course is useful, but not quite where we're going in this
course. So that's what compacting is. It's a Claude Code mechanism for essentially making sure you
can have an infinite conversation with Claude if you want to. Compacting multiple times over a
conversation is considered an anti-pattern by me and lots of people in the community because you
build up these horrible little gunky layers of sediment in your context from maybe unrelated
conversations.

07:17 And what you should be optimizing for is a clean context, not one that has a bunch of memories
already in it. When I do compact, it's usually only once per conversation, and it's usually only in
cases where I'm working on a difficult, long running task, I want to stay in the smart zone and just
give it a bit of extra feedback. In general I organize my setup and my harness and all the things I
use with Claude Code to make sure I never have to compact. And when I do compact I usually feel bad
about it afterwards. However this is just my opinion and you may find different results.

07:49 And they may even improve compacting in the future to the point where I actually like it and
use it again. Nice work and I will see you in the next one.
