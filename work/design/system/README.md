# Design system

The distilled assets the design canon governs and briefs constrain against: `tokens.css`, glyph sets, palettes, motion curves — populated by `/design` sessions as decisions distill at reconciliation (never ad hoc). Canon rationale lives in [`../DESIGN.md`](../DESIGN.md); this directory holds the assets themselves.

Two rules every agent must hold:

- **Authority, not build input.** Nothing here is imported by the app. The token file the app actually consumes lives in app source (location: `work/PROJECT.md`) and **conforms to** these assets — the reviewer checks conformance like any convention. This is what lets the container archive with its mission without breaking an app import.
- **Evolve values, keep names.** Token *values* may change through design sessions; token *names* are stable interfaces — briefs, comps, and app code all reference them. Renaming a token is a canon decision (`DESIGN.md`), not an asset edit.

When a design session hands off to an external tool, the assets travel as a **snapshot** into that session's `current-state/` — what was sent stays recorded there even as this directory evolves.
