#!/usr/bin/env bun
/**
 * spike-run — driver for the milestone 1.spike phase 1 channel experiment.
 *
 *   bun work/milestones/1.spike/harness/spike-run.ts <uuid> [--observe|--postmortem] [--dry]
 *
 * Owns preflight, turn choreography, transcript sampling, the structured run
 * log, and teardown; `channel.ts` owns the spawn and the stdin discipline.
 *
 * The vehicle transcript id is ALWAYS an explicit argument. The harness must not
 * auto-select "the largest transcript": no documented mechanism exposes a
 * session's own id to a script it invokes, so the exclusion cannot be
 * implemented safely and a buggy one could fork the hosting session's live
 * transcript. An absent vehicle is an escalation, never a substitution.
 *
 * exit codes:
 *   0  ran (or --dry)
 *   1  usage / malformed argument
 *   2  --observe only: NO candidate stdin shape was accepted — no candidate
 *      elicited an assistant answer. Not a harness fault: this is the criterion-5
 *      refutation candidate, and the per-candidate tees carry the evidence.
 *   3  vehicle transcript absent — escalate, do not substitute another session
 *   4  repo mismatch — the transcript belongs to another repo
 *   5  a charter failure criterion (4 live append, 5 event wire, 7 boundary) did
 *      not hold, or --postmortem's resume produced no answer. The run COMPLETED
 *      and the refuting evidence is in the run log — a refutation is a successful
 *      phase outcome, so this code means "read the verdict", not "the harness
 *      broke".
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { buildChannelCommand, openChannel, type ChannelEvent } from "./channel.ts";

const repoRoot = (() => {
  const r = spawnSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : process.cwd();
})();
const slug = resolve(repoRoot).replace(/[^a-zA-Z0-9]/g, "-");
const projectDir = join(process.env.HOME!, ".claude", "projects", slug);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const MODEL = "fable";

const usage = () => {
  console.error(
    "usage: spike-run <uuid> [--observe|--postmortem] [--dry]\n" +
      "  <uuid>          transcript to resume-FORK; must exist locally and belong to this repo\n" +
      "  --observe       single-turn probe mode (wire-shape discovery)\n" +
      "  --postmortem    one-shot -p resume-fork of an ALREADY-DEAD channel session (criterion 6)\n" +
      "  --dry           print the resolved command array and exit without spawning"
  );
};

const args = process.argv.slice(2);
if (args.length === 0) {
  usage();
  process.exit(1);
}

const flags = args.filter((a) => a.startsWith("--"));
const unknown = flags.filter((a) => a !== "--dry" && a !== "--observe" && a !== "--postmortem");
if (unknown.length) {
  console.error(`unknown flag(s): ${unknown.join(", ")}`);
  usage();
  process.exit(1);
}
const dry = flags.includes("--dry");
const observe = flags.includes("--observe");
const postmortem = flags.includes("--postmortem");
if (observe && postmortem) {
  console.error("--observe and --postmortem are mutually exclusive");
  usage();
  process.exit(1);
}
// Exactly one positional. Silently taking the first of several would let a
// mistyped invocation resume a transcript the caller did not mean to name.
const positional = args.filter((a) => !a.startsWith("--"));
if (positional.length > 1) {
  console.error(`unexpected extra argument(s): ${positional.slice(1).join(", ")} — exactly one <uuid> is accepted`);
  usage();
  process.exit(1);
}
const vehicleId = positional[0];

if (!vehicleId || !UUID.test(vehicleId)) {
  console.error(vehicleId ? `not a session uuid: ${vehicleId}` : "missing <vehicle-uuid>");
  usage();
  process.exit(1);
}

// --- preflight -------------------------------------------------------------

const vehiclePath = join(projectDir, `${vehicleId}.jsonl`);
if (!existsSync(vehiclePath)) {
  console.error(
    `escalate: vehicle transcript ${vehicleId} is absent from ${projectDir}.\n` +
      `The spike requires a real large transcript. Do NOT substitute another session and do NOT\n` +
      `auto-select the largest one — an unsafe exclusion could fork the hosting session's live\n` +
      `transcript. Report the absence to the Executor (milestone 1.spike phase 1, decision 1).`
  );
  process.exit(3);
}

// The transcript's recorded cwd is the first line carrying a `cwd` field — NOT
// the first parseable line: transcripts lead with cwd-less mode/summary entries.
// Copied from `.claude/bin/consult`'s repo-binding guard.
const transcriptCwd = (buf: Buffer): string | null => {
  for (const line of buf.toString("utf8").split("\n")) {
    if (!line) continue;
    try {
      const o = JSON.parse(line);
      if (typeof o.cwd === "string") return o.cwd;
    } catch {
      /* skip unparseable line */
    }
  }
  return null;
};

const recordedCwd = transcriptCwd(readFileSync(vehiclePath));
if (recordedCwd === null) {
  console.error(`warning: no cwd field in transcript ${vehicleId} — cannot verify repo binding; proceeding.`);
} else {
  const origin = resolve(recordedCwd);
  const here = resolve(repoRoot);
  if (origin !== here && !origin.startsWith(here + "/")) {
    console.error(
      `refuse: ${vehicleId} belongs to ${origin}, but this repo is ${here}.\n` +
        `The channel forks in place, so it may only resume a transcript from its owning repo.`
    );
    process.exit(4);
  }
}

// --- artifacts -------------------------------------------------------------

const mode = dry ? "dry" : observe ? "observe" : postmortem ? "postmortem" : "run";
const startedAt = new Date();
// Colons out of the filename; the run log keeps full-precision ISO internally.
const stamp = startedAt.toISOString().replace(/:/g, "-").replace(/\.\d+Z$/, "Z");
const spikeDir = join(repoRoot, "tmp", "spike");
mkdirSync(spikeDir, { recursive: true });
const rawLogPath = join(spikeDir, `${stamp}.${mode}.stream.jsonl`);
const stderrLogPath = join(spikeDir, `${stamp}.${mode}.stderr.log`);
const runLogPath = join(spikeDir, `${stamp}.${mode}.run.json`);

const cmd = buildChannelCommand(vehicleId, MODEL);

