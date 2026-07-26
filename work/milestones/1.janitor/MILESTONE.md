---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect (stub)
  - architect@play/5d30e2de-8145-4fbd-b80c-c48bd99dff9c # milestone architect
  - executor@play/9362ff9f-c270-4704-97cc-14d527ba9f12 # campaign executor
---

# M1 — janitor: the declared-structure floor, the competency, and the proof

> Status: in progress — phases 1–3 done 26-07-25; phase 4 (prove) in flight, its dogfood pass complete and the `reference-gate` remedy order it filed now executing. The mission's single milestone (operator amendment at commission): the four phases below carry what a three-milestone shape would have. Campaign log: [`work/todos/26-07-25.execute-m1-janitor.md`](../../todos/26-07-25.execute-m1-janitor.md).

## Objective

Enact the adopted repo-hygiene proposal end to end: canonize the declared-structure floor, build the Janitor competency and its gates, and prove the system on this mission's own tree — closing only through the very gate it introduces (the first blocking milestone-close pass is this milestone's own).

## Scope

- **Floor into canon** (charter D2): `work/PROJECT.md § Structure` schema + template defaults into BASELINE's bootstrap guidance; the declaredness + reconciliation doctrine and the five audit axes into `work/README.md`; this repo's own § Structure declaration authored as the exemplar.
- **Competency** (D3): `.claude/agents/janitor.md` — flat, per the proposal's named surface — carrying the axes, the declaration-reading protocol, the three-rung remedy ladder, and the boundary table; `.claude/commands/clean.md` (authority mode, composes `/triage` as one axis); role-ladder and command-family rows; BASELINE manifest same-commit.
- **Gate wiring** (D4): blessing hygiene lens (architect + manager); the required *where-artifacts-land* statement in all three planning-artifact shapes; advisory order-close checklist (manager); blocking milestone-close pass with ESCALATE halt (executor); ADR entry.
- **Dogfood, mechanize, enact, fold prep** (D5, D6): the first pass in anger against this tree — all five axes reported, all three rungs exercised, the two seeded declared-vs-actual divergences detected and dispositioned; `.claude/bin/reference-gate` landed via a blessed rung-2 remedy order (amendment below); proposal to `_enacted/`; fold keep-column derived from specification and rehearsed per the inherited runbook (`git show 26-07-23:work/missions/v1.subagent-boundary/runbooks/fold-and-close.md`).

## Out of scope

Everything the charter's Non-goals name: consuming-project fixes, dispatch/consult/archive mechanics, any executive tier, per-commit whole-canon gating, v1's carried design questions beyond the two seeded bugs. The `/close` ceremony itself remains the operator's — this milestone prepares the fold, it does not perform it.

## Determinations of this planning session

Settled in operator dialog 26-07-25, with the reference-gate fork routed to the mission architect (consult: `architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d`). These bind the phases below.

**P1 — Four phases, not three.** Gate wiring separates from competency authoring: seven surgical edits across the architect/manager/executor docs do not fit one Manager session alongside authoring two new product files, and the wiring cites the competency by path (a hard cross-phase premise).

**P2 — The Janitor is a flat `.claude/agents/janitor.md`.** Proposal-literal (D1 needs no revision). Dense but flat, on the `designer.md` precedent — a single file already carrying a two-mode duality. The pass procedure lives in `clean.md`'s routing and in the gate wiring, not in a `workflows/` directory.

**P3 — `/clean` is an escape hatch, not a habit.** Operator determination: hygiene is codified *within the normal workflow* — the blessing lens, the advisory order-close checklist, and the blocking milestone-close pass are the primary mechanism. Manually invoking `/clean` is a rare outlier for when a codebase has drifted anyway, not routine maintenance. Both `janitor.md` and `clean.md` must say so; the doctrine shapes the wiring's weight (the gates carry the load, the verb is the remedy of last resort).

**P4 — D2's "mechanism" includes executable tooling.** Mission architect's direction, bound: `.claude/bin/` is already product (`session-archive`, `consult`, `commit-guard` — manifest rows, smoke tests). The declaredness split maps as **engine → product, facts → seam**. A prose-only whole-canon axis — one every consuming project re-authors — is rejected as the very "prose without an owner" failure the mission exists to kill.

**P5 — `§ Structure` carries a sanctioned-absences subsection.** The declaration must be *a list a mechanism can read*, not prose buried inside a gate recipe. Sanctioned absences are structural facts and § Structure is the declared home for structural facts. This is what gives the sanctioned-absence set exactly one authoritative home.

