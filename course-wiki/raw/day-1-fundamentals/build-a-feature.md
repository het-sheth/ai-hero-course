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

## Solution — lesson page content

> Solution sub-page (commit `03.04.01` — "My solution - built star ratings"). Length: 8:10.

Starting the agent: Firing off the prompt, Claude entered **plan mode** (covered deeper later) and
kicked off an **Explore sub-agent**. The explore phase was meaty; then the orchestrator read some
key files.

Answering clarification questions: Claude came back with questions not clear from the initial
prompt, navigated with tab/arrow keys:
- "Should only enrolled students be able to leave a star rating?" → Yes (only people who paid →
  more reliable reviews).
- "What star rating scale?" → 1 to 5 stars.
- "Should the dashboard page also display average ratings on course cards?" → Matt wasn't sure what
  the dashboard showed, so he chose option 4 ("chat about this"), asked Claude *what is currently
  shown on the dashboard* (a list), decided it's a private dashboard, and told Claude **not** to add
  ratings there — only where the course is being sold.

Planning phase: Claude kicked off a **plan sub-agent** (another context-saving mechanism) that dove
deep into the files and produced a meaty multi-step plan: add to the schema, a rating service
following existing conventions, update the course list page, update the course detail page, touch
files, run verification. Matt reads plans by skimming the top-level steps + checking the top-of-file
context: "Students need a way to rate courses with a 1–5 star rating. Only enrolled students can
rate. Average rating should display on the course list page and the course detail page. Dashboard is
excluded."

Reviewing and approving the plan: Four options — (1) yes + auto-accept edits, (2) yes but manually
approve edits, (3) clear the context, put only the plan into context, then auto-accept edits, or
(4) tell Claude what to change. Deciding between 1 and 2, Matt felt context-paranoid, escaped out
(Esc) to run `/context`: **36%** already — pushing into the bottom of the dumb zone. So he reopened
the review UI and chose **(3) clear the context + auto-accept**. Downside: after clearing, Claude
re-reads key files and kicks off another explore agent to catch up — but it's worth it to stay out
of the dumb zone.

Implementation and database migration: Claude created a task list and implemented against the plan
— added the course ratings table to the schema, created the rating service, etc. At 4/5 tasks it
hit the **database migration**, the first permission prompt. Matt always wants personal control over
migrations, so he approved **once** (not "always"), same for `db:migrate`. He hit a local
`sqlite3`-not-found error and walked through a fix with the LLM (skipped in the video), then approved
the `db:seed`. After completion, `/context` showed **32%** — comfortably in the smart zone, so
clearing earlier paid off.

Testing the course rating feature: Via `pnpm dev`, logged in as **Emma Wilson** (enrolled), rated a
course under "Your Progress" → it saved and showed on the course. Changing to 3 stars updated the
global course immediately. Switching to **Olivia Martinez** (also enrolled) and giving 5 stars
changed the average to **4.5**. Good first pass.

Committing and wrapping up: Back in Claude, typing `commit` had Claude Code stage the files and
write a commit message (approved). Then: open a Notes app and write down anything you noticed about
the session + unresolved questions (e.g. what is plan mode? how to debug with the agent? how much to
review the code?) — revisited throughout the course.

## Solution — full video transcript

00:00 All right, let's fire this off and see what happens. We can see it's entered something called plan mode here, which is fairly self-explanatory, but we're gonna dive much deeper into that later in this section. And we can see it's kicked off an explore sub-agent here, beautiful. Let's check in again once the explore agent has finished. Okay, it's now finished with the explore phase, it had quite a meaty explore which is nice.

00:20 It's now reading some key files in the orchestrator agent and now it has come back with a couple of questions. These are things which obviously were not present in my initial prompt or not clear from my initial prompt. I can navigate this by using tab or arrow keys to navigate up and down. And the first question it's asking me, should only enrolled students be able to leave a star rating on a course? That makes sense to me because only those who've actually paid for the course should be able to rate it.

00:45 That means that the reviews are going to be more reliable. So I'll press return to select this. What star rating scale should we use? One to five stars, that feels most appropriate. So I press return.

00:56 And should the dashboard page also display average ratings on course cards? Now I'm not actually sure what's shown on the dashboard page, so I'm actually going to ask the LLM here. So I'm going to press 4 and chat about this. This should let me quit out of the Ask Questions flow, but it appears that I just seem to have gone in there again, so I'm going to press Escape and get out of there. I'm just going to ask it, what is currently shown on the dashboard?

01:18 Give me a list of all of the things that are shown there so I can work out whether adding the star ratings would clutter the UI. So you notice I can kind of kick off another exploration or it might already have the information in its context. I'm gonna press return here and just see what it does. So it's given me a description here of the dashboard code and what's actually shown there. I think based on the fact that this seems like a private dashboard to me, I'm going to say to it, let's not bother with the dashboard page.

01:42 Let's only put it on places where we're intending to sell the course. So now I'll press return. Now that it's got all of the information from all of the questions that it asked me, it should be able to come up with a decent plan that it's then going to put into action. So as we can see here, it's kicked off now a plan sub-agent. This is another context saving mechanism where it dives deep into the files again in order to read through everything, design a perfect implementation plan that it's then going to follow.

