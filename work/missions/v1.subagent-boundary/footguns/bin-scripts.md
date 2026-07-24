# Footgun — `.claude/bin/` scripts

Traps discovered while authoring the bun tooling under `.claude/bin/`. Read before adding or editing a script here.

## JSDoc header cannot contain `*/` — globs like `**/*.md` break the parse

`.claude/bin/` scripts open with a `/** … */` header block (house convention — see `session-archive`, `consult`, `commit-guard`). Any literal `*/` **inside** that block closes the comment early, and bun then tries to parse the trailing prose as code and refuses to load the file. A glob written in header prose — `**/*.md`, `dir/*/file` — contains `*/` and triggers this.

**Surfaced**: 26-07-23, authoring `commit-guard` (its detector matches `work/todos/**/*.md`); the header wouldn't parse until the glob was reworded.

**Avoid**: never write a `*/`-containing token in a header comment. Describe the pattern in prose ("a markdown doc at any depth under `work/todos/`") and keep the literal glob in the code/regex, where it belongs. Verify with `bun run <script>` (or the quality gate's tooling smoke test) after editing a header.
