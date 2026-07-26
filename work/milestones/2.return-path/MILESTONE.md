---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # milestone architect (same session — M2 planned in the mission-architect dialog, charter A4)
  - executor@play/2cb889b5-b570-4b6d-b435-c315de40e68d # campaign executor (26-07-26)
---

# M2 — return-path: probe the orchestration topology, then fix the model

> Status: pending — planned 26-07-25 in the mission-architect dialog (charter A4; design authority: the adopted proposal [`work/proposals/26-07-25.return-path.md`](../../proposals/26-07-25.return-path.md) and the seeding filing [`work/todos/bugs/26-07-25.bug.orchestration-return-path.md`](../../todos/bugs/26-07-25.bug.orchestration-return-path.md)). `depends-on` M1; phase 2 is a verdict-gated stub by design.

## Objective

Settle, on evidence, whether the platform's return flow is a star while its control flow is a tree — and if so, move the dispatch doctrine off the assumption the platform does not honor. Phase 1 runs the decisive probe battery on the pinned CLI; phase 2 lands the doctrine the verdicts support, or escalates the one finding reserved to the operator. The remedy replaces prose discipline (A3's rule, breached five times by well-briefed sessions) with an idiom whose shape carries the discipline.

## Scope

- **The probe battery** (phase 1): environment pin; the five falsifiable probes from the proposal — background-dispatch collapse, synchronous control, upward addressing, the continuation path, per-tier tool-surface capture; verdicts with verbatim evidence; reconciliation against the filing's confidence ledger.
- **Doctrine from verdicts** (phase 2, verdict-gated): the likely landing — synchronous collection as the only sanctioned dispatch form below the root (fan-out as parallel dispatches collected in one turn); continuations transcript-read, never awaited; the Executor nudge graduated to standing recovery; A3 reconciled (annotated, not rewritten); ADR entry — plus enactment filing (proposal → `_enacted/`) and the seeding bug's disposition.

## Out of scope

- Consult mechanics, session archive, the specialist roster — the A4 override is scoped to the return-path defect only.
- Any canon change during phase 1 — probes are read-only with respect to `.claude/` and doctrine.
- Settling the reserved outcome: if verdicts show depth-1 orchestration unsound *per se*, that escalates to the operator (R4); no agent settles it.
- Platform fixes (a real subagent inbox is Anthropic's to build, not ours to simulate).

## Determinations of this planning session

Settled in the mission-architect operator dialog, 26-07-25. These bind the phases.

**R1 — Verdicts precede design.** The probe battery is the only admissible evidence (v1 D2's standing lesson: this platform's dispatch behavior has flipped twice in a year). Phase 2 is deliberately thin until phase 1 closes; it hardens via `/plan` with the verdicts in hand — the v1 spike→conversion structure, reused.

**R2 — The probe parent is the root observer.** The theory's subject *is* where results land relative to the root, so the probes cannot run headless under a dispatched Manager — the instrument would sit inside the phenomenon it measures. The campaign Executor stages an **interactive probe-parent launch recipe for the operator** (v1 M1 precedent); the probe-parent session is the root, performs the dispatches and nudges, and its transcript archives as evidence.

**R3 — Probes are canon-read-only.** Phase 1 lands artifacts in `work/todos/` (the campaign work order carrying recipes + verdicts) and the phase doc's `## Addendum`; scratch in `tmp/` (declared present-by-convention, ignored). Zero edits to `.claude/`, settings, or doctrine.

**R4 — The reserved outcome.** If reliable receipt proves to be a property only the root has *and* the constrained idiom cannot compensate, that is a finding about the tier ladder itself. Phase 2 does not settle it: it ESCALATEs to the operator with the verdicts attached (charter A4).

**R5 — Behavior over prose.** P5's tool-surface capture is evidence for the affordance claim, never a doctrine source — surfaces demonstrably vary by tier and version (the Executor's surface advertises background-default; the architect's presents opt-in). Doctrine cites observed behavior (P1–P4) only.

**R6 — M2 closes through the janitor gate.** The blocking milestone-close hygiene pass (M1 phase 3's product) applies to this milestone like any other — its second firing, first on a milestone that didn't build it.

## Phases

| # | Phase | Gist | Difficulty | Status |
| --- | --- | --- | --- | --- |
| 1 | [probes](1.probes.md) | Environment pin; the five-probe battery through an operator-launched probe-parent session; verdicts + reconciliation table | medium | pending |
| 2 | [doctrine](2.doctrine.md) | Verdict-gated: constrained idiom + continuation rule + nudge graduation + A3 reconciliation + ADR; enactment + bug disposition — or the R4 escalation | high | pending — stub; harden via `/plan` after phase 1 |

## Acceptance

The mission's success criterion 6, verified at this milestone's close — through the blocking hygiene pass (R6).

1. **Environment pinned.** The exact CLI version and the effective subagent-depth configuration are recorded in the phase-1 work order; every verdict cites them.
2. **Verdicts complete.** All five probes carry verdicts with verbatim evidence, each reproducible from its written recipe; the three falsification conditions from the filing are explicitly dispositioned (parent received a background result → theory dead; child reached parent by name → asymmetry dead; sync-collection breaches recurred → affordance not the inducement).
3. **Reconciliation.** Each claim in the filing's confidence ledger is marked confirmed / falsified / unresolved on the pinned version.
4. **Doctrine landed or escalated.** Phase 2 either lands the verdict-supported doctrine (constrained idiom, continuation rule, nudge graduation, A3 reconciliation note, ADR entry — genericity local check passing) or delivers the R4 escalation with verdicts attached; never both unresolved.
5. **Filed.** `26-07-25.return-path.md` moved to `_enacted/` with stamp; the seeding bug's `## Resolution` written from the verdicts.
