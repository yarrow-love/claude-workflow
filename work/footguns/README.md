# Footgun ledger

The active mission's footgun ledger: load-bearing constraints and traps discovered during work, one file per subsystem. The ledger is discovered here — the directory listing *is* the index; no document outside `work/footguns/` is required to point at it. Hazards that outlive the mission graduate to `.claude/ADR.md` § Standing hazards, which is where a durable, template-wide trap belongs. Planners and implementers **must** read the ledger file for any subsystem they touch — and the standing hazards before touching the subsystems those name.

A project that wants a subsystem-to-file index in its own documents may keep one; `work/PROJECT.md` is the seam for it, like every other project-shaped fact. No product document presumes such an index exists.

Entries accumulate as work surfaces them; an empty ledger is the normal starting state, not a gap. At mission close the ledger is archived to `work/missions/<v>/footguns/`; at the next mission's open, every entry is triaged: **carried** (still true — moves into the fresh ledger, re-certified), **designed-around** (the new design removes the trap; stays archived as the design's rationale), or **watch** (relevance unknown until the subsystem is touched). Protocol: the mission-tier proposal, Position 3.
