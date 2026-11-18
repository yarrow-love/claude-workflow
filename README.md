# claude-workflow

A lean, project-generic work system for Claude Code: a consistent `work/` directory for planning, doing and archiving work, and a small `.claude/` baseline that lets the main session act as **Architect** (`/plan`), **Executor** (`/execute` a milestone, one `manager` subagent per phase) or **Manager** (`/execute` a single work order), with a fresh `reviewer` checking every change.

## What's in it

```
CLAUDE.md                     agent entry: a skeleton to fill in
.claude/
  settings.json               read-only git permissions; nothing else
  agents/manager.md           owns one phase or work order end to end
  agents/reviewer.md          fresh, independent review against acceptance
  skills/plan/                /plan mission | M<n> | work order
  skills/execute/             /execute M<n> | phase doc | work order
  skills/close/               /close <mission> (operator-only)
work/
  README.md                   the system: layout, tiers, roles, filing
  PROJECT.md                  per-project operational facts: a skeleton to fill in
  todos/ milestones/ proposals/ notes/ footguns/ runbooks/ missions/
```

Everything else is left to the harness: built-in `Explore`, `Plan` and `general-purpose` agents, and plain requests.

## Adopt it in a repo

```sh
git -C ~/dev/claude-workflow archive main CLAUDE.md .claude work | tar -x -C <repo>
```

Then start a session in the repo and ask Claude to fill in `CLAUDE.md` and `work/PROJECT.md` with you (the gate, the structure, the machines, what is reserved to you). Add your gate's commands to `.claude/settings.json` if you want them pre-approved. File the first work order, or write notes and proposals toward a first mission.

An existing `CLAUDE.md` is overwritten by that command; fold its content into the skeleton, or extract only `.claude work`.

## Maintaining

`main` is the template and nothing else. Every file must work verbatim in a repo that isn't this one: project facts belong in the consuming repo's `work/PROJECT.md`. Change it on `main` by ordinary commits, when a change has proven itself in a real repo. Keep it small: add a skill, agent or hook only when real work shows the need, and say why in the commit.

## History

The July-era system (v1–v3: eleven agents, eleven commands, hooks, `bin/` tooling, a baseline manifest) is archived at tag `july`; its process branch at `july-dev`, and the unclosed v4 mission at `july-v4`. This version is distilled from the work system as run in practice in later repos.
