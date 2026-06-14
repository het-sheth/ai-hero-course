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

## The grill-me skill — actual file (cohort repo, commit `fc098f6` = `03.08.01`)

Retrieved verbatim from `.claude/skills/grill-me/SKILL.md` in the upstream cohort repo
(`ai-hero-dev/cohort-004-project`, branch `live-run-through`). The transcript quote above matches;
the real file additionally carries frontmatter with a `name` and a trigger `description`:

```markdown title=".claude/skills/grill-me/SKILL.md"
---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
```

## The solution — actual design decisions (commit `6751e1a` = `03.08.02`)

From the real diff "Add lesson comments with soft-delete and moderation". Files: `app/db/schema.ts`,
`app/services/commentService.ts` (+ `.test.ts`), `app/routes/courses.$slug.lessons.$lessonId.tsx`,
a Drizzle migration, and a seed update. Concrete answers the grilling produced:

- **Schema** — `lesson_comments` table: `id`, `lessonId` → `lessons`, `userId` → `users`, `content`,
  `createdAt`, and `deletedAt` (nullable). Deletion is **soft** (a `deletedAt` timestamp), not a row
  delete.
- **Service surface** — `listCommentsForLesson`, `createComment`, `getCommentById`,
  `getInstructorIdForLesson`, `softDeleteComment`.
- **Who can delete / moderate** — a comment may be soft-deleted by the **comment author**, the
  **lesson's course instructor**, or **any admin**. That's the moderation model: instructors and
  admins can remove comments, authors can remove their own.

---

# Solution page — full walkthrough (Matt's live run)

Source: AI Hero, "The Grill Execute Clear Loop" — **Solution** tab (full page text + 9:23 video
transcript). This is the richer, blow-by-blow version of the run.

## The starting point

> I want to add a lesson comments feature to my course platform. I'm not entirely sure of the scope,
> but I want to reach version 1 quickly and see something working.

The minimum viable feature: students can comment on lessons, and instructors can also comment on
those lessons. The exact prompt fed to `/grill-me`:

> I want to add a lesson comments feature. I'm not entirely sure of the scope, but I want to make
> sure we reach v1 pretty quickly, and so I want to see something working. The minimum is I
> definitely want students to be able to comment on lessons and have instructors also comment on
> those lessons.

## The agent's exploration (lay of the land)

The agent reads the codebase first and finds:

- A **React Router** course app with **students, instructors, and admins**.
- Per-lesson routes at `courses.$slug.lessons.$lessonId.tsx`.
- Lessons live under modules under courses.
- **No existing comments-like table.**

## The design questions (one at a time, with recommended answers)

The agent walks down the design tree, asking one question at a time, each with a recommendation.

1. **Who can comment?** → Recommended: **only enrolled students and the course instructor** can
   post and read. Comments are scoped to one lesson and only visible to people with access to that
   lesson. *Accepted.* (Matt: this is his favorite response to Grill Me — just accepting the
   recommendation.)

2. **Threading model?** Options: pure flat / one-level replies / fully nested (Twitter-style).
   Agent's first recommendation: **one-level replies** as a balanced v1. **Matt pushes back** with a
   follow-up question — *which threading model would be hard to roll back from?* The agent returns a
   reversibility ranking:

   | Option | Reversibility |
   |---|---|
   | Pure flat → one-level | Trivial (add a nullable `parentId` column later) |
   | One-level → fully nested | Easy (column exists, only UI changes) |
   | Fully nested → anything simpler | Hard (data meaning depends on depth) |

   This **flips the recommendation**: pure flat is the most reversible starting point. *Accepted:
   pure flat (no threading).*

3. **Content format?** → Recommended: **plain text with auto-linkified URLs**. No rich-text WYSIWYG
   for v1. *Accepted.*

4. **Editing and deleting?** → Recommended: authors can delete their own; **instructors can delete
   any comment on their course's lessons**; **no editing in v1**; use **soft delete** (a `deletedAt`
   column) so threads don't lose context; deleted comments render as a **`[deleted]` placeholder**.
   *Accepted.*

5. **Where comments live?** → Recommended: a **"Discussion" section appended below the lesson content
   and quiz**. Same scroll, no tab, comments load with the lesson. *Accepted.*

6. **Sort order?** → Recommended: **oldest-first (chronological)** — discussions read like a Q&A
   thread, context flows top-to-bottom, instructor replies follow the question they answer.
   *Accepted.*

7. **Instructor badge?** → Recommended: an **"Instructor" badge** next to the instructor's name plus
   a **subtle background tint**. *Accepted.*

