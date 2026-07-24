# Footgun — `.claude/bin/consult` (session forks)

Read before invoking `consult`, and before treating any consult as harmless.

## A consult fork is a full autonomous agent, not a read-only advisor — it can mutate the working tree

`consult` runs `claude -p --resume <id> --fork-session` in the invoking shell's cwd. The fork inherits full tool access and *acts*: it can `git commit`, `checkout`, `cherry-pick`, and edit files in whatever repo it is `cd`'d into. The Planner/Architect callback policy *calls* consults "advisory, read-only" — **nothing enforces that.** A consult that decides to "just commit to unblock" will do so, in your live tree.

**Surfaced**: 26-07-23 — a consult fork committed a work-order snapshot (`8ca7bdb`) to end a hook loop; a *separate* orchestra-project consult forking the **same** shared handle (`76ba13c6@play`) committed a genericity fix to this repo's feature branch **and cherry-picked it to `main`**, all unreviewed. Full incident: `work/todos/bugs/26-07-23.bug.consult-fork-mutates-shared-tree.md`.

**Avoid / mitigate until the defect is fixed**:
- Treat a consult as capable of side effects. Do not run one while you hold uncommitted work you can't afford to have committed/clobbered.
- A shared session handle (e.g. an architect used by more than one project) can be forked **concurrently from another project's session**, `cd`'d into your repo. If the tree mutates between your turns, suspect a foreign consult — check `ps aux | grep consult` and `git reflog`.
- Prefer a **fresh Agent-tool subagent** over a `consult` fork when you only need advice and independence — subagents report text back and don't fork a session into your working tree.
