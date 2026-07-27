---
mission: v2.repo-hygiene
closed: 26-07-26
outcome: accomplished
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # close ceremony — drafted this report; the judgment is the operator's, quoted verbatim below
---

# Closing report — mission v2.repo-hygiene

## Outcome

**Accomplished.** The operator's judgment, rendered in the close dialog of 26-07-26 and recorded verbatim:

> "I think that the mission was successful not only in implementing the 'janitor' role for codebase organization maintenance, but also for raising and hopefully apparently resolving some issues that we were having in the agentic callback mechanism. […] I want us to close the mission successfully and fold the upgraded `.claude` workflow into the clean, templatized `main` branch."

followed, after the good-state review and the two pre-fold remediation orders, by the close instruction: *"Then /close the Mission by archive into work/missions/."*

**Panel attestation: N/A.** v2's success criteria contain no operator-observability item (the dogfood and probe criteria require *recorded* evidence, which the archive carries); § 5b of the ceremony runbook therefore has nothing to attest.

**Ceremony deviations, recorded honestly.** (1) The retrospective was compressed into the close-review dialog rather than run as a separate § 4 conversation — the operator reviewed mission state, ordered two remediation campaigns, and rendered judgment in the same thread. (2) The archive model changed *at* this close, operator-directed: mission archives now live in-tree on **`dev`, the process branch**, rather than tag-only; the tag `v2.repo-hygiene-closed` is still cut and every pre-existing provenance pointer resolves unchanged. (3) The ceremony was executed by the standing mission-architect session at operator instruction, not hand-run — each gate's evidence is in this branch's history.

## What shipped

- **M1 — the Janitor** (closed 26-07-25): the declared-structure floor (`work/PROJECT.md` § Structure as the parse target, schema in BASELINE, doctrine in `work/README.md`); the competency (`.claude/agents/janitor.md`, `.claude/commands/clean.md`); the asymmetric gates (blessing lens, advisory order-close, blocking milestone-close); `.claude/bin/reference-gate` (A1); the dogfood pass that detected both D6 seeded divergences. All six success criteria discharged; the three failure criteria never fired.
- **M2 — return-path** (closed 26-07-26): the chartered theory was falsified and replaced — the collection invariant stated once (`work/README.md`), the role-scoped allowance, continuations as send-then-read at the root only, fresh-restored-by-reading below it, ADR D3 with its version-pin ledger, the routing standing hazard. R4 (depth-1 orchestration unsound) never fired; A3 was annotated, never rewritten.
- **Close-window remediations** (26-07-26, operator-ordered): the dispatch-record convention (`work/todos/README.md` § Document structure; proposal `26-07-26.dispatch-ledger.md` enacted, option (a)); divergence B resolved by option 2 — ten sites across nine files retargeted from the phantom root-`CLAUDE.md` footgun index to the `work/footguns/` ledger + ADR § Standing hazards.
- **Adopted at this close**: the `dev` process-branch model with mission-named branches (root `CLAUDE.md`, ADR § Continuation protocol) — smaller, tighter-scoped missions on feature branches, full history in-tree.

## What didn't ship, and where it went

- **The codebase-memory protocol** — filed as the standing proposal `work/proposals/26-07-26.codebase-memory-protocol.md` (verified freshness, evidence-passing dispatch, store-contention hazard, version-robust authoring). Founds the successor mission; BASELINE knowingly folds with two wrong lines the proposal names as the successor's first mechanical fix.
- **The concurrent-tree-commit bug** — live in `work/todos/BACKLOG.md`, unclaimed; same shared-mutable-store family as the proposal's pillar 3.
- **Open design forks, raised not resolved**: canon link styles (M1 4a forks 2/3 — file-relative vs root-anchored; `_done/` moves breaking relative links); the two § Structure amendment questions (genericity-probe pin; `work/runbooks/` as a planning-artifact root — ceremony-runbook finding 8); M2's two cheap-reversal flags ("in any seat" scoping of in-turn collection; the fresh-restored-by-reading context cost).

