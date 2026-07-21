Audit the environment against the baseline expectations — **read-only**: every failure names its fix; this command performs nothing (`/configure`, the repair counterpart, is a deferred filing: `work/todos/26-07-11.configure-command.md`). Run after bootstrapping a repo, after importing/updating `.claude/`, or whenever agent behavior suggests a configuration gap.

## Checks

Audit each, against `.claude/BASELINE.md` § Expectations:

1. **Baseline integrity** — every file the BASELINE manifest lists exists in `.claude/`; list any `.claude/` file the manifest doesn't classify (project-specific additions are fine — unexplained strays are drift).
2. **Capabilities** — `claude mcp list` shows the always-useful MCP set: `context7`, `playwright`, `chrome-devtools` (missing → report with the exact add-command from BASELINE.md). If the project uses an external design tool (`work/PROJECT.md`): the **DesignSync harness tool** is reachable with design scopes granted (a `list_projects` read — the same preflight `/design` runs as its first action; a harness tool, not an MCP; no login → `/design-login`) and `DESIGN.md` frontmatter carries a `design-project:` id once founded.
3. **Hooks resolve** — every `hooks` entry in `.claude/settings.json` points at an existing, runnable file (`bun run <file>` parses).
4. **Keystone docs** — root `CLAUDE.md` exists; `work/PROJECT.md` exists and answers the supplement questions the agent docs ask of it (quality gate, front-end surface, runtime evidence, library list, doc surface — grep the agent docs for "supplement" mentions and check coverage).
5. **Work-system scaffold** — the `work/` layout matches `work/README.md`'s table (todos + bugs/_done/_cancelled, proposals + _deferred/_rejected/_enacted (+ README.md), milestones, missions, footguns, notes, sessions once populated); `work/todos/README.md` present.
6. **Git hygiene** — `.gitignore` covers: secrets patterns (`.env*`, keys), large-format assets (this repo: ephemeris data, catalogs, vendored clones), `tmp/`; `git status` is not carrying obviously-unintended files.
7. **Session durability** — `work/sessions/MANIFEST` verifies (`sha256sum -c`) if the store exists; stamped handles under `work/` have archives (the `/archive` sweep condition — spot-check, full sweep belongs to `/archive`); CLI transcript retention (`cleanupPeriodDays` in `~/.claude/settings.json`) is raised so the local cache outlives a campaign.
8. **Toolchain** — `bun` resolves (repo scripts are bun scripts).

## Report

A pass/fail table (check · status · fix-if-failing), followed by a one-line overall verdict. Be honest about partial passes — "present but unverifiable" is a distinct status from pass.
