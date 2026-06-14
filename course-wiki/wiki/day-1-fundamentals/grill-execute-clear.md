---
title: Grill → Execute → Clear
status: solid
created: 2026-06-14T00:00:00.000Z
desc: The core working loop for a session — grill-me to design, execute, then clear.
tags:
  - claude-code
  - workflow
  - grill-me
  - planning
sources:
  - >-
    https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
  - raw/day-1-fundamentals/grill-execute-clear.md
related:
  - /day-1-fundamentals/why-plan-mode-sucks.md
  - /day-1-fundamentals/build-a-feature.md
  - /day-1-fundamentals/codebase-exploration.md
  - /day-1-fundamentals/constraints-of-llms.md
  - /day-1-fundamentals/compaction.md
first_seen: log/2026-06-14
first_seen_label: 2026-06-14 · Day 1 Fundamentals
order: 8
type: concept
description: >-
  The core session loop: grill (interview hard with /grill-me to reach a shared
  design concept) → execute (implement against that understanding) → clear (wipe
  context for the next task). Practised by designing a lesson-comments feature
  before writing any code.
timestamp: 2026-06-14T00:00:00.000Z
---

The loop that replaces [plan mode](/day-1-fundamentals/why-plan-mode-sucks.md): **grill → execute →
clear**. You design *first* by being interviewed, implement against that shared understanding, then
clear the context before the next task.

## The exercise: a lesson comments feature

Build a **lesson comments system** — students can comment on lessons. It's deliberately left vague,
so you have to spend time with the agent figuring out what it actually means. The open questions are
interconnected:

- Should instructors be able to comment?
- Can they moderate?
- Can they delete or hide comments?
- Are comments visible to everyone, or only to enrolled students?
- Can students see other people's comments?
- Are comments visible to anyone looking at the course?

These decisions matter, and they depend on each other — exactly the kind of design tree the
`/grill-me` skill is built to walk.

## The `/grill-me` skill

The whole skill is tiny — this is the entire file (cohort repo commit `03.08.01`, verbatim):

```markdown title=".claude/skills/grill-me/SKILL.md"
---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching
  shared understanding, resolving each branch of the decision tree. Use when user
  wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared
understanding. Walk down each branch of the design tree, resolving dependencies
between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.
```

Two details do a lot of work here:

- **"Ask one at a time" + "recommended answer"** — you're never staring at a wall of questions, and
  you can often just accept the recommendation and keep moving.
- **The "explore" verb** — it won't ask you anything it could check itself; it goes out and reads
  the repo (see [Codebase Exploration](/day-1-fundamentals/codebase-exploration.md)), so the
  interview stays focused on genuine *intent*.

This is the opposite of plan mode's truncated interview: the weight is on building the **shared
design concept** before any code exists.

## Steps to run it

1. **Start a new session.** Use the **default mode** — not plan mode, not auto mode. Toggle
   accept-edits *off* for now.
2. **Load the skill.** It lives at `.claude/skills/grill-me/SKILL.md`. Invoke `/grill-me`.
3. **Get grilled.** Answer the agent's questions honestly — there are no wrong answers. Let it walk
   the design tree and resolve dependencies in order.
4. **Take notes as you go:**
   - Observations on *how* it designs — does it ask the right questions? Resolve dependencies in a
     logical order?
   - Improvements you'd make to the skill — it's simple, not perfect.
5. **Reach a shared understanding.** Continue until you both agree what the feature is. The agent
   will signal it: *"okay, we're ready to implement, let's go."*
6. **Execute.** Implement the feature and check whether what's produced matches the understanding
   you reached.

> [!TIP] Treat it as a sandbox
> The point isn't a perfect comments feature — it's *feeling* the loop. Mess about with grill-me,
> watch how the interview fills the context window with valuable intent, then turn that into an
> implementation.

---

## The full run: designing lesson comments

Matt fed the following starting prompt to `/grill-me`:

> I want to add a lesson comments feature. I'm not entirely sure of the scope, but I want to make
> sure we reach v1 pretty quickly, and so I want to see something working. The minimum is I
> definitely want students to be able to comment on lessons and have instructors also comment on
> those lessons.

### The agent's exploration (lay of the land)

