---
sessions:
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # mission architect — stub at charter
---

# Milestone 1 — protocol

> **Stub** — gist-level at charter (26-07-27); hardens just-in-time via `/plan work/milestones/1.protocol/`. Charter: [`work/MISSION.md`](../../MISSION.md); spec: the adopted proposal (charter D1).

## Objective (gist)

The codebase-graph protocol into product: the two knowingly-wrong BASELINE lines fixed, the protocol document authored at `.claude/protocols/codebase-graph.md` (charter D2), and every graph-prescribing site rewired to point at it under the verified-freshness trust model (charter D3/D4) without weakening graph-first economics (charter D6).

## Phase gists

1. **mechanical** — fix `.claude/BASELINE.md:75`: current flag-form CLI recipe; `auto_index`/`auto_watch` truthfully split (`auto_index` governs only a first index of a new project; `auto_watch` is the refresher, and it is exactly what the evidence shows failing on renames — so BASELINE stops claiming any config key "keeps the index fresh"). Same-commit `/initialize` step-2 `auto_index` reference correction. Small, first, unblocks the rest.
2. **author** — `.claude/protocols/` founded (directory conventions + BASELINE manifest rows) and `codebase-graph.md` written: the P1 verification recipe (moved-path flip, `expected == actual` gate, full-re-index triggers, file-wins rule, `head_sha`/`index_status` as non-signals), the P3 recovery procedure (process-count precondition, WAL canary, kill-all → delete-store → single-server rebuild → verify), the P2 evidence-passing contract (what the dispatcher verifies, what rides the brief, the grep fallback rule). Consuming-seam guidance states *what* a project records in `work/PROJECT.md` — never a fact of any project. Transcription sources: the proposal; `~/dev/lasers/work/runbooks/codebase-memory.md` §§ interim-guidance/9/10 (evidence, not canon — rewrite generic).
3. **rewire** — the seven sites point at the protocol: BASELINE § Expectations bullet; researcher `CLAUDE.md` § Codebase Graph + Process step 3; `investigator.md`; `planner.md`; `execute-milestone.md` step 3 (recon becomes verify-once-pass-evidence); `initialize.md` step 2 (health per the protocol, not index-row presence); root `README.md:20`. Genericity test on every change; BASELINE manifest updated same-commit as any file lands.

## Dependencies

None (first milestone). M2 depends on this one: the hazard entry points at the protocol's recovery section, and the spot-check executes the recipe as-written from the landed text.
