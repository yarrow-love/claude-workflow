/**
 * channel — a bounded, held-open `claude -p` stream-json channel primitive.
 *
 *   import { openChannel } from "./channel.ts";
 *   const ch = openChannel({ repoRoot, vehicleId, rawLogPath, stderrLogPath });
 *   ch.sendTurn("hello");
 *   await ch.waitFor((e) => e.type === "result", 120_000);
 *   ch.end();
 *   await ch.exited;
 *
 * Mission v4.token-efficiency, milestone 1.spike phase 1 apparatus — spike, not
 * product. The spawn mirrors `.claude/bin/consult`'s five-layer read-only
 * construction; that script is the canonical statement of the boundary and this
 * file must not invent a second one. The deltas over `consult` are the streaming
 * ones (no positional prompt, both stream-json format flags, `--verbose`) plus a
 * mandatory `--fork-session` and an explicitly pinned `--model`.
 *
 * Three bun spawn mechanics carry this file, none with in-repo precedent — all
 * four `.claude/bin/` scripts are `spawnSync`:
 *   1. stdin is a FileSink: every write MUST be followed by flush(), or turn N+1
 *      silently never reaches the child. The two are coupled in writeLine below
 *      so no caller can forget them.
 *   2. EOF comes from stdin.end() only, never from kill() — a signal without a
 *      closed pipe muddies the clean-exit evidence.
 *   3. stdout AND stderr must be drained concurrently with the exit promise or
 *      the OS pipe buffer deadlocks. Both pumps start at spawn, structurally
 *      before any write and before anything awaits exit.
 */
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

// Copied VERBATIM from `.claude/bin/consult` on 26-07-28, source commit 3e9833d.
// Record drift, do not repair it (phase 1 acceptance criterion 7): reconciling
// this list against a newer harness registry is M2/M3's, and a divergent copy
// here would make the spike measure a boundary the product does not have.
// `consult`'s own rationale — why deny is load-bearing rather than belt, and why
// the deferred/built-in tool class is name-deny-only because the allowlist does
// not default-deny it — lives in that file's comment above the same array.
const DENY = [
  // classic mutation / shell / web
  "Edit", "Write", "NotebookEdit", "Bash", "WebFetch", "WebSearch",
  // subagent launchers + orchestration (route-around via a delegated child that
  // could carry its own tool grants). Skill is kept: it only injects read-only
  // instructions, and any tool a skill invokes is still gated by this deny.
  "Task", "Agent", "Workflow",
  // worktree / branch escape — real git mutation
  "EnterWorktree", "ExitWorktree",
  // background-task fleet
  "TaskCreate", "TaskStop", "TaskUpdate", "TaskGet", "TaskList", "TaskOutput",
  // messaging / scheduling / outward signalling (whole Cron family, incl. the read)
  "SendMessage", "RemoteTrigger", "PushNotification", "ScheduleWakeup",
  "CronCreate", "CronDelete", "CronList", "DesignSync", "Monitor",
  // plan-mode transitions
  "EnterPlanMode", "ExitPlanMode",
  // publishing (outward-facing web)
  "Artifact",
  // read-only MCP resource tools — moot under --strict-mcp-config, denied anyway
  "ReadMcpResourceTool", "ListMcpResourcesTool",
];

export { DENY };

export type ChannelEvent = Record<string, any>;

export interface ChannelOptions {
  /** Repo root; the child's cwd, and the repo the vehicle transcript must belong to. */
  repoRoot: string;
  /** Transcript uuid to resume-FORK. Never resumed in place. */
  vehicleId: string;
  /** Raw stdout tee. Written before any parse attempt. */
  rawLogPath: string;
  /** Raw stderr tee. */
  stderrLogPath: string;
  /** Pinned explicitly on every spawn — see buildChannelCommand. */
  model?: string;
  /** Called on each parse failure. Non-fatal by construction; evidence survives in the tee. */
  onParseError?: (line: string, err: unknown) => void;
}

