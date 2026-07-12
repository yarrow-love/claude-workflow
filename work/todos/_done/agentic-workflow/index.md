---
status: done
filed: 26-07-11
closed: 26-07-11
sessions:
  - architect@play/a9ddd6b3-7457-451c-85bd-a79a91b05e08 # series architect
---

# Agentic Workflow Unification — series index

A phased series of work orders (no milestone ceremony — this is work-system groundwork, not mission work) that unifies the imported `.claude/` agentic system with the mission-tier `work/` layout, locks the role and command vocabulary, and lands the provenance/durability conventions. Seeded by [`work/todos/26-07-11.claude-agentic-unification.md`](../26-07-11.claude-agentic-unification.md) (the audit) and the [`work/proposals/26-07-05.agentic-workflow/`](../../proposals/26-07-05.agentic-workflow/) corpus; determinations settled in the 26-07-11 architect dialog and recorded in [order 1](1.determinations.md).

This directory is the first instance of the *phased-series subdirectory* convention (a `work/todos/<series>/` of ordered `<i>.<objective>.md` orders + this index), sanctioned by `work/todos/README.md` (authored in order 1).

## Orders

| # | Order | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [determinations](1.determinations.md) | Record the locked determinations; author `work/README.md` + `work/todos/README.md`; retire `objectives/` | — | done (26-07-11) |
| 2 | [sweep](2.sweep.md) | Rename roles (orchestrator→manager, resolver→integrator), repoint all old paths to `work/`, retire scheduler, fix the broken hook | 1 | done (26-07-11) |
| 3 | [keystones](3.keystones.md) | Author `work/PROJECT.md`, root `CLAUDE.md`, `.claude/BASELINE.md`; configure browser MCPs at user scope | 2 | done (26-07-11) |
| 4 | [unification](4.unification.md) | Merge the work-order workflows into one canonical + overrides; polymorphic `/plan` + `/execute` routers; retire the old command family | 3 | done (26-07-11) |
| 5 | [provenance](5.provenance.md) | Per-section stamps, `bin/session-archive` + `bin/consult`, `/archive`, `/initialize`, optional SessionEnd hook | 4 | done (26-07-11) |

## Execution notes

- **Strictly sequential** — each order rewrites ground the next stands on. One Manager session per order, manual mode (the operator is in the loop for this series; it edits the machinery itself).
- **Self-modifying bootstrap** — orders 1–3 are executed under the *old* command family (`/build <order>`); order 4 replaces that family, so order 5 is the first order executed as `/execute <order>`.
- **Historical vocabulary is preserved** — the sweep (order 2) never rewrites `work/proposals/` or other imported historical documents; `work/README.md` carries the rename mapping (orchestrator→manager, resolver→integrator, milestone/mission planner→architect) so old texts and old callback stamps stay interpretable.
- At series close: move the seed order and these files to `work/todos/_done/agentic-workflow/`, statuses updated.