8. **Pagination?** → Recommended: **none for v1, load all comments per lesson**. Realistic v1 volume
   is small; add pagination later (past ~50 comments) — fully reversible. *Accepted.*

9. **Notifications?** → Recommended: **out of scope for v1**. Notifications mean email infra or a
   notifications table + in-app UI — multi-day add-ons. *Accepted.*

10. **Character limit?** → Recommended: **2000 characters, enforced server-side**. *Accepted.*

11. **Moderation?** → Recommended: **defer all moderation** (reporting, rate limiting) for v1, but
    add one small extra — **allow admins to delete comments too** (one extra OR clause, zero schema
    changes). Matt **disagrees with the base "defer everything" rec** and **accepts the admin-delete
    suggestion**: "admins not being able to do something feels super awkward." *Accepted: admin
    delete in.*

## Benefits of focused questioning (Matt's observations)

- Only **one question at a time** — focus shifts question to question, resolving each in line. A big
  upfront plan doc invites laziness / deprioritizing decisions; one-at-a-time forces real thought
  and **good alignment in the output**.
- It's a **dialogue, not an interrogation** — Matt actively *drove* the conversation: asked the
  follow-up about reversibility, pushed back on moderation. (He notes lots of people just answer
  A/B/C passively — don't; drive it.)

## The v1 spec the agent produced

**Scope**

- Enrolled students + course instructor + admins can read and post on a lesson's comments
- Flat list (no threading)
- Plain text, 2000-char limit, server-enforced
- Auto-linkify URLs at render time
- Sort oldest-first
- Instructor comments get an "Instructor" badge plus subtle tint
- Author can delete own; instructor can delete any on their course; admin can delete any
- Soft delete (`deletedAt`); deleted comments render as `[deleted]` placeholder
- No editing, no notifications, no reporting, no rate limit, no pagination

**Schema** — new comments table with `id`, `lessonId`, `userId`, `content`, `createdAt`, `deletedAt`.

**Code surface**

- New table + Drizzle migration
- `commentService.ts` with `listForLesson`, `create`, `softDelete` (plus tests)
- Extend the existing action in `courses.$slug.lessons.$lessonId.tsx` with `create-comment` and
  `delete-comment` intents
- Extend the loader to include comments and author info
- Append a `<Discussion>` section to the lesson page below content and quiz

Matt: *"I've never created a plan asset. I've never formally written this down. I just had a
conversation, and now I have complete alignment on what I'm building."*

## Implementation

Matt flips to **accept-edits-on (shift+tab)** and says implement — confident because he's only at
**~40k tokens** (comfortably in the smart zone). The agent:

- Adds the `lessonComments` table to `app/db/schema.ts`; runs `pnpm db:generate` then `pnpm
  db:migrate`. The migration hits an error (table already exists from a previous attempt); the agent
  cleans up by dropping the old table and re-migrating.
- Implements `app/services/commentService.ts` with `listCommentsForLesson`, `createComment`,
  `softDeleteComment` — **all 10 tests pass** (~60k tokens).
- Wires the lesson route `courses.$slug.lessons.$lessonId.tsx`: loader fetches comments (if the user
  can access the discussion), action handles `create-comment` / `delete-comment` intents, component
  renders a `<Discussion>` section below content + quiz. The Discussion component has a textarea, a
  character counter, delete buttons for permitted users, and an "Instructor" badge (~78k tokens —
  heading toward the dumb zone but still smart-zoning).
- Runs typecheck (clean) and the full suite — **all 288 tests pass**, including the 10 new ones.

## QA (DevUI, switching users)

- **Emma Wilson (student, enrolled)** — sees the "Discussion" section, posts "hey, like this"; it
  appears.
- **Marcus Johnson (course instructor)** — sees Emma's comment, can delete it, posts his own which
  shows an **"Instructor" badge + tinted background**. Can delete own and Emma's. Deleted comments
  show as `[deleted]` (soft delete — row still in DB).
- **James Park (student, NOT enrolled)** — doesn't see the comments at all.
- **Olivia (another enrolled student)** — sees and can post, but **can't delete** Emma's or Marcus's.

Everything works as designed.

## Results and takeaways

- A **perfectly aligned implementation** matching the plan — **no steering during implementation**.
- **No plan asset / no formal spec** created — just a conversation that produced a working feature.

The `/grill-me` workflow:

1. Start with a rough idea
2. Answer focused design questions one at a time
3. Ask follow-up questions to drive the conversation
4. Achieve complete alignment on scope and design
5. Implement with confidence

Optional extension: redo the whole lesson **with plan mode** and compare the experience.
