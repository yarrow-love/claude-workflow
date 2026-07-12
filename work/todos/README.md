# work/todos/ — the work-order inbox

Active work orders: the durable state documents that `/plan` and `/execute` operate on. One file per order; the file accumulates sections as the workflow progresses and is the record when it closes. System-wide conventions (tier ladder, roles, commands, callback grammar): [`work/README.md`](../README.md).

## Layout

| Path | Holds |
| --- | --- |
| `<YY-MM-DD>.<slug>.md` | A work order (feature/chore: bare slug; refactor: `.refactor.` token) |
| `bugs/<YY-MM-DD>.bug.<slug>.md` | Bug reports — filed brief (symptoms + where found), investigated at `/execute` time |
| `<series>/` | A **phased series**: `index.md` + ordered `<i>.<objective>.md` orders for multi-order efforts that don't warrant milestone ceremony (first instance: `agentic-workflow/`) |
| `_done/` | Work that was **performed** — completed through its workflow, or `resolved-elsewhere` (naming the commit) |
| `_cancelled/` | Work that will **never be performed** — `dead` or `superseded` (naming what replaced it) |
| `BACKLOG.md` | The prioritized ledger, rewritten end-to-end by `/triage` |
| `<slug>.md` (undated) | Briefing/scratch docs with no workflow lifecycle — ignored by triage |

The `_done/` vs `_cancelled/` test: *did this order's work actually happen?* Neither archive is auto-loaded, so a closed item costs future sessions zero context — deletion buys no hygiene over archival, only the loss of the record. Deletion is reserved for content-free stubs.

## Filing

Name: `<YY-MM-DD>.<slug>.md` (e.g. `26-07-11.dispatch-policy.md`; bugs add `.bug.`, refactors `.refactor.` — chores and features ride bare; `type:` frontmatter is authoritative either way). A filing needs: the **what**, the **why**, constraints, and (for features/bugs) acceptance/reproduction — enough that a later session can act without the filer present. No investigation or plan at filing time; that's `/plan`'s job.

## Frontmatter vocabulary

```yaml
---
status: open            # open → planning → awaiting-approval → planned → in-progress → merging → done
type: feature           # feature | bug | refactor | chore
difficulty: medium      # low | medium | high — PLANNING difficulty (design forks, novelty), not effort;
                        #   drives the Planner's model tier (high → flagship pin; low/medium → downshift)
priority: medium        # critical | high | medium | low | backlog
filed: 26-07-11
aligns: —               # milestone phase / series this serves, or —
scope: [src, interface] # coarse areas touched; `interface` triggers inspector verification;
                        #   `schema` flags migration serialization
depends-on: []          # order numbers (in a series) or paths that must land first
worktree:               # set when assigned to an isolation worktree; cleared by the Integrator
triaged: 26-07-11       # last /triage pass that reconciled this item
disposition: live       # /triage verdict — see below
resolution:             # bugs only, at close: one-line description of the fix
sessions:               # append-only callback list, grammar per work/README.md
  - manager@play/<uuid>
---
```

**Dispositions** (assigned by `/triage`): `live` (ready as-is) · `fold:<milestone>` (absorb into a milestone phase) · `execute-now` (one-off worth dispatching soon) · `backorder` (deliberately parked, with reason) · `stale-revise` (still real, filing drifted) · `superseded` → `_cancelled/` · `resolved-elsewhere` → `_done/` (name the commit) · `dead` → `_cancelled/`.

## Document structure

The workflow appends `<h2>` sections separated by `---`, each prefaced by its author's stamp (`> role@machine/session-id` — see `work/README.md`). By type:

| | feature / chore | bug | refactor |
| --- | --- | --- | --- |
| Filing | `## Feature Request` | `## Bug Report` | `## Refactor Objective` |
| Findings | `## Research Findings` | `## Investigation Findings` | `## Research Findings` |
| Plan | `## Implementation Plan` | `## Resolution Plan` | `## Refactor Plan` |
| Build record | `## Code Review` · `## Front-end Inspection` (if `interface`) · `## Progress` (automatic mode) · `## Acceptance Verdict` (automatic mode) | same | same |
| Close | `## Summary` | `## Summary` + `resolution:` frontmatter + `## Resolution (<date>)` | `## Summary` |

The Manager is the document's sole author after filing: subagent reports are distilled into briefs (never pasted), consistent voice throughout.

## Phased series

A subdirectory `<series>/` holds ordered orders `<i>.<objective>.md` + an `index.md` ledger (order table, dependency chain, execution notes). Use it when an effort needs decomposition and ordering but not milestone ceremony (no `## Acceptance` at the container level — each order closes on its own criteria). At series close, the whole directory moves to `_done/<series>/`. Orders within a series reference each other by number via `depends-on`.

## Campaign artifacts

An `/execute <milestone>` campaign files its **campaign log** here (`<date>.execute-<objective-slug>.md`, Executor-authored) and seeds one work order per phase. These ride the same conventions; the campaign log moves to `_done/` at objective close.
