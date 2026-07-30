# The generic bootstrap — baseline manifest

**Canonical home**: `git@github.com:yarrow-love/claude-workflow.git`. Bootstrap development happens there; consuming repos adopt by re-copying the manifest set. Every file listed here belongs to the **project-generic, portable** agentic bootstrap: copy exactly this set to a new repo (plus the scaffold, below) and the system works there unmodified. Anything in `.claude/` **not** listed is project-specific by definition. `/initialize` audits the environment against the *Expectations* section.

Design rationale: [`.claude/ADR.md`](ADR.md) — the decision register; the full working history lives on tagged mission branches, reachable through the register's provenance pointers. Project-specific facts never live in `.claude/` — they live in `work/PROJECT.md` (the supplement) and root `CLAUDE.md` (architecture).

## Manifest

### Agents (`.claude/agents/`)

- `manager/CLAUDE.md` + `manager/workflows/` (all files)
- `executor/CLAUDE.md` + `executor/workflows/` (all files)
- `architect/CLAUDE.md` + `architect/workflows/` (all files)
- `researcher/CLAUDE.md` + `researcher/capabilities/` (all files)
- `planner.md`, `investigator.md`, `implementer.md`, `reviewer.md`, `inspector.md`, `designer.md`, `janitor.md`, `documenter.md`, `integrator.md`

### Commands (`.claude/commands/`)

- `plan.md`, `execute.md`, `design.md`, `clean.md`, `triage.md`, `investigate.md`, `research.md`, `document.md`, `close.md`, `archive.md`, `initialize.md`

### Protocols (`.claude/protocols/`)

Cross-agent operational protocols: procedures more than one role enacts, stated once and pointed at from role cards rather than restated in each.

- `codebase-graph.md` — working against the codebase knowledge graph: freshness verification, wedged-store recovery, evidence-passing dispatch, and the consuming seam those procedures read.

### Tooling (`.claude/bin/`)

- `.claude/bin/session-archive`, `.claude/bin/consult`, `.claude/bin/commit-guard`, `.claude/bin/reference-gate`, `.claude/bin/warmth-keeper`, `.claude/bin/package.json`

Workflow tooling lives *inside* the bootstrap — it travels with the copy, and its packaging file stays in its directory (nothing leaks to the repo root). The `package.json` `bin` map is the executable interface: run the scripts directly (`.claude/bin/consult …`) or `bun link` from `.claude/bin/` to put `consult` and `session-archive` on PATH.

### Settings skeleton (`.claude/settings.json`)

Baseline keys: `permissions.allow` entries `Bash(claude:*)` (child-session dispatch + consults), `Bash(ast-grep:*)`, `Bash(sg:*)`; the `SessionEnd` archive-on-stamp hook (`bun run "$CLAUDE_PROJECT_DIR/.claude/bin/session-archive" --from-hook`); the `Stop` follow-through backstop hook (`bun run "$CLAUDE_PROJECT_DIR/.claude/bin/commit-guard"` — blocks a stop that stranded close-out artifacts; loop-guarded so a paused session is nudged once, not re-nagged); the `env.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` dispatch-depth cap, pinned to `"2"` (it **caps, does not enable** — on the pinned CLI subagent nesting is default-ON and deep; the var *restricts*, and at the cap a subagent is simply not granted the Agent/Task tool, structurally and without error; `"2"` encodes the dispatch ladder exactly — root session → Manager → specialists — and pins that against platform default flips, the blast-radius principle applied to dispatch). **Project decisions, not baseline**: `defaultMode` (this repo runs `bypassPermissions` — an operator trust choice, re-decide per repo).

### Root of `.claude/`

- `BASELINE.md` — this manifest.
- `ADR.md` — the decision register: founding determinations, per-mission decisions, standing hazards. Append one block per mission; it travels with the copy and carries the same manifest rule as any other bootstrap file (adding, moving or removing it updates this file in the same commit).

## Bootstrap procedure (new repo)

