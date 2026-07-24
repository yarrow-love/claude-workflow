---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect (stub)
  - architect@play/6a0035c9-cd57-4573-8e3a-b22dc4cba6c2 # milestone architect
  - executor@play/2f2dc1c5-64e6-4673-8e24-4309de22fb19 # M2 campaign executor
---

# M2 — conversion: the subagent Manager boundary lands in canon

> Status: pending — hardened 26-07-24 (`/plan`, three phases, `/execute`-ready). Gate satisfied: M1 probes 1 & 4 pass as capabilities ([verdicts](../../todos/_done/26-07-23.probe-battery.md)); premise-1 divergence carried in as the D2 re-scope below.

## Objective

Enact the proposal's design across live canon: the Executor dispatches Managers as Agent-tool subagents; the compensatory observability apparatus (jsonl periscope, tail/jq check-ins, mtime-stall) retires; durability and permissions follow the amended doctrine; the D2 re-scope lands as a settings **cap**, audited. After this milestone, a fresh session reading only the docs dispatches a Manager as a subagent — headless survives solely as a documented fallback with stated causes.

## Scope

- **D2 re-scope (operator-confirmed 26-07-24).** M1 falsified D2's premise: on v2.1.218 nesting is default-ON and deep; `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` is a restrictive **cap**, not an enabler. The key stays baseline at `"2"` with the inverted rationale — it **pins** behavior against platform flips (the default has flipped twice in a year) and caps blast radius (the ladder needs exactly two levels; the platform default grants ≥3). `/initialize` audits presence + value; the M1-era behavioral check ("is nesting on?") is obsolete.
- **Mechanics** (phase 1): `.claude/settings.json` env block; `BASELINE.md` settings-skeleton sentence; `/initialize` audit line; `session-archive` subagent sweep — `agent-*.jsonl` + `agent-*.meta.json` sidecars from the parent session's flat `subagents/` dir (M1-confirmed layout), MANIFEST-covered, `tool-results/` excluded. Operator-gated: the interactive plain-session no-var default check (M1's uncertified caveat).
- **Canon rewrite** (phase 2): `executor/CLAUDE.md` § The Manager boundary; `execute-milestone.md` 7.1–7.3 + budgets (subagent dispatch, task-notification cadence replacing tail/mtime, verdict-absence detection, SendMessage nudge, pause-and-ask); `manager/workflows/execute-work-order-automatically.md` (escalation-as-pause; EXECUTION DISCIPLINE); `manager/CLAUDE.md` dispatch table + cost note; `commands/execute.md`. Folds and closes the bug order [`bugs/26-07-23.bug.headless-manager-premature-exit.md`](../../todos/bugs/26-07-23.bug.headless-manager-premature-exit.md) (operator-confirmed 26-07-24): verdict-absence detection written once, mechanism-neutral; causes 1–2 into the fallback discipline; cause 3 universal; the final-mile exception at its narrowest wording.
- **Coherence sweep** (phase 3): grep-driven residue sweep across live canon — including the two architect docs' "headless Manager session" phrasing found at planning — with the consult apparatus and historical paths explicitly excluded; reconciliation note appended to [`_deferred/26-07-11.work-queue-tier.md`](../../proposals/_deferred/26-07-11.work-queue-tier.md); full quality gate.

## Out of scope

- The validation campaign under the new boundary, the proposal's `_enacted/` filing, and the D4 doctrine rewrite — all M3.
- Depth-2 SendMessage certification — documented as a known limit instead: the chain of command never needs a parent to address a grandchild (Executor nudges Manager; Manager nudges its own specialists).
- Consult mechanics (`--resume --fork-session`, `.claude/bin/consult`, the callback grammar) — a distinct, surviving apparatus; the sweep must not touch it.
- The remote intercom, specialist roster, model pins, work-order state machine (mission non-goals).
- Historical documents (`_done/`, `_cancelled/`, `proposals/`, `sessions/`, `missions/`) — never rewritten; 21 files with apparatus references stay as-is.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [mechanics](1.mechanics.md) | Depth-cap env key + BASELINE + `/initialize` audit; `session-archive` subagent sweep with self-test; operator-gated interactive-default check | done (26-07-24) |
| 2 | [canon-rewrite](2.canon-rewrite.md) | The six-file doctrinal conversion; pause-and-ask; apparatus retirement; premature-exit bug folded and closed | pending |
| 3 | [coherence-sweep](3.coherence-sweep.md) | Residue grep sweep; work-queue-tier reconciliation note; quality gate end-to-end | pending |

M2's own campaign runs as the **last headless campaign** — canon governs until it is rewritten; M3 validates the new boundary in anger.

## Acceptance

- `.claude/settings.json` carries `env.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH: "2"`; `BASELINE.md` records it as a baseline key with the cap rationale; `/initialize` audits it and passes.
- `session-archive` demonstrably archives a real session's `subagents/` transcripts + `.meta.json` sidecars with MANIFEST entries that verify (`sha256sum -c`); the tooling smoke test still passes.
- A fresh session reading only `executor/CLAUDE.md` + `execute-milestone.md` would dispatch a Manager as an Agent-tool subagent; the headless pattern appears only inside a clearly-marked fallback subsection with its trigger causes stated.
- No live-canon reference to the retired apparatus (`tmp/accomplish`, stream-json dispatch, tail/jq check-ins, mtime-stall) remains outside marked fallback text — verified by the phase-3 grep recipe with its written exclusions.
- Bug `26-07-23.bug.headless-manager-premature-exit` is closed to `_done/` with all four causes mapped to landed canon text.
- The reconciliation note stands in `_deferred/26-07-11.work-queue-tier.md` (house style, append-only).
- *(operator-gated)* The interactive no-var default observation is recorded in the phase-1 work order.
