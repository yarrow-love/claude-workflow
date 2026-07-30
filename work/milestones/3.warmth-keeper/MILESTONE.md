---
sessions:
  - claude@play/2cc71fb6-4cdf-41b6-9397-b5d54b215500 # mission architect — stubbed at amendment A1
  - architect@play/a3117b31-b7e0-4a55-bc48-fc6a0a163214 # milestone architect — hardened 26-07-29
  - executor@play/a3117b31-b7e0-4a55-bc48-fc6a0a163214 # campaign executor — same session, executor hat
---

# Milestone 3 — warmth-keeper: always-warm without a held-open superior

> **Closed accomplished 26-07-30.** Stubbed at **amendment A1** (26-07-28), replacing the superseded `2.intercom` lifecycle machinery and `3.protocol-integration`. Hardened 26-07-29 into two phases under operator rulings: a **self-managed cross-platform daemon** rather than an OS-timer seam, and **no soak** — the TTL-window evidence re-homed to M4 by charter amendment A2. This is the mission's crux (charter success criterion 2), and it discharges it: **19.94× measured** on the keeper's own telemetry.

## Objective

Build the scheduler that holds registered superior handles warm by firing trivial read-only fork pings just under the measured TTL — delivering always-warm economics with none of the process-keeping machinery the original charter proposed for the *superior*, per **D7** (cache residency is byte-bound: it survives process death and fork identity).

## The economics this milestone is built against

Every default in the deliverable derives from M1's measured cells, not from judgment:

| Quantity | Measured (M1, 26-07-28) | What it fixes |
| --- | --- | --- |
| Warm read of a 217k-token prefix | **$0.233411** | the price of one beat |
| Cold write of the same prefix | **$4.262748** | the price of one lapse |
| Ratio | **18.26×** | why the keeper exists at all |
| Cache bucket | `ephemeral_1h` on every write | why the beat interval is sub-60-minute |

**Break-even follows arithmetically**: 4.262748 / 0.233411 = 18.26 beats buy one avoided cold reload. At a 58-minute beat that is **17.7 hours** — the charter's "~19-hour break-even", and the derivation behind this milestone's 18-hour dormancy bound. Continuous warmth costs ~2.4× the prefix's input price per day against 2× for a single cold write, so an always-on keeper is roughly break-even at one-consult-per-day traffic. **Beats are not free, and cadence discipline is the deliverable** — not an optimization on top of it.

## D7 reconciliation — why a daemon is not the machinery A1 deleted

D7's closing clause reads *"no deliverable may justify process-keeping machinery on warmth grounds"*, and this milestone ships a daemon justified on warmth grounds. The tension is real on its face and is settled here rather than left to surface at mission close.

**The discriminator: kill the process and fire the same beat by hand at the same instant — is the consult's price identical?**

- **A1's channel: no.** It held the superior's live context; killing it forced the cold degrade path. The process *was* the warmth mechanism, which is exactly what D7's evidence (byte-bound residency) made unnecessary.
- **The keeper: yes.** It holds no prefix and no context. Its entire state is a directory of registry files; any timer, or a human running `tick`, substitutes for it without changing a single token of cost. Its aliveness schedules warmth; it does not constitute it.

The keeper is also **outside the consult path entirely** (D3 unchanged — the fork ladder remains the sole transport). Nothing ever waits on it, and its total failure cost is bounded at one cold reload — the ceiling the charter's stall semantics already pin. That is a categorically cheaper object than the channel was, and D7 does not reach it.

## Scope

