# Design

The active mission's **design authority** — mission-versioned process, not product. Role and workflow: [`designer.md`](../../.claude/agents/designer.md) (the spec) and `/design` (the judgment-closed session that populates this directory). Empty until a mission's **founding `/design` session** — an MVP mission that pays UI design no attention leaves it empty, sanctioned.

| Path | Holds | Created by |
| --- | --- | --- |
| `DESIGN.md` | The canon (caps orientation doc): principles, design language, component inventory, motion, tokens rationale | The founding `/design` (reverse-engineers what exists before prescribing what should) |
| `system/` | Distilled assets briefs constrain against: tokens.css, glyphs, palettes. **Authority, not build input** — the app's imported token file lives in app source and *conforms to* this | `/design`, as decisions distill |
| `sessions/<YY-MM-DD>.<slug>/` | One **design session** each: `BRIEF.md` (the running record — locks, verification criteria, reconciliation) + outbound `current-state/` (inspector-captured) + returns at the root | Each `/design` session |

**For agents touching `interface` work**: read `DESIGN.md` first; a referenced `BRIEF.md`'s locks are signed decisions — interpretation questions consult the brief's `designer@…` handle; **taste decisions belong to the operator** (the taste gate: inspector PASS verifies conformance, never design acceptance).

**Vocabulary**: unqualified "session" = a Claude session (callback grammar); these are always "**design sessions**."

**Lifecycle**: archives whole at `/close` (`work/missions/<v>/design/`); triaged at the next mission's settlement — **carried** (re-certified into the fresh canon) / **redesigned** (superseded; the archive keeps the rationale) / **watch**.
