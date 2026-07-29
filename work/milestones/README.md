# Milestones

The active mission's phased roadmap. Empty until the first mission is chartered (`/plan` at mission tier) and its milestones are laid — this README carries the conventions so `/plan <milestone>` and `/execute <milestone>` have a stable reference.

## Roadmap — mission v4.token-efficiency

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [spike](1.spike/MILESTONE.md) | The always-warm theory under test, in two phases split by question: channel mechanics + read-only boundary, then the cost matrix + heartbeat — the mission's go/no-go gate | — | pending |
| 2 | [intercom](2.intercom/MILESTONE.md) | The channel as product: `.claude/bin/` tooling, lifecycle machinery, warmth policy, routing convention, crash semantics | 1 | pending |
| 3 | [protocol-integration](3.protocol-integration/MILESTONE.md) | Consult path + canon rewired: consult ladder's live-channel rung, callback grammar, role cards, degrade semantics, enactment | 2 | pending |
| 4 | [measured-campaign](4.measured-campaign/MILESTONE.md) | One real campaign in `~/dev/lasers` over the intercom; per-consult measurements collected and analyzed | 3 | pending |
| 5 | [batching](5.batching/MILESTONE.md) | Conditional: consult batching evaluated against M4's measurements; skippable at its gate without failing the mission | 4 | pending |

## Conventions

- **Directory per milestone**: `<n>.<name>/` (e.g. `3.chart-refinement/`) holding `MILESTONE.md` + one `<p>.<phase>.md` per phase. A milestone whose work produces **apparatus** — a measurement harness, a throwaway driver, anything executable that is evidence-producing rather than product — may carry it in a named subdirectory (`<n>.<name>/harness/`); it archives with the mission and never implies a `.claude/` product change.
- **`MILESTONE.md`**: `sessions:` frontmatter (append-only callback list per `work/README.md`; the last `architect@…` entry is the consultation handle) · title + status blockquote · `## Objective` · `## Scope` / `## Out of scope` · `## Phases` (table: number linked to phase doc, gist, status) · `## Acceptance` (milestone-level — the Executor's ultimate-acceptance test).
- **Phase docs**: frontmatter `difficulty: low | medium | high` (planning difficulty — drives the Planner's model tier) + `depends-on: [<phases>]` · `## Objective` · `## Scope` (a phase that creates files states where they land, against the declared structure — `work/PROJECT.md` § Structure) · `## Acceptance` (the automatic-mode convergence target — concrete, headlessly verifiable, operator-gated items marked) · `## Depends on` (prose premises). Phases accrete an `## Addendum` at close, written by the campaign.
- **Roadmap table** lives in this README once milestones exist: number, name, gist, depends-on, status.
- **Status vocabulary**: `pending` / `in progress` / `done (date)`. Prose never hard-wrapped.
- **Open milestones** (`mode: open` frontmatter): a direction statement instead of fixed acceptance, an iteration ledger instead of pre-filed phases; judgment-closed by the operator; `/execute` refuses them. See `work/README.md` § tier ladder.
