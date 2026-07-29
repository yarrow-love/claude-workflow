# 2.instrumented-consult fixtures

Mission apparatus for milestone 2.instrumented-consult phase 2 ([`../2.boundary.md`](../2.boundary.md), work order [`../../../todos/26-07-29.boundary.md`](../../../todos/26-07-29.boundary.md)) — the committed proof that `.claude/bin/consult`'s read-only boundary guard does what the phase claims. Under the milestone directory by the apparatus-subdirectory convention ([`../../README.md`](../../README.md) § Conventions): it archives with the mission and never becomes `.claude/` product. Bun script, no `package.json` (`.claude/bin/` is this repo's sole sanctioned package root).

## Files

- `clean.jsonl` · `refused.jsonl` · `violation.jsonl` · `violation-truncated.jsonl` · `unverifiable.jsonl` — newline-delimited event wires, so they exercise phase 1's real parser rather than a second one.
- `guard-check.ts` — the runner. Drives the **shipped** `.claude/bin/consult` as a subprocess with a stub `claude` on `PATH` inside a hermetic sandbox, and asserts on its exit code, stdout and stderr.

## Usage

```
bun work/milestones/2.instrumented-consult/fixtures/guard-check.ts [--keep]
```

One `PASS`/`FAIL` line per assertion; `--keep` leaves each sandbox on disk and prints its path, for debugging a `FAIL`. Exit codes: `0` every assertion held · `1` usage / unknown flag · `3` a prerequisite is missing (`consult` or a fixture absent — nothing was proved either way) · `5` an assertion did not hold. Code 5 means *read the verdict*, not *the runner broke* — the spike harness's sense.

The cases, and what each is for:

| case | stub exit | expected `consult` exit | proves |
| --- | --- | --- | --- |
| `clean` | 0 | 0 | no warning, zero exit, and — via a successful **allowlisted** `Read` — that the guard is not merely keyed on the error field (acceptance 4, decision D5) |
| `refused` | 0 | 0 | a refused attempt is the boundary *working* and does not trip the guard (acceptance 5) |
| `violation` | 0 | **5** | warning on stderr, non-zero exit, **and the answer still on stdout** (acceptance 4, operator ruling 3) |
| `violation-truncated` | 143 | **3** | the warning is emitted even on a degrade path, and degrade's own code stands (acceptance 13, 15) |
| `unverifiable` | 0 | 0 | `BOUNDARY UNVERIFIED` is a third stderr state and **not** a third exit state (blessing directive 4, decision D4) |

Two assertions cut across the cases: the violation warning must land on an **earlier stderr line than** the usage render, and a successful run must emit **exactly one** usage line (blessing directive 1 — phase 1 fixed its cost defect by *hoisting* the render, and phase 4 routes every exit through a finalizer; if the hoist is duplicated rather than subsumed, usage double-emits and this assertion is what catches it).

## Provenance

Seed material: milestone 1.spike phase 1's raw stdout tees, written to `tmp/spike/` (gitignored scratch, declared in [`../../../PROJECT.md`](../../../PROJECT.md) § Structure). Two of the three files were used:

- **`2026-07-29T03-36-03Z.observe.c1-sdk-content-array.stream.jsonl`** — the `--observe` wire-shape probe, run stamp `2026-07-29T03-36-03Z`. Its whole content is one clean turn.
- **`2026-07-29T03-48-33Z.run.stream.jsonl`** — the channel run, run stamp `2026-07-29T03-48-33Z`. Carries both genuine boundary refusals (`Write` at lines 13–14, `Bash` at lines 25–26).
- `2026-07-29T03-55-18Z.postmortem.stream.jsonl` — unused; it carries no tool use.

Copied and trimmed into tracked content here. The seed is gitignored scratch and will not survive; nothing in this directory references `tmp/` at runtime.

### Line-by-line ledger

**`clean.jsonl`** — 6 lines.

| line | provenance |
| --- | --- |
| 1 | **verbatim** — observe L1: `system`/`init` (this is where the `claude_code_version":"2.1.220"` audit fact is visible) |
| 2–3 | **synthesised** — a successful `Read` `tool_use` / `tool_result` pair, ids prefixed `toolu_01FIXTURE…` / `msg_01FIXTURE…` so a reader can tell at a glance. The `tool_result` carries **no `is_error` key**, which is how a real successful result looks |
| 4 | **verbatim** — observe L2: the `assistant` text block, `TURN-1-OK` |
| 5 | **verbatim** — observe L3: the `rate_limit_event` the M1 wire map never enumerated, kept deliberately so the fixture exercises the parser's non-exhaustive-`type` posture |
| 6 | **verbatim** — observe L4: the terminal `result`, `subtype:"success"`, `result:"TURN-1-OK"` |

