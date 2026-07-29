---
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — stubbed at charter
---

# Milestone 1 — spike: the always-warm theory under test

> Stubbed at charter (26-07-28); hardens just-in-time via `/plan work/milestones/1.spike/`. **This milestone is the mission's go/no-go gate** (charter failure criterion 1): refutation closes v4 unaccomplished.

## Objective

Confirm or refute the adopted proposal's corrected premise — always-warm reload at ~0.1× — empirically, before any machinery is built. Everything listed as *spike-owned* in the charter's settlement becomes measured fact or refuting evidence.

## Scope (gist)

A single scripted session against a real large transcript, three parts per the proposal's § The opening spike:

1. **Hold-open mechanics** — spawn `claude -p --input-format stream-json --output-format stream-json`; verify session-id capture from the init event, live transcript append, mid-flight visibility in the CLI/Desktop surfaces, clean resume after process death.
2. **Cost matrix** — the same consult question measured four ways via per-turn `usage` fields (cold fork / warm fork / channel-within-TTL / channel-after-TTL), plus one heartbeat turn; yields the heartbeat break-even and tests the warm-fork corollary.
3. **Read-only boundary check** — the channel answers without acquiring the ability to act (permission mode / prompt contract), preserving D5.

Measurements append to `work/notes/26-07-28.consult-token-cost-evidence.md` (D6). Deliverable: the recorded verdict and numbers — no product changes.

## Phase gists

| # | Phase | Gist |
| --- | --- | --- |
| 1 | harness | Script the spike harness (spawn/turn-send/usage-capture) against a chosen large transcript |
| 2 | run-and-record | Execute all three parts; append measurements and verdict to the evidence note; operator reads the gate |

## Depends on

Nothing. First milestone; the mission's remaining roadmap is contingent on its verdict.
