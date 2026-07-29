---
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — stubbed at amendment A1
  - architect@play/c1378142-cf5c-4ad2-97b0-920533f97a7c # milestone architect
  - executor@play/c1378142-cf5c-4ad2-97b0-920533f97a7c # campaign executor
---

# Milestone 2 — instrumented-consult: make the cost observable

> Stubbed at **amendment A1** (26-07-28), replacing the superseded `2.intercom`; hardened 26-07-28 by the milestone architect. Small and unblocking — the mission's measurement surface does not exist until this lands, and M3's warmth-keeper is built *on* this instrument and measured *by* it.

## Objective

Teach `.claude/bin/consult` to read the child's event wire instead of treating stdout as an opaque string: capture per-consult `usage`, report it without disturbing the answer, and — using the parser it now has anyway — turn M1's `permission_denials` trap into an enforced boundary invariant. Charter success criterion 3, and the precondition for criterion 5.

## Scope

Two phases, ordered so the second rides the first's parser:

- **Phase 1 — wire**: `--output-format stream-json` on the consult fork; answer and `usage` extracted from the event stream; the four traps M1 named avoided by construction; the stdout contract preserved exactly; oversized answers fall back to path-as-message.
- **Phase 2 — boundary**: the DENY list reconciled against v2.1.220, and a guard that detects *successful* tool use outside the read-only allowlist and refuses to report a clean sheet over it.

**M2 requires no new measurement.** M1's addendum (`work/milestones/1.spike/1.channel.md` § Addendum) is this milestone's specification — the wire map and the four traps are already established fact.

## Out of scope

- **The warmth-keeper** — M3's. This milestone builds the instrument, not the thing it measures.
- **Canon and role cards** — M3 owns the registration convention and will edit `work/README.md` § The callback grammar and the consulting role cards once, there. M2 touches only `.claude/bin/consult`, `.claude/BASELINE.md` if its surface changes, and the DENY-drift hazard entry in `.claude/ADR.md`. Two milestones must not edit the same canon files.
- **Redesigning the allowlist model.** The deeper hazard — that the harness's deferred/built-in tool class is *name-deny-only*, so DENY must be a complete superset rather than a backstop — is structural and larger than this milestone. M2 reconciles the list and **restates** the limitation; it does not attempt the redesign.
- **Auto-appending to the evidence note.** Ruled out at planning (below): `consult` emits, a collector records.

## Settled at planning

Operator rulings, 26-07-28, binding on both phases:

1. **The stdout contract is preserved exactly.** The answer goes to stdout, alone, as today — every existing call site keeps working untouched. Usage goes to **stderr** (human-visible in a terminal, ignorable by a pipe), plus an opt-in machine-readable `--usage-json`. This is the herdr citation applied: *answer plus numbers, never the child's raw wire into the parent's context.*
2. **Emit, don't append.** `consult` reports its numbers and stops; a collector or the M4 campaign harness does any recording. Auto-appending would make a read-only-flavoured tool a writer on every call, and would bake a repo-specific path into project-generic product — which the genericity test would reject.
3. **Guard, and warn.** A *successful* tool use outside `Read`/`Grep`/`Glob` is detected and reported loudly with a non-zero exit; the answer is still returned. Not a hard-fail — a parser false positive must not destroy a legitimate answer.
4. **Blast radius: `consult` plus the ADR/BASELINE notes.** Role cards and callback grammar stay for M3.

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [wire](1.wire.md) | stream-json parse; answer + `usage` extraction avoiding M1's four traps; stdout contract preserved, usage to stderr + `--usage-json`; failure/exit semantics reworked; oversized-answer fallback | pending |
| 2 | [boundary](2.boundary.md) | DENY reconciled against v2.1.220 (`Cd` probed, not reachable); the successful-out-of-allowlist guard on phase 1's parser; ADR hazard entry reconciled | **built + verified 26-07-29; certification outstanding** → [`work/todos/26-07-29.certify-m2-boundary.md`](../../todos/26-07-29.certify-m2-boundary.md) |

## Status — 26-07-29

Phase 1 **closed, accomplished**. Phase 2 **built, committed (`4486d9e`) and Executor-verified** — `guard-check.ts` passes every assertion at exit 0 and the tooling smoke test passes — with its independent review, phase doc addendum and acceptance verdict **outstanding**, filed as [`work/todos/26-07-29.certify-m2-boundary.md`](../../todos/26-07-29.certify-m2-boundary.md) after five consecutive agent deaths made further dispatch unproductive. No implementation work remains. `/initialize` is also owed at this milestone's close.

## Acceptance

The Executor's ultimate-acceptance test:

1. **Both phases closed against their own acceptance**, phase 2 built on phase 1's parser rather than a second one.
2. **A consult reports what it cost** — a real round trip emits the four token fields plus the nested `cache_creation` TTL breakdown and a per-consult cost that is a *delta*, not the cumulative process total (M1 trap 1).
3. **No existing caller breaks.** stdout carries the answer and nothing else; the documented exit codes (0/1/3/4) keep their meanings, with failure detection reworked off the event stream rather than the now-obsolete empty-stdout heuristic.
4. **The boundary trap is closed** — `permission_denials` is never the signal; a successful out-of-allowlist tool use is detected and surfaced, demonstrated against a fixture.
5. **The standing hazard is honest** — `.claude/ADR.md`'s DENY-drift entry describes the reconciled state and restates the name-deny-only limitation that survives it.
6. **Genericity holds** — nothing repo-shaped enters `.claude/`; the change works verbatim in a fresh consuming repo.
7. **Quality gate** — the tooling smoke test (`consult` with no args still prints usage and exits 1) and `/initialize`. ***Amended by operator ruling, 26-07-29**: this milestone closes with `reference-gate check` **red**. Its 9 failures are pre-existing, confined to `work/research/herdr.md`, verified byte-identical against HEAD, and unrelated to anything M2 touched; a bug is filed and the fix is deferred. The amendment is bounded — **charter success criterion 7 still requires a green gate before mission close**, so the deferral expires at v4's close and cannot lapse into permanence.*
8. **The guard's allowlist limitation is recorded, not just accepted** — operator ruling 26-07-29 set the guard's allowlist to the six names the harness actually grants (`Read`, `Grep`, `Glob`, `ReportFindings`, `Skill`, `ToolSearch`), so the predicate asks "did anything beyond the granted set run." The consequence is that the allowlist mirrors the harness's grant and therefore goes stale on harness upgrade exactly as `DENY` does. It must be stated at the allowlist in code and carried as a second surface on the ADR's DENY-drift hazard entry.

## Depends on

**M1**, for its mapped event wire and the four traps — the specification, already fact. Nothing else; this milestone is deliberately small because everything after it waits on it.
