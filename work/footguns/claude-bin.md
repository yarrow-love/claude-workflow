# `.claude/bin/` — script authoring traps

Read before writing or editing any script under `.claude/bin/`.

## A raw control byte makes a script invisible to the genericity gate

**Discovered 26-07-25**, building `.claude/bin/reference-gate` (mission v2.repo-hygiene, M1 phase 4b).

A single raw NUL byte anywhere in a script — typed directly into a string literal rather than written as the source escape — makes `file` classify it as binary data. `grep` and `git grep` then **skip the file silently**, reporting no matches rather than an error.

This repo's central acceptance test is a grep over `.claude/` for project-shaped facts (root `CLAUDE.md`: "genericity is the acceptance test"). A script containing a raw control byte is therefore *exempt from the test that governs it*, and passes by being unreadable rather than by being clean. The build that surfaced this had two such bytes in dedup keys; the first genericity probe returned zero hits for every pattern, which read as a pass and was in fact a blind spot. It was caught only by a control grep for a string known to be in the file.

**The rule**: write control characters as source escapes (`\x00`, `\t`, `\n`), never as literal bytes. **The check**: `file .claude/bin/<script>` must report text, not binary — and a `grep` for a string you can see in the file must find it. Both belong in any review of a `bin/` change.

## A literal `*/` in the JSDoc header will not parse

Restated here because it lands on exactly the files this ledger covers; the durable statement is `.claude/ADR.md` § Standing hazards. A literal `*/` anywhere in the header comment closes it early and bun then refuses to parse the file. Globs written in header prose are the usual cause. Describe patterns in prose, keep literal globs in code, and run `bun run <script>` after **every** header edit — not at the end of the session.