1. Copy the manifest set into `<repo>/.claude/`.
2. Scaffold the work system: `work/{README.md,todos/{README.md,bugs/,_done/,_cancelled/},proposals/{README.md,_deferred/,_rejected/,_enacted/},milestones/README.md,missions/README.md,design/{README.md,system/README.md,sessions/README.md},footguns/README.md,notes/README.md,runbooks/README.md,sessions/README.md}` — copy the READMEs and stubs from the template; they are project-generic (the design/footguns/milestones stubs are instructive mandates for directories that start empty). Also copy:
   - `src/README.md` — the source-layout convention: root reserved for `docs`/`work`/`src`; sub-codebases as `src/<subsystem>/`; retirement to `src/_archive/`, a convention path created on first retirement.
   - `docs/{README.md,research/README.md}` — the documentation surface; `/research` writes its reports into `docs/research/`, so the scaffold must exist before the first run.
   - `.archive/README.md` — the repo-local cold-storage convention (material that leaves the working tree but not the repo).
   - the root `.cbmignore` — the index whitelist.

   One adaptation: the copied `work/README.md`'s machine registry starts over — replace the row(s) with the new project's machine(s).

   **The governing invariant**: this enumeration and the template's purification keep-column are *identical sets*, less the `.claude/` manifest (step 1) and the root keystone documents the template carries but a consuming repo re-authors — `CLAUDE.md`, `README.md`, `.gitignore` (step 3). Those three are enumerated here as the exception precisely so the equation stays exact and auditable: step 2 ∪ step 1 ∪ {`CLAUDE.md`, `README.md`, `.gitignore`} = the keep column, exactly. A file that survives purification and is not covered above is a manifest gap.

   **Paths that post-date the scaffold** — created by convention as work begins, so absence is *not* a gap and reference gates must sanction it: `work/PROJECT.md` (authored at step 3), `work/MISSION.md` (at `/plan` mission tier), `work/todos/BACKLOG.md` (at the first `/triage`), `work/sessions/MANIFEST` (created by the first archive sweep), the `work/design/` contents — DESIGN.md, system/, sessions/ (at the founding `/design`; the READMEs are scaffolded), `src/_archive/` (created on first retirement), `tmp/*` (gitignored runtime scratch). **This list is the template default, stated in prose; it is not what tooling reads.** The machine-read declaration is `work/PROJECT.md` § Structure — see step 3 for the layering — so a project extends the set by amending its declaration, and an editor of this list keeps the two in step.
