# RAW — Repo Setup (Before We Start, 01.03)

> Immutable source material for [[before-we-start/repo-setup]].
> Pasted by Het from the aihero.dev lesson page (steps + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Project repo: https://github.com/ai-hero-dev/cohort-004-project · Lesson length: 3:27.

## Lesson page content

Before building, get the course project running locally: clone the repo, install Node.js and pnpm,
seed the database, and set up an agent. The setup is straightforward — follow the steps in order.

### Steps To Complete

**Clone the Repository**
- Go to the repo, press the code button, select HTTPS, copy the URL.
```
git clone https://github.com/ai-hero-dev/cohort-004-project.git
```
- Navigate into the cloned directory.

**Install Node.js**
- Download and install from https://nodejs.org/en/download — choose **version 22 or version 24**
  (both work). Select the installer for your OS.
- Verify: `node -v` → should print a version number.

**Set Up the Package Manager**
- Enable pnpm: `corepack enable`. This installs pnpm, the package manager used by this project —
  faster than npm and saves disk space.
- Verify: `pnpm -v` → should print a version number.

**Install Dependencies**
- `pnpm install` — downloads all required packages from the NPM registry into `node_modules`.

**Seed the Database**
- `pnpm db:seed` — creates the database tables and populates them with sample data. The project is
  a course platform, so the DB includes users, courses, categories, quizzes, enrollments, lesson
  progress records, quiz attempts, video watch events, and more.
- `pnpm dev` — starts the development server on localhost:5173 or similar.
- Visit the URL → you should see a **Cadence** video platform. Click Courses to see available
  courses. There's a dev UI at the bottom of the page to log in as different users.
- Press CTRL-C to stop the dev server when ready to move on.

**Install Your Agent**
- The course works with any CLI-based agent. Visit the setup docs for your agent of choice. For
  Claude Code, visit the Claude Code setup docs.
- Run `claude` in your terminal → opens the agent. You may need to log in with your API key or
  subscription.
- Test it works: type `hello` and it should reply.
- You're ready to start the course! If you hit issues, head to the AI Hero Discord and ask for help.

## Full video transcript

00:00 Okay, let's clone the repo and pull down the actual workspace we're going to be doing the course in. The repo is at AI Hero Dev Cohort 004 Project and I will put a link below for you. You can clone it to your local setup by pressing the code button here, by pressing HTTPS here and by pressing copy and then by going into a terminal and writing git clone and then pasting in the URL that you got. Again I'll have this command below for you so that you can easily run it. Next you will need to download Node.js in order to complete the exercises.

00:27 You can go to the link below and choose your version. I recommend you choose either LTS version is fine. So either 22 or 24 is the current state. You can follow the instructions here. Make sure you select the right platform.

00:40 And once that's done, you should be able to open up the project inside VS Code, open the integrated terminal, and then run node-v and it will tell you some version. If you get some kind of unexpected error here or you see something that isn't this little version number, it means that node has not been properly installed. Once that's done, you're going to run corepack enable here. And what this does is it installs a really important little bit of kit called PNPM. PNPM is just a lot faster than NPM, it saves a lot more disk space, and in my mind it's the industry standard.

01:11 Once you've run Core Pack Enable you should be able to run PNPMv and see some kind of version printed out. And then you will be able to run pnpm install to install all of the packages in the repo. You should see some kind of output like this, which has all of the packages here. And you should also see a node modules folder that has been added. If you, if I refresh there, there it is.

01:32 There's my Node Modules folder with a bunch of stuff in. Once that's done we're going to set up the playground here. So we're going to go to the bottom and we're going to run pnpm db colon seed. What this is going to do is just seed a little database that runs locally with our project. The project is a course platform and so inside the database, we've created some user tables, some categories tables, quizzes, enrollments, lesson progress records, quiz attempts, video watch events, all sorts of stuff.

02:01 And so now we can go to the bottom and run pnpm dev. And this runs a script to run the application locally on localhost, in my case, 5175. If I go to visit that URL, then I should see a cadence video platform here. If I click on courses, we can see some courses in theory. There we go, Node.js and TypeScript looking good.

02:21 There is even a dev UI at the bottom here where we can log in as a user. We're not going to explore this too thoroughly because one of the lessons that we're going to do in the course is exploring new code bases So don't get too familiar with how this works yet. Let's not use our human eyes, let's let the robots do it, why not? Finally, you should install the agent that you're using if you don't already have one. In my case, I'm gonna be using Claude Code while we're walking through the course, but the stuff we cover in the course will be workable with nearly any CLI based agents.

02:48 So for Claude Code I can run this command here and then I should be able to run Claude and then I'll be prompted to log in, follow the prompts to log in with my account and we should be good to go. Once that's done You should be able to run Claude like this and open up the, yeah, here we go, let me trust this folder. You should see a UI that looks something like this, although they may have changed it by the time that you see this. There should be some variety of text input here that you can say hello and it should reply to you back with some message. If you have any setup issues or weirdnesses at all, make sure you head to the Discord so that people can help you out.

03:21 But if all went smoothly, then you are ready to take the course. Nice work, and I'll see you in the next one.
