# The generic bootstrap — baseline manifest

Every file listed here belongs to the **project-generic, portable** agentic bootstrap: copy exactly this set to a new repo (plus the scaffold, below) and the system works there unmodified. Anything in `.claude/` **not** listed is project-specific by definition. `/initialize` audits the environment against the *Expectations* section.

Design rationale: `work/todos/_done/agentic-workflow/1.determinations.md` (det. 4). Project-specific facts never live in `.claude/` — they live in `work/PROJECT.md` (the supplement) and root `CLAUDE.md` (architecture).

## Manifest

### Agents (`.claude/agents/`)

- `manager/CLAUDE.md` + `manager/workflows/` (all files)
- `executor/CLAUDE.md` + `executor/workflows/` (all files)
- `architect/CLAUDE.md` + `architect/workflows/` (all files)
- `researcher/CLAUDE.md` + `researcher/capabilities/` (all files)
- `planner.md`, `investigator.md`, `implementer.md`, `reviewer.md`, `inspector.md`, `designer.md`, `documenter.md`, `integrator.md`

### Commands (`.claude/commands/`)

- `plan.md`, `execute.md`, `triage.md`, `investigate.md`, `research.md`, `document.md`, `close.md`, `archive.md`, `initialize.md`

### Tooling (`.claude/bin/`)

- `.claude/bin/session-archive`, `.claude/bin/consult`, `.claude/bin/package.json`

Workflow tooling lives *inside* the bootstrap — it travels with the copy, and its packaging file stays in its directory (nothing leaks to the repo root). The `package.json` `bin` map is the executable interface: run the scripts directly (`.claude/bin/consult …`) or `bun link` from `.claude/bin/` to put `consult` and `session-archive` on PATH.

### Settings skeleton (`.claude/settings.json`)

Baseline keys: `permissions.allow` entries `Bash(claude:*)` (child-session dispatch + consults), `Bash(ast-grep:*)`, `Bash(sg:*)`; the `SessionEnd` archive-on-stamp hook (`bun run "$CLAUDE_PROJECT_DIR/.claude/bin/session-archive" --from-hook`). **Project decisions, not baseline**: `defaultMode` (this repo runs `bypassPermissions` — an operator trust choice, re-decide per repo).

### This file

- `BASELINE.md`

## Bootstrap procedure (new repo)

1. Copy the manifest set into `<repo>/.claude/`.
2. Scaffold the work system: `work/{README.md,todos/{README.md,bugs/,_done/,_cancelled/},proposals/{_deferred/,_rejected/},milestones/README.md,missions/,footguns/README.md,notes/,runbooks/}` — copy the two READMEs and the footguns/milestones stubs from this repo; they are project-generic.
3. Author `work/PROJECT.md` (the supplement — per-project, use this repo's as the shape exemplar) and root `CLAUDE.md`.
4. Run `/initialize`; repair gaps (`/configure` once it exists).

## Expectations (`/initialize` audit targets)

- **User-scope MCP servers** (always-useful set): `context7`, `playwright`, `chrome-devtools`. Add-recipes:
  ```sh
  claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest
  claude mcp add --scope user chrome-devtools -- npx -y chrome-devtools-mcp@latest
  ```
- **Files**: `work/PROJECT.md` present and answering the supplement questions (quality gate, front-end surface, runtime evidence, library list, doc surface); root `CLAUDE.md` present; the `work/` scaffold complete.
- **Settings**: every hook in `settings.json` points at an existing file; baseline permission entries present.
- **Git hygiene**: secrets patterns and large-format assets gitignored; `tmp/` gitignored.
- **Retention**: CLI transcript `cleanupPeriodDays` raised (see `agentic-workflow/5`) so the local cache outlives a campaign.
