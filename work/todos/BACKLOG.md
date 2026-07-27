# Backlog

Last triaged: 26-07-26

Prioritized ledger of the active `work/todos/` inbox. Rewritten end-to-end by `/triage`; see `work/todos/README.md` for the disposition + priority vocabulary.

| Item | Type | Priority | Disposition | Aligns | Note |
|---|---|---|---|---|---|
| [concurrent-tree-commit-absorption](bugs/26-07-25.bug.concurrent-tree-commit-absorption.md) | bug | medium | live | v3 (D5) | Verified unaddressed at triage (researcher pass, 26-07-26): no remedy or mitigation has landed since filing; not in ADR § Standing hazards; nothing prevents two concurrent root sessions sharing one git index. `git commit --only <paths>` was used defensively in practice in v2 (`f2e10fa`, `b368b92`) but is documented nowhere. v3 charter (26-07-27, D5): the hazard family enters ADR § Standing hazards via M2, the interim `git commit --only` documentation lands there too; the remedy design fork — worktree isolation vs. staging discipline — remains deferred and is named as deferred in the hazard entry. |

## Closed this pass (26-07-26)

- [orchestration-return-path](../missions/v2.repo-hygiene/todos/bugs/26-07-25.bug.orchestration-return-path.md) — resolved through its normal workflow: M2 phase 3 wrote `resolution:` frontmatter and `## Resolution (26-07-26)` from the battery-2 verdicts (commit `d95572f`). Stayed in `bugs/` until the close per the fold-and-close runbook's disposition table (now archived at `work/missions/v2.repo-hygiene/runbooks/fold-and-close.md`); the close ceremony carried it into the mission archive at that path, as the runbook pinned.
