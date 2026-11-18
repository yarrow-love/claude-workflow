# work/proposals/ — design before decision

The root holds the **standing** proposals: still open, or adopted with the enacting work pending. State directories hold the rest, created on first use:

| Directory    | Meaning                                |
| ------------ | -------------------------------------- |
| `_deferred/` | Accepted in principle, not now         |
| `_rejected/` | Declined                               |
| `_enacted/`  | Accepted, and the enacting work landed |

A proposal is `<yy-mm-dd>.<slug>.md` with frontmatter `status:` (`open` · `adopted (<date>)` · `deferred` · `rejected` · `enacted (<date> — <what landed>)`) and `relates-to:`. It states the problem, the options with their costs, a recommendation and its reasoning, and the determinations it asks the operator to rule.

Adoption is a decision: update `status:` and leave the file in the root while work pends. Enactment is a completion: whoever closes the enacting work moves the file to `_enacted/` with `status: enacted (<date> — <what landed>)`. Proposals are never rewritten after a decision; a changed mind is a new proposal.
