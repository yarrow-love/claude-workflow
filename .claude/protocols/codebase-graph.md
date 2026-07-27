# Codebase graph — operating protocol

The cross-agent operational protocol for working against the codebase knowledge graph: how to verify the index is fresh, how to recover a store that has wedged, and how freshness evidence travels from a dispatching role into the briefs it writes. Role cards point here rather than restating it. Every machine-specific value these procedures need — store location, commands, candidate paths — is per-project and declared at the seam (§ The consuming seam).

The one-sentence version: **the graph is a cache.** Verified, it is the cheapest structural answer available; contradicted by a file, it loses.

## Verifying freshness

**The known-moved-path flip.** Pick a path a committed refactor removed, together with the path the code moved to. Query the graph for nodes whose file path contains the removed path and expect a count of **0**; query the path the code moved to and expect a count **above 0**. A graph still holding nodes under the removed path is stale, whatever it reports about itself.

```
MATCH (n) WHERE n.file_path CONTAINS '<removed path>' RETURN count(n)
```

`<removed path>` is **repo-relative** — path values in the graph are repo-relative, so an absolute or `<repo>`-prefixed string matches nothing and the check passes vacuously. The concrete path pair is seam content.

**The property is `file_path`, not `path`.** A `WHERE` clause written against `path` returns zero rows, and zero rows is exactly what a clean result looks like: a false pass, indistinguishable from success. Two actions follow. Write `file_path`. And **confirm property names with `keys()` / `properties()` before trusting any negative result** — a count of 0 is evidence only if the property it was counted on exists.

**The `expected_* == actual_*` gate.** Read it on every `index_repository` result, and read it as a shape rather than a single number: every `expected_*` field must equal its `actual_*` counterpart. A surplus of stored over expected means stale rows were not purged — a different failure from an under-count, needing the same repair.

**Full re-index triggers.** Re-index the whole project, at a committed checkpoint, after any of: a bulk move or rename; a branch switch; a binary upgrade; any graph result a file contradicts.

**The standing rule.** The graph is a cache, and **when a graph result contradicts what you can see in a file, the file wins — re-index, then re-ask.**

### Non-signals

Three things look like freshness evidence and are not. Gate on none of them.

- **`head_sha` and `index_status`.** Both are frozen at project creation and are never updated by a re-index, so a badly stale graph can report a `head_sha` equal to HEAD. Recognize the two field names exactly — they are the ones an agent reaches for by instinct — and never gate freshness on them.
- **Node-count parity.** Incremental updates are not equivalent to a full re-index even when node counts return to their earlier level: derived similarity and semantic edges accrete and are not garbage-collected, so equal totals can sit over materially different graphs. Matching counts are never evidence of equivalence, and never evidence against a re-index trigger.
- **Read-only change-detection calls.** Such a call is read-only *analysis*, not a refresh. More broadly: **tool calls refresh nothing.** A call reads whatever the background refresher has already written; asking again does not make the answer newer.

### Verification is scoped to the serving session

A verification is evidence only for the server process that performed it. A session can serve a stale snapshot indefinitely — a re-index landing elsewhere does not reach into a server already holding an older view. The dispatching role therefore **verifies through the same server it and its subagents will query**; a verification performed anywhere else is not evidence about this session's graph.

### Silent staleness: the declined refresh

The background refresher can decline work under memory pressure, and a declined re-index is **silently** stale. Nothing in the graph reports the refusal, no result changes shape, and every query keeps answering from the older snapshot. The refusal is visible only in the refresher's own log — its rejection and out-of-memory events — whose location the seam declares. Read that log whenever a re-index appears to have had no effect.

### The query dialect is restricted

The query language is a restricted dialect, not the full graph language it resembles, and an unsupported construct **errors rather than degrading**. The failure is loud — but only if you read it as a failure rather than as an empty result. Defensive posture: keep verification queries to the simple `MATCH` / `WHERE` / `count` shapes above, and do string surgery on the results outside the query rather than inside it.

### The index surface — a matched pair

**Confirm before.** The ignore whitelist must exist **before** the first index, and before any full re-index. The index walk is ignore-blind: it silently drops whatever the ignore layers exclude, with no warning and no count of what was skipped, so an unanchored pattern can cut far more than intended and the result still looks like a healthy index — of a smaller repo.

**Confirm after.** Audit conformance against the project's own declaration rather than against literal paths: every `File` node sits under `<declared surface prefix>`, and the count of `File` nodes under each `<excluded tree>` is 0. Both halves use the same count shape as the flip check. This audit is the only read-only health check the graph itself offers — it is what tells you the surface you indexed is the surface you declared.

