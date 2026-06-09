# RAW — Managing Your Claude Code Session (Getting To Know Claude Code, 02.02)

> Immutable source material for [[gtk-claude-code/managing-your-session]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 4:06.

## Lesson page content

You're about to start using Claude Code for the first time. Before diving into advanced workflows,
you need the basics: how to send prompts, monitor what's happening in your session, and control
execution. This lesson is **pure mechanics** — where the buttons are and what they do, not when to
push them or why (that strategy comes later). By the end you'll be comfortable opening Claude Code,
sending a question, checking what's happening under the hood, interrupting if needed, and clearing
your session for a fresh start.

Steps To Complete:
- **Send Your First Prompt** — open Claude Code, see the input area, type `Which package manager am
  I using?` (a real question about your project, so Claude can look at your repo and answer), submit
  and wait — Claude analyzes your project files and tells you which package manager it found.
- **Check Your Session Usage** — run `/usage` (type it and submit like a prompt). It shows how much
  of your Claude account quota you've consumed; useful for monitoring, nothing to act on now.
- **Check Your Session Context** — run `/context`. It shows what Claude currently "remembers" from
  this session (all prompts/responses) — the memory of your current conversation.
- **Interrupt a Long Task** — send a time-consuming prompt like `Analyze the structure of this
  codebase in detail`; while Claude is working, interrupt execution (the interrupt button / keyboard
  shortcut). Confirm the response cuts off and execution halts.
- **Clear and Verify the Reset** — run `/clear` to wipe session memory; run `/context` again and
  compare — session history should be empty/cleared. This makes "clear" concrete.
- **Send a Final Prompt** — type `Say hello` to confirm the session still works. You've completed
  the full cycle: send, monitor, interrupt, clear, resume.

## Full video transcript

00:00 All right, so you got Claude Code ready to go and installed. Let's open it up and check out the first few commands that I want you to learn. For this entire course, I'm going to be running Claude from within VS Code. We're gonna talk about the relationship between Claude Code and VS Code, but for now, it's okay just to run Claude inside the integrated terminal. What you should see is a UI kind of like this.

00:19 I can't promise that they haven't changed the UI since they've recorded this, but something they will definitely keep is this enormous input box here. We can say to Claude, hello, how are you? And then to send it, we can press return inside the terminal. It comes back with hi I'm doing well thanks for asking how can I help you today? In other words this so far is so much like any other AI chat application that you've used already.

00:41 At this point I would like you to run something. I'd like you to run forward slash then terminal hyphen setup. It should turn this nice shade of lilac when you've completed the command here. You can then use enter to initiate the command and this will set up a couple of key bindings for you. In my case, because I'm on Windows subsystem Linux, then I have to install this manually myself.

01:03 But if you're on a different operating system, such as Windows or Mac, you're going to just have it installed for you. But once it is installed, you'll be able to do something very nice, which is you'll be able to press Shift Enter to add new lines into your input here, which is really important when you want to express more complicated things. For instance, I can type thank you and then add a couple of new lines and then say very much like this for a sort of dramatic effect. So from here, let's show a couple of really important commands that we're gonna be using on every single time that we use Cloud Code. The first one here is forward slash usage which shows your plan usage limits.

01:38 So again just to show you that again because I did that quite fast we go forward slash then usage and I can even use tab here to complete the command there. So again, usage like that, and then I run it with return. And this shows me how much Claude code usage I have left in my current session on my current week. And there's a separate one for current week SONNET only. Now this will probably look different based on which plan you're on and what Claude plans even look like in the future.

02:05 For me I'm on 5x max and this is what it looks like with 5x max. I can then press escape to cancel out of this. Another really important command is to run forward slash context here And what context is going to do is show me a graph of all of the different ways I'm using up my context window. We are currently using about 21, 000 tokens out of a maximum of 200k tokens. So we're using around 10% here.

02:30 We're going to be talking a lot, lot more about context throughout this entire course. And so this is a great way of giving you the ability to introspect the context that you're using and how much you have left. The next command you definitely need to know about is to go down to the bottom and run Clear here, which clears the entire conversation history. Clear resets that context window back to zero. So it's kind of like you started up a whole new chat with Claude Code.

02:54 It's forgotten everything that you talked about in your last chat. Again, we're gonna be talking a lot about when to clear the context window, but this is how you do it. You either of course you can either just cancel out of code by pressing ctrl C twice and just starting up a new Claude session here or you can clear the current session by just running clear. Now finally how do you interrupt Claude when it's running? Well, I'm gonna ask it a question that's gonna take a little longer to answer, which is tell me about this code base here.

03:23 And anytime I want to, I can just press Escape to interrupt it. Once I've interrupted it, if I wanted to go again, I can just say go as well. And that was me literally just typing in the word go and sending it on its way again. And if I want to interrupt it again, I can just press escape and then it's stopped doing what it's doing. Okay, so we've learned how to add basic prompts inside here.

03:43 We've learned that we can do shift enter to add new lines. We've learned how to invoke commands with forward slash and using tab to get to the end of the command. We've learned how to run usage here to check our plan usage limits. We've learned how to run context here to visualize the current context. And we've learned how to clear the context with forward slash clear.

04:02 So I would say those are the basics done. Nice work, and I will see you in the next one.
