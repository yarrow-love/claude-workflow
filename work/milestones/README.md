# Milestones

The active mission's phased roadmap — mission `v1.subagent-boundary` (chartered 26-07-23, branch `26-07-23`; charter: [`work/MISSION.md`](../MISSION.md)).

## Roadmap

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [spike](1.spike/MILESTONE.md) | Five empirical probes of subagent dispatch on the pinned CLI (≥v2.1.217, env-gated regime); verdicts gate M2 | — | done (26-07-24) |
| 2 | [conversion](2.conversion/MILESTONE.md) | Subagent Manager boundary lands in canon; apparatus retires; depth-cap key + archive sweep | 1 | done (26-07-24) |
| 3 | [validation-and-fold](3.validation-and-fold/MILESTONE.md) | Real campaign under the new boundary; enactments; D4 doctrine rewrite + fold preparation | 2 | pending |

## Conventions

- **Directory per milestone**: `<n>.<name>/` (e.g. `3.chart-refinement/`) holding `MILESTONE.md` + one `<p>.<phase>.md` per phase.
- **`MILESTONE.md`**: `sessions:` frontmatter (append-only callback list per `work/README.md`; the last `architect@…` entry is the consultation handle) · title + status blockquote · `## Objective` · `## Scope` / `## Out of scope` · `## Phases` (table: number linked to phase doc, gist, status) · `## Acceptance` (milestone-level — the Executor's ultimate-acceptance test).
- **Phase docs**: frontmatter `difficulty: low | medium | high` (planning difficulty — drives the Planner's model tier) + `depends-on: [<phases>]` · `## Objective` · `## Scope` · `## Acceptance` (the automatic-mode convergence target — concrete, headlessly verifiable, operator-gated items marked) · `## Depends on` (prose premises). Phases accrete an `## Addendum` at close, written by the campaign.
- **Roadmap table** lives in this README once milestones exist: number, name, gist, depends-on, status.
- **Status vocabulary**: `pending` / `in progress` / `done (date)`. Prose never hard-wrapped.
- **Open milestones** (`mode: open` frontmatter): a direction statement instead of fixed acceptance, an iteration ledger instead of pre-filed phases; judgment-closed by the operator; `/execute` refuses them. See `work/README.md` § tier ladder.
