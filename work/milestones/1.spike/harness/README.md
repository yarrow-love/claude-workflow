# 1.spike harness

Mission apparatus for milestone 1.spike phase 1 ([`../1.channel.md`](../1.channel.md), work order [`../../../todos/26-07-28.channel.md`](../../../todos/26-07-28.channel.md)) — deliberately **not** a `.claude/bin/` script: M2 designs the product shape from the measurements rather than inheriting the spike's expedient one. Bun scripts, no `package.json` (`.claude/bin/` is this repo's sole sanctioned package root).

## Files

- `channel.ts` — the channel primitive. `openChannel(opts)` holds open one `claude -p` stream-json process, sends turns down one stdin, and yields parsed events. Owns the spawn construction (`.claude/bin/consult`'s five read-only layers, mirrored — plus `--fork-session`, an explicitly pinned `--model fable`, `--verbose`, and both stream-json format flags), the stdin write+flush coupling, and the concurrent stdout/stderr pumps with tee-before-parse.
- `spike-run.ts` — the driver. Preflight, turn choreography, transcript sampling, the structured run log, teardown. Every spawn it makes against a session carries the same boundary, with **one reviewed exception**: the criterion-8 `claude --resume` picker check, which targets no session (a pure listing), closes stdin, and is doubly bounded. Side spawns taken while the channel is alive are async (`Bun.spawn` + `await`), never `spawnSync` — a synchronous spawn would pause the channel's pump loops and invite the pipe-buffer deadlock `channel.ts` guards against.

## Usage

```
bun work/milestones/1.spike/harness/spike-run.ts <uuid> [--observe|--postmortem] [--dry]
```

Run from the repo root. The transcript id is always an explicit argument — the harness never auto-selects, and an absent transcript is an escalation, not a substitution.

Exactly one positional `<uuid>`; extra positional arguments are a usage error, not a silently ignored tail.

Exit codes: `0` ran (or `--dry`) · `1` usage / malformed argument · `2` **`--observe` only:** no candidate stdin shape was accepted — the criterion-5 refutation candidate, not a harness fault · `3` transcript absent (escalate) · `4` the transcript belongs to another repo · `5` a charter failure criterion did not hold, or `--postmortem` got no answer.

`--observe` is wire-shape discovery: it tries candidate stdin shapes **one fresh spawn each** (never two shapes down one stdin — that would confound attribution), sends one canned turn, accumulates under a wall clock rather than a completion predicate, then EOFs and records the exit code. It exits 0 once a shape is accepted, 2 if none is. Each candidate gets its own `.<candidate>.stream.jsonl` / `.stderr.log` tee; abandoned candidate spawns still log a `spawn` entry, because they transmit the vehicle prefix and belong in criterion 12's last-touch maximum.

`--postmortem` takes a **channel** session id (never the vehicle's) and resume-forks it as a one-shot `-p` after its process is dead — acceptance criterion 6's second half. It carries the same five read-only layers and the same pinned `--model fable` as the channel, dropping only `--input-format` (there is no stdin wire; the question rides the positional prompt), so no unbounded process ever runs against a real transcript and the cache touch stays on the same byte-exact prefix regime phase 2 measures. Output stays `stream-json` + `--verbose` so the forked session id reads off `system`/`init` and `usage` off the `result` event. The `resume` entry it logs carries `apiCall: true` with the **response** instant as its timestamp — this call is normally criterion 12's last-touch maximum, since it re-warms the vehicle prefix after the boundary probes.

Two things it established on 26-07-28, both load-bearing for phase C: the accepted shape is the SDK `SDKUserMessage` lead (`{"type":"user","message":{"role":"user","content":[{"type":"text","text":"…"}]}}`, one line, newline-terminated), and a **per-turn `result` event** (`type: "result"`, `subtype: "success"`) marks quiescence. Also observed: no stdout event, not even `system`/`init`, arrives until the first stdin turn has been written — so a driver must send turn 1 first and read the session id off the stream afterwards, never block on init before sending.

## Artifacts

Per run, under `tmp/spike/` — gitignored scratch, declared in [`work/PROJECT.md`](../../../PROJECT.md) § Structure:

- `<stamp>.<mode>.stream.jsonl` — raw stdout tee, written before any parse attempt
- `<stamp>.<mode>.stderr.log` — raw stderr tee
- `<stamp>.<mode>.run.json` — the structured run log, the evidence artifact: vehicle id, resolved command array, captured channel session id, and timestamped entries (`spawn` / `turn` / `probe` / `resume` / `sample` / `eof` / `exit` / `note`). Entries that transmit the vehicle prefix carry `apiCall: true`; `lastApiTouch` is the running maximum over them, which is acceptance criterion 12's last-touch clock. A `note` can opt in by passing `apiCall: true` explicitly — the escape hatch for a best-effort side call that is normally not a touch but might become one.

  An `apiCall` entry's `ts` is the **response** instant, not the send instant; `turn` / `probe` entries keep the send instant alongside as `sentAt`. A turn can run 180–240 s, and criterion 12's error bar is asymmetric — an over-late last-touch only lengthens phase 2's cooldown wait, while an over-early one silently corrupts the cold baseline every ratio is computed against.

  `turn` / `probe` records capture `message.id` and `request_id` alongside each `assistant` event's `usage`. One model call splits across content blocks — one event per block, repeating one identical `usage` — so **summing `assistant.message.usage` naively double-counts**; dedupe by `message.id`. The criterion-5 analysis states `count`, `distinctMessageIds` and `distinctRequestIds` side by side so the gap is visible.

## Findings

Land in [`work/notes/26-07-28.consult-token-cost-evidence.md`](../../../notes/26-07-28.consult-token-cost-evidence.md) as a dated, section-stamped section — not here.
