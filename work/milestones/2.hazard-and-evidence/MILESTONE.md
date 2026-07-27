---
sessions:
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # mission architect — stub at charter
---

# Milestone 2 — hazard-and-evidence

> **Stub** — gist-level at charter (26-07-27); hardens just-in-time via `/plan work/milestones/2.hazard-and-evidence/`. Charter: [`work/MISSION.md`](../../MISSION.md); spec: the adopted proposal (charter D1).

## Objective (gist)

The shared-mutable-store family into the ADR as a standing hazard with its P4 evidence ledger (charter D5); the interim git-instance fix landed; the protocol validated by a recorded live spot-check and the proposal enacted.

## Phase gists

1. **hazard + ledger** — ADR § Standing hazards gains the family entry: multi-session soundness of shared mutable stores, both known instances (git index — the concurrent-tree-commit bug; SQLite graph store — WAL-checkpoint starvation), the `.db-wal ≫ .db` canary, the recovery pointer into the protocol, and the deferred git design fork named so it cannot silently drop. The P4 version ledger lands with it: every reliance pinned (0.9.0 + upstream issue), absorbing the charter's evidence delta (#1296/#1191 serving-session staleness, #1206, #1083, #1037, #790, #1287/#1273) — the re-audit list on any binary upgrade, per the v2 D3 precedent.
2. **interim git fix** — `git commit --only` documented in the root `CLAUDE.md` commit conventions as the defensive idiom against concurrent-session hunk absorption; the bug's backlog row updated to interim-mitigated / fork-deferred.
3. **spot-check + enactment** — the verification recipe executed as-written from the landed protocol text against a real store (the `lasers` store read-only, or a small fixture; read-only in any foreign repo — the one-way valve), evidence recorded operator-visibly; discrepancies feed back into the protocol text before any fold. The proposal files to `_enacted/` with stamp; quality gate + `/initialize` green.

## Dependencies

Depends on milestone 1 — the hazard points at the protocol's recovery section, and the spot-check runs the recipe from the landed canon text, not from the proposal.