Before asking a single question the agent reads the codebase and finds (see [Codebase
Exploration](/day-1-fundamentals/codebase-exploration.md) for why it does this automatically):

- A **React Router** course app with **students, instructors, and admins**.
- Per-lesson routes at `courses.$slug.lessons.$lessonId.tsx`.
- Lessons live under modules under courses.
- **No existing comments-like table.**

With that context established, the interview begins.

---

## Walking the design tree

The agent asks **11 questions**, one at a time, each with a recommended answer. Below is the full
sequence, including one moment where Matt drives the conversation by pushing back.

1. **Who can comment?**
   Recommended: **only enrolled students and the course instructor** can post and read. Comments are
   scoped to one lesson and only visible to people with access to that lesson. *Accepted.*

   > [!NOTE] Matt's favourite response
   > Accepting the recommendation without debate is a legitimate move. You've already thought about
   > the feature; the skill lets you move fast on settled questions.

2. **Threading model?**
   Initial recommendation: **one-level replies** (a balanced v1). Matt pushes back with a
   follow-up — *which threading model would be hardest to roll back from?* The agent returns a
   reversibility ranking:

   | Option | Reversibility |
   |---|---|
   | Pure flat → one-level later | Trivial (add a nullable `parentId` column) |
   | One-level → fully nested | Easy (column exists; only UI changes) |
   | Fully nested → anything simpler | Hard (data meaning depends on depth) |

   This **flips the recommendation**: pure flat is the most reversible starting point.
   *Accepted: pure flat (no threading).*

3. **Content format?**
   Recommended: **plain text with auto-linkified URLs**. No rich-text WYSIWYG for v1. *Accepted.*

4. **Editing and deleting?**
   Recommended: authors can delete their own; **instructors can delete any comment on their course's
   lessons**; **no editing in v1**; use **soft delete** (a `deletedAt` column) so threads don't lose
   context; deleted comments render as a **`[deleted]` placeholder**. *Accepted.*

5. **Where do comments live?**
   Recommended: a **"Discussion" section appended below the lesson content and quiz**. Same scroll,
   no tab, comments load with the lesson. *Accepted.*

6. **Sort order?**
   Recommended: **oldest-first (chronological)** — discussions read like a Q&A thread, context flows
   top-to-bottom, instructor replies follow the question they answer. *Accepted.*

7. **Instructor badge?**
   Recommended: an **"Instructor" badge** next to the instructor's name plus a **subtle background
   tint**. *Accepted.*

8. **Pagination?**
   Recommended: **none for v1, load all comments per lesson**. Realistic v1 volume is small; add
   pagination later (past ~50 comments) — fully reversible. *Accepted.*

9. **Notifications?**
   Recommended: **out of scope for v1**. Notifications mean email infra or a notifications table +
   in-app UI — multi-day add-ons. *Accepted.*

10. **Character limit?**
    Recommended: **2,000 characters, enforced server-side**. *Accepted.*

11. **Moderation?**
    Recommended base: defer all moderation (reporting, rate limiting) for v1. Also suggested: **allow
    admins to delete comments** (one extra OR clause, zero schema changes). Matt disagrees with
    deferring admin delete entirely — *"admins not being able to do something feels super awkward"*
    — and accepts the admin-delete suggestion. *Accepted: admin delete in.*

### The reversibility insight

Matt's push-back on question 2 is the single most instructive moment in the run. The agent's
*first* recommendation was one-level replies — reasonable, but wrong for a reversibility-first v1.
By asking *"which is hardest to undo?"* Matt flipped the answer. The reversibility table above is
what drove that flip.

> [!IMPORTANT] Drive the conversation, don't just answer A/B/C
> A lot of people answer passively — they just pick from the options offered. Matt actively asks
> follow-up questions and pushes back. The interview is a dialogue; use it to stress-test the
> agent's reasoning, not just accept the first recommendation.

---

## The v1 spec (no plan asset)

After 11 questions Matt had a complete spec — *with no formal plan doc created*:

> "I've never created a plan asset. I've never formally written this down. I just had a conversation,
> and now I have complete alignment on what I'm building."

**Scope**

