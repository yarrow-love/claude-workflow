---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect (stub)
  - architect@play/1db4a079-772c-4127-be8d-85fd6d1d43a5 # milestone architect
---

# M1 — spike: empirical verification of subagent dispatch

> Status: pending — planned 26-07-23; `/execute`-ready.

## Objective

Establish the ground truth the conversion rests on: the five probes from the proposal ([§ The spike](../../proposals/26-07-23.subagent-manager-boundary.md)), certified against the regime the design actually targets — the env-gated nesting introduced in CLI v2.1.217. Verdicts are recorded per probe in the phase work order (the admissible evidence D2 names); M2 is gated on pass.

Planning finding (26-07-23): the installed CLI is v2.1.197 — inside the v2.1.172–v2.1.216 band where nesting was *default-on*. Probing it would pass probe 1 vacuously without ever testing the env gate, and mid-turn SendMessage semantics are documented only from v2.1.198. The spike therefore pins the environment first: verdicts on the old band would not transfer.

## Scope

- **Environment pin (operator-gated)**: the operator upgrades the CLI to latest (≥v2.1.217, currently v2.1.218); the exact version is recorded in the work order and becomes part of every verdict. `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2` is **session-scoped only** in this milestone (env prefix at session launch) — the baseline settings key and its `/initialize` audit are M2's to land (D2).
- **The five-probe battery via an interactive probe parent**: the operator launches the probe session with the env var set and runs the phase work order interactively — that Manager session is itself the probe parent (nested dispatch, mid-turn nudge, live panel, end-and-resume). This is the only shape under which probe 3 (panel visibility) is certifiable at all, and it lets one session serve all five probes. Consequence for the campaign: the Executor **stages this launch recipe for the operator instead of dispatching a headless Manager** for this phase.
- **Probe 1 control arm**: on the upgraded CLI *without* the env var, confirm nesting is off — this control is the behavioral check M2's `/initialize` audit inherits.
- **Verdict record**: pass / fail / adapted-with-note per probe, each reproducible from its written recipe in the work order.

## Out of scope

- Any canon, settings, or BASELINE change — conversion is M2 (including the `settings.json` `env` key).
- The `session-archive` subagent sweep (M2, D3).
- Fixing anything the probes find broken — record and route per the charter's failure criteria, never silently work around.
- Probes beyond the proposal's five (concurrency limits etc.) — noted in passing if observed, never chased.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [probe-battery](1.probe-battery.md) | Environment pin, then the five probes through one interactive probe-parent session; verdict write-up | pending |

## Acceptance

- The exact CLI version is recorded in the phase work order and is ≥v2.1.217 (the env-gated regime).
- Every probe (1–5) has a recorded verdict — pass / fail / adapted-with-note — reproducible from its written recipe; probe 1 includes the no-var control result; adapted-with-note verdicts name exactly which proposal premise the adaptation touches.
- Probes 1 and 4 (depth dispatch, parent-resume durability) are pass or adapted-with-note; a fail on either invokes the charter's failure-criteria path explicitly — the milestone closes by escalation, not workaround.
- The work order carries a reconciliation table: each proposal premise (§ The verified premise, 1–5) marked confirmed / diverged on the pinned version, divergences noted for M2 planning.
- Milestone status and roadmap row updated; the phase doc carries its `## Addendum`.
