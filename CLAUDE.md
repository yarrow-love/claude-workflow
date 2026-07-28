# claude-workflow

This repository **is** the Claude agentic workflow — the canonical, project-generic bootstrap, dogfooding itself. `main` carries the **template only**: the `.claude/` product (agents, commands, workflows, protocols, `bin/` tooling) manifested by `.claude/BASELINE.md`, the `work/` and `src/` scaffold with its instructive READMEs, the canon READMEs, and `.cbmignore`. Every file under `.claude/` must stay **project-generic**: no project facts, no machine-specific paths, no assumptions a fresh repo wouldn't satisfy. The seam for project specifics is `work/PROJECT.md` in the *consuming* repo.

The workflow's own development never runs on `main` — it runs on **mission branches off `dev`, the process branch** (adopted at the v2 close, 26-07-26; v1–v2 branched from `main` directly and archived tag-only). A mission branches from `dev`, is named for its scoped mission (`v<n>.<slug>`; the first two used dates), and works under the workflow — its charter, work orders, proposals, and archives filling the scaffold. At close the mission's whole work system archives in-tree into `work/missions/<v>/`, the close lands on `dev`, and the branch is tagged `<v>-closed`; only the product folds on to `main`, which stays the clean, project-generic template. Design history is therefore reachable through [`.claude/ADR.md`](.claude/ADR.md), `dev`'s `work/missions/` archives, and the mission tags — never through instance files on `main`.

## The work system

Conventions, tier ladder, role ladder, command family, callback grammar: **[`work/README.md`](work/README.md)**. Work orders: [`work/todos/README.md`](work/todos/README.md). Operational facts agents read — quality gate, surfaces, per-role notes — live in **`work/PROJECT.md`**, authored at branch open (bootstrap step 3) and absent from a bare template tree.

## Conventions

- **Genericity is the acceptance test** — before committing a `.claude/` change, ask: does this work verbatim in a repo that isn't this one? Project-shaped facts route to the `work/PROJECT.md` seam instead.
- **BASELINE.md tracks the manifest** — adding/removing/moving a bootstrap file updates `.claude/BASELINE.md` in the same commit.
- **Historical documents are never rewritten** — archived orders and proposals keep their era's vocabulary; `work/README.md` carries the rename mapping.
- **No packaging leaks to root** — the one sanctioned `package.json` lives at `.claude/bin/`.
- **Commits**: imperative `Add:` / `Fix:` / `Update:` / `Organize:` / `Document:` prefixes; enumerate paths (never `git add -A` / `git add .`); commit with `git commit --only <paths>` so a concurrent session's pending hunks in the same files are never absorbed (the shared-store hazard: `.claude/ADR.md` § Standing hazards); Co-Authored-By footer per harness convention.

## Standing hazards

The product's durable hazards — the ones that outlive any single mission — are [`.claude/ADR.md`](.claude/ADR.md) § Standing hazards. Read them before touching the subsystems they name. A mission's own hazard ledger lives in the scaffold's ledger directory and archives with its branch ([`work/README.md`](work/README.md) § Layout).