## What the work system itself taught

- **Prose discipline does not hold under pressure; shape does.** A3's rule was breached five times by well-briefed sessions; the collection invariant survives because the platform's own conversion rule enforces it, and the `agentId` requirement only became reliable when it got a slot in the artifact Managers actually fill in. The repeated lesson: put the rule where the writing happens, not where the reading happens.
- **Version-robust doctrine is authorable.** M2's premise inverted with a CLI point release; the remedy — canon rides only behaviors observed under both routings, everything else version-pinned in a ledger — is the pattern the codebase-memory proposal now reuses (P4).
- **The instrument caught real defects, including its own.** reference-gate's first three live FAILs were all the same class (`_done/` moves breaking rows that point at the moved file); the blocking close pass found a stale roadmap row *and* recorded its own under-scope as instrument evidence in the method-gap bug's resolution.
- **Concurrency is the emerging theme.** Two authorized sessions sharing one git index silently absorbed each other's hunks; three MCP server instances sharing one SQLite store wedged its WAL (foreign-repo evidence). Different stores, one failure family — the successor mission's center of gravity.
- **Cost honesty**: the operator judged the mission successful *and* far more work-intensive than expected. The dev-branch + mission-named-branch model adopted at this close is the structural response — smaller missions, tighter charters, cheaper closes.

## Triage dispositions (§ 6), as ruled at ceremony

Prepared dispositions confirmed as written in the runbook, with these instantiations: all `_done/` orders and both resolved bugs archived here; `_enacted/` proposals archived preserving the `_enacted/` segment; the fold-and-close runbook retired into `runbooks/`; the session store (140/140 MANIFEST-verified) into `sessions/`. Rulings on the operator-call items: **`work/footguns/claude-bin.md` carries live** (the ledger is the canonical live seam post-retarget; the product-side hazard is already in ADR); **`work/notes/26-07-25.child-collection-evidence.md` stays live at `work/notes/`** (no archive lifecycle exists for notes; root-anchored references to it keep resolving); **`src/README.md` folds as-is** (decision A — the branch diff is strictly a repair; the residual instance sentence predates this mission); **`work/missions/README.md` keeps its ledger rows** (decision B — read as deliberate canonical-repo history, consistent with § Layout calling it the ledger; now doubly so, since `dev` carries the archives the rows describe). The live carry-forward set on `dev`: `PROJECT.md`, `BACKLOG.md` + the concurrent bug, the codebase-memory proposal, the footgun ledger, the notes file, the deferred proposals.

## Session-store arithmetic (§ 1)

17 stamped handles → 9 distinct UUIDs: **8 archived** in the store carried into `sessions/play/` here, **1 carried on the v1 tag** (`a9ddd6b3…`, the founding architect — verified readable at `git show v1.subagent-boundary-closed:…`; the continuation protocol working, not a hole), **0 LOST**. The ceremony session itself (`76ba13c6…`) has a pre-close archive in the store; its final transcript lands at `work/sessions/play/` on `dev` at SessionEnd, *outside* this archive — expected, per the runbook's § 12 note.

## Reader's index

Start here: [`MISSION.md`](MISSION.md) (charter + amendments A1–A4 — A3's annotation is the mission in miniature). Then: [`milestones/2.return-path/MILESTONE.md`](milestones/2.return-path/MILESTONE.md) (the falsification-and-rebuild arc), [`todos/_done/26-07-26.cartography.md`](todos/_done/26-07-26.cartography.md) (the evidence base D3 cites), [`todos/_done/26-07-25.execute-m1-janitor.md`](todos/_done/26-07-25.execute-m1-janitor.md) and [`todos/_done/26-07-26.execute-m2-return-path.md`](todos/_done/26-07-26.execute-m2-return-path.md) (campaign logs), [`proposals/_enacted/`](proposals/_enacted/) (the three enacted designs), [`runbooks/fold-and-close.md`](runbooks/fold-and-close.md) (this ceremony's recipe and rehearsal record — the next close authors its own edition against the dev model).