export interface ChannelHandle {
  readonly pid: number;
  readonly cmd: string[];
  readonly rawLogPath: string;
  readonly stderrLogPath: string;
  /** Live array of every parsed stdout event, in arrival order. */
  readonly events: ChannelEvent[];
  /** Lines the stdout pump could not parse. Never fatal; kept as evidence. */
  readonly parseErrors: { line: string; error: string }[];
  /** Child's exit code, or null while it is still alive — the liveness assertion. */
  readonly exitCode: number | null;
  /** True once the child has exited by any route. */
  readonly unclean: boolean;
  /** Send one user turn in the default SDKUserMessage-lead shape. Returns what was written. */
  sendTurn(text: string): ChannelEvent;
  /** Send an arbitrary pre-built stdin object — for wire-shape discovery. Same write+flush coupling. */
  sendRaw(msg: ChannelEvent): ChannelEvent;
  /** Consume the next unconsumed event. Resolves null on timeout or once the channel has settled. */
  nextEvent(timeoutMs?: number): Promise<ChannelEvent | null>;
  /** Consume forward until predicate matches. Shares nextEvent's cursor, so successive
   *  waits for the same signal do not re-match a previous turn's event. */
  waitFor(pred: (ev: ChannelEvent) => boolean, timeoutMs?: number): Promise<ChannelEvent | null>;
  /** EOF. stdin.end() only — the sole clean-death route. */
  end(): void;
  /** Last-resort only; marks the run unclean. See the comment at the implementation. */
  kill(): void;
  /** Resolves with the exit code after BOTH pumps have drained and the child has exited. */
  exited: Promise<number>;
}

/**
 * The command array. Mirrors `.claude/bin/consult`'s ordering discipline: the
 * variadic list flags come before anything positional — and here there IS no
 * positional, because turns ride stdin.
 *
 * `--model` is NOT one of the five read-only layers; it is a separate defaulted
 * flag in `consult`, so "reproduce the five layers" would leave it unset and the
 * child would fall back to the invoking user's default. The prompt cache keys on
 * the byte-exact prefix and system-prompt content varies with model, so an
 * unpinned model would make phase 2's matrix compare different prefixes while
 * believing it measures one.
 *
 * `--fork-session` is mandatory: without it, resume continues the transcript in
 * place and mutates a real session's recorded history. The spike never writes
 * into a transcript it did not create.
 */
export function buildChannelCommand(vehicleId: string, model = "fable"): string[] {
  const settings = JSON.stringify({
    permissions: { defaultMode: "dontAsk", deny: DENY },
    // Hooks run OUTSIDE the permission layers — without this, the repo's own
    // SessionEnd → session-archive and Stop → commit-guard fire inside a
    // supposedly read-only child.
    disableAllHooks: true,
  });
  return [
    "claude",
    "-p",
    "--resume",
    vehicleId,
    "--fork-session",
    "--model",
    model,
    "--settings",
    settings,
    "--strict-mcp-config",
    "--mcp-config",
    '{"mcpServers":{}}',
    "--allowedTools",
    "Read,Grep,Glob",
    "--disallowedTools",
    DENY.join(","),
    "--permission-mode",
    "dontAsk",
    "--verbose",
    "--input-format",
    "stream-json",
    "--output-format",
    "stream-json",
  ];
}

/** The default candidate stdin shape: the SDK's SDKUserMessage lead. */
export function userTurn(text: string): ChannelEvent {
  return { type: "user", message: { role: "user", content: [{ type: "text", text }] } };
}

