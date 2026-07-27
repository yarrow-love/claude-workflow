---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # milestone architect (same session — M2 planned in the mission-architect dialog, charter A4)
  - executor@play/2cb889b5-b570-4b6d-b435-c315de40e68d # campaign executor (26-07-26)
  - architect@play/af2462db-cc36-4d78-b87b-ff3d94902168 # milestone architect — re-plan after the premise inversion (26-07-26)
  - executor@play/8fe0fe38-cfe6-4ae9-ac66-24894da08919 # campaign executor — resumed against the re-plan (26-07-26)
---

# M2 — return-path: map the topology that actually holds, then fix the model

> Status: **in progress — re-planned 26-07-26 at milestone tier** after phase 1 ran PARTIAL and inverted the premise. P1-a falsified H′ on CLI 2.1.220: a depth-2 child's asynchronous result was delivered to its depth-1 dispatcher after that dispatcher's turn ended — the inverse of the chartered topology, and a version flip against M1's 2.1.218 evidence. The re-plan (operator dialog, four forks settled) keeps the milestone on evidence-then-doctrine rails: phase 2 runs a **cartography battery** against the topology that actually holds, phase 3 lands **version-robust doctrine** via a pre-authored decision table. Phase 1's record stands as history: [`work/todos/26-07-26.probes.md`](../../todos/26-07-26.probes.md); campaign: [`work/todos/26-07-26.execute-m2-return-path.md`](../../todos/26-07-26.execute-m2-return-path.md).
>
> Originally planned 26-07-25 in the mission-architect dialog (charter A4; design authority: the adopted proposal [`work/proposals/26-07-25.return-path.md`](../../proposals/26-07-25.return-path.md) and the seeding filing [`work/todos/bugs/26-07-25.bug.orchestration-return-path.md`](../../todos/bugs/26-07-25.bug.orchestration-return-path.md)). `depends-on` M1.

## Objective

