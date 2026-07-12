# Session archive

The durable store behind every callback stamp: `<machine>/<uuid>.jsonl.gz` + sha256 `MANIFEST`. Grammar and rationale: [`work/README.md`](../README.md) § The callback grammar; a stamp in a committed document is a *promise of consultability*, and this store is what makes the promise true (`~/.claude/projects/` is a cache, not an archive).

- **Written by**: `.claude/bin/session-archive` — directly, via the `SessionEnd` archive-on-stamp hook (archives a session only if its id is stamped under `work/`), and via `/archive` sweeps.
- **Read by**: `.claude/bin/consult <role@machine/uuid[#msg]> "<question>"` — restores into the local cache and resume-forks the session.
- **Citing a `#message-id` fragment**: `zgrep '<message-id>' work/sessions/<machine>/<uuid>.jsonl.gz` locates the cited turn.
- **Verify**: `cd work/sessions && sha256sum -c MANIFEST`.
- At mission close, this mission's transcripts `git mv` into `work/missions/<v>/sessions/`.