## Recovering a wedged store

### Symptoms

This procedure is triggered, not run routinely. Any of:

- a store operation failing on permissions — the project-delete path needs exclusive access to the store, and is exactly what fails first under contention;
- a re-index that silently no-ops, returning a byte-identical result while files on disk have plainly changed;
- **the wedge canary — a `.db-wal` far larger than its `.db`**, judged as a ratio; absolute sizes carry no meaning across repos.

Mechanism, in one sentence: concurrent holders block the write-ahead log's checkpointing, so the log grows unbounded while reads keep returning the old snapshot.

### The single-process precondition

Before any store operation, and before any graph-dependent dispatch, **confirm that exactly one server process is running against the store.** Only the shared coordination daemon is a singleton — per-session servers are not deduplicated, so every client that connects spawns its own server against the same store, and a reconnect **adds** a process rather than replacing one.

The observable discriminant, stated as one: **never assume a reconnect replaced a server — count processes.** The precondition is checked, not inferred. The process-check command is per-OS and belongs to the seam.

### The sanctioned recovery

In order: kill every server process; then, **with the server stopped**, delete the store files `<store-dir>/<project>.db{,-shm,-wal}`; respawn a single server; run a full re-index; verify by the recipe in § Verifying freshness. The per-OS commands and the store directory are seam content.

Two things to know before running it:

- **A tool-level project delete followed by a re-index does not recover a wedged store.** The delete is the operation that fails under contention — it is the symptom, not the cure. The files must be removed directly, with the server stopped.
- **Reach the single-process state by closing client sessions where you can.** Force-killing breaks live sessions; it is the recovery path, not the routine one.

### Recovery standing

**Delete-and-rebuild is the sanctioned recovery; no gentler in-place repair is sanctioned.** That is doctrine about what this workflow prescribes — not an inventory of what the tool ships. A sanction is revised deliberately, at a re-audit; it is never inferred from a tool list.

### The project name

`<project>` above is a **derived name, not a path**: derived from the repository's absolute path with the path separators replaced by hyphens, and overridable at index time with an explicit name flag. Derive it for the repo in hand rather than copying one; the derived value is seam content.

## Evidence-passing dispatch

**The dispatching role verifies freshness once, and the evidence rides the brief.** Specialists do not each re-verify: that multiplies the cost of the check by the fan-out and still leaves every subagent trusting a live query it has no way to audit.

A brief carrying graph evidence carries: the **project name**; the **verification result and which server session produced it**; the **qualified symbols**; the **paths**; the **call-chain**; and **coverage**. Coverage travels with its semantics stated — **a coverage check's clean result means "no recorded gap", never completeness.**

For the specialist:

- Treat brief-carried evidence as **pre-verified context**; re-running the dispatcher's verification is waste.
- **When the brief carries no verification, fall back to grep.** Absence of evidence is not licence to trust a live query.
- On a graph/file contradiction, apply the file-wins rule, fall back to grep for the answer you needed, and **report the contradiction**. Re-verification and re-indexing are the dispatcher's acts, not the specialist's.

**The dispatch record carries the evidence.** `work/todos/README.md` § Document structure defines the dispatch record — the ledger line that records a dispatch, carrying the dispatched child's `agentId`. This protocol extends that same line: it also records the freshness evidence the brief carried — the verification result and the server session that produced it — **or an explicit statement that no verification evidence was carried, and why.** Both forms are records; a silent line is not.

## The consuming seam

Every machine-specific value the procedures above need is declared once, per project, in `work/PROJECT.md` § Codebase graph. What to record — never another project's values:

- the **install variant** in use;
- the **store directory**;
- the **derived project name** for this repo;
- the per-OS **process-check and kill commands**;
- the per-OS **store-file delete command**;
- a **known-moved-path candidate** for the flip check: a path a committed refactor removed, plus the path the code moved to;
- the **refresher's log location**.

The moved-path pair **decays** — refresh it when it stops corresponding to a recent committed refactor, or the flip check degenerates into a query that would return 0 against any graph.

## Why the graph still comes first

Graph queries answer **structure** questions at a fraction of the cost of grep fan-outs. That is why the graph-first prescriptions exist, and none of it changes: **the protocol adds verification; it does not retreat to grep.**

The graph is a cache. Verified, it is the cheapest structural answer available; contradicted by a file, it loses. What verification buys is the difference between a cheap right answer and a cheap wrong-but-plausible one — and it is the plausibility that makes the wrong one expensive, because nothing downstream flags it.
