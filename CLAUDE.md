# claude-workflow

This repository **is** the Claude agentic workflow — the canonical, project-generic bootstrap, dogfooding itself. `main` carries the **template only**: the `.claude/` product (agents, commands, workflows, `bin/` tooling) manifested by `.claude/BASELINE.md`, the `work/` and `src/` scaffold with its instructive READMEs, the canon READMEs, and `.cbmignore`. Every file under `.claude/` must stay **project-generic**: no project facts, no machine-specific paths, no assumptions a fresh repo wouldn't satisfy. The seam for project specifics is `work/PROJECT.md` in the *consuming* repo.

The workflow's own development never runs on `main` — it runs on **mission branches**. A mission branches from `main`, works under the workflow (its charter, work orders, proposals, and archives filling the scaffold), and at close is tagged `<v>-closed` carrying its whole mission archive; only the product folds back. Design history is therefore reachable through [`.claude/ADR.md`](.claude/ADR.md) and the mission tags, never through in-tree instance files.

## The work system

Conventions, tier ladder, role ladder, command family, callback grammar: **[`work/README.md`](work/README.md)**. Work orders: [`work/todos/README.md`](work/todos/README.md). Operational facts agents read — quality gate, surfaces, per-role notes — live in **`work/PROJECT.md`**, authored at branch open (bootstrap step 3) and absent from a bare template tree.

## Conventions

- **Genericity is the acceptance test** — before committing a `.claude/` change, ask: does this work verbatim in a repo that isn't this one? Project-shaped facts route to the `work/PROJECT.md` seam instead.
- **BASELINE.md tracks the manifest** — adding/removing/moving a bootstrap file updates `.claude/BASELINE.md` in the same commit.
- **Historical documents are never rewritten** — archived orders and proposals keep their era's vocabulary; `work/README.md` carries the rename mapping.
- **No packaging leaks to root** — the one sanctioned `package.json` lives at `.claude/bin/`.
- **Commits**: imperative `Add:` / `Fix:` / `Update:` / `Organize:` / `Document:` prefixes; enumerate paths (never `git add -A` / `git add .`); Co-Authored-By footer per harness convention.

## Standing hazards

The product's durable hazards — the ones that outlive any single mission — are [`.claude/ADR.md`](.claude/ADR.md) § Standing hazards. Read them before touching the subsystems they name. A mission's own hazard ledger lives in the scaffold's ledger directory and archives with its branch ([`work/README.md`](work/README.md) § Layout).