export function openChannel(opts: ChannelOptions): ChannelHandle {
  const cmd = buildChannelCommand(opts.vehicleId, opts.model ?? "fable");

  mkdirSync(dirname(opts.rawLogPath), { recursive: true });
  mkdirSync(dirname(opts.stderrLogPath), { recursive: true });
  const rawSink = Bun.file(opts.rawLogPath).writer();
  const errSink = Bun.file(opts.stderrLogPath).writer();

  const proc = Bun.spawn(cmd, {
    cwd: opts.repoRoot,
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
  });

  const events: ChannelEvent[] = [];
  const parseErrors: { line: string; error: string }[] = [];
  let cursor = 0;
  let settled = false;
  let unclean = false;
  let stdinClosed = false;

  let wakers: (() => void)[] = [];
  const notify = () => {
    const pending = wakers;
    wakers = [];
    for (const w of pending) w();
  };
  // Resolves on the next event, on settle, or after ms — whichever comes first.
  const wake = (ms: number) =>
    new Promise<void>((resolve) => {
      let done = false;
      const fire = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve();
      };
      const timer = setTimeout(fire, ms);
      wakers.push(fire);
    });

  // Both pumps are started HERE, at spawn — structurally before any write and
  // before anything awaits exit. Draining stdout alone is not enough: --verbose
  // plus the per-turn cosmetic "matches no known tool" warnings fill stderr, and
  // an undrained stderr pipe deadlocks the child just as surely.
  const pumpStdout = (async () => {
    const decoder = new TextDecoder();
    let pending = "";
    const consume = (line: string) => {
      if (!line.trim()) return;
      try {
        events.push(JSON.parse(line));
        notify();
      } catch (err) {
        // Tee-before-parse means the evidence already survives on disk; a parse
        // failure is logged and skipped, never fatal.
        parseErrors.push({ line, error: String(err) });
        opts.onParseError?.(line, err);
      }
    };
    for await (const chunk of proc.stdout as ReadableStream<Uint8Array>) {
      rawSink.write(chunk);
      rawSink.flush();
      pending += decoder.decode(chunk, { stream: true });
      let nl: number;
      while ((nl = pending.indexOf("\n")) >= 0) {
        consume(pending.slice(0, nl));
        pending = pending.slice(nl + 1);
      }
    }
    pending += decoder.decode();
    consume(pending);
  })();

  const pumpStderr = (async () => {
    for await (const chunk of proc.stderr as ReadableStream<Uint8Array>) {
      errSink.write(chunk);
      errSink.flush();
    }
  })();

  const exited = (async () => {
    const [, , code] = await Promise.all([pumpStdout, pumpStderr, proc.exited]);
    settled = true;
    notify();
    await rawSink.end();
    await errSink.end();
    return code;
  })();

  // The single write path. write() and flush() are coupled unconditionally here
  // because bun's stdin is a FileSink: an unflushed write means the child never
  // sees the turn, and the failure looks exactly like a slow model.
  const writeLine = (msg: ChannelEvent): ChannelEvent => {
    if (stdinClosed) throw new Error("channel stdin is closed — cannot send after end()");
    proc.stdin.write(JSON.stringify(msg) + "\n");
    proc.stdin.flush();
    return msg;
  };

  const nextEvent = async (timeoutMs = 120_000): Promise<ChannelEvent | null> => {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
      if (cursor < events.length) return events[cursor++]!;
      if (settled) return null;
      const left = deadline - Date.now();
      if (left <= 0) return null;
      await wake(left);
    }
  };

  return {
    get pid() {
      return proc.pid;
    },
    cmd,
    rawLogPath: opts.rawLogPath,
    stderrLogPath: opts.stderrLogPath,
    events,
    parseErrors,
    get exitCode() {
      return proc.exitCode;
    },
    get unclean() {
      return unclean;
    },
    sendTurn: (text: string) => writeLine(userTurn(text)),
    sendRaw: (msg: ChannelEvent) => writeLine(msg),
    nextEvent,
    waitFor: async (pred, timeoutMs = 120_000) => {
      const deadline = Date.now() + timeoutMs;
      for (;;) {
        const left = deadline - Date.now();
        if (left <= 0) return null;
        const ev = await nextEvent(left);
        if (ev === null) return null;
        if (pred(ev)) return ev;
      }
    },
    end: () => {
      if (stdinClosed) return;
      stdinClosed = true;
      proc.stdin.end();
    },
    // The ONLY kill path, reserved for a last-resort timeout, and it taints the
    // run's clean-death evidence. It signals THIS exact captured process handle.
    // Never pkill, never killall, never any name- or path-substring match: a
    // session whose prompt embeds a path can match its own command line and kill
    // itself. That rule is universal in this repo.
    kill: () => {
      unclean = true;
      proc.kill();
    },
    exited,
  };
}
