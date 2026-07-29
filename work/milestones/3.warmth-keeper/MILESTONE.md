---
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — stubbed at amendment A1
---

# Milestone 3 — warmth-keeper: always-warm without a held-open process

> Stubbed at **amendment A1** (26-07-28), replacing the superseded `2.intercom` lifecycle machinery and `3.protocol-integration`; hardens just-in-time via `/plan work/milestones/3.warmth-keeper/`. This is the mission's crux (charter success criterion 2).

## Objective

Build the scheduler that holds registered superior handles warm by firing trivial read-only fork pings just under the measured TTL — delivering always-warm economics with none of the process-keeping machinery the original charter proposed, per **D7** (cache residency is byte-bound: it survives process death and fork identity).

## Scope (gist)

- **The keeper as product** — `.claude/bin/`, BASELINE-manifested, project-generic; machine facts route to the `work/PROJECT.md` seam.
- **Registration lifecycle** — handles register at campaign open, release at campaign close.
- **Activity-windowed cadence**, from M1's measured economics: beats just under 60 minutes while a campaign window is active; hold through any quiet gap shorter than the ~19-hour break-even; lapse across multi-day dormancy. Not always-on — continuous warmth costs ~2.4× per day against 2× for one cold reload, so a literally-always-on policy is roughly break-even at one-consult-per-day traffic.
- **Stall semantics** (herdr citation) — a beat that hangs must **return**, never wedge. Failure degrades harmlessly: a missed or failed beat costs at most one cold reload, never a lost consult.
- **Canon + role cards** — the registration convention in `work/README.md` § The callback grammar and the consulting role cards (architect, executor, manager); the fork ladder stays the sole consult transport (D3).
- **Proposal enactment** — `work/proposals/26-07-28.always-warm-intercom.md` files to `_enacted/` with a reconciliation note recording that its premise was confirmed and its mechanism superseded by A1.

## Acceptance evidence — re-homed from M1 phase 2

M1's held economics cells land here rather than as a standalone matrix, because the keeper's own telemetry *is* the measurement: its first beats on a cold prefix are the cold cells, its steady-state beats are the warm cells, and the instrumented consult (M2) captures all of it. Required: warmth held across **≥2 TTL windows**, **refresh-on-read** confirmed, and **one expiry cell** as negative control.

## Design inputs recorded at the M2 phase-1 gate (26-07-29)

Supplied by the mission architect as named inputs to this milestone's hardening dialog — a stub that anticipates these is better than one that meets them in production:

- **Rate limiting is a first-class beat outcome, not an error.** M2 phase 1 found the wire carries a `rate_limit_event` type M1 never enumerated. A cadence-firing keeper is the textbook caller to meet rate limiting, and the economics are asymmetric: beats are pure overhead, so a rate-limited beat that tight-retries converts an efficiency mechanism into a cost source and feeds the very limit it hit. **Response is defer-to-next-window — skip the beat, never retry inside it.** The designed failure bound already absorbs this: a skipped beat's worst case is one cold reload, exactly the stall-semantics ceiling this milestone's scope pins.
- **Count rate-limited beats distinctly from failed beats.** Charter success criterion 5 requires residual cold events to be *enumerable*; a rate-limited beat window is one of the enumerable causes, and M4's warm-share analysis can only attribute it if the telemetry separates it.
- **Beat failure is a returned state, not an exception.** On bun 1.3.14 `spawnSync` returns with `run.error` set and `status: 143` rather than throwing. A keeper written around try/catch would miss the real failure shape.
- **Inherit the parser's posture.** M2's deliberate non-exhaustive switch on event `type` is the right contract for a wire that gains types without notice; anything built on it tolerates unknown types the same way.

## Depends on

M2 — the keeper's beats are consult-shaped children and its acceptance evidence is usage telemetry, so it is built *on* the instrument and measured *by* it.
