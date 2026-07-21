Sweep and backfill the durable session archive (`work/sessions/`) — the checkpoint for a mission that is inactive but not closed, and the preparation step before migrating work to another machine. Design: `work/README.md` § The callback grammar (Durability); `work/proposals/_enacted/26-07-05.agentic-workflow/26-07-06.durable-resumability.md`.

## Process

1. **Enumerate the stamped set** — collect every session handle recorded under `work/`: frontmatter `sessions:` entries and body stamps. `git grep -hoE '[a-z-]+@[a-z0-9-]+/[0-9a-f-]{36}' -- work '*.md' | sort -u` (include root `CLAUDE.md` if it carries stamps). The stamped set IS the archive set — durable tiers stamp; specialists don't.
2. **Partition by machine** — handles whose `<machine>` segment is not this host are reported as `unreachable (other machine)`, never errors; their archives arrive when that machine runs `/archive` (or via repo sync).
3. **Verify + backfill** — for each local handle, check `work/sessions/<machine>/<uuid>.jsonl.gz` exists; backfill stragglers with `bun .claude/bin/session-archive <uuid>` (idempotent; re-archiving a grown transcript is correct — last write wins). A handle whose transcript is gone from **both** the local cache and the archive is reported `LOST` — name it prominently; that is the failure this command exists to prevent.
4. **Archive the current session** — this session is doing archive work worth keeping: stamp it if it authored anything under `work/` this session, then `bun .claude/bin/session-archive <your session-id>`.
5. **Verify the manifest** — `cd work/sessions && sha256sum -c MANIFEST`.
6. **Report** — a table: handle · role comment · status (`archived` / `already-present` / `unreachable (other machine)` / `LOST`). Commit the store additions (`Organize:` commit, enumerated paths) — an archive that isn't committed doesn't ride the repo's backup discipline.

## Migration note

To move work to another machine: `/archive` → sync the repo → on the far side, `.claude/bin/consult` restores transcripts into that machine's `~/.claude/projects/<its-slug>/` on demand. The machine registry (`work/README.md`) carries the repo-path mapping.
