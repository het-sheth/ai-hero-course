# RAW — Codebase Exploration (Day 1 Fundamentals, 03.03)

> Immutable source material for [[day-1-fundamentals/codebase-exploration]].
> Pasted by Het from the aihero.dev lesson pages (notes + full transcripts). Read, never rewrite.
> This lesson has two sub-pages: a "Problem" (exercise) and a "Solution" (walkthrough). Both captured below.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Problem length: 1:31 · Solution length: 2:46.

## Problem — lesson page content

Introduction: LLMs are stateless. Every time you interact with an agent, it's like hiring a brand
new developer who's never seen your codebase before. This means exploration isn't a one-time setup
task — it's the foundation of every single agent interaction. You can use agents to explore
unfamiliar codebases faster than you could manually: ask the right questions, spot patterns, and
understand architecture through the agent's eyes. This skill unlocks everything else in the course.

Steps To Complete:

Exploring the Repository
- Open VS Code and run Claude Code in the terminal. Use the same prompt structure shown in the
  transcript: `Tell me what the tech stack of this repo is and what its intended purpose is.`
- Watch for sub-agent activity in the Claude Code interface. Notice when Claude is exploring files
  or running commands — the agent "thinking out loud" as it discovers the codebase structure.

Digging Deeper — ask follow-up questions based on Claude's initial response. Angles to explore:
- `How does PPP (Purchasing Power Parity) work in this repo?`
- `What user roles and permission levels exist in this application?`
- `Where is the authentication and authorization logic?`
- `How does the React Router setup work specifically?`
- `What does the database schema look like?`
- Keep track of what questions Claude asks itself — it might check multiple files or run commands
  like `tree` to understand structure. Notice when it does this.

Finding Hidden Details
- Ask Claude which React Router mode this app uses. The codebase uses React Router, which has three
  different modes — can Claude figure out which one, and what clues did it look for?
  `Which React Router mode is this app using, and how can you tell from the codebase?`
- Ask Claude about user roles and capabilities (requires understanding both code structure and
  business logic): `What user roles and capabilities does this application support?`

Validating Your Understanding — review what you've learned and write down:
- The main purpose of this application
- Key technologies in the tech stack
- How users and permissions are structured
- Which React Router mode is being used and why that matters

## Problem — full video transcript

00:00 Of all of the constraints that we explored in the previous exercise, the most onerous, the strangest, and the one you have to think about first is the fact that the LLM is stateless. This statelessness means that the LLM is dropped into your code base every single time with no memory of exploring it before. This means that every time, the LLM needs to get up to speed with the code base and explore it to understand its patterns, understand the way it's laid out and understand even what the code base does. And this means that exploration is a foundational skill that you need to understand in order to get good with coding agents. And fortunately, we have a big old repo here for you to explore.

00:36 You should hopefully have had a chance to click around the app a little bit and understand kind of what it's doing, at least at a basic level. But in this exercise, we're going to use Claude to explore the repo for us. I'm gonna start by going into VS Code, as we've done before, and running Claude. And I'm gonna prompt it by saying, tell me what the tech stack of this repo is and what its intended purpose is. Now at this point, I'm gonna pause and we are going to see what happens on my machine in the solution.

01:00 But I would like you to run the exact same thing inside the project and look out for some different things. First, I'd like you to note when you think a sub-agent is being used. You might be able to tell this from the user interface, so see if you can figure it out. Second, when the LLM responds with a response, query it and ask it some more questions and then see what happens. By the end of this exercise I do want you to have a really good understanding of the repo so I've given you a bunch of questions that you can ask down below.

01:24 Once that's done head to the solution and I will break down exactly what's happening. So good luck and I will see you and the solution.

## Solution — lesson page content

Initial repo search walkthrough: Kicking it off — first you can see it's searching for two patterns and reading six files; press Ctrl-O to expand into a verbose mode where you see all the commands it's done (bash commands, file reads). It gives a brief summary of the repo including the tech stack. (Then untoggle the UI back to default.)

