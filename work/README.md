# The work system

`work/` is the **process** container: everything about how work is planned, executed, recorded, and archived. `docs/` is the **knowledge** container: reference material, research, architecture. The split is load-bearing — agents grep the working tree, so what lives here is always relevant to the *active* mission, and what has served its purpose archives into `work/missions/<v>/` rather than polluting the active workspace.

## Layout

| Path | Holds | Lifecycle |
| --- | --- | --- |
| `MISSION.md` | The active mission's charter (objective, scope, non-goals, success **and failure** criteria) | Written at mission open (`/plan` mission tier); archived at `/close` |
| `todos/` | Active work orders (+ `bugs/`, `_done/`, `_cancelled/`, `BACKLOG.md`, phased series subdirectories) | Convention: [`todos/README.md`](todos/README.md) |
| `proposals/` | Pre-decision design thinking (+ `_deferred/`, `_rejected/`, `_enacted/`) | Adoption is a decision (`status:` updates, file stays put while enacting work pends); enactment is a completion (the closer of the enacting work files to `_enacted/` with `status: enacted` + a `sessions:` stamp — [`proposals/README.md`](proposals/README.md)). At `/close`, `_enacted/` archives wholesale with the mission; standing proposals persist |
| `milestones/` | The active mission's phased roadmap (`<n>.<name>/` with `MILESTONE.md` + phase docs) | Archived whole at mission close |
| `missions/` | Closed missions, archived whole and in-repo (`<v>/` with `MISSION.md`, `closing.md`, and the mission's todos/milestones/proposals/design/footguns/runbooks/docs/sessions) | Append-only institutional memory; `missions/README.md` is the ledger |
| `design/` | The active mission's design authority: `DESIGN.md` (canon), `system/` (distilled assets), `sessions/<date>.<slug>/` (design sessions: `BRIEF.md` + outbound `current-state/` + returns) | Mission-versioned: README scaffolded, populated by the founding `/design` (an MVP mission may leave it empty); triaged at mission open (carried / redesigned / watch); archived at close |
| `footguns/` | The active mission's footgun ledger | Triaged at mission open (carried / designed-around / watch); archived at close |
| `runbooks/` | Operational procedure docs + operator-applied config payloads | Mission-versioned; triaged at open (carried / retired / watch) |
| `sessions/` | The durable transcript archive behind callback stamps (`<machine>/<uuid>.jsonl.gz` + `MANIFEST`) | Archive-on-stamp + `/archive` sweeps; moved into the closing mission's archive |
| `notes/` | Pre-proposal context: ideas not mature enough to propose, observations not settled enough to document | Operator scratch; graduates into proposals or evaporates |
| `PROJECT.md` | The project supplement: operational facts agents read (quality gate, front-end surface, runtime evidence, per-role notes) | Persists across missions; re-certified like a carried footgun |

Retired: `objectives/` — real objectives live in `todos/` and `milestones/`; proto-ideas in `notes/` and `proposals/`.

**The orientation-doc convention**: every tier's container carries one ALL-CAPS orientation document — root: `README.md` (human onramp) + `CLAUDE.md` (agent entry, harness-fixed name); `work/PROJECT.md` (project supplement); `work/MISSION.md` (active mission charter); `work/milestones/<n>.<name>/MILESTONE.md` (milestone index); `work/design/DESIGN.md` (design canon) and per-design-session `BRIEF.md`. The caps name marks "read this first for this tier." Lowercase `README.md` documents a *directory* (todos/, sessions/, footguns/), and artifacts (`closing.md`, phase docs) stay lowercase.

## The tier ladder

Every tier plans, works, and closes the same way, at its own scale:

| Tier | Unit | Planning artifact | Closing artifact | Closing mode |
| --- | --- | --- | --- | --- |
| work order | one feature / fix / refactor / chore | `## Implementation Plan` | `## Summary`, filed to `_done/` | criteria-closed (self-closing) |
| milestone phase | one campaign (≈ one Manager session) | phase doc `## Acceptance` | `## Addendum` | criteria-closed |
| milestone | one capability | `MILESTONE.md` + phase docs (`/plan <milestone>`) | index status + campaign log | criteria-closed |
| mission | one version | charter (`work/MISSION.md`) + settlement | closing report (`work/missions/<v>/closing.md`) | **judgment-closed** (`/close`, operator-invoked only) |

**Criteria-closed** tiers close themselves against written acceptance — the automation story. **Judgment-closed** tiers close only by explicit operator decision; the system never proposes or initiates a mission close, and a mission may close `accomplished | failed | superseded` with the same ceremony (failure is first-class). An **open milestone** (`mode: open` frontmatter) is the judgment-closed exception one tier down: a direction statement instead of fixed acceptance, an iteration ledger instead of pre-filed phases; `/execute` refuses it (nothing to converge on).

## The role ladder

The metaphor is corporate, and deliberately so: judgment escalates *upward*, and ultimate authority rests with the human. A military metaphor would imply command flowing down and obedience flowing back; this system's control flow is the opposite where it matters.

| Role | Ladder position | Does |
| --- | --- | --- |
| **Operator** | owner | All ultimate judgment: design sign-off, autonomy scope, mission close. The interim work-queue scheduler. |
| **Architect** | design authority (staff — advises, never dispatches builds) | Plans missions and milestones as interactive flagship sessions; authors charters, milestone indexes, phase docs; the standing consult handle. **Blesses every prepared work order before execution** (the blessing gate — manager's Architect Blessing policy). Tier-qualified in stamp comments: `# mission architect`, `# milestone architect`, `# blessing`. |
| **Executor** | executive | Drives one milestone campaign: Reconnaissance gate with the operator, then one Manager subagent per phase; reasons about **ultimate acceptance** (does the phase advance the objective) vs the Manager's phase acceptance. |
| **Manager** | line management | Drives one work order to its `## Acceptance Verdict` by dispatching specialists; sole author of the work document; conserves its context for decisions. |
| **Specialists** | individual contributors | One scoped task each, as subagents: **researcher**, **investigator**, **planner**, **designer**, **implementer**, **reviewer**, **inspector**, **documenter**, **integrator**. |

The **Planner** and the **Architect** are the same competency at different tiers: the Planner authors the implementation-plan section of one work order, as a dispatched subagent pinned to the flagship model; the Architect authors the specs those work orders descend from, interactively, with the operator in the dialog. The **Designer** carries the same split for design: authority mode (`/design`, operator-run, judgment-closed — authors the design canon and session briefs) vs subagent mode (scoped in-build investigation). The **Integrator** merges worktree branches back to trunk (renamed from "resolver" to break the collision with bug *resolution*).

## The command family

Commands are **verbs**; agents are **nouns**. Two core verbs are polymorphic on the argument's tier — the directory structure identifies the context, so the operator never chooses between specialized command names:

| Command | Routes to | Does |
| --- | --- | --- |
| `/plan <target>` | mission → Architect · milestone dir → Architect · work order → Manager (dispatches Planner) | Produce the tier's planning artifact |
| `/execute <target>` | milestone dir → Executor · work-order file → Manager (`automatically` switch for headless convergence) | **Advance the document through its workflow from wherever it stands** — the work order is the state machine |
| `/triage [scope]` | Manager | Reconcile the todos inbox with current reality; rewrite `BACKLOG.md` |
| `/investigate <question\|bug>` | Investigator | Trace a codebase question or bug to a definitive answer |
| `/research <question>` | Researcher | External/web research → report in `docs/research/` |
| `/design [target]` | Designer (authority mode — operator-run) | **Judgment-closed** design session: found/refresh the canon (`work/design/`), design a surface into a session brief, or reconcile a returned pull. Never implements |
| `/document <scope>` | Manager (dispatches Documenter) | Audit and revise documentation drift |
| `/close <mission>` | Architect-tier dialog | Mission close: closing report, full triage (todos/proposals/footguns/**docs & research**), archive, tag. **Operator-invoked only.** |
| `/archive` | — | Sweep + backfill the transcript archive; checkpoint for inactive-but-open missions |
| `/initialize` | — | Read-only environment audit against `.claude/BASELINE.md` expectations |

Retired: `/build`, `/resolve`, `/refactor`, `/implement` (→ `/execute`), `/accomplish` (→ `/execute <milestone>`), `/answer` (→ `/investigate` + `/research`), `/schedule` (→ deferred work-queue tier).

## The callback grammar

**Stated here once; referenced everywhere else.**

```
<role>@<machine>/<session-id>[#<message-id>]
```

- **role** — the role the session was acting in (ladder names above; tier-qualified by a trailing `# comment` where useful).
- **machine** — the host owning the session transcript (registry below). Load-bearing: transcripts are machine-local; this is the routing key for any future cross-machine consult.
- **session-id** — the resume handle. `claude -p --resume <session-id> --fork-session` **forks** the session at full context. The flag is load-bearing: without `--fork-session`, resume **continues the transcript in place** and mutates it; with it, the original is never touched and parallel consults are safe. (Corrected 26-07-23 — see `todos/26-07-23.fork-session-consults.md`.)
- **#message-id** *(optional)* — a **citation**, not a resume target: it locates the exact turn in the (archived) transcript, greppable via `zgrep <message-id> work/sessions/<machine>/<uuid>.jsonl.gz`. Include it when a specific statement is being cited; omit otherwise.

Conventions:

- **`sessions:` frontmatter — durable tiers only** (architect / executor: sessions someone can actually `--resume`; a Manager entry follows the **nearest-resumable-session principle** — a subagent Manager anchors to its hosting Executor session, `manager@<machine>/<executor-session-id>`, reachable by resuming that Executor and continuing the agent by id, while a headless-fallback Manager is its own resumable session and stamps its own id). Append-only, each entry the grammar above plus an optional `# role comment`. Append, never rewrite, reorder, or delete. Any agent that touches a work order at any stage records itself — durable sessions here, everything else via the section stamps below.
- **Per-section stamps** — every `<h2>` section appended to a work document is prefaced by a blockquote stamp: `> <role>@<machine>/<session-id>`. **The role names the act; the session-id names who can answer for it**: a specialist's report carries the specialist's role over the hosting (resumable) session's id — e.g. `> reviewer@play/<manager-session-id>` (the reviewer subagent is reachable back through that session). A session acting outside a dispatched role stamps the capacity it was serving when it wrote. A section revised by a *different* session appends a second stamp line. The `sessions:` list is derivable from the body stamps (dedupe by session-id, which collapses to the durable tiers) — the stamps are the source of truth.
- **A callback is provenance plus a consult handle, never authority.** Resuming an author answers "what did you intend / why was X rejected"; new design decisions still escalate to the Operator.
- **A consult is read-only by construction.** The fork can read the transcript and answer, never act — no writes, shell, git, subagents, web, MCP, or hooks. Enforced by `.claude/bin/consult` (the required consult path); a raw `claude -p --resume … --fork-session` recipe carries no boundary and is a documented bypass.
- **A consult is repo-bound.** A handle resolves only where the transcript's recorded `cwd` matches the consulting repo; a transcript belonging to another repo is refused (the fork would act in the wrong working tree). Foreign repos degrade to documents + a fresh dispatch — the handle itself stays `role@machine/session-id`, the repo binding is a property the tooling enforces, not a segment of the grammar.
- **Durability** — stamping creates a promise of consultability; `work/sessions/` (archive-on-stamp + `/archive`) is what makes the promise true. Consult via `.claude/bin/consult <handle> "<question>"`, which owns the restore-before-resume ladder.

### Machine registry

| Machine | OS / shell | Repo path | Notes |
| --- | --- | --- | --- |
| `<machine>` | `<os>` / `<shell>` | `<repo-path>` | Single machine today; add a row per machine at bootstrap |

## The follow-through rule

**Stated here once; referenced everywhere else.**

On receiving sign-off — or completing self-closing work — the session's **first actions** are the mechanical close-out: commit (enumerated paths), transcript archive, status/roadmap updates, **before any reply prose**. Approval (or completion) is the *trigger* for the close-out, not the ending after it.

- A turn never ends with approved-but-uncommitted artifacts.
- The **only** legitimate way a turn ends with uncommitted approved work is an **explicitly stated reason** — canonically "uncommitted pending your sign-off" while the pause awaits it. State the reason; make the state visible, never ambient.
- **No standing per-workflow commit exceptions.** Every close-out commits on the same terms; a doc that fails review is reverted or revised afterward (rare), not gated pre-commit.

## Historical rename mapping

Imported documents (notably `work/proposals/`) and old callback stamps retain the previous vocabulary — **they are never rewritten**; read them through this mapping:

| Historical | Current |
| --- | --- |
| Orchestrator (`orchestrator@…`) | Manager |
| resolver (agent) | Integrator |
| planner at milestone/mission tier (`planner@… # milestone architect`) | Architect (`architect@…`) |
| `plan-session:` / `plan-machine:` frontmatter | a `sessions:` entry |
| `agent:` frontmatter list, `role@machine:session` colon grammar | `sessions:` list, slash grammar above |
| `/build`, `/resolve`, `/accomplish` (in prose) | `/execute` |

Old stamps remain **valid handles**: the role segment is the historical role name; resume them exactly as stamped.
