# herdr: agentic intercom and token efficiency, and whether we can build on it

> Filed 26-07-28 by `claude@play/c256e59e-dca2-40e4-8357-9f66d114024f` (operator dialog) during mission v4.token-efficiency. Read against `~/dev/herdr` @ `73d92004` (`master`), indexed as `home-yarrow-dev-herdr` (23,544 nodes / 109,736 edges) — 252 Rust files, Apache-2.0, docs versioned through 0.7.5. Filed to `work/` rather than `docs/` deliberately: `docs/` folds toward the template release, `work/` archives with the mission.

## What herdr is

An **agent multiplexer** — a tmux-like Rust server that owns real PTYs, renders them with vendored libghostty VT, and recognizes coding agents running inside panes. Agents are ordinary CLI processes; herdr never wraps or proxies a model. The intercom is a Unix-domain-socket newline-delimited JSON-RPC API, surfaced to agents as a plain `herdr` CLI and taught by a 195-line `SKILL.md`.

The framing matters for us: herdr is **not** a workflow system. It has no roles, no work orders, no acceptance criteria, no tier ladder. It is a *substrate* — addressable terminals with observable state. Everything we have built above that line remains ours to keep.

## Part 1 — the token-efficiency techniques

The central move, and the one worth internalizing:

> **The entire coordination plane lives outside every context window.** Who is working, who is blocked, who finished — none of it is ever a token in a supervisor's context unless the supervisor explicitly asks for it.

Six mechanisms implement that.

### 1. Out-of-band state derivation

Agent state (`blocked` / `working` / `done` / `idle` / `unknown`) is derived from three sources, none of which costs a parent any tokens:

- **Declarative detection manifests** — `src/detect/manifests/*.toml`, 19 agents. Prioritized rules matching *regions* of the terminal: `osc_title`, `bottom_non_empty_lines(5)`, `after_last_horizontal_rule`. In `src/detect/manifests/claude.toml:7-55`, a braille-spinner regex in the OSC title means `working`; `"enter to select"` + `"esc to cancel"` after the last horizontal rule means `blocked`. Manifests are versioned (`version = "2026.07.13.1"`) and **remotely updatable** — `server.agent_manifests` reports `cached_remote_version` and `remote_update_result` — so a harness UI change is a *data* update, not a release.
- **Self-report hooks** injected into each harness. `herdr integration install claude` writes a `SessionStart` hook that opens the socket and calls `pane.report_agent_session` (`src/integration/assets/claude/herdr-agent-state.sh`). Where a hook is authoritative, screen rules are suppressed — `agent.explain` returns a `screen_detection_skip_reason`.
- **Process-tree / foreground-process-group detection.**

The lesson in one line: **status is a projection of the terminal, not a message in a context window.** A supervisor pays zero tokens to know that five agents are working and one is blocked.

### 2. Blocking waits, not polling

```
herdr agent wait <name> --until blocked --timeout 120000
herdr pane wait-output <pane> --match "test result" --timeout 120000
herdr agent prompt <name> "…" --wait
```

One tool call in, one line back when the condition fires. A polling loop by contrast re-injects output on every tick. `events.subscribe` filters **server-side** — `pane.agent_status_changed` scoped by both `pane_id` *and* `agent_status` — so only interesting transitions cross the boundary at all.

Worth stealing outright: `agent prompt --wait` carries a **stall detector**. A prompt sent from a non-working state must produce an observed lifecycle change within five seconds, or the call returns `agent_prompt_stalled` rather than hanging. That is a direct upgrade candidate for our callback grammar, which currently has no equivalent liveness assertion.

### 3. Graduated read fidelity

`pane.read --source visible | recent | recent-unwrapped | detection --lines N --format text|ansi`.

The supervisor chooses resolution and bounds it by line count. `detection` is the tiny bottom-buffer snapshot used by the rules engine. This is the real answer to "observability without paying for the transcript": read **on demand, bounded**, rather than streaming a child's output into the parent.

### 4. File-as-channel, path-as-message

Documented in `SKILL.md` as the fallback when an agent runs on the alternate screen and scrollback cannot recover its response:

> ask the agent to write its complete response as Markdown in a temporary directory and reply only with the file path, then read the file directly.

The parent pays for a path, not a transcript. Note the discipline: it is explicitly framed as a fallback — *"Use this only as a fallback; do not request file output in the initial prompt."*

### 5. Opaque stable handles plus injected self-address

`w1`, `w1:t1`, `w1:p1` — never reused after close. Every managed pane gets `HERDR_PANE_ID` / `HERDR_TAB_ID` / `HERDR_WORKSPACE_ID` in its environment, so an agent knows its own address with no discovery round-trip. Named agents (`[a-z][a-z0-9_-]{0,31}`, unique among live agents) follow the pane occupant and clear when it exits.

### 6. Declarative server-side view projections

`agent.view.set` takes a filter/sort DSL (`all` / `any` / `not` / `eq` / `in` / `exists`; sort by `attention`, `state_change_seq`, …). Filtering happens in Rust. No LLM reads a list to decide what matters.

### And a discipline point

`SKILL.md`'s own description reads: *"Do not use merely because a task could benefit from a background terminal, delegation, or parallel work."* Token efficiency starts with the skill not loading.

### The caveat that matters most to us

**herdr's peer model is sibling processes, not subagents — and it deliberately refuses to track subagents.** The Claude hook exits immediately when `hook_input.get("agent_id")` is set, and ignores `SubagentStop` entirely. From `src/integration/assets/claude/herdr-agent-state.sh:55-59`:

> *SubagentStop is a completion event. Older Herdr integrations mapped it to durable working, but Claude recap/away-summary can emit it after the main turn has already stopped. Never let it revive an idle pane.*

So herdr has **not** solved observability *into* subagent work. It sidesteps the problem by making every worker a first-class peer pane. That is the finding with the most consequence for v4 — see § The design fork below.

## Part 2 — can we build on it

**Recommendation: do not take a runtime dependency. Take the architecture and the data.**

### The cross-platform blocker is real, and worse than "Windows is beta"

Confirmed against `website/src/content/docs/windows-beta.mdx` and the tree:

- Windows builds ship through the **preview channel only**; herdr defaults to preview on Windows without asking.
- `src/platform/windows.rs` is 1809 LOC on ConPTY, against 1086 (linux) and 1206 (macos) — the effort is genuine, but the model is different, not ported.
- Windows agent detection "scans descendants of the pane shell" and is explicitly **not** Unix foreground process-group detection. The load-bearing signal is weaker.
- **The self-report layer is partially Unix-only.** Of the ten shell-based integrations, six ship a `.ps1` (claude, codex, copilot, droid, kimi, qodercli); **cursor, devin, grok, mastracode are `.sh`-only**. Five more are runtime plugins (hermes/Python, kilo + opencode/JS, omp + pi/TS) and travel better. So the *authoritative* state source degrades on Windows exactly where screen detection is also weaker.
- Live cwd after `cd` is "partial"; plugins are "preview / best effort"; clipboard image paste "unverified"; remote clipboard bridging "remains tied to Unix/macOS".
- The maintainer states Windows support may graduate to stable, stay preview-only, **"or be reduced if the maintenance cost is not justified."**

That last clause is decisive. Building `agentic-workflow`'s tri-platform story on herdr means betting on someone else's beta that they have reserved the right to withdraw.

### What to do instead, in order of value

1. **Adopt the architecture.** Free, and the highest-leverage item by a wide margin. Coordination plane outside the context window; state derived out-of-band; blocking waits and graduated reads replacing transcript streaming; path-as-message; a stall detector on every prompt-and-wait. This is portable *reasoning*, not portable code, and it needs no dependency at all.

2. **Harvest the compatibility data.** Apache-2.0, attribute it. Three assets are worth vendoring and tracking upstream:
   - the 19 detection manifests (`src/detect/manifests/*.toml`) — a declarative, versioned grammar for reading agent state off a terminal;
   - the 15 integration adapters (`src/integration/assets/<agent>/`) — hook payloads per harness;
   - the resume-command table in `website/src/content/docs/session-state.mdx` (`claude --resume <id>`, `codex resume <id>`, `opencode --session <id>`, `pi --session <path-or-id>`, …).

   Together these are a harness-compatibility matrix that would otherwise cost months to build and maintain. Crucially it is mostly **data**, which is exactly the shape a harness-agnostic abstraction needs — our own harness seam can be a manifest table rather than a pile of adapters.

3. **Treat herdr as an optional backend, never the substrate.** Define our own thin transport interface; ship a herdr adapter for Linux/macOS where it genuinely excels; keep a portable fallback for Windows. Gate on `HERDR_ENV=1` exactly as `SKILL.md` does, and degrade rather than fail when it is absent.

### What herdr would and would not replace

| Ours | herdr's answer | Verdict |
| --- | --- | --- |
| Role ladder, tiers, work orders, acceptance | none — no workflow layer at all | keep entirely; herdr is orthogonal |
| Callback grammar / intercom transport | socket JSON-RPC + CLI + blocking waits | **strictly better mechanism**; adopt the shape |
| Observability into running work | out-of-band state + bounded on-demand reads | **strictly better**; adopt |
| Observability into *subagents* | refuses the problem; peers only | unsolved by herdr — ours to settle |
| Harness abstraction | 19 manifests + 15 adapters, as data | harvest |
| Cross-platform guarantee | Linux/macOS strong, Windows preview-only | **cannot rely on it** |

## The design fork this raises

herdr's flat peer model is not merely an implementation detail — it is a coherent alternative to our nesting model, and it lands directly on v4's open question.

**Flatten to peers**: every worker is a first-class addressable pane with independently observable state; "subagent" becomes a *naming convention* over peers rather than a nesting of context windows. Observability and token cost both become tractable, because a peer's state is a projection and a peer's output is read on demand and bounded.

**Keep nesting**: preserves the role ladder's natural containment and the existing dispatch semantics, but keeps us paying for parent-context rehydration and keeps subagent observability structurally hard — the exact pair of problems recorded in `work/notes/26-07-28.consult-token-cost-evidence.md`.

This bears on the M1 spike finding that nesting is default-on and the depth variable only *caps* rather than enables. Per standing convention this fork routes to the architect rather than being settled here.

## What was not examined

Stated plainly so the next reader does not over-trust this document:

- I read the docs, `SKILL.md`, the detection manifests, and the integration adapters. I did **not** read the Rust server internals — `src/api/wait.rs`, `src/api/event_hub.rs`, `src/api/subscriptions.rs`. The account of wait and subscription behaviour above is from the documented contract, not from the implementation.
- The manifests were not tested against our actual Claude Code version; `claude.toml` is dated `2026.07.13`.
- No measurement was taken. Every token-efficiency claim here is architectural reasoning, not benchmark data — unlike the consult-cost note, which is measured.