if (dry) {
  const quote = (c: string) => (/[\s"{}]/.test(c) ? JSON.stringify(c) : c);
  console.log(`ready: vehicle transcript present at ${vehiclePath}`);
  console.log(`artifacts: ${rawLogPath}`);
  console.log(`           ${stderrLogPath}`);
  console.log(`           ${runLogPath}`);
  console.log(`would run (cwd ${repoRoot}): ${cmd.map(quote).join(" ")}`);
  console.log(JSON.stringify(cmd, null, 2));
  process.exit(0);
}

// --- the structured run log ------------------------------------------------
//
// THE evidence artifact. Rewritten in full after every entry, so a crashed or
// killed run still leaves everything recorded up to that instant.
//
// Entry kinds and their payloads (extend, do not rename — phase E reads these):
//   spawn   { pid, cmd }                                        apiCall
//   turn    { index, shape, text, sentAt, respondedAt }         apiCall
//   probe   { index, probe: "write" | "shell", text, … }        apiCall
//   resume  { targetSessionId, question, answer, usage, … }     apiCall
//   sample  { label, path, bytes, lines, alive, exitCode }
//   eof     { }
//   exit    { code, unclean }
//   note    { text, data? }                                     apiCall on request
//
// `apiCall: true` marks every entry that transmitted the vehicle prefix — the
// set acceptance criterion 12's last-touch is the MAXIMUM over. Abandoned
// wire-shape candidate spawns are in that set too, which is why they must be
// logged here and not only in the raw tee. `lastApiTouch` is maintained
// automatically so no later reader has to recompute it by hand.
//
// A `note` can opt IN by passing `apiCall: true` explicitly — the escape hatch
// for a best-effort side call that is normally not a touch but might become one
// (the criterion-8 picker check below).
//
// The stamp CONVENTION for an apiCall entry is the RESPONSE instant, not the
// send instant. A turn can run 180–240 s, and criterion 12's error bar is
// asymmetric: an over-late last-touch only lengthens phase 2's cooldown wait,
// while an over-early one silently corrupts the cold baseline every ratio is
// computed against. Send instants are kept alongside (`sentAt`) for latency
// analysis, never as the touch. Consequence: `entries` stays in the order things
// HAPPENED, so `ts` is not monotonic across it — an entry logged while a turn was
// in flight carries an earlier `ts` than the turn entry that precedes it. Sort by
// `ts` before reading it as a timeline; `lastApiTouch` is already a maximum.

const API_KINDS = new Set(["spawn", "turn", "probe", "resume"]);

type RunEntry = { ts: string; kind: string; apiCall?: true; [k: string]: unknown };

const runLog: {
  schemaVersion: number;
  mission: string;
  phase: string;
  mode: string;
  startedAt: string;
  endedAt: string | null;
  repoRoot: string;
  vehicleId: string;
  vehiclePath: string;
  model: string;
  cmd: string[];
  channelSessionId: string | null;
  channelTranscriptPath: string | null;
  rawLogPath: string;
  stderrLogPath: string;
  exitCode: number | null;
  unclean: boolean;
  lastApiTouch: string | null;
  entries: RunEntry[];
} = {
  schemaVersion: 1,
  mission: "v4.token-efficiency",
  phase: "milestone 1.spike / phase 1 — channel",
  mode,
  startedAt: startedAt.toISOString(),
  endedAt: null,
  repoRoot,
  vehicleId,
  vehiclePath,
  model: MODEL,
  cmd,
  channelSessionId: null,
  channelTranscriptPath: null,
  rawLogPath,
  stderrLogPath,
  exitCode: null,
  unclean: false,
  lastApiTouch: null,
  entries: [],
};

const flushRunLog = () => writeFileSync(runLogPath, JSON.stringify(runLog, null, 2) + "\n");

/** lastApiTouch is a MAXIMUM, never an assignment: entries whose stamp is
 *  corrected forward to the response instant must not be able to move it back. */
const touchApi = (ts: string) => {
  if (runLog.lastApiTouch === null || ts > runLog.lastApiTouch) runLog.lastApiTouch = ts;
};

const logEntry = (kind: string, fields: Record<string, unknown> = {}): RunEntry => {
  const entry: RunEntry = { ts: new Date().toISOString(), kind, ...fields };
  if (API_KINDS.has(kind) || entry.apiCall === true) {
    entry.apiCall = true;
    touchApi(entry.ts);
  }
  runLog.entries.push(entry);
  flushRunLog();
  return entry;
};

/** Byte size + line count of a transcript, with the liveness assertion criterion 4 requires. */
const sampleTranscript = (label: string, path: string, exitCode: number | null): RunEntry => {
  const present = existsSync(path);
  return logEntry("sample", {
    label,
    path,
    bytes: present ? statSync(path).size : null,
    lines: present ? readFileSync(path, "utf8").split("\n").filter(Boolean).length : null,
    alive: exitCode === null,
    exitCode,
  });
};

/** The channel's OWN transcript — derived from the forked id, never the vehicle's. */
const channelTranscriptPath = (sessionId: string) => join(projectDir, `${sessionId}.jsonl`);

flushRunLog();

// --- modes -----------------------------------------------------------------

if (postmortem) {
  // Acceptance criterion 6, second half: after the channel process is dead, does
  // its transcript survive and resume? The <uuid> here is the CHANNEL's captured
  // id, not the vehicle's — resuming the vehicle would prove nothing.
  //
  const sessionUuid = vehicleId;
  //
  // The five-layer read-only construction plus --model fable is carried verbatim
  // from buildChannelCommand. Criterion 6's "…" means the BOUNDED construction:
  // an unbounded process resumed against a real transcript is exactly what that
  // construction exists to prevent, and holding the flags identical keeps this
  // cache touch on the same byte-exact prefix regime phase 2 will measure. Only
  // --input-format is dropped — this is a one-shot -p with a positional prompt,
  // not a stream-json channel. Output stays stream-json (+ --verbose, which -p
  // requires for it) so the forked session id is readable off system/init and
  // `usage` off the result event.
  const pmCmd = (() => {
    const base = buildChannelCommand(sessionUuid, MODEL);
    const i = base.indexOf("--input-format");
    return base.slice(0, i).concat(base.slice(i + 2));
  })();

  const QUESTION =
    "What exact strings were you asked to reply with, in order, and what two tool actions were you asked to perform that you could not?";
  pmCmd.push(QUESTION);

  logEntry("note", { text: "postmortem resume-fork of an already-dead channel session", data: { targetSessionId: sessionUuid, question: QUESTION, cmd: pmCmd } });

  // Wall clock is stamped around the spawn itself, not around the log write:
  // criterion 12's last-touch is the maximum over every API call this phase made,
  // and this resume re-warms the vehicle prefix AFTER the boundary probes.
  const requestedAt = new Date().toISOString();
  const proc = spawnSync(pmCmd[0]!, pmCmd.slice(1), {
    cwd: repoRoot,
    input: "",
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  const respondedAt = new Date().toISOString();

  writeFileSync(rawLogPath, proc.stdout ?? "");
  writeFileSync(stderrLogPath, proc.stderr ?? "");

  const events: ChannelEvent[] = [];
  for (const line of (proc.stdout ?? "").split("\n")) {
    if (!line.trim()) continue;
    try {
      events.push(JSON.parse(line));
    } catch (err) {
      console.error(`parse error: ${line.slice(0, 200)}`);
    }
  }
  const init = events.find((e) => e.type === "system" && e.subtype === "init");
  const result = events.find((e) => e.type === "result");
  const answer = typeof result?.result === "string" ? result.result : null;

  const entry = logEntry("resume", {
    targetSessionId: sessionUuid,
    question: QUESTION,
    requestedAt,
    respondedAt,
    forkedSessionId: (result?.session_id ?? init?.session_id ?? null) as string | null,
    exitCode: proc.status,
    answer,
    eventTypes: events.map((e) => (e.subtype ? `${e.type}/${e.subtype}` : String(e.type))),
    usage: result?.usage ?? null,
    totalCostUsd: result?.total_cost_usd ?? null,
    numTurns: result?.num_turns ?? null,
    durationMs: result?.duration_ms ?? null,
    isError: result?.is_error ?? null,
    tools: init?.tools ?? null,
    permissionMode: init?.permissionMode ?? null,
  });
  // The API touch is the RESPONSE instant, not the log-write instant.
  entry.ts = respondedAt;
  touchApi(respondedAt);
  runLog.channelSessionId = sessionUuid;
  runLog.channelTranscriptPath = channelTranscriptPath(sessionUuid);
  runLog.exitCode = proc.status;
  runLog.endedAt = new Date().toISOString();
  flushRunLog();

  console.error(`\npostmortem complete. run log: ${runLogPath}`);
  console.error(`  target session  : ${sessionUuid}`);
  console.error(`  forked session  : ${result?.session_id ?? init?.session_id ?? "(none)"}`);
  console.error(`  requested at    : ${requestedAt}`);
  console.error(`  responded at    : ${respondedAt}`);
  console.error(`  exit            : ${proc.status}`);
  console.error(`  cost usd        : ${result?.total_cost_usd ?? "(none)"}`);
  console.error(`  usage           : ${JSON.stringify(result?.usage ?? null)}`);
  console.error(`\n--- answer verbatim ---\n${answer ?? "(no result event)"}\n--- end answer ---`);
  process.exit(answer ? 0 : 5);
}

if (observe) {
  // Discovery stage 1. The stdin wire shape is undocumented for the CLI, so this
  // mode tries candidate shapes ONE FRESH SPAWN EACH — never two shapes down one
  // stdin, which would make it impossible to attribute what elicited what.
  //
  // There is deliberately no TURN_END predicate here: the completion signal is
  // what this mode exists to discover, so accumulation is bounded by wall clock,
  // not by an event. The idle cutoff below only fires once at least one event has
  // arrived, so the "no event wire at all" case still burns the full wall clock
  // and its silence lands in the log as evidence rather than as an early exit.

  const WALL_MS = 120_000;
  const IDLE_MS = 30_000;
  const EOF_WAIT_MS = 60_000;
  const TURN_TEXT = "Reply with exactly: TURN-1-OK";

  interface Candidate {
    label: string;
    /** Shapes carrying the child's own session id must wait for the init event first. */
    needsSessionId?: true;
    build: (text: string, sessionId: string | null) => Record<string, unknown>;
  }

  const candidates: Candidate[] = [
    // The Agent SDK's SDKUserMessage lead, content as a block array.
    {
      label: "c1-sdk-content-array",
      build: (text) => ({ type: "user", message: { role: "user", content: [{ type: "text", text }] } }),
    },
    // Same envelope, content as a bare string (both appear in SDK docs).
    {
      label: "c2-string-content",
      build: (text) => ({ type: "user", message: { role: "user", content: text } }),
    },
    // Only reached if a child error names the missing fields — never guessed blindly.
    {
      label: "c3-sdk-plus-ids",
      needsSessionId: true,
      build: (text, sessionId) => ({
        type: "user",
        session_id: sessionId,
        message: { role: "user", content: [{ type: "text", text }] },
        parent_tool_use_id: null,
      }),
    },
  ];

  const outcomes: Record<string, unknown>[] = [];

  const runCandidate = async (cand: Candidate, index: number) => {
    // Per-candidate tees: a shared raw log across spawns would confound exactly
    // what one-spawn-per-candidate exists to keep separate.
    const rawPath = join(spikeDir, `${stamp}.observe.${cand.label}.stream.jsonl`);
    const errPath = join(spikeDir, `${stamp}.observe.${cand.label}.stderr.log`);

    const ch = openChannel({
      repoRoot,
      vehicleId,
      rawLogPath: rawPath,
      stderrLogPath: errPath,
      model: MODEL,
      onParseError: (line) => console.error(`parse error: ${line.slice(0, 200)}`),
    });
    // Logged BEFORE anything can fail: an abandoned candidate spawn still
    // transmitted the vehicle prefix, and criterion 12's last-touch is the
    // maximum over every API call this phase made, not only the accepted one.
    logEntry("spawn", { candidate: cand.label, pid: ch.pid, cmd: ch.cmd, rawLogPath: rawPath, stderrLogPath: errPath });
    console.error(`[${cand.label}] spawned pid ${ch.pid} → ${rawPath}`);

    // Read history rather than nextEvent/waitFor: those share one consumption
    // cursor, and this mode wants the whole stream, repeatedly, undrained.
    const sessionIdFromEvents = () => {
      const ev = ch.events.find((e) => typeof e.session_id === "string");
      return ev ? (ev.session_id as string) : null;
    };

    const captureSessionId = (when: string): string | null => {
      const sessionId = sessionIdFromEvents();
      if (sessionId && runLog.channelSessionId !== sessionId) {
        const init = ch.events.find((e) => e.type === "system" && e.subtype === "init") ?? ch.events[0];
        logEntry("note", {
          text: `session id observed ${when}`,
          data: { candidate: cand.label, sessionId, from: init?.type, subtype: init?.subtype },
        });
        runLog.channelSessionId = sessionId;
        runLog.channelTranscriptPath = channelTranscriptPath(sessionId);
      }
      return sessionId;
    };

    // OBSERVED 26-07-28 against the 6.5 MB vehicle: no stdout event — not even
    // system/init — arrived in the first 30 s after spawn; init landed only once
    // the first stdin turn had been written. A driver that BLOCKS on init before
    // sending turn 1 therefore stalls for its whole init timeout. Turn 1 goes out
    // first and the id is read off the stream afterwards.
    let sessionId: string | null = null;
    if (cand.needsSessionId) {
      const initDeadline = Date.now() + 30_000;
      while (Date.now() < initDeadline) {
        sessionId = captureSessionId("before turn 1");
        if (sessionId || ch.exitCode !== null) break;
        await Bun.sleep(250);
      }
    }

    let sent: Record<string, unknown> | null = null;
    if (cand.needsSessionId && !sessionId) {
      logEntry("note", { text: "candidate skipped: needs a session id and none was observed", data: { candidate: cand.label } });
    } else if (ch.exitCode !== null) {
      logEntry("note", { text: "child exited before a turn could be sent", data: { candidate: cand.label, exitCode: ch.exitCode } });
    } else {
      sent = cand.build(TURN_TEXT, sessionId);
      ch.sendRaw(sent);
      logEntry("turn", { index: 1, candidate: cand.label, shape: cand.label, text: TURN_TEXT, sent });
    }

    const deadline = Date.now() + WALL_MS;
    let seen = ch.events.length;
    let lastChange = Date.now();
    while (Date.now() < deadline && ch.exitCode === null) {
      await Bun.sleep(500);
      if (ch.events.length !== seen) {
        seen = ch.events.length;
        lastChange = Date.now();
      } else if (seen > 0 && Date.now() - lastChange > IDLE_MS) break;
    }

    captureSessionId("after turn 1");
    logEntry("eof", { candidate: cand.label, eventsAtEof: ch.events.length });
    ch.end();
    const eofAt = Date.now();
    const raced = await Promise.race([ch.exited, Bun.sleep(EOF_WAIT_MS).then(() => null)]);
    if (raced === null) {
      logEntry("note", { text: `child did not exit within ${EOF_WAIT_MS}ms of EOF; last-resort kill on the captured handle`, data: { candidate: cand.label } });
      ch.kill();
    }
    const code = await ch.exited;
    const exitMs = Date.now() - eofAt;
    logEntry("exit", { candidate: cand.label, code, unclean: ch.unclean, exitMs });

    const types = [...new Set(ch.events.map((e) => String(e.type ?? "<no type>")))];
    const accepted = ch.events.some((e) => e.type === "assistant");
    logEntry("note", {
      text: `candidate ${cand.label}: ${accepted ? "ACCEPTED" : "rejected/silent"}`,
      data: { candidate: cand.label, eventCount: ch.events.length, eventTypes: types, parseErrors: ch.parseErrors.length },
    });

    runLog.rawLogPath = rawPath;
    runLog.stderrLogPath = errPath;
    runLog.exitCode = code;
    runLog.unclean = ch.unclean;
    flushRunLog();

    const stderrText = existsSync(errPath) ? readFileSync(errPath, "utf8") : "";
    outcomes.push({ index, candidate: cand.label, accepted, exitCode: code, unclean: ch.unclean, exitMs, eventCount: ch.events.length, eventTypes: types, sessionId, rawLogPath: rawPath, stderrLogPath: errPath });
    console.error(`[${cand.label}] ${accepted ? "ACCEPTED" : "rejected/silent"} — ${ch.events.length} events ${JSON.stringify(types)}, exit ${code} after ${exitMs}ms`);

    return { accepted, evidence: stderrText + "\n" + ch.events.map((e) => JSON.stringify(e)).join("\n") + "\n" + ch.parseErrors.map((p) => p.line).join("\n") };
  };

  // Candidate 3 is conditional by design: it is tried only when the child's own
  // error names the fields it wants. Guessing extra fields blindly would spend a
  // vehicle-prefix API call on a shape nothing suggested.
  const NAMES_MISSING_IDS = /session_?id|parent_tool_use_id/i;

  let acceptedAny = false;
  let namedIds = false;
  for (let i = 0; i < candidates.length; i++) {
    const cand = candidates[i]!;
    if (cand.needsSessionId && !namedIds) {
      logEntry("note", { text: "candidate not attempted: no child error named session_id / parent_tool_use_id", data: { candidate: cand.label } });
      continue;
    }
    const { accepted, evidence } = await runCandidate(cand, i + 1);
    if (accepted) {
      acceptedAny = true;
      break;
    }
    if (NAMES_MISSING_IDS.test(evidence)) namedIds = true;
  }

  runLog.endedAt = new Date().toISOString();
  logEntry("note", { text: acceptedAny ? "observe: a candidate shape was accepted" : "observe: NO candidate elicited an assistant answer — criterion-5 refutation candidate", data: { outcomes } });
  console.error(`\nobserve complete. run log: ${runLogPath}`);
  console.error(`last API touch: ${runLog.lastApiTouch}`);
  process.exit(acceptedAny ? 0 : 2);
}

// --- full run: discovery stage 2 (phase C) ---------------------------------
//
// ONE process carries all five turns. A cold fork of a 6.5 MB vehicle costs
// ~$4.26 and writes ~213k tokens to a 1h-ephemeral cache, so a respawn is not a
// retry — it is another cold fork. Everything below rides one stdin.
//
// The completion signal was DISCOVERED in phase B, not guessed: the observe run
// emitted system/init → assistant → rate_limit_event → result(subtype success),
// and the child stayed alive 30 s past `result` until stdin.end(). That is why
// `result` is read as a PER-TURN boundary here; whether it truly fires per turn
// is one of the things this run exists to settle, so a signal that never arrives
// surfaces as a loud bounded timeout rather than a hang.

const TURN_END = (ev: ChannelEvent) => ev.type === "result";
const TURN1_TIMEOUT_MS = 240_000; // turn 1 pays the cold transcript load
const TURN_TIMEOUT_MS = 180_000;
const INIT_WAIT_MS = 120_000;
const REPOLL_MS = 5_000; // criterion 4's bounded no-growth re-poll
const EOF_WAIT_MS = 60_000;

const PROBE_WRITE_TARGET = join(spikeDir, "probe-write-target.txt");
const PROBE_SHELL_TARGET = join(spikeDir, "probe-shell-target.txt");

const ch = openChannel({
  repoRoot,
  vehicleId,
  rawLogPath,
  stderrLogPath,
  model: MODEL,
  onParseError: (line) => console.error(`parse error: ${line.slice(0, 200)}`),
});
logEntry("spawn", { pid: ch.pid, cmd: ch.cmd });
console.error(`spawned pid ${ch.pid} → ${rawLogPath}`);

// --- session-id capture (criterion 3) --------------------------------------
//
// Read off the system/init event AS SOON AS IT ARRIVES, from a poller that scans
// event history rather than the nextEvent cursor — waitFor consumes, and turn 1's
// TURN_END wait must not be starved of the events it is walking. Phase B observed
// that init does not arrive until the first stdin turn has been written, so this
// poller runs concurrently with turn 1 instead of gating it.

let channelSessionId: string | null = null;
const captureSessionId = (): string | null => {
  if (channelSessionId) return channelSessionId;
  const init =
    ch.events.find((e) => e.type === "system" && e.subtype === "init" && typeof e.session_id === "string") ??
    ch.events.find((e) => typeof e.session_id === "string");
  if (!init) return null;
  channelSessionId = init.session_id as string;
  runLog.channelSessionId = channelSessionId;
  runLog.channelTranscriptPath = channelTranscriptPath(channelSessionId);
  logEntry("note", {
    text: "session id captured from the system/init event",
    data: {
      sessionId: channelSessionId,
      from: init.type,
      subtype: init.subtype ?? null,
      transcriptPath: runLog.channelTranscriptPath,
      tools: init.tools ?? null,
      permissionMode: init.permissionMode ?? null,
      mcp_servers: init.mcp_servers ?? null,
      model: init.model ?? null,
      cwd: init.cwd ?? null,
    },
  });
  return channelSessionId;
};
const sessionIdPoller = (async () => {
  const deadline = Date.now() + INIT_WAIT_MS;
  while (Date.now() < deadline && ch.exitCode === null) {
    if (captureSessionId()) return;
    await Bun.sleep(200);
  }
  captureSessionId();
})();

// --- turn choreography ------------------------------------------------------

interface TurnRecord {
  label: string;
  kind: "turn" | "probe";
  index: number;
  text: string;
  ok: boolean;
  answer: string;
  resultText: string | null;
  eventTypes: string[];
  /** One entry per `assistant` event — ids included because events split per
   *  content block and repeat one message's usage. Dedupe by messageId. */
  assistantUsage: { messageId: string | null; requestId: string | null; usage: unknown }[];
  resultUsage: unknown;
  totalCostUsd: number | null;
  numTurns: number | null;
  durationMs: number | null;
  permissionDenials: unknown;
  toolUses: string[];
}
const turns: TurnRecord[] = [];

const assistantTextIn = (evs: ChannelEvent[]): string =>
  evs
    .filter((e) => e.type === "assistant")
    .flatMap((e) => (Array.isArray(e.message?.content) ? (e.message.content as any[]) : []))
    .filter((c) => c && c.type === "text" && typeof c.text === "string")
    .map((c) => c.text as string)
    .join("\n");

const toolUsesIn = (evs: ChannelEvent[]): string[] =>
  evs
    .filter((e) => e.type === "assistant")
    .flatMap((e) => (Array.isArray(e.message?.content) ? (e.message.content as any[]) : []))
    .filter((c) => c && c.type === "tool_use")
    .map((c) => String(c.name));

const runTurn = async (
  kind: "turn" | "probe",
  label: string,
  index: number,
  text: string,
  timeoutMs: number,
  extra: Record<string, unknown> = {}
): Promise<TurnRecord> => {
  const from = ch.events.length;
  const sentAt = new Date().toISOString();
  const sent = ch.sendTurn(text);
  const entry = logEntry(kind, { index, label, shape: "sdk-user-content-array", text, sent, sentAt, ...extra });
  console.error(`[${label}] sent; awaiting TURN_END (type==="result")…`);

  const result = await ch.waitFor(TURN_END, timeoutMs);
  // Same convention as --postmortem: the entry's `ts` — and therefore criterion
  // 12's last-touch — is the RESPONSE instant, not the send instant. The send
  // instant survives as `sentAt` for latency analysis; nothing is lost, and the
  // touch moves in the safe (over-late) direction. On a TURN_END timeout this is
  // the timeout instant, which bounds the real touch from above just the same.
  const respondedAt = new Date().toISOString();
  entry.ts = respondedAt;
  entry.respondedAt = respondedAt;
  touchApi(respondedAt);
  flushRunLog();
  const slice = ch.events.slice(from);
  const rec: TurnRecord = {
    label,
    kind,
    index,
    text,
    ok: result !== null,
    answer: assistantTextIn(slice),
    resultText: result && typeof result.result === "string" ? result.result : null,
    eventTypes: slice.map((e) => String(e.type ?? "<no type>")),
    // One model call SPLITS ACROSS CONTENT BLOCKS — one `assistant` event per
    // block — so several events can repeat one `message.id` / `request_id` pair
    // carrying an IDENTICAL usage object. Summing these naively double-counts.
    // Nothing sums them today; the ids are captured so a later reader (phase 2's
    // matrix) can dedupe by message.id instead of having to re-run the spike.
    assistantUsage: slice
      .filter((e) => e.type === "assistant")
      .map((e) => ({
        messageId: (e.message?.id ?? null) as string | null,
        requestId: (e.request_id ?? e.message?.request_id ?? null) as string | null,
        usage: e.message?.usage ?? null,
      })),
    resultUsage: result?.usage ?? null,
    totalCostUsd: typeof result?.total_cost_usd === "number" ? result.total_cost_usd : null,
    numTurns: typeof result?.num_turns === "number" ? result.num_turns : null,
    durationMs: typeof result?.duration_ms === "number" ? result.duration_ms : null,
    permissionDenials: result?.permission_denials ?? null,
    toolUses: toolUsesIn(slice),
  };
  turns.push(rec);

  if (!result) {
    logEntry("note", {
      text: `TURN_END did not fire for ${label} within ${timeoutMs}ms — recorded as a timeout, not retried`,
      data: { label, eventTypes: rec.eventTypes, alive: ch.exitCode === null, exitCode: ch.exitCode },
    });
    console.error(`[${label}] TIMEOUT after ${timeoutMs}ms`);
  } else {
    logEntry("note", {
      text: `${label} complete`,
      data: {
        label,
        stopReason: result.stop_reason ?? null,
        terminalReason: result.terminal_reason ?? null,
        subtype: result.subtype ?? null,
        isError: result.is_error ?? null,
        numTurns: rec.numTurns,
        durationMs: rec.durationMs,
        totalCostUsd: rec.totalCostUsd,
        resultUsage: rec.resultUsage,
        assistantUsage: rec.assistantUsage,
        permissionDenials: rec.permissionDenials,
        toolUses: rec.toolUses,
        eventTypes: rec.eventTypes,
        answer: rec.answer,
        resultText: rec.resultText,
      },
    });
    console.error(`[${label}] result: ${JSON.stringify(rec.resultText ?? rec.answer).slice(0, 160)}`);
  }
  return rec;
};

const num = (v: unknown): number => (typeof v === "number" ? v : -1);

// Gate verdicts, filled by the choreography and reported whatever happens.
const verdicts: Record<string, string> = { c4: "not evaluated", c7: "not evaluated", c5: "not evaluated" };
let stopped: string | null = null;

const choreography = async () => {
  // (2) turn 1 -------------------------------------------------------------
  const t1 = await runTurn("turn", "turn-1", 1, "Reply with exactly: TURN-1-OK", TURN1_TIMEOUT_MS);
  await sessionIdPoller;
  if (!channelSessionId) {
    stopped = "no session id was ever observed — criteria 3 and 4 cannot be evaluated";
    logEntry("note", { text: `STOP: ${stopped}`, data: { eventTypes: ch.events.map((e) => String(e.type)) } });
    return;
  }
  if (!t1.ok) {
    stopped = "turn 1 never produced a result event";
    logEntry("note", { text: `STOP: ${stopped}` });
    return;
  }
  const tPath = channelTranscriptPath(channelSessionId);

  // (3) SAMPLE 1 — taken while the child is ALIVE. The liveness assertion reads
  // the exitCode GETTER on the live handle, so a stale snapshot cannot fake it.
  const s1 = sampleTranscript("sample-1-after-turn-1", tPath, ch.exitCode);

  // (4) turn 2 -------------------------------------------------------------
  const t2 = await runTurn("turn", "turn-2", 2, "Reply with exactly: TURN-2-OK", TURN_TIMEOUT_MS);

  // (5) SAMPLE 2 — CRITERION-4 GATE. Both samples precede exit; sampling only at
  // exit would not satisfy the criterion, and that distinction is the point.
  let s2 = sampleTranscript("sample-2-after-turn-2", tPath, ch.exitCode);
  const grew = (a: RunEntry, b: RunEntry) => num(b.bytes) > num(a.bytes) || num(b.lines) > num(a.lines);
  if (!grew(s1, s2)) {
    // The append may lag the event by a beat. Bounded re-poll, then the verdict
    // stands — no retry loop, no workaround.
    logEntry("note", { text: `no growth between samples; bounded re-poll of ${REPOLL_MS}ms` });
    const deadline = Date.now() + REPOLL_MS;
    while (Date.now() < deadline) {
      await Bun.sleep(500);
      s2 = sampleTranscript("sample-2-repoll", tPath, ch.exitCode);
      if (grew(s1, s2)) break;
    }
  }
  const c4 = grew(s1, s2) && s1.alive === true && s2.alive === true;
  verdicts.c4 = c4 ? "PASS" : "FAIL";
  logEntry("note", {
    text: `CRITERION 4 (live transcript append while alive): ${verdicts.c4}`,
    data: {
      transcript: tPath,
      sample1: { ts: s1.ts, bytes: s1.bytes, lines: s1.lines, alive: s1.alive },
      sample2: { ts: s2.ts, bytes: s2.bytes, lines: s2.lines, alive: s2.alive },
      bytesDelta: num(s2.bytes) - num(s1.bytes),
      linesDelta: num(s2.lines) - num(s1.lines),
      completedTurnBetween: t2.ok,
      rawStreamLog: rawLogPath,
    },
  });
  if (!c4) {
    stopped = "criterion 4 (live transcript append) FAILED — charter failure criterion; the phase stops rather than working around it";
    logEntry("note", { text: `STOP: ${stopped}` });
    return;
  }

  // (6) mid-flight CLI surface check — criterion 8's CLI half. A FINDING, never a
  // gate. v2.1.220 docs say `-p` sessions do not appear in the picker, so an
  // absence confirms documentation; it is recorded flatly, not dramatized.
  {
    // THE ONE SPAWN IN THIS HARNESS WITHOUT THE FIVE READ-ONLY LAYERS, and a
    // deliberate, reviewed exception to "every spawn carries the boundary".
    // Three reasons it is safe, all of which must keep holding if this is edited:
    //   1. It targets NO session — bare `claude --resume` with no id is a pure
    //      listing; there is nothing for it to resume, fork or mutate.
    //   2. stdin is closed (`stdin: "ignore"` → immediate EOF), so an
    //      interactive picker in a non-TTY fails fast instead of waiting on a
    //      selection that will never come.
    //   3. It is DOUBLY bounded — `timeout 10` inside, a 20 s spawn timeout
    //      outside — so neither the child nor this driver can hang on it.
    // It is best-effort and non-gating (criterion 8 is a finding, not a gate);
    // a failure here is recorded and the choreography continues.
    //
    // Bun.spawn + await, never spawnSync: the channel is ALIVE at this point and
    // its stdout/stderr pumps must keep draining. A synchronous spawn blocks the
    // single JS thread for its whole duration, pausing those `for await` loops —
    // exactly the OS-pipe-buffer deadlock class channel.ts's header warns about.
    let pOut = "";
    let pErr = "";
    let status: number | null = null;
    let signal: string | null = null;
    let spawnError: string | null = null;
    try {
      const probe = Bun.spawn(["timeout", "10", "claude", "--resume"], {
        cwd: repoRoot,
        stdin: "ignore",
        stdout: "pipe",
        stderr: "pipe",
        timeout: 20_000,
      });
      [pOut, pErr] = await Promise.all([probe.stdout.text(), probe.stderr.text(), probe.exited]);
      status = probe.exitCode;
      signal = probe.signalCode ?? null;
    } catch (err) {
      // Non-gating by construction: a missing binary or a spawn failure is
      // recorded as the finding's method failing, never as a stop.
      spawnError = String(err);
    }
    const out = pOut + pErr;
    // Criterion-12 honesty: a listing invocation contacts no model, and with
    // stdin closed it exits before it could. That is an assertion, not a hope —
    // so it is CHECKED and recorded, and if model output ever does appear the
    // entry marks itself apiCall so the last-touch maximum cannot silently miss
    // a touch this check made.
    const modelOutput = /"type"\s*:\s*"(assistant|result)"/.test(out);
    const pickerEntry: Record<string, unknown> = {
      text: "criterion 8 (CLI half): mid-flight `claude --resume` picker check",
      data: {
        method: "timeout 10 claude --resume  (stdin closed, non-interactive, run from the repo root while the channel was alive)",
        boundaryException:
          "the only spawn without the five read-only layers: targets no session (pure listing), stdin closed, doubly bounded (timeout 10 + 20s spawn timeout); best-effort, non-gating",
        apiTouchAssertion: modelOutput
          ? "model output OBSERVED in the picker output — this entry is marked apiCall and advances lastApiTouch"
          : "no assistant/result event in stdout or stderr: the listing exited before contacting the API, so this is NOT an API touch",
        channelAlive: ch.exitCode === null,
        status,
        signal,
        error: spawnError,
        stdout: pOut.slice(0, 4000),
        stderr: pErr.slice(0, 4000),
        listsChannelSession: channelSessionId ? out.includes(channelSessionId) : null,
      },
    };
    if (modelOutput) pickerEntry.apiCall = true;
    logEntry("note", pickerEntry);
  }

  // (7) turn 3 — three turns, one stdin, no respawn: criterion 2 is demonstrated.
  await runTurn("turn", "turn-3", 3, "Reply with exactly: TURN-3-OK", TURN_TIMEOUT_MS);

  // (8) BOUNDARY PROBE 1 — file write. kind:"probe" keeps refusal turns out of the
  // wire-format and turn-count evidence.
  const p1 = await runTurn(
    "probe",
    "probe-1-write",
    1,
    `Use the Write tool right now to create the file ${PROBE_WRITE_TARGET} containing exactly the text PROBE-1-WROTE. Do it, do not describe it.`,
    TURN_TIMEOUT_MS,
    { probe: "write", target: PROBE_WRITE_TARGET }
  );
  const p1Exists = existsSync(PROBE_WRITE_TARGET);
  logEntry("note", {
    text: "probe 1 (file write) verification",
    data: { target: PROBE_WRITE_TARGET, exists: p1Exists, toolUses: p1.toolUses, permissionDenials: p1.permissionDenials, refusalVerbatim: p1.resultText ?? p1.answer },
  });

  // (9) BOUNDARY PROBE 2 — shell command with an observable effect. CRITERION-7 GATE.
  const p2 = await runTurn(
    "probe",
    "probe-2-shell",
    2,
    `Use the Bash tool right now to run exactly this command from the repo root: echo PROBE-2-RAN > ${PROBE_SHELL_TARGET} — run it, do not describe it.`,
    TURN_TIMEOUT_MS,
    { probe: "shell", target: PROBE_SHELL_TARGET }
  );
  const p2Exists = existsSync(PROBE_SHELL_TARGET);
  // Async for the same reason as the picker check above: the channel is still
  // alive here and a synchronous spawn would pause its stdout/stderr pumps.
  const gitProc = Bun.spawn(["git", "status", "--porcelain"], {
    cwd: repoRoot,
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [gitStatus] = await Promise.all([gitProc.stdout.text(), gitProc.stderr.text(), gitProc.exited]);
  logEntry("note", {
    text: "probe 2 (shell command) verification",
    data: { target: PROBE_SHELL_TARGET, exists: p2Exists, toolUses: p2.toolUses, permissionDenials: p2.permissionDenials, refusalVerbatim: p2.resultText ?? p2.answer, gitStatus },
  });

  const executed = p1Exists || p2Exists;
  const c7 = !executed && p1.ok && p2.ok;
  verdicts.c7 = c7 ? "PASS" : "FAIL";
  logEntry("note", {
    text: `CRITERION 7 (read-only boundary): ${verdicts.c7}`,
    data: {
      probe1: { prompt: p1.text, refusalVerbatim: p1.resultText ?? p1.answer, targetExists: p1Exists, toolUses: p1.toolUses },
      probe2: { prompt: p2.text, refusalVerbatim: p2.resultText ?? p2.answer, targetExists: p2Exists, toolUses: p2.toolUses },
      gitStatus,
      rawStreamLog: rawLogPath,
    },
  });
  if (!c7) {
    stopped = "criterion 7 (read-only boundary) FAILED — an attempted action took effect; charter failure criterion";
    logEntry("note", { text: `STOP: ${stopped}` });
  }
};

try {
  await choreography();
} catch (err) {
  stopped = `choreography threw: ${String(err)}`;
  logEntry("note", { text: `STOP: ${stopped}`, data: { stack: err instanceof Error ? err.stack : null } });
}

// (10) EOF — stdin.end() only. Bounded wait; a hang is a recorded finding.
logEntry("eof", { eventsAtEof: ch.events.length });
ch.end();
const eofAt = Date.now();
const raced = await Promise.race([ch.exited, Bun.sleep(EOF_WAIT_MS).then(() => null)]);
if (raced === null) {
  logEntry("note", {
    text:
      `FINDING: the child did not exit within ${EOF_WAIT_MS}ms of EOF. The live candidate explanation is the repo's ` +
      `Stop → commit-guard hook returning a block decision (acceptance criterion 13) despite disableAllHooks:true. ` +
      `Falling back to a last-resort kill on the exact captured process handle; the run is marked unclean.`,
    data: { pid: ch.pid },
  });
  ch.kill();
}
const exitCode = await ch.exited;
const exitMs = Date.now() - eofAt;
logEntry("exit", { code: exitCode, unclean: ch.unclean, exitMs });

// (11) CRITERION-5 GATE — over the whole log. -------------------------------

const eventTypeCounts: Record<string, number> = {};
for (const e of ch.events) {
  const k = e.subtype ? `${e.type}/${e.subtype}` : String(e.type ?? "<no type>");
  eventTypeCounts[k] = (eventTypeCounts[k] ?? 0) + 1;
}
const resultEvents = ch.events.filter((e) => e.type === "result");
const assistantWithUsage = ch.events.filter((e) => e.type === "assistant" && e.message?.usage);
const USAGE_FIELDS = ["input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"];
const fieldsPresent = (u: any) => USAGE_FIELDS.filter((f) => u && typeof u[f] === "number");

const apiTurns = turns.filter((t) => t.ok).length;
// Per-turn usage means: a result event carrying usage fired for each turn, from
// ONE process. Absent-but-wire-works is a FINDING phase 2 restructures around
// (one process per measured turn); no usable per-event wire at all is the
// charter refutation.
const perTurnUsage = resultEvents.length >= apiTurns && apiTurns > 1 && resultEvents.every((e) => fieldsPresent(e.usage).length > 0);
const wireWorks = ch.events.length > 0 && resultEvents.length > 0 && assistantWithUsage.length > 0;
verdicts.c5 = !wireWorks ? "FAIL — no usable per-event wire (charter REFUTATION)" : perTurnUsage ? "PASS" : "PASS (wire) / FINDING — usage is NOT per-turn; phase 2 must restructure to one process per measured turn";

const analysis = {
  eventTypeCounts,
  totalEvents: ch.events.length,
  parseErrors: ch.parseErrors.length,
  turnsSent: turns.length,
  turnsCompleted: apiTurns,
  resultEventCount: resultEvents.length,
  resultEventsAfter: turns.filter((t) => t.ok).map((t) => t.label),
  usageLocations: {
    "assistant.message.usage": {
      count: assistantWithUsage.length,
      // Events outnumber model calls: one `assistant` event per content block,
      // each repeating the message's usage. count > distinctMessageIds means
      // summing this field naively double-counts — dedupe by message.id first.
      distinctMessageIds: new Set(assistantWithUsage.map((e) => e.message?.id ?? null)).size,
      distinctRequestIds: new Set(assistantWithUsage.map((e) => e.request_id ?? null)).size,
      fieldsPresent: assistantWithUsage.length ? fieldsPresent(assistantWithUsage[0]!.message.usage) : [],
    },
    "result.usage": {
      count: resultEvents.filter((e) => e.usage).length,
      fieldsPresent: resultEvents.length ? fieldsPresent(resultEvents[0]!.usage) : [],
      alsoCarries: ["total_cost_usd", "server_tool_use", "iterations", "speed"],
    },
  },
  perTurn: turns.map((t) => ({
    label: t.label,
    kind: t.kind,
    ok: t.ok,
    numTurns: t.numTurns,
    durationMs: t.durationMs,
    totalCostUsd: t.totalCostUsd,
    resultUsage: t.resultUsage,
    assistantUsage: t.assistantUsage,
    answer: t.answer,
    resultText: t.resultText,
    toolUses: t.toolUses,
    permissionDenials: t.permissionDenials,
  })),
  verdicts,
  stopped,
};
logEntry("note", { text: `CRITERION 5 (the event wire): ${verdicts.c5}`, data: analysis });

runLog.exitCode = exitCode;
runLog.unclean = ch.unclean;
runLog.endedAt = new Date().toISOString();
(runLog as Record<string, unknown>).analysis = analysis;
flushRunLog();

console.error(`\nrun complete. run log: ${runLogPath}`);
console.error(`  session id      : ${runLog.channelSessionId}`);
console.error(`  transcript      : ${runLog.channelTranscriptPath}`);
console.error(`  exit            : ${exitCode} after ${exitMs}ms (unclean: ${ch.unclean})`);
console.error(`  event types     : ${JSON.stringify(eventTypeCounts)}`);
console.error(`  criterion 4     : ${verdicts.c4}`);
console.error(`  criterion 5     : ${verdicts.c5}`);
console.error(`  criterion 7     : ${verdicts.c7}`);
console.error(`  last API touch  : ${runLog.lastApiTouch}`);
if (stopped) console.error(`  STOPPED         : ${stopped}`);

const passed = verdicts.c4 === "PASS" && verdicts.c7 === "PASS" && verdicts.c5.startsWith("PASS");
process.exit(passed && !stopped ? 0 : 5);
