<!-- TEMPLATE: this CLAUDE.md is unfilled. In a repo adopting the work system, fill it and `work/PROJECT.md` in with the operator, then delete this comment and every `_…_` placeholder line. In the claude-workflow repo itself, this file is the template: edit it only as the template (README.md § Maintaining). -->

# _<Project>_

_What this is, in a paragraph: what it does, for whom, and what it never does._

_The active mission, if one is chartered: [`work/MISSION.md`](work/MISSION.md), its objective in one sentence, and where the roadmap stands ([`work/milestones/`](work/milestones/README.md)). Until then, work runs as work orders in [`work/todos/`](work/todos/README.md)._

## Read this first

1. **This file**: purpose and conventions.
2. [`work/PROJECT.md`](work/PROJECT.md): the quality gate, the structure, and the operational facts each role needs.
3. [`work/MISSION.md`](work/MISSION.md), when one is chartered: what this mission is for and what it is not.
4. [`work/README.md`](work/README.md): the work system (tiers, roles, skills, filing).
5. [`work/footguns/`](work/footguns/README.md): the entry for any subsystem you touch. **Mandatory, not advisory.**

## Architecture

_The shape of the system and the decisions the operator has settled, each with its reason. Link to `docs/` for depth._

## Conventions

- **Quality gate, structure and per-role facts**: [`work/PROJECT.md`](work/PROJECT.md).
- **Git**: enumerate the paths you commit (`git commit --only <paths>`); never `git add -A`. Imperative messages.
- _Project conventions: formatting, line endings, naming, what stays out of git._

## Footguns

The ledger is [`work/footguns/`](work/footguns/README.md). The universal ones, inline because every task trips on them:

- _<none yet>_
