# Milestones

The active mission's roadmap ([`../MISSION.md`](../MISSION.md)).

## Conventions

- One directory per milestone, `<n>.<name>/`, holding `MILESTONE.md` and one `<p>.<slug>.md` per phase. Milestone numbers are names: a milestone added later is numbered last, never renumbered in; the roadmap says the run order.
- `MILESTONE.md`: frontmatter `status`, `depends-on`, `sessions:`; then `## Objective`, `## Scope`, `## Out of scope`, `## Determinations`, `## Phases` (a table), `## Acceptance` (what the Executor judges the whole milestone against).
- Phase docs: frontmatter `difficulty` (low | medium | high, how hard to plan), `depends-on`, and `gate: true` for a go/no-go phase; then `## Objective`, `## Scope`, `## Acceptance` (concrete and checkable, operator-gated items marked `(operator)`), `## Depends on`. A phase gains `## Addendum` when it closes.
- A **stub** milestone has its objective, scope and acceptance but no phase docs; `/plan M<n>` hardens it before it runs.
- Status vocabulary: `stub` · `planned` · `in progress` · `done (yy-mm-dd)` · `failed (yy-mm-dd)`.

## Roadmap

_No mission chartered. `/plan mission` lays the roadmap here: why this order, then a table._

| # | Milestone | Status | Depends on | Objective |
| --- | --- | --- | --- | --- |
