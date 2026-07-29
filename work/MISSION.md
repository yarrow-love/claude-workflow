---
mission: v4.token-efficiency
branch: v4.token-efficiency
status: chartered
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — chartered at operator commission
---

# Mission v4 — token efficiency: the always-warm intercom

> Chartered 26-07-28 by operator commission, founded on the adopted proposal [`work/proposals/26-07-28.always-warm-intercom.md`](proposals/26-07-28.always-warm-intercom.md) — the revision that superseded the rejected resume-era proposal (`work/proposals/_rejected/26-07-28.persistent-intercom-and-consult-economy.md`) at this mission's founding. Fourth mission this repo has chartered (predecessor: `v3.memory-protocol`, closed accomplished 26-07-27); rides branch `v4.token-efficiency` off `dev` (mission = branch). Operator rulings at charter: batching is a **conditional final milestone**; the v3 close's link-gate recommendation is a **queued non-goal**; success requires **one measured campaign** in a consuming repo; spike refutation closes the mission **unaccomplished**.

## Objective / why now

Replace the resume-fork consult transport with a persistent stream-json intercom whose economics are governed by maintained prompt-cache warmth — collapsing per-consult cost from a cold write of the superior's whole context (1.25–2× input price, full prefill latency) toward warm cache reads (~0.1×, fast prefill) — without losing the observability the v4-era callback intercom bought. Why now: the observability upgrade (fresh headless dispatches → `--resume --fork-session` callbacks) regressed token spend and wall-clock sharply, measured 26-07-28 on a real flagship transcript (~60 MB raw; the consult-heaviest handle is precisely the largest); the mechanism is confirmed and the corrected design premise — *always-warm reload at ~0.1×*, not "no reload" — is filed in the adopted proposal with an opening spike that can cheaply confirm or refute it before machinery is built.

## Scope

