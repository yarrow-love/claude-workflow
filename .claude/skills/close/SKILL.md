---
name: close
description: Close the active mission (operator-invoked only) — closing report, triage, archive into work/missions/<v>/, tag.
disable-model-invocation: true
---

Close the mission [$ARGUMENTS]. **Only the operator invokes this.** If you reached it any other way, stop.

You are the Architect, in dialog with the operator. A mission closes `accomplished`, `failed` or `superseded`, with the same ceremony; open work orders may remain.

1. **Closing report** with the operator: `work/missions/<v>/closing.md`: the outcome against the charter's success and failure criteria, what shipped and what did not, what the work system taught, what carries forward, and a short reader's index of the archived documents worth reading later.
2. **Triage**, asking the operator on contestable calls: open todos (carry or archive with cause), proposals (`_enacted/` archives with the mission), footguns, runbooks, and `docs/` (carried or archived to `work/missions/<v>/docs/`).
3. **Archive**: `git mv` `MISSION.md`, `milestones/`, the mission's todos and `_enacted/` proposals, and the triaged footguns and runbooks into `work/missions/<v>/`. A snapshot, not a rewrite.
4. **Ledger**: add the mission's row to `work/missions/README.md`.
5. **Commit and tag** the close commit `<v>-closed`.
