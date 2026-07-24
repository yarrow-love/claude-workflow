---
mission: v1.subagent-boundary
branch: 26-07-23
status: chartered
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect
---

# Mission v1 — the subagent Manager boundary

> Chartered 26-07-23 by operator commission. Design authority: the adopted proposal [`work/proposals/26-07-23.subagent-manager-boundary.md`](proposals/26-07-23.subagent-manager-boundary.md) — its determinations bind this mission; the charter adds the mission-scale frame and the fold-back protocol. First mission this repo has chartered; the mission rides branch `26-07-23` (mission = branch).

## Objective / why now

Convert the Executor→Manager boundary from headless `claude -p` child sessions to native subagent dispatch — observability at every level of the agent tree (live panels, pause-and-ask escalation, downward nudges) in place of the compensatory jsonl periscope. Why now: the depth limitation that justified the headless workaround is configuration, not platform fact (verified 26-07-22); the operator has confirmed the call-and-response requirement is met by the revised architecture; and Orchestra's parallel work gives the session archive a rising role (asynchronous peer observability) that the conversion's whole-tree archive sweep directly feeds.

## Scope

The proposal's spawn plan, at mission scale: the empirical spike; the canon conversion (executor/manager docs, escalation-as-pause, env gate, BASELINE + `/initialize` audit, `session-archive` subagent sweep, apparatus retirement, reconciliation notes); a real validation campaign under the new boundary; enactment filings; and the **fold-back** (Determination D4) including the doctrine rewrite it requires.

## Non-goals

- The remote intercom (Orchestra's — the one-way valve stands; `todos/26-07-22.lan-intercom.md` stays halted).
- Consult mechanics (cross-session forks) beyond the integrity fix already landed on `main`.
- Specialist roster, model pins, `/plan`/Blessing/work-order state machine — untouched.
- Multi-machine coordination (claims, blast radii) — later, with Orchestra.

## Settlement — determinations

**D1 — The proposal binds.** The subagent-manager-boundary proposal's design (env-gated depth-2 dispatch, pause-and-ask protocol, durability amendment, permission story, headless-as-documented-fallback) is this mission's spec. Where a milestone doc and the proposal disagree, the proposal wins until explicitly revised here.

**D2 — Depth is configured state, never assumed.** The capability has flipped twice in a year. `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2` becomes a baseline settings key with an `/initialize` audit; the spike (M1) is the only admissible evidence of behavior, and it gates M2.

> **M1 finding (26-07-24) — premise falsified; D2 re-scope pending at M2.** The spike found the opposite of this determination's premise on CLI v2.1.218: nesting is **default-on and deep**, and `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` acts as a **restrictive cap**, not an enabler. The capability the conversion needs — nested depth-2 dispatch — *works* (M2 proceeds), but there is nothing to "enable," so the baseline-key rationale flips to a *cap against default-deep-nesting*, and the `/initialize` behavioral audit inverts (from "is nesting on?" to at most "is the cap set as intended?"). M2's `/plan` re-scopes D2 from the spike's reconciliation table (`todos/_done/26-07-23.probe-battery.md`); the *interactive* plain-session default remains uncertified (only `-p` subprocess + interactive var=2 were) and M2 confirms it. The determination text above is preserved as chartered; this note is the empirical correction. Operator-dispositioned 26-07-24 (close M1 accepted; re-scope at M2).

**D3 — The archive's role rises.** Manager leaves the durable tier (stamps anchor to the Executor session); `session-archive` grows the `subagents/agent-*.jsonl` sweep so the archived unit is the whole tree — deliberately shaped for Orchestra's asynchronous peer-observability use of `work/sessions/`.

**D4 — Template purification at close (operator-confirmed 26-07-23).** At mission close, `main` becomes the **pure project-generic template**: product only (`.claude/` manifest, scaffold, canon READMEs, `src/README.md`, `.cbmignore`). All instance content — mission archive, todos history, founding corpus, session archives — leaves `main` and is carried by the mission branch (per `/close`: "the branch's final state carries the archive"). The dual product+instance doctrine in root `CLAUDE.md`/`README.md` is rewritten accordingly (M3 scope). Consequence, accepted: development thereafter happens on mission branches; a clone of `main` is a ready bootstrap — the wholesale-copy trap dies at the root.

**D5 — Consult integrity pre-landed.** The `--fork-session` fix shipped on `main` (`fe63922`) before this branch opened; the mission runs on sound archive semantics.

## Settlement — triage (first mission; no predecessor)

- **Footguns / design canon / runbooks**: none exist — nothing to triage.
- **Todos**: `26-07-23.fork-session-consults` → done pre-mission on `main`. `26-07-22.lan-intercom` → stays halted (Orchestra valve; non-goal here). `26-07-11.configure-command` → **candidate subject for M3's validation campaign** (real work to exercise the new boundary); decided at `/plan` M3.
- **Proposals**: `26-07-23.subagent-manager-boundary` (adopted) enacts via this mission — files to `_enacted/` in M3. `26-07-22.lan-intercom` (adopted, enactment halted) and `_deferred/26-07-22.claude-intercom` persist untouched. `_deferred/26-07-11.work-queue-tier` receives its reconciliation note in M2 (its "never a subagent" clause is obsoleted).

## Success criteria

1. M1's five probes recorded with verdicts on the installed CLI; conversion proceeded only on pass.
2. Canon converted: Executor dispatches Managers as subagents; jsonl/tail/mtime apparatus retired; env gate baselined and audited; `session-archive` sweeps subagent transcripts; escalation-as-pause documented.
3. A real campaign ran under the new boundary with the operator observing live panels; call-and-response exercised in both directions (≥1 upward pause-and-ask, ≥1 downward nudge, recorded in the campaign log).
4. Enactment filed (`_enacted/`); reconciliation notes appended.
5. Fold-back prepared per D4: `main` holds product only; doctrine rewritten; the branch, tagged, carries the archive. (The close itself remains the operator's `/close` ceremony.)

## Failure criteria

- A load-bearing spike probe fails (depth dispatch, or parent-resume durability) with no acceptable adaptation → close **failed**; the conservative fallback (child sessions + the gated accomplish-tail live feed) files as a standing order; the proposal takes the reconciliation note.
- Platform behavior shifts under the mission in a way that cannot be pinned → close **superseded**, revisit on a stable CLI.
- The validation campaign shows materially worse operator observability, or lost work, versus the headless pattern → conversion reverts on-branch; close **failed** with rationale.

## Roadmap

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [spike](milestones/1.spike/MILESTONE.md) | The five empirical probes; verdicts gate everything downstream | — | done (26-07-24) |
| 2 | [conversion](milestones/2.conversion/MILESTONE.md) | Canon rewrite, env gate, archive sweep, apparatus retirement, reconciliation notes | 1 | pending |
| 3 | [validation-and-fold](milestones/3.validation-and-fold/MILESTONE.md) | Real campaign under the new boundary; enactment filings; D4 doctrine rewrite + fold-back preparation | 2 | pending |
