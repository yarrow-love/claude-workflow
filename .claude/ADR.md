# ADR — decision register

A register of the decisions that shape this workflow: what was decided, why, and where the full record lives. One compact entry per decision, rationale in one to three lines — a register, not a narrative. Provenance pointers take the form `git show <tag>:<path>` against a mission's close-tag, because the working record archives with the mission branch that produced it. Write every pointer in full — never elide the `git show <tag>:` prefix, and use a tag or SHA rather than a branch name — so that reference-resolution gates can recognize the path as tag-qualified provenance rather than a live tree reference. Append one block per mission.

## Founding determinations (locked 26-07-11; amended 26-07-12)

Provenance for the block: `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/todos/_done/agentic-workflow/1.determinations.md`

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

**D1 — The adopted proposal binds.** The subagent-manager-boundary proposal is the mission's spec: env-gated depth-2 dispatch, the pause-and-ask protocol, the durability amendment, the permission story, headless-as-documented-fallback. Where a milestone doc and the proposal disagree, the proposal wins until the charter explicitly revises it. Provenance: `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/MISSION.md`.

**D2 — Depth is configured state; the spawn-depth var is a pin + cap.** Chartered as "enable nesting via env var"; the premise inverted on CLI v2.1.218 — nesting is default-ON and deep, and `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH=2` *restricts* to the dispatch ladder (root → Manager → specialists). The capability flipped twice in a year: audit the cap's value, never assume the behavior. Provenance: `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/MISSION.md`.

**D3 — Whole-tree archives; the Manager leaves the durable tier.** Manager stamps anchor to the hosting Executor session — the nearest-resumable-session principle applied one tier up, no new grammar — and `session-archive` sweeps the parent's `subagents/agent-*.jsonl` alongside its transcript. The archived unit is the whole agent tree, not its root, which is what an asynchronous peer reader needs. Provenance: `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/MISSION.md`.

**D4 — Template purification: `main` carries product only.** The canonical repository's `main` is the pure project-generic template — the `.claude/` manifest, the scaffold, the canon READMEs. Instance content (mission archives, todo history, the design corpus) rides mission branches, each tagged at close, and design history is reachable through this register plus the tags rather than through in-tree files. Consequence, accepted: a clone of `main` is a ready bootstrap, and the wholesale-copy trap dies at the root. Provenance: `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/MISSION.md`.

**D5 — Consult integrity is a precondition, not a feature.** A consult forks its target with `--fork-session` so reading a session never mutates the shared tree; the fix landed before the mission opened, so the mission ran on sound archive semantics. Provenance: `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/MISSION.md`.

**Operational rules.** Provenance: `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/proposals/_enacted/26-07-23.subagent-manager-boundary.md` (verdict-absence detection: `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/milestones/2.conversion/2.canon-rewrite.md`).

- **Pause-and-ask.** A subagent meeting an interpretation question ends its turn with the question, context held, and resumes in place on the answer; the terminal `ESCALATE` verdict is reserved for genuinely terminal states — budget exhaustion, an unblessed order past the refinement bound, operator-gated stops.
- **Verdict-absence detection.** On a Manager's clean return, check the work doc for `## Acceptance Verdict`: absence means early stop, distinct from re-plan — nudge it to continue, sharing the outer pass budget rather than adding a counter.
- **Parent-mode permission dominance.** No per-call lever makes a subagent stricter than its parent, so a campaign's autonomy scope is the dispatching session's own permission mode, decided once at the Reconnaissance gate.
- **Headless as documented fallback.** The `claude -p` child-session pattern survives, demoted from default, for genuinely independent permission scoping or beyond-cap depth; state the cause at the dispatch site.

## Mission v2 — repo hygiene (26-07-25)

Tag: `v2.repo-hygiene-closed` — forward-cited, and so are the paths: the tag is cut at close, and the close ceremony first moves instance content under `work/missions/<v>/`, so the pointers below name the archive's locations rather than the working tree's. Both resolve only from that tag onward. Gave repo hygiene an owner and a gate.

**D1 — Structure is declared; the system reconciles actual against declared.** No fixed layout is right in every repo, so the portable universal is the *obligation to declare one*: each project's declaration lives at `work/PROJECT.md` § Structure, its schema pinned in `.claude/BASELINE.md`, and the pass audits the axes stated once in `work/README.md` § The declared-structure floor. `.claude/` carries the axes and the mechanism, never a project's facts — the genericity test is what keeps the floor portable. Provenance: `git show v2.repo-hygiene-closed:work/missions/v2.repo-hygiene/proposals/_enacted/26-07-25.repo-hygiene.md`.

