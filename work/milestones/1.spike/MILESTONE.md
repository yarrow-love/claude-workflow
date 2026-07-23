---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect (stub)
---

# M1 — spike: empirical verification of subagent dispatch

> Status: pending — **stub**; harden via `/plan work/milestones/1.spike` before execution.

## Objective

Establish, on the installed CLI, the ground truth the conversion rests on — the five probes from the proposal (§ The spike). Verdicts recorded per probe; M2 is gated on pass.

## Scope (gist)

With `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2` set for the probe session: (1) depth-2 dispatch works (subagent spawns subagent; record CLI version + behavior); (2) mid-turn SendMessage delivery semantics to a running subagent; (3) operator-panel visibility of nested transcripts; (4) durability — locate `subagents/agent-*.jsonl`, end parent, `claude --resume <parent>` then continue the subagent with context intact; (5) per-call model honored at both depths + permission-mode inheritance matches documented dominance.

## Phases (gist)

Likely one phase (probe battery + verdict write-up); the `/plan` dialog may split env-setup/runbook from probes. Results land in the milestone's work order — the admissible evidence D2 names.

## Acceptance (gist)

Every probe has a recorded verdict (pass / fail / adapted-with-note) reproducible from its written recipe; a fail on probes 1 or 4 triggers the mission's failure-criteria path, not silent workaround.
