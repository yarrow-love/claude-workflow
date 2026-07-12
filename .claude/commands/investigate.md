Answer the following codebase question — or trace the following bug — by dispatching the [investigator](.claude/agents/investigator.md) agent.

**Input:** $ARGUMENTS

## Process

1. **Parse input** — a file path (a bug report in `work/todos/bugs/`, or a question file such as `work/notes/<question>.md`) or an inline question. If a file, read it for the question/symptoms and surrounding context.
2. **Classify** — this command is for questions the *codebase* answers (how does X work, where is Y, why does Z fail, trace this bug). If the question is external (library comparisons, technology surveys, best practices), it belongs to `/research` — say so and offer to run it instead.
3. **Dispatch the investigator** with a self-contained prompt: the full question text, relevant context from the file, and what a definitive answer looks like ("Investigate by tracing through the codebase. Read the relevant source, follow the call chain, and return a definitive answer with file paths and line numbers. Question: …").
4. **Answer** — distill the report into a concise, direct answer. Inline question → respond in the conversation. File input → append the answer under an `## Answer` heading (preserve the original content exactly), stamped per `work/README.md` § The callback grammar. A bug report → this is an *answer*, not a fix; if resolution is wanted, point at `/execute` on the report.

## Constraints

- Concise and prescriptive — answer the question, don't write an essay.
- Distinguish fact from inference; if the answer is uncertain, say so and name what would need to be checked.
- Read-only: no code changes ride on this command.
