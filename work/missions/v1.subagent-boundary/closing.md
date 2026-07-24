---
mission: v1.subagent-boundary
branch: 26-07-23
tag: v1.subagent-boundary-closed
closed: 26-07-24
outcome: accomplished
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect
  - executor@play/2bd6ea6d-d5b5-43cb-bfcc-743b1494caa2 # M3 executor; ceremony's mechanical arm
---

# Mission v1 — closing report

## Outcome

**Accomplished.** Rendered by the operator, 26-07-24, verbatim:

> Mission Accomplished.

Drafted by the Executor; the verdict is the operator's own utterance, recorded as spoken. The Executor did not render it — this campaign was criterion 3's measuring instrument, and an instrument cannot certify its own reading.

## Success criteria

| # | Criterion | Outcome |
| --- | --- | --- |
| 1 | M1's five probes recorded with verdicts; conversion proceeded only on pass | **Met.** Probe battery run against pinned v2.1.218. Premise 1 was *falsified* — nesting ships default-on and deep, and the spawn-depth variable is a restrictive **cap**, not an enabler. Conversion proceeded because the capability the mission needed was present, not because the premise held |
| 2 | Canon converted; apparatus retired; env gate baselined and audited; `session-archive` sweeps subagent transcripts; escalation-as-pause documented | **Met.** M2, run *through* the boundary it was converting |
| 3 | A real campaign under the new boundary, operator observing live panels; call-and-response both directions, recorded | **Met, in the strong form.** Downward nudge: M2 phase 2, cited; corroborated twice more. Upward pause-and-ask: M3 phase 3's merge-vs-squash question — a Manager holding a decision it was capable of making, ending its turn to ask, resuming on a SendMessage answer that differed from what it would have chosen alone. Operator attestation authored unprompted during phase 3's live run |
| 4 | Enactment filed; reconciliation notes appended | **Met.** M3 phase 1 |
| 5 | Fold-back prepared per D4: `main` product-only; doctrine rewritten; branch tagged, carrying the archive | **Met and executed.** Prepared and rehearsed by M3 phase 3; executed in this ceremony under operator authorization recorded at M3's Reconnaissance gate |

No failure criterion fired. No probe failed load-bearing; platform behavior was pinned and held; observability improved rather than regressed, which is the criterion-3 attestation's substance.

## What shipped, and what did not

**Shipped:** the boundary conversion across canon; the spawn-depth cap baselined and audited; whole-tree archive sweep; `.claude/ADR.md` — the decision register, so future agents read decisions instead of excavating branches; the D4 doctrine rewrite; and the purified `main`.

