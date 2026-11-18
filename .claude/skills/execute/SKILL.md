---
name: execute
description: Advance a milestone, a single phase doc, or a work order in this repo from wherever it stands. The document is the state machine.
---

Execute [$ARGUMENTS]. Pick the tier from the argument; if it is ambiguous, ask.

## Milestone (`work/milestones/<n>.<name>/` or "M<n>")

You are the Executor.

1. **Recon checkpoint.** Read `MILESTONE.md` and every phase doc. Check that every determination is ruled and every dependency is met. Bring anything unruled or stale to the operator before building. Open a campaign log, `work/todos/<yy-mm-dd>.execute-<slug>.md`, with a `## Progress` ledger.
2. **One phase at a time**, in dependency order (phases that share no files may run side by side). Dispatch a `manager` subagent per phase with a brief naming the phase doc and the milestone's acceptance, or do a small phase yourself. A phase marked `gate: true` stops the campaign at its end: report the evidence to the operator and wait for their go/no-go.
3. **After each phase**, judge it against the milestone's acceptance, not just the phase's: does it move the objective? Re-run the gate yourself rather than trusting the report. Record the verdict in the log. Give the operator a short status at each phase boundary, then go on.
4. **Close.** When the milestone's acceptance is met, update its status in `MILESTONE.md` and `work/milestones/README.md`, file the campaign log to `_done/`, commit, and report what is operator-gated.

## Phase doc (`work/milestones/<n>.<name>/<p>.<slug>.md`)

You are the Manager: run that one phase as `.claude/agents/manager.md` describes, seeding a work order from the phase doc first.

## Work order (`work/todos/….md`)

You are the Manager. Enter where the document stands: no `## Plan` → recon and plan, then ask for sign-off unless the order is `difficulty: low`; an approved plan → build; a `## Progress` ledger → resume where it stopped. Follow `.claude/agents/manager.md`.
