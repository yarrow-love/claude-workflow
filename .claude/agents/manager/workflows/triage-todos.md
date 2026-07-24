# Triage Todos

Backlog grooming, not execution. This workflow catches the standing `work/todos/` inbox up with the current state of the project, decides each pending item's disposition, normalizes drifted metadata, and rewrites the prioritized ledger at `work/todos/BACKLOG.md`. It sits upstream of `/execute`: that command advances work; triage decides which standing work is still real and how it should enter the build stream. The manager is the sole author of `BACKLOG.md` and of every disposition verdict — subagents report evidence about current state, the manager decides. Triage never dispatches the work it prioritizes.

## Workflow

**Backlog triage workflow**:
 1. Enumerate the active inbox: `work/todos/*.md` and `work/todos/bugs/*.md`, excluding `work/todos/_done/` and the undated briefing/scratch docs (plain `<slug>.md` with no workflow lifecycle — see `work/todos/README.md`). If `$ARGUMENTS` scopes the pass (a subdirectory, a date range, or a single slug), honor it; empty means the whole active inbox.
 2. Establish the current-state baseline for reconciliation. Dispatch a researcher subagent to distill: the milestones index and which phases are shipped / in-progress / upcoming (`work/milestones/README.md`), the repo CLAUDE.md architecture sections and the footgun ledger (`work/footguns/`), and the `git log` since the oldest enumerated item's filing date. The manager reads the distilled baseline, not raw history.
 3. Dispatch researcher / investigator subagents in parallel batches — one reconciliation task per item (or a small batch of related items), read-only. Each answers: is the filing still real? Has a commit since its filing date already addressed it (verify against the code — do not assume from the message)? Does it still align with current architecture, or has the architecture moved past it? Which upcoming milestone phase, if any, is its natural home? Provide each subagent the item's path, its filing date, and the baseline from step 2.
 4. Distill each subagent's evidence into a verdict: a `disposition`, a normalized `priority`, and an `aligns` target (see Format). The manager authors these judgments.
 5. Normalize drifted frontmatter on each surviving item — canonical `priority` enum, `disposition`, `aligns`, and `triaged: <date>` — as a light single-file write. Do not otherwise rewrite the body.
 6. Close the clear-cut autonomously, routing by *why* it closed. Two archives, never deletion: `work/todos/_done/` holds work that was **performed** — completed through its normal workflow, or `resolved-elsewhere` (a later commit did the work; name that commit); `work/todos/_cancelled/` holds work that will **never be performed** — `dead` (no longer relevant) or `superseded` (overtaken by a different approach; name what replaced it). The test is "did this order's work actually happen?" — yes → `_done/`, no → `_cancelled/`. Bugs carry a `resolution:` line plus a "Resolution (<date>)" section; other types get a one-line closing note recording why. Deletion is reserved for content-free stubs only — a one-line filing with no rationale, or a duplicate; anything with a "why" in its body is archived (its rationale is the record, especially for `superseded`/`resolved-elsewhere`), not deleted. Do not raise definite cases to the user — an item that is clearly irrelevant or demonstrably already shipped is the manager's to close.
 7. Checkpoint only the contestable closures. When a `dead` / `superseded` verdict is a genuine judgment call, or closing would discard scope the user may still want, list those items with their verdict and one-line rationale and await confirmation before moving them. This is the workflow's conditional pause — mirror the post-review consultation policy: handle the obvious silently, surface only what the user would care to reverse.
 8. Rewrite `work/todos/BACKLOG.md` as the manager: the prioritized ledger of everything still active after this pass, ordered by priority then dependency, plus the "Closed this pass" record. Set `Last triaged: <date>`.
 9. Present the close-out brief: the ranked backlog, what was closed this pass, and a recommended near-term sequence — which items to `/execute` next as one-offs, and which to fold into which upcoming milestone phase. Recommendation only; triage does not dispatch the work.
 10. Commit as a single `Organize:` group — the normalized todo frontmatter, the files moved to `_done/`, and `BACKLOG.md` together — the close-out fires on completion, before any reply prose (`work/README.md` § The follow-through rule). Standing commit approval applies; enumerate paths, never `git add -A` / `git add .`. Use the Co-Authored-By footer.

## Format

The work product is the ledger, `work/todos/BACKLOG.md`, authored end-to-end by the manager. It is data, read on demand by triage / scheduler / the operator — not auto-loaded; the convention lives in `work/todos/README.md`.

**Disposition** (the per-item triage verdict):

| Disposition | Meaning | Action |
|---|---|---|
| `live` | Still relevant, ready to enter the build stream as-is | Stays in inbox; ranked in BACKLOG |
| `fold:<milestone>` | Absorb into a named upcoming milestone phase | Stays; `aligns` set to that phase |
| `execute-now` | A one-off worth dispatching soon | Stays; flagged in the near-term sequence |
| `backorder` | Genuinely good but deliberately parked | Stays; `priority: backlog` with a reason |
| `stale-revise` | Still relevant but the filing drifted from current architecture | Stays; needs a rewrite before it can be acted on |
| `superseded` | Overtaken by architecture evolution | Close to `_cancelled/` with a pointer to what replaced it |
| `resolved-elsewhere` | Silently fixed by a later commit | Verify, then close to `_done/` naming the commit |
| `dead` | No longer relevant | Close to `_cancelled/` with a one-line reason |

The last three close out of the inbox (steps 6–7) — `resolved-elsewhere` to `_done/` (the work happened), `superseded` / `dead` to `_cancelled/` (it never will); the rest stay in the inbox with refreshed frontmatter. Neither archive is ever auto-loaded or swept by triage, so a closed item costs future sessions zero context — deletion buys no hygiene over archival, only the loss of the record.

**Normalized priority enum:** `critical` | `high` | `medium` | `low` | `backlog`. Triage reconciles the drifted historical values (`p1`, `defer-to-post-MVP`, `design-pending`, etc.) onto this set.

**BACKLOG.md structure:**
```markdown
# Backlog

Last triaged: <date>

Prioritized ledger of the active `work/todos/` inbox. Rewritten end-to-end by `/triage`; see `work/todos/README.md` for the disposition + priority vocabulary.

| Item | Type | Priority | Disposition | Aligns | Note |
|---|---|---|---|---|---|
| [<slug>](<path>) | feature/bug/refactor/chore | critical…backlog | live/fold:…/… | <milestone phase> / one-off / — | one line: current relevance, what changed since filing |

## Closed this pass (<date>)
- [<slug>](_done/<file>) — `resolved-elsewhere`: <commit that did the work>
- [<slug>](_cancelled/<file>) — `superseded`: <what replaced it> / `dead`: <one-line reason>
```
