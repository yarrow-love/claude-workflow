# Audit Documentation

## Workflow

**Documentation audit workflow**:
 1. Scope the audit with the user — specific directories, systems, or broad sweep.
 2. Dispatch investigator subagent to compare documentation against current code state.
 3. Present inconsistency report to user for prioritization.
 4. Dispatch documenter subagent with the prioritized hit list.
 5. Review documenter output; resolve any gaps the documenter flagged but couldn't fix.
 6. Commit the documentation changes (enumerated paths, `Document:` prefix) as the close-out, before any reply prose (`work/README.md` § The follow-through rule) — like every other close-out; a doc that fails review is reverted or revised afterward (rare), not gated pre-commit.

## Investigator Prompt

The investigator should:
- Read each doc file in scope and the corresponding source code
- Identify specific inaccuracies (wrong endpoints, missing fields, stale status flows, outdated model lists, incorrect examples)
- Report findings as a prioritized table: severity (high/medium/low), file, description of drift
- NOT propose fixes — just surface what's wrong

## Documenter Prompt

The documenter receives the investigator's findings and:
- Revises docs to match current system state
- Follows style conventions from its agent spec
- Flags gaps it can't resolve (missing context, ambiguous code) with `<!-- TODO -->` comments
- Reports what it changed

## Scope Reference

Default audit targets and exclusions: see the documenter section of `work/PROJECT.md` — it carries the project's doc surface in priority order and the directories that are never touched.
