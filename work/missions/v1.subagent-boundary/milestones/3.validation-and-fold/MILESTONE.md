---
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect (stub)
  - architect@play/6a0035c9-cd57-4573-8e3a-b22dc4cba6c2 # milestone architect
  - executor@play/2bd6ea6d-d5b5-43cb-bfcc-743b1494caa2 # campaign executor
---

# M3 — validation and fold: prove the boundary, purify the template

> Status: **done (26-07-24)** — all three phases PASS; criterion 3 complete in all three legs; the ceremony staged with zero mechanical work remaining (campaign log [`26-07-24.execute-validation-and-fold.md`](../../todos/_done/26-07-24.execute-validation-and-fold.md)). Hardened 26-07-24 (`/plan`, three phases, `/execute`-ready); executed 26-07-24 as a subagent-Manager campaign. Re-scoped with the operator: M2's campaign already ran under the new boundary (early dogfood, operator-chosen at its gate) and recorded the downward nudge in anger; M3 completes the criterion-3 evidence, adds the `.claude/ADR.md` deliverable, and stages the fold — the `/close` ceremony and the fold execution remain the operator's, after M3 closes.

## Objective

Complete the mission's evidence and land its durable record: criterion 3 closes fully (both call-and-response directions + operator panel attestation, recorded); the proposal files to `_enacted/`; the D4 doctrine rewrite and a new terse `.claude/ADR.md` make the workflow's architectural decisions durable on the product side of the seam; and the fold-back is staged as a rehearsed, file-enumerated recipe so `/close` runs as pure ceremony — judgment, report, tag — with no mechanical work left inside it, and `main` emerges the pure project-generic template.

## Scope

