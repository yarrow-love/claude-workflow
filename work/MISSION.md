---
mission: v3.memory-protocol
branch: v3.memory-protocol
status: chartered
sessions:
  - architect@play/2bd4068f-a96d-4295-afb8-8fee72bbeb43 # mission architect
---

# Mission v3 — the codebase-memory protocol: verified freshness, evidence-passing dispatch, and the shared-store hazard

> Chartered 26-07-27 by operator commission, founded on the standing proposal [`work/proposals/26-07-26.codebase-memory-protocol.md`](proposals/26-07-26.codebase-memory-protocol.md) — filed at the v2 close for exactly this purpose; its four pillars bind this mission (D1). Third mission this repo has chartered (predecessor: `v2.repo-hygiene`, closed accomplished 26-07-26), and the first opened under the `dev` process-branch model: the mission rides branch `v3.memory-protocol` off `dev` (mission = branch). Operator rulings at charter: theme scope is **protocol + hazard family** (the git-index remedy fork stays deferred); the doctrine home is **`.claude/protocols/`** (operator-named); acceptance is **docs + live spot-check**.

## Objective / why now

Replace the template's trust-the-index graph doctrine with the verified-freshness protocol. The template prescribes graph-first discovery for its read-heavy roles and trusts the index to be fresh; the `lasers` evidence (26-07-25) shows 0.9.0 does not deliver that bargain — a graph reporting itself current held 1,010 nodes for a deleted directory and zero for its replacement — and every symptom traced to open upstream defects, not local misconfiguration. The template folded to `main` at the v2 close with two knowingly-wrong BASELINE lines and six sites prescribing the inverse of upstream's own multi-agent contract; every consuming repo bootstrapped from `main` inherits the defect. Why now: the evidence base is fresh and still valid at charter (binary unchanged at 0.9.0, no 0.9.1 cut), upstream corroboration is accumulating rather than resolving (see Settlement — evidence delta), and the same defect class was reproduced live on this machine during chartering.

## Scope

The proposal's four pillars, at mission scale:

- **P1 — verified freshness**: the empirical verification recipe (known-moved-path query flip; `expected_* == actual_*` post-index gate; the full-re-index triggers; the standing rule *when graph and file disagree, the file wins — re-index, then re-ask*) stated once, product-side, with `head_sha`/`index_status` named as non-signals.
- **P2 — evidence-passing dispatch**: the orchestrating role verifies freshness once at recon/dispatch time and passes concrete evidence into subagent briefs (project, verification result, qualified symbols, paths, coverage); specialists treat the graph as pre-verified context and fall back to grep when the brief carries no verification. Composes with the dispatch-record convention (`work/todos/README.md` § Document structure).
- **P3 — store contention as a standing hazard**: the ADR entry naming the shared-mutable-store family (both known instances: the git index, the SQLite graph store), the WAL canary, and the sanctioned recovery sequence; plus the cheap interim fix for the git instance (document `git commit --only` in the commit conventions).
- **P4 — version-robust authoring**: doctrine rides observable discriminants only; every version-contingent reliance is pinned in an evidence ledger (binary version + upstream issue), the re-audit list on any binary upgrade — the v2 D3 pattern reapplied.
- **The mechanical first fix**: the two objectively-wrong BASELINE lines (deprecated raw-JSON CLI form; `auto_index` misdescribed as the freshness mechanism), which folded to `main` knowingly at the v2 close.
- **Validation**: one recorded live spot-check executing the protocol's verification recipe as-written against a real store; enactment filing.

Surfaces: the six sites the proposal names, plus the seventh the charter grounding found (root `README.md:20`, which asserts the graph+index as an `/initialize`-repaired capability), plus the new `.claude/protocols/` directory and its BASELINE manifest rows.

## Non-goals

- **The git-index remedy design fork** — worktree isolation vs staging discipline stays deferred in the backlog; this mission names the family in the hazard and lands the interim documentation only (operator ruling at charter).
- **Weakening graph-first economics** — the protocol adds verification; it never retreats to grep. Graph queries answering structure questions at a fraction of grep fan-out cost is the reason the prescriptions exist.
- **Upstream contribution or workaround engineering** — no patches, no wrapper tooling around the binary; the mission authors doctrine against the tool as shipped.
- **Consuming-repo changes** — the `lasers` runbook is evidence and transcription source; `lasers` fixes `lasers` (the one-way valve stands). The consuming-seam guidance this mission writes tells a project *what* to record in `work/PROJECT.md`, not any project's facts.
- **v2's open design forks** (canon link styles, § Structure amendment questions, the two cheap-reversal flags) — untouched unless a build collides with one, in which case escalate.