3. Author the two keystone documents the copy never carries: `work/PROJECT.md` (the supplement — per-project; the template repository's own is the shape exemplar) and root `CLAUDE.md` (architecture source of truth). A root `README.md` and `.gitignore` are likewise the consuming repo's own.

   **The § Structure schema.** The supplement must carry the project's structure declaration — the seam the declared-structure floor reads (`work/README.md` § The declared-structure floor). Its headings and bullet grammar are a **parser contract** — tooling reads this section, so use the heading strings verbatim: `## Structure`, with subsections `### Root-file allowlist`, `### Product / non-product boundary`, `### Package roots`, `### Archive conventions`, `### Sanctioned absences`, `### Reference-gate scope roots`, `### Reference-gate exclusions`, `### Planning-artifact roots`. Within a subsection, each declared path is a `- ` bullet whose **first inline-code span is the path** (a trailing glob is permitted; a `<…>` segment marks a path component the project fills in); prose after it is commentary, ignored by tooling. Template defaults, which a project amends rather than invents:
   - **Root-file allowlist** — the scaffold's own root set: `CLAUDE.md`, `README.md`, `.gitignore`, `.cbmignore`, `.archive/`, `.claude/`, `docs/`, `src/`, `work/`, and gitignored `tmp/`. The amendment rule: **ecosystem-forced files are declared, not fought** — when a toolchain pins a manifest or config to the root, the project adds it to its allowlist rather than relocating it.
   - **Product / non-product boundary** — rule-only, no default: what ships is never portable, so the project states what its shipped artifact is and where it lives, versus what merely supports it.
   - **Package roots** — rule-only, no default: the project declares every directory allowed to carry a packaging manifest. The bootstrap itself carries exactly one (`.claude/bin/package.json`); ecosystems that pin manifests to the root declare that under the allowlist above.
   - **Archive conventions** — default: `work/missions/<v>/` for closed missions, `src/_archive/` for retired sub-codebases, `.archive/` for repo-local cold storage.
   - **Sanctioned absences** — default: the post-scaffold paths named in step 2; a project amends by adding what its own commands lazily create. **The layering**: step 2 is the portable template default in human prose; this section is the project's machine-parsed declaration; tooling (`reference-gate`) reads **only** § Structure. Step 2 is bootstrap guidance, never a parse target — so a divergence between the two is a declaration-amendment question, not a tie to break.
   - **Reference-gate scope roots** — default: the repo root plus the scaffold's organizational roots — `./`, `.claude/`, `work/`, `docs/`, `src/` — the prefixes under which a written path counts as a tree reference. The `./` entry is the root itself: root-level tracked markdown is scanned, while the directory entries are the extraction prefixes. Gitignored scratch is deliberately out of scope — the scan set is tracked files, and ignored scratch is runtime coordinates, not tree content.
   - **Reference-gate exclusions** — default: `work/proposals/` and `work/notes/` — historical and pre-decision material is never rewritten, so gating it would manufacture permanently-unfixable failures. A project amends by the rule, not by treating the list as arbitrary.
   - **Planning-artifact roots** — default: `work/todos/`, `work/milestones/`, `work/MISSION.md`, `work/design/` — the containers whose references are *temporal*, because a plan naming a path it will create is correct and a not-yet-built path is indistinguishable from a since-archived one. An unresolved reference written inside them warns; it never fails.
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
- **Codebase graph index** (codebase-memory-mcp) — **the repo-side expectation, governed as a unit by the consuming seam**: `work/PROJECT.md` § Codebase graph declares whether it applies. A `None` declaration renders this whole expectation **inapplicable per declaration** — a distinct honest status, neither pass nor fail — except that the root `.cbmignore`'s **existence** stays unconditional (bootstrap-mandated, on the root-file allowlist) — only its conformance audit goes inapplicable — as does the `.codebase-memory/` `.gitignore` policy below, which is defence-in-depth for the opt-in export artifact and not an applicability claim. A **missing** § Codebase graph section reads **FAIL, never `None`** — an unanswered supplement question is a failure, not a declaration. (The machine-side check — codebase-memory-mcp in the user-scope MCP set above — stays unconditional: capability is per-machine, applicability per-repo.) Where the declaration names an indexable surface: the repo indexed — `codebase-memory-mcp cli index_repository --repo-path <repo>`. **Where the store lives**: outside the repo, in a per-user cache directory — in the documented flow no index artifact is ever written into the tree. The exception, acknowledged: an opt-in export mode can write a repo-local graph artifact for team-sharing bootstraps, and this bootstrap never invokes it. Policy, stated as policy: graph artifacts are **never committed**, and `.codebase-memory/` stays in `.gitignore` as defence-in-depth for that opt-in case — not as a description of where the index lives (reindexing is cheap; no binary artifacts in git). **Index surface — live source only**: the committed root `.cbmignore` (gitignore syntax, layered over `.gitignore`) whitelists `src/` subdirectories and excludes everything else, including `src/_archive/` (retired sub-codebases — convention: `src/README.md`); one project at the repo root, never per-subsystem (cross-subsystem edges are the monorepo's value). **Freshness is verified, never inferred** — not from the presence of an index row, not from `head_sha`, not from `index_status`; the verification recipe is `.claude/protocols/codebase-graph.md` § Verifying freshness, and `auto_watch` is the background refresher, unreliable on bulk moves and renames. **Store health** is observable read-only by the wedge canary — a `.db-wal` far larger than its `.db` — at the store location the consuming seam declares (`work/PROJECT.md` § Codebase graph); recovery is `.claude/protocols/codebase-graph.md` § Recovering a wedged store. Read-heavy roles (researcher, investigator, planner, reconnaissance) prefer graph queries over grep fan-outs when the MCP is present, on the trust model `.claude/protocols/codebase-graph.md` § Evidence-passing dispatch states.
- **Files**: `work/PROJECT.md` present and answering the supplement questions (quality gate, structure declaration — § Structure, front-end surface, codebase-graph seam — § Codebase graph, runtime evidence, library list, doc surface); root `CLAUDE.md` present; the `work/` scaffold complete.
- **Settings**: every hook in `settings.json` points at an existing file; baseline permission entries present; the `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` env cap present and `"2"`.
- **Git hygiene**: secrets patterns and large-format assets gitignored; `tmp/` gitignored.
- **Retention**: CLI transcript `cleanupPeriodDays` raised so the local cache outlives a campaign.
