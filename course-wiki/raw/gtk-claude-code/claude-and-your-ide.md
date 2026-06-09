# RAW — Claude And Your IDE (Getting To Know Claude Code, 02.04)

> Immutable source material for [[gtk-claude-code/claude-and-your-ide]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 1:57.

## Lesson page content
When working with Claude Code, you'll want it to integrate smoothly with your development environment. The IDE integration isn't just a nice-to-have — it shapes how you interact with Claude's output, especially managing code changes. The most useful part is how Claude Code handles diffs: instead of a hard-to-read terminal format, your IDE displays them in a rich, interactive way. You can scroll through files, review changes line-by-line, and even make tweaks before accepting them.

Set Up Your IDE Integration:
- Run the `/ide` command in Claude Code — shows your IDE connection status and guides installation if needed. The output tells you which IDE you're connected to and provides installation instructions for other supported IDEs (Cursor, Windsurf, others).
- Install the Claude Code extension for your IDE. Claude Code communicates with your IDE through an extension; for VS Code it's "Claude for VS Code". Follow the installation link from the /ide output.
- Press enter to confirm and close the IDE status check. Once installed and connected, your IDE is ready to handle diffs.

Experience Diff Management In Your IDE:
- Ask Claude to make a file change, e.g. `Remove the test watch command from package.json`.
- Watch Claude read and modify the file (reads package.json, proposes changes).
- Close the terminal diff view and observe the change in your IDE — instead of a confusing terminal diff, the proposed change appears directly in your editor (richer experience).
- Review the change in context (scroll, see surrounding code).
- Accept or modify: click "Accept Proposed Changes" in your IDE, OR manually edit the file and save to accept, OR reject and ask Claude to try again.

Understand When To Use IDE Integration:
- IDE integration primarily powers diff management — the feature that shows up most and delivers the most value.
- You can tweak Claude's output before accepting it (quick adjustments without re-running the prompt).
- Your IDE provides better visibility than the terminal (syntax highlighting, line numbers, file context).

## Full video transcript
00:00 Let's now talk about how Claude integrates with your IDE of choice. I'm using VS Code for this course, but you do not have to. You can use Cursor, you can use Windsurf, Antigravity, whatever fancy tools are available now. The way that Claude integrates with it is via this IDE command here, where it says you can manage the IDE integrations and show the status. If we run this, we can see that we are connected to Visual Studio Code.
00:22 I've got this working because I have installed the Claude code for VS Code extension here. But if you run IDE in your terminal here then it should show you how to install your version for your IDE that you're using. If you're following along, let's press Enter to confirm and get out of this. The IDE integration is really for diff management. That's the thing that comes up most often.
00:41 For instance, if we prompt Claude to say, remove the test watch command from package.json, We can see that it read one file, so it read the package.json, and now it's made an update to package.json. Now if we weren't connected to the IDE, then this would show as a diff inside the terminal, which is a little bit awkward. But since we're connected to VS Code, we can actually close this and we can see the diff in VS Code. This is really nice because this is much, much richer and it lets us actually scroll and see what's going on in the file and we can see that this is a decent edit. We can then either press this accept proposed changes up here or we can click inside here and save the file.
01:17 And by saving the file, we agree to the changes. This is the reason that I'm running Claude Code inside VS Code. It's really nice to be able to dive in sometimes and just tweak some things about Claude Code's output. And if I need to update any diffs or review any diffs, it's so much nicer doing that in a proper IDE than just doing it in the terminal. There are more features and there are more ways that VS Code integrates with Cloud Code and your IDE probably does too, but this diff feature was the one I wanted to show off because it's the one I end up using 99% of the time.
01:48 So hopefully you were able to follow along with that. Feel free to go back through the video if you weren't and ask any questions on the Discord if you ran into trouble. Nice work, and I will see you in the next one.
