---
sessions:
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # mission architect — stub at charter
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # milestone architect — hardened 26-07-27, post-M1, same session
  - executor@play/a377b823-57a2-4f74-b03b-049170e6cef3 # campaign executor — /execute 26-07-27
---

# Milestone 2 — hazard-and-evidence

> **Hardened 26-07-27**, after M1 closed accomplished, incorporating its three carries (the close-blocking `/initialize` applicability bug, the fourteen-fact ledger inventory, the footgun-promotion question). Operator rulings at hardening: **the seam declaration governs the whole repo-side graph expectation** (a `None`-declaring `work/PROJECT.md` § Codebase graph switches it off as a unit; machine-side MCP presence stays unconditional); **two phases** (doctrine → validate); **the spot-check runs against the real `lasers` repo on a throwaway local branch** — never pushed, deleted at cleanup, evidence written to this repo's `work/notes/` — a scoped, operator-ruled allowance against the charter's consuming-repo non-goal (the one-way valve stands for anything durable); **the campaign-log skeleton bug folds into phase 1 as an out-of-charter mechanical rider**. Charter: [`work/MISSION.md`](../../MISSION.md); spec: the adopted proposal (charter D1); determinations D3/D4/D5 bind; M1 campaign log: [`work/todos/_done/26-07-27.execute-protocol.md`](../../todos/_done/26-07-27.execute-protocol.md).

## Objective

The shared-mutable-store family into `.claude/ADR.md` as a standing hazard with the P4 version-pin ledger; the mission's close-blocking `/initialize` applicability defect fixed as a matched pair under the operator's generalization ruling; the interim git fix landed; the protocol validated by a recorded live execution of its recipe as-written; the proposal enacted — discharging charter success criteria 4–7.

## Scope

- The ADR v3 mission block (decisions register + the P4 ledger reconciling the full recorded inventory) and the § Standing hazards family entry (both store instances, the canary, the recovery pointer, the deferred git fork named).
- The footgun-promotion adjudication: `work/footguns/canon-references.md` — promote to a standing hazard or keep ledger-local, with recorded reasoning (the reference gate ships in the template, so the trap plausibly travels with it).
- The matched-pair applicability amendment: BASELINE § Expectations graph bullet + `initialize.md` step 2, one commit, whole-expectation seam governance per the operator ruling; resolves `work/todos/bugs/26-07-27.bug.initialize-presence-probe-unconditional.md`.
- The interim git fix: `git commit --only` into root `CLAUDE.md` § Conventions; backlog row updated.
- The rider: `execute-milestone.md`'s campaign-log skeleton gains its `sessions:` frontmatter (resolves the low-severity bug).
- The live spot-check per the operator's design, with its feedback loop into the protocol text (charter SC6), and the `/initialize` green run.
- Enactment: the founding proposal to `_enacted/` with stamp and reconciliation notes.

## Out of scope

- **The git-index remedy design fork** (worktree isolation vs staging discipline) — deferred by charter; the hazard entry names it so it cannot silently drop.
- **Any durable change to `lasers`** — the throwaway branch is local-only, never pushed, deleted at cleanup; no edit lands outside it; nothing else in that repo is touched. The allowance covers exactly the spot-check.
- **Protocol text changes except spot-check feedback** — phase 1 leaves `.claude/protocols/codebase-graph.md` byte-identical (the ledger points at the protocol; the protocol stays version-free and pointer-free per M1 ruling A6); only phase 2's recorded discrepancies may amend it.
- **The 0.9.1 re-audit** — unless the release ships mid-milestone, in which case the named escalation in phase 1 fires (charter failure criterion 3's handling), not silent doctrine work.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [doctrine](1.doctrine.md) | ADR v3 block + ledger + family hazard; the matched-pair applicability fix; the interim git fix; the skeleton rider; footgun adjudication | done (26-07-27) |
| 2 | [validate](2.validate.md) | The lasers throwaway-branch spot-check with feedback loop; `/initialize` green; enactment filing | done (26-07-27) |

## Closed accomplished — 26-07-27

> executor@play/a377b823-57a2-4f74-b03b-049170e6cef3

Both phases done in one Manager pass each; the blocking hygiene pass ran clean (two rung-1 fixes, no rung-2 or rung-3 findings). All five milestone acceptance criteria met — charter success criteria 4–7 discharged, both bugs resolved in place, the P4 ledger reconciling the whole recorded inventory as a sixteen-item union with its arithmetic stated, `~/dev/lasers` as found in git state, and the reference gate at 0 failures.

The milestone's defining moment was the spot-check approaching charter failure criterion 2 — a correctly-formed flip returning 3 and 5 where canon says 0 — and the investigation showing all eight rows to be orphan `Folder` nodes from a superseded index generation, with zero `File` nodes under the same paths. **The operator confirmed the read** (ordinary discrepancy, not falsification), which is where the charter reserves it. Seven protocol amendments came out of the run; the flip query now counts `File` nodes rather than all labels. Campaign log: [`work/todos/_done/26-07-27.execute-hazard-and-evidence.md`](../../todos/_done/26-07-27.execute-hazard-and-evidence.md); evidence: [`work/notes/26-07-27.codebase-graph-spot-check.md`](../../notes/26-07-27.codebase-graph-spot-check.md).

## Acceptance

Milestone-level — the Executor's ultimate-acceptance test, over and above each phase's criteria:

1. Charter success criteria 4–7 are discharged: the hazard is standing with its ledger; the interim git fix is documented and the backlog row reflects it; the spot-check ran the recipe as-written with evidence recorded and discrepancies fed back; the proposal is enacted and both the quality gate and `/initialize` are green under the amended applicability semantics.
2. The close-blocking bug and the skeleton bug are resolved through their normal workflow (resolution frontmatter + section; they stay in `bugs/` for the close ceremony per precedent).
3. The P4 ledger reconciles the **whole** recorded inventory — M1's version-shaped facts and reconciliation notes (`work/todos/_done/26-07-27.author.md` § Summary + § Investigation I6; citation corrected and the thirteen-vs-fourteen discrepancy governed at the Reconnaissance gate, decision D-E), M1's two named 0.9.1-flip candidates, the charter's evidence-delta issue set — each as a ledger row or an explicit exclusion with reason; no silent drops.
4. `lasers` is left as found **in its git state** — original branch checked out, throwaway branch deleted, working tree clean, nothing pushed, no ignored content stranded — with the store deliberately left **repaired**: re-indexed at the original checkpoint and flip-verified, its three-day-stale pre-state captured first. (Operator ruling at the Reconnaissance gate, decision D-B: as found, the store held a stale index across a 342-file committed refactor; restoring that is re-breaking a known-wrong store, and derived edges would not survive a restore identically in any case.)
5. `bun .claude/bin/reference-gate check` — 0 failures; genericity holds on every `.claude/` change, with the one deliberate exception the charter's P4 defines: the ADR ledger is the sanctioned home for version strings and issue numbers.
