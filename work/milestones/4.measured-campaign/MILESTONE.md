---
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — stubbed at charter
---

# Milestone 4 — measured-campaign: success demonstrated in a consuming repo

> Stubbed at charter (26-07-28), retargeted at **amendment A1** (26-07-28) from the superseded intercom to the warmth-keeper + instrumented consult; hardens just-in-time via `/plan work/milestones/4.measured-campaign/`. Operator ruling at charter: success criterion 5 is discharged here — demonstrated, not projected. **Amendment A2 (26-07-29)** re-homed M1's TTL-window cells here from M3, whose soak was dropped under time pressure.

## Objective

Run one real campaign in `~/dev/lasers` (milestones already queued there) over the landed warmth-keeper and instrumented consult path, collect per-consult `usage` measurements, and analyze them against the charter's measurable test: mean consult cost collapsed toward cache-read rates, warm share near total, residual cold events enumerable.

## Scope (gist)

- The consuming repo adopts the updated product on its own terms (one-way valve; this mission edits no `lasers` files) and runs a queued campaign over the intercom.
- Measurement collection from the channel's emitted `usage` events; analysis appended to `work/notes/26-07-28.consult-token-cost-evidence.md` (D6).
- **M1's re-homed TTL-window cells (amendment A2)** — warmth held across **≥2 TTL windows** and **refresh-on-read**, read from the warmth-keeper's own telemetry (`~/.claude/warmth/telemetry.jsonl`) over the campaign's life. M3 proved the machinery with a two-beat smoke test; this milestone proves the *cadence* — that a 58-minute beat actually clears the 60-minute expiry — which a real campaign produces for free where a synthetic soak would have spent wall clock. The deliberate-expiry negative control was dropped at A2, not moved: M1 already measured the cold/warm ratio at 18.26×.
- The child-collection secondary benefit (`work/notes/26-07-25.child-collection-evidence.md`) observed and recorded: did the persistent superior behave as a collection point that cannot be abandoned?
- Output feeds M5's gate.

## Phase gists

| # | Phase | Gist |
| --- | --- | --- |
| 1 | instrument-and-run | Measurement capture ready; the lasers campaign runs over the intercom |
| 2 | analyze | Numbers against the measurable test; evidence note appended; batching-gate input prepared |

(Phase shape is a stub guess; hardening may recut it — in particular how the one-way valve shapes who runs what where.)

## Depends on

M3 (the full consult path live). The `lasers` repo's own milestone queue supplies the campaign.
