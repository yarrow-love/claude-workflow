---
sessions:
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # mission architect — stub at charter
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # milestone architect — hardened 26-07-27, same session, milestone hat
  - executor@play/2c481bc6-cd99-42ad-8395-48fe66481dbf # campaign executor — /execute 26-07-27
---

# Milestone 1 — protocol

> **Closed accomplished 26-07-27.** Both phases passed phase and ultimate acceptance on one Manager pass each; the blocking hygiene pass ran clean. Campaign record: [`work/todos/_done/26-07-27.execute-protocol.md`](../../todos/_done/26-07-27.execute-protocol.md).

> **Hardened 26-07-27** (operator dialog: two phases, not the stub's three — the mechanical fix rides phase 1 as its mandated first commit, avoiding the double-touch of BASELINE's graph bullet; the `.claude/protocols/` class is defined by its BASELINE manifest section, no directory README, per the `.claude/` precedent). Charter: [`work/MISSION.md`](../../MISSION.md); spec: the adopted proposal (charter D1); determinations D2/D3/D4/D6 bind every phase.
>
> **Amended 26-07-27 at the Reconnaissance gate** (campaign log: [`work/todos/_done/26-07-27.execute-protocol.md`](../../todos/_done/26-07-27.execute-protocol.md) § Reconnaissance; architect rulings A1–A9). The site count moves **eight → nine**: reconnaissance found `src/README.md:5` asserting the trust-the-index bargain verbatim in a bootstrap-copied scaffold file, outside every acceptance criterion. The charter's success-criterion-3 numeral is **not** rewritten — the operative clause is the totality ("all … sites point at the protocol"), the numeral a charter-time enumeration snapshot already superseded once at hardening; close-out measures the totality (architect attestation, `architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43`).

## Objective

The codebase-graph protocol into product: the two knowingly-wrong BASELINE lines dead, `.claude/protocols/codebase-graph.md` authored as the single product-side home for the P1 verification recipe, the P3 recovery procedure, and the P2 evidence-passing contract, and every graph-prescribing site rewired to point at it under the verified-freshness trust model — without weakening graph-first economics (D6).

## Scope

- The mechanical truth fix (BASELINE's deprecated raw-JSON CLI form; the `auto_index`-keeps-it-fresh claim; `initialize.md`'s echo of the `auto_index` recipe) — phase 1, mandated first commit.
- `.claude/protocols/` founded: the BASELINE manifest section that defines the class (cross-agent operational protocols — procedures more than one role enacts, stated once, pointed at from role cards) and the first member, `codebase-graph.md`.
- The rewire of every graph-prescribing site — **nine**, not the proposal's six: the charter added root `README.md` step 3, milestone grounding added `manager/CLAUDE.md` (its brief and dispatch-record conventions are where P2's evidence must ride), and the Reconnaissance gate added `src/README.md` (the scaffold file's "graph answers always describe the current system" clause).
- The two product-class enumerations the new `.claude/protocols/` directory makes stale — root `CLAUDE.md:3` and root `README.md:3` — amended in phase 1's manifest commit (the A5 knock-on rule one level up). These are not sites: they describe the product's directory classes, they prescribe no graph usage, and they do not enter the count.

## Out of scope

- The ADR standing hazard, the P4 version ledger, the interim git fix, the live spot-check, enactment filing — all M2 (`2.hazard-and-evidence`).
- Any `.claude/bin/` tooling — the protocol is doctrine, not mechanization; a verification script is a candidate future proposal, not this milestone.
- Consuming-repo changes (`lasers` fixes `lasers`); upstream contributions.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [author](1.author.md) | Mechanical truth fix as commit #1, then the protocol doc authored and BASELINE's graph bullet + manifest rewritten once, into final form | done (26-07-27) |
| 2 | [rewire](2.rewire.md) | The remaining eight sites point at the protocol under the verified-freshness trust model; D6 guard verified across all of them | done (26-07-27) |

## Acceptance

Milestone-level — the Executor's ultimate-acceptance test, over and above each phase's own criteria:

1. Charter success criteria 1–3 are discharged: the mechanical fix is an identifiable standalone landing; the protocol is product (manifested, generic, carrying recipe + recovery + contract); all **nine** sites point at it and none names `head_sha`/`index_status` as a freshness signal. The count is measured as a totality, not against the charter's snapshot numeral (see the amendment note above); `head_sha`/`index_status` occurring *inside the protocol, named as non-signals*, is correct and expected — the test is semantic, not an empty grep.
2. D6 holds everywhere: every rewired role card still prescribes the graph first for structure questions — the trust model changed, the tool choice did not.
3. The genericity test passes on every `.claude/` change: zero machine- or project-shaped facts (no absolute paths, no `lasers`, no per-OS command specifics — those route to the `work/PROJECT.md` seam guidance the protocol itself states).
4. `bun .claude/bin/reference-gate check` — 0 failures; BASELINE manifest updated in the same commit as any file it lists.
