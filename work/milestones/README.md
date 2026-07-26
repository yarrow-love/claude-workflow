# Milestones

The active mission's phased roadmap — mission `v2.repo-hygiene` (chartered 26-07-25, branch `26-07-25`; charter: [`work/MISSION.md`](../MISSION.md)).

## Roadmap

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [janitor](1.janitor/MILESTONE.md) | Four phases: floor (doctrine + § Structure schema + declaration) → competency (`janitor.md`, `/clean`) → wiring (blessing lens, where-artifacts-land, advisory order-close, blocking milestone-close, child-collection rule A3) → prove (dogfood pass, `reference-gate`, enactment, fold rehearsal) | — | pending (planned 26-07-25) |
| 2 | [return-path](2.return-path/MILESTONE.md) | A4: probe the orchestration return-path topology on the pinned CLI (five falsifiable probes, operator-launched probe-parent) → settle doctrine from verdicts (constrained idiom, continuation rule, nudge graduation, A3 reconciliation) or escalate the reserved tier-ladder finding | 1 | pending (planned 26-07-25; phase 2 verdict-gated) |

## Conventions

- **Directory per milestone**: `<n>.<name>/` (e.g. `3.chart-refinement/`) holding `MILESTONE.md` + one `<p>.<phase>.md` per phase.
- **`MILESTONE.md`**: `sessions:` frontmatter (append-only callback list per `work/README.md`; the last `architect@…` entry is the consultation handle) · title + status blockquote · `## Objective` · `## Scope` / `## Out of scope` · `## Phases` (table: number linked to phase doc, gist, status) · `## Acceptance` (milestone-level — the Executor's ultimate-acceptance test).
- **Phase docs**: frontmatter `difficulty: low | medium | high` (planning difficulty — drives the Planner's model tier) + `depends-on: [<phases>]` · `## Objective` · `## Scope` (a phase that creates files states where they land, against the declared structure — `work/PROJECT.md` § Structure) · `## Acceptance` (the automatic-mode convergence target — concrete, headlessly verifiable, operator-gated items marked) · `## Depends on` (prose premises). Phases accrete an `## Addendum` at close, written by the campaign.
- **Roadmap table** lives in this README once milestones exist: number, name, gist, depends-on, status.
- **Status vocabulary**: `pending` / `in progress` / `done (date)`. Prose never hard-wrapped.
- **Open milestones** (`mode: open` frontmatter): a direction statement instead of fixed acceptance, an iteration ledger instead of pre-filed phases; judgment-closed by the operator; `/execute` refuses them. See `work/README.md` § tier ladder.
