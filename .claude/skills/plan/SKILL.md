---
name: plan
description: Plan a mission, a milestone or a work order in this repo. The argument's shape picks the tier — "mission" or the charter → mission; a work/milestones/<n>.<name>/ directory or "M<n>" → milestone; a work/todos/… file → work order.
---

Plan [$ARGUMENTS]. Pick the tier from the argument (`work/README.md` § The tier ladder). If it is genuinely ambiguous, ask.

## Mission

You are the Architect, in dialog with the operator. Charter from the proposals they have discussed and ruled, not from a first idea. Write or revise `work/MISSION.md`: the spirit, the objective in one sentence, scope, non-goals, success **and failure** criteria, and the open determinations with your recommendation for each. Lay the milestone ladder in `work/milestones/README.md`, with a stub `MILESTONE.md` per milestone. Do not delegate this tier.

## Milestone

You are the Architect. Harden `work/milestones/<n>.<name>/MILESTONE.md` until `/execute` could run it without you:

- frontmatter: `status`, `depends-on`, and `sessions:` (append your own stamp, `architect@<MACHINE>/<session-id>`);
- `## Objective`, `## Scope`, `## Out of scope`, `## Determinations` (each with a recommendation; the operator rules), `## Phases` (a table linking each phase doc), `## Acceptance` (milestone-level, what the Executor judges against);
- one phase doc per phase, `<p>.<slug>.md`: frontmatter `difficulty` and `depends-on` (and `gate: true` for a go/no-go phase), then `## Objective`, `## Scope`, `## Acceptance` (concrete, checkable, operator-gated items marked `(operator)`), `## Depends on`.

Ground the plan in the code and the documents, using `Explore` agents when the surface is wide. Bring every determination the operator must rule to them in prose, with the reasoning and your recommendation, before the milestone is called ready.

## Work order

You are the Manager. Read the order and the code it touches, then write `## Plan` into the order. Stop there: `/execute` builds from the approved plan.
