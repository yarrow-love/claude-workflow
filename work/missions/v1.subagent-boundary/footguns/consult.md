# Footgun — `.claude/bin/consult` (session forks)

Read before invoking `consult` and before adding/removing entries from its DENY list.

## The read-only boundary is name-deny-only for the deferred/built-in tool class — reconcile it on every harness upgrade

`consult` forks a session (`claude -p --resume … --fork-session`) and constrains it to read-only via a five-layer boundary (`26-07-23`, resolving `work/todos/_done/26-07-23.bug.consult-fork-mutates-shared-tree.md`): inline `permissions.deny` (load-bearing — only `deny` defeats a project `allow`), `--disallowedTools`, `--permission-mode dontAsk` + `--allowedTools "Read,Grep,Glob"`, MCP severance, and `disableAllHooks`.

**The standing hazard**: the `--allowedTools` whitelist does **NOT** default-deny the harness's *deferred/built-in* tool class (`EnterWorktree`, `Task*`, `SendMessage`, `Agent`, `Artifact`, …) — verified `26-07-23` against `claude 2.1.197`. A denied name is stripped from the fork's tool registry (stronger than a runtime block), but enforcement of that class rests **entirely on the `DENY` name list being a complete superset of every tool that can mutate/escape/message/schedule/publish.** So: **a future harness tool in a mutating class silently escapes the boundary until its name is added to `DENY`.**

**On harness upgrade** (or if a consult fork ever appears able to act): re-enumerate the deferred/built-in tool registry and reconcile `.claude/bin/consult`'s `DENY`. The pinned version in the script's comment is the last audited baseline. Durable fix beyond name-lists (machine-level caller isolation) is deferred — the intercom's territory (`work/todos/26-07-22.lan-intercom.md`).

## Consults are repo-bound — a foreign-repo handle is refused (exit 4)

`consult` compares the target transcript's recorded `cwd` to the invoking repo and **refuses (exit 4)** on mismatch — a session handle can only be forked from the repo that owns it. This closes the transcript-provenance hole (a foreign archive forked into a local tree). The *foreign-invoker* case (a process `cd`-ing into this repo before consulting) is capped at read-and-answer by the read-only boundary, not by this guard. No `--force-foreign` override exists (by design). If you need a cross-repo handle's knowledge: consult from the owning repo, or degrade to documents + a fresh dispatch.
