# RAW — Build A Feature (Day 1 Fundamentals, 03.04)

> Immutable source material for [[day-1-fundamentals/build-a-feature]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> This lesson has a "Problem" (exercise) and a "Solution" sub-page. The Problem is fully captured below.
> The Solution walkthrough was NOT shared — only its metadata: commit `03.04.01` "My solution - built star ratings".
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Problem length: 2:01.

## Problem — lesson page content

Introduction: You've explored the codebase and understand how it's structured. Now it's time to
build your first feature with Claude Code. We're going to build a course review system where
students can leave star ratings on courses. This feature is meaty enough to touch all areas of the
codebase, but not so complex that the UI becomes overwhelming. The reviews will show as a simple
1-5 star rating on the courses list page and the course detail page.

Before diving in, understand that this isn't about building the perfect feature on your first try.
It's about learning the workflow of prompting, observing what Claude naturally does, and iterating.
You'll also learn to monitor your context usage as you build, watching for the "dumb zone" where
token consumption starts degrading quality.

Steps To Complete:

Starting Your Claude Code Session
- Open Claude Code in VS Code (or run `/clear` if you have an existing session) — clears your
  conversation history so you start fresh.
- Write a lightweight prompt describing what you want to build. Keep it to 1-2 sentences, e.g.:
  "I would like to create a course review system where students can review courses by leaving a star
  rating. We don't want to add written reviews, just star rating. These reviews will then be visible
  everywhere that courses are visible. We want to show the average rating on the courses in the list
  page and on the course page itself."
  Don't overthink this — not a detailed specification, just enough to point Claude in the right
  direction.

Observing Claude's Default Behavior
- Send your prompt and watch what Claude does next. Pay attention to: Does it spawn an Explore
  sub-agent to understand the codebase? What files does it read first? What questions does it ask
  you? What's its overall approach? Take notes — you're in observation mode; let Claude think out
  loud before you steer.
- Check your context usage with `/context` — a bar chart showing token consumption. Look for the
  main orchestrator agent's usage. Around 40% usage is when you should start getting nervous about
  running out of space.

Reviewing Claude's Plan
- Wait for Claude to generate a plan and read it carefully — the steps it intends to take, the files
  it will touch, and how it will verify the feature works.
- Ask clarifying questions if needed. If something doesn't match your vision, push back (e.g. if
  Claude suggests adding ratings to the dashboard but you don't want that, tell it). This is your
  chance to steer before implementation starts.

Building the Feature
- Accept Claude's changes as it implements. Once you've reviewed the plan, flip to "accept all edits"
  mode (shift+tab cycles through submission modes) so Claude moves faster without asking permission
  on every file change.
- Keep watching `/context` as Claude works. If you're approaching 80K tokens (40% of the window),
  that's your signal to be more cautious — ask Claude to summarize what's left or wrap up the current
  phase.
- Wait for Claude to finish implementing all the steps: database schema changes, service functions,
  route updates, and UI components. It will also run migrations and handle any setup commands.

Testing the Full Feature
- Log into the dev UI as a student. Navigate to a course detail page — you should see a rating
  widget in the sidebar (if you're enrolled in the course).
- Submit a star rating by clicking on one of the stars. Watch for a toast notification confirming the
  rating was saved. The average rating display should update immediately.
- Change your rating by clicking a different star. Verify the rating updates (upsert behavior)
  without errors.
- Visit the courses list page (`/courses`). You should see the average rating displayed on course
  cards next to the instructor name, formatted as a filled star icon followed by the rating and
  count.
- Test as different user types. Log in as a non-enrolled user and verify you see the rating display
  but no widget to submit. Log in as an instructor and verify you don't see a rating widget on your
  own course.

Debugging if Things Break
- If something doesn't work, describe the issue to Claude in plain language — tell it what you
  expected and what actually happened, rather than trying to fix it yourself. Stay in conversation
  with the AI; it's part of the natural build cycle.
- Run `/context` again to check how much space you have left. If you're running low, you might need
  to wrap up or start a fresh session for the next phase of work.

## Problem — full video transcript

00:00 All right, we've explored the code base. You understand the vague structure of what's going on. Now it's time to build our first feature. We're going to build a course review system where students can leave reviews on courses. I've chosen this feature because it's fairly meaty.

00:14 You need to touch all areas of the code base but it's not that intense in terms of user interface. To give you an idea here we need to go into the dev UI, log in as a student, we are now Emma Wilson, and then go to let's say Node.js for instance. The idea would be that we want to be able to leave a review on this page as the user. We don't want to leave a written review or anything like that, we really just need a star rating. So the first thing you'll need to do is get Claude running inside VS Code again.

00:41 Or if you've got an existing Claude code set up then run clear to clear the conversation history. From there we're going to put together our initial prompt which is just going to be a couple of sentences about what we want to build. I've gone for this simple prompt, I would like to create a course review system where students can review courses by leaving a star rating. We don't want to add written reviews, just star rating. These reviews will then be visible everywhere that courses are visible.

01:02 We want to show the average rating on the courses in the list page and on the course page itself. Your prompt may look different from mine, you may want to go further, add more detail, or even pull it back and keep it simpler. Now we're gonna pause here, but once you have sent that, then I want you to start steering Claude. I want you to be watching it closely, see if it spawns an explore sub-agent for instance, and try to understand everything it's doing as it's going through. It might start wanting to change files or ask you permissions which you should be prepared for.

01:29 You should also make sure you're running forward slash context to check on your context usage as you're going through. If you've built features with LLMs before then this will feel familiar but the thing I want you to get out of this is the level of context paranoia that I have when I'm using LLMs. Remember around 40% usage of the main orchestrator agent is when we should start getting a bit nervous. So let yourself be guided by what Claude does, put yourself in a more observational mode, give it a little bit of steering, but mostly we just want to observe the default behavior of Claude code. Good luck and I will see you in the solution.

## Solution — not captured

The Solution sub-page walkthrough/transcript was not shared. Only its metadata is known:
- Commit `03.04.01` — "My solution - built star ratings".
