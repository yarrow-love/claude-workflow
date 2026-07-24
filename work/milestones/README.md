# Milestones

The active mission's phased roadmap. Empty until the first mission is chartered (`/plan` at mission tier) and its milestones are laid — this README carries the conventions so `/plan <milestone>` and `/execute <milestone>` have a stable reference.

## Conventions

- **Directory per milestone**: `<n>.<name>/` (e.g. `3.chart-refinement/`) holding `MILESTONE.md` + one `<p>.<phase>.md` per phase.
- **`MILESTONE.md`**: `sessions:` frontmatter (append-only callback list per `work/README.md`; the last `architect@…` entry is the consultation handle) · title + status blockquote · `## Objective` · `## Scope` / `## Out of scope` · `## Phases` (table: number linked to phase doc, gist, status) · `## Acceptance` (milestone-level — the Executor's ultimate-acceptance test).
- **Phase docs**: frontmatter `difficulty: low | medium | high` (planning difficulty — drives the Planner's model tier) + `depends-on: [<phases>]` · `## Objective` · `## Scope` · `## Acceptance` (the automatic-mode convergence target — concrete, headlessly verifiable, operator-gated items marked) · `## Depends on` (prose premises). Phases accrete an `## Addendum` at close, written by the campaign.
- **Roadmap table** lives in this README once milestones exist: number, name, gist, depends-on, status.
- **Status vocabulary**: `pending` / `in progress` / `done (date)`. Prose never hard-wrapped.
- **Open milestones** (`mode: open` frontmatter): a direction statement instead of fixed acceptance, an iteration ledger instead of pre-filed phases; judgment-closed by the operator; `/execute` refuses them. See `work/README.md` § tier ladder.
