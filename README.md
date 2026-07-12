# claude-workflow

The canonical, project-generic **Claude agentic workflow**: a portable `.claude/` bootstrap (agents, commands, workflows, tooling) plus the `work/` conventions that turn a repository into a tiered, durable, resumable work system. This repo is both the **source of truth for the bootstrap** and a **live instance of it** — the workflow's own development runs under the workflow (its work orders, proposals, and session archive live in `work/`).

## The system at a glance

- **Tier ladder** — work order → milestone phase → milestone → mission. Lower tiers close themselves against written acceptance; missions close only by operator judgment (`/close`), and failure is a first-class outcome.
- **Role ladder** (corporate, deliberately — judgment escalates upward): **Operator** → **Architect** (design authority: charters missions, hardens milestones) → **Executor** (drives one milestone campaign) → **Manager** (drives one work order via specialists) → nine **specialists** (researcher, investigator, planner, designer, implementer, reviewer, inspector, documenter, integrator).
- **Nine commands, two of them polymorphic** — `/plan` and `/execute` route by the argument's tier (mission / milestone / work order); plus `/triage`, `/investigate`, `/research`, `/document`, `/close`, `/archive`, `/initialize`.
- **Durable intercom** — every session that shapes a document stamps a callback (`<role>@<machine>/<session-id>[#<message-id>]`); transcripts archive to `work/sessions/` (gzip + sha256 manifest); `.claude/bin/consult` restores and resume-forks any stamped author to ask *what it intended*. Work documents are the durable state; consults are advisory, never authority.

Full canon: [`work/README.md`](work/README.md). Portability manifest + bootstrap expectations: [`.claude/BASELINE.md`](.claude/BASELINE.md).

## Bootstrap a new project

1. Copy the manifest set (`.claude/BASELINE.md` § Manifest) into `<repo>/.claude/`.
2. Scaffold `work/` — copy `work/README.md` (update its machine-registry row) and the directory READMEs (`todos/`, `milestones/`, `footguns/`, `sessions/`); create `todos/{bugs,_done,_cancelled}`, `proposals/{_deferred,_rejected}`, `missions/`, `notes/`, `runbooks/`.
3. Author the project's `work/PROJECT.md` (the supplement — this repo's own is the shape exemplar) and a root `CLAUDE.md`.
4. Run `/initialize`; repair gaps it names.

Everything project-specific lives in `work/PROJECT.md` and the target repo's `CLAUDE.md` — nothing in `.claude/` ever carries project facts. That seam is what makes this copy clean.

## Developing the workflow

File work orders in `work/todos/`, design thinking in `work/proposals/`, and run them with the workflow itself (`/plan`, `/execute`). Changes under `.claude/` here are changes to the canonical bootstrap — keep them project-generic, and update `BASELINE.md` when the manifest set changes. Downstream repos adopt by re-copying the manifest (diff-friendly by design).

## Provenance

Designed and first executed in the operator's astrology repo, 26-07-11 — the determinations record ([`work/todos/_done/agentic-workflow/1.determinations.md`](work/todos/_done/agentic-workflow/1.determinations.md)), the founding series (same directory), and the design corpus ([`work/proposals/26-07-05.agentic-workflow/`](work/proposals/26-07-05.agentic-workflow/)) carry the full rationale, with lineage back to the lasers-studio workflow (read historical vocabulary through the rename mapping in `work/README.md`). The founding architect session is archived in `work/sessions/` and consultable: `.claude/bin/consult architect@play/a9ddd6b3-7457-451c-85bd-a79a91b05e08 "<question>"`.
