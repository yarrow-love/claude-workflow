# Project supplement — claude-workflow

Operational facts for agent roles working **on this repo** (the canonical workflow bootstrap). This file doubles as the shape exemplar for authoring a new project's supplement. Work-system conventions: [`work/README.md`](README.md).

## All roles

- **What this is**: the canonical, project-generic Claude agentic workflow — `.claude/` is the product, `work/` is its own live work system. See root `CLAUDE.md` for the two-hats rule (genericity is the acceptance test for `.claude/` changes).
- **Quality gate** (documentation-and-tooling repo — the gate fits the artifact):
  1. Reference resolution — `bun .claude/bin/reference-gate check`. The engine reads its scope roots, exclusions, planning-artifact roots and sanctioned absences from § Structure below; it holds no project facts of its own, so amending the axis means amending the declaration, never the script. Two reference classes, and the distinction is the doctrine the gate exists to enforce: **tag-qualified `<ref>:<path>` expressions are provenance data, not tree references — the gate checks the tree, tags carry history.** Provenance is now checked too, resolved against the ref it names, warning rather than failing on refs not yet cut (`.claude/ADR.md` forward-cites the open mission's close tag by design). Semantics: **failures block**; warnings surface and are read at janitor passes, never blocking — an unresolved reference inside a planning-artifact root is a plan naming a path it will create, not drift. Provenance pointers should still be written as complete `git show <ref>:<path>` expressions as a matter of style, but the engine also recognizes the bare `<ref>:<path>` form defensively, so the doctrine no longer rests on the writer's discipline alone.
  2. Tooling smoke test — `bun .claude/bin/session-archive`, `bun .claude/bin/consult` and `bun .claude/bin/reference-gate` with no args print usage and exit 1; `bun .claude/bin/commit-guard` from an interactive terminal (TTY) prints usage and exits 1, and on empty or invalid stdin exits 0 silently (the backstop never breaks a session); `cd work/sessions && sha256sum -c MANIFEST`. `consult` also carries **exit 5 — read-only boundary violation**: a tool outside its `Read`/`Grep`/`Glob` allowlist executed successfully during the fork. The answer is still written to stdout and a loud `BOUNDARY VIOLATION:` line precedes the usage line on stderr; 5 is distinct from 1 so "you called me wrong" and "the boundary was breached" are never the same byte. The warning fires on every exit path, degrade paths included — where an answer never reached stdout, degrade's own exit 3 stands with the warning already emitted.
  3. `/initialize` passes (the full audit; BASELINE integrity, hooks resolve, scaffold conformance).
- **Session callbacks**: stamp per `work/README.md` § The callback grammar. Machine: `play`.
- **Footgun ledger**: [`work/footguns/`](footguns/README.md) — empty; an empty ledger is the normal starting state, not a gap, and the directory listing is the index (`work/footguns/README.md`). Mission v3.memory-protocol's two entries archived to `work/missions/v3.memory-protocol/footguns/`.
- **Toolchain**: `bun` (the `bin/` scripts are bun scripts; `.claude/bin/package.json` is the executable interface).

## Structure

The declaration the declared-structure floor reads (`work/README.md` § The declared-structure floor), authored against the schema in `.claude/BASELINE.md` bootstrap step 3 — this section doubles as that schema's exemplar.

### Root-file allowlist

Tracked:

- `CLAUDE.md` — agent entry (harness-fixed name)
- `README.md` — human onramp
- `.gitignore`
- `.cbmignore` — graph-index whitelist
- `.claude/` — the product (manifest: `.claude/BASELINE.md`)
- `.archive/` — repo-local cold storage; convention-created, scaffolded with its README
- `docs/` — knowledge container
- `src/` — source container
- `work/` — process container

Present by convention, ignored by policy (declared so they do not read as undeclared drift):

- `tmp/` — gitignored scratch / runtime stream logs

### Product / non-product boundary

- `.claude/` is the shipped artifact — the project-generic bootstrap manifested by `.claude/BASELINE.md`; genericity is its acceptance test (root `CLAUDE.md`). Everything else — `work/`, `docs/`, `src/`, the root keystones — supports its development and is project-shaped by design.

### Package roots

- `.claude/bin/` — the sole sanctioned package root (`.claude/bin/package.json`). Nothing else may carry a packaging manifest; "no packaging leaks to root" is this repo's instance of the axis.

### Archive conventions

- `work/missions/<v>/` — closed missions, archived whole and in-tree on `dev` (since the v2 close); design history also reachable through `<v>-closed` tags
- `src/_archive/` — retired sub-codebases, created on first retirement
- `.archive/` — cold storage: material that leaves the working tree but not the repo

### Sanctioned absences

The authoritative sanctioned-absence list, read by `reference-gate` — quality-gate item 1 (§ All roles) invokes the gate rather than restating it. Created by their commands, not scaffolded:

- `src/_archive/` — at first sub-codebase retirement
- `tmp/*` — runtime stream logs; **not consumed by the reference gate** — `tmp/` left the scope roots below, so no `tmp/`-prefixed string is ever extracted as a tree reference. Declared for the cleanliness and scaffold axes, which do read it
- `work/MISSION.md` — at `/plan` mission tier
- `work/PROJECT.md` — authored at bootstrap step 3 — absent in a bare template tree
- `work/todos/BACKLOG.md` — at first `/triage`
- `work/sessions/MANIFEST` — at the first archive sweep
- `work/design/DESIGN.md` — at the founding `/design`
- `work/design/system/` — its contents, at the founding `/design`; the `README.md` is scaffolded
- `work/design/sessions/` — its contents, at the founding `/design`; the `README.md` is scaffolded

### Reference-gate scope roots

The prefixes under which a written path counts as a tree reference. The gate's scan set is tracked files, which is why gitignored scratch (`tmp/`) is absent: ignored scratch is runtime coordinates, not tree content.

- `./` — the repo root itself: root-level tracked markdown is scanned. The directory bullets below are the extraction prefixes
- `.claude/`
- `work/`
- `docs/`
- `src/`

### Reference-gate exclusions

- `work/proposals/` — historical record; rewriting is forbidden (root `CLAUDE.md`), so gating would manufacture permanently-unfixable failures
- `work/notes/` — pre-proposal scratch, same protection
- `work/missions/` — archived missions, in-tree on `dev` since the v2 close (26-07-26): frozen history under the never-rewritten rule, whose era-bound references would otherwise manufacture the same permanently-unfixable failures the tag-only model never scanned

### Planning-artifact roots

Containers whose references are **temporal**: a plan naming a path it will create is correct, and a not-yet-built path is mechanically indistinguishable from a since-archived one — both are simply absent. An unresolved reference written in these containers therefore warns, never fails.

- `work/todos/`
- `work/milestones/`
- `work/MISSION.md`
- `work/design/`

## Front-end surface (manager, inspector, designer, implementer)

- **None.** This repo has no application UI; `interface` scope does not occur, the inspector is never dispatched, and the designer's remit is limited to documentation shape. (In a consuming project, this section carries: the serve recipe, target URLs, auth bootstrap, test posture, the app-side token home, and the external design tool in use, per `designer.md` — the design container itself is fixed convention: `work/design/`.)

## Codebase graph

- **None.** This repo has no indexable `src/`, so no project is indexed here and the graph procedures never fire — read-heavy roles work from grep and file reads. (In a consuming project, this section records: the install variant in use; the store directory; the derived project name for the repo; the per-OS process-check and kill commands; the per-OS store-file delete command; a known-moved-path candidate for the flip check — a path a committed refactor removed, plus the path the code moved to, refreshed when it stops matching a recent refactor; and the refresher's log location. The procedures that read these values: `.claude/protocols/codebase-graph.md`.)

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
