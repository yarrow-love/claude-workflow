---
mission: v4.token-efficiency
branch: v4.token-efficiency
status: chartered (amended A2, 26-07-29)
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — chartered at operator commission; ruled amendment A1
  - architect@play/c1378142-cf5c-4ad2-97b0-920533f97a7c # milestone architect (M1) — authored amendment A1
  - executor@play/c1378142-cf5c-4ad2-97b0-920533f97a7c # campaign executor (M1) — produced A1's evidence
  - architect@play/a3117b31-b7e0-4a55-bc48-fc6a0a163214 # milestone architect (M3) — authored amendment A2
---

# Mission v4 — token efficiency: the always-warm intercom

> Chartered 26-07-28 by operator commission, founded on the adopted proposal [`work/proposals/26-07-28.always-warm-intercom.md`](proposals/26-07-28.always-warm-intercom.md) — the revision that superseded the rejected resume-era proposal (`work/proposals/_rejected/26-07-28.persistent-intercom-and-consult-economy.md`) at this mission's founding. Fourth mission this repo has chartered (predecessor: `v3.memory-protocol`, closed accomplished 26-07-27); rides branch `v4.token-efficiency` off `dev` (mission = branch). Operator rulings at charter: batching is a **conditional final milestone**; the v3 close's link-gate recommendation is a **queued non-goal**; success requires **one measured campaign** in a consuming repo; spike refutation closes the mission **unaccomplished**.

## Objective / why now

**Make consults cheap, and make their cost observable.** Collapse per-consult cost from a cold write of the superior's whole context (1.25–2× input price, full prefill latency) toward warm cache reads (~0.1×, fast prefill) by keeping the superior's prefix *warm* — and instrument the consult path so that collapse is demonstrated rather than asserted. Why now: the observability upgrade (fresh headless dispatches → `--resume --fork-session` callbacks) regressed token spend and wall-clock sharply, measured 26-07-28 on a real flagship transcript (~60 MB raw; the consult-heaviest handle is precisely the largest).

**Amended at A1 (26-07-28), on M1's evidence.** The mission opened proposing a persistent stream-json intercom as the mechanism. M1 measured the premise true (~18× warm/cold) *and* established that prompt-cache residency is **byte-bound** — it survives process death and fork identity (D7). Warmth therefore needs no held-open process: a warmth-keeper firing trivial fork pings achieves the same economics without process ownership, stall-kill, restart, crash-degrade, or a routing convention, and the unchanged fork ladder serves every consult warm. M1 also found `.claude/bin/consult` captures no token data whatsoever, which made the original success criterion 5 literally unrunnable by its own tooling. The crux is therefore the **warmth-keeper plus consult instrumentation**; the ends — economics, observability, the read-only boundary — are unchanged. Full record: § Amendment A1.

## Scope

- **The spike** *(complete, M1 — closed 26-07-28)* — the theory under test before anything was built: hold-open mechanics, the cost matrix, and the read-only boundary check. Verdict: premise **confirmed**, mechanism **superseded** (A1).
- **The instrumented consult** — `.claude/bin/consult` learns to capture per-consult `usage` from the child's event wire instead of treating stdout as opaque, and reports it alongside the answer. Carries M1's two recorded-not-repaired defects: the DENY-list drift and the `permission_denials` false-clean-sheet trap. Small, and it unblocks every measurement the mission's success rests on.
- **The warmth-keeper** — the scheduler as product (`.claude/bin/`, project-generic, BASELINE-manifested): handle registration at campaign open and release at close, activity-windowed cadence derived from M1's measured economics, read-only beats issued through the instrumented consult, and stall semantics such that a failed beat costs at most one cold reload — never a wedged scheduler, never a lost consult.
- **Protocol integration** — `work/README.md` § The callback grammar and the consulting role cards (architect, executor, manager) carry the registration convention; the fork ladder stays the sole consult transport (D3).
- **The measured campaign** — one real campaign in the consuming repo `~/dev/lasers` (milestones already queued there) runs over the warmth-keeper and instrumented consult; per-consult `usage` measurements collected and appended to the evidence note. The success evidence is demonstrated, not projected.
- **Batching (conditional)** — Remedy 1 of the predecessor proposal, evaluated against the campaign measurements; can be skipped at its gate without failing the mission.

