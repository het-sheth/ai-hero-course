# RAW — Non Determinism (Day 1 Fundamentals, 03.05)

> Immutable source material for [[day-1-fundamentals/non-determinism]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 1:43.

## Lesson page content

A quick detour about what to expect from the outputs of your agents during this course.

When Matt ran this course the first time, the exercise we've just done (Build A Feature) was the
most talked-about. So many people said, "why didn't my agents do the thing that yours did?" —
"Surely, given the same inputs, the same codebase, I repeated your steps exactly, surely it would
act exactly the same."

Understanding Non-Determinism: The idea to hammer in is that **agents are non-deterministic**.
Agents are essentially next-token machines — or rather, LLMs are next-token-chooser machines. They
choose their next token based on a set of probabilities. It's not the same every single time. This
means you can ask the same question to the LLM twice and it will give you two different answers.

The Probability Distribution of Responses: The responses you get from your agent at any point in
time fall somewhere on a probability distribution curve. Some answers are really good. Most group
towards the middle — the most sensible route. But sometimes you get weird responses, weird little
outliers. When Matt first taught this course (to around 2,500 students), a couple had really strange
experiences on some exercises, where the agent did something completely different to what he was
showing. This is a normal part of working with agents — the non-determinism is baked in.

Making Agents More Consistent: So what you have to do is **ride the wave**. You can definitely make
agents more consistent — especially when we get to the AFK phase, when we start talking about
feedback loops — but you will always get a little bit of this behavior where it just sometimes does
something odd. Hopefully that sets your expectations for the rest of the course and for working with
agents in general.

## Full video transcript

00:00 I want to take a quick detour and talk about what you might expect from the outputs of your agents you're using during this course. Now when I ran this course the first time, the exercise we've just done is actually the most talked about exercise. So many folks were saying, why didn't my agents do the thing that yours did? Surely given the same inputs, the same code base, I repeated your steps exactly, surely it would act exactly the same. And I want to hammer this idea into your head, that agents are non-deterministic.

00:31 Agents are essentially next token machines, or rather LLMs are next token chooser machines. And what they do is they choose their next token based on a set of a little bit of probabilities. It's not the same every single time. This means that you can ask the same question to the LLM twice, and it will give you two different answers. In other words, the responses that you're going to get from your agent at any point in time are gonna be somewhere on a curve, on a probability distribution.

00:56 Some of the answers you're gonna get are really good, and some of them mostly will group towards the middle, the most sort of sensible route, but sometimes you will get weird responses, weird little outliers. When I first taught this course I taught it to around 2, 500 students and a couple of them had really strange experiences on some exercises where it was doing something completely different to what I was showing. What I'm here to say is this is a normal part of working with agents. The non-determinism is baked in, so what you have to do is ride the wave. You can definitely make agents more consistent, especially when we get to the AFK phase, when we start talking about feedback loops, but you will always get a little bit of this behavior where it just sometimes does something odd.

01:36 So hopefully that sets your expectations for the rest of the course and for working with agents in general. Nice work and I will see you in the next one.