- **The keeper as product** — `.claude/bin/warmth-keeper`, BASELINE-manifested, project-generic. A **self-managed daemon**, portable across Linux/macOS/Windows by construction rather than by an OS-timer recipe per platform: `spawn(…, {detached, stdio: 'ignore'}).unref()`, `process.kill(pid, 0)` liveness, exclusive-create locking. Operator ruling 26-07-29 — the seam alternative would have been three deliverables with two unwritten, and a portable daemon leaves *no* machine fact to route, satisfying the genericity test more fully than the seam would.
- **`tick` stays the core.** The daemon is `while (true) { tick(); sleep(); }` and nothing more, so cadence logic is synchronously testable with a clock override instead of through wall clock, and `tick` remains exposed for manual and diagnostic use.
- **Registration lifecycle** — handles register at campaign open and release at campaign close. `register` **starts-or-attaches** the daemon so no campaign can forget to start it; releasing the last handle lets the daemon **self-terminate**, so none can orphan one.
- **Activity-windowed cadence**, from the table above: 58-minute beats while registered; an 18-hour dormancy bound past which a registration lapses unrenewed; re-registration renews. Reboot lapses warmth, which is correct behavior under a policy that already lapses across dormancy — not a gap to close.
- **Stall semantics** (herdr citation) — a beat that hangs must **return**, never wedge: every beat is timeout-bounded, and beat failure is a *returned state*, never an exception (M2's bun finding — `spawnSync` returns with `run.error` set rather than throwing). **Corrected at phase 1's reconnaissance**: a timed-out `spawnSync` returns `status: null`, `signal: "SIGKILL"`, `error.code: "ETIMEDOUT"` — **there is no `status: 143`**. That number is shell convention (128+15), not Node/bun's, and a `timed_out` branch keyed on it would never fire. The operative guidance was always right; only the aside was wrong. A missed or failed beat costs at most one cold reload, never a wedged scheduler and never a lost consult. Rate limiting is **defer-to-next-window** — never a retry inside the window, which would feed the limit it hit.
- **Canon + role cards** — the registration convention in `work/README.md` § The callback grammar and the consulting role cards (architect, executor, manager); the fork ladder stays the sole consult transport (D3).
- **Proposal enactment** — `work/proposals/26-07-28.always-warm-intercom.md` files to `_enacted/` with a reconciliation note recording that its premise was confirmed and its mechanism superseded twice: the channel by A1, the OS-timer seam by this milestone's daemon ruling.

## Out of scope

- **The soak.** Operator ruling 26-07-29: the team is burning tokens on the broken workflow now, and a real feature is a better test than synthetic beats. The chartered TTL-window evidence re-homes to M4 (**charter amendment A2**), and the deliberate-expiry negative control is **dropped** — it costs a cold reload to re-prove what M1 already measured at 18×. What M3 owes instead is a ~3-minute two-beat smoke test, which is sufficient for every fact except cadence-clears-expiry.
- **An OS-timer recipe printer** (systemd unit / launchd plist / Task Scheduler). It buys reboot survival, which this cadence policy does not want.
- **Reopening M2 beyond one field.** Phase 1 adds `rate_limit_events` to `consult --usage-json` — a strict key addition, no other behavior touched.

  **Its stated justification was wrong, and phase 1's smoke test is what proved it.** This bullet originally read that the field was needed "because the keeper cannot otherwise separate a rate-limited beat from a failed one." Both beats of a textbook-clean warm run carried `rate_limit_events: 1` — the wire emits those as routine accounting, not as a throttling signal. The keeper *can* separate the cases without the field, and does: **the discriminator is a non-zero exit code alongside a present usage object**, since `consult` renders usage iff a terminal `result` event reached its parser. The field's real use is as a **rate** — rising counts across records are a pressure signal; a single record's value is not a verdict. Charter criterion 5's enumerability rests on the exit/usage pair, not on this counter. Full entry: `work/footguns/consult-telemetry.md`.
- **`integrator.md`'s dangling "the scheduler"** (`.claude/agents/integrator.md:26,35`) — an undefined merge-queue actor, unrelated to this one despite the name collision. Named here so the two are never conflated; reconciling it is not this milestone's work.
- **The nine pre-existing `reference-gate` failures** in `work/research/herdr.md`, red since before M2. Charter criterion 7 still requires a green gate before *mission* close; this milestone must add no new failures.

## Portability posture — stated, not implied

The machine registry has one row (`play`, Linux). The keeper is **written portable and verified on Linux only**; Windows and macOS are unverified, and acceptance must not imply coverage this mission cannot produce. One known inherited hazard is carried in the script header rather than discovered later: `consult` spawns the bare string `claude`, and on Windows only a pinned native `claude.exe` serves that, drifting behind the bash shim after a Desktop update (`work/notes/26-07-28.consult-token-cost-evidence.md` § Secondary finding).

## Phases

| # | Phase | Gist | Status |
| --- | --- | --- | --- |
| 1 | [keeper](1.keeper.md) | The script whole: registry, cadence, timeout-bounded beats through `consult`, telemetry, and the self-managed daemon. BASELINE + `package.json` in the same commit. Closed by a two-beat smoke test | **done (26-07-30)** — PASS on all 24 criteria; `b1e50aa`→`ae42379` |
| 2 | [integration](2.integration.md) | The seams: canon + role cards, executor campaign open/close, the ADR orphan hazard, proposal enactment | **done (26-07-30)** — PASS on all 14 criteria; `c6104ee`→`b5ec294` |

**Phase 1's evidence, in one line.** Beat 1 wrote 68,923 tokens to `ephemeral_1h` at **$1.3787**; beat 2, 64 seconds later, read *exactly* 68,923 with `cache_creation_input_tokens` at **zero**, for **$0.0691** — a **19.94×** ratio, independently corroborating M1's 18.26× on a different prefix and a different day. That beat 2's read equals beat 1's write byte-for-byte is a second, unlooked-for confirmation of **D7**: residency is bound to the prefix bytes, not to a process or a session id.

**Why two, and why this cut.** Phase 1 is the value: the moment it lands, a handle can be registered *by hand* and the token burn stops — phase 2 is what makes it automatic rather than remembered. The cut also keeps a code convergence loop away from a prose-editing one. Against the instinct to split further: M2's log records five consecutive agent deaths, four of them 600-second stalls including one on a fresh dispatch that did nothing at all before dying. That failure is environmental and uncorrelated with task size, so each extra dispatch is another exposure — which argues for fewer phases, while the "lose the most work at 90%" risk caps how large any one may be.

**Cross-phase premise.** Phase 2 assumes phase 1 leaves true: `.claude/bin/warmth-keeper` exists and is BASELINE-manifested; its subcommand names (`register`, `release`, `status`, `tick`, `watch`, `stop`) are final, because phase 2 writes them verbatim into canon and three role cards; and `register` is idempotent start-or-attach, because the campaign-open convention phase 2 authors depends on a campaign never needing a separate start step.

## Acceptance

The Executor's ultimate-acceptance test for the milestone.

1. Both phases' `## Acceptance` blocks pass, with addenda written.
2. `.claude/bin/warmth-keeper` is product: project-generic (no repo-specific or machine-specific facts), BASELINE-manifested, and listed in `.claude/bin/package.json`'s `bin` map.
3. The two-beat smoke-test readings are recorded in phase 1's addendum: a second beat on a registered handle shows `cache_read_input_tokens > 0` against `cache_creation_input_tokens ≈ 0` — warmth demonstrated, not asserted.
4. A campaign can register and release a handle by the convention as written in canon, exercised once end-to-end.
5. The proposal is filed to `work/proposals/_enacted/` with its reconciliation note.
6. Quality gate: tooling smoke test green including `warmth-keeper`; `reference-gate check` adds **no new failures** beyond the nine pre-existing `herdr.md` ones (M2's amended acceptance, expiring at mission close per charter criterion 7).
7. `/initialize` run once by the Executor at milestone close — carried forward from M2 phase 1, where it was found not headlessly invocable. **Discharged 26-07-30: all nine checks green.** Baseline integrity (44 files, all classified — the workflow and capability directories are manifested as "all files", and `settings.local.json` is gitignored harness-local, not drift); four MCP servers connected; both hooks resolve and parse; spawn cap `"2"`; keystones present with all eight supplement sections answered; scaffold complete including `_enacted/`; git hygiene covering secrets, `tmp/` and `.codebase-memory/`; MANIFEST 151 OK with stamped handles spot-checked archived and 90-day retention; bun 1.3.14. The codebase-graph axis reads **inapplicable per declaration** — `work/PROJECT.md` § Codebase graph declares `None` — which is a third status, neither pass nor fail; `.cbmignore`'s existence is checked regardless and holds.

## Depends on

M2 — the keeper's beats are consult-shaped children and its telemetry is the instrument's own output, so it is built *on* the instrument and measured *by* it. M2 phase 2 is built, committed and Executor-verified with certification outstanding (`work/todos/26-07-29.certify-m2-boundary.md`); the instrument itself is landed and usable.
