# Footguns — `consult --usage-json` and the keeper's telemetry

Subsystem: `.claude/bin/consult`'s machine-readable usage surface, and `.claude/bin/warmth-keeper`'s per-beat records that carry it. Read before writing anything that *interprets* a beat record — canon text, a role card, or an analysis script.

## `rate_limit_events > 0` does not mean the beat was rate-limited

Discovered empirically at M3 phase 1's smoke test (26-07-30). **Both** beats of a textbook-clean warm run — `outcome: "ok"`, exit 0, a perfect cold-write-then-cache-read pair — carried `rate_limit_events: 1`.

The field counts wire events of `type === "rate_limit_event"`. The wire emits those as routine accounting, not as a throttling signal. So the natural reading — "this counter is how I tell a rate-limited beat from a healthy one" — is **wrong on every healthy record**, and an analysis keyed on `rate_limit_events > 0` would classify a perfectly warm campaign as continuously throttled.

Note that M3's `MILESTONE.md` § Out of scope motivates the field as separating "a rate-limited beat from a failed one." That motivation stands, but the field does not do it alone.

**The actual discriminator** is the pair, not the counter: a **non-zero exit code alongside a present usage object**. `consult` renders usage iff a terminal `result` event reached its parser, which is independent of the exit code — the rate-limited case is exit 3 *with* usage, whereas a bad handle, a cross-machine handle or a repo mismatch (exits 1, 2, 4) emit no usage at all. The keeper's telemetry records both fields precisely so this remains decidable after the fact.

The counter's real use is as a *rate*: a rising `rate_limit_events` across records is a pressure signal. Its absolute value on any single record is not a verdict.

## Never gate usage parsing on the exit code

The same independence is why `warmth-keeper` parses usage from stderr's last line unconditionally, above its outcome ladder. An `exitCode === 0` guard there would silently discard exactly the rate-limited records the enumerability requirement exists to collect — the failure would be invisible, because the healthy records would all still look right. Two acceptance criteria (11a) and a grep exist to keep that guard from ever being reintroduced.

## `--usage-json` is on stderr, and it is the guaranteed-last line

Not stdout. Anything reading the answer and the usage from the same stream will mis-parse. The keeper takes stderr's last non-empty line and attempts `JSON.parse`; presence of a parsing object is the test, never the exit code.

## There is no `status: 143` from a timed-out `spawnSync`

Bun/Node return `status: null`, `signal: "SIGKILL"`, `error.code: "ETIMEDOUT"`. 143 is shell convention (128+15). A `timed_out` branch keyed on the number would never fire — silently, since the beat would simply be misclassified as a plain failure. Measured at M3 phase 1 reconnaissance (bun 1.3.14); the erroneous aside it corrects was inherited from M2's phase doc and is fixed in `MILESTONE.md`.
