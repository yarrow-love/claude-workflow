---
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — stubbed at amendment A1
---

# Milestone 2 — instrumented-consult: make the cost observable

> Stubbed at **amendment A1** (26-07-28), replacing the superseded `2.intercom`; hardens just-in-time via `/plan work/milestones/2.instrumented-consult/`. Small and unblocking — the mission's measurement surface does not exist until this lands.

## Objective

Teach `.claude/bin/consult` to capture per-consult `usage` from the child's event wire instead of treating stdout as an opaque string, and report it alongside the answer. M1 established that the consult path emits **no** token data whatsoever, which makes charter success criterion 5 unrunnable by the mission's own tooling. Carry M1's two recorded-not-repaired defects in the same pass.

## Scope (gist)

- **Usage capture** — `--output-format stream-json` on the consult fork; read `result.usage` per M1's mapped wire (`input_tokens`, `output_tokens`, `cache_read_input_tokens`, `cache_creation_input_tokens`, plus the nested `cache_creation` TTL breakdown and cost). Report alongside the answer; append to the measurement surface (D6). Reporting shape per the herdr citation: **answer plus numbers, never the child's raw wire into the parent's context**.
- **DENY-list reconciliation** — four tools live in v2.1.220 and uncovered by the current array: `SendUserMessage`, `ListAgents`, `ReadMcpResourceDirTool`, and `Cd` (lower-confidence escape-class candidate, probe before adding). Reconciles the standing DENY-drift hazard (`.claude/ADR.md` § Standing hazards).
- **The false-clean-sheet fix** — `permission_denials` reported `[]` on all five M1 result events *despite two genuinely blocked tool attempts*. A boundary audit trusting that field reads a clean sheet on a session that was refusing tools. The real signal is `tool_result` with `is_error`; whatever reads the boundary must read that instead.
- **Oversized answers** — path-as-message as documented fallback (answer to file, return the path), never the default.

## Depends on

M1 — its mapped event wire is this milestone's specification. No new measurement required.
