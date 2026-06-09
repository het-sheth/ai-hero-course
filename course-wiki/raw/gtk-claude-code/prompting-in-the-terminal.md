# RAW — Prompting In The Terminal (Getting To Know Claude Code, 02.03)

> Immutable source material for [[gtk-claude-code/prompting-in-the-terminal]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 2:25.

## Lesson page content
When working with Claude Code, you'll want to give Claude exactly the right context to succeed. The better you can reference files, manage your prompts, and provide visual context, the better results you'll get. This lesson covers several practical techniques to improve how you communicate with Claude in the terminal.

Referencing Files With The @ Symbol:
- When you want Claude to focus on specific files, use the @ symbol to reference them directly.
- Type @ and start typing a filename — autocomplete suggestions appear (e.g. typing @routes might show routes.ts).
- Navigate suggestions with the arrow keys; press Tab to select a file.
- Add multiple files by repeating the process (type @ again for each).
- Example prompt: `Tell me about @routes.ts and @schema.ts` — when you run it (Return), Claude automatically reads both files into the context window. This saves Claude from finding them manually and gives it exactly what it needs.

Stashing Commands With Control+S:
- Sometimes you're working on a complex prompt but realize you need to ask Claude something else first. Instead of losing your work, stash it.
- Write a detailed prompt, press Ctrl+S to stash it. Your prompt is saved in Claude's memory and won't be submitted.
- Type a new prompt and press Return to submit it (e.g. `@myfile.ts - why is this broken?`).
- After Claude responds, your stashed prompt automatically reappears; press Return to submit it.
- Especially useful when you need to give Claude feedback, realize you need to provide more context first, and don't want to lose your original detailed instructions.

Clearing Stashed Commands:
- If you stash a prompt and decide you don't need it, press Ctrl+C to clear the stashed command. The prompt is removed and you're back to a blank input field.

Adding Images To Your Prompts:
- Claude can analyze images — useful for visual designs, screenshots, or other image content.
- Copy an image (right-click → "Copy image").
- Click in the Claude Code input field and paste (Ctrl+V / Cmd+V on Mac).
- Type your prompt below or above the image (e.g. `What location is this? Tell me about it.`), press Return; Claude analyzes the image and responds.
- Note: Image pasting works on most systems, but may not work on Windows Subsystem for Linux (WSL).

## Full video transcript
00:00 Now we understand the basics about Claude Code, I want to give you some nice little tips that you can use to improve your prompting. You may want to reference individual files when you're using Claude Code. For instance, you may want to say, tell me lots of information about this file or make some changes to this specific file. To do that, you can use the at command and start typing inside here. For instance, I might want something inside the roots.ts file and it's just right here.
00:22 So I can auto-complete by pressing up and down on the keyboard. When I want to select something, I can press tab here. And of course, If I want to add another file, I can just go through that process again where I can say app and then db and let's see what's in here. Maybe db schema is what I need so I tab and I complete there. When I then run this by pressing return, these files will be automatically read into the context window here.
00:45 This means that it doesn't need to go and find those files manually, it's just read them automatically. This does cost you a little bit of upfront time, in other words having to find these files, but it is worth it because it gives Claude exactly what it needs to succeed. One other tip you might not know about, even if you've been using Claude code for a while is if you have a big prompt here and you want to let's say not do this now but do it later you can press ctrl s and it will stash it. This is now stashed my command inside Claude's memory here and I can now submit another command let's say hello like this and it will then rehydrate and sort of come back to me here. So again I can stash with control S, I can submit something says I'm good, thanks, and when I submit it will then restore after that.
01:30 This is really useful when you're giving Claude some feedback, let's say on some code that it's not done very well, and then you realize, oh, I just need to tell it something first, stash my current command, bring it back later. If you then realize, oh, I don't need this command at all, you can press Ctrl C and get rid of it. One other really sweet thing you can do is you can copy and paste images into Claude Code. I've got this lovely image of Lake Bled in Slovenia. I can right click it, copy the image and go to Claude Code.
01:54 And if you copy and paste it in, it can then reference that image. Annoyingly, I'm on Windows Subsystem Linux and this doesn't actually work on WSL, but if you try it for yourself and press return, then it should be able to tell you where am I in the world and it should tell you Lake Bled in Slovenia. Pretty cool. So to summarise them, we've covered referencing particular files with this at symbol here. We've covered stashing with Control S and we've covered pasting in images which I'm kind of gutted not to be able to show you.
02:19 And hopefully you were able to follow along clearly and nothing went wrong or did anything weird. Nice work and I will see you in the next one.
