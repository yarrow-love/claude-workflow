# ADR — decision register

A register of the decisions that shape this workflow: what was decided, why, and where the full record lives. One compact entry per decision, rationale in one to three lines — a register, not a narrative. Provenance pointers take the form `git show <tag>:<path>` against a mission's close-tag, because the working record archives with the mission branch that produced it. Write every pointer in full — never elide the `git show <tag>:` prefix, and use a tag or SHA rather than a branch name — so that reference-resolution gates can recognize the path as tag-qualified provenance rather than a live tree reference. Append one block per mission.

## Founding determinations (locked 26-07-11; amended 26-07-12)

Provenance for the block: `git show v1.subagent-boundary-closed:work/todos/_done/agentic-workflow/1.determinations.md`

| # | Determination |
| --- | --- |
| 1 | **Callback grammar** — `<role>@<machine>/<session-id>[#<message-id>]`. The session id is the resume handle; the `#` fragment is a *citation* into the transcript, not a resume target. Field: `sessions:`, append-only frontmatter. Specified in exactly one place (`work/README.md`), referenced everywhere else. |
| 2 | **Role ladder** — Operator → Architect → Executor → Manager → specialists, all agentive nouns, judgment escalating upward. Architect and Planner share competency and differ by tier: the Architect authors specs interactively, the Planner authors one order's plan section as a dispatched subagent. |
| 3 | **Command family** — ten, per the 26-07-12 amendment (which added `/design`): `/plan` and `/execute` polymorphic by tier, plus `/design`, `/triage`, `/investigate`, `/research`, `/document`, `/close`, `/archive`, `/initialize`. Commands are verbs, agents are nouns; `/execute` means "advance this document from wherever it stands" — the work order is the state machine. |
| 4 | **The portability seam** — `.claude/` holds every harness definition, with `.claude/BASELINE.md` as the manifest of the portable bootstrap: anything under `.claude/` not listed there is project-specific by definition. `work/PROJECT.md` is the project supplement; root `CLAUDE.md` is the architecture source of truth. |
| 5 | **MCP posture** — always-useful servers are configured at **user scope**, not per repo; `/initialize` verifies presence; `work/PROJECT.md` carries only the project specifics (URLs, test projects, auth bootstrap). |
| 6 | **Durability** — transcripts are the artifact behind the stamps: archive-on-stamp to `work/sessions/<machine>/<uuid>.jsonl.gz` plus a sha256 manifest, `/archive` as the checkpoint sweep and backfill, and the archive moving under `work/missions/<v>/` at mission close. |
| 7 | **Mission close** — `/close` triages docs and research alongside footguns, todos and proposals. `docs/` is *provisionally* eternal: each doc is carried or archived at close, keeping the working tree lean because agents grep the working tree. |
| 8 | **The `work/` layout** — `todos/`, `proposals/`, `milestones/`, `missions/`, `runbooks/`, `sessions/`, `notes/` (pre-proposal context: ideas not mature enough to propose, observations not settled enough to document), `design/`, plus `PROJECT.md`, `README.md`, and a chartered mission's `MISSION.md`. |

## Mission v1 — the subagent-Manager boundary (26-07-23/24)

Tag: `v1.subagent-boundary-closed`. Converted the Executor→Manager boundary from headless `claude -p` child sessions to native subagent dispatch.

**D1 — The adopted proposal binds.** The subagent-manager-boundary proposal is the mission's spec: env-gated depth-2 dispatch, the pause-and-ask protocol, the durability amendment, the permission story, headless-as-documented-fallback. Where a milestone doc and the proposal disagree, the proposal wins until the charter explicitly revises it. Provenance: `git show v1.subagent-boundary-closed:work/MISSION.md`.

**D2 — Depth is configured state; the spawn-depth var is a pin + cap.** Chartered as "enable nesting via env var"; the premise inverted on CLI v2.1.218 — nesting is default-ON and deep, and `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2` *restricts* to the dispatch ladder (root → Manager → specialists). The capability flipped twice in a year: audit the cap's value, never assume the behavior. Provenance: `git show v1.subagent-boundary-closed:work/MISSION.md`.

**D3 — Whole-tree archives; the Manager leaves the durable tier.** Manager stamps anchor to the hosting Executor session — the nearest-resumable-session principle applied one tier up, no new grammar — and `session-archive` sweeps the parent's `subagents/agent-*.jsonl` alongside its transcript. The archived unit is the whole agent tree, not its root, which is what an asynchronous peer reader needs. Provenance: `git show v1.subagent-boundary-closed:work/MISSION.md`.

**D4 — Template purification: `main` carries product only.** The canonical repository's `main` is the pure project-generic template — the `.claude/` manifest, the scaffold, the canon READMEs. Instance content (mission archives, todo history, the design corpus) rides mission branches, each tagged at close, and design history is reachable through this register plus the tags rather than through in-tree files. Consequence, accepted: a clone of `main` is a ready bootstrap, and the wholesale-copy trap dies at the root. Provenance: `git show v1.subagent-boundary-closed:work/MISSION.md`.