**D2 — The Janitor is a competency worn as a hat, and the gates are deliberately asymmetric.** Defined once in `.claude/agents/janitor.md` and assumed by whichever session presides at a boundary — Architect at blessing, Manager at order close, Executor at milestone close — never dispatched as a specialist; `/clean` is the operator-run escape hatch, not the habit. Order close is **advisory** because whole-repo drift is invisible at order scale, and blocking there would tax every order for drift it cannot see; milestone close is **blocking**, the scale at which the whole tree is in view and one clean pass per milestone is affordable. Provenance: `git show v2.repo-hygiene-closed:work/missions/v2.repo-hygiene/MISSION.md`.

**D3 — Where an asynchronous result lands flipped with the CLI version; doctrine was rebuilt to ride neither routing.** On 2.1.218 a subagent's asynchronous return collapsed to the root session; on 2.1.220 it is delivered into the dispatcher's own loop, governed by a rule the cartography battery isolated: *"`run_in_background: false` is honored iff the dispatched agent's turn ends with no live background children of its own. If its turn ends while a background child is still live, the harness converts the dispatch to background at that instant."* The decision is **reactive and the callee's** — taken at the callee's turn-end, with the root's converted tool result landing 42 ms and 48 ms after that turn-ending text, seconds after the dispatch it re-classifies — and it fits 10 of 10 battery-2 dispatches plus battery 1's anomalous call site. Batch size and the `model` override were both candidate discriminants and both falsified. **A caller cannot secure synchronous collection with this parameter; the callee revokes it unilaterally.**

The mission-shaped history behind the rebuild lives here, and only here, so that agent docs stay project-generic. Eight instances across one campaign (v2 milestone 1), three Manager sessions, 26-07-25: five turn-discipline breaches over phases 1–2 (one, then four) against zero in phase 3; two child reports stranding past their dispatcher; and instance 8 — a continuation's answer delivered to the root while the dispatcher that sent it received nothing and went to read the output file — observed on 2.1.218 and replicated live on 2.1.220 (Q4-a/b). Executor→Manager nudge recovery was 3-for-3 in anger. The forensic re-read (Q8) corrected the filing's own account at file level: the phase-2 and phase-3 managers dispatched **exclusively** `run_in_background: false` — ten dispatches, zero background, zero agent-completion notifications — so instances 3–6 were turn-discipline failures, not affordance-induced stranding (instance 1 excepted; its dispatcher did background two children). One finding bounds how any of this may be collected: under a *"poll until you receive X, then quote X"* brief, a dispatcher that received nothing emitted the quote anyway (battery 2 § Unprobed 8) — a resumed or polling agent's self-report of receipt is not evidence, which is why nudge briefs instruct act-and-record.

**What canon states version-free**, each observed correct under *both* known routings and therefore carrying zero version strings in `.claude/` (`work/README.md` § The collection invariant): the invariant itself, true by construction; in-turn synchronous collection as the sanctioned idiom (10/10 @2.1.218, 9/9 plus Q4-a @2.1.220); the continuation prohibition in send-then-read form (corpus instance 8 + Q4-a/b); by-name upward addressing unreliable (4/4 @2.1.218, 2/2 @2.1.220, character-identical error text); and downward SendMessage delivery, root/parent → child, dual-observed.

**The version-pin ledger — every platform behavior doctrine leans on, named with its pin.** On any routing flip this is the list of recorded assumptions to re-audit.