- **Validation completion** (phase 1 opens the ledger; phase 3 completes it): the criterion-3 evidence ledger in this campaign's log — M2's in-anger verdict-absence nudge cited (downward ✓, [`26-07-24.execute-conversion.md`](../../todos/_done/26-07-24.execute-conversion.md)); ≥1 upward pause-and-ask exercised in this campaign on a real Executor-held judgment item (phase 3); the operator's live-panel attestation recorded *(operator-gated)*.
- **Enactments + bookkeeping** (phase 1): `26-07-23.subagent-manager-boundary.md` → `_enacted/` (`status: enacted`, closer's stamp, reconciliation note carrying the premise-1 inversion and the validated-in-anger notes); `MISSION.md` roadmap-row bookkeeping (M2 → done); archive-sweep spot-check ahead of close.
- **D4 doctrine + ADR** (phase 2, operator-confirmed 26-07-24): root `CLAUDE.md` + `README.md` rewritten — product-on-`main` / instance-on-mission-branches, bootstrap simplifies to "clone `main`", Provenance points at the mission tag + ADR, the footgun-index table becomes an ADR pointer. New **`.claude/ADR.md`** (BASELINE-manifested, ships with the bootstrap): the founding determinations, mission v1's D1–D5 as amended, a standing-hazards section absorbing the product footguns, and the continuation protocol for future workflow development. BASELINE scaffold-enumeration gaps close in the same pass.
- **Fold preparation** (phase 3, operator-confirmed 26-07-24 — staged recipe, never executed by M3): the file-level purification manifest (including `main`'s *own* residual instance content — main is not pure today); the fold recipe (merge `26-07-23` → `main`, known conflict surface `b332083`, purification commit, template quality gate); a **dry-run rehearsal in a disposable worktree** as the acceptance instrument; the consolidated close runbook (ceremony → tag `v1.subagent-boundary-closed` → fold → verify) with prepared triage dispositions for the open orders.

## Out of scope

- **Running `/close` and executing the fold** — operator-invoked ceremony, after M3 closes; M3 stages and rehearses, never performs (charter: "the close itself remains the operator's `/close` ceremony"). *(Re-scoped 26-07-24 — see the note below; the exclusion holds **through M3's own close**, then the ceremony runs immediately.)*
- Amending `.claude/commands/close.md` with fold/purification steps — genericity violation; a consuming repo's `work/missions/` is institutional memory and never purifies (operator-confirmed 26-07-24).
- The configure-command feature work (`todos/26-07-11.configure-command.md`) — not drafted into validation; its disposition is a prepared `/close` triage recommendation (archive open-carried; re-seed on a future mission branch).
- The lan-intercom order and proposal — Orchestra's territory; halted state carries into the archive untouched.
- Depth-2 SendMessage certification and any further probing — the mission's evidence base is closed with M1 + the campaign instances.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [validation-and-enactment](1.validation-and-enactment.md) | Criterion-3 ledger opened (nudge citation + panel attestation); proposal to `_enacted/` with reconciliation note; MISSION bookkeeping; archive spot-check | **done (26-07-24)** |
| 2 | [doctrine-and-adr](2.doctrine-and-adr.md) | Root `CLAUDE.md`/`README.md` D4 rewrite; `.claude/ADR.md` authored + manifested; BASELINE scaffold-enumeration reconciliation | **done (26-07-24)** |
| 3 | [fold-preparation](3.fold-preparation.md) | Purification manifest; fold recipe rehearsed in a disposable worktree; close runbook + prepared triage dispositions; the Executor-held item exercising the upward pause-and-ask | **done (26-07-24)** |

The campaign runs under the converted boundary (subagent Managers per current canon) with the operator watching the panels — this campaign is itself the remaining validation instrument.

## Re-scope note (26-07-24 — the fold executes; shape (b))

Appended at the campaign's Reconnaissance gate; the Scope, Phases, and Acceptance above are **unchanged** and remain the milestone's bar.

The operator authorized executing the fold, not merely staging it. Verbatim: *"I would like to authorize the fold itself -- consult the Architect agents for blessing. I just want the process to be totally completed, so that I can integrate the latest `main` into other projects, which are awaiting this upgrade (ie, ~/dev/orchestra)."* This utterance is the **invocation record** — the tier-ladder protection that the system never initiates its own mission close is satisfied by it, not bypassed.

Both architect handles were consulted and blessed the expansion in **shape (b)**: M3's three phases and their acceptance stand exactly as written and M3 closes *criteria-closed*; only then does the ceremony run — **M3 close → operator judgment + closing report + tag → fold per the rehearsed recipe → verification → push** — with the Executor as its mechanical arm. Shape (a), a fourth phase carrying the fold, was rejected: a phase whose acceptance is "the mission is closed" makes a milestone's criterion depend on the container that must outlive it, and the fold ends the branch's live work system, so M3's bookkeeping must strictly precede it.

Two protections are **not** transferable and remain the operator's:

- **The closing judgment.** `accomplished | failed | superseded` is rendered by the operator as an explicit utterance, recorded verbatim — never inferred from "proceed" or from silence. The Executor drafts the report; the operator amends and renders. Rationale: this campaign is criterion 3's measuring instrument, and an instrument cannot certify its own reading; the archive must not teach future missions that campaigns may certify themselves.
- **The criterion-3 attestation.** Operator-authored, landed *before* the ceremony opens. If it does not arrive, criterion 3 is incomplete and the closing report weighs that honestly — "accomplished, with the stated evidence gap" is a legitimate operator verdict; a backfilled attestation is not.

Any **history-rewriting operation on `main`** (as distinct from merge-plus-purification-commit, or a squash commit) would require its own fresh operator authorization.

Recorded for the record: the downstream driver is real but softer than stated — Orchestra is already bootstrapped and what it awaits is the updated `.claude/` manifest, which adoption-by-re-copy can take from this mission branch today. The purified `main` makes that re-copy canonical and diff-friendly; it does not gate it. Consequently a red rehearsal may delay the fold at no cost to Orchestra.

## Acceptance

- **Criterion-3 ledger complete in the campaign log**: the M2 downward-nudge citation; ≥1 upward pause-and-ask from this campaign (a Manager ending its turn with a real question, the Executor answering by SendMessage, the Manager resuming in place); *(operator-gated)* the operator's one-line live-panel attestation.
- The proposal sits in `work/proposals/_enacted/` with `status: enacted`, the closer's session stamp, and a reconciliation note recording the premise-1 inversion (depth var = cap) and the boundary's in-anger validation.
- Root `CLAUDE.md` and `README.md` carry the product-on-`main` doctrine with no passage presuming instance content lives on `main`; `.claude/ADR.md` exists, is terse, is BASELINE-manifested, and passes the genericity test (works verbatim in a consuming repo); the standing product hazards appear in it.
- The fold rehearsal passed: in a disposable worktree, the staged recipe produced a purified `main`-candidate tree whose `work/` matches BASELINE's scaffold enumeration exactly, and the template quality gate passed there (reference resolution against the bare tree, tooling smoke test, `/initialize` audit).
- The close runbook stands in `work/runbooks/`: `/close` ceremony order, tag name `v1.subagent-boundary-closed`, the fold recipe, post-fold verification, and prepared triage dispositions for every open order — such that `/close` has no mechanical work left inside it.
- `MISSION.md` roadmap rows current through M3; milestone status + roadmap rows updated at close per convention.