**Did not ship, deliberately:** the `/configure` command (never scheduled, still wanted); the LAN intercom (Orchestra's, halted valve untouched); depth-2 SendMessage certification (evidence base closed with M1 plus campaign instances). Four design questions were surfaced and deferred rather than settled under close pressure — see *Carried forward*.

## What the work system itself taught

The part a future mission should actually mine.

**A premise can invert without the design failing.** Premise 1 was wrong in the opposite direction from the one that would have hurt. The design item survived whole, re-rationalized from gate to cap. The standing lesson — *this capability is configured and audited, never assumed* — was vindicated by being wrong, which is the strongest form of vindication available to a caution.

**Verdict-absence is a reproducible property of the boundary, not an anecdote.** Three stops across two campaigns, one consistent trigger: **a Manager dispatches a child near the end of its work and treats the dispatch as completion.** The third instance carried the sharpest detail — that Manager had genuinely correct reasons to wait, and *the correctness of the reason to wait made the parking feel like discipline rather than a stop*. The SendMessage nudge recovered all three cleanly, with context intact. **This is the single most actionable finding in the mission** and is deliberately *not* in the ADR: M3's doctrine edit was bounded to one entry, and widening it after close would be the overreach the bound exists to prevent. It carries forward as a design question.

**File ownership across the manager/specialist boundary is a real hazard**, and it fired four times — the fourth against the very phase writing it into the ADR. Rule, now in `.claude/ADR.md` § Standing hazards: *dispatching an agent onto a file transfers ownership until it reports, and a final-mile exception does not implicitly revoke that.*

**A rehearsal validates the recipe against the tree it can see; the ceremony runs against a tree that does not exist yet.** The first fold rehearsal passed every visible check while carrying a defect that would have smuggled the mission archive into a purified `main` — because the archive is moved in *upstream* of the fold. No amount of running the rehearsal catches that. It was caught by reasoning about the ceremony-time tree, then proven by simulating it. Generalized: **derive keep-column membership from the specification, never from the tree.** A tree-derived pattern answers "what looks like scaffold here, now"; a specification-derived list answers "what scaffold *is*".

**Agents corrected their own records rather than overwriting them.** A misattributed prediction, a miscounted vindication, a review wrongly recorded as never returning (*file-size polling is not a liveness check*). Each correction was left visible. A record that under-claims and then corrects is recoverable; one that over-claims is not.

**The two non-transferable protections earned their weight.** One operator sentence was *declined* as the criterion-3 attestation because it prefaced witnessing rather than performing it, and the Executor declined to draft a candidate line at all — a draft in that slot is exactly what could later be misread as the operator's words. The archive shows the instrument did not certify its own reading.

## Carried forward

Per the ceremony's triage. Nothing here is a defect the close could have settled; all four are design questions for a future template-genericity pass.

| Item | Disposition |
| --- | --- |
| `26-07-11.configure-command` | Archive open-carried; re-seed on a future mission branch |
| `26-07-22.lan-intercom` | Archives halted; the Orchestra one-way valve stays untouched |
| Verdict-absence as a recurring property | **New.** Three in-anger instances with a consistent trigger; the remedy is proven but manual. Whether the canon should make child-collection explicit before a Manager may end its turn is a design call |
| `bug.footgun-index-convention-drift` | Open design question spanning eight agent policy docs |
| `bug.baseline-postdate-list-divergence` | BASELINE names 3 post-scaffold paths; the gate's sanctioned list names 7. Mitigated by the runbook's inline list |
| `sessions:` not derivable from body stamps | Contradicts `work/README.md` § The callback grammar; pre-existing in every phase order and bug filing |
| Residue R1–R6 | Instance content *inside* keep-column files, which a path-level manifest cannot reach and the `.claude/`-only gate cannot see |

## Reader's index

The archive's front door. A future planner should read these and can skip the rest.

1. **[`proposals/26-07-23.subagent-manager-boundary.md`](proposals/26-07-23.subagent-manager-boundary.md)** — the design, plus the reconciliation note recording the premise-1 inversion. Start here.
2. **[`todos/_done/26-07-23.probe-battery.md`](todos/_done/26-07-23.probe-battery.md)** — the empirical spike. What the platform actually does, pinned to a CLI version.
3. **[`todos/_done/26-07-24.execute-validation-and-fold.md`](todos/_done/26-07-24.execute-validation-and-fold.md)** — M3's campaign log, carrying the **criterion-3 evidence ledger**: both call-and-response directions and the operator attestation, verbatim.
4. **[`runbooks/fold-and-close.md`](runbooks/fold-and-close.md)** — this workflow's first close-and-fold recipe, transcribed from a proven rehearsal. Future missions inherit it by reading it here.
5. **`.claude/ADR.md`** *(on `main`, not in this archive)* — the decision register. Where the mission's decisions live durably.

### The three permanently-LOST session handles — expected, not fold damage

The pre-flight sweep reports 27 handles / 13 UUIDs decomposing as **9 archived + 3 LOST + 1 collected at `SessionEnd`**. The three are unrecoverable and **no future reader should chase them**:

| Handle | Cause |
| --- | --- |
| `86ade408-7a9b-4edd-991a-6b3592ce377a` | Stamped in the 26-07-05 founding series — **predates** the 26-07-11 adoption of archive-on-stamp |
| `1063f991-16dd-4fef-bc25-ba8c37c9dd2c` | Same cause, same series |
| `3816fb23-acef-4f71-b79f-ce68441a6b21` | Orchestra relay; never ran with this repo as `cwd`, so no transcript exists under this project slug |

The first two are precisely the CLI-retention rot the durable-resumability proposal predicted, now realized — the convention was adopted *because* of this failure mode, and these stamps predate the fix. M3's acceptance was amended from "zero LOST" (unsatisfiable by any action) to **zero *new* LOST**, which was met.