## Non-goals

- **The digest-first consult ladder (predecessor Remedy 2) — operator veto, not revisited this mission.** Routing consults to a document digest sacrifices answer quality; the chain of command exists so the superior answers from its own full context.
- **The link-gate work** — settling the unprefixed-link style fork and teaching `reference-gate` to resolve relative targets (the v3 close's recommended charter input; six dangling links escaped the gate at that close). **Queued, not dropped**: named here so it cannot silently vanish; available to a standalone work order or the v5 charter. Pointer: `work/missions/v3.memory-protocol/closing.md` § What didn't ship.
- **The collection point — forfeited at A1, queued not dropped.** A persistent superior is a collection point that a turn ending cannot abandon (`work/notes/26-07-25.child-collection-evidence.md`). A1 drops the held-open channel and therefore forfeits it: the property was never a success criterion, and holding an economics mission hostage to it would invert the charter's own hierarchy. The note reverts to **live and un-aligned** — its own evidence track, re-affirmed a third time — and the question routes to the queued charter candidate below.
- **The coordination plane — a queued v5 charter candidate.** One entry, three tributaries, each with its evidence pointer: herdr's flatten-vs-nest fork and its refusal of subagent observability (`work/research/herdr.md`), the forfeited collection point (`work/notes/26-07-25.child-collection-evidence.md`), and M1's nesting finding. Named here so it cannot silently vanish; a mission-scale, evidence-hungry question that deserves its own charter rather than a rider on an economics mission.
- **Consuming-repo changes** — the one-way valve stands: `lasers` runs the campaign and its measurements flow back; this mission edits no consuming-repo files, and `lasers` adopts product updates on its own terms.
- **Cross-machine routing** — the machine registry is single-machine today; the routing convention designs for the local case and leaves cross-machine consult transport to a future mission (the grammar's `machine` segment already reserves the routing key).
- **The git-index remedy fork** — stays deferred in the backlog per the ADR hazard entry; untouched here.
- **Removing forks** — `--fork-session` resume remains the only transport for archived handles, the isolation mechanism for parallel consults, and the degrade path at every channel failure. The channel is a transport added for live handles, not a replacement grammar.

## Settlement — determinations

**D1 — The mechanism is cache warmth, not context residency.** The Messages API is stateless: every turn — fork or held-open channel alike — retransmits the full conversation as input. What a design controls is the reload's price and latency, governed by prompt-cache state: ~0.1× reads with fast prefill inside the TTL; 1.25× (5-minute) / 2× (1-hour) cache writes with full prefill when cold. Claude Code sessions use the 1-hour TTL — **locally measured 26-07-28 (writes land in `ephemeral_1h`), promoted from documentation-verified to measured fact at A1.** The measured regression is coldness — consults spaced beyond the TTL — not forking per se. Every milestone designs against this mechanism; "avoid the reload" is not a claim any deliverable may make.

**D7 — Cache residency is byte-bound** *(added at A1)*. The prompt cache is a property of the byte-exact prefix: it survives process death and fork identity — measured in M1 phase 1, where a different process resuming a *different* child session id hit the same cached prefix six minutes later at warm rates. Warmth therefore requires no held-open process, and **no deliverable may justify process-keeping machinery on warmth grounds.**

**D2 — Warmth is a maintained property.** The channel's lifecycle machinery must include a TTL/heartbeat policy: traffic refreshes warmth for free; quiet stretches are held warm by trivial heartbeat turns (or `max_tokens: 0` pre-warms) at ~0.1× of the prefix. Cadence and break-even are spike measurements, never assumptions.

**D3 — The channel is a transport, not a new grammar.** The callback handle stays `role@machine/session-id`; the channel serves consults against *live* handles; archived handles and every failure mode degrade to the existing fork ladder. `.claude/bin/consult` remains the single consult entrypoint — it learns to prefer the channel, it is not replaced.

**D4 — Observability is non-negotiable.** The bar is equal-or-better on both surfaces: the session transcript in the local store (the substrate the CLI/Desktop surfaces and the Executor's stall rules read) and the live event stream (stream-json emits every event; it can be teed). Any intercom design that loses either fails its acceptance regardless of its economics.

**D5 — The consult boundary carries.** A consult over the channel is interpretation-only and read-only, exactly as the grammar states for forks: a live superior answering questions is fine; a live superior driven by inferiors is an authority inversion. Enforced by protocol at minimum, by a capability boundary if the surface allows; new design decisions still escalate to the Operator.

**D6 — Evidence residency.** All spike and campaign measurements append to `work/notes/26-07-28.consult-token-cost-evidence.md`, the standing raw record. The campaign's consuming-repo run respects the one-way valve: measurements flow back; product edits never flow out mid-campaign.

## Settlement — charter-verified vs spike-owned

**RETIRED at A1 (26-07-28)** — every item below now has a verdict or was superseded; the list is kept for the record, not as an open unknowns-list. Verdicts: live transcript append **confirmed**; mid-flight surface visibility **recorded as a finding** (`-p` sessions are absent from the picker, documented v2.1.220 behaviour — a finding, never a gate, per the operator's ruling); channel turns hitting the warm cache **confirmed**; heartbeat holding warmth **re-homed** to the warmth-keeper milestone's own acceptance evidence; the **warm-fork corollary confirmed decisively** — the finding that reshaped the mission (D7); the channel answering without acquiring the ability to act **confirmed** (`Write` and `Bash` emitted as `tool_use` and refused by the enforcement layer).

Recorded so M1's plan descended from an honest boundary between what was known and what the spike had to establish:

- **Charter-verified** (API reference + ANTEC measurements, 26-07-28): API statelessness; cache read/write pricing and TTLs; cache keying on the byte-exact prefix; the flagship transcript scale; the ~31k-token flat dispatch floor; the fork mechanism (`--resume --fork-session` rehydrates the full recorded context).
- **Spike-owned** (plausible, unverified — the go/no-go gate): that a held-open `-p --input-format stream-json` process appends its transcript live and is visible mid-flight in the CLI/Desktop surfaces; that successive channel turns actually hit the warm cache (`cache_read_input_tokens` confirms); that a heartbeat turn holds warmth at ~0.1×; the **warm-fork corollary** (a fork consult issued while the superior is warm hits the cache — if confirmed, parallel consults stay cheap whenever the channel is doing its job); and that the channel can answer without acquiring the ability to act.

## Settlement — triage (from v3's close)

- **Footguns**: the fresh ledger is empty — the normal starting state, not a gap. v3's entries stay archived; the durable reference-integrity statement lives in `.claude/agents/janitor.md` § The reference-integrity method, exactly as the v3 close provisioned. Nothing to carry.
- **Todos**: `bugs/26-07-25.bug.concurrent-tree-commit-absorption.md` — **live, unaligned with v4**: it stays live because the ADR hazard entry names it as deferred (a hazard pointing at an archived bug promises a liveness it does not have), but no v4 milestone touches it. Backlog row's alignment updated at charter.
- **Proposals**: `26-07-28.always-warm-intercom.md` — **adopted at this charter** (operator-directed at filing); stays in the root until the enacting work completes, then files to `_enacted/`. The rejected predecessor stays in `_rejected/` with its rejection record. `_deferred/` is empty.
- **Runbooks**: none live (v3's close authored none forward).
- **Design**: no canon founded — nothing to triage.
- **Notes**: both live notes stay live. `26-07-25.child-collection-evidence.md` — re-affirmed a third time, and now *aligned*: a persistent superior is a collection point that cannot be abandoned by a turn ending; this mission records whether that expected secondary benefit holds. `26-07-28.consult-token-cost-evidence.md` — the mission's evidence surface (D6).

## Success criteria

1. **The spike verdict is recorded** — all three parts (hold-open mechanics, cost matrix, boundary check) executed with evidence appended to the evidence note, and the go/no-go gate passed on the operator's reading of the numbers. ***Discharged 26-07-28**: the operator's ruling to re-charter in the direction the spike established **is** the gate reading, in the strongest available form — a GO on the premise with a redirect on the mechanism. See § Amendment A1.*
2. **The warmth-keeper is product** — a scheduler in `.claude/bin/`, BASELINE-manifested, project-generic (machine facts route to the `work/PROJECT.md` seam), that holds registered superior handles warm by firing trivial read-only fork pings just under the measured TTL. Its policy is activity-windowed per M1's measured economics: beats just under 60 minutes while a campaign window is active; hold through any quiet gap shorter than the ~19-hour break-even; lapse across multi-day dormancy. Handles register at campaign open and release at campaign close, and failure degrades harmlessly — a missed or failed beat costs at most one cold reload, never a wedged scheduler and never a lost consult.
3. **The consult path is instrumented and cadence-aware** — `.claude/bin/consult` captures per-consult `usage` (input, output, `cache_read_input_tokens`, `cache_creation_input_tokens`, cost) from the child's event wire rather than treating stdout as opaque, reports it alongside the answer, and appends it to the campaign measurement surface (D6); the canon (`work/README.md` § The callback grammar) and the consulting role cards carry the warmth-keeper's registration convention, with the fork ladder unchanged as the sole consult transport (D3); and M1's two recorded-not-repaired defects are reconciled — the four DENY-uncovered tools (`SendUserMessage`, `ListAgents`, `ReadMcpResourceDirTool`, `Cd` probed) and the `permission_denials`-reports-`[]` trap, so a boundary audit reads the real signal (`tool_result` with `is_error`) rather than a false clean sheet.
4. **Observability holds at equal-or-better** — demonstrated, not asserted: transcript-store visibility and live event stream both shown working under the landed **warmth-keeper and instrumented consult path** (D4).
5. **One measured campaign ran** — a real campaign in `~/dev/lasers` over the warmth-keeper and instrumented consult (**runnable via criterion 3's instrumentation — the measurements are the instrumented consult path's own output**), per-consult `usage` collected: mean consult cost collapsed from cold-write-of-the-flagship-prefix toward cache-read rates, warm share near total, residual cold events enumerable (campaign open, first-touch) rather than steady-state. Measurements appended per D6.
6. **The batching gate is ruled** — M5 executed or explicitly skipped against M4's measurements, with the ruling recorded either way.
7. **Enactment and gate** — the proposal filed to `_enacted/` with stamp; quality gate and `/initialize` green.

## Failure criteria

- **The spike refutes the theory** — hold-open sessions cannot preserve observability (no live transcript append / no surface visibility), or the cost matrix shows no meaningful warm advantage (channel turns miss the cache; heartbeats fail to hold warmth) → close **unaccomplished** with the refuting evidence filed (operator ruling at charter). Any successor design gets its own proposal and charter.
- **The boundary cannot be preserved** — the channel necessarily grants inferiors the ability to drive the superior, and no protocol or capability mitigation holds under D5 → close **unaccomplished**; an authority inversion is disqualifying regardless of economics.
- **Genericity fails** — the machinery cannot be stated project-generically and machine- or project-shaped facts must leak into `.claude/` → close **failed**; the intercom re-scopes to the consuming seam before any re-charter.

## Roadmap

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [spike](milestones/1.spike/MILESTONE.md) | The always-warm theory under test: hold-open mechanics, cost matrix, boundary check — go/no-go gate | — | **done (26-07-28)** — phase 1 accomplished; phase 2 superseded → A1 |
| 2 | [instrumented-consult](milestones/2.instrumented-consult/MILESTONE.md) | `.claude/bin/consult` captures and reports per-consult `usage` from the child's event wire (M1's wire map); DENY-drift reconciliation and the `permission_denials` false-clean-sheet fix. Small, and it unblocks all measurement | 1 | pending |
| 3 | [warmth-keeper](milestones/3.warmth-keeper/MILESTONE.md) | The scheduler as product — a self-managed cross-platform daemon: handle registration/release, activity-windowed cadence (58-min beats, 18 h dormancy bound), read-only beats via the instrumented consult, stall semantics; canon + role cards; proposal enactment. Two phases, closed by a two-beat smoke test (**A2**) | 2 | **planned (26-07-29)** — hardened to 2 phases |
| 4 | [measured-campaign](milestones/4.measured-campaign/MILESTONE.md) | One real campaign in `~/dev/lasers` over warmth-keeper + instrumented consult; per-consult measurements analyzed; warm-fork latency and refresh-on-read observed free at production TTL. **Carries M1's re-homed TTL-window cells (A2)**: warmth held across ≥2 TTL windows and refresh-on-read, observed from the keeper's own telemetry during the campaign | 3 | pending |
| 5 | [batching](milestones/5.batching/MILESTONE.md) | Conditional (operator ruling at charter): consult batching evaluated against M4's measurements; skippable at its gate | 4 | pending |

**Ordering rationale for 2-before-3**: the keeper's beats are consult-shaped children and its acceptance evidence is usage telemetry, so instrumenting first means the keeper is built *on* the instrument and measured *by* it, rather than carrying ad-hoc capture that M2 would then duplicate.

---

## Amendment A1 (26-07-28)

> architect@play/c1378142-cf5c-4ad2-97b0-920533f97a7c — authored · ruled by `claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500` (mission architect, consulted) on the operator's explicit delegation · evidence produced by `executor@play/c1378142-cf5c-4ad2-97b0-920533f97a7c` (M1 campaign)
>
> **Approved by the Operator at re-commission, 26-07-28.** The four design forks were delegated to the mission architect by explicit operator ruling; this amendment's adoption is the operator's own act, and the mission proceeds under it.

**What changed.** The crux: a persistent stream-json intercom → **the warmth-keeper plus consult instrumentation**. Success criteria 2 and 3 replaced; 4 and 5 given wording touches naming the new deliverables and criterion 5's dependency on the instrumentation; criterion 1 discharged (below). Determination **D7 added**; D1's TTL line promoted from documentation-verified to locally measured. Roadmap M2–M5 replaced. The spike-owned list retired with per-item verdicts. Two queued non-goals added: the forfeited collection point and the coordination-plane charter candidate.

**Why.** M1 measured the mission's premise **true** (~18× warm/cold: $0.233 against $4.26 on the same prefix) and, in the same run, established that prompt-cache residency is **byte-bound** — surviving both process death and fork identity (D7). The held-open process was the adopted proposal's *design hypothesis* for achieving always-warm economics, never the objective; D1 already forbade any deliverable claiming to "avoid the reload," and D3 already demoted the channel to a transport. With warmth available from a trivial fork ping, the channel's economic justification dissolves along with its entire lifecycle burden — process ownership, stall-kill, restart, teardown, crash-degrade, routing. Separately, M1 found `.claude/bin/consult` captures no token data at all, which made success criterion 5 unrunnable by the mission's own tooling — a hole in the charter, not an optional refinement. **This is not a refutation; it is confirmation by a cheaper mechanism**, a case the original failure criteria did not provide for.

**The forfeit, recorded.** Dropping the channel gives up the collection point — a persistent superior that a turn ending cannot abandon (`work/notes/26-07-25.child-collection-evidence.md`). It was an expected secondary benefit, never a success criterion. It is surrendered deliberately, named here at the decision point and queued in § Non-goals so it cannot silently vanish; the note reverts to live and un-aligned, on its own evidence track.

**Criterion 1, discharged.** The operator's ruling to re-charter in the direction the spike established *is* the go/no-go gate reading — a GO on the premise with a redirect on the mechanism. The gate is not left dangling.

**Evidence.** `work/todos/_done/26-07-28.execute-m1-spike.md` § Phase 2 — economics: HELD (findings 1–7) and § Phase-gate architect consult; `work/notes/26-07-28.consult-token-cost-evidence.md` (M1 phase 1 section); `work/milestones/1.spike/1.channel.md` § Addendum.

**Design inputs cited, not absorbed.** `work/research/herdr.md` contributes three mechanisms to the milestone docs — the stall detector (a beat or consult that hangs must return, never wedge), bounded on-demand reads over transcript streaming (the consult returns answer plus usage, never the child's raw wire into the parent's context), and path-as-message as documented fallback for oversized answers. Its larger thesis routes to the queued coordination-plane candidate.

---

## Amendment A2 (26-07-29)

> architect@play/a3117b31-b7e0-4a55-bc48-fc6a0a163214 — authored at M3 hardening (`/plan work/milestones/3.warmth-keeper`)
>
> **Ruled directly by the Operator in the hardening dialog**, on two explicit rulings. Unlike A1, no delegation was involved: the operator settled both forks personally and this amendment records them.

**What changed.** Two rulings, both narrowing M3, neither touching the mission's ends.

1. **The keeper is a self-managed cross-platform daemon**, not a machine-declared tick behind the `work/PROJECT.md` seam. The M3 roadmap row's cadence gist is restated in the deliverable's own measured terms (58-minute beats, 18-hour dormancy bound).
2. **M3's soak is dropped.** The re-homed M1 cells — warmth across ≥2 TTL windows and refresh-on-read — **move from M3 to M4**, where a real campaign produces them for free. The deliberate-expiry negative control is **dropped outright**. M3 closes instead on a two-beat smoke test.

Roadmap rows 3 and 4 amended accordingly. No success criterion is altered: criterion 2 chartered the keeper's *policy*, never its scheduling substrate, and the TTL evidence was pinned to M3 by the roadmap row and the milestone stub rather than by a criterion.

**Why — the daemon.** The seam was the charter's own suggested shape ("machine facts route to the `work/PROJECT.md` seam"). The operator's objection is decisive and was accepted against the architect's initial recommendation: the product must run on Windows, macOS and Linux, so a seam expands to three OS recipes of which two are unwritten. A portable daemon leaves **no machine fact to route at all**, which satisfies the genericity test — the acceptance test for every `.claude/` change — more fully than routing one would. The architect's contrary recommendation had been calibrated against *this* machine, where systemd is live, rather than against the product's portability requirement. Recorded because the reasoning, not the verdict, is what a later reader needs.

The A1 tension this raises is settled in the milestone doc rather than here, with a one-line discriminator: kill the process, fire the same beat by hand at the same instant, and ask whether the consult's price changed. For A1's channel it did; for the keeper it does not. `work/milestones/3.warmth-keeper/MILESTONE.md` § D7 reconciliation.

**Why — the soak.** The operator's ruling, verbatim in substance: *there is no time for a soak; the team is actively running the broken workflow and burning an extreme number of tokens.* Under that pressure the soak is also the weakest evidence in the milestone. Two beats sixty seconds apart establish registry lifecycle, repeated firing, and refresh-on-read — beat #2 shows a high `cache_read_input_tokens` against ~0 cache creation. The **only** fact needing real wall clock is that a 58-minute cadence clears the 60-minute expiry, and M4's campaign shows exactly that at production scale for free. The dropped expiry control would have spent a deliberate cold reload re-proving M1's already-measured 18× ratio.

So: **M3 proves the machinery, M4 proves the cadence.** The evidence is deferred, not forfeited — and it lands on better evidence than a synthetic soak would have produced.

**What this amendment does not do.** It does not relax charter success criterion 5 (one measured campaign, per-consult `usage` collected, residual cold events enumerable) or criterion 7 (green gate at mission close). It moves evidence between milestones; it removes none from the mission.

**Evidence.** `work/notes/26-07-28.consult-token-cost-evidence.md` § Cost data — carried for phase 2 (the 18.26× ratio and the `ephemeral_1h` finding every M3 default derives from); `work/todos/26-07-29.execute-m2-instrumented-consult.md` § Phase Ledger (the five-agent-death record behind M3's phase count and its orphaned-registration hazard).
