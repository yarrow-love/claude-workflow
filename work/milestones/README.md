# Milestones

The active mission's phased roadmap — mission `v3.memory-protocol` (chartered 26-07-27, branch `v3.memory-protocol`; charter: [`work/MISSION.md`](../MISSION.md)).

## Roadmap

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [protocol](1.protocol/MILESTONE.md) | Hardened 26-07-27, two phases: **author** (mechanical truth fix as mandated commit #1, then `.claude/protocols/codebase-graph.md` — P1 verification recipe + P3 recovery + P2 evidence-passing contract — with BASELINE's graph bullet + `### Protocols` manifest section in final form) → **rewire** (the remaining seven sites, incl. the manager-card brief hook found at hardening, under the verified-freshness trust model; D6 guard) | — | done (26-07-27) |
| 2 | [hazard-and-evidence](2.hazard-and-evidence/MILESTONE.md) | ADR standing hazard (shared-mutable-store family, both instances) + P4 version-pin ledger absorbing the charter evidence delta → interim `git commit --only` documentation → live spot-check of the recipe as-written + enactment filing | 1 | pending |

## Conventions

- **Directory per milestone**: `<n>.<name>/` (e.g. `3.chart-refinement/`) holding `MILESTONE.md` + one `<p>.<phase>.md` per phase.
- **`MILESTONE.md`**: `sessions:` frontmatter (append-only callback list per `work/README.md`; the last `architect@…` entry is the consultation handle) · title + status blockquote · `## Objective` · `## Scope` / `## Out of scope` · `## Phases` (table: number linked to phase doc, gist, status) · `## Acceptance` (milestone-level — the Executor's ultimate-acceptance test).
- **Phase docs**: frontmatter `difficulty: low | medium | high` (planning difficulty — drives the Planner's model tier) + `depends-on: [<phases>]` · `## Objective` · `## Scope` (a phase that creates files states where they land, against the declared structure — `work/PROJECT.md` § Structure) · `## Acceptance` (the automatic-mode convergence target — concrete, headlessly verifiable, operator-gated items marked) · `## Depends on` (prose premises). Phases accrete an `## Addendum` at close, written by the campaign.
- **Roadmap table** lives in this README once milestones exist: number, name, gist, depends-on, status.
- **Status vocabulary**: `pending` / `in progress` / `done (date)`. Prose never hard-wrapped.
- **Open milestones** (`mode: open` frontmatter): a direction statement instead of fixed acceptance, an iteration ledger instead of pre-filed phases; judgment-closed by the operator; `/execute` refuses them. See `work/README.md` § tier ladder.