## Settlement — determinations

**D1 — The proposal binds.** The four pillars, the six-site defect table, the enactment shape, and the graph-first economics clause of `work/proposals/26-07-26.codebase-memory-protocol.md` are this mission's spec. Where a milestone doc and the proposal disagree, the proposal wins until this charter explicitly revises it.

**D2 — The doctrine home is `.claude/protocols/` (operator-named at charter).** A new manifested product directory class: cross-agent operational protocols — procedures more than one role enacts, stated once and pointed at from role cards. First member: the codebase-graph protocol (P1 verification recipe, P3 recovery procedure, P2 evidence-passing contract). The v2 D2 mapping extends: **doctrine → product, machine and project facts → the `work/PROJECT.md` seam** (install variant, store paths, per-OS recovery commands — the `lasers` runbook §§ interim-guidance/9/10 model the split and are the transcription source). Genericity remains the acceptance test.

**D3 — Freshness is verified, never inferred; when graph and file disagree, the file wins.** `head_sha` and `index_status` are named non-signals (upstream #1213: `head_sha` freezes at project-creation commit). The empirical discriminants — the moved-path query flip and the `expected_* == actual_*` gate — are the only sanctioned freshness evidence; the full-re-index triggers are bulk move/rename, branch switch, binary upgrade, and any graph result a file contradicts. Canon states the discriminants version-free; everything version-contingent rides the P4 ledger.

**D4 — Dispatch doctrine is orchestrator-verifies-then-passes-evidence.** Upstream's supported multi-agent contract, adopted as ours: the dispatcher (Executor recon step, Manager briefs) verifies once and the evidence rides the brief, recorded where dispatches are already recorded (the dispatch-record convention). Specialists do not independently trust live graph queries; a brief carrying no verification means grep fallback, not a trust upgrade. A clean `check_index_coverage` result means "no recorded gap," never completeness.

**D5 — The hazard is the family.** The ADR standing-hazard entry names **multi-session soundness of shared mutable stores** — two authorized sessions sharing one mutable store with no isolation — with both known instances: the git index (`work/todos/bugs/26-07-25.bug.concurrent-tree-commit-absorption.md`) and the SQLite graph store (WAL-checkpoint starvation; the `.db-wal` ≫ `.db` canary; kill-all → delete-store → single-server rebuild → verify as the sanctioned recovery). This mission remedies the graph instance fully and the git instance interim-only; the design fork stays in the backlog, named as deferred in the hazard entry so it cannot silently drop.

**D6 — Graph-first economics stand.** Restated from the proposal as a determination so no milestone weakens it while adding verification: the six sites keep prescribing the graph for structure questions; what changes is the trust model, not the tool choice.

## Settlement — evidence delta (charter-time grounding, 26-07-27)

Recorded so the P4 ledger authors from charter-verified state, not from the proposal's two-day-old snapshot:

- **Binary and config unchanged**: 0.9.0 (installed and latest release); `auto_index=false`, `auto_watch=true`. No 0.9.1 or rc cut; the `0.9.1-rc` milestone holds ~50 open items including #1213 and PR #1245 — both still open/unmerged. #914 open; #277/#50/#185 closed as at evidence time.
- **New corroboration, last 48 h**: #1296 and #1191 (MCP session serves a stale graph indefinitely after the watcher re-indexes — a freshness failure mode the proposal does not yet name: verification must run in the *serving session*, not just after re-index), #1206 (concurrent instances quarantine each other's healthy databases), #1083 (115 GB WAL via checkpoint starvation), #1037 (healthy db quarantined to `.corrupt` under concurrent access), #790 (project unqueryable behind stale WAL/SHM sidecars), #1287/#1273 (incremental-indexing correctness). The ledger absorbs these at authoring.
- **Local reproduction of the P3 precondition**: four concurrent `codebase-memory-mcp` processes observed on this machine against the one-project store, during chartering. The store was not wedged (WAL 0 bytes) but the sidecar mtimes show the #790/#1191 shape.
- **A seventh site**: root `README.md:20` prescribes the graph as part of the `/initialize`-repaired capability set — added to the rewrite surface alongside the proposal's six.

## Settlement — triage (from v2's close)

- **Footguns**: `work/footguns/claude-bin.md` — **carried, re-certified live** (this mission plans no `.claude/bin/` work, but the ledger is the live seam; untouched otherwise).
- **Todos**: `bugs/26-07-25.bug.concurrent-tree-commit-absorption.md` — **live, now aligned to this mission (D5)**: the hazard entry names it, M2 lands the interim `git commit --only` documentation, the remedy fork stays deferred. Backlog row updated at charter.
- **Proposals**: `26-07-26.codebase-memory-protocol.md` — **adopted at this charter**; stays in the root until the enacting work completes (M2 files it to `_enacted/`). The `_deferred/` set persists untouched.
- **Runbooks**: none live (v2's fold-and-close runbook retired into its archive; this close will author its own edition against the dev model at `/close` time).
- **Design**: no canon founded (the scaffold is empty by MVP allowance) — nothing to triage.
- **Notes**: `work/notes/26-07-25.child-collection-evidence.md` stays live per the v2 close ruling.

## Success criteria

1. **The mechanical fix landed**: BASELINE's index recipe uses the current flag-form CLI; `auto_index`/`auto_watch` are truthfully described everywhere; nothing in `.claude/` names `auto_index` as the freshness mechanism.
2. **The protocol is product**: `.claude/protocols/codebase-graph.md` exists, manifested in BASELINE, carrying the P1 verification recipe, the P3 recovery procedure, and the P2 evidence-passing contract — `head_sha`/`index_status` named non-signals, the file-wins rule stated — with zero machine- or project-shaped facts (the consuming seam carries those; genericity test passes).
3. **The sites are rewired**: all seven sites point at the protocol; the Executor recon step verifies once and passes evidence into briefs; researcher/investigator/planner cards treat brief-carried evidence as the trust basis with grep fallback when a brief carries none; `/initialize` step 2 checks health per the protocol rather than index-row presence; D6 holds — no site retreats from graph-first.
4. **The hazard is standing**: ADR § Standing hazards carries the shared-mutable-store family entry (both instances, the WAL canary, the recovery pointer, the deferred git fork named) and the P4 version ledger — every reliance pinned to 0.9.0 with its upstream issue, absorbing the charter-time evidence delta; the ledger is the re-audit list on any binary upgrade.
5. **The interim git fix landed**: `git commit --only` documented in the root commit conventions; the bug's backlog row reflects interim-mitigated / fork-deferred status.
6. **The spot-check ran**: the verification recipe executed as-written from the new canon text against a real store, recorded with evidence (operator-visible); any discrepancy fed back into the protocol text before fold.
7. **Enactment and gate**: the proposal filed to `_enacted/` with stamp; quality gate and `/initialize` green.

## Failure criteria

- **Genericity fails** — the protocol cannot be stated without machine- or project-shaped facts leaking into `.claude/`, i.e. the doctrine→product / facts→seam split does not hold for this content → close **failed**; the protocol re-scopes to the consuming seam before any re-charter.
- **The discriminants are falsified** — the spot-check shows the moved-path flip or the `expected == actual` gate not behaving as the evidence base records on 0.9.0 → the P1 foundation is unsound; canon must not land on falsified checks; close **failed** with the falsifying evidence recorded.
- **The doctrine cannot be authored version-robustly** — 0.9.1 ships mid-mission and the P4 re-audit shows the discriminants no longer discriminate, gutting rather than trimming the protocol → close **superseded** rather than fold stale doctrine; the ledger and evidence carry to the re-charter.

## Roadmap

| # | Milestone | Gist | Depends on | Status |
| --- | --- | --- | --- | --- |
| 1 | [protocol](milestones/1.protocol/MILESTONE.md) | Two phases (hardened 26-07-27): author (mechanical fix as commit #1 + the protocol doc + BASELINE final form) → rewire (the remaining seven sites — eight total, manager card added at hardening) | — | done (26-07-27) |
| 2 | [hazard-and-evidence](milestones/2.hazard-and-evidence/MILESTONE.md) | ADR standing hazard (shared-store family) + P4 version ledger → interim `git commit --only` documentation → live spot-check + enactment filing | 1 | pending |
