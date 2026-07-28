# Backlog

Last triaged: 26-07-26 · targeted refresh 26-07-27 (v3 M2 phase 2 — the rows this milestone's findings touch; not an end-to-end `/triage` rewrite)

Prioritized ledger of the active `work/todos/` inbox. Rewritten end-to-end by `/triage`; see `work/todos/README.md` for the disposition + priority vocabulary.

| Item | Type | Priority | Disposition | Aligns | Note |
|---|---|---|---|---|---|
| [concurrent-tree-commit-absorption](bugs/26-07-25.bug.concurrent-tree-commit-absorption.md) | bug | medium | live | v3 (D5) | Interim-mitigated (v3 M2 phase 1, 26-07-27): `git commit --only <paths>` is now the documented commit idiom (root `CLAUDE.md` § Conventions) and the hazard family is standing in `.claude/ADR.md` § Standing hazards with the git instance named and this filing cited; the remedy design fork — worktree isolation vs. staging discipline — remains deferred and is named as deferred in the hazard entry. |

## Closed in v3.memory-protocol (26-07-27, M2)

- [role-cards-capability-gated](../missions/v3.memory-protocol/todos/bugs/26-07-27.bug.role-cards-capability-gated.md) — filed out of phase 1's Reconnaissance gate (D-C) and resolved in the same pass (commit `0edbbe3`): seven `.claude/` role-card gates realigned from per-machine capability onto the per-repo seam declaration (`work/PROJECT.md` § Codebase graph), with the `<hostname>` → `<machine>` rider in `.claude/agents/executor/workflows/execute-milestone.md`.
- [initialize-presence-probe-unconditional](../missions/v3.memory-protocol/todos/bugs/26-07-27.bug.initialize-presence-probe-unconditional.md) — the close-blocking defect, resolved by phase 1's matched-pair amendment. **Discharge confirmed here**: phase 2's `/initialize` run reads check 2b **inapplicable per declaration**, which is exactly the status the fix was written to produce, verified against the landed wording rather than assumed. The proof is **partial** while check 2a (`chrome-devtools`) fails — that failure is machine-side and unrelated to this bug, but it means the audit as a whole is not green, so the bug's own discharge is evidenced by check 2b in isolation rather than by a green run.
- [milestone-log-skeleton-sessions](../missions/v3.memory-protocol/todos/bugs/26-07-27.bug.milestone-log-skeleton-sessions.md) — resolved by phase 1's rider commit, landed last per the dispatched-file-ownership hazard.

All three carry `status: done` and `resolution:` frontmatter, per D-L; they stayed in `work/todos/bugs/` until the close ceremony carried them into `work/missions/v3.memory-protocol/todos/bugs/`.

## Closed earlier (26-07-26)

- [orchestration-return-path](../missions/v2.repo-hygiene/todos/bugs/26-07-25.bug.orchestration-return-path.md) — resolved through its normal workflow: M2 phase 3 wrote `resolution:` frontmatter and `## Resolution (26-07-26)` from the battery-2 verdicts (commit `d95572f`). Stayed in `bugs/` until the close per the fold-and-close runbook's disposition table (now archived at `work/missions/v2.repo-hygiene/runbooks/fold-and-close.md`); the close ceremony carried it into the mission archive at that path, as the runbook pinned.
