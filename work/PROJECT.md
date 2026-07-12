# Project supplement — claude-workflow

Operational facts for agent roles working **on this repo** (the canonical workflow bootstrap). This file doubles as the shape exemplar for authoring a new project's supplement. Work-system conventions: [`work/README.md`](README.md).

## All roles

- **What this is**: the canonical, project-generic Claude agentic workflow — `.claude/` is the product, `work/` is its own live work system. See root `CLAUDE.md` for the two-hats rule (genericity is the acceptance test for `.claude/` changes).
- **Quality gate** (documentation-and-tooling repo — the gate fits the artifact):
  1. Reference resolution — every path referenced in `.claude/` resolves: `grep -rhoE '(\.claude/bin|work|docs|src|tmp)/[A-Za-z0-9._/<>-]+' .claude --include='*.md' | sed 's/[.,)`:]*$//' | grep -vE '<|>' | sort -u` and check existence. Sanctioned lazy-creates (created by their commands, not scaffolded): `tmp/*` (runtime stream logs), `work/MISSION.md` (at `/plan` mission tier), `work/todos/BACKLOG.md` (at first `/triage`), the design container (default `src/design/`, at the founding `/design` — and never in a repo without a UI).
  2. Tooling smoke test — `bun .claude/bin/session-archive` and `bun .claude/bin/consult` with no args print usage and exit 1; `cd work/sessions && sha256sum -c MANIFEST`.
  3. `/initialize` passes (the full audit; BASELINE integrity, hooks resolve, scaffold conformance).
- **Session callbacks**: stamp per `work/README.md` § The callback grammar. Machine: `play`.
- **Footgun ledger**: `work/footguns/` (empty).
- **Toolchain**: `bun` (the `bin/` scripts are bun scripts; `.claude/bin/package.json` is the executable interface).

## Front-end surface (manager, inspector, designer, implementer)

- **None.** This repo has no application UI; `interface` scope does not occur, the inspector is never dispatched, and the designer's remit is limited to documentation shape. (In a consuming project, this section carries: the serve recipe, target URLs, auth bootstrap, test posture, and the **design container location** — default `src/design/` — plus the external design tool in use, per `designer.md`.)

## Runtime evidence (investigator)

- The `bin/` scripts' stdout/stderr and exit codes; the `work/sessions/MANIFEST`; the harness's own behavior (which commands/agents load — visible in a fresh session's registry).

## Libraries (researcher, planner, implementer — Context7 list)

| Library | Context7? | Notes |
| --- | --- | --- |
| Claude Code (hooks, slash commands, agents, `claude` CLI flags, MCP) | prefer the `claude-code-guide` agent / official docs | The load-bearing dependency — verify harness behavior against current docs before relying on it |
| bun | yes | Script runtime; `node:` builtins used in `bin/` |

## Documenter

- **Doc surface, priority order**: root `CLAUDE.md` + `README.md` → `work/README.md` + `work/todos/README.md` (the canon) → `.claude/BASELINE.md` → directory READMEs.
- **Never touch**: `work/todos/_done/`, `work/proposals/` (historical record); `work/sessions/` (content-addressed archive).

## Integrator

- Trunk is `main`. Quality gate per All roles.
