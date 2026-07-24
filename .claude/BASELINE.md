# The generic bootstrap — baseline manifest

**Canonical home**: `git@github.com:yarrow-love/claude-workflow.git` (`~/dev/claude-workflow`). Bootstrap development happens there; consuming repos adopt by re-copying the manifest set. Every file listed here belongs to the **project-generic, portable** agentic bootstrap: copy exactly this set to a new repo (plus the scaffold, below) and the system works there unmodified. Anything in `.claude/` **not** listed is project-specific by definition. `/initialize` audits the environment against the *Expectations* section.

Design rationale: the project's design record under `work/`. Project-specific facts never live in `.claude/` — they live in `work/PROJECT.md` (the supplement) and root `CLAUDE.md` (architecture).

## Manifest

### Agents (`.claude/agents/`)

- `manager/CLAUDE.md` + `manager/workflows/` (all files)
- `executor/CLAUDE.md` + `executor/workflows/` (all files)
- `architect/CLAUDE.md` + `architect/workflows/` (all files)
- `researcher/CLAUDE.md` + `researcher/capabilities/` (all files)
- `planner.md`, `investigator.md`, `implementer.md`, `reviewer.md`, `inspector.md`, `designer.md`, `documenter.md`, `integrator.md`

### Commands (`.claude/commands/`)

- `plan.md`, `execute.md`, `design.md`, `triage.md`, `investigate.md`, `research.md`, `document.md`, `close.md`, `archive.md`, `initialize.md`

### Tooling (`.claude/bin/`)

- `.claude/bin/session-archive`, `.claude/bin/consult`, `.claude/bin/commit-guard`, `.claude/bin/package.json`

Workflow tooling lives *inside* the bootstrap — it travels with the copy, and its packaging file stays in its directory (nothing leaks to the repo root). The `package.json` `bin` map is the executable interface: run the scripts directly (`.claude/bin/consult …`) or `bun link` from `.claude/bin/` to put `consult` and `session-archive` on PATH.

### Settings skeleton (`.claude/settings.json`)

Baseline keys: `permissions.allow` entries `Bash(claude:*)` (child-session dispatch + consults), `Bash(ast-grep:*)`, `Bash(sg:*)`; the `SessionEnd` archive-on-stamp hook (`bun run "$CLAUDE_PROJECT_DIR/.claude/bin/session-archive" --from-hook`); the `Stop` follow-through backstop hook (`bun run "$CLAUDE_PROJECT_DIR/.claude/bin/commit-guard"` — blocks a stop that stranded close-out artifacts, soft-reminds on other dirty workflow paths; loop-guarded so a paused session is nudged once, not re-nagged). **Project decisions, not baseline**: `defaultMode` (this repo runs `bypassPermissions` — an operator trust choice, re-decide per repo).

### This file

- `BASELINE.md`

## Bootstrap procedure (new repo)

1. Copy the manifest set into `<repo>/.claude/`.
2. Scaffold the work system: `work/{README.md,todos/{README.md,bugs/,_done/,_cancelled/},proposals/{README.md,_deferred/,_rejected/,_enacted/},milestones/README.md,missions/,design/{README.md,system/README.md,sessions/README.md},footguns/README.md,notes/,runbooks/}` — copy the READMEs and stubs from this repo; they are project-generic (the design/footguns/milestones stubs are instructive mandates for directories that start empty). Also copy `src/README.md` (the source-layout convention: root reserved for `docs`/`work`/`src`; sub-codebases as `src/<subsystem>/`; retirement to `src/_archive/`, a convention path created on first retirement — reference gates must sanction its absence) and the root `.cbmignore` (the index whitelist). One adaptation: the copied `work/README.md`'s machine registry starts over — replace the row(s) with the new project's machine(s).
3. Author `work/PROJECT.md` (the supplement — per-project, use this repo's as the shape exemplar) and root `CLAUDE.md`.
4. Run `/initialize`; repair gaps (`/configure` once it exists).

## Expectations (`/initialize` audit targets)

- **Design hand-off transport** (projects with an external design tool): the `DesignSync` harness tool reachable with design scopes on the claude.ai login (`/design-login` for headless sessions); the linked design-system project recorded in `DESIGN.md` frontmatter (`design-project:`). Not an MCP — nothing to install; authorization is the gap `/configure` closes.
- **User-scope MCP servers** (always-useful set): `context7`, `playwright`, `chrome-devtools`, `codebase-memory-mcp`. Add-recipes:
  ```sh
  claude mcp add --scope user playwright -- npx -y @playwright/mcp@latest
  claude mcp add --scope user chrome-devtools -- npx -y chrome-devtools-mcp@latest
  # codebase-memory-mcp ships as a signed static binary; the official installer
  # auto-configures Claude Code. Operator-run — verify the release signature first
  # (https://github.com/DeusData/codebase-memory-mcp/releases):
  curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
  ```
- **Codebase graph index** (codebase-memory-mcp): the repo indexed — `codebase-memory-mcp cli index_repository '{"repo_path": "<repo>"}'` — with `auto_index` keeping it fresh (`codebase-memory-mcp config set auto_index true`). Index policy: **local, gitignored** — `.codebase-memory/` joins `.gitignore` (reindexing is cheap; no binary artifacts in git). **Index surface — live source only**: the committed root `.cbmignore` (gitignore syntax, layered over `.gitignore`) whitelists `src/` subdirectories and excludes everything else, including `src/_archive/` (retired sub-codebases — convention: `src/README.md`); one project at the repo root, never per-subsystem (cross-subsystem edges are the monorepo's value). Read-heavy roles (researcher, investigator, planner, reconnaissance) prefer graph queries over grep fan-outs when the MCP is present.
- **Files**: `work/PROJECT.md` present and answering the supplement questions (quality gate, front-end surface, runtime evidence, library list, doc surface); root `CLAUDE.md` present; the `work/` scaffold complete.
- **Settings**: every hook in `settings.json` points at an existing file; baseline permission entries present.
- **Git hygiene**: secrets patterns and large-format assets gitignored; `tmp/` gitignored.
- **Retention**: CLI transcript `cleanupPeriodDays` raised so the local cache outlives a campaign.
