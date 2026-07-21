# src/

The source container. The repo root is reserved for project organization — `docs/` (knowledge), `work/` (process), `src/` (source) — and `src/` is where code lives, one subdirectory per sub-codebase: the project is a monorepo, and subsystems divide here (`src/<subsystem>/`).

**Retirement**: a retired or archived sub-codebase (dead experimentation, superseded prototypes) moves to `src/_archive/<name>/` — conventionally named after the branch it rode. The underscore marks lifecycle state, as everywhere in the work system (`_done/`, `_enacted/`, …). Archived source keeps its record in the tree but leaves the live surface: the AST graph indexes only live `src/` subdirectories (the root `.cbmignore` whitelist — `src/_archive/` is excluded), so graph answers always describe the current system.

In this repo: reserved for future workflow *software* (e.g. the deferred work-queue runner — `work/proposals/_deferred/26-07-11.work-queue-tier.md`). The bootstrap itself is documentation + `bun` scripts and lives in `.claude/`.
