# claude-workflow

The canonical, project-generic **Claude agentic workflow**: a portable `.claude/` bootstrap (agents, commands, workflows, tooling) plus the `work/` conventions that turn a repository into a tiered, durable, resumable work system. `main` is the template itself — product and scaffold, nothing else. The workflow's own development runs under the workflow, on mission branches tagged at close.

## The system at a glance

- **Tier ladder** — work order → milestone phase → milestone → mission. Lower tiers close themselves against written acceptance; missions close only by operator judgment (`/close`), and failure is a first-class outcome.
- **Role ladder** (corporate, deliberately — judgment escalates upward): **Operator** → **Architect** (design authority: charters missions, hardens milestones) → **Executor** (drives one milestone campaign) → **Manager** (drives one work order via specialists) → nine **specialists** (researcher, investigator, planner, designer, implementer, reviewer, inspector, documenter, integrator).
- **Ten commands, two of them polymorphic** — `/plan` and `/execute` route by the argument's tier (mission / milestone / work order); `/design` runs the judgment-closed design sessions (mission-versioned `work/design/` canon, session briefs, taste gates); plus `/triage`, `/investigate`, `/research`, `/document`, `/close`, `/archive`, `/initialize`.
- **Durable intercom** — every session that shapes a document stamps a callback (`<role>@<machine>/<session-id>[#<message-id>]`); transcripts archive to the durable session store (gzip + sha256 manifest), and `.claude/bin/consult` restores and resume-forks any stamped author to ask *what it intended*. Work documents are the durable state; consults are advisory, never authority. Grammar and mechanism: [`work/README.md`](work/README.md) § The callback grammar.

Full canon: [`work/README.md`](work/README.md). Portability manifest + bootstrap expectations: [`.claude/BASELINE.md`](.claude/BASELINE.md).

## Bootstrap a new project

**Clone `main`** — the clone *is* the bootstrap. `main` carries only the product and the scaffold, so nothing of another project's history rides along. The authoritative file set and expectations are [`.claude/BASELINE.md`](.claude/BASELINE.md); this section is the orientation.

1. **Adapt the machine registry** — in `work/README.md`, replace the machine-registry row with the new project's machine(s).
2. **Author the two keystone documents**, replacing the template's own root docs: the project's root `CLAUDE.md` (architecture source of truth) and `work/PROJECT.md` (the operational supplement — quality gate, front-end surface, runtime-evidence map, Context7 library list). Everything project-specific lives in these two files — nothing in `.claude/` ever carries project facts. That seam is what keeps the clone clean.
3. **Run `/initialize`** — a **read-only audit** against `BASELINE.md` § Expectations; it repairs nothing itself, but every gap it reports names its repair recipe (the user-scope MCP set including the codebase graph + repo index, hooks, git hygiene, transcript retention, toolchain). Run the repairs, re-run the audit. The MCP set is per-machine, not per-repo — a second project on the same machine finds it already satisfied.

## Developing the workflow

Branch from `main` for each mission and let the workflow govern its own development on that branch: `/plan` the mission charter, `/execute` its milestones, file work orders and design thinking into the scaffold. Changes under `.claude/` are changes to the canonical bootstrap — keep them project-generic, and update `BASELINE.md` in the same commit when the manifest set changes. At close the branch is tagged `<v>-closed` with its mission archive intact and the product-only result folds back to `main`; downstream repos adopt by pulling the new manifest (diff-friendly by design). Full protocol: [`.claude/ADR.md`](.claude/ADR.md) § Continuation protocol.

## Provenance

Designed and first executed in the operator's astrology repo, 26-07-11. The full design history — the determinations record, the founding design corpus, and each mission's archive — rides the tagged mission branches; the register that indexes them, decision by decision, is [`.claude/ADR.md`](.claude/ADR.md). Lineage runs back to the lasers-studio workflow: read historical vocabulary through the rename mapping in [`work/README.md`](work/README.md) § Historical rename mapping.
