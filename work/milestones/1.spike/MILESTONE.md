---
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — stubbed at charter
  - architect@play/c1378142-cf5c-4ad2-97b0-920533f97a7c # milestone architect
  - executor@play/c1378142-cf5c-4ad2-97b0-920533f97a7c # campaign executor
---

# Milestone 1 — spike: the always-warm theory under test

> Stubbed at charter (26-07-28); hardened 26-07-28 by the milestone architect. **This milestone is the mission's go/no-go gate** (charter failure criterion 1): refutation closes v4 unaccomplished.

## Objective

Confirm or refute the adopted proposal's corrected premise — always-warm reload at ~0.1× — empirically, before any machinery is built. Everything the charter lists as *spike-owned* becomes measured fact or refuting evidence, and the operator reads the numbers as the mission's go/no-go gate.

## Scope

The charter's three spike parts, split across two phases **by question** rather than by build-vs-run: phase 1 asks *does the channel work and stay inside its boundary*, phase 2 asks *is it cheaper*. Both of the mission's refutation-shaped failure criteria (observability lost; boundary lost) therefore resolve in phase 1, ahead of the more expensive economics run — a cheap early gate.

- **Phase 1 — channel**: the spike harness, the hold-open mechanics (session-id capture, live transcript append, the event wire, clean death and post-mortem resume), and the read-only boundary check.
- **Phase 2 — economics**: the four-cell cost matrix plus a heartbeat turn, the warm-fork corollary verdict, the heartbeat break-even, and the recorded gate reading.

Measurements append to [`work/notes/26-07-28.consult-token-cost-evidence.md`](../../notes/26-07-28.consult-token-cost-evidence.md) (D6).

## Out of scope

- **Product changes.** Nothing lands in `.claude/` this milestone — no `consult` edits, no new bin script, no BASELINE amendment. The channel becomes product in M2; here it is apparatus. The harness is deliberately *not* written as a `.claude/bin/` script so that M2 designs the product shape from the measurements rather than inheriting the spike's expedient one.
- **Canon rewiring.** `work/README.md` § The callback grammar and the role cards are M3's.
- **The consuming repo.** The one-way valve stands: the spike runs entirely inside this repo's working tree against this repo's own transcripts (see § Settled at planning). `~/dev/lasers` is M4's.
- **Fixing what the spike finds.** A discovered defect in the harness's own scaffolding is in scope; a discovered defect in `.claude/bin/consult` (e.g. the DENY-list version drift hazard — `.claude/ADR.md` § Standing hazards) is recorded, not repaired.

## Settled at planning

Operator rulings taken 26-07-28 in the planning dialog, binding on both phases:

1. **The observability bar is transcript + stream.** D4's gate is live incremental append to the local transcript store *and* the stream-json event wire. Claude Code v2.1.220 documents that `-p` sessions do not appear in the `--resume` picker; picker and Desktop-surface visibility are therefore **measured and recorded as findings, not gates** — their absence does not refute the mission, because the Executor's stall rules read the transcript file, not the picker.
2. **The test vehicle is in-repo.** The spike measures against this repo's largest local transcript, not the 46 MB `~/dev/lasers` one. Consults are repo-bound (`.claude/bin/consult` exits 4 on a cwd mismatch), and the verdict rests on *ratios* — `cache_read_input_tokens` against `cache_creation_input_tokens`, and the heartbeat break-even — which are scale-invariant. Absolute magnitude is presentational here; M4 supplies it at real campaign scale.
3. **The TTL regime is forced 5-minute.** The whole matrix runs under `FORCE_PROMPT_CACHING_5M=1` so the expiry cells cost minutes rather than hours. **The consequence is explicit and must be carried honestly**: Claude Code's production default is the 1-hour TTL, so the heartbeat cadence M2 needs is *reasoned* from 5-minute measurements, never measured at production TTL. The evidence note must say so in the same breath as the number.
4. **The harness is committed apparatus.** It lands in `work/milestones/1.spike/harness/` and archives with the mission; raw stream logs go to gitignored `tmp/spike/`.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [channel](1.channel.md) | Harness + hold-open mechanics (session-id capture, live append, event wire, clean resume) + the read-only boundary check | **closed 26-07-28 — all 14 criteria met, no refutation** |
| 2 | [economics](2.economics.md) | Four-cell cost matrix + heartbeat under forced 5m TTL; warm-fork corollary; break-even; the gate reading | **superseded → A1** (re-homed to the warmth-keeper milestone) |

## Closing status — done (26-07-28)

Phase 1 closed **accomplished**; phase 2 **superseded by charter amendment A1**, its residual questions (TTL-window hold, refresh-on-read, expiry control) re-homed as [milestone 3's](../3.warmth-keeper/MILESTONE.md) acceptance evidence, where the keeper's own telemetry supplies them without a standalone matrix.

**The go/no-go gate was ruled GO** — in the strongest available form: the operator re-chartered the mission in the direction the spike established. Charter success criterion 1 is thereby discharged; the gate is not left dangling.

The verdict in one line: **the premise was confirmed and the mechanism was superseded.** Warm/cold measured at ~18× ($0.233 against $4.26 on the same prefix), and cache residency proved **byte-bound** — surviving process death and fork identity — which retired the held-open channel before it was built. Full record: `work/MISSION.md` § Amendment A1 and `work/todos/_done/26-07-28.execute-m1-spike.md`.

## Acceptance

The Executor's ultimate-acceptance test for the milestone:

1. **Both phases closed against their own acceptance**, with phase 1's mechanics-and-boundary gate passed before phase 2's matrix ran.
2. **All three charter spike parts are answered on the record** — hold-open mechanics, the four-way cost matrix plus heartbeat, and the read-only boundary check — each as a measured fact or as refuting evidence, with the raw numbers (not a summary) in [`work/notes/26-07-28.consult-token-cost-evidence.md`](../../notes/26-07-28.consult-token-cost-evidence.md) per D6.
3. **The spike-owned list is retired.** Every item the charter marks spike-owned (§ Settlement — charter-verified vs spike-owned) has a verdict: live transcript append; mid-flight surface visibility (as a finding per ruling 1); channel turns hitting the warm cache; the heartbeat holding warmth; the warm-fork corollary; and the channel answering without acquiring the ability to act.
4. **The extrapolation is declared, not buried.** Wherever a 1-hour-TTL number is inferred from a 5-minute measurement, the evidence note says which is measured and which is reasoned (ruling 3).
5. **No product changed.** `git diff` for the milestone touches no path under `.claude/`.
6. **The gate is ruled — operator-gated.** The operator reads the numbers and records go / no-go in this document. A no-go closes the mission unaccomplished per charter failure criterion 1; the phases produce the recommendation, never the ruling.

## Depends on

Nothing. First milestone; the mission's remaining roadmap is contingent on its verdict.
