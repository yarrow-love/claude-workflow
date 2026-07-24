# Runbook — subagent-dispatch probe battery (M1 spike)

> The hand-execution procedure for M1's five probes. Pick this up in a fresh session on the upgraded CLI. **Verdicts land in the work order** [`work/todos/26-07-23.probe-battery.md`](../todos/26-07-23.probe-battery.md) (§ Verdicts + the reconciliation table) — that's the campaign record; this runbook is how you produce it. Campaign log: [`26-07-23.execute-m1-spike.md`](../todos/26-07-23.execute-m1-spike.md). Est. time: ~30–45 min for the full five; ~15 min for the load-bearing pair.

---

## Before you start — your two questions

### Does this interrupt my other running sessions? **No.**

- `claude` is a system binary (`/usr/bin/claude`). Upgrading replaces it *on disk*; already-running `claude` processes keep the version they loaded and are unaffected. Only **new** `claude` invocations use the upgrade. So you can upgrade with the other repo's agents still running.
- The depth env var is set as a **shell prefix at launch** — scoped to the probe-parent session alone. It touches nothing else.
- Run the probes in a fresh session **in this repo** (`/home/yarrow/dev/claude-workflow`); the other repo's sessions run on their own processes, in their own cwd, untouched.
- *Minor caveat, not a blocker:* if those other agents spawn brand-new `claude` children (consult forks, `-p` children) **after** you upgrade, the children use the new binary — a harmless version skew for a spike.

### Is any of it skippable?

- **The battery as a whole is not skippable** if the mission proceeds — it is the *only* admissible evidence of dispatch behavior and it gates M2 (mission determination D2).
- **Load-bearing minimum = probes 1 + 4.** A fail on either is a mission failure-criteria event (they gate M2 directly). If you have only a short window, run **1 and 4** — that's the irreducible core.
- **Full milestone acceptance needs all five.** Probes 2, 3, 5 inform M2's divergence planning; running only 1+4 leaves acceptance **PARTIAL** (a fine first pass — the milestone just won't fully close until 2/3/5 also have verdicts).
- **Order (all five):** `1 → 5 → 2 → 3 → 4` — fail-fast on the load-bearing depth probe first, panel attestation (3) after its evidence exists, the session-ending durability probe (4) strictly last.

---

## Preconditions

1. **Upgrade** the CLI to **≥v2.1.217** (v2.1.218 known-good) by whatever method installed it. Confirm:
   ```sh
   claude --version          # must print ≥ v2.1.217
   ```
2. **Record that exact version string** in the work order's § Verdicts, dated — it becomes part of every verdict.
3. **Clean-tree check:** `git status --porcelain` — only the work order + milestone docs may be dirty. Re-run before probe 4 and at close; the probes must add no other changes.

---

## Launch the probe parent

In **this repo**:
```sh
CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2 claude
```
- **This session is the probe parent.** It dispatches the probe subagents *itself* (its own depth-1 Agent-tool calls, which dispatch depth-2). Do **not** hand the probes to a specialist subagent — that inserts a layer and changes the depth topology you're measuring.
- **Keep the subagent panel visible** for the whole run — probe 3 is your live attestation of what it shows.
- Standing rule: every dispatch prompt below already ends "read-only; do not write or edit any file." There is no permission backstop under this repo's `bypassPermissions` — prompt discipline is the guardrail.

---

## Probe 1 — Depth *(load-bearing; gates the battery)*

**Control arm** — open a **separate** session launched **without** the env var (plain `claude`, no prefix), and paste:

> You are a depth-1 probe. Attempt to dispatch a subagent (via the Agent/Task tool) that reads `work/PROJECT.md` and reports its first heading. Report back: did the Agent tool permit the nested dispatch, or were you refused/unable? Quote any error verbatim. Read-only; do not write or edit any file.

