# RAW — Showing Context In The Status Line (Day 1 Fundamentals, 03.06)

> Immutable source material for [[day-1-fundamentals/showing-context-in-status-line]].
> Pasted by Het from the aihero.dev lesson page (notes + full transcript). Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 3:35.

## Lesson page content

Claude Code doesn't show your context window usage by default. You need to set this up yourself if
you want to monitor it constantly while coding. Having that number in your status line, visible at a
glance, gives you the feedback you need to make good decisions about your session. The lesson uses
**ccstatusline**, a community tool that formats Claude Code's session data into a clean status line.

### Configure ccstatusline
- Create the config dir: `mkdir -p ~/.config/ccstatusline`
- Create `~/.config/ccstatusline/settings.json` with this content:

```json
{
  "version": 3,
  "lines": [
    [
      { "id": "1", "type": "context-length", "color": "yellow", "bold": true, "rawValue": true },
      { "id": "2", "type": "custom-text", "customText": "(", "color": "brightBlack", "merge": "no-padding" },
      { "id": "3", "type": "context-percentage", "color": "brightBlack", "rawValue": true, "merge": "no-padding" },
      { "id": "4", "type": "custom-text", "customText": ")", "color": "brightBlack", "merge": "no-padding" }
    ],
    [],
    []
  ],
  "flexMode": "full-minus-40",
  "compactThreshold": 60,
  "colorLevel": 2,
  "defaultSeparator": " ",
  "inheritSeparatorColors": false,
  "globalBold": false,
  "powerline": {
    "enabled": false,
    "separators": [" "],
    "separatorInvertBackground": [false],
    "startCaps": [],
    "endCaps": [],
    "autoAlign": false
  }
}
```

This configures four widgets on one line: a bold yellow token count (`context-length`), followed by
a dimmed percentage in parentheses. `"merge": "no-padding"` on the parens/percentage glues them
together; `"defaultSeparator": " "` adds a space between the token count and the opening paren;
`"rawValue": true` strips the labels so you get clean numbers.

### Update Claude Code Settings
- Open `~/.claude/settings.json` (create it if it doesn't exist).
- Add the status line configuration (preserve any existing settings):

```json
{ "statusLine": { "type": "command", "command": "npx ccstatusline@latest" } }
```

Claude Code pipes session data to this command automatically — ccstatusline reads it and outputs the
formatted status line.

### Test Your Setup
- Restart Claude Code completely (close fully and reopen).
- You should see a bold yellow token count followed by a dimmed percentage (like `186.2k (17.3%)`).
  These update as your context window fills.

## Full video transcript

00:00 One thing that drives me crazy about Claude Code's default UI is how hard it is to monitor the context usage as you're using Claude Code. If you look at other tools in the space like Cursor or OpenCode, they're really, really clear about what your context percentage usage is at any time. And so that makes it really simple to stay in the smart zone because you're able to see when you're going over 40%. In the previous exercise we had to exit out of plan mode, get out of our flow in order to run forward slash context, in order to see it, it was just gross. But fortunately Claude Co gives us the ability to customize what we see in our UI via a status line.

00:36 And I'm going to be showing you how to use a community package in order to get the context window usage in your viewpoint at all times. So just like me, you can max out on context window paranoia. The first thing I'd like you to do is to clear your context window with forward slash clear here and then use shift tab to cycle between all of the different modes until you just reach the default mode. So again shift tab just tapping between all of these different modes until you see the kind of like question mark for shortcuts button. Now what I'd like you to do is go to the page below where there should be a copy as markdown button.

01:09 And I'd like you to copy the entire article below into your clipboard so you can paste it into Claude Code. Once you paste it in, you should see something like this, pasted text number one with 80 lines. There might be more or less if I've edited the instructions since. Next, you can go ahead and just press Return here. And then it will begin walking through the instructions in the article to set up this package for you.

01:31 This will set this up inside your global Claude installation. Not inside the project, but inside your global Claude directory where you have your personal user settings, not the ones for your project. I'm going to accept this first command where it's making a directory and then I'm going to allow it to read from .clawed during this session. .Clawed is where my user settings for Clawed are stored. So I'm going to allow it to do that.

01:53 It's now asking to make an edit from inside VS Code up here to add a status line part to the settings.json up here. This looks good to me, so I'm going to press save here and that should allow the diff. It then went through and wrote a CC status line settings dot JSON to. And actually even before I've restarted Claude code, I can see there is now a context window usage down here just below my prompt. But just because the instructions tell me to, I'm going to cancel out of that, press Control C twice to exit.

02:23 Now I'll open up a new session here just by typing Claude. And I should see that my context window starts at 0.0%. Since I recorded this video on status lines, Anthropic announced a one million context window for Opus 4.6 and Sonic 4.6, which means our previous reliance on percentages just isn't quite right anymore. So instead of showing the percentage, I've now changed the instructions below so that they show this. They show the raw token count here followed by the percentage in dimmed little brackets there.

02:53 This is annoying because like for the rest of the course you're going to see me using percentages in the videos, but instead you will have this little display down there. For your SmartZone, DumbZone calculations you should start getting worried when this number reaches about 80, 000 to 100, 000 tokens. And if you want to do some mental maths to figure out exactly what I'm on in the video then remember that I recorded it with a 200k token limit. So for me 40% is around 80k tokens. So this context window number will update as we go through sessions and will allow you to keep a really really close eye on what is happening inside your context window at any time.

03:28 If you had any issues with the setup then please go to the discord to figure out how to solve them. Nice work and I will see you in the next one.

## Het's note (from this session — not course material)

I don't use ccstatusline; I have a custom `~/.claude/statusline-command.sh` that already shows
`ctx`, plus 5h/7d rate-limit bars, model, branch, and workdir. On 2026-06-13 I had Claude edit it to
match this lesson's idea: show context as **tokens then percentage** (e.g. `ctx:186.2k (17.3%)`) and
reorder to `model · ctx · 5h · 7d · branch · workdir`.
