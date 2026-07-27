---
sessions:
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # mission architect — stub at charter
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # milestone architect — hardened 26-07-27, same session, milestone hat
  - executor@play/2c481bc6-cd99-42ad-8395-48fe66481dbf # campaign executor — /execute 26-07-27
---

# Milestone 1 — protocol

> **Hardened 26-07-27** (operator dialog: two phases, not the stub's three — the mechanical fix rides phase 1 as its mandated first commit, avoiding the double-touch of BASELINE's graph bullet; the `.claude/protocols/` class is defined by its BASELINE manifest section, no directory README, per the `.claude/` precedent). Charter: [`work/MISSION.md`](../../MISSION.md); spec: the adopted proposal (charter D1); determinations D2/D3/D4/D6 bind every phase.

## Objective

The codebase-graph protocol into product: the two knowingly-wrong BASELINE lines dead, `.claude/protocols/codebase-graph.md` authored as the single product-side home for the P1 verification recipe, the P3 recovery procedure, and the P2 evidence-passing contract, and every graph-prescribing site rewired to point at it under the verified-freshness trust model — without weakening graph-first economics (D6).

## Scope

- The mechanical truth fix (BASELINE's deprecated raw-JSON CLI form; the `auto_index`-keeps-it-fresh claim; `initialize.md`'s echo of the `auto_index` recipe) — phase 1, mandated first commit.
- `.claude/protocols/` founded: the BASELINE manifest section that defines the class (cross-agent operational protocols — procedures more than one role enacts, stated once, pointed at from role cards) and the first member, `codebase-graph.md`.
- The rewire of every graph-prescribing site — **eight**, not the proposal's six: the charter added root `README.md` step 3, and milestone grounding added `manager/CLAUDE.md` (its brief and dispatch-record conventions are where P2's evidence must ride).

## Out of scope

- The ADR standing hazard, the P4 version ledger, the interim git fix, the live spot-check, enactment filing — all M2 (`2.hazard-and-evidence`).
- Any `.claude/bin/` tooling — the protocol is doctrine, not mechanization; a verification script is a candidate future proposal, not this milestone.
- Consuming-repo changes (`lasers` fixes `lasers`); upstream contributions.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [author](1.author.md) | Mechanical truth fix as commit #1, then the protocol doc authored and BASELINE's graph bullet + manifest rewritten once, into final form | pending |
| 2 | [rewire](2.rewire.md) | The remaining seven sites point at the protocol under the verified-freshness trust model; D6 guard verified across all of them | pending |

## Acceptance

Milestone-level — the Executor's ultimate-acceptance test, over and above each phase's own criteria:

1. Charter success criteria 1–3 are discharged: the mechanical fix is an identifiable standalone landing; the protocol is product (manifested, generic, carrying recipe + recovery + contract); all eight sites point at it and none names `head_sha`/`index_status` as a freshness signal.
2. D6 holds everywhere: every rewired role card still prescribes the graph first for structure questions — the trust model changed, the tool choice did not.
3. The genericity test passes on every `.claude/` change: zero machine- or project-shaped facts (no absolute paths, no `lasers`, no per-OS command specifics — those route to the `work/PROJECT.md` seam guidance the protocol itself states).
4. `bun .claude/bin/reference-gate check` — 0 failures; BASELINE manifest updated in the same commit as any file it lists.
