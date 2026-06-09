# RAW — Running Bash Commands (Getting To Know Claude Code, 02.06)

> Immutable source material for [[gtk-claude-code/running-bash-commands]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 3:46.

## Lesson page content

Claude Code becomes much more powerful when you can execute bash commands and give it feedback. Instead of just writing code, Claude can run tests, check files, and respond to real output from your project. There are three ergonomic ways to interact with bash while Claude Code is running; each serves a different purpose.

Running Quick Commands:
- Start a bash command with the `!` prefix, e.g. `! npm run typecheck`. Claude executes the command immediately; the output appears in the terminal and is automatically incorporated into Claude's context.
- Let Claude see and respond to the output — if there are errors, Claude can analyze them and suggest fixes. Perfect for quick checks: running tests, checking file contents, verifying setup.

Starting Long-Running Processes:
- Run a long-running command like a dev server with no prefix: `npm run dev`. The process starts and outputs to the terminal.
- Press Ctrl+B to background the process — it moves to the background and a status message appears.
- Navigate to the background task indicator (press the down arrow) to the background task display at the bottom.
- Press return to open the background task — you can see what's happening with the dev server, including the localhost URL it's running on.
- Press the left arrow to return to Claude Code; the process keeps running in the background. Claude can see where the logs are written and interact with your project (make requests to the dev server, check output) while debugging.

Taking Full Terminal Control:
- Press Ctrl+Z to suspend Claude Code — Claude Code pauses completely and the terminal is yours.
- Run any commands you want; these are hidden from Claude (e.g. `echo foo`). Claude won't see or act on anything you run while suspended.
- Type `fg` to resume Claude Code — it resumes exactly where it left off with all previous state intact. Commands you ran during suspension aren't visible to Claude, but the session continues seamlessly.

## Full video transcript

00:00 One super important part of working with Claude Code is running bash commands. Bash commands turn your agent from just a passive code writer into something that can actually seek feedback loops, can actually work with your project, and can use all the power of bash at its disposable to find information and to do stuff. Now we can't just manually ask Claude, okay run the dev server for me and because it's quite smart it will understand okay I need to read the package.json, I need to find where the dev server is and then I need to run it like this. We'll get into what this is doing here in this kind of approval setup here. But suffice to say, there are some times when you just know what command you want to run and you just want to run it and then put the result into Claude's context.
00:40 So the way you do that is I've just restarted my Claude code instance. I'm going to just put an exclamation mark and now I've entered bash mode. And now anything I put in here will be turned into a bash command and actually run for Claude. So for instance, why don't I run npm run type check inside here and now it just runs the command after I press enter. Now because I haven't run npm install in my setup here, I'm getting a lot of errors.
01:05 And these errors are now present to Claude in its context. So I'm gonna get it to help me solve these errors and it will be able to see the errors and actually work with them. And there we go, it's figured out that Zod is in package.json, but not installed. I should run npm install. There we go.
01:19 Now this works well for commands that essentially have a start and an end, but what about commands that are supposed to persist like long running dev servers? Well for that we can run npm run dev inside bash mode here And what we can do is while it's running, we can actually press Control B to run it in the background. And in this version of Claw Code, something appears that says, command was manually background with user with ID this. And any output in that task goes into a local file. You can then see that underneath our status line here, there is a little background task that's showing.
01:55 And so I can zoom downwards with just the down arrow there and I can press return to see it. And now I can actually view the shell. I can view what's going on here and I can see that it's on localhost 5175. I've got lots of options here. I can stop it with X if I want to, or I can just press left to go back and now I'm back in my Cloud Code instance.
02:13 This is really useful when you're debugging a problem with your dev server, let's say, or with a long running command, because Claude can see where all of the logs are being written to. It can try something out in the UI, maybe, or send a curl request. And then it can actually see the output of the dev server. So I've just reset my instance here so we can see another feature which is suspending Claude code. If for instance I want to run something that I don't want Claude to see the results of or I don't care to show it and I have some state inside Claude that I want to preserve then I can use suspend.
02:44 I can press control Z inside here and Claude code has been suspended. This means I can now run any command I want to. I can just echo foo inside here and this is not visible to Claude code. If I want to bring Claude code back I can just run FG here and I get my Claude code instance back with all of its state. So this is great if you just want to go, okay, don't care about Claude code, do something like whatever command I want, and then FG to bring it back.
03:08 So the decision tree for this really looks like this. If you want the output of the bash command that you're running to be visible to Claude, Then you can use Bash mode here by using the exclamation mark, and you can background that with Control B and then manage those backgrounded tasks. Again, really, really useful for dev servers. I don't use it every single time, but when I do use it, it's usually for debugging some kind of dev server issue. But if you want the command to be totally hidden from Claude, you can just suspend it quickly with Control Z.
03:35 And of course, these are Windows shortcuts, so you might be needing to do something different if you're on Mac. So those are all the different ways that you can manage bash commands in Claude code. Nice work, and I'll see you in the next one.