**P6 — Charter footprint amendment (operator-approved 26-07-25).** `.claude/bin/reference-gate` lands **this mission**, via a typed rung-2 remedy work order under normal blessing in phase 4 — which gives the dogfood a real rung-2 subject rather than a manufactured one. The charter's Scope and the proposal's "Surfaces touched" are amended accordingly (recorded in `work/MISSION.md` § Amendments); the manifest row and the tooling smoke-test row land with it.

**P7 — The sequencing trap, bound.** Phase 1 defines the § Structure schema **without pre-reconciling this repo's diverged lists**. `.claude/BASELINE.md:49` names three post-scaffold paths; the gate recipe in `work/PROJECT.md` sanctions seven. If phase 1 quietly unifies them, the seeded subject evaporates and success criterion 3 becomes unsatisfiable. **The reconciliation is the dogfood's work** — the pass detects the divergence, and its disposition is the unification into § Structure.

**P8 — The genericity audit is carried twice.** Every phase's acceptance carries a local check (zero project-shaped facts entered the `.claude/` files that phase touched); phase 4's pass carries the whole-canon sweep. Local checks catch it at the point of authorship; the sweep proves it held.

**P9 — `/clean` invents no new container.** The pass writes no standing report doc: rung-1 fixes commit, rung-2 findings become work orders in `work/todos/`, rung-3 escalations are raised in-session to the operator. Persistence comes through the artifacts it creates. For phase 4, the pass record lands in that phase's `## Addendum` — which is where a campaign's record belongs by existing convention.

## Phases

| # | Phase | Gist | Difficulty | Status |
| --- | --- | --- | --- | --- |
| 1 | [floor](1.floor.md) | The declared-structure doctrine into `work/README.md`; § Structure schema + template defaults into BASELINE's bootstrap step 3; this repo's own declaration as exemplar | high | done (26-07-25) — landed seven pinned subsections, not five; see Addendum |
| 2 | [competency](2.competency.md) | `.claude/agents/janitor.md` + `.claude/commands/clean.md`; role-ladder and command-family rows; BASELINE manifest | high | done (26-07-25) — nine pinned headings; two contractual; see Addendum |
| 3 | [wiring](3.wiring.md) | Blessing hygiene lens · where-artifacts-land in all three planning shapes · advisory order-close · blocking milestone-close with ESCALATE halt · ADR · child-collection rule (A3) | medium | done (26-07-25) — nine sites; zero nudges; see Addendum |
| 4 | [prove](4.prove.md) | The pass in anger: five axes, three rungs, both seeded divergences; `.claude/bin/reference-gate` via blessed remedy order; proposal → `_enacted/`; fold rehearsal | high | done (26-07-25) — 4a pass; 4b `reference-gate` + divergence A; 4c enactment, fold rehearsal, closing sweeps; see each session's Addendum. Milestone close is the Executor's blocking pass |

## Acceptance

The mission's success criteria 1–5, verified at this milestone's close — through the new blocking pass itself: this milestone cannot close until the gate it built says so, or escalates its contestable findings explicitly.

1. **The floor is canon.** `work/README.md` states the declaredness + reconciliation floor and names the five audit axes; `.claude/BASELINE.md` bootstrap step 3 specifies the § Structure schema with generic template defaults; `work/PROJECT.md § Structure` is filled as the exemplar.
2. **The competency is product.** `.claude/agents/janitor.md`, `.claude/commands/clean.md`, and `.claude/bin/reference-gate` exist, are BASELINE-manifested, and are reachable from the role ladder and command family.
3. **The gates are wired.** The blessing hygiene lens, the where-artifacts-land requirement in the milestone-phase / work-order / milestone-README shapes, the advisory order-close checklist, and the blocking milestone-close pass all appear in their named docs, with the blocking pass's automatic-mode ESCALATE halt stated.
4. **The proof holds.** The dogfood pass ran, all five axes reported (finding or explicit none-found), all three rungs exercised and recorded, and both D6 seeded divergences were detected and dispositioned.
5. **Enactment and fold prep filed.** Proposal at `work/proposals/_enacted/` with stamp and reconciliation notes; fold keep-column derived from specification (never the tree) and rehearsed, the new product files present in it.
6. **The genericity test holds.** Zero project-shaped facts in `.claude/` — verified by the phase-4 sweep.
7. **The comprehension test.** A fresh session reading only the docs would (a) author a project's § Structure declaration at bootstrap, (b) state where artifacts land in any plan and expect the blessing lens to check it, and (c) run a pass and know which rung each finding belongs to.
