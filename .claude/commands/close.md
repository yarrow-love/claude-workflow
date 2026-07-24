Close the mission referenced by [$ARGUMENTS] — the judgment-closed tier's close protocol (`work/README.md` § tier ladder; design: the mission-tier proposal, Positions 4–7).

**The hard rule that distinguishes this tier: only the Operator invokes this command.** The system never assumes, proposes-as-pending, or auto-initiates mission close — work orders and milestones close *themselves* against written acceptance; a mission is an open-ended container of operator intent, and "closed" is a judgment reserved to the human. If this command was reached by any path other than the operator's deliberate invocation, stop.

You are the [architect](.claude/agents/architect/CLAUDE.md) in dialog with the operator. A mission may close `accomplished | failed | superseded` — **failure is first-class** and closes with the same ceremony. A mission may close with open or deferred work orders; completion is not exhaustion of the queue.

## The close sequence

1. **Draft the closing report with the operator** — `work/missions/<v>/closing.md` (the DX retrospective is a dialog, not a form): outcome; what shipped vs what didn't and why; what the *work system itself* taught; items carried forward; and a **reader's index** — the handful of archived docs a future planner should actually read, so the archive has a front door.
2. **Triage, with the operator on contestable calls:**
   - **Todos** — open orders carried forward into the next mission or archived with cause (the `_done`/`_cancelled` semantics).
   - **Proposals** — `work/proposals/_enacted/` archives with the mission wholesale (enactment filing pre-computed this triage — `work/proposals/README.md`); dead proposals archive with cause; standing and `_deferred/` proposals persist unless triaged otherwise.
   - **Footguns** — the ledger archives whole; the *next* mission's settlement triages entries (carried / designed-around / watch).
   - **Design** — `work/design/` archives whole (canon, system, design sessions); the next mission's settlement triages (carried / redesigned / watch).
   - **Runbooks** — carried / retired / watch.
   - **Docs & research** — walk `docs/` and `docs/research/`: each item **carried** (proven valuable for the project's lifetime — stays) or **archived** (mission-scoped, stale, or never proved relevant — moves to `work/missions/<v>/docs/`). The working tree stays lean because agents grep the working tree.
3. **Archive the session store** — sweep the mission's artifacts for `sessions:` stamps (`git grep -h '@<machine>/' -- '*.md'` and kin — every machine in the registry, not just this host), verify every referenced transcript exists in `work/sessions/`, backfill stragglers (`/archive`); then `git mv work/sessions/` content for this mission into the archive.
4. **`git mv` the mission's work system into `work/missions/<v>/`** — the archive is a **snapshot**, not a cleaned-up rewrite: MISSION.md, milestones/, the mission's todos (including `_done/`), scoped proposals, footguns/, runbooks/, triaged docs, sessions/.
5. **Ledger row** — add the mission to `work/missions/README.md` (create if first close): version, outcome, one-line result, closing-report link.
6. **Tag** the close commit (`<v>-closed`). If the mission rode a version branch, the branch's final state carries the archive.
7. **Hand off** — next-mission seeding (carried todos, footgun triage input, charter material) belongs to the next mission's `/plan`, not to this command.

File the reference sweep (path updates any `work/` moves require) as a work order inside the close, not a side effect.