No sub-agents spawned limitation: It did NOT spawn any sub-agents. With this model, this version of the repo, and this particular prompt, it did not spawn any explore sub-agents. This meant it didn't read that many files — only six files throughout. That's not going to give a full breakdown of what's happening in the repo.

Using explore to trigger deep analysis: So prompt it a little deeper. Especially curious about the Power Purchasing Parity (PPP) implementation. Use a special word — the word "explore": `explore how PPP works in this repo`. Kicking this off shows something interesting.

Explore sub-agent in action: Now it's spawned an explore sub-agent — you see "explore" with a title inside the brackets. The Explore is running a bunch of tool calls and very aggressively searching for files. Pressing Ctrl-O to expand shows it reading a lot more files and searching for many more things. Then untoggle to let it run.

How the orchestrator spawned the sub-agent: Under the hood, the orchestrator agent (the one you're talking to) spawned an explore sub-agent with a customised system prompt to explore the repo. Inside the sub-agent's context window it took 60 seconds to complete its task, used 64,000 tokens (about 32% of its context window, which is pretty gnarly — a lot of tokens burned), and called 25 tools (tools can be bash commands or file reads/writes). Then it came back with a summary to the parent orchestrator agent, and the orchestrator spat that out.

Results and using explore keyword effectively: This looks like a really in-depth exploration of how PPP works — almost as good as if we'd written it ourselves. Notice how powerful the sub-agent is and how important word choice was: the "explore" verb connected Claude Code and triggered something in its latent space to use the explore sub-agent — whereas the earlier prompt just said "tell me what the tech stack of this repo is." So a good hint when you want a really in-depth exploration is to actually use the word "explore." Take the opportunity to run more exploration commands on the repo to deepen your understanding, because soon we'll be building features.

## Solution — full video transcript

00:00 All right, let's kick this off and let's see what happens. We can see first of all that it's searching for two patterns and reading six files, and you can press Control O to expand here. If I press Control O to expand, I enter a kind of verbose mode where I can see all of the commands that it's done, where it's calling the bash command, where it's reading certain files, and it gives me a brief summary of the repo including the tech stack here. I'm going to untoggle this UI here so we end up with the kind of default. And what I can see here is that it did not spawn any sub-agents.

00:30 So in my case with this model, with this version of the repo, with this particular prompt, it did not spawn any explore sub-agents. And what this meant is we didn't actually read that many files. We only read six files throughout this. That's not going to give me a full breakdown of what's happening in this repo. So let's go to the bottom here and prompt it a little bit deeper.

00:48 I'm especially curious about the Power Purchasing Parity implementation. And when I do this I'm going to use a special word. I'm going to use the word explore. I'm going to say explore how PPP works in this repo. And if I kick this off we're going to see something really interesting.

01:02 Now what we can see here is that now it's spawned an explore sub-agent. You see here, explore with a kind of title inside the brackets here. And this explore is running a bunch of different tool calls and it's very aggressively searching for files. If I press Control O to expand here, we can see, wow, it's reading a lot more files here, searching for a lot more different things. And I'll untoggle this to just let it run.

01:27 So what happened here under the hood was that our orchestrator agent, the one that we're talking to, spawned an explore sub-agent with a customized system prompt to explore the repo for us. We can see that inside the sub-agent's context window it took 60 seconds to complete its task. It used 64,000 tokens, which is about 32% of its context window, which is pretty gnarly. You know, that's a lot of tokens burned. And it called 25 tools here.

01:54 So tools can be things like bash commands or file reads and writes. And then it came back with a summary to our parent orchestrator agent. And the orchestrator agent spat out this for us. This looks like a really in-depth exploration for how PPP works. Honestly almost as good as if we just written it ourself.

02:10 And so we notice how powerful that sub-agent is there and how important our word choice was. Here we use the explore verb which kind of connected Claude code and sort of triggered something in its latent space to say okay I need to use the explore sub-agent. Whereas first in our previous prompt we just said tell me what the text stack of this repo is. So that's a good hint when you want a really in-depth exploration is to actually use the word explore. So now you should take the opportunity to run any more exploration commands that you want on the repo to really deepen your understanding because soon we're going to be getting to building features.

02:43 That's work, and I will see you in the next one.
