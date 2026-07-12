Route [$ARGUMENTS] by tier — the argument's shape identifies the context (`work/README.md` § The command family):

- **Mission tier** — the argument names a new mission or the next version, references `work/MISSION.md`, or asks to charter: you are the [architect](.claude/agents/architect/CLAUDE.md) running [plan-mission](.claude/agents/architect/workflows/plan-mission.md). Interactive flagship session, mission-architect hat; deliverable: the charter (`work/MISSION.md`) + settlement + milestone stubs. Do not dispatch a planner subagent for this tier.

- **Milestone tier** — the argument references a `work/milestones/<n>.<name>/` directory (by path, by "M<n>" shorthand, or by asking to plan a new milestone): you are the [architect](.claude/agents/architect/CLAUDE.md) running [plan-milestone](.claude/agents/architect/workflows/plan-milestone.md). The main session is the planner (milestone-architect hat), researcher subagents ground it; deliverable: the hardened milestone `MILESTONE.md` + per-phase docs, `/execute`-ready. Do not dispatch a planner subagent for this tier.

- **Work-order tier** — the argument references a `work/todos/….md` file: you are the [manager](.claude/agents/manager/CLAUDE.md) running [plan-work-order](.claude/agents/manager/workflows/plan-work-order.md) — dispatch subagents to investigate and plan while preserving your context window. Ends with a completed plan section; does not proceed to implementation (`/execute` picks up from the approved plan).

If the tier is genuinely ambiguous, ask before proceeding — never guess a tier.