**D5 — Consult integrity is a precondition, not a feature.** A consult forks its target with `--fork-session` so reading a session never mutates the shared tree; the fix landed before the mission opened, so the mission ran on sound archive semantics. Provenance: `git show v1.subagent-boundary-closed:work/MISSION.md`.

**Operational rules.** Provenance: `git show v1.subagent-boundary-closed:work/proposals/_enacted/26-07-23.subagent-manager-boundary.md` (verdict-absence detection: `git show v1.subagent-boundary-closed:work/milestones/2.conversion/2.canon-rewrite.md`).

- **Pause-and-ask.** A subagent meeting an interpretation question ends its turn with the question, context held, and resumes in place on the answer; the terminal `ESCALATE` verdict is reserved for genuinely terminal states — budget exhaustion, an unblessed order past the refinement bound, operator-gated stops.
- **Verdict-absence detection.** On a Manager's clean return, check the work doc for `## Acceptance Verdict`: absence means early stop, distinct from re-plan — nudge it to continue, sharing the outer pass budget rather than adding a counter.
- **Parent-mode permission dominance.** No per-call lever makes a subagent stricter than its parent, so a campaign's autonomy scope is the dispatching session's own permission mode, decided once at the Reconnaissance gate.
- **Headless as documented fallback.** The `claude -p` child-session pattern survives, demoted from default, for genuinely independent permission scoping or beyond-cap depth; state the cause at the dispatch site.

## Standing hazards

### The consult DENY list is name-deny-only for the deferred/built-in tool class

`consult` constrains its fork to read-only through a five-layer boundary, but an `--allowedTools` whitelist does **not** default-deny the harness's *deferred/built-in* tool class (worktree, task, messaging, publishing tools). A denied name is stripped from the fork's registry — stronger than a runtime block — so enforcement rests entirely on the `DENY` list being a complete superset of every tool that can mutate, escape, message, schedule or publish. A future harness tool in a mutating class silently escapes the boundary until its name is added. **On every harness upgrade**: re-enumerate that registry and reconcile `.claude/bin/consult`'s `DENY`; the pinned version in the script's comment is the last audited baseline.

### Consults are repo-bound — foreign handles are refused (exit 4)

`consult` compares the target transcript's recorded `cwd` against the invoking repo and refuses on mismatch, closing the transcript-provenance hole where a foreign archive is forked into a local tree. There is no override, by design. To use a handle another repo owns: consult from the repo that owns it, or degrade to documents plus a fresh dispatch.

### `.claude/bin/` JSDoc headers must never contain the comment-close sequence

Scripts open with a JSDoc header; any literal `*/` inside it — a glob written in prose, for instance — closes the comment early, and bun then refuses to parse the file. Describe patterns in header prose ("a markdown doc at any depth under `work/todos/`") and keep literal globs in code, where they belong. Verify with `bun run <script>` after editing a header.

### Dispatching an agent onto a file transfers that file until the agent reports

Parallel dispatch is safe between specialists because their file sets are disjoint; it breaks at the dispatcher's own hand. A manager that edits a file directly — typically under a late final-mile instruction — while an agent it dispatched is still live on that same file puts two writers on one file, and the final-mile exception does **not** implicitly revoke the continuation. The collision is visible only by luck: a stale `old_string` makes the agent's `Edit` fail and re-read. A whole-file write, or an anchor that still matches, loses the other side's edit silently and leaves no trace in either transcript — the lucky failure mode is the loud one, the real one is quiet. **Rule**: before touching a file you have dispatched onto, either wait for that agent's report or cancel the continuation explicitly.

---

## Template repository only

Everything above reads inside any consuming repo. This section applies only to the workflow's canonical repository.

### Continuation protocol

Each mission branches from `main` — the branch *is* the mission. `/plan` at mission tier charters it, recreating `work/MISSION.md` on the branch, and `work/PROJECT.md` is authored at branch open (both are instance files, absent from `main` by D4). Close is the operator's `/close` followed by the staged fold ceremony: the session archive moves under `work/missions/<v>/`, the mission tags as `<v>-closed`, and only product changes fold back to `main`. The next mission restores its predecessor's supplement — or any archived instance document — with `git show <tag>:work/PROJECT.md`.

### Mission ledger

| Mission | Close tag | Outcome |
| --- | --- | --- |
| `v1.subagent-boundary` | `v1.subagent-boundary-closed` | Executor→Manager converted to native subagent dispatch; whole-tree archives; template purified (D4) |

### Founding provenance

The founding architect session — the 26-07-11 dialog behind determinations 1–8 — is consultable at `architect@play/a9ddd6b3-7457-451c-85bd-a79a91b05e08`. Its archive rides the v1 tag, so restore `work/sessions/` from that tag before consulting: consults are repo-bound, and this handle is machine-qualified, which is why it sits here rather than in the register body.
