#!/usr/bin/env bun
/**
 * guard-check — proves `.claude/bin/consult`'s read-only boundary guard against
 * the committed wire fixtures beside this file.
 *
 *   bun work/milestones/2.instrumented-consult/fixtures/guard-check.ts [--keep]
 *
 * It runs the SHIPPED script, not a copy of its logic (decision D1): each case
 * spawns `.claude/bin/consult` as a subprocess inside a throwaway sandbox with a
 * stub `claude` first on PATH. The stub ignores argv entirely and cats a fixture,
 * so the assertions land on the real parser, the real guard, the real finalizer,
 * the real exit ladder and the real stdout/stderr split — while no test seam ever
 * enters production tooling (gate ruling 9) and no network call is made.
 *
 * The sandbox is what makes that safe. `consult` reads `process.env.HOME` to find
 * its transcript cache, so an overridden HOME plus a temp git repo means nothing
 * touches the real project store and no archive path is exercised: the seeded
 * one-line transcript makes the local-cache branch hit and `bindOrRefuse` pass.
 *
 * ⚠ This runner recomputes the transcript-directory slug exactly as `consult`
 * computes it. That duplication is a known coupling — see README.md § Known
 * coupling: the slug rule.
 *
 * exit codes:
 *   0  every assertion held
 *   1  usage / unknown flag
 *   3  a prerequisite is missing — `consult` or a fixture is absent, or a sandbox
 *      could not be built. Not an assertion failure; nothing was proved either way
 *   5  an assertion did not hold. The run COMPLETED — this means "read the
 *      verdict", not "the runner broke" (the spike harness's code-5 sense)
 */
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { hostname, tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const fixturesDir = import.meta.dir;
const repoRoot = (() => {
  const r = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: fixturesDir, encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : resolve(fixturesDir, "..", "..", "..", "..");
})();
const consultPath = join(repoRoot, ".claude", "bin", "consult");

// Any well-formed uuid: it names the seeded sandbox transcript, never a real one.
const UUID = "9f2c1d7e-3b4a-4c5d-8e6f-0123456789ab";
// Computed, never hardcoded — `consult` exits 2 on a foreign machine segment.
const HANDLE = `fixture@${hostname().split(".")[0]}/${UUID}`;

const FIXTURES = ["clean", "refused", "violation", "violation-truncated", "unverifiable"].map(
  (n) => `${n}.jsonl`
);

const args = process.argv.slice(2);
const unknown = args.filter((a) => a !== "--keep");
if (unknown.length) {
  console.error(
    `unknown argument(s): ${unknown.join(", ")}\n` +
      "usage: guard-check [--keep]\n" +
      "  --keep  leave each sandbox on disk and print its path (debugging a FAIL)"
  );
  process.exit(1);
}
const keep = args.includes("--keep");

const missing = [consultPath, ...FIXTURES.map((f) => join(fixturesDir, f))].filter((p) => !existsSync(p));
if (missing.length) {
  console.error(`prerequisite missing:\n  ${missing.join("\n  ")}`);
  process.exit(3);
}

type Probe = { code: number | null; stdout: string; stderr: string };

const runCase = (fixture: string, stubExit: number): Probe => {
  const sandbox = mkdtempSync(join(tmpdir(), "consult-fixture-"));
  try {
    const home = join(sandbox, "home");
    const repo = join(sandbox, "repo");
    const bin = join(sandbox, "bin");
    for (const d of [home, repo, bin]) mkdirSync(d);

    // The stub is the wire, not a CLI: it ignores argv, so every flag `consult`
    // constructs is exercised for real without any of them changing the reply.
    writeFileSync(join(bin, "claude"), '#!/bin/sh\ncat "$CONSULT_FIXTURE"\nexit "${CONSULT_STUB_EXIT:-0}"\n', {
      mode: 0o755,
    });

    const init = spawnSync("git", ["init", "-q", repo], { encoding: "utf8" });
    if (init.status !== 0) {
      console.error(`could not git init the sandbox repo: ${init.stderr ?? init.error?.message ?? "?"}`);
      process.exit(3);
    }
    // Ask git for the toplevel rather than assuming it is `repo`: `consult` asks
    // git too, and a tmpdir that resolves through a symlink would otherwise
    // desync the two paths and fail the repo binding for a reason unrelated to
    // anything under test.
    const top = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd: repo, encoding: "utf8" }).stdout.trim();

    // ⚠ SLUG COUPLING — duplicated verbatim from `.claude/bin/consult`.
    const slug = resolve(top).replace(/[^a-zA-Z0-9]/g, "-");
    const projectDir = join(home, ".claude", "projects", slug);
    mkdirSync(projectDir, { recursive: true });
    // One line carrying a `cwd` is all `bindOrRefuse` reads. Present in the local
    // cache, so the archive branch is never taken.
    writeFileSync(join(projectDir, `${UUID}.jsonl`), `${JSON.stringify({ type: "summary", cwd: top })}\n`);

    const env: Record<string, string | undefined> = {
      ...process.env,
      HOME: home,
      PATH: `${bin}:${process.env.PATH}`,
      CONSULT_FIXTURE: join(fixturesDir, fixture),
      CONSULT_STUB_EXIT: String(stubExit),
    };
    delete env.CONSULT_DEBUG_TOOLS; // inherited, it would add stderr lines under test

    const r = spawnSync(process.execPath, [consultPath, HANDLE, "probe"], {
      cwd: repo,
      env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
  } finally {
    if (keep) console.log(`     kept: ${sandbox}`);
    else rmSync(sandbox, { recursive: true, force: true });
  }
};

const lines = (s: string) => s.split("\n");
const find = (s: string, prefix: string) => lines(s).find((l) => l.startsWith(prefix)) ?? null;
const indexOfPrefix = (s: string, prefix: string) => lines(s).findIndex((l) => l.startsWith(prefix));
const usageLines = (s: string) => lines(s).filter((l) => l.startsWith("usage:"));

let failures = 0;
const report = (name: string, r: Probe, checks: [string, boolean][]) => {
  let bad = 0;
  for (const [label, ok] of checks) {
    console.log(`${ok ? "PASS" : "FAIL"} ${name} — ${label}`);
    if (!ok) bad++;
  }
  if (bad) {
    console.log(`     exit=${r.code}`);
    console.log(`     stdout: ${JSON.stringify(r.stdout)}`);
    for (const l of lines(r.stderr)) if (l) console.log(`     stderr| ${l}`);
  }
  failures += bad;
};

// ── clean ───────────────────────────────────────────────────────────────────
// A real clean turn PLUS a successful allowlisted Read (D5): a guard that flagged
// every error-free tool_result would fail here rather than pass.
{
  const r = runCase("clean.jsonl", 0);
  report("clean", r, [
    ["exit 0", r.code === 0],
    ["stdout is the answer alone", r.stdout.trim() === "TURN-1-OK"],
    ["no BOUNDARY line on stderr", !r.stderr.includes("BOUNDARY")],
    ["exactly one usage line (directive 1)", usageLines(r.stderr).length === 1],
  ]);
}

// ── refused ─────────────────────────────────────────────────────────────────
// The real refusal, verbatim. This is the boundary WORKING; it must not trip.
{
  const r = runCase("refused.jsonl", 0);
  report("refused", r, [
    ["exit 0 — a refused attempt is not a violation", r.code === 0],
    ["stdout carries the answer", r.stdout.startsWith("I can't — the Write tool isn't enabled")],
    ["no BOUNDARY line on stderr", !r.stderr.includes("BOUNDARY")],
    ["exactly one usage line (directive 1)", usageLines(r.stderr).length === 1],
  ]);
}

// ── violation ───────────────────────────────────────────────────────────────
{
  const r = runCase("violation.jsonl", 0);
  const warn = find(r.stderr, "BOUNDARY VIOLATION:");
  const vi = indexOfPrefix(r.stderr, "BOUNDARY VIOLATION:");
  const ui = indexOfPrefix(r.stderr, "usage:");
  report("violation", r, [
    ["exit 5", r.code === 5],
    ["stdout still carries a non-empty answer (ruling 3)", r.stdout.trim() !== ""],
    ["BOUNDARY VIOLATION: names Write", warn !== null && warn.includes("Write")],
    ["the violation line precedes the usage render", vi >= 0 && ui >= 0 && vi < ui],
    ["exactly one usage line (directive 1)", usageLines(r.stderr).length === 1],
  ]);
}

// ── violation-truncated ─────────────────────────────────────────────────────
// The wire dies mid-event, so there is no terminal result and no answer. The
// warning must still have been emitted: this is the phase-1 defect class.
{
  const r = runCase("violation-truncated.jsonl", 143);
  const warn = find(r.stderr, "BOUNDARY VIOLATION:");
  report("violation-truncated", r, [
    ["exit 3 — degrade's own code stands (precedence ruling)", r.code === 3],
    ["stdout is empty — there was no answer to return", r.stdout.trim() === ""],
    ["BOUNDARY VIOLATION: names Write despite the incomplete session", warn !== null && warn.includes("Write")],
  ]);
}

// ── unverifiable ────────────────────────────────────────────────────────────
// Directive 4: three stderr states, two exit states. An unresolvable name is not
// a detected breach, so it must leave the exit code exactly where it was.
{
  const r = runCase("unverifiable.jsonl", 0);
  report("unverifiable", r, [
    ["exit 0 — UNVERIFIED does not change the exit code (directive 4)", r.code === 0],
    ["BOUNDARY UNVERIFIED: on stderr", find(r.stderr, "BOUNDARY UNVERIFIED:") !== null],
    ["no BOUNDARY VIOLATION: — unverifiable is not breached", find(r.stderr, "BOUNDARY VIOLATION:") === null],
    ["stdout carries the answer", r.stdout.trim() !== ""],
  ]);
}

console.log(failures === 0 ? "\nall assertions held" : `\n${failures} assertion(s) did not hold`);
process.exit(failures === 0 ? 0 : 5);
