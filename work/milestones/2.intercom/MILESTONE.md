---
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — stubbed at charter
---

# Milestone 2 — intercom: the channel as product

> Stubbed at charter (26-07-28); hardens just-in-time via `/plan work/milestones/2.intercom/` — the hardening dialog absorbs M1's measured numbers (heartbeat cadence, warm-fork verdict) before committing to a design.

## Objective

Build the persistent stream-json channel as project-generic product in `.claude/bin/`, BASELINE-manifested: the lifecycle machinery the fork-per-question design got for free, plus the warmth policy the economics require (D1, D2).

## Scope (gist)

- **Process ownership** — spawn at campaign open, session-id capture, stall-kill, restart after reboot, teardown at campaign close.
- **Warmth policy** — heartbeat cadence derived from M1's measured break-even; quiet-stretch pre-warm.
- **Routing convention** — how an inferior session's consult reaches the channel's stdin and how the answer routes back (local machine only, per charter non-goal).
- **Crash semantics** — a died channel degrades to the fork ladder without losing a question.
- **Boundary enforcement** — the channel path carries the read-only consult contract (D5).
- Genericity is the acceptance test; machine facts route to the `work/PROJECT.md` seam.

## Phase gists

| # | Phase | Gist |
| --- | --- | --- |
| 1 | channel-core | The channel tool: spawn/hold/teardown, session-id capture, turn send/receive, usage capture |
| 2 | lifecycle | Warmth policy, stall-kill, restart, crash-degrade; BASELINE manifest rows |

(Phase shape is a stub guess; hardening may recut it.)

## Depends on

M1 passed its gate; its cost-matrix numbers are inputs to the warmth policy.
