# Plan Milestone

High-level roadmap planning for one milestone directory (`work/milestones/<n>.<name>/`): harden the milestone `MILESTONE.md` and file the per-phase docs, leaving the milestone **`/execute`-ready**. You are the [architect](../CLAUDE.md), acting as **milestone architect** — the strategic tier above [plan-work-order](../../manager/workflows/plan-work-order.md) (which plans one work order); it produces **specs, not work orders** — the Executor seeds `work/todos/` work docs from these phase docs at campaign time.

## Who plans

**The main session IS the Architect** — do not dispatch a planner subagent for this tier (rationale: [architect/CLAUDE.md](../CLAUDE.md) § Session shape). Dispatch researcher subagents for all grounding; reserve the main context for synthesis, dialog, and authoring.

## Workflow

1. **Read the roadmap + the milestone.** `work/milestones/README.md` (roadmap, conventions) and the milestone's `MILESTONE.md` if it exists (usually a gist-level stub filed at mission settlement). If the argument names a milestone with no directory yet, propose the roadmap-row addition to the user first.
2. **Read the binding references yourself.** Every doc the index cites — typically the mission's determinations (binding: where a milestone doc and a determination disagree, the determination wins until explicitly revised) and the charter. These are the strategic substance; do not delegate reading them.
3. **Ground with researchers (parallel, read-only).** Dispatch researcher subagents to report: the current state of the code the milestone touches (what exists vs what the index assumes), the relevant `work/footguns/` ledger files, the seams to sibling milestones (shared contracts, operator gates), and any external-library facts (Context7). Brief them tightly — you want facts, not proposals.
4. **Interview the user.** Present the genuine forks — scope boundaries, phase-ordering trade-offs, operator-gated vs autonomous acceptance, what defers — with your recommendation marked. This dialog is the point of running the session interactively; do not skip it or bury the forks in prose.
5. **Author the milestone.** Write/harden `MILESTONE.md` and file one `<p>.<phase>.md` per phase (shape: `work/milestones/README.md` § Conventions). Phase-decomposition discipline:
   - Each phase must be independently buildable and **certifiable** — its `## Acceptance` block is the literal target of a headless Manager session's convergence loop. Write criteria a headless session can verify, plus explicitly-marked operator-gated items.
   - Order phases by dependency; name cross-phase premises explicitly (what phase N+1 assumes phase N leaves true — this is what the Executor's ultimate-acceptance reasoning checks).
   - Scope each phase to one Manager session (≈ one `/execute` run); split anything larger.
   - **Rate each phase's planning difficulty** in its frontmatter (`difficulty: low | medium | high`) — a prescription the downstream pipeline consumes for the Planner's model tier. Rate the _planning_ difficulty (design forks, cross-cutting invariants, novelty), not the implementation effort — a large-but-mechanical phase is `low`.
   - Mark **operator gates** (deploys, physical measurements, anything outside the repo) so the Executor stages recipes instead of stalling.
6. **Reconcile the roadmap.** Update the milestone's row in `work/milestones/README.md` (gist / depends-on / status) if planning changed it.
7. **Sign-off + commit.** Present the phase table + the settled decisions; await explicit approval; commit the milestone directory (enumerated paths). **Record the planning session for later consultation:** append your callback `architect@<machine>/<this session's id> # milestone architect` to the `sessions:` list in the frontmatter of `MILESTONE.md` **and every phase doc** (create lists if absent; **append, never replace** — the mission architect's callback leads the list, copied from the charter if the stub didn't open the list); archive your transcript (`.claude/bin/session-archive` / `/archive`). Managers consult this session by resume-fork per the planner-callback policy in [manager/CLAUDE.md](../../manager/CLAUDE.md) — the **last `architect@…` entry** is the consultation handle. Do **not** file `work/todos/` work orders and do **not** start building — `/execute <milestone>` owns that.
