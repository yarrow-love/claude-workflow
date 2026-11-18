# work/todos/ — work orders

One file per order; the file gathers sections as the work moves and is the record when it closes.

| Path | Holds |
| --- | --- |
| `<yy-mm-dd>.<slug>.md` | A work order (feature, chore, refactor) |
| `bugs/<yy-mm-dd>.bug.<slug>.md` | A bug, filed brief: symptoms and where seen |
| `<series>/` | A phased series (`index.md` plus `<i>.<slug>.md` orders) too small for a milestone |
| `<yy-mm-dd>.execute-<slug>.md` | A milestone's campaign log (Executor-authored) |
| `_done/` | Work that happened (or was resolved elsewhere, naming the commit) |
| `_cancelled/` | Work that never will (dead or superseded, naming what replaced it) |

Directories are created on first use.

## Filing

A filing needs the **what**, the **why**, constraints, and acceptance (or, for a bug, how to reproduce): enough for a later session to act without the filer. No plan at filing time.

```yaml
---
status: open # open → planned → in-progress → done
type: feature # feature | bug | refactor | chore
difficulty: medium # low | medium | high — how hard to PLAN, not how long to build
priority: medium # critical | high | medium | low
filed: yy-mm-dd
aligns: — # the milestone phase this serves, or —
scope: [] # areas touched
depends-on: []
---
```

## Sections, in order

`## Request` (or `## Bug Report`) · `## Plan` · `## Progress` (when resumable) · `## Review` · `## Summary`. The Manager is the sole author after filing; subagent reports are distilled, never pasted.
