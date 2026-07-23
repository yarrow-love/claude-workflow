---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect (stub)
---

# M2 — conversion: the subagent Manager boundary lands in canon

> Status: pending — **stub**; harden via `/plan work/milestones/2.conversion` after M1's verdicts.

## Objective

Enact the proposal's design across live canon: the Executor dispatches Managers as subagents; the compensatory apparatus retires; durability and permissions follow the amended doctrine.

## Scope (gist)

- `executor/CLAUDE.md` (§ The Manager boundary rewritten) + `execute-milestone.md` 7.1–7.3 (subagent dispatch, task-notification cadence replacing tail/mtime, SendMessage nudge + pause-and-ask handling).
- `manager/workflows/execute-work-order-automatically.md` — escalation-as-pause amendment (terminal `ESCALATE` reserved for budget/operator-gated stops).
- `.claude/settings.json` env gate + `BASELINE.md` settings-skeleton entry + `/initialize` audit line.
- `.claude/bin/session-archive` — subagent-transcript sweep (+ MANIFEST coverage).
- Apparatus retirement: `tmp/accomplish` recipes, tail/jq check-ins, mtime-stall, accomplish-live-feed residual (tee recipe) — removed or annotated historical.
- Reconciliation notes: `_deferred/26-07-11.work-queue-tier.md`; headless pattern documented as deliberate fallback with stated causes.

## Phases (gist)

Roughly: (1) mechanics (settings/archive-sweep tooling), (2) canon rewrite, (3) doc-coherence sweep (grep for retired recipes; BASELINE/initialize alignment). `/plan` decides the split and per-phase acceptance.

## Acceptance (gist)

No live-canon reference to the retired apparatus remains; a fresh session reading only the docs would dispatch a Manager as a subagent; `/initialize` audits the env gate; `session-archive` demonstrably archives a session's subagent files.
