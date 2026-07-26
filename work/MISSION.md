---
mission: v2.repo-hygiene
branch: 26-07-25
status: chartered
sessions:
  - architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d # mission architect
---

# Mission v2 — repo hygiene: the Janitor competency and the declared-structure floor

> Chartered 26-07-25 by operator commission, on full endorsement of the adopted proposal [`work/proposals/26-07-25.repo-hygiene.md`](proposals/26-07-25.repo-hygiene.md) — its design and fork resolutions bind this mission; the charter adds the mission-scale frame. Second mission this repo has chartered (predecessor: `v1.subagent-boundary`, closed accomplished 26-07-24, archive on branch `26-07-23`); the mission rides branch `26-07-25` (mission = branch). Operator amendment at commission: **single-milestone mission**.

## Objective / why now

Give repo hygiene an owner and a gate. The template states hygiene as a value in prose but assigns it to no role and no mechanism, so consuming projects drift structurally even when the work is good — evidenced now in two dogfooding projects (`~/dev/orchestra`'s operator-directed `src/` reorg and first `/triage`; the same classes observed in `~/dev/lasers`). The fix: every consuming project **declares** its structure through the `work/PROJECT.md` seam, and a new **Janitor** staff competency **reconciles actual against declared** — as a hygiene lens on the existing Blessing gate (prevention), a blocking pass at milestone close (enforcement), and an operator verb `/clean` (on demand). Why now: the evidence is fresh, formally filed, and the drift compounds with every milestone that closes without a boundary pass.

## Scope

The proposal's design, at mission scale: the declared-structure floor into canon (PROJECT.md § Structure defaults, work/README doctrine, BASELINE); the Janitor competency (`.claude/agents/janitor.md`) and the `/clean` command; gate wiring across architect/manager/executor docs (blessing lens, advisory order-close checklist, blocking milestone-close pass); the where-artifacts-land statement in planning artifacts; a dogfood validation of `/clean` against this mission's own tree; enactment filing; fold-back preparation under the standing purification doctrine.

## Non-goals

- Any change to consuming projects themselves — Orchestra's note is evidence; Orchestra fixes Orchestra (the one-way valve stands in both directions).
- The dispatch architecture, consult mechanics, session archive — untouched (v1's product).
- A new executive tier or scheduler — the Janitor is staff, not command (D3).
- Whole-canon reference gating *per-commit* — the generalized gate runs at `/clean`-time only (fork 5 resolution).
- v1's carried design questions (verdict-absence collection, footgun-index convention, `/configure`) — except where the dogfood pass naturally dispositions the two declared-vs-actual bugs (see Settlement — triage).

## Settlement — determinations

**D1 — The proposal binds.** The adopted proposal's design — declaredness + reconciliation as the invariant floor, the five audit axes, the three-rung remedy ladder, the hat pattern, the surfaces list — is this mission's spec, including the recorded fork resolutions. Where a milestone doc and the proposal disagree, the proposal wins until explicitly revised here.

**D2 — The declaration home is `work/PROJECT.md § Structure`.** Template defaults ship via BASELINE's bootstrap guidance (root-file allowlist, product/non-product boundary, package-root placement, archive convention); a project amends its declaration rather than inventing one. `.claude/` carries the axes and the mechanism, never a project's facts — **genericity remains the acceptance test**, and the floor must be statable without a single project-shaped fact in `.claude/`.

**D3 — The Janitor is a competency, not a dispatch tier.** Defined once in `.claude/agents/janitor.md`; worn as a hat by the presiding session at each boundary (Architect at blessing, Manager at order close, Executor at milestone close); fresh-session form exists only under `/clean` (operator-run, authority mode, judgment-closed). It audits, routes, and gates — never performs structural surgery inline; rung-2 findings become typed remedy work orders through normal blessing and execution.

**D4 — Gate semantics.** Milestone close is **blocking**: the pass runs clean, or its contestable findings are explicitly escalated (automatic mode: ESCALATE halt, mirroring Blessing). Order-close checklist is **advisory** (whole-repo drift is invisible at order scale — fork 4). The blessing hygiene lens verifies the plan's required *where-artifacts-land* statement against the declaration.

**D5 — Purification at close is standing doctrine, inherited.** v1's D4 holds: `main` stays the pure project-generic template; at close, product folds and the branch (tagged) carries the archive. The proven recipe is inherited by reading `git show 26-07-23:work/missions/v1.subagent-boundary/runbooks/fold-and-close.md` — including its hard lesson: **derive keep-column membership from the specification, never from the tree.** This mission's new product files (`janitor.md`, `clean.md`, BASELINE/doctrine edits) join the keep column via BASELINE, same-commit as they land.

**D6 — Dogfood is the validation.** The first real `/clean` runs against this mission's own tree at milestone close, exercising all three rungs in anger. The two carried declared-vs-actual bugs from v1 (`bug.baseline-postdate-list-divergence` — BASELINE names 3 post-scaffold paths, the gate sanctions 7; `bug.footgun-index-convention-drift`) are the pass's seeded subjects: a hygiene system that cannot detect the divergences its predecessor already found has failed its acceptance.

## Settlement — triage (from v1's close)

- **Footguns**: v1's ledger (`consult.md`, `bin-scripts.md`) — **carried as watch**, out of this mission's subsystems; the consult deny-list reconciliation stays pinned to harness upgrades, untouched here.
- **Todos**: `26-07-11.configure-command` — stays archive-carried; not re-seeded (non-goal). `26-07-22.lan-intercom` — stays halted/archived (Orchestra valve). The two declared-vs-actual bugs — **re-seeded as dogfood subjects** (D6), dispositioned by the validation pass, not re-opened as standalone orders.
- **Proposals**: `26-07-25.repo-hygiene` (adopted) enacts via this mission — files to `_enacted/` in the validation phase. v1's `_deferred/` set persists untouched.
- **Design canon / runbooks**: empty scaffold on this branch; v1's `fold-and-close.md` runbook inherited by archive reference (D5).

## Amendments

**A1 — Footprint: `.claude/bin/` enters scope (26-07-25, operator-approved at milestone planning).** Neither the proposal's "Surfaces touched" list nor this charter's Scope names `.claude/bin/` — an omission by abstraction (surfaces were enumerated from the doctrine-and-wiring perspective; mechanization was never confronted), which under D1 leaves it undecided rather than implicitly permitted. Resolved: **`.claude/bin/reference-gate` lands this mission**, carrying the whole-canon reference-integrity axis as executable product, with its BASELINE manifest row and tooling smoke-test row. Rationale (mission architect, consulted): D2's "mechanism" was written against *a project's facts*, not against code — `.claude/bin/` is already product, and the declaredness split maps as **engine → product, facts → seam**; a generic script that reads its sanctioned-absence list from the declaration is the purest embodiment of D2 in the mission, more so than the status quo where a generic mechanism sits camouflaged as a project fact inside `work/PROJECT.md`. A prose-only axis every consuming project re-authors is precisely the "prose without an owner" failure this mission exists to kill. Delivery: via a typed rung-2 remedy work order under normal blessing during the dogfood phase, which gives the pass a real rung-2 subject. Scope and success criterion 2 read as extended accordingly.

**A2 — `work/PROJECT.md § Structure` carries a sanctioned-absences subsection (26-07-25).** Interpretation of D2, bound at milestone planning: the declaration must be a list a *mechanism* can read, not prose buried in a gate recipe. Sanctioned absences are structural facts; § Structure is the declared home for structural facts. This gives the sanctioned-absence set exactly one authoritative home — which is also the disposition D6's seeded divergence A resolves into, and therefore must **not** be pre-applied before the dogfood pass detects it.

**A3 — The child-collection rule enters phase-3 wiring (26-07-25; ratified by the operator with the mission architect's blessing, Non-goals explicitly overridden — see the provenance note at the end of this amendment).** The charter parked v1's carried design question — verdict-absence at the Manager boundary — as a non-goal. This mission's own campaign then produced the **fourth in-anger instance** (`executor@play/9362ff9f-c270-4704-97cc-14d527ba9f12`, phase-1 campaign note): the phase-1 Manager stopped a turn short of its verdict with work uncommitted, and its depth-2 implementer's report stranded upward to the Executor — platform topology: a child's report travels only by *collection*, and a depth-2 agent cannot address its parent by name, so an uncollected child's report lands with whoever is active above. The evidence base v1's close was deliberately waiting for now exists: four instances across two missions, one consistent trigger (*"a Manager dispatches a child near the end of its work and treats the dispatch as completion"* — v1 closing report), one proven recovery (the SendMessage nudge). Resolved: the **child-collection rule** lands in phase 3 — *a Manager's turn may not end between dispatch and collection; dispatch is never completion; the only legitimate turn-ends are the Acceptance Verdict, a pause-and-ask question, or an explicit ESCALATE.* Division of labor per this mission's own doctrine: the janitor's axis 5 (work-tracking fidelity) *detects* the resulting divergence at boundaries; this rule *prevents* it at the dispatch site; the Executor's nudge remains the documented recovery when it is breached. Phase 3's scope and acceptance read as extended (its doc carries the A3 block).

*Provenance (recorded 26-07-25 by `executor@play/9362ff9f-c270-4704-97cc-14d527ba9f12`; corrected same day).* This amendment was committed mid-campaign (`f435cc9`) carrying an authorization line reading "operator-approved". The campaign Executor, seeing no operator input in its own session since the Reconnaissance gate, inferred the approval had not been given and surfaced it as a fabricated authorization. **That inference was wrong.** The mission architect attests that the operator approved A3 explicitly, in the architect dialog, before the commit — a dialog the Executor had no visibility into. The error was in treating one session's view as the whole record; approval had been obtained through the proper channel, in a conversation held elsewhere.

The gap the episode exposed is real and is being fixed: the amendment **claimed** an approval without naming the approving session, leaving a mid-campaign observer no way to verify it. That is a declared-vs-actual gap in this charter's own grammar — the same class of defect this mission exists to kill, found in the mission's own instrument. The remedy rides `work/proposals/26-07-25.return-path.md`: **charter amendments carry the approving session's callback handle**, with A1–A3 receiving retroactive stamps and A4 born stamped.

## Success criteria

1. The floor is canon: PROJECT.md § Structure defaults in BASELINE's bootstrap guidance, doctrine in `work/README.md`, and the genericity test holds — zero project-shaped facts entered `.claude/`.
2. The competency is product: `.claude/agents/janitor.md` and `.claude/commands/clean.md` land; the blessing lens, the planning where-artifacts-land statement, the advisory order-close checklist, and the blocking milestone-close pass are wired in the architect/manager/executor docs; BASELINE manifest updated in the same commits.
3. The dogfood `/clean` ran against this tree with all three rungs exercised and recorded: ≥1 mechanical auto-fix committed, each rung-2/rung-3 finding either produced (filed order / escalated fork) or explicitly recorded as none-found — and both D6 seeded divergences detected and dispositioned.
4. Enactment filed: the proposal moved to `_enacted/` with stamp; reconciliation notes appended where the build diverged.
5. Fold-back prepared per D5: keep-column derived from specification, rehearsed; the close itself remains the operator's `/close` ceremony.

## Failure criteria

- The floor cannot be stated without project-shaped facts leaking into `.claude/` — the genericity test fails → close **failed**; the floor re-scopes to a thinner universal before any re-charter.
- The dogfood pass shows the blocking gate is unworkable (blocks on noise, or the hat pattern cannot run affordably without fresh dispatch) → the gate demotes on-branch and the mission closes **failed** with rationale; an advisory-only variant files as a standing proposal.
- The dogfood pass misses both D6 seeded divergences → detection is not real; close **failed**, the competency does not fold.

## Roadmap

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [janitor](milestones/1.janitor/MILESTONE.md) | The whole arc as phases: floor into canon → competency + gate wiring → dogfood-validate, enact, fold prep | — | pending |
