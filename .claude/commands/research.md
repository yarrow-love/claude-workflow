Research the following question and write a report to `docs/research/`:

**Question:** $ARGUMENTS

## Process

1. **Clarify scope** — parse the question into 2-4 concrete sub-questions that, once answered, fully address the original question.

2. **Web research** — use `WebSearch` and `WebFetch` to find authoritative sources (official docs, papers, reputable engineering blogs, benchmarks). Aim for 5-10 distinct sources. Prioritize primary sources over aggregators.

3. **Codebase context** — check `docs/` and `src/` for existing related work. Understand what the project already does so the report can speak to integration, not just theory.

4. **Analyze** — synthesize findings. Compare approaches, note trade-offs, identify what applies to this project's stack and constraints. Flag anything uncertain or conflicting across sources.

5. **Write report** — save to `docs/research/<slug>.md` using the format below. The slug should be a short kebab-case name derived from the topic (e.g., `vector-quantization.md`). Then commit the report (enumerated path, `Add:` prefix) as the close-out, before any reply prose (`work/README.md` § The follow-through rule) — a finished report is not left uncommitted.

## Report Format

```markdown
# <Title>

<One-paragraph summary answering the original question.>

---

## Context

<Why this question matters for the project. Link to relevant existing docs/code.>

## Findings

<Organized by sub-question or theme. Use headers, bullet points, code snippets as appropriate. Attribute claims to sources.>

## Trade-offs & Recommendations

<Concrete comparison of approaches. State which option fits the project best and why.>

## Sources

<Numbered list of URLs with brief descriptions.>
```

## Constraints

- Do not fabricate sources or statistics. If a search yields insufficient results, say so.
- Keep reports focused and prescriptive, not exhaustive surveys.
- Link to existing project docs where relevant rather than restating them.
- If the question is too broad, narrow it to what is actionable for this project.