| Reliance | Pin |
| --- | --- |
| The conversion rule (the exact iff, with the 42/48 ms reactive evidence) | **2.1.220** |
| The self-enforcement / composition rationale (it leans on the conversion rule) | **2.1.220** |
| Deferred-stop delivery downward, n=3 — *the safety net canon must not rely on* | **2.1.220** |
| The raw-`agentId` upward channel and the `main` channel (the corpus exercised neither) | **2.1.220** |
| Live-loop non-delivery (Q2-c) — **flagged confounded by dispatcher mode; charged to neither version** | 2.1.220, confounded |
| Send-then-read's two read targets: the task-output coordinates (`CLAUDE_CODE_SESSION_ID` + child `agentId`) **and** the subagent transcript path shape (`<projectDir>/<session-id>/subagents/agent-*.jsonl`) | **2.1.220** |
| Corpus behaviors (instance 8's continuation-to-root; 10 × `rib=false` collected in-turn) | **2.1.218** |
| Downward SendMessage delivery, root/parent → child — the reliance under the nudge and under send-then-read's *send* half | **2.1.218 + 2.1.220 (dual-observed)** — 3-for-3 in anger @2.1.218; 5/5 root→subagent and 8/8 by-id @2.1.220 |

The `main` channel is recorded here rather than in canon: a depth-2 child reaches the root by addressing `main`, foreground and background alike, observed first-hand by the probe parent. It is the platform's **root-recovery path** — evidence-grade, never a canon idiom. Provenance: `git show v2.repo-hygiene-closed:work/missions/v2.repo-hygiene/todos/_done/26-07-26.cartography.md` (battery 2 — the only admissible evidence base, closed) and `git show v2.repo-hygiene-closed:work/missions/v2.repo-hygiene/proposals/_enacted/26-07-25.return-path.md` (the enacted proposal, whose seed theory was falsified in its operative form).

## Standing hazards

### The consult DENY list is name-deny-only for the deferred/built-in tool class

`consult` constrains its fork to read-only through a five-layer boundary, but an `--allowedTools` whitelist does **not** default-deny the harness's *deferred/built-in* tool class (worktree, task, messaging, publishing tools). A denied name is stripped from the fork's registry — stronger than a runtime block — so enforcement rests entirely on the `DENY` list being a complete superset of every tool that can mutate, escape, message, schedule or publish. A future harness tool in a mutating class silently escapes the boundary until its name is added. **On every harness upgrade**: re-enumerate that registry and reconcile `.claude/bin/consult`'s `DENY`; the pinned version in the script's comment is the last audited baseline.

### Consults are repo-bound — foreign handles are refused (exit 4)

`consult` compares the target transcript's recorded `cwd` against the invoking repo and refuses on mismatch, closing the transcript-provenance hole where a foreign archive is forked into a local tree. There is no override, by design. To use a handle another repo owns: consult from the repo that owns it, or degrade to documents plus a fresh dispatch.

### `.claude/bin/` JSDoc headers must never contain the comment-close sequence

Scripts open with a JSDoc header; any literal `*/` inside it — a glob written in prose, for instance — closes the comment early, and bun then refuses to parse the file. Describe patterns in header prose ("a markdown doc at any depth under `work/todos/`") and keep literal globs in code, where they belong. Verify with `bun run <script>` after editing a header.

### Dispatching an agent onto a file transfers that file until the agent reports

Parallel dispatch is safe between specialists because their file sets are disjoint; it breaks at the dispatcher's own hand. A manager that edits a file directly — typically under a late final-mile instruction — while an agent it dispatched is still live on that same file puts two writers on one file, and the final-mile exception does **not** implicitly revoke the continuation. The collision is visible only by luck: a stale `old_string` makes the agent's `Edit` fail and re-read. A whole-file write, or an anchor that still matches, loses the other side's edit silently and leaves no trace in either transcript — the lucky failure mode is the loud one, the real one is quiet. **Rule**: before touching a file you have dispatched onto, either wait for that agent's report or cancel the continuation explicitly.

### Dispatch routing is version-contingent — canon rides neither routing

Where a subagent's asynchronous result lands has flipped with the CLI version: 2.1.218 collapsed returns to the root session, 2.1.220 delivers them into the dispatcher's own loop under a conversion rule decided reactively at the callee's turn-end. The corpus/live comparison is confounded by dispatcher mode — the corpus's phase managers were background agents, every live dispatcher a foreground one — so the flip is **recorded, not fully isolated**. Doctrine therefore relies on no routing: the sanctioned idioms — in-turn synchronous collection, continuations as send-then-read, root-only turn-boundary collection (`work/README.md` § The collection invariant) — were each observed correct under both known routings. The platform behaviors doctrine *does* lean on are version-pinned in Mission v2 D3's ledger. **On any routing flip, that ledger is the list of recorded assumptions to re-audit** — the next flip must invalidate a recorded assumption, never silent doctrine.

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