02:08 So let's wait for the plan agent to complete and see what it produces. Okay, the plan sub-agent has now completed and it's now actually creating a final plan. So this plan here is pretty meaty and it is a multi-step plan. It includes the code that we're probably going to add to the schema here, then the rating service that follows existing service conventions. When I'm reading these plans, I generally just read the top level items here, understanding all the steps are gonna be completed.

02:34 So it's then gonna update the course list page, update the course detail page. It's gonna touch some files here and then run some verification steps. It's also important to check the top of the file too, just to check the kind of top level context here. Students need a way to rate courses with a 1-5 star rating. Only enrolled students can rate.

02:52 Average rating should display on the course list page. On the course detail page the dashboard is excluded. So this looks fine to me. We can now scroll all the way to the bottom and we can check out our options here. We have four main options.

03:03 We have to say yes, go ahead and auto accept any edits. In other words, I trust that this plan looks great, just go ahead, I don't need to approve any file rights here, just feel free to write any code that you fancy. Or we could say, yes, go ahead and I need to still manually approve any stuff that you write. Or let's clear the context, put the plan into context only and then automatically accept any edits. Or of course, if I don't like the plan, then I can type into number four to tell Claude what to change, and it will update that plan.

03:34 So I'm deciding between one and two here. One would clear the context, but two would just keep the current context and then just barrel on. In order to make that decision, I need to check what current context we're on, because I'm feeling a little bit paranoid about the context. I can't exactly recall how to escape from here, but it's either escape... Yeah, escape works.

03:55 I was going to try Ctrl C if that didn't work. This lets us quit out into Claude here, and we can run forward slash context to check out what current context we're on. And there we go we are at 36% context already. We have a ton of messages in the context and we're just pushing up into the kind of bottom of the dumb zone. We might be able to get away with this but my context paranoia is starting to creep in.

04:18 So I'm going to go back to where we were by going down to the prompt and saying give me the chance to review the plan again. This should just open up the UI, yeah here we go, where it gives me the option to clear context or not. So because we're already pretty high on context, I'm gonna accept, yes, clear the context, and then automatically accept edits. So because we've now bumped it back to only the context that's in the plan, it reads some of the key files again, it checks for existing patterns, and actually kicks off another explore agent. So that's the downside there of clearing the context, right?

04:50 You then have to run the explore agent again to catch up to where you were. But it tends to be worth it to avoid the dumb zone. All right, we are finally at the implementation stage and it's now started creating a list of tasks for itself. And now it's started actually implementing and it's now referencing the steps in the plan as it's going. So it's added the course ratings table to the schema, it has created the rating service, and it's really starting to cook now so I'm just gonna let it run until it reaches a stopping point.

05:16 Okay, we are now at a state where it's done four out of five tasks. So one is currently in progress and the one that it's trying to run is the database migration. So this is the first time it's asked me for a permissions thing. Now database migrations are something that I always want personal control over. So I'm gonna say yes, but I'm not gonna give it the license to always run it automatically.

05:35 It's doing the same with the DB migrate command as well to apply the database migration to my local database and I'm gonna say yes go for it. Now I've hit a slight error in my local setup where it needs to run like a manual SQLite 3 command. SQLite 3 has not been found and so I'm sort of walking through some steps with the LLM here to actually just try to fix my local setup. We can see that here it's trying to run an arbitrary script in order to get this fixed. And the interest in keeping this video relatively short, I'm going to skip over this fix until I actually manage to get it sorted.

06:08 All right, that is now fixed. And it's now asking me whether I want to run the database seed command, so seed this nice fresh database. OK, and after a couple more permissions checks, it is now complete. If you ran into any issues with the setup or with the LLM there, then please go and ping in the Discord. But hopefully the model that you're using was smart enough that it was able to navigate around them.

06:27 So now let's check our context one more time just to see where we're at. Nice, So we ended up on 32% usage. That's good. That's nice and comfortably within the smart zone. So it was worth clearing out all that early context so that our implementation stayed within the smart zone.

06:42 Nice. I'm going to open up a separate terminal here inside VS Code and I'm going to run pnpm dev inside of it. And when I go there I can see that if I log in as Emma Wilson here and I check out some courses, the ones that I'm enrolled in here, then just under your progress here I'm able to rate this course. Nice. And now that my rating has been saved, we can see it on this course up here.

07:05 If I change it to a three, for instance, then it's gonna change on the global course straight away, that's quite nice. And if I switch now to Olivia Martinez, who also has access to this course, and I give it a five star rating, we can see up here it changes to 4.5 as the average. So that to me is looking pretty good for a first pass. What I'd now like you to do is go back to Claude and just type in commit here. This is gonna get Claude Code to add the relevant files to staging and then commit your code.

07:32 And we can see here it's asked for permission to write a commit message and I think yes, that looks good. All right, so we have built our first feature with Claude Code. What I want you to do right now is to open up a Notes app and write down anything that you noticed about your session with Claude Code. Write down any unresolved questions that you have, such as what is plan mode, for instance. How do I successfully debug with the agent?

07:52 How much should I be reviewing the code? We're gonna be coming back to these questions throughout the course, and hopefully we're gonna get you some good answers for them. But well done, This was a long solution video, a long exercise, so hopefully the ones after this should be a bit easier now we've built the foundations. Nice work and I will see you in the next one.