- **Expect:** nested dispatch unavailable/refused (nesting off by default ≥v2.1.217). Record exact behavior. *(This is the control M2's `/initialize` audit inherits.)*

**Gated arm** — in the env-var probe parent, paste:

> You are a depth-1 probe. Dispatch a depth-2 subagent (via the Agent/Task tool) with exactly this instruction: 'Read `work/milestones/1.spike/MILESTONE.md` and report the exact milestone title (the line starting `# M1 —`) back to your launcher. Read-only; do not write or edit any file.' When the depth-2 subagent reports, relay its exact answer to me and state your own agent identity. Read-only; do not write or edit any file.

- **Pass:** depth-2 subagent completes and returns the correct title. Record the chain (depth-1 id → depth-2 id → returned title).
- **Fail here → stop the battery, record observed behavior, escalate** (resume the Executor).

**Record probe 1 verdict in the work order now.**

---

## Probe 5 — Model + permission *(plants the codeword for probe 4)*

**Model arm** — per-call model override, **opus at depth-1, sonnet at depth-2**. Dispatch a depth-1 subagent with per-call `model: opus`:

> You are a depth-1 probe running under a per-call model override, and you must retain this context — you may be resumed later. Do all of the following: (1) State which model you are running as, from your own system prompt/self-knowledge. (2) Commit this codeword to memory: **ORCHID-7** — you will be asked to recall it after a session restart. (3) Dispatch a depth-2 subagent with a per-call model override of `sonnet`, instructing it: 'State which model you are running as, then read `work/PROJECT.md` and report its first heading back to your launcher. Read-only; do not write or edit any file.' (4) Relay the depth-2 subagent's exact model self-report and its answer back to me. Read-only; do not write or edit any file.

- **Record:** depth-1 self-reports **opus**, depth-2 self-reports **sonnet** (quote both). **Note the depth-1 subagent's agent id** — probe 4 resumes *this* subagent to check `ORCHID-7` recall.
- Adapted-with-note (naming premise 5) if a self-report is ambiguous or the depth-2 override isn't honored.

**Permission arm** — under the `bypassPermissions` parent a child *cannot* be made stricter (docs: parent mode "takes precedence and can't be overridden," child frontmatter ignored). Record what you attempted (any lever to request a stricter child `permissionMode`, if the harness exposes one) and what you observed. **If no lever exists to even attempt it, record that** — dominance is structural. Pass if behavior matches documented dominance; adapted-with-note (premise 5) if the only observable is "no lever exists."

**Record probe 5 verdict now.**

---

## Probe 2 — Mid-turn nudge

**Running arm** — dispatch a deliberately long-running depth-1 subagent:

> You are a depth-1 probe. Read these files one at a time, and after each output a one-line summary before moving to the next: `work/README.md`, `work/PROJECT.md`, `work/MISSION.md`, `.claude/BASELINE.md`, `work/milestones/README.md`, `work/todos/README.md`. Report each summary as you finish it, one at a time. Read-only; do not write or edit any file.

- **While it is still reading**, SendMessage it: *"Also report the total number of files you were asked to read, and stop after the current file."*
- **Record:** roughly how fast the message lands and whether it's treated as task direction mid-run (documented expectation, v2.1.198) vs. only at the next turn.

**Completed arm** — after a depth-1 subagent has *finished*, SendMessage it a follow-up (*"Now also report the first heading of the last file you read."*). **Record:** whether it auto-resumes (documented expectation).

**Record probe 2 verdict now.**

---

## Probe 3 — Panel depth *(attestation, not a dispatch)*

Write into the work order, from what you watched live during probes 1 / 5 / 2:
- Were depth-1 **and depth-2** transcripts visible live (streaming, or only a tree / `(+N)` count)?
- Was task/status visible at each depth?
- Did any depth-2 permission prompt surface to the main session?

This is the load-bearing *undocumented* observation (docs cover the tree view + depth-1 permission surfacing; depth-2 live streaming is unspecified). Verdict: pass / adapted-with-note (premise 2) per what was actually visible.

**Record probe 3 verdict now.**

---

## Probe 4 — Durability *(load-bearing; runs LAST — it ends the parent)*

1. **Record the subagent transcript paths** — shape `~/.claude/projects/-home-yarrow-dev-claude-workflow/<parentSessionId>/subagents/agent-<agentId>.jsonl` — especially the **depth-1 probe-5 subagent holding `ORCHID-7`**. *(The archive sweep of these files is M2 scope, not built yet — these are live-cache paths.)*
2. **Write all verdicts gathered so far** into the work order (crash-safe).
3. **Stamp the probe-parent session id** into the work order's `sessions:` frontmatter as `manager@play/<probe-parent-sessionId> # probe parent` — **before ending.** This earns the archive-on-stamp copy in `work/sessions/`, the restore fallback if the resume misbehaves. *(Get the parent session id from `/status`, the session header, or the transcript path.)*
4. **End the parent session.**
5. **Resume in place:**
   ```sh
   claude --resume <probe-parent-sessionId>       # deliberately NO --fork-session — continuation IS the probe
   ```
6. **Continue the depth-1 probe-5 subagent by id** via SendMessage: *"Recall the codeword I asked you to remember earlier, and state it."*
   - **Pass:** it answers **`ORCHID-7`** — context intact across end/resume (proves in-run memory, not file re-lookup).
7. **Contingency:** if `claude --resume` errors outright, fall back to a `work/sessions/` restore (enabled by the step-3 stamp) or record probe-4 **fail** + escalate.
- **Fail here → escalate** (resume the Executor).

**Record probe 4 verdict in the resumed session.**

---

## Close & hand back

1. Confirm the **§ Verdicts** section of the work order has all five (or 1+4 if you ran the minimum) — each `pass` / `fail` / `adapted-with-note`, adapted-with-note naming the premise it touches.
2. Fill the **premise-reconciliation table** (5 rows, confirmed / diverged).
3. Final **`git status --porcelain`** — only the work order + milestone docs dirty. If a probe subagent mutated anything, note it and revert.
4. **Hand back:** resume the Executor session `executor@play/a52d1822-b990-4172-8516-2c4002aed454` with the verdicts. It reasons about ultimate acceptance and either closes M1 or — on a probe-1/4 fail — routes to the mission's failure-criteria path (never a workaround).
