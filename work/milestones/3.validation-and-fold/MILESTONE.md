---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect (stub)
  - architect@play/6a0035c9-cd57-4573-8e3a-b22dc4cba6c2 # milestone architect
---

# M3 — validation and fold: prove the boundary, purify the template

> Status: pending — hardened 26-07-24 (`/plan`, three phases, `/execute`-ready). Re-scoped with the operator: M2's campaign already ran under the new boundary (early dogfood, operator-chosen at its gate) and recorded the downward nudge in anger; M3 completes the criterion-3 evidence, adds the `.claude/ADR.md` deliverable, and stages the fold — the `/close` ceremony and the fold execution remain the operator's, after M3 closes.

## Objective

Complete the mission's evidence and land its durable record: criterion 3 closes fully (both call-and-response directions + operator panel attestation, recorded); the proposal files to `_enacted/`; the D4 doctrine rewrite and a new terse `.claude/ADR.md` make the workflow's architectural decisions durable on the product side of the seam; and the fold-back is staged as a rehearsed, file-enumerated recipe so `/close` runs as pure ceremony — judgment, report, tag — with no mechanical work left inside it, and `main` emerges the pure project-generic template.

## Scope

- **Validation completion** (phase 1 opens the ledger; phase 3 completes it): the criterion-3 evidence ledger in this campaign's log — M2's in-anger verdict-absence nudge cited (downward ✓, [`26-07-24.execute-conversion.md`](../../todos/_done/26-07-24.execute-conversion.md)); ≥1 upward pause-and-ask exercised in this campaign on a real Executor-held judgment item (phase 3); the operator's live-panel attestation recorded *(operator-gated)*.
- **Enactments + bookkeeping** (phase 1): `26-07-23.subagent-manager-boundary.md` → `_enacted/` (`status: enacted`, closer's stamp, reconciliation note carrying the premise-1 inversion and the validated-in-anger notes); `MISSION.md` roadmap-row bookkeeping (M2 → done); archive-sweep spot-check ahead of close.
- **D4 doctrine + ADR** (phase 2, operator-confirmed 26-07-24): root `CLAUDE.md` + `README.md` rewritten — product-on-`main` / instance-on-mission-branches, bootstrap simplifies to "clone `main`", Provenance points at the mission tag + ADR, the footgun-index table becomes an ADR pointer. New **`.claude/ADR.md`** (BASELINE-manifested, ships with the bootstrap): the founding determinations, mission v1's D1–D5 as amended, a standing-hazards section absorbing the product footguns, and the continuation protocol for future workflow development. BASELINE scaffold-enumeration gaps close in the same pass.
- **Fold preparation** (phase 3, operator-confirmed 26-07-24 — staged recipe, never executed by M3): the file-level purification manifest (including `main`'s *own* residual instance content — main is not pure today); the fold recipe (merge `26-07-23` → `main`, known conflict surface `b332083`, purification commit, template quality gate); a **dry-run rehearsal in a disposable worktree** as the acceptance instrument; the consolidated close runbook (ceremony → tag `v1.subagent-boundary-closed` → fold → verify) with prepared triage dispositions for the open orders.

## Out of scope

- **Running `/close` and executing the fold** — operator-invoked ceremony, after M3 closes; M3 stages and rehearses, never performs (charter: "the close itself remains the operator's `/close` ceremony").
- Amending `.claude/commands/close.md` with fold/purification steps — genericity violation; a consuming repo's `work/missions/` is institutional memory and never purifies (operator-confirmed 26-07-24).
- The configure-command feature work (`todos/26-07-11.configure-command.md`) — not drafted into validation; its disposition is a prepared `/close` triage recommendation (archive open-carried; re-seed on a future mission branch).
- The lan-intercom order and proposal — Orchestra's territory; halted state carries into the archive untouched.
- Depth-2 SendMessage certification and any further probing — the mission's evidence base is closed with M1 + the campaign instances.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [validation-and-enactment](1.validation-and-enactment.md) | Criterion-3 ledger opened (nudge citation + panel attestation); proposal to `_enacted/` with reconciliation note; MISSION bookkeeping; archive spot-check | pending |
| 2 | [doctrine-and-adr](2.doctrine-and-adr.md) | Root `CLAUDE.md`/`README.md` D4 rewrite; `.claude/ADR.md` authored + manifested; BASELINE scaffold-enumeration reconciliation | pending |
| 3 | [fold-preparation](3.fold-preparation.md) | Purification manifest; fold recipe rehearsed in a disposable worktree; close runbook + prepared triage dispositions; the Executor-held item exercising the upward pause-and-ask | pending |

The campaign runs under the converted boundary (subagent Managers per current canon) with the operator watching the panels — this campaign is itself the remaining validation instrument.

## Acceptance

- **Criterion-3 ledger complete in the campaign log**: the M2 downward-nudge citation; ≥1 upward pause-and-ask from this campaign (a Manager ending its turn with a real question, the Executor answering by SendMessage, the Manager resuming in place); *(operator-gated)* the operator's one-line live-panel attestation.
- The proposal sits in `work/proposals/_enacted/` with `status: enacted`, the closer's session stamp, and a reconciliation note recording the premise-1 inversion (depth var = cap) and the boundary's in-anger validation.
- Root `CLAUDE.md` and `README.md` carry the product-on-`main` doctrine with no passage presuming instance content lives on `main`; `.claude/ADR.md` exists, is terse, is BASELINE-manifested, and passes the genericity test (works verbatim in a consuming repo); the standing product hazards appear in it.
- The fold rehearsal passed: in a disposable worktree, the staged recipe produced a purified `main`-candidate tree whose `work/` matches BASELINE's scaffold enumeration exactly, and the template quality gate passed there (reference resolution against the bare tree, tooling smoke test, `/initialize` audit).
- The close runbook stands in `work/runbooks/`: `/close` ceremony order, tag name `v1.subagent-boundary-closed`, the fold recipe, post-fold verification, and prepared triage dispositions for every open order — such that `/close` has no mechanical work left inside it.
- `MISSION.md` roadmap rows current through M3; milestone status + roadmap rows updated at close per convention.