Why lines 2–3 exist at all (decision **D5**): the seed's real clean turn has no tool use whatsoever, and a fixture with no tool use would pass a guard that wrongly flagged *every* error-free `tool_result`. The synthesised `Read` pair is what makes `clean` discriminating rather than vacuous.

**`refused.jsonl`** — 9 lines, **verbatim and contiguous**: run L12–L20, the `Write` probe turn end to end. Nothing is synthesised, edited or reordered. It includes:

- L2 (= run L13) — the `Write` `tool_use`, real id `toolu_019jhv4rD6Z4tLfUeHeaNtkm`.
- L3 (= run L14) — the matching `user` event whose `tool_result` block carries `"is_error":true` and the verbatim `<tool_use_error>Error: No such tool available: Write. Write exists but is not enabled in this context. Use one of the available tools instead.</tool_use_error>` text.
- L4–L6 (= run L15–L17) — real `system`/`thinking_tokens` events, another type the wire map never enumerated.
- L9 (= run L20) — the real terminal `result`. Note its `"permission_denials":[]`: **this is M1's trap, preserved verbatim.** The session genuinely refused a tool and the rollup field still reports a clean sheet. That is the whole reason this phase reads `tool_result`/`is_error` instead.

**`violation.jsonl`** — 5 lines.

| line | provenance |
| --- | --- |
| 1 | **verbatim** — run L12: `system`/`init` |
| 2 | **verbatim** — run L13: the `Write` `tool_use`, real id `toolu_019jhv4rD6Z4tLfUeHeaNtkm` |
| 3 | **synthesised** — the same `tool_use_id`, but a plausible *success* payload (`File created successfully at: …`) and **no `is_error` key at all**. Deliberately the *absent* arm of the conjunction, not the *false* arm |
| 4 | **synthesised** — an `assistant` text block reporting the write |
| 5 | **synthesised** — a terminal `result`, `subtype:"success"`, non-empty `result` text, and `"permission_denials":[]` — the trap reproduced on a turn that actually breached the boundary |

**`violation-truncated.jsonl`** — 3 whole lines plus a fragment, **no trailing newline**.

| line | provenance |
| --- | --- |
| 1–3 | identical to `violation.jsonl` L1–L3 |
| 4 | the first 180 bytes of `violation.jsonl` L4, cut mid-object. Unparseable by construction, so the stream also carries exactly one bad line — and there is **no terminal `result` event at all** |

**`unverifiable.jsonl`** — 5 lines.

| line | provenance |
| --- | --- |
| 1 | **verbatim** — run L12: `system`/`init` |
| 2 | the first 210 bytes of run L13, cut mid-object — the originating `tool_use` line, deliberately unparseable |
| 3 | **synthesised** — identical to `violation.jsonl` L3: a success payload against `toolu_019jhv4rD6Z4tLfUeHeaNtkm`, no `is_error` key |
| 4–5 | **synthesised** — an `assistant` text block and a terminal `result` carrying a non-empty answer |

Because line 2 never parses, the `tool_use_id` on line 3 joins to no name. The result is neither clean nor demonstrably breached: the guard says `BOUNDARY UNVERIFIED` and — this is the assertion — leaves the exit code exactly where it was.

### Why the violation cases had to be synthesised

**No successful out-of-allowlist call has ever been recorded in this repo, because the boundary held in both real probes.** M1 attempted `Write` and `Bash` from inside the read-only fork; both were refused with the generic "exists but is not enabled in this context" text, and both refusals are on disk as seed. There is therefore no authentic wire showing the shape this phase exists to detect, and the alternative to synthesis would be staging an actual boundary breach.

Every line that could be real is real: both violation fixtures reuse the genuine `system`/`init` and the genuine `Write` `tool_use` — including its real `tool_use_id`, which is what the join under test resolves. Only the *outcome* is invented.