- Enrolled students + course instructor + admins can read and post on a lesson's comments
- Flat list (no threading)
- Plain text, 2,000-char limit, server-enforced
- Auto-linkify URLs at render time
- Sort oldest-first
- Instructor comments get an "Instructor" badge plus subtle tint
- Author can delete own; instructor can delete any on their course; admin can delete any
- Soft delete (`deletedAt`); deleted comments render as `[deleted]` placeholder
- No editing, no notifications, no reporting, no rate limit, no pagination

**Schema** — new `lesson_comments` table: `id`, `lessonId`, `userId`, `content`, `createdAt`,
`deletedAt`.

**Code surface**

- New table + Drizzle migration
- `commentService.ts` with `listForLesson`, `create`, `softDelete` (plus tests)
- Extend the existing action in `courses.$slug.lessons.$lessonId.tsx` with `create-comment` and
  `delete-comment` intents
- Extend the loader to include comments and author info
- Append a `<Discussion>` section to the lesson page below content and quiz

---

## Implementation & context budget

Matt flips to **accept-edits-on (shift+tab)** and says implement. Key: he is only at **~40k
tokens** — comfortably in the smart zone (see
[Constraints of LLMs](/day-1-fundamentals/constraints-of-llms.md) for the ~40% threshold that
separates sharp from degraded reasoning).

| Checkpoint | Token count | State |
|---|---|---|
| "Implement" issued | ~40k | Smart zone — good time to start |
| Service + 10 passing tests | ~60k | Still smart-zoning |
| UI wired + 288 tests passing | ~78k | Heading toward dumb zone, still ok |

The agent's implementation sequence:

1. Adds `lessonComments` table to `app/db/schema.ts`; runs `pnpm db:generate` → `pnpm db:migrate`.
   Migration hits a conflict (table already existed from a prior attempt); the agent cleans up by
   dropping the old table and re-migrating.
2. Implements `app/services/commentService.ts` with `listCommentsForLesson`, `createComment`,
   `softDeleteComment` — **all 10 tests pass** (~60k tokens).
3. Wires `courses.$slug.lessons.$lessonId.tsx`: loader fetches comments (if the user can access the
   discussion), action handles `create-comment` / `delete-comment` intents, component renders a
   `<Discussion>` section below content + quiz with a textarea, character counter, delete buttons for
   permitted users, and "Instructor" badge (~78k tokens).
4. Runs typecheck (clean) and the full suite — **all 288 tests pass**, including the 10 new ones.

---

## QA matrix (DevUI, switching users)

Matt switches between four users in DevUI to verify the access rules:

| User | Role | Sees discussion? | Can post? | Can delete? |
|---|---|---|---|---|
| Emma Wilson | Student, enrolled | Yes | Yes | Own only |
| Marcus Johnson | Course instructor | Yes | Yes (badge + tint) | Own + any on his course |
| James Park | Student, NOT enrolled | No | — | — |
| Olivia | Student, enrolled | Yes | Yes | Own only (not Emma's, not Marcus's) |

Soft delete confirmed: deleted comments show `[deleted]`, row stays in the DB.

Everything works as designed, with no steering during implementation.

---

## Takeaways / the workflow

- A **perfectly aligned implementation** because the design conversation filled the context with
  intent — the agent wasn't guessing.
- **No formal plan asset needed** — the grilling *is* the spec.
- Token budget matters: starting implementation at ~40k (smart zone) gives the model enough runway
  to finish the feature without degrading mid-task.

The `/grill-me` workflow step-by-step:

1. Start with a rough idea
2. Answer focused design questions one at a time
3. Ask follow-up questions — *drive* the conversation, don't just answer A/B/C
4. Achieve complete alignment on scope and design
5. Implement with confidence

> [!TIP] Optional extension
> Redo the whole lesson with plan mode and compare the experience — how much alignment do you
> actually get from a plan vs. a grill?

---

## Where this sits

- **Grill** — `/grill-me` (this lesson), the fix for the
  [missing shared design concept](/day-1-fundamentals/why-plan-mode-sucks.md).
- **Execute** — implement against the shared understanding, like the first
  [Build A Feature](/day-1-fundamentals/build-a-feature.md) exercise.
- **Clear** — wipe context before the next task; covered next in
  [Compaction](/day-1-fundamentals/compaction.md) and [Handing Off](/day-1-fundamentals/handing-off.md).
