# Plan Mission

Charter one mission — the judgment-closed tier above milestones (`work/README.md` § tier ladder). Invoked as `/plan` at mission tier (a new mission, the next version, or `work/MISSION.md`). You are the [architect](../CLAUDE.md), acting as **mission architect**. Deliverable: the charter + settlement, milestones stubbed — **not** planned milestones (each hardens just-in-time via `/plan <milestone>`) and **not** any building.

## Workflow

1. **Read the ground.** The predecessor mission's closing report and ledger row (`work/missions/README.md`) if one exists; the current `work/` state (open todos, standing proposals, footgun ledger); root CLAUDE.md. Dispatch researchers for codebase state where the mission's subject needs grounding.
2. **The charter dialog.** Interview the operator to settle, in this order:
   - **Objective and why-now** — one version-scale intent.
   - **Scope and explicit non-goals** — what this mission refuses is as load-bearing as what it pursues.
   - **Success criteria** — what observed state means accomplished.
   - **Failure criteria** — what observed state would mean this mission should close *unaccomplished*. Naming these up front is what makes failure a legitimate outcome instead of a quiet abandonment.
3. **Settlement** (the determinations phase — the opening move of a mission, as protocol):
   - Argue and record the binding **determinations** the mission's design rests on (researcher-grounded, operator-signed). Where a later milestone doc and a determination disagree, the determination wins until explicitly revised.
   - **Footgun triage** over the predecessor's ledger: every entry dispositioned **carried** (into the fresh `work/footguns/`, re-certified) / **designed-around** (stays archived as the design's rationale) / **watch** (pointer; resolved on first contact). Runbooks ride the same triage (carried / retired / watch). **Design** rides it too: the predecessor's `work/design/` canon is triaged **carried** (re-certified into the fresh canon) / **redesigned** (this mission supersedes it; the archive keeps the rationale) / **watch** — an MVP-era predecessor may have none.
   - **Todo triage**: items carried forward from the predecessor enter the fresh inbox or are archived with cause.
4. **Stub the roadmap.** Lay gist-level milestone stubs — a roadmap row + a stub `MILESTONE.md` (scope gist, phase gists, dependencies) per milestone — in `work/milestones/` per its README conventions. Preliminary gist-planning here is protocol; *hardening* stays just-in-time (`/plan <milestone>`), because sufficient milestone planning usually depends on prerequisite outcomes.
5. **Write `work/MISSION.md`** — the charter: objective/why-now, scope, non-goals, settlement reference, success criteria, failure criteria, roadmap table. Mission identity: `v<version>.<slug>` (the number orders, the slug carries meaning). If the project versions by branch, the mission branch opens here (mission = branch; branch open = mission open).
6. **Sign-off + commit.** Present the charter + determinations + roadmap; await explicit approval; commit (enumerated paths). Stamp `architect@<machine>/<session-id> # mission architect` into the `sessions:` frontmatter of `work/MISSION.md` and every milestone stub; archive your transcript (`.claude/bin/session-archive` / `/archive`).

## Lifecycle

`proposed (a work/proposals/ entry) → chartered (MISSION.md + branch) → settled (determinations + triages) → active (milestones execute) → closed (/close — operator-invoked only: report + archive + tag)`.

There is deliberately **no `/execute <mission>`**: serial milestones must be sharpened by what the previous milestone taught — the inter-milestone gap is where addenda, footgun reconciliation, and the campaign log feed the next `/plan <milestone>` dialog. The mission is human-cadenced; its artifacts are what make that cadence cumulative.
