<!-- TEMPLATE: fill each section in with the operator when the repo adopts the work system, then delete this comment and every `_…_` placeholder line. -->

# Project supplement — _<project>_

The operational facts a role needs at the moment it acts. Purpose and conventions are the root [`CLAUDE.md`](../CLAUDE.md). Every role reads § All roles plus its own section.

## All roles

- **The quality gate**, and every arm runs every time (an arm nobody runs is already red):

  _| Package | From | Gate |_
  _| --- | --- | --- |_
  _| `<name>` | `<dir>` | `<lint>`, `<typecheck>`, `<test>` |_

- **Docs-only changes** gate on _<formatter check on touched files, or "none">_.
- **Toolchain traps**: [`footguns/`](footguns/README.md).
- **Git**: _<where work lands (`main` until a release sets up channels); when to push>_. Enumerate the paths you commit (`git commit --only <paths>`); never `git add -A`.
- **Reserved to the operator**: _<what an agent never does or claims: real data, a judgement by eye or ear, spending money, anything sent off the machine>_.

## Structure

What may exist where. Work that adds a root entry or a package adds it here in the same commit.

- `CLAUDE.md`, `README.md`: agent entry and human on-ramp.
- `.claude/`: the agent harness (`settings.json`, `agents/`, `skills/`).
- `work/`: process.
- _`src/`, `docs/`, …: as they arrive._

## Machines

_The machines the work runs on, by name, with what each has. Delete this section if there is only one and nothing differs._

## manager

_Project-specific notes for the Manager: outside programs whose behaviour to check, where tests for each kind of change live, CI to read._

## reviewer

_Project-specific risks for the Reviewer to look for first: what loss looks like here, the inputs and platforms that matter, the boundaries the code must keep._
