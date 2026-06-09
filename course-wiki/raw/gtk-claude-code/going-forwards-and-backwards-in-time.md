# RAW — Going Forwards And Backwards In Time (Getting To Know Claude Code, 02.05)

> Immutable source material for [[gtk-claude-code/going-forwards-and-backwards-in-time]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 3:04.

## Lesson page content

Introduction: Claude Code lets you navigate your conversation history like you're moving through time. Made a change you want to undo? Just ask Claude to revert it. Need to go back further? You can rewind your entire session to any previous point. This is useful when experimenting — try something, and if it doesn't work, step back without losing your conversation history. Claude also persists all your sessions locally, so if a session gets interrupted you can resume exactly where you left off.

Understanding Rewind Mode:
- Make a change to your codebase (ask Claude to add a file, modify code, or remove something).
- Ask Claude to revert the change ("revert that, please") and watch it undo what it just did.
- Press Escape twice to enter rewind mode — opens your conversation history showing every step. The current state is at the bottom; earlier interactions are above.
- Select a previous point with the arrow keys, press Enter to select.

Choosing What To Restore — when you select a point, Claude Code gives three choices:
| Option | What It Does |
| Restore code and conversation | Rewind your entire session to that point |
| Restore conversation only | Keep the conversation, but reset the code |
| Restore code only | Keep the code as-is, but rewind the conversation |
- "Restore code and conversation" is the most common choice — back to exactly how things were before that change.
- Exit rewind mode if you change your mind: press Escape or select "Nevermind" to stay at the current point.

Pausing And Resuming Sessions:
- Quit Claude Code with Ctrl-C twice — stops the session, but Claude remembers everything.
- Resume your exact session with the resume command Claude outputs: `claude resume <uuid>`.
- Alternatively press Ctrl-C twice again, then start a fresh session by typing `claude`.
- Use `/resume` in a fresh session to browse all your previous conversations in this repository; type to filter; press Enter to jump back into a session (code + conversation intact).

Testing Session Persistence:
- Make a change, exit with Ctrl-C twice, run `claude --continue` to resume your exact session (a shortcut that puts you right back without copying the UUID). Verify code and conversation are exactly as you left them.

## Full video transcript

00:00 One really important thing that Claude Code allows you to do is go backwards and forwards in the conversation. This is really important for when you're trying something out that maybe you later want to revert. For instance, in the previous video, we just did a change where we removed a dev script. Now, what I could say to Claude is just revert that please and it will go and undo the change that it just did before by just rewriting, re-adding it back in. I'm just going to accept this by pressing Control S to save the diff.
00:29 But there's another option here. I can press Escape, escape in quick succession to enter rewind mode. And in rewind mode I get to restore the code and or the conversation to this point. For instance if I just want to revert the command that I just did I can just choose this one. This one at the bottom is the current state, This one is the point at which I said revert that please and so I can select it with enter.
00:51 Now there's a few different options here that I can choose. The first one will be to restore the code and the conversation. In other words to just rewind my session to the point before this code edit was made. Or I could restore the conversation, but keep the code as it was, that would be number two. Or I could restore the code, but keep the conversation how it is.
01:09 The one I choose most often is just to restore the full code and conversation, so I'll do that now. And we can see that the code has been reverted. So now we are back to the point at which we had TestWatch deleted. If I want to go back further, I can open up the terminal again and just press escape twice to go back further. And let's choose we go back to the point where we remove the TestWatch command completely.
01:31 Another interesting option is this summarize from here command, but we'll talk about that later. I'm actually gonna cancel this by choosing nevermind and just sticking to the current state. One other thing that's also really important is the fact that Claude actually persists its sessions locally. What this means is you can quit out of Claude by pressing Control C twice and then you can resume it in a bunch of different ways. You can either resume the session by running this command directly that you get from the output of the previous command.
01:59 So I can just run Claude resume and then the UUID and then I just go back into the exact state that I left previously. Another way of doing this is if I can just Control C twice again to exit, and I open up a new session just by typing Claude. This one is a totally clear session. Inside here, I can press forward slash resume and resume a previous conversation and now I get to choose all of the conversations that I've had here. I can even search through all of the sessions that I've had in the repo if I want.
02:27 Let's go back to the one that we were just using and I can press return to go into that. And again, I'm back in that same session. So if your session is interrupted for any reason, then you can always resume it because Claude persists it locally. So that's how Claude allows you to go backwards and forwards in the conversation, either by entering rewind mode by pressing double escape and just kind of like zooming through all of the content here. Or I can cancel out of this and restart my session anytime.
02:52 I can even just choose to resume the previous session by running Claude hyphen hyphen continue. And again, this pulls me into exactly where I was. Beautiful. So, very nice work and I will see you in the next one.
