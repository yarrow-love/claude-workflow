# Canon references — how a written path gets verified, and how it doesn't

Read before writing a cross-document pointer into any canon file (`.claude/`, root keystones, `work/` canon).

The **durable statement** is `.claude/agents/janitor.md` § The reference-integrity method, whose coverage map names the bare-prose blind class and the unprefixed-link skip as product doctrine that ships to every consuming repo. This ledger is the fuller local account — the discovery narrative, the archive-time demonstration, and the checks — and it archives with the mission; the coverage map does not. Adjudicated at mission v3.memory-protocol M2 phase 1: promotion to `.claude/ADR.md` § Standing hazards was declined because a standing hazard is a read-before-touching-this-subsystem gate, and this trap's subsystem is *writing any pointer anywhere* — a gate that fires on everything fires on nothing.

## A pointer written bare in prose is invisible to the reference gate

**Discovered 26-07-27**, rewiring nine graph-prescribing sites to `.claude/protocols/codebase-graph.md` (mission v3.memory-protocol, M1 phase 2).

`.claude/bin/reference-gate` extracts candidate paths from exactly two places: **backticked code spans** and **markdown link targets**. A path written as bare prose — `see .claude/protocols/codebase-graph.md for the recipe` — is extracted from neither, so the gate never resolves it. It is not reported as unresolvable; it is not seen at all.

The trap is that the obvious verification agrees with you. A per-file `grep -c 'protocols/codebase-graph.md'` returns 1, the acceptance criterion reads satisfied, and the gate runs green — while the pointer has never been checked against the tree and will not be checked when the target later moves or is renamed. Two independent signals both say "fine" for the same reason: neither is looking.

The second half of the same trap: **markdown link targets carrying no declared scope-root prefix are skipped rather than resolved** (`.claude/bin/reference-gate`, the `gradeLink` comment — the canon mixes file-relative and repo-root link styles and no single resolver satisfies both, so an unprefixed target is skipped rather than guessed at). A relative link with the wrong depth therefore passes the gate silently. Depth varies by file: `.claude/agents/researcher/CLAUDE.md` sits two levels deeper than `.claude/agents/investigator.md`, so the same correct-looking `../` prefix is right in one card and wrong in the other.

**The rule**: write a cross-document pointer as a **backticked repo-root path**, optionally with a `§ Section` suffix — `` `.claude/protocols/codebase-graph.md` § Verifying freshness ``. That form is extracted and resolved, so the gate becomes a real mechanical test of the pointer rather than a green light that means nothing. It also sidesteps the open canon-link-styles fork entirely, so a pointer written this way settles no style question it has no business settling.

**The check**: after adding pointers, confirm the gate's reference *count* moved, not just that it still passes. A pointer the gate cannot see costs zero references. `bun .claude/bin/reference-gate check` reports `<n> references checked` — if that number is unchanged after adding pointers, the pointers are invisible.

**Corollary for acceptance criteria**: "file X references Y" is not verifiable by `grep` alone. A grep proves the string is present; only the gate's extraction proves the reference is *checked*. An acceptance criterion that means the latter must say so.

## The same blind spot bites at archive time

**Demonstrated 26-07-27**, during the close-out that wrote this entry.

Filing three campaign documents from `work/todos/` into `work/todos/_done/` moved them one directory deeper, invalidating **sixteen** relative links inside them — every `](../MISSION.md)`, `](../milestones/…)`, `](../proposals/…)` written for the shallower location. `bun .claude/bin/reference-gate check` reported **0 failures before and after the move**, and the reference count went *up*. The gate was never wrong; those targets carry no declared scope-root prefix, so it skipped every one of them, exactly as designed.

`work/todos/` is also a declared planning-artifact root, where unresolved references warn rather than fail — so even the extractable half would not have blocked. Two independent safety properties, and neither was watching.

**The rule**: relocating a document is a **reference-editing** operation, not a `git mv`. Re-resolve every relative link inside a moved file against its new location before committing the move.

**The check**: the gate cannot do this for you. Extract each `](…)` target from the moved file and test it against the new directory. Two traps in that check itself, both hit live: a markdown link written *inside a code span* is a quoted example, not a live reference, and must be left alone — a blind rewrite corrupts the very illustration it looks like; and links written *from* other files *into* the moved one need the same treatment in the opposite direction (the milestone docs pointing at these three all needed repointing too, and those were backticked, so the gate would have caught only that half).