- **The spike** — the theory under test before anything is built: hold-open mechanics (session-id capture, live transcript append, mid-flight surface visibility, clean post-mortem resume), the four-way cost matrix (cold fork / warm fork / warm channel / expired channel, plus one heartbeat turn), and the read-only boundary check. Go/no-go gate for the mission.
- **The intercom machinery** — the persistent channel as product (`.claude/bin/`, project-generic, BASELINE-manifested): process ownership (spawn at campaign open, stall-kill, restart, teardown), the warmth policy (heartbeat cadence derived from the spike's measured break-even), the inferior→channel routing convention, and crash semantics (a died channel degrades to the fork ladder without losing a question).
- **Protocol integration** — the consult path (`.claude/bin/consult`) gains the live-channel rung; `work/README.md` § The callback grammar and the role cards that consult (architect, executor, manager) rewire; fork-resume remains for archived handles and as the degrade path everywhere.
- **The measured campaign** — one real campaign in the consuming repo `~/dev/lasers` (milestones already queued there) runs over the intercom; per-consult `usage` measurements collected and appended to the evidence note. The success evidence is demonstrated, not projected.
- **Batching (conditional)** — Remedy 1 of the predecessor proposal, evaluated against the campaign measurements; can be skipped at its gate without failing the mission.

## Non-goals

- **The digest-first consult ladder (predecessor Remedy 2) — operator veto, not revisited this mission.** Routing consults to a document digest sacrifices answer quality; the chain of command exists so the superior answers from its own full context.
- **The link-gate work** — settling the unprefixed-link style fork and teaching `reference-gate` to resolve relative targets (the v3 close's recommended charter input; six dangling links escaped the gate at that close). **Queued, not dropped**: named here so it cannot silently vanish; available to a standalone work order or the v5 charter. Pointer: `work/missions/v3.memory-protocol/closing.md` § What didn't ship.
- **Consuming-repo changes** — the one-way valve stands: `lasers` runs the campaign and its measurements flow back; this mission edits no consuming-repo files, and `lasers` adopts product updates on its own terms.
- **Cross-machine routing** — the machine registry is single-machine today; the routing convention designs for the local case and leaves cross-machine consult transport to a future mission (the grammar's `machine` segment already reserves the routing key).
- **The git-index remedy fork** — stays deferred in the backlog per the ADR hazard entry; untouched here.
- **Removing forks** — `--fork-session` resume remains the only transport for archived handles, the isolation mechanism for parallel consults, and the degrade path at every channel failure. The channel is a transport added for live handles, not a replacement grammar.

## Settlement — determinations

**D1 — The mechanism is cache warmth, not context residency.** The Messages API is stateless: every turn — fork or held-open channel alike — retransmits the full conversation as input. What a design controls is the reload's price and latency, governed by prompt-cache state: ~0.1× reads with fast prefill inside the TTL; 1.25× (5-minute) / 2× (1-hour) cache writes with full prefill when cold. Claude Code sessions use the 1-hour TTL. The measured regression is coldness — consults spaced beyond the TTL — not forking per se. Every milestone designs against this mechanism; "avoid the reload" is not a claim any deliverable may make.

**D2 — Warmth is a maintained property.** The channel's lifecycle machinery must include a TTL/heartbeat policy: traffic refreshes warmth for free; quiet stretches are held warm by trivial heartbeat turns (or `max_tokens: 0` pre-warms) at ~0.1× of the prefix. Cadence and break-even are spike measurements, never assumptions.

**D3 — The channel is a transport, not a new grammar.** The callback handle stays `role@machine/session-id`; the channel serves consults against *live* handles; archived handles and every failure mode degrade to the existing fork ladder. `.claude/bin/consult` remains the single consult entrypoint — it learns to prefer the channel, it is not replaced.

**D4 — Observability is non-negotiable.** The bar is equal-or-better on both surfaces: the session transcript in the local store (the substrate the CLI/Desktop surfaces and the Executor's stall rules read) and the live event stream (stream-json emits every event; it can be teed). Any intercom design that loses either fails its acceptance regardless of its economics.

**D5 — The consult boundary carries.** A consult over the channel is interpretation-only and read-only, exactly as the grammar states for forks: a live superior answering questions is fine; a live superior driven by inferiors is an authority inversion. Enforced by protocol at minimum, by a capability boundary if the surface allows; new design decisions still escalate to the Operator.

**D6 — Evidence residency.** All spike and campaign measurements append to `work/notes/26-07-28.consult-token-cost-evidence.md`, the standing raw record. The campaign's consuming-repo run respects the one-way valve: measurements flow back; product edits never flow out mid-campaign.

## Settlement — charter-verified vs spike-owned

Recorded so M1's plan descends from an honest boundary between what is known and what the spike must establish:

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

1. **The spike verdict is recorded** — all three parts (hold-open mechanics, cost matrix, boundary check) executed with evidence appended to the evidence note, and the go/no-go gate passed on the operator's reading of the numbers.
2. **The intercom is product** — the channel tooling lives in `.claude/bin/`, BASELINE-manifested, project-generic (genericity test passes; machine facts route to the `work/PROJECT.md` seam), carrying the full lifecycle: spawn, session-id capture, heartbeat policy with spike-derived cadence, stall-kill, restart, teardown, and crash-degrade to the fork ladder without losing a question.
3. **The canon is rewired** — `.claude/bin/consult` prefers the live channel for live handles and degrades cleanly; `work/README.md` § The callback grammar carries the channel as transport (D3) with the fork ladder intact; the consulting role cards (architect, executor, manager) reflect it; the read-only boundary (D5) is enforced on the channel path.
4. **Observability holds at equal-or-better** — demonstrated, not asserted: transcript-store visibility and live event stream both shown working under the landed machinery (D4).
5. **One measured campaign ran** — a real campaign in `~/dev/lasers` over the intercom, per-consult `usage` collected: mean consult cost collapsed from cold-write-of-the-flagship-prefix toward cache-read rates, warm share near total, residual cold events enumerable (restarts, first-touch) rather than steady-state. Measurements appended per D6.
6. **The batching gate is ruled** — M5 executed or explicitly skipped against M4's measurements, with the ruling recorded either way.
7. **Enactment and gate** — the proposal filed to `_enacted/` with stamp; quality gate and `/initialize` green.

## Failure criteria

- **The spike refutes the theory** — hold-open sessions cannot preserve observability (no live transcript append / no surface visibility), or the cost matrix shows no meaningful warm advantage (channel turns miss the cache; heartbeats fail to hold warmth) → close **unaccomplished** with the refuting evidence filed (operator ruling at charter). Any successor design gets its own proposal and charter.
- **The boundary cannot be preserved** — the channel necessarily grants inferiors the ability to drive the superior, and no protocol or capability mitigation holds under D5 → close **unaccomplished**; an authority inversion is disqualifying regardless of economics.
- **Genericity fails** — the machinery cannot be stated project-generically and machine- or project-shaped facts must leak into `.claude/` → close **failed**; the intercom re-scopes to the consuming seam before any re-charter.

## Roadmap

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [spike](milestones/1.spike/MILESTONE.md) | The always-warm theory under test: hold-open mechanics, four-way cost matrix + heartbeat, boundary check — go/no-go gate | — | pending |
| 2 | [intercom](milestones/2.intercom/MILESTONE.md) | The channel as product: `.claude/bin/` tooling, lifecycle machinery, warmth policy, routing convention, crash semantics | 1 | pending |
| 3 | [protocol-integration](milestones/3.protocol-integration/MILESTONE.md) | Consult path + canon rewired: consult ladder's live-channel rung, callback grammar, role cards, degrade semantics | 2 | pending |
| 4 | [measured-campaign](milestones/4.measured-campaign/MILESTONE.md) | One real campaign in `~/dev/lasers` over the intercom; per-consult measurements collected and analyzed | 3 | pending |
| 5 | [batching](milestones/5.batching/MILESTONE.md) | Conditional (operator ruling at charter): consult batching evaluated against M4's measurements; skippable at its gate | 4 | pending |
