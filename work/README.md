# The work system

`work/` is the **process** container: how work is planned, done, recorded and archived. Knowledge that outlives any one piece of work goes in `docs/`, created with its first document. The split matters because agents grep the working tree: what lives here is relevant to the _active_ mission, and what has served its purpose archives into `work/missions/<v>/`.

## Layout

| Path | Holds | Lifecycle |
| --- | --- | --- |
| `MISSION.md` | The active mission's charter: objective, scope, non-goals, success **and failure** criteria, open determinations | Written at mission open (`/plan mission`); archived at `/close` |
| `PROJECT.md` | Operational facts every role reads: the gate, the structure, the machines, per-role notes | Persists across missions |
| `milestones/` | The mission's roadmap: `<n>.<name>/` with `MILESTONE.md` and phase docs | Archived whole at mission close |
| `todos/` | Work orders, bugs, series, campaign logs (`_done/`, `_cancelled/`) | [`todos/README.md`](todos/README.md) |
| `proposals/` | Pre-decision design thinking (`_deferred/`, `_rejected/`, `_enacted/`) | [`proposals/README.md`](proposals/README.md) |
| `footguns/` | Traps found in the work, one file per subsystem | Triaged at mission open; archived at close |
| `runbooks/` | Operational procedures, written to be run cold | Triaged at mission open |
| `notes/` | Ideas, observations and the operator's rulings, not ready to propose | Graduate into proposals or evaporate |
| `missions/` | Closed missions, archived whole | Append-only; [`missions/README.md`](missions/README.md) is the ledger |

Each tier has one ALL-CAPS orientation document: `CLAUDE.md` (root), `work/PROJECT.md`, `work/MISSION.md`, `work/milestones/<n>.<name>/MILESTONE.md`. A lowercase `README.md` documents a directory; artifacts (phase docs, `closing.md`) stay lowercase. Directories are created on first use. Dates are written `yy-mm-dd` in file names and documents.

## The tier ladder

| Tier | Unit | Plan | Close | Closed by |
| --- | --- | --- | --- | --- |
| work order | one feature, fix or chore | `## Plan` in the order | `## Summary`, filed to `_done/` | its acceptance (self-closing) |
| milestone phase | one campaign of work | the phase doc's `## Acceptance` | `## Addendum` | its acceptance |
| milestone | one capability | `MILESTONE.md` and phase docs | status in the roadmap, plus a campaign log | its acceptance |
| mission | one version | `work/MISSION.md` | `work/missions/<v>/closing.md` | **the operator only** (`/close`) |

Work orders, phases and milestones close themselves against written acceptance. A mission closes only by the operator's decision, as `accomplished`, `failed` or `superseded`; failure is first-class. A **gate** phase (`gate: true` in its frontmatter) ends in a go/no-go the operator rules before any later phase starts.

**Until a mission is chartered, work runs as work orders.** Most changes are one order. A mission is chartered when the operator has a direction that needs more than that, from proposals they have discussed and ruled: notes → proposals, discussed in depth → `/plan mission` → milestones.

**Acceptance says where each item is shown**, and which items only the operator can show: anything needing a machine the session is not on, a person's judgement, or a real-world action `PROJECT.md` reserves to them.

## Roles

Roles are **hats, not agents**. One session changes hats as the work moves (recon, plan, build, check) and keeps its context. A fresh subagent is dispatched only where independence is the point or where work truly runs in parallel.

| Role | Who | Does |
| --- | --- | --- |
| **Operator** | the human ([`PROJECT.md`](PROJECT.md) names them) | All final judgment: rulings on determinations, sign-off, go/no-go on gates, mission close. |
| **Architect** | the main session, via `/plan` | Plans missions and milestones in dialog with the operator. Writes proposals, charters, `MILESTONE.md` and phase docs. |
| **Executor** | the main session, via `/execute <milestone>` | Drives one milestone: one phase at a time, each by a `manager` subagent (or in its own context when the phase is small); judges each phase against the milestone's acceptance, not just the phase's. |
| **Manager** | [`manager`](../.claude/agents/manager.md) subagent, or the main session on `/execute <order>` | Owns one phase or order end to end: recon, plan, build, gate, close-out. Sole author of its document. |
| **Reviewer** | [`reviewer`](../.claude/agents/reviewer.md) subagent, always fresh | Reads a finished change against the acceptance and the architecture, without the builder's context. |

Research, exploration and planning drafts use the harness's built-in agents (`Explore`, `Plan`, `general-purpose`) with a written brief. Multi-agent workflows run only when the operator asks for one.

## Skills

Skills are verbs; agents are nouns. Each lives in `.claude/skills/<name>/SKILL.md`.

| Skill | Does |
| --- | --- |
| `/plan <target>` | Mission, milestone or work order: produce that tier's plan. The argument's shape picks the tier. |
| `/execute <target>` | Advance a milestone, a phase doc or a work order from wherever it stands. The document is the state machine. |
| `/close <mission>` | Close the mission: closing report, triage, archive, tag. **Operator-invoked only.** |

Anything else (triage, investigation, research, documentation) is a plain request.

## Session stamps

A planning document may carry a `sessions:` frontmatter list of sessions worth asking later about its intent, as `<role>@<MACHINE>/<session-id>`. Only planning sessions are stamped; a build session's record is its document. Append, never rewrite.

## The follow-through rule

When work is signed off, or self-closing work completes, the first actions are the close-out: commit the enumerated paths, update statuses and the roadmap, then report. A turn never ends with approved work uncommitted unless the reason is stated (canonically: "uncommitted, pending your sign-off"). **Pushing is separate from committing**; `PROJECT.md` says when to push.

## Keep it small

This system is deliberately lean. Its predecessor (tag `july` in `claude-workflow`) grew compensations for weaker models and an older harness: an agent per role, a command per verb, hooks, a consult tool, a transcript archive, a structure parser, a bootstrap manifest. Current models do better without them. Add something back only when the work shows it is needed, and record why in `PROJECT.md`.
