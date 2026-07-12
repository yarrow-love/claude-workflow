# claude-workflow

This repository **is** the Claude agentic workflow — the canonical, project-generic bootstrap, dogfooding itself. Two things live here and must not blur:

- **The product**: `.claude/` — the portable bootstrap (agents, commands, workflows, `bin/` tooling), manifested by `.claude/BASELINE.md`. Every file under `.claude/` must stay **project-generic**: no project facts, no machine-specific paths, no assumptions a fresh repo wouldn't satisfy. The seam for project specifics is `work/PROJECT.md` in the *consuming* repo.
- **The instance**: `work/` — this repo's own live work system (the workflow governs its own development) plus the workflow's design history: the determinations record and founding series in `work/todos/_done/agentic-workflow/`, the design corpus in `work/proposals/26-07-05.agentic-workflow/`, the founding session archive in `work/sessions/`.

## The work system

Conventions, tier ladder, role ladder, command family, callback grammar: **[`work/README.md`](work/README.md)**. Work orders: [`work/todos/README.md`](work/todos/README.md). This repo's operational facts: **[`work/PROJECT.md`](work/PROJECT.md)**.

## Conventions

- **Genericity is the acceptance test** — before committing a `.claude/` change, ask: does this work verbatim in a repo that isn't this one? Project-shaped facts route to the `work/PROJECT.md` seam instead.
- **BASELINE.md tracks the manifest** — adding/removing/moving a bootstrap file updates `.claude/BASELINE.md` in the same commit.
- **Historical documents are never rewritten** — archived orders and proposals keep their era's vocabulary; `work/README.md` carries the rename mapping.
- **No packaging leaks to root** — the one sanctioned `package.json` lives at `.claude/bin/`.
- **Commits**: imperative `Add:` / `Fix:` / `Update:` / `Organize:` / `Document:` prefixes; enumerate paths (never `git add -A` / `git add .`); Co-Authored-By footer per harness convention.

## Footgun index

[`work/footguns/`](work/footguns/README.md) — none yet.

| Subsystem | Ledger file |
| --- | --- |
| — | (none yet) |
