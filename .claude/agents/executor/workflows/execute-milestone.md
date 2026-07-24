# Execute Milestone

## Workflow

**Multi-phase objective workflow.** Drives a clearly-specified objective — a milestone directory, or a single well-specified goal — to completion through a preliminary Reconnaissance checkpoint and per-phase Manager subagents running in automatic mode. The Executor owns this campaign document and reasons about ultimate acceptance; Managers own phase acceptance. Mechanism and roles: [executor](../CLAUDE.md).

1.  **Read the objective.** Read the milestone `MILESTONE.md` + every phase doc (or the goal spec). Identify the phases and their dependency order (`depends-on` frontmatter). Confirm the objective is clearly specified enough to pursue; if it is fundamentally underspecified, say so and stop — this workflow accomplishes specified goals, it does not invent them. A milestone that has been through `/plan work/milestones/<n>.<name>` (a flagship Architect session) arrives with `MILESTONE.md` + per-phase docs already filed and hardened — the preferred input. If phase docs are **missing**, flag it: recommend the operator run `/plan` on the milestone first, or (with their agreement) treat filing the phase docs as the first Reconnaissance deliverable, gated by the same sign-off. An **open milestone** (`mode: open`) is refused — there is nothing to converge on.
2.  **File the campaign log** — `work/todos/<date>.execute-<objective-slug>.md`. Record the objective (link the milestone `MILESTONE.md`), the phase list, and the dependency order. Stamp callbacks per `work/README.md` § The callback grammar: open the campaign log's `sessions:` frontmatter with `executor@<hostname>/<your session-id>`, and append the same entry to the milestone `MILESTONE.md`'s `sessions:` list.
3.  **Reconnaissance.** Dispatch one researcher subagent per phase, in parallel (read-only). Brief each to read its phase doc + the codebase areas it touches + the relevant `work/footguns/` ledger files (see the CLAUDE.md index) (+ Context7 per the `work/PROJECT.md` library list; when the codebase-memory MCP is available, answer structure questions from the graph — `get_architecture`, `trace_path` — before file reads), and to return: underspecifications, architectural risks, ordering hazards, cross-phase dependencies, and decisions that should be made before building. This research feeds forward into each phase's planning — it is not throwaway.
4.  **Consolidate.** Write the campaign log's "Reconnaissance" section: deduplicated, prioritized concerns; per-phase readiness; and an explicit **Decisions to confirm** block — including whether **infrastructural setup / deployment** is in scope for this run (the autonomy-scope question; never assume).
5.  **Reconnaissance checkpoint (mandatory pause).** Present the consolidated concerns + Decisions to confirm to the user. Harden the specification together — amend phase docs, answer questions, lock decisions. Await sign-off on the hardened spec **and** the autonomy scope (deploy in / out; hands-off vs. staged). This is the workflow's one mandatory gate.
6.  **Seed per-phase work docs.** For each phase, create `work/todos/<date>.<phase-slug>.md` from the milestone phase doc + that phase's reconnaissance findings + the confirmed decisions. Carry the phase's `## Acceptance` criteria into the work doc verbatim — they are the inner loop's target — carry the phase doc's `difficulty` frontmatter into the work doc's frontmatter (it drives the Manager's planner-model choice; if the phase doc lacks one, rate it from the reconnaissance findings), and copy the milestone index's `sessions:` callback list into each work doc's frontmatter, so child Managers can consult the planning session (the last `architect@…` entry is the consult handle; legacy forms — `planner@…` annotated as architect, or `plan-session:`/`plan-machine:` — translate to an `architect@<machine>/<id>` entry at seeding). (The milestone phase doc stays the spec / record.)
7.  **Outer loop — for each phase, in dependency order:**
    1. **Dispatch the Manager.** Each phase Manager is an Agent-tool subagent — `subagent_type: manager`, the phase work doc as the self-contained brief, the same work-order automatic-mode workflow governing it. Per-call `model: "opus"` is load-bearing: omitted, the dispatch inherits the hosting session's model (up to 2× Opus cost), and the Manager role is coordination, which Opus handles; the specialists' model tiers ride on their own frontmatter pins, independent of the Manager's model. The Manager runs the [work-order automatic-mode workflow](../../manager/workflows/execute-work-order-automatically.md), writing a `## Acceptance Verdict` to the work doc. At launch, append the Manager's callback — `manager@<hostname>/<your own session-id>` (stamps anchor to the hosting Executor session, per the durability amendment) — to the phase work doc's `sessions:` list, and note the returned agent id in the campaign log: it is the SendMessage handle for nudges and continuations. (Headless fallback — only on a stated trigger cause: dispatch per the executor CLAUDE.md's 'Headless fallback — deliberate, non-default' subsection.)
    2. **While it runs — bounded check-ins, ledger not transcript.** The native panel carries live transcripts at both depths, task status, and surfaced permission prompts; the programmatic parent receives only the final result. On each wakeup or task notification, read the work doc's `## Progress` ledger and distill a one-liner into the campaign log — never read a transcript into context. A genuinely wedged Manager surfaces as a stalled ledger: steer it with a SendMessage **nudge** (delivered at its next tool boundary).
    3. **On return, classify before judging** — a Manager's return is not always a verdict; check the work doc:
       - **(a) `## Acceptance Verdict` present** → reason about ultimate acceptance (cross-phase invariants intact, next phase's premise satisfied). **PASS + ultimate acceptance holds** → record in the phase ledger; update the milestone phase doc (status + addendum, per the `work/milestones/README.md` conventions); advance. **PARTIAL / ultimate-acceptance gap** → within the outer pass budget: SendMessage **continuation** to the same Manager for incremental residuals (context intact — the point of the conversion), or a **fresh subagent** Manager for a re-plan (clean premises); record the decision and why. **ESCALATE** (terminal — budget exhaustion, an unblessed order after the refinement bound, or an operator-gated stop) → before surfacing to the user, run the architect consult if the Manager hasn't (its verdict will say): `bun .claude/bin/consult "<handle>" "<the question; what changed since planning; answer from the plan's intent; flag if this needs a human decision>"` (the required consult path — the script owns the restore-before-resume ladder and the read-only fork boundary) — the handle is the last `architect@…` entry in the work doc's `sessions:` frontmatter (legacy forms translate); machine-local (the entry's `<machine>` segment must match this host). An _interpretation_ answer → distill into the work doc, incorporate, continue via SendMessage without waking the user. A genuinely _new decision_ (or no consultable session) → surface to the user **with the consult's analysis attached**, so they react to an articulated position instead of answering cold. Incorporate the answer; continue via SendMessage continuation.
       - **(b) no verdict + a pending question — pause-and-ask.** The Manager ended its turn awaiting an answer, context held. Deliberate; consult the Architect per the same ladder when the Manager's own consult didn't settle it; answer via SendMessage — the Manager resumes in place. A genuinely new decision → surface to the user with the analysis attached, then relay their answer.
       - **(c) no verdict + no question — verdict-absence early stop** (distinct from a re-plan). SendMessage **nudge**: continue to the `## Acceptance Verdict`; mechanical remaining convergence steps may be completed directly under this explicit instruction (the automatic-mode workflow's final-mile exception). The nudge-until-verdict loop **shares the outer pass budget** — no separate counter.
    4. **Operator-gated acceptance** (deploy, empirical measurement) not authorized for autonomous run → stage a concrete operator recipe in the phase ledger + the milestone phase doc, mark the phase "ready, operator-gated acceptance pending," and (per the user's gate choice) pause for the operator or continue to the next in-repo-buildable phase.
8.  **Objective close.** When all phases reach acceptance (in-repo certified + operator-gated handed off), the close-out fires first, before any reply prose (`work/README.md` § The follow-through rule): update the milestone `MILESTONE.md` + roadmap row (status), reconcile the footgun ledger (`work/footguns/` + the CLAUDE.md index), write the campaign **Summary** and the consolidated **Operator Handoff**, move the campaign log to `work/todos/_done/`, and commit.

## Escalation and budgets

- **Outer pass budget** — default 2 follow-up dispatches per phase (nudges, continuations, and re-plans all count against it) before escalating to the user. The inner pass budget (default 3) lives in the Manager's automatic mode.
- **Stall detection** — if a follow-up dispatch returns the same blocking residual, escalate rather than loop.
- **Bugs filed mid-flow** — Managers file out-of-scope bugs to `work/todos/bugs/` (standing behavior). At objective close, list them for the user; do not auto-resolve.
- **Cost** — `/execute <milestone>` is heavyweight (phases × passes × specialist fleets). It is for milestones, not small todos; the budgets above are also the cost governor. Each Manager's cost rides the dispatch result surface.

## Format

**Document format:**

- Campaign log prefixed `<date>.execute-<slug>.md` in `work/todos/` (date format: YY-MM-DD).
- Executor is the sole author; distill Manager outcomes into briefs, consistent voice, `<h2>` sections separated by `---`, each stamped per `work/README.md` § The callback grammar.

**Document structure:**

```markdown
# Execute: <Objective>

## Objective

(link to the milestone MILESTONE.md; the phase list + dependency order; the confirmed autonomy scope)

---

## Reconnaissance

(consolidated per-phase concerns + the confirmed Decisions block)

---

## Phase Ledger

(one entry per phase: status, passes, Acceptance Verdict, ultimate-acceptance note, commits, residuals, operator-gated items)

---

## Summary

(objective close-out — what landed, what's deferred, cross-phase decisions)

---

## Operator Handoff

(the staged deploy / measurement recipes that remain human steps for operator-gated acceptance)
```
