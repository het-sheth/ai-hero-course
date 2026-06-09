# RAW — Permissions (Getting To Know Claude Code, 02.07)

> Immutable source material for [[gtk-claude-code/permissions]].
> Pasted by Het from the aihero.dev lesson page. Read, never rewrite.
> Source: https://www.aihero.dev/cohorts/ai-coding-for-real-engineers-with-claude-code-2026-04
> Lesson length: 4:15. NOTE: the video transcript was not included in the shared material — only the written page content below.

## Lesson page content

### Page content

Introduction: When working with an agent, you need to think about risk versus reward. Give Claude Code too much power and it might accidentally delete your entire file system. That's why Claude Code has a detailed permissions model that's very strict by default about what it allows the agent to do. You have complete control over what Claude Code can access: approve actions one at a time, create rules for entire categories of commands, and even share these permissions with your team so everyone gets the same safe setup.

Understanding the Permissions Flow:
- Run a safe command and observe it executes immediately without asking, e.g. `run echo hello`.
- Run a command that requires approval, e.g. `run a type check on the project`. Notice it now shows you: the exact command it wants to run, the reason it wants to run it, and three options: approve this time, approve all similar commands, or deny.

Working with Permission Files:
- Open `.claude/settings.local.json` in your project — this stores all the permissions you've granted. Look for a `permissions` property with `allow` and `deny` arrays.
- Add a permission manually to the `allow` array — edit the file to pre-approve a specific command (e.g. add `pnpm type check` to allow it without asking).
- Test it: ask Claude to `run pnpm type check` — it should execute without asking.

Creating Rules with Wildcards:
- Allow all commands in a category using wildcards — edit settings.local.json to replace a specific command with a wildcard pattern (e.g. change `pnpm type check` to `pnpm *` to allow all pnpm commands).
- Deny dangerous commands using the `deny` array — add a command to deny to prevent Claude from running it (e.g. add `bash git push` to block all git push commands, preventing accidental commits).

Sharing Permissions with Your Team:
- Rename `settings.local.json` to `settings.json` — changes the file from local-only to shareable.
- Commit `settings.json` to your repository — now any team member running Claude Code on this project automatically picks up these shared permissions without setting them up manually.

Working with Web Permissions:
- Ask Claude to fetch information from the web (e.g. `fetch information about react-router-typegen from the web`) — Claude Code asks for permission to search the web.
- Grant web search permission and observe the results — when you approve, Claude fetches the page and reports back. This permission also gets recorded in settings.local.json.

## Full video transcript
_Not captured — Het did not share the transcript for this lesson._
