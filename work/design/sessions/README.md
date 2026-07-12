# Design sessions

One directory per **design session** — a single design engagement: dialog → brief → *optional* external-tool hand-off phase → reconciliation. Naming: `<YY-MM-DD>.<slug>/` (sorts like work orders). Vocabulary: unqualified "session" always means a Claude session; these are always *design sessions* (one may span several Claude sessions — the brief's `sessions:` stamps record which).

Inside each:

| Path | Direction | Holds |
| --- | --- | --- |
| `BRIEF.md` | out | The running record: lifecycle frontmatter (`draft → handed-off → returned → signed → built → revised`; no external tool → `draft` straight to `signed`), the ask, the ownership boundary, mental model, the operator-signed **locks**, layout, **Front-end Verification criteria**, and the Reconciliation appended at return. Full shape: `designer.md`. `**/BRIEF.md` globs every design session ever run |
| `current-state/` | out | Inspector-captured as-is evidence (png+html pairs per surface) + the `system/` assets as-sent — a provenance snapshot of exactly what the external tool saw |
| everything else at the root | in | The returns: `index.html`, assets, `components/<c>.html+.png` comps |

**For agents building against a brief**: the locks are signed decisions — a comp or implementation that violates one raises a revision, not a reinterpretation. Interpretation questions consult the brief's `designer@<machine>/<session-id>` handle (`.claude/bin/consult`); genuinely new **taste** decisions belong to the operator, staged as operator-gated acceptance (the taste gate). Reconciliation distills accepted decisions *upward* into `../DESIGN.md` and `../system/` — session directories are the record, never the authority.
