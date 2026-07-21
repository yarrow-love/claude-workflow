# Plan Todo

Type-polymorphic planning workflow. Reads the todo frontmatter `type` field to determine
which investigation and planning steps to follow. Ends with a completed plan — does not
proceed to implementation.

## Workflow

**Planning workflow** (type-polymorphic):

 1. Read the referenced todo file. Parse frontmatter to determine `type` (feature, bug, refactor, chore) and `difficulty` (low, medium, high).
 2. Update frontmatter `status` to `planning`. If `difficulty` is absent, judge it from the filing + investigation (obvious plan, few files, no design forks → `low`; genuine architectural content, cross-cutting invariants, novel design → `high`) and record it in the frontmatter — downstream workflows read it.
 3. Execute type-specific investigation:
    - **feature / chore**: Dispatch researcher subagent to explore codebase and relevant architecture (chore: skip when the filing leaves no genuine unknowns).
    - **bug**: Synthesize duplicate/related reports into one. Dispatch investigator subagent to trace root causes.
    - **refactor**: Dispatch researcher subagent to explore codebase and relevant architecture.
 4. Format document; revise the initial filing section; add investigation/research findings section.
 5. Dispatch planner subagent to develop implementation plan from the findings — model per `difficulty` (see the manager model-tier policy: `high` → the fable pin stands; `low`/`medium` → dispatch with `model: "opus"`).
 6. Write the plan section to the todo file.
 7. Submit for blessing — the mandatory Architect gate, identical to the work-order workflow's step 7 (policy: the manager's Architect Blessing section): consult-fork the standing `architect@…` handle or dispatch a fresh architect, always flagship regardless of `difficulty`; on critique, refine via the continued planner and resubmit (two-round bound); append the stamped `## Blessing` section. An order leaves planning blessed — unresolved critique is recorded in the section for the consuming sign-off to weigh.
 8. Update frontmatter `status` to `awaiting-approval`.
 9. Exit. Do not proceed to implementation.

**Omitted steps** (compared to the full work-order workflow): No user interview, no user consultation
checkpoint — the Architect Blessing (step 7) is agent-side and still runs; the plan is then evaluated at sign-off by whoever consumes it (the operator, or an Executor at its Reconnaissance gate). `/execute` enters at implementation when it finds the approved, blessed plan (work-order Entry state).

## Format

**Document format**:
 * Preserve the existing filename and location — do not rename or move the file.
 * Revise document content for brevity and to establish consistent voice.
 * Accumulates specified <h2> sections throughout the workflow.
 * Maintain consistent document structure.

**Document structure** (varies by type):

Feature:
```markdown
# <Title>

## Feature Request
(revised initial filing — what, why, constraints, acceptance criteria)

---

## Research Findings
(revised researcher report)

---

## Implementation Plan
(manager brief from planner's full report)
```

Bug:
```markdown
# <Title>

## Bug Report
(revised initial filing — symptoms, reproduction steps, initial hypotheses)

---

## Investigation Findings
(revised investigator report — root causes, blast radius, key evidence)

---

## Resolution Plan
(manager brief from planner's full report)
```

Refactor:
```markdown
# <Title>

## Refactor Objective
(revised initial filing — objective, motivation, scope, considerations)

---

## Research Findings
(revised researcher report)

---

## Refactor Plan
(manager brief from planner's full report)
```
