# claude-workflow

The canonical, project-generic **Claude agentic workflow**: a portable `.claude/` bootstrap (agents, commands, workflows, tooling) plus the `work/` conventions that turn a repository into a tiered, durable, resumable work system. This repo is both the **source of truth for the bootstrap** and a **live instance of it** — the workflow's own development runs under the workflow (its work orders, proposals, and session archive live in `work/`).

## The system at a glance

- **Tier ladder** — work order → milestone phase → milestone → mission. Lower tiers close themselves against written acceptance; missions close only by operator judgment (`/close`), and failure is a first-class outcome.
- **Role ladder** (corporate, deliberately — judgment escalates upward): **Operator** → **Architect** (design authority: charters missions, hardens milestones) → **Executor** (drives one milestone campaign) → **Manager** (drives one work order via specialists) → nine **specialists** (researcher, investigator, planner, designer, implementer, reviewer, inspector, documenter, integrator).
- **Ten commands, two of them polymorphic** — `/plan` and `/execute` route by the argument's tier (mission / milestone / work order); `/design` runs the judgment-closed design sessions (mission-versioned `work/design/` canon, session briefs, taste gates); plus `/triage`, `/investigate`, `/research`, `/document`, `/close`, `/archive`, `/initialize`.
- **Durable intercom** — every session that shapes a document stamps a callback (`<role>@<machine>/<session-id>[#<message-id>]`); transcripts archive to `work/sessions/` (gzip + sha256 manifest); `.claude/bin/consult` restores and resume-forks any stamped author to ask *what it intended*. Work documents are the durable state; consults are advisory, never authority.

Full canon: [`work/README.md`](work/README.md). Portability manifest + bootstrap expectations: [`.claude/BASELINE.md`](.claude/BASELINE.md).

## Bootstrap a new project

The copy is **selective** — this repo is both the bootstrap's source of truth and a live instance of it, and only the product travels. Do **not** clone or template-copy the repo whole: that would carry the instance (this repo's own `work/` history — todos, proposals, missions, session archive — and a `README.md`/`CLAUDE.md` that describe *this* repo), and the new project would boot up with someone else's memories. The authoritative procedure and file set live in [`.claude/BASELINE.md`](.claude/BASELINE.md); this section is the orientation.

1. **Copy the manifest set** (`BASELINE.md` § Manifest) into `<repo>/.claude/` — agents, commands, workflows, `bin/` tooling, settings skeleton, and `BASELINE.md` itself.
2. **Copy the scaffold** (`BASELINE.md` § Bootstrap procedure, step 2 — the exact set): the `work/` skeleton with its instructive READMEs and state directories, plus `src/README.md` (the source-layout convention: sub-codebases under `src/`, retirement to `src/_archive/`) and the root `.cbmignore` (the AST-index whitelist). One adaptation: in the copied `work/README.md`, replace the machine-registry row with the new project's machine(s).
3. **Author the two keystone documents** that are never copied: the project's root `CLAUDE.md` (architecture source of truth) and `work/PROJECT.md` (the operational supplement — quality gate, front-end surface, runtime-evidence map, Context7 library list; this repo's own is the shape exemplar). Everything project-specific lives in these two files — nothing in `.claude/` ever carries project facts. That seam is what makes the copy clean.
4. **Run `/initialize`** — a **read-only audit** against `BASELINE.md` § Expectations; it repairs nothing itself, but every gap it reports names its repair recipe (the user-scope MCP set including the codebase graph + repo index, hooks, git hygiene, transcript retention, toolchain). Run the repairs, re-run the audit. The MCP set is per-machine, not per-repo — a second project on the same machine finds it already satisfied.

## Developing the workflow

File work orders in `work/todos/`, design thinking in `work/proposals/`, and run them with the workflow itself (`/plan`, `/execute`). Changes under `.claude/` here are changes to the canonical bootstrap — keep them project-generic, and update `BASELINE.md` when the manifest set changes. Downstream repos adopt by re-copying the manifest (diff-friendly by design).

## Provenance

Designed and first executed in the operator's astrology repo, 26-07-11 — the determinations record ([`work/todos/_done/agentic-workflow/1.determinations.md`](work/todos/_done/agentic-workflow/1.determinations.md)), the founding series (same directory), and the design corpus ([`work/proposals/_enacted/26-07-05.agentic-workflow/`](work/proposals/_enacted/26-07-05.agentic-workflow/), standing remainder in [`work/proposals/26-07-05.agentic-workflow/`](work/proposals/26-07-05.agentic-workflow/)) carry the full rationale, with lineage back to the lasers-studio workflow (read historical vocabulary through the rename mapping in `work/README.md`). The founding architect session is archived in `work/sessions/` and consultable: `.claude/bin/consult architect@play/a9ddd6b3-7457-451c-85bd-a79a91b05e08 "<question>"`.
