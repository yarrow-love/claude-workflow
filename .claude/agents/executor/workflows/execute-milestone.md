# Execute Milestone

## Workflow

**Multi-phase objective workflow.** Drives a clearly-specified objective — a milestone directory, or a single well-specified goal — to completion through a preliminary Reconnaissance checkpoint and per-phase Manager sessions running in automatic mode. The Executor owns this campaign document and reasons about ultimate acceptance; Managers own phase acceptance. Mechanism and roles: [executor](../CLAUDE.md).

1.  **Read the objective.** Read the milestone `MILESTONE.md` + every phase doc (or the goal spec). Identify the phases and their dependency order (`depends-on` frontmatter). Confirm the objective is clearly specified enough to pursue; if it is fundamentally underspecified, say so and stop — this workflow accomplishes specified goals, it does not invent them. A milestone that has been through `/plan work/milestones/<n>.<name>` (a flagship Architect session) arrives with `MILESTONE.md` + per-phase docs already filed and hardened — the preferred input. If phase docs are **missing**, flag it: recommend the operator run `/plan` on the milestone first, or (with their agreement) treat filing the phase docs as the first Reconnaissance deliverable, gated by the same sign-off. An **open milestone** (`mode: open`) is refused — there is nothing to converge on.
2.  **File the campaign log** — `work/todos/<date>.execute-<objective-slug>.md`. Record the objective (link the milestone `MILESTONE.md`), the phase list, and the dependency order. Stamp callbacks per `work/README.md` § The callback grammar: open the campaign log's `sessions:` frontmatter with `executor@<hostname>/<your session-id>`, and append the same entry to the milestone `MILESTONE.md`'s `sessions:` list.
3.  **Reconnaissance.** Dispatch one researcher subagent per phase, in parallel (read-only). Brief each to read its phase doc + the codebase areas it touches + the relevant `work/footguns/` ledger files (see the CLAUDE.md index) (+ Context7 per the `work/PROJECT.md` library list; when the codebase-memory MCP is available, answer structure questions from the graph — `get_architecture`, `trace_path` — before file reads), and to return: underspecifications, architectural risks, ordering hazards, cross-phase dependencies, and decisions that should be made before building. This research feeds forward into each phase's planning — it is not throwaway.
4.  **Consolidate.** Write the campaign log's "Reconnaissance" section: deduplicated, prioritized concerns; per-phase readiness; and an explicit **Decisions to confirm** block — including whether **infrastructural setup / deployment** is in scope for this run (the autonomy-scope question; never assume).
5.  **Reconnaissance checkpoint (mandatory pause).** Present the consolidated concerns + Decisions to confirm to the user. Harden the specification together — amend phase docs, answer questions, lock decisions. Await sign-off on the hardened spec **and** the autonomy scope (deploy in / out; hands-off vs. staged). This is the workflow's one mandatory gate.
6.  **Seed per-phase work docs.** For each phase, create `work/todos/<date>.<phase-slug>.md` from the milestone phase doc + that phase's reconnaissance findings + the confirmed decisions. Carry the phase's `## Acceptance` criteria into the work doc verbatim — they are the inner loop's target — carry the phase doc's `difficulty` frontmatter into the work doc's frontmatter (it drives the Manager's planner-model choice; if the phase doc lacks one, rate it from the reconnaissance findings), and copy the milestone index's `sessions:` callback list into each work doc's frontmatter, so child Managers can consult the planning session (the last `architect@…` entry is the consult handle; legacy forms — `planner@…` annotated as architect, or `plan-session:`/`plan-machine:` — translate to an `architect@<machine>/<id>` entry at seeding). (The milestone phase doc stays the spec / record.)
7.  **Outer loop — for each phase, in dependency order:**
    1. **Dispatch the Manager session** as a background task: `claude -p "/execute <phase-work-doc> automatically" --model opus --permission-mode acceptEdits --output-format stream-json --verbose > tmp/accomplish/<phase-slug>.jsonl 2>&1` (`--model opus` is load-bearing — omitting it runs the child on the user's saved default, possibly Fable at 2× the cost; the specialists' tiers ride on their own frontmatter pins. `bypassPermissions` only if the user authorized hands-off infra at the gate). The Manager runs the [work-order automatic-mode workflow](../../manager/workflows/execute-work-order-automatically.md): the inner convergence loop against the phase's acceptance criteria, writing a `## Acceptance Verdict` to the work doc. Record the child's callback — `manager@<hostname>/<session_id>` — into the campaign log **at launch** and append it to the phase work doc's `sessions:` list, from the stream's first event — `{"type":"system","subtype":"init",…}` carries the `session_id` top-level — so a child that crashes mid-run can still be `--resume`d.
    2. **While it runs — bounded check-ins.** Do not treat the wait as opaque. On each wakeup, tail the jsonl (`tail -c 20000 tmp/accomplish/<phase-slug>.jsonl | jq -R 'fromjson? | select(.type=="assistant") | .message.content[]? | .text // empty'`) and read the work doc's `## Progress` section, distill a one-liner into the campaign log, and apply the mtime-stall rule. Never read the full transcript into context — the jsonl grows to tens of MB.
    3. **On return, reason about ultimate acceptance.** Read the verdict + summary. Does the phase advance the objective — cross-phase invariants intact, next phase's premise satisfied?
       - **PASS + ultimate acceptance holds** → record in the phase ledger; update the milestone phase doc (status + addendum, per the `work/milestones/README.md` conventions); advance.
       - **PARTIAL / ultimate-acceptance gap** → re-dispatch within the outer pass budget: `--resume <session_id>` (recorded in the campaign log at launch) for incremental residuals — deliberately without `--fork-session`; a re-dispatch *continues* the child's transcript — or a fresh Manager for a re-plan. Record the decision and why.
       - **ESCALATE** (Manager hit novelty or budget) → before surfacing to the user, run the **architect consult** if the child hasn't already (its verdict will say): `claude -p --resume <architect-session-id> --fork-session --model fable "<the question; what changed since planning; answer from the plan's intent; flag if this needs a human decision>"` (`--fork-session` mandatory — consults fork, never continue) — the handle is the last `architect@…` entry in the work doc's `sessions:` frontmatter (legacy forms translate); machine-local (the entry's `<machine>` segment must match this host); prefer `.claude/bin/consult` once available — it owns the restore-before-resume ladder. An _interpretation_ answer → distill into the work doc, incorporate, re-dispatch without waking the user. A genuinely _new decision_ (or no consultable session) → surface to the user **with the consult's analysis attached**, so they react to an articulated position instead of answering cold. Incorporate the answer; re-dispatch.
    4. **Operator-gated acceptance** (deploy, empirical measurement) not authorized for autonomous run → stage a concrete operator recipe in the phase ledger + the milestone phase doc, mark the phase "ready, operator-gated acceptance pending," and (per the user's gate choice) pause for the operator or continue to the next in-repo-buildable phase.
8.  **Objective close.** When all phases reach acceptance (in-repo certified + operator-gated handed off), the close-out fires first, before any reply prose (`work/README.md` § The follow-through rule): update the milestone `MILESTONE.md` + roadmap row (status), reconcile the footgun ledger (`work/footguns/` + the CLAUDE.md index), write the campaign **Summary** and the consolidated **Operator Handoff**, move the campaign log to `work/todos/_done/`, and commit.

## Escalation and budgets

- **Outer pass budget** — default 2 re-dispatches per phase before escalating to the user. The inner pass budget (default 3) lives in the Manager's automatic mode.
- **Stall detection** — if a re-dispatch returns the same blocking residual, escalate rather than loop.
- **Mtime-stall (hung child)** — if the phase `.jsonl` mtime has not advanced for ~20 min, the Manager is hung: kill the background task, log it, and re-dispatch (`--resume <session_id>` recorded at launch, or a fresh session). Distinct from Stall detection above, which fires on a same-residual re-dispatch, not a frozen process.
- **Bugs filed mid-flow** — Managers file out-of-scope bugs to `work/todos/bugs/` (standing behavior). At objective close, list them for the user; do not auto-resolve.
- **Cost** — `/execute <milestone>` is heavyweight (phases × passes × specialist fleets). It is for milestones, not small todos; the budgets above are also the cost governor. Each Manager session's cost rides in the terminal `result` event — the last line of its `.jsonl` log.

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
