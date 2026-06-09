# RAW — Where We're Going (Before We Start, 01.01)

> Immutable source material for [[before-we-start]] / the Seven-Phase Process page.
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 3:54.

## Lesson page content

### The State of Coding Agents
Since around December last year, coding agents have taken a massive leap forward in terms of
capabilities. The stuff you can do with them has just gone through the roof in terms of power level
and the speed at which you can build.

This has resulted in lots of folks getting very excited and building huge, complex frameworks around
AI coding agents — like GSD, Spec Kit, or BMAD, and similar.

However, Matt's belief: **you as a developer should own your process.**

### Own Your Process
The course teaches a process that you can iterate on, build on, and make your own.

At the core of this approach is reliance on real engineering skills — heuristics and knowledge built
up from 30 years of development experience throughout the industry. Periodically throughout the
course, Matt waves actual books and quotes from various sources, taking real development advice from
people who've been doing it for a long time.

### The Seven Phase Process
The course ends up with a seven-phase process:

1. **Grill** — Understanding the requirements
2. **Research** — Exploring solutions and approaches
3. **Prototype** — Testing ideas quickly
4. **PRD** — Building specifications and plans
5. **Issues** — Structuring work for the agent
6. **Implement** — The agent ships the code
7. **Review** — Evaluating what's been done

One of the main key pillars: the **implementation step runs completely AFK (away from keyboard)**,
allowing you to parallelize your work with the agent. You don't have to sit and watch the agent —
you can be planning the next phase while it's shipping.

But getting it working and producing good code regularly is difficult and requires real engineering
skills.

### Interactive Exercises and a Real Playground
This is not just lectures — these are interactive exercises. There's an entire **20,000 line of
code playground** to do the work in, building real features inside the application.

You don't have to use this repo, though. You can take the exercises (building a feature, making a
PRD) and use them on your own repo.

| Option | Pros | Cons |
|--------|------|------|
| Cohort project | Follow along exactly, full support available | Limited to the tech stack provided |
| Your own repo | Apply learning directly to your code | Less support available |

Recommendation: Beginners / folks just starting out should use the cohort project. If you're
confident or just want to apply it to your own work (and don't mind less support), use your own repo.

The cohort project is written in **TypeScript, Node, and React**, but you don't need to know much
about those to be productive — Matt walks through how to set up the playground.

### What You'll Achieve
By the end of the course you'll be able to take any coding agent and wrap it in a process so you can
ship code on your own codebases. Specifically:
- Move faster than before by parallelizing yourself with the AI — planning while the agent ships.
- Know when to intervene as the human, to prototype, research, and impose your taste on the project.
- Keep your codebase healthier — agents thrive in good codebases.
- Build PRDs, turn those PRDs into issues, and plan huge tranches of work for your agent to pick up.

## Full video transcript

00:00 Welcome, welcome, welcome to the AI Coding for Real Engineers cohort. I'm super excited to be running version two of this cohort, we've learned a lot since version one, and I just can't wait to show you the material. Since around December last year, coding agents have taken a massive leap forward in terms of capabilities and the stuff that you can do with them is just gone through the roof in terms of power level, in terms of the stuff you can build and the speed at which you can build it at. This has resulted in lots of folks getting very, very excited and building these huge, great, complex frameworks around AI coding agents to help you build stuff faster. You guys may have used some of them like you know GSD or spec kit or be mad or lots of things like this.

00:41 However I personally believe and have really always believed that you as a developer should own your process and what we're going to be doing in this course is teaching you a process that you can then iterate on and build on and make your own. And at the core of this approach are reliance on real engineering skills, on heuristics and knowledge built up from 30 years of development experience throughout the industry. Periodically throughout the course, I'm gonna be waving actual books at you and we're gonna be quoting from various sources, taking real development advice from people who've been doing it for a long time. And we're gonna end up with a seven phase process that looks something like this, that takes in grilling or interviewing, research, prototyping, creating documents that get us where we need to go, turning those documents into issues, implementing those issues, and then reviewing what we've done. One of the main key pillars here is making sure that our implementation step runs completely AFK, in other words, away from keyboard, allowing you to parallelize your work with the agent.

01:39 One of the things I see people say all the time is it's so annoying that I just have to sit there and watch the agent do its work. Well with AFK you don't have to and that's one of the core tenets of this whole system. But getting it working and getting it producing good code regularly is difficult and requires real engineering skills. In order to make these exercises stick this is not just going to be lectures, these are interactive exercises. So we have an entire 20,000 line of code playground for you to do your work in.

02:07 We're going to be getting stuck in, we're going to be building real features inside this application. However I wanted to leave this door open to you which is you don't have to use this repo. You can take the exercises that I'm giving you like building a feature or making a product requirements document and you can use it on your own repo if you like. If you choose the cohorts project then of course you'll be able to follow along exactly, you'll be able to get support whereas if you choose your own repo then you'll be able to actually apply what we're learning directly into your own code. However, because it's your code I won't be able to offer as good support as if you're using the actual project.

02:42 So I would say beginners or folks who are just starting out with this stuff then use the cohort project, but if you're really confident or if you're just desperate to get your own work and you don't mind a little less support, then use your own repo. The cohort project itself is written in TypeScript and Node and React, but you don't really need to know that much about those technologies in order to be productive with the course. I'm going to walk you through exactly how to set up everything for the playground so you don't have to worry about that either. By the end of this course you will be able to take any coding agent and wrap it in a process so that you can start using it to ship code on your own code bases. You'll be able to move faster than you've ever done before because you'll be able to parallelize yourself with the AI.

03:24 You'll be planning while the AI is shipping. You'll know when to intervene as the human in order to prototype and research and get a sense for imposing your taste on the project. Your code base will be healthier than it's ever been before because we know that agents thrive in good code bases. And you'll be able to build PRDs, you'll be able to turn those PRDs into issues, and you'll be able to plan huge tranches of work for your agent to pick up. Now, if that sounds good, then you are in the right place.

03:52 Nice work, and I will see you in the next one.