Map, on evidence, where the platform actually routes subagent results on the pinned CLI — the chartered star-topology theory is dead, falsified by phase 1 — and move the dispatch doctrine onto ground that survives version flips. The battery (phase 2) charts the behavior doctrine must live with: whether synchronous collection is reliably obtainable, where asynchronous and continuation results land, whether any upward channel exists. Doctrine (phase 3) lands only what the map supports, under the version-robust bar, or escalates. The remedy still replaces prose discipline (A3's rule, breached five times by well-briefed sessions) with an idiom whose shape carries the discipline — with the added constraint, taught by the flip itself, that the idiom may not depend on which routing the platform happens to implement this month.

## Scope

- **The cartography battery** (phase 2): environment re-pin; the `run_in_background` discriminant; delivery-to-dispatcher replication; fan-out; the continuation path and the stopped-vs-deferred separation; upward addressing; type control; tool surfaces; the forensic re-read of the M1 corpus against the new model. Verdicts with verbatim file-level evidence; the filing's confidence ledger fully re-dispositioned.
- **Doctrine from the map** (phase 3, decision-table-gated): the routing-independent invariant; the idiom clause the verdicts license; the continuation rule in whichever form Q4 supports; nudge graduation; A3 reconciliation (annotated, not rewritten); ADR entry recording the version flip + standing-hazard entry; enactment filing and the seeding bug's disposition — or the tabled escalations.

## Out of scope

- Consult mechanics, session archive, the specialist roster — the A4 override is scoped to the return-path defect only.
- Any canon change during phase 2 — probes are read-only with respect to `.claude/` and doctrine.
- Settling the reserved outcome: if verdicts show depth-1 orchestration unsound *per se*, that escalates to the operator (R4); no agent settles it.
- Platform fixes (a real subagent inbox is Anthropic's to build, not ours to simulate).

## Determinations of the original planning session

Settled in the mission-architect operator dialog, 26-07-25. These bind the phases except where the 26-07-26 re-plan block below explicitly revises them.

**R1 — Verdicts precede design.** The probe battery is the only admissible evidence (v1 D2's standing lesson: this platform's dispatch behavior has flipped twice in a year). Phase 2 is deliberately thin until phase 1 closes; it hardens via `/plan` with the verdicts in hand — the v1 spike→conversion structure, reused. *(Mechanism revised by R10; the principle — doctrine from verdicts, never before — stands.)*

**R2 — The probe parent is the root observer.** The theory's subject *is* where results land relative to the root, so the probes cannot run headless under a dispatched Manager — the instrument would sit inside the phenomenon it measures. The campaign Executor stages an **interactive probe-parent launch recipe for the operator** (v1 M1 precedent); the probe-parent session is the root, performs the dispatches and nudges, and its transcript archives as evidence.

**R3 — Probes are canon-read-only.** Probe phases land artifacts in `work/todos/` (the campaign work order carrying recipes + verdicts) and the phase doc's `## Addendum`; scratch in `tmp/` (declared present-by-convention, ignored). Zero edits to `.claude/`, settings, or doctrine.

**R4 — The reserved outcome.** If reliable receipt proves to be a property only the root has *and* the constrained idiom cannot compensate, that is a finding about the tier ladder itself. Phase 3 does not settle it: it ESCALATEs to the operator with the verdicts attached (charter A4).

**R5 — Behavior over prose.** Tool-surface capture is evidence for the affordance claim, never a doctrine source — surfaces demonstrably vary by tier and version. Doctrine cites observed behavior only.

**R6 — M2 closes through the janitor gate.** The blocking milestone-close hygiene pass (M1 phase 3's product) applies to this milestone like any other.

## Determinations of the re-planning session

Settled in the milestone-architect operator dialog, 26-07-26, after phase 1's premise inversion. Four forks were put to the operator; all four resolved on the architect's recommendation.

**R7 — Cartography, not hypothesis-test.** Battery 1's structural failure was its shape: a hypothesis-test with a battery-wide early-exit rule, run when the actual need was a map. Battery 2 carries per-probe verdicts, **no battery-wide early exit**; a verdict that kills another probe's premise cancels only the arms that literally depend on it, each cancellation naming its killer. Falsification of a prediction is a map datum, not a stop condition.

**R8 — The discriminant is first.** The `run_in_background: false` nondeterminism (honored in one root session, overridden in another — same version, tier, type, day) is the battery's first substantive probe: every doctrine candidate leans on the answer, and every later synchronous arm reads its verdict.

**R9 — The version-robust bar.** Doctrine may sanction only idioms observed correct under **both** known routings (2.1.218 collapse-to-root; 2.1.220 delivery-to-dispatcher); any platform behavior doctrine relies on is named in the ADR with its version pin. Canon never encodes routing-contingent behavior — the next flip must invalidate a recorded assumption, not silent doctrine.

**R10 — Decision table + consult replaces the second `/plan`.** Phase 3 is pre-authored as a verdict→landing table (its § Decision table); the campaign proceeds on an architect consult ruling the verdicts against it. Out-of-table patterns and the two named operator forks (A: sync-only vs background-iff-collected-in-turn; B: the nondeterminism escalation) go to the operator before doctrine lands. R1's spirit is preserved: the table fires only on verdicts.

**R11 — Carried forward unchanged**: R2 (root observer), R3 (canon-read-only), R4 (the reserved escalation), R5 (behavior over prose), R6 (janitor gate at close). Phase 1's record ([`work/todos/26-07-26.probes.md`](../../todos/26-07-26.probes.md)) is historical — battery 2 extends its evidence and never edits or re-litigates it.

## Phases

| # | Phase | Gist | Difficulty | Status |
| --- | --- | --- | --- | --- |
| 1 | [probes](1.probes.md) | Battery 1 (hypothesis-test): P1-a falsified H′; early exit at 1 of 10 probes; delivery-to-dispatcher observed at n=1 | medium | **closed PARTIAL (26-07-26)** — premise inverted; record historical |
| 2 | [cartography](2.cartography.md) | Battery 2 (map): the `run_in_background` discriminant first, then delivery replication, fan-out, continuation/stopped-vs-deferred, upward addressing, type control, surfaces, forensic re-read — no early exit (R7) | medium | pending |
| 3 | [doctrine](3.doctrine.md) | Version-robust doctrine (R9) via the pre-authored decision table + architect consult (R10): routing-independent invariant, idiom clause, continuation rule, nudge graduation, A3 reconciliation, ADR flip entry + standing hazard, filings — or the tabled escalations | high | pending |

## Acceptance

The mission's success criterion 6, verified at this milestone's close — through the blocking hygiene pass (R6).

1. **Environment re-pinned.** Battery 2's pin recorded and version-consistent with battery 1's 2.1.220, or the drift flagged and operator-resolved before probes ran; every verdict cites the pin.
2. **The map is complete.** Every probe Q1–Q8 carries recipe, verbatim evidence, transcript citation, and verdict; no battery-wide early exit; every cancelled arm names the verdict that killed its premise.
3. **The discriminant dispositioned.** The `run_in_background` honoring variable named with evidence — or recorded as `nondeterministic within identical parameters`, firing phase 3's escalation row.
4. **Reconciliation total.** The filing's eight-row confidence ledger fully re-dispositioned on battery-2 evidence, no row left `untested`; the filing's falsification conditions restated against the new model or marked obsolete-by-inversion, by name.
5. **Doctrine landed or escalated.** Phase 3 landed doctrine per its decision table under the R9 bar (reference-gate + genericity checks passing, the C10 contradiction reconciled, operator forks carrying operator resolutions) — or delivered a tabled escalation with verdicts attached; never both unresolved.
6. **Filed.** `26-07-25.return-path.md` moved to `_enacted/` with stamp; the seeding bug's `## Resolution` written from the verdicts; ADR D3 + § Standing hazards entry landed.
