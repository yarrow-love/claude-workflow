# proposals/

Pre-decision design thinking. The root is the **standing set** — proposals still open, or adopted with enacting work pending. State directories carry the rest:

| Directory | State | Meaning |
| --- | --- | --- |
| `_deferred/` | deferred | Accepted in principle, not now |
| `_rejected/` | rejected | Declined |
| `_enacted/` | enacted | **Accepted and applied** — the decision was made and the enacting work landed |

**Adoption and enactment are two steps.** Adoption is a *decision*: `status:` frontmatter updates (with reconciliation notes as needed) and the file stays in the root while the enacting work pends — the root remains the honest list of proposals still generating work. Enactment is a *completion*: whoever closes the enacting work (the work order's closer, or the operator session that applies the proposal directly) moves the file to `_enacted/`, sets `status: enacted (<date> — <what landed>)`, and appends a `sessions:` stamp (`work/README.md` § The callback grammar).

Series subdirectories (`<date>.<series>/`) are preserved inside state directories — enacted members of a series move to `_enacted/<series>/`, keeping same-directory cross-links intact; links that cross the boundary are repaired at move time.

At mission close, `_enacted/` archives wholesale with the mission (`work/missions/<v>/proposals/`) — enactment filed the close-time triage in advance; standing and `_deferred/` proposals persist unless the close triages them otherwise.

The `26-07-05.agentic-workflow/` series is this workflow's own founding design record: enacted members at [`_enacted/26-07-05.agentic-workflow/`](_enacted/26-07-05.agentic-workflow/), the standing remainder in [`26-07-05.agentic-workflow/`](26-07-05.agentic-workflow/).
