# RAW — How To Take This Course (Before We Start, 01.06)

> Immutable source material for [[before-we-start/exercise-workflow]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 6:08.

## Lesson page content

The course is structured into interactive exercises that all happen in the playground. To run an
exercise yourself, you need to get your repo into the same state as when the exercise was recorded.
There's a simple tool to get your repo into the correct state.

### The `pnpm reset` Command
Run `pnpm reset` in the playground → it gives you a bunch of commits to choose from across the
entire course history. You can reset to:
- **main** — the starting point / main branch of the repo
- **Future commits** — to jump ahead to lessons further into the course

Navigate with up/down arrow keys. You can also search by name (e.g. "grill me" to find the grill-me
skill section) or by number (e.g. "04.05.01").

### Resetting to a Specific Commit (demo)
Reset to checkpoint 01.01.01. On `main`, `package.json` has a description "awesome horse platform" —
which isn't right; it's a course platform, not a horse platform. Use `pnpm reset` to jump to the
commit that fixed it. Selecting it shows: "You cannot reset the main branch." It then offers to
create a new branch — call it `dev` (the working branch throughout the course). A new branch `dev`
is created and you're switched to the version where it says "awesome course platform."

Two things happened: (1) switched to a new branch, (2) the repo is now at the commit where the
package.json was fixed. `git status` → on branch `dev`; `git log` → the fix commit. To go back, run
`pnpm reset` again and reset to `main` (either reset current branch or create a new branch from the
commit).

### Reset Destroys Existing Work
`pnpm reset` is a **destructive** action — it deletes existing work when it finds it. Useful to
completely reset to the recorded state; less useful if you have work to preserve. Example: add an
npm script `"pizza": "echo 🍕"`, commit it, then `pnpm reset` to main — when you reset the current
branch, the pizza script is gone. You're resetting the entire branch to the exact recorded state.

### Preserving Work with `pnpm cherry-pick`
If you have work to preserve, run `pnpm cherry-pick` instead — it preserves your existing work.
Reset to main ("awesome horse platform"), add the pizza script, commit, then `pnpm cherry-pick` the
commit that fixes the package.json description. This just works because you're only changing the
description and the pizza script is preserved.

### Handling Merge Conflicts
If you instead changed the description to something else (e.g. "awesome frog platform") and commit,
then `pnpm cherry-pick` the course commit ("awesome course platform"), you get a merge conflict —
incoming change "awesome course platform" vs current "awesome frog platform." An AI assistant is
good at helping: ask Claude to fix the merge conflict. Or bail with `git cherry-pick --abort`, which
aborts and leaves your work preserved.

### Pulling Upstream Updates
The instructor pushes updates during the course (fixes, package updates), so your `dev` branch gets
out of date. `pnpm pull` is like `git pull` except it fetches all changes from the parent repo and
pulls them into your branch — it preserves everything (not a reset). Merge conflicts? Ask an AI
assistant to fix them.

### Command Summary
| Command | Purpose |
|---------|---------|
| `pnpm reset` | Completely reset your work to the recorded state |
| `pnpm cherry-pick` | Cherry-pick commits while preserving your work |
| `pnpm pull` | Pull upstream changes from the main repo |

Use `pnpm reset` to match the instructor's state exactly; `pnpm cherry-pick` when you have work to
preserve; `pnpm pull` to stay up to date as the course is updated.

## Full video transcript

00:00 This course is structured into a bunch of interactive exercises. And these interactive exercises all happen in the Playground. Now in order to run those exercises and do them yourself, you're going to need to get your repo into the same state that mine was when I recorded the exercise. I've given you a really simple, easy to use tool that you can use to get your repo into the same state as mine. The way this works is you can go into the playground and run pnpm reset.

00:26 And what this will do is give you a bunch of commits that you can choose from, from a history that I've provided for the entire course here. For instance we can reset to main which is the starting point, the main branch of the repo. Or if we want to reset to a future point to maybe do a lesson further on in the course then we can reset to that point. I'm navigating down this by just pressing up and down like this, but I can also search. So if I want to look for the grill me skill section, then I can type grill me and that will show up or I can search by number.

00:55 So 04.05.01 for instance, then we've got this skill. As a demo we are going to reset to this little point here, 01.01.01. And here what you'll notice is that we're on main right now and inside the package.json file there's a description saying it's an awesome horse platform. That doesn't seem right. This is a course platform, not a horse platform.

01:19 So what we can do is we can use reset to reset to the point where I fixed that package.json description. And if we select this, then it says you cannot reset the main branch. So we're not on the correct branch. So it's now giving me the option to choose a new branch name. I'm going to call this Dev for instance.

01:36 This is going to be my working branch throughout the course. And now it creates a new branch Dev and it's switched to the version of the course or the version in the history where I've got an awesome course platform instead of an awesome horse platform. So two things happen there at once. We switch branches to a new branch. So if I run git status, we can see we're on branch dev.

01:59 And if I run git log like this, we can see that the commit here is the one with the fixed package.json description. If I want to, I can run pnpm reset again and now I can go back to main so I can reset to the starting point. And when I do this, then if I choose that, I can either reset the current branch or create a new branch from the commit. I'm gonna choose to reset the current branch. And now we've got an awesome horse platform back.

02:25 So we're back at the starting point. Now, PMPM reset is a destructive action. That means it deletes existing work when it finds it. This is really useful if you want to totally reset your repo to the state that it was when I recorded the video, but it's less useful if you have some cool work that you want to preserve. For instance, let's say you added an npm script here saying pizza that just echoes an emoji of a pizza.

02:49 You commit it and you want to preserve it and let's just grab that in there. Then we're going to run pnpm reset again and if we reset to main or we really reset anywhere actually and let's just reset the current branch then we are going to if we see pizza is still there and then we reset the current branch and now the pizza script has gone. So unrelated changes get removed when you reset. You're resetting the entire branch to the state that I recorded it in. If you have some work that you want to preserve, then you can run pnpm cherry pick and this preserves existing work.

03:26 So I've reset our repo back to the main branch and you can see we're back at horse platform here. If I go in and add our pizza script again, and I will generate a thingy thing here, and I've committed. Now, if we try to, let's go pnpm cherry hyphen pick instead. When we go to cherry pick the commit here, we should now, should just work, because all we're changing is this course platform and our existing work gets preserved However, if I reset back to main, so let's just go p.m. P.m.

03:59 Reset heading back to main here I'm gonna reset the current branch. So we go back to horse platform. If instead I go to frog platform like this, you can tell I've got a two-year-old because I just think in farm animals, and I commit it here. Now when I go to run pnpm cherry-pick and I cherry-pick the course commit we are going to get a merge conflict because it's attempting to preserve my previous work but we have a merge conflict between the both here. We can see the incoming change here is the course platform which is the one that we're attempting to cherry-pick and the current change that we have is the frog platform.

04:36 Now if you get into a situation like this where you want to cherry-pick but you have a gnarly merge conflict then AI is actually really good at helping you out. You can just say Claude fix this merge conflict for me and it will guide you through it. Or if you just wanna get out of there, you can run git cherry pick hyphen hyphen abort and it will abort the cherry pick and you'll still end up with your work preserved. Finally, the way these courses generally work is I will be pushing updates to the course while you're taking the course, either to fix local issues or update packages, things like that. So this means that your dev branch, the one that you're working on, will get out of date with what I've prepared locally.

05:13 So what I've done here is I've provided for you, let's just do a git status, We're on the dev branch and we are going to run pnpm pull here. And pnpm pull is kind of like an analogy to git pull except it fetches all the stuff from the parent repo and pulls them into your branch. And in theory this will just preserve everything. So it's not going to be a reset, it's not going to reset it to any state, it's just going to grab all of the changes to main and pull them into your branch. If you do get any merge conflicts here then you should head into Claude and say just fix the merge conflicts.

05:47 So those are the three commands you need to know. PnPnReset which totally resets your work to the state that I recorded it in, CherryPick that allows you to cherry pick existing commits and PnPnPull which pulls in upstream changes as I make them to the repo. Hopefully that all makes sense, and feel free to ask in the Discord if you have any questions. Nice work, and I'll see you in the next one.