<!-- SUBSTITUTION POINT (blessing directive 2) — if any probe ever records a tool that is
     callable AND succeeding under this construction, replace `violation.jsonl` lines 2–5
     with the captured wire, re-derive `violation-truncated.jsonl` from it, change `Write`
     to that tool's name in guard-check.ts's two `warn.includes("Write")` assertions, and
     replace this comment plus the paragraph below with the seed file name and run stamp.
     Nothing else in this directory changes. -->

**The `Cd` probe did not supersede the synthesis.** Blessing directive 2 anticipated that phase 1's `Cd` probe might record the very event never captured here — a successful out-of-allowlist call — in which case that wire would have replaced the synthesised `violation` fixture as authentic seed. It came back the other way: probed at the 2.1.220 audit, `Cd` returns the bare `No such tool available: Cd` **without** the "exists but is not enabled in this context" clause, and a deferred-registry lookup finds no match — it is absent from the build's registry, not merely denied (`.claude/bin/consult`, the DENY comment block). So no successful out-of-allowlist call was created, the synthesis stands, and the substitution point above remains the recipe should a future harness version ever produce one.

### What `violation-truncated` does not cover

**It does not cover the ENOBUFS arm, and cannot.** When `spawnSync` fails at the spawn level there is no wire at all — no bytes, no events, nothing to have parsed — so the finalizer correctly says nothing about the boundary and there is no warning to assert. The fixture shapes the **stub's** exit code (143), not the guard's placement; what it proves is that a stream which *did* carry a breach and *then* died mid-event still produces the warning before `degrade()` exits. On bun 1.3.14 `spawnSync` **returns** with `run.error` set and `status: 143` rather than throwing, which is why the phase's placement fix has to be structural (a single finalizer) rather than try/catch-shaped — but that failure shape is verified by reading the control flow, not by this fixture.

## Known coupling: the slug rule

`guard-check.ts` recomputes the transcript-directory slug **exactly as `.claude/bin/consult` computes it** — `resolve(repoRoot).replace(/[^a-zA-Z0-9]/g, "-")`, under `$HOME/.claude/projects/` — because the sandbox has to seed a transcript where `consult` will look for it, and `consult` exposes no way to ask.

This is a deliberate duplication and a real coupling. **If that rule ever changes — in `consult` or in the harness's own project-directory layout — this runner does not fail loudly; it fails mystifyingly**, with `consult` reporting "no transcript for `<uuid>` — not in the local cache nor in `work/sessions/`" and exiting 3, for every case at once. A whole-file `FAIL` sweep with that stderr line under it means the slug rule moved, not that the guard regressed. The site is flagged `⚠ SLUG COUPLING` in `guard-check.ts` and in its header comment.

The runner reduces the surface where it can: it asks `git rev-parse --show-toplevel` inside the sandbox rather than assuming the directory path, exactly as `consult` does, so a `tmpdir()` that resolves through a symlink cannot desync the two.

## Design: why the runner drives the real script

Decision **D1**, blessed. The runner spawns `.claude/bin/consult` itself, so acceptance 4, 5 and 13 are discharged **against the shipped file** — its parser, its guard predicate, its finalizer, its exit ladder, its stdout/stderr split. The alternatives all prove less: extracting the predicate into an importable module churns `.claude/BASELINE.md` and breaks the single-file property phase 1 preserved; an `import.meta.main` seam puts test logic in production tooling, which gate ruling 9 forbids; re-implementing the predicate here proves only that this file agrees with itself.

The substitution point is the **child**, not the script under test. `sandbox/bin/claude` is a four-line `sh` stub that ignores argv entirely and `cat`s `$CONSULT_FIXTURE`, so every flag `consult` constructs is built and passed for real without any of them changing the reply — and no network call is possible.

Hermeticity comes from `HOME`. `consult` reads `process.env.HOME` to locate its transcript cache, so an overridden `HOME` plus a temp `git init` repo means the real project store is never read or written, and the seeded one-line transcript (`{"type":"summary","cwd":"<sandbox repo>"}`) makes the local-cache branch hit — so `bindOrRefuse` passes and the archive/restore path is never exercised. The machine segment of the handle is computed (`hostname().split(".")[0]`) rather than hardcoded, since `consult` exits 2 on a foreign one. Each sandbox is removed after its case unless `--keep` is passed.

Phase 1 of this milestone already used stub-`claude` runs for three of its verification criteria; this generalises that expedient into committed apparatus.
