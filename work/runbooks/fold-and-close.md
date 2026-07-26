# Runbook — mission close and template fold (v2 edition)

> The hand-execution procedure for closing a mission and folding its branch back to `main`. Pick this up **as the operator**, in a fresh session, when the mission is finished and you are ready to render judgment on it. Assumes no campaign context: you do not need to have followed the mission's milestones to run this.
>
> **What it does.** Runs `/close`'s ceremony (report, triage, archive, ledger, tag), then merges the mission branch into `main` and **purifies** `main` down to the project-generic bootstrap template — product only, zero instance content. The mission's whole working history survives on the tagged branch; `main` becomes a clone-and-go template.
>
> **This instance's values**: mission `v2.repo-hygiene` · branch `26-07-25` · tag `v2.repo-hygiene-closed`. Archive paths are written with the inherited `<v>` placeholder — **`<v>` means `v2.repo-hygiene` throughout.** That is not decoration: a path under `work/missions/<v>/` does not exist until § 7 creates it, and the reference gate exempts a placeholder segment as a template rather than failing it as a broken reference. Write future paths that way (§ 15.9, finding 8).
>
> Est. time: 60–90 min including the closing-report dialog. The fold itself, once pre-flight is green, is about 15 minutes.

## Inheritance

This edition is **self-contained**: run it end to end without opening anything else. It inherits its section structure, its five questions, its two non-transferable protections, and its hard lesson from the v1 edition:

```
git show 26-07-23:work/missions/v1.subagent-boundary/runbooks/fold-and-close.md
git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/runbooks/fold-and-close.md
```

Both forms resolve; the tag form is the durable one. These are complete `git show <ref>:<path>` expressions — provenance data consumed whole by the reference gate, never tree references.

### The warning aimed at the next mission — **re-derive, never transcribe**

Every number in this document is **this mission's**, derived at rehearsal on 26-07-25. v1's constants were 46 / 64 / 62; v2's are **49 / 67 / 65**, because this mission added three files to `.claude/`. A future edition that inherits v2's numbers instead of re-deriving them is wrong the moment `.claude/` changes — which is every mission.

And the deeper rule, which is *not* about numbers:

> **The keep column is TRANSCRIBED from the specification. It is never derived from the tree.**

v1's *first* rehearsal derived the `work/` scaffold by grepping the tree. It went green. It would have smuggled mission archive into a purified `main` at ceremony time, and it passed only because the archive did not exist yet at rehearsal time. **A rehearsal that goes green by the wrong method is worse than one that fails honestly.** § 15 records how v2 discharged this, including a correction to v1's account of the hazard's mechanism.

---

## Before you start — your five questions

### Can this lose my mission's work? **No, and here is the mechanism.**

The fold is a **true merge** (`git merge --no-ff <branch>`), not a squash. Every object the mission produced stays reachable from `main`'s history *and* from the tag. The purification commit removes files from the **working tree**, not from history — `git show <tag>:<path>` retrieves any of them forever.

That is why the tag push is **mandatory** and why the tag is **never deleted**. It is the continuation protocol's anchor: the decision register (`.claude/ADR.md`) cites it in provenance pointers, and every one of those pointers resolves only while the tag exists. For v2 this is sharper than for v1 — see § 7's **archive-shape constraint**, where the register's forward-cited paths dictate the archive layout.

### Can I stop halfway? **Yes — everything before the push is local and reversible.**

You record a pre-fold ref at the very first step. Any failure at any stanza before § 11 recovers with `git reset --hard $(cat /tmp/fold-pre-ref)` (plus `git merge --abort` if a merge is in flight). Nothing on the mission branch is ever touched by the fold. After the push, `main` is public — a mistake is repaired by a further commit, never by rewriting or by deleting the tag.

### What if the pre-flight assertions fail? **Then the ceremony stops. That is the design.**

The assertions in § 3 run *before anything mutates*. A failure means the recipe no longer matches the tree it was rehearsed against. **Do not improvise a fix inside the ceremony** — go back, re-rehearse. Improvised resolutions inside a close ceremony are exactly the failure mode the assertions exist to prevent.

### Do I have to make the judgment call myself? **Yes. Two things are non-transferable.**

1. **The closing judgment** — `accomplished | failed | superseded` — is *yours*, rendered as an explicit utterance and recorded verbatim. It is never inferred from "proceed", from "looks good", or from silence.
2. **The panel attestation** (for missions whose success criteria include observability evidence) is *operator-authored*. An instrument cannot certify its own reading.

Both are expanded at § 5.

### Is any of it skippable?

- **Pre-flight (§ 1–3) is not skippable.** It is what makes the ceremony pure ceremony.
- **The `/close` ceremony (§ 4–8) is not skippable** — it is the close.
- **The fold (§ 9–11) is separable**: a mission can close without folding if template purification is not part of its charter. v2's charter D5 *does* include the fold.
- **`git gc` (§ 12) is optional and non-gating.** Never let it block.

---

## Preconditions

1. **You are the operator, and you invoked this deliberately.** `/close` is the one command the system never self-initiates. If you arrived here by any other path, stop.
2. **Branch and trunk identified.**
   ```sh
   git branch --show-current      # expect: 26-07-25
   git log --oneline -1 main
   ```
3. **Toolchain present.**
   ```sh
   bun --version
   ```
4. **Scratch space for the ceremony's helper scripts.** They are ceremony scaffolding and must **not** land in the tree.
   ```sh
   mkdir -p /tmp/fold && cd /tmp/fold
   ```
   Copy `derive.sh` and `purify.sh` (§ 9.0) there.

---

## 1. Archive sweep — the session store must be whole *before* the `git mv`

The close moves `work/sessions/` into the mission archive. A hole discovered mid-`git mv` is the failure this step exists to prevent.

**Derive the counts. Do not trust a written number.**

```sh
git grep -hoE '[a-z-]+@[a-z0-9-]+/[0-9a-f-]{36}' -- work '*.md' | sort -u | tee /tmp/fold/handles.txt
wc -l < /tmp/fold/handles.txt                                                      # distinct stamped handles
sed 's/.*\///' /tmp/fold/handles.txt | sort -u | tee /tmp/fold/uuids.txt | wc -l    # distinct UUIDs
while read -r u; do
  [ -e "work/sessions/play/$u.jsonl.gz" ] && echo "OK   $u" || echo "MISS $u"
done < /tmp/fold/uuids.txt
```

### The rehearsal-time snapshot — **read this as a snapshot, not a target**

Derived live on 26-07-25, mid-phase-4c: **7 handles / 4 distinct UUIDs.**

| Handle | Status at rehearsal |
| --- | --- |
| `architect@play/5d30e2de-8145-4fbd-b80c-c48bd99dff9c` | archived |
| `architect@play/76ba13c6-e6f5-4933-9e6c-7ef3fbdd6b7d` | archived |
| `architect@play/a9ddd6b3-7457-451c-85bd-a79a91b05e08` | **carried v1 handle** — see below |
| `executor@play/9362ff9f-c270-4704-97cc-14d527ba9f12` | live session, collected at `SessionEnd` |
| `manager@play/9362ff9f-…` | same UUID as above |
| `researcher@play/9362ff9f-…` | same UUID as above |
| `reviewer@play/9362ff9f-…` | same UUID as above |

> **A *higher* count at ceremony is expected, not drift** — phase 4's own close-out stamps raise it, and the mission is not finished at the time this snapshot was taken. **A *lower* count is the anomaly worth stopping for**: it means a stamped document was deleted or a stamp was stripped, and stamps live in never-rewritten historical files.
>
> The UUID count is the stable one. Handles are `role@machine/uuid`, so one session stamped under four roles yields four handles and one UUID — which is exactly what `9362ff9f` does here.

### The two `MISS` results, both expected

| UUID | Why it misses | Action |
| --- | --- | --- |
| `9362ff9f-c270-4704-97cc-14d527ba9f12` | the **live** hosting session — transcript open and growing; the `SessionEnd` archive-on-stamp hook collects it when the session ends | none; re-run this sweep post-close (§ 12 step 2) |
| `a9ddd6b3-7457-451c-85bd-a79a91b05e08` | the **founding architect** session, stamped at `.claude/ADR.md:85`. Its archive rode the v1 fold into that mission's archive and is no longer in the live store | none — **verify, do not backfill** |

Verify the carried handle rather than chasing it:

```sh
git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/sessions/play/a9ddd6b3-7457-451c-85bd-a79a91b05e08.jsonl.gz >/dev/null \
  && echo "OK: carried handle lives on the v1 tag"
```

- **Pass:** every UUID falls into exactly one bucket — archived, carried-on-a-prior-tag, or live-and-pending — and the buckets sum to the derived total.
- **Fail:** a `MISS` that is none of the three → a *new* LOST. **Stop and investigate before touching the archive**; that is precisely the hole this step exists to catch before the `git mv`.
- **Record:** the handle · role · status table with its arithmetic. It goes in the closing report.

**The carried-handle class is a v2 delta from v1.** v1 had three permanently-LOST handles (transcripts that predated archive-on-stamp, or belonged to another repo) and had to say plainly that they were not fold damage. v2 has **zero** LOST. It has one handle whose archive is *recoverable from a prior mission's tag* — which is the continuation protocol working, not a hole. Say so in the closing report so a future reader does not chase it.

---

## 2. Store integrity

```sh
cd work/sessions && sha256sum -c MANIFEST; cd -
```

- **Pass:** every line `OK`, zero failures. **Rehearsal-time: 14/14 OK.**
- **Note:** this check belongs to `/archive`, **upstream of the fold**. It is **N/A on the purified tree** — the fold strips both `work/sessions/MANIFEST` and `work/sessions/play/`. Run it here, on the branch, or not at all.
- **Fail:** a manifest mismatch → stop. A corrupted archive must be repaired before it is `git mv`'d into permanence.

---

## 3. Merge-surface assertions — run these *before anything mutates*

Record the recovery anchor first.

```sh
git checkout main
git rev-parse HEAD | tee /tmp/fold-pre-ref
```

### 3a. Remote reconciliation

```sh
git fetch origin
git merge-base --is-ancestor origin/main main && echo "OK: origin/main is an ancestor of local main"
git rev-list --count origin/main..main
```

- **Pass:** the `echo` fires.
- **Rehearsal-time record:** `origin/main..main` = **0**. `origin/main` and local `main` are the same commit (`74ca902`). **v2 has no backlog** — the fold's push at § 11 publishes the fold and nothing else. This is a delta from v1, which pushed a four-commit backlog alongside the fold. **Verify it yourself; do not assume it still holds.**
- **Fail (`--is-ancestor` non-zero):** local `main` and `origin/main` have forked. **Stop the ceremony.** Reconcile the remotes deliberately *outside* the ceremony, then restart from § 3.

### 3b. Clean tree

```sh
git status --porcelain
```

- **Pass:** empty.
- **Fail:** commit, stash, or clean, then re-run. Never fold over a dirty tree: the purification commit enumerates paths, and a stray staged file would ride along unenumerated.

### 3c. The merge surface is **conflict-free** — and that is an assertion, not a hope

```sh
git merge-tree --write-tree 26-07-25 main >/dev/null 2>&1; echo "merge-tree exit: $?"
git merge-tree --write-tree 26-07-25 main 2>&1 \
  | sed -n 's/^CONFLICT ([a-z/]*): Merge conflict in //p' | sort -u
```

- **Pass:** exit **0**, and the conflict list is **empty**.
- **Rehearsal-time record:** exit 0, zero conflicts. **v1's staged-conflict machinery collapses to assertions for v2** — there is no pre-resolved conflict, no `.claude/BASELINE.md` resolution to re-verify, and no A1–A3 content assertions, because there is nothing staged that could go stale.

> **Stop-on-any-conflict.** v1 carried a staged resolution and its rule was "any conflict *beyond the staged one* stops the ceremony." **v2 carries no staged resolution at all, so the rule tightens: *any* conflict stops the ceremony.** A conflict here means the tree drifted after the rehearsal. There is no verified resolution to fall back on, and improvising one inside the ceremony is the failure mode § 3 exists to prevent. Stop, re-rehearse, re-derive.
>
> Keep this paragraph. v1's version of it was earned: a conflict that *did not exist at reconnaissance* was created by a later phase editing `BASELINE.md`, and only the pre-flight re-run caught it. The premise died; the caution was right anyway.

---

## 4. Open the ceremony — draft the closing report **in dialog**

`work/missions/<v>/closing.md`. **The retrospective is a dialog, not a form.** Do not fill it in and present it for approval; talk it through.

It carries:

- **Outcome** — the judgment (§ 5), verbatim.
- **What shipped vs what didn't, and why.**
- **What the *work system itself* taught** — the DX retrospective. This is the part future missions actually mine. For v2 this includes the campaign's A3 child-collection trial (`work/notes/26-07-25.child-collection-evidence.md`) and the three-Manager synchronous-dispatch practice.
- **Items carried forward** — cross-reference the triage dispositions in § 6.
- **A reader's index** — the handful of archived docs a future planner should actually read, so the archive has a front door. Include § 1's carried-handle note here.

---

## 5. The two non-transferable protections

> **State both of these to the operator explicitly. They are not procedural formalities; they are what keeps the archive honest.**

### 5a. The closing judgment

A mission closes `accomplished | failed | superseded`. **Failure is first-class** and closes with the same ceremony; a mission may also close with open or deferred work orders — completion is not exhaustion of the queue.

- The judgment is **rendered by the operator as an explicit utterance** and **recorded verbatim** in the closing report.
- It is **never inferred** from "proceed", from "looks good", or from silence.
- An agent may *draft* the report. It may not *render* the verdict.

**Rationale:** a closing campaign is frequently its own mission's measuring instrument, and **an instrument cannot certify its own reading.** The archive must not teach future missions that campaigns may certify themselves.

### 5b. The panel attestation

Where a mission's success criteria include observability evidence — the operator having *watched* the system work — that attestation is **operator-authored** and lands **before the ceremony opens**.

- If it does not arrive, the criterion is **incomplete**, and the closing report must say so plainly.
- *"Accomplished, with the stated evidence gap"* is a legitimate operator verdict.
- **A backfilled attestation is not.** Do not reconstruct it after the fact.

---

## 6. Triage — prepared dispositions

These are **prepared so you confirm rather than derive.** Read each, confirm or overrule. Contestable calls are yours.

| Item | Prepared disposition |
| --- | --- |
| `work/todos/26-07-25.execute-m1-janitor.md` (campaign log, `in-progress`) | **File to `_done/` at milestone close, then archive with the mission.** It is the M1 campaign log; it closes when the Executor's blocking milestone-close pass returns |
| `work/todos/26-07-25.prove-pass.md` (`open`) | **File to `_done/`, then archive.** Phase 4a's dogfood-pass record; its findings are already routed |
| `work/todos/26-07-25.prove-close.md` (`open`) | **File to `_done/`, then archive.** This order — 4c. Its own close-out is the last thing filed before the ceremony |
| `work/todos/bugs/26-07-25.bug.janitor-audit-method-gap.md` (`open`) | **Carries to a future mission.** 4a's instrument filing: the pass was blind to a declaration-consistency class. Not a defect this ceremony can settle |
| `work/todos/bugs/26-07-25.bug.orchestration-return-path.md` (`open`) | **Carries.** The orchestration return-path defect; paired with the standing proposal below. Operator-gated |
| **Divergence B** — the footgun-index convention (eight files instructing roles to reconcile an index the purified root `CLAUDE.md` does not carry) | **Raised and open by operator ruling; 4a staged it.** Carries as a design question. **Do not resolve it in the ceremony** — it spans seven `.claude/` policy docs plus `work/footguns/README.md`, and closing it silently would close a rung-3 escalation without an answer |
| **4a's open forks** | **Carry as raised-not-resolved.** They are recorded in `26-07-25.prove-pass.md`, which archives with the mission and stays reachable at the tag |
| `work/proposals/26-07-25.return-path.md` (`status: proposed`) | **STANDING — do NOT archive it.** A separate, newly-filed proposal under operator review, unrelated to this milestone's enactment. See the note below: it needs a deliberate decision, not a default |
| `work/proposals/_enacted/26-07-25.repo-hygiene.md` | **Archives wholesale with the mission**, per `work/README.md` § Layout. Its archived path is **constrained** — see § 7 |
| `work/footguns/claude-bin.md` | **Carries as a live ledger entry, or promotes to `.claude/ADR.md` § Standing hazards.** The `.claude/bin/` JSDoc comment-close hazard is *already* in § Standing hazards on the product side, so the ledger entry is arguably redundant; v1's precedent was to absorb the ledger into ADR and note it in the report. **Operator call.** Note that `work/PROJECT.md` § All roles declares this ledger's contents by name, and that file is stripped whole — so the declaration does not need reconciling, it disappears |
| `work/notes/26-07-25.child-collection-evidence.md` | **Operator call.** `work/README.md` § Layout gives `notes/` no archive lifecycle ("graduates into proposals or evaporates"), and v1 archived no notes. It is strip-side either way; the only question is whether the tag preserves it under `work/notes/` or under the mission archive |
| `work/runbooks/` | **Retire with the mission — including this runbook.** It archives as the workflow's second close-and-fold recipe; the next mission inherits it by reading it out of the archive, not by keeping it live on `main` |
| `docs/research/` | **Nothing to triage** — empty |

### The standing proposal — a decision, not a default

`work/proposals/26-07-25.return-path.md` is on the **strip list**: purification removes it from `main` along with everything else under `work/proposals/`. That is correct — the template ships no instance proposals. The question is where the *tag* preserves it, and there are two precedents in tension:

- **`work/README.md` § Layout** says: "At `/close`, `_enacted/` archives wholesale with the mission; **standing proposals persist**." Persisting means staying at `work/proposals/26-07-25.return-path.md` on the branch.
- **v1's actual practice** archived standing proposals *into* the mission archive — v1's `proposals/` directory on the tag carries `26-07-11.work-queue-tier.md`, `26-07-22.lan-intercom.md`, `26-07-22.claude-intercom.md`, all of which were standing at close.

**Prepared recommendation, not a decision:** follow § Layout and leave it in `work/proposals/`. **Consequence to state out loud either way:** after the fold it is recoverable only as `git show v2.repo-hygiene-closed:<path>`, and carrying it forward means the next mission's `/plan` re-seeds it onto the new branch. Nothing carries itself.

---

## 7. Archive the mission

Move the mission's work system into `work/missions/<v>/`. **The archive is a snapshot, not a cleaned-up rewrite** — do not tidy prose on the way in.

### The archive-shape constraint — read this before typing any `git mv`

`.claude/ADR.md`'s v2 block **forward-cites paths inside the archive you are about to create.** Those cites become resolvable the instant the tag is cut, and frozen forever after. The archive's layout is therefore **not** a free choice:

```sh
grep -oE 'v2\.repo-hygiene-closed:[A-Za-z0-9._/-]+' .claude/ADR.md
```

Rehearsal-time output — **two** forward-cited archive paths:

```
v2.repo-hygiene-closed:work/missions/v2.repo-hygiene/proposals/_enacted/26-07-25.repo-hygiene.md
v2.repo-hygiene-closed:work/missions/v2.repo-hygiene/MISSION.md
```

Note the first one: **`proposals/_enacted/`, with the `_enacted/` segment preserved.** A `git mv work/proposals/_enacted work/missions/<v>/proposals/` into a not-yet-existing target renames `_enacted` → `proposals` and lands the file at `proposals/26-07-25.repo-hygiene.md` — **breaking the register's pointer permanently.** (The rehearsal made exactly this mistake and caught it by diffing against v1's actual archive on the tag, where `proposals/_enacted/` *is* preserved. v1's own § 7 recipe reads ambiguously on this point.)

### The enumeration

```sh
A=work/missions/v2.repo-hygiene
mkdir -p "$A/milestones" "$A/proposals" "$A/footguns" "$A/runbooks" "$A/sessions" \
         "$A/todos/bugs" "$A/todos/_done"

git mv work/MISSION.md                        "$A/"
git mv work/milestones/1.janitor              "$A/milestones/"
git mv work/todos/26-07-25.execute-m1-janitor.md \
       work/todos/26-07-25.prove-pass.md \
       work/todos/26-07-25.prove-close.md     "$A/todos/"          # or from _done/, per § 6
git mv work/todos/bugs/26-07-25.bug.janitor-audit-method-gap.md \
       work/todos/bugs/26-07-25.bug.orchestration-return-path.md "$A/todos/bugs/"
git mv work/todos/_done/26-07-25.competency.md \
       work/todos/_done/26-07-25.floor.md \
       work/todos/_done/26-07-25.reference-gate.refactor.md \
       work/todos/_done/26-07-25.wiring.md    "$A/todos/_done/"
git mv work/proposals/_enacted                "$A/proposals/_enacted"   # PRESERVE _enacted/
git mv work/footguns/claude-bin.md            "$A/footguns/"            # unless promoted to ADR (§ 6)
git mv work/runbooks/fold-and-close.md        "$A/runbooks/"
git mv work/sessions/play                     "$A/sessions/"
git mv work/sessions/MANIFEST                 "$A/sessions/"
```

**Not moved:** `work/proposals/26-07-25.return-path.md` (standing — § 6), `work/notes/26-07-25.child-collection-evidence.md` (operator call — § 6), `work/PROJECT.md` (stripped whole — § 9.6). Re-derive the enumeration against `git ls-files` at ceremony time; the rehearsal's list is 26 files plus the session store.

**`git mv work/proposals/_enacted` leaves `work/proposals/` without its `.gitkeep`.** § 9.0's `purify.sh` restores it. This is why that step exists even though it is currently a no-op.

### Verify the forward-cites before the tag

Run this **after** the `git mv`s and **before** § 8b. After the tag, the paths are frozen.

```sh
grep -oE 'v2\.repo-hygiene-closed:[A-Za-z0-9._/-]+' .claude/ADR.md | sed 's/^[^:]*://' \
  | while IFS= read -r p; do [ -e "$p" ] && echo "OK   $p" || echo "MISS $p"; done
```

- **Pass:** every line `OK`.
- **Fail:** any `MISS` → **stop.** Fix the archive layout to match the register, or amend the register — but do it *before* the tag exists, because afterwards neither is repairable without a second published tag.

Other notes:

- The closing report (`work/missions/<v>/closing.md`) goes in this directory too.
- The fold strips everything under `work/missions/<v>/` anyway. The `git mv` still matters — it is what puts the archive in the **branch's** final state, which is what the tag preserves.
- **Enumerate paths; never `git add -A`.**
- **Fail:** any `git mv` erroring on a missing path → you enumerated against a stale listing. Re-derive from `git ls-files` and retry. Nothing is lost.

---

## 8. Ledger row, then tag

### 8a. Ledger

Add a row to `work/missions/README.md`. The table already carries v1's row.

```markdown
| `v2.repo-hygiene` | <outcome> | <one line> | `git show v2.repo-hygiene-closed:work/missions/v2.repo-hygiene/closing.md` |
```

> **Match the existing row's Report style.** v1's row on this branch was converted from a markdown link to a complete `git show <tag>:<path>` provenance expression — because after the fold, `work/missions/<v>/closing.md` does not exist in the tree and a markdown link is a dead link. Write v2's row the same way. (See § 15's keep-with-adaptation survey: this file's branch diff is exactly that conversion.)

### 8b. Commit the close, then tag it

```sh
git add -- <enumerated paths>
git commit -m "Close: mission v2.repo-hygiene — <outcome>

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git tag v2.repo-hygiene-closed
```

### 8c. Verify the tag string **verbatim** against the register, in both directions

The decision register cites the tag in provenance pointers. A one-character mismatch silently breaks every one of them.

```sh
git tag -l 'v2.repo-hygiene-closed'                              # the tag exists
grep -o 'v2\.repo-hygiene-closed' .claude/ADR.md | wc -l         # raw occurrences
grep -c  'v2\.repo-hygiene-closed' .claude/ADR.md                # lines carrying it
```

- **Pass:** the tag exists, and **3 raw occurrences across 3 lines** (rehearsal-derived — re-derive it). Both counts are stated so either counting method matches; `grep -c` counts lines, `grep -o | wc -l` counts occurrences, and they can legitimately differ.
- **Both directions:** the tag string must match what the register cites (above) **and** the register must cite nothing else that looks like a v2 tag:
  ```sh
  grep -oE 'v2[A-Za-z0-9._-]*-closed' .claude/ADR.md | sort -u   # expect exactly one string
  ```
- **Fail:** any mismatch → **stop.** Reconcile before pushing anything. A published tag is never renamed.

> **The forward-cites flip from warn to resolvable the moment this tag is cut.** Before the tag, `reference-gate` reports the three v2 provenance pointers as **warnings** (unresolvable ref — by design; `.claude/ADR.md` forward-cites the open mission's close tag). After the tag, they resolve. A warning-to-green transition here is the expected outcome of § 8b, not a change anyone made.

---

## 9. The fold — merge and purify

Runs on `main`. Reverts wholly to `/tmp/fold-pre-ref` at any point before § 11.

### 9.0 The two helper scripts

Put both in `/tmp/fold/`. They are ceremony scaffolding — **they must not enter the tree.**

**`derive.sh`** — deterministic list generation. The load-bearing comment is not decoration: the `work/` scaffold is **transcribed from BASELINE step 2, never grepped.**

```sh
#!/usr/bin/env bash
# Derive keep / expected-tree / strip deterministically. Run from the fold target's root.
# $1 = output directory.  Emits keep.txt (65), expected-tree.txt (67), strip.txt.
set -euo pipefail
OUT="$1"; mkdir -p "$OUT"

# --- the work/ scaffold: BASELINE step 2's enumeration, TRANSCRIBED, NOT grepped ---
# (a grep for */README.md under work/ is unsound: its correctness depends on the
#  archive's shape, which is an operator choice made downstream of this derivation)
cat > "$OUT/work-18.txt" <<'EOF'
work/README.md
work/design/README.md
work/design/sessions/README.md
work/design/system/README.md
work/footguns/README.md
work/milestones/README.md
work/missions/README.md
work/notes/README.md
work/proposals/README.md
work/proposals/_deferred/.gitkeep
work/proposals/_enacted/.gitkeep
work/proposals/_rejected/.gitkeep
work/runbooks/README.md
work/sessions/README.md
work/todos/README.md
work/todos/_cancelled/.gitkeep
work/todos/_done/.gitkeep
work/todos/bugs/.gitkeep
EOF
sort -o "$OUT/work-18.txt" "$OUT/work-18.txt"
[ "$(wc -l < "$OUT/work-18.txt")" = 18 ] || { echo "FAIL: work enumeration != 18"; exit 1; }

# --- step 2's "Also copy" list + the governing invariant's step-3 exception set,
# --- unioned with the LIVE .claude manifest (a product-scoped tree read; see § 15) ---
{ printf '%s\n' CLAUDE.md README.md .gitignore .cbmignore \
                .archive/README.md docs/README.md docs/research/README.md src/README.md
  git ls-files -- .claude
} | sort -u > "$OUT/nonwork.txt"
[ "$(wc -l < "$OUT/nonwork.txt")" = 49 ] || { echo "FAIL: non-work keep != 49 (got $(wc -l < "$OUT/nonwork.txt"))"; exit 1; }

cat "$OUT/nonwork.txt" "$OUT/work-18.txt" | sort -u > "$OUT/expected-tree.txt"
[ "$(wc -l < "$OUT/expected-tree.txt")" = 67 ] || { echo "FAIL: expected tree != 67"; exit 1; }

# keep = expected-tree minus the two purification-artifact .gitkeeps
grep -vE '^work/(todos/_done|proposals/_enacted)/\.gitkeep$' "$OUT/expected-tree.txt" > "$OUT/keep.txt"
[ "$(wc -l < "$OUT/keep.txt")" = 65 ] || { echo "FAIL: keep != 65"; exit 1; }

git ls-files | sort > "$OUT/tree.txt"
comm -23 "$OUT/tree.txt" "$OUT/expected-tree.txt" > "$OUT/strip.txt"
comm -13 "$OUT/tree.txt" "$OUT/keep.txt"          > "$OUT/keep-absent.txt"

echo "tree=$(wc -l < "$OUT/tree.txt")  keep=65  expected=67  strip=$(wc -l < "$OUT/strip.txt")  keep-paths-missing-from-tree=$(wc -l < "$OUT/keep-absent.txt")"
[ -s "$OUT/keep-absent.txt" ] && { echo "FAIL: keep-column paths absent from the tree:"; cat "$OUT/keep-absent.txt"; exit 1; }
echo "zero-unclassified: OK (tree = expected-tree ⊎ strip)"
```

**The three pinned assertions are ceremony stop conditions.** `18`, `49`, `67`/`65` are rehearsal-derived on 26-07-25.

- **`FAIL: non-work keep != 49`** means **`.claude/` gained or lost a file since the rehearsal.** Stop. Repo convention requires `BASELINE.md`'s manifest and the keep column to be reconciled in the same commit, and that is doctrine authoring, not a ceremony step. **Do not edit the number to make it pass** — reconcile `BASELINE.md`, then re-rehearse.
- **`FAIL: work enumeration != 18`** means you mistyped the transcription, or BASELINE step 2 changed. Re-read step 2.
- **`FAIL: keep-column paths absent from the tree`** means a keep-column file was deleted or renamed. Stop, reconcile the manifest.

> **v2's partition differs from v1's, and the difference is real.** v1 asserted `tree = keep ⊎ strip` because its two purification-artifact `.gitkeep`s did not exist yet. On v2's branch **both already exist** — they landed in v1's own purification commit and rode `main` into this branch. So the exact partition is **`tree = expected-tree ⊎ strip`** (rehearsal: `102 = 67 + 35`), and `keep`'s role narrows to the *must-already-exist* assertion (`keep-absent = 0`). If a future mission deletes one of those `.gitkeep`s, the equation reverts to v1's form and `purify.sh` step 2 stops being a no-op. Both forms are correct; know which one you are in.

**`purify.sh`** — the mutating half. Every removal is enumerated from `strip.txt`. **No `git add -A`. No `git add .`.**

```sh
#!/usr/bin/env bash
# Purification commit — run from the repo root of the fold target.
# $1 = path to strip.txt (derived, one path per line)
# $2 = the ref carrying main's pre-fold generic copies: $(cat /tmp/fold-pre-ref)
set -euo pipefail
STRIP="$1"; PRE="$2"

# --- 1. enumerated removals (never `git add -A`) -----------------------------
# empty strip list = already purified; the step is a no-op, not an error
if [ -s "$STRIP" ]; then xargs -a "$STRIP" -d '\n' git rm -q -r --; fi

# --- 2. purification-artifact .gitkeeps --------------------------------------
# v2: both are already tracked, so this is a verified no-op. Kept because § 7's
# `git mv work/proposals/_enacted` removes work/proposals/.gitkeep with the directory.
for d in work/todos/_done work/proposals/_enacted; do
  mkdir -p "$d" && : > "$d/.gitkeep" && git add -- "$d/.gitkeep"
done

# --- 3. KEEP-WITH-ADAPTATION — restore-or-delete only ------------------------
# 3a. work/milestones/README.md — REGION restore, NOT a wholesale file restore.
#     v1's `git checkout <preref> -- work/milestones/README.md` is WRONG for v2:
#     the branch also improved the generic "Phase docs" bullet (the declared-structure
#     landing rule), and a wholesale restore silently reverts that doctrine off the
#     template. Restore only the intro region — lines 3..(before `## Conventions`) —
#     which is exactly where the instance roadmap lives.
git show "$PRE:work/milestones/README.md" | sed -n '3,/^## Conventions$/p' | sed '$d' > /tmp/fold/mstone-head.txt
{ sed -n '1,2p' work/milestones/README.md
  cat /tmp/fold/mstone-head.txt
  sed -n '/^## Conventions$/,$p' work/milestones/README.md
} > /tmp/fold/mstone-new.md
mv /tmp/fold/mstone-new.md work/milestones/README.md

# 3b. work/runbooks/README.md — empty the "Held here" table's data rows
sed -i '/^## Held here$/,$ { /^| \[/d }' work/runbooks/README.md

# 3c. work/README.md and work/proposals/README.md — NO adaptation for v2.
#     Verified at rehearsal: all four of v1's work/README.md sed anchors and the
#     work/proposals/README.md founding-series anchor match ZERO lines; the machine
#     registry already carries the generic `<machine>` placeholder row.

git add -- work/milestones/README.md work/runbooks/README.md
```

### 9.1 The merge

```sh
git checkout main
git merge --no-ff 26-07-25
```

- **Expected:** clean auto-merge, no conflict prompt. This is a delta from v1, whose merge stopped on a staged `.claude/BASELINE.md` conflict.
- **Fail — any conflict:** `git merge --abort`, then **stop** (§ 3c). There is no staged resolution for v2.

```sh
git diff --name-only --diff-filter=U     # expect: empty
git diff --stat 26-07-25 HEAD            # expect: EMPTY — main contributed nothing the branch lacked
```

### 9.2 Purify

```sh
bash /tmp/fold/derive.sh /tmp/fold/lists
bash /tmp/fold/purify.sh /tmp/fold/lists/strip.txt "$(cat /tmp/fold-pre-ref)"
git ls-files | wc -l                     # expect: 67
```

### 9.3 Inspect the adaptations **before** committing

Keep-column files that carry instance content *in their text*, which `git rm` structurally cannot reach. The purification de-instances them by **restore-or-delete only — never newly authored prose.**

| File | Adaptation | Kind |
| --- | --- | --- |
| `work/milestones/README.md` | replace the intro region with the pre-fold ref's own intro paragraph, deleting the `## Roadmap` heading and its table; **keep** the branch's generic Phase-docs improvement | **region restore** |
| `work/runbooks/README.md` | delete the "Held here" table's data rows, leaving the empty table | **delete** |

```sh
git diff --cached -- work/milestones/README.md work/runbooks/README.md
git diff main -- work/milestones/README.md    # must show ONLY the generic Phase-docs hunk
```

- **Pass:** every hunk is a pure deletion or a restore. Concretely: `work/milestones/README.md` loses the mission intro line + `## Roadmap` heading + one table (7 lines) and regains `main`'s one-sentence stub; `work/runbooks/README.md` loses one table row. The second command's output is a single hunk containing only the `## Scope (a phase that creates files states where they land …)` addition.
- **Fail — any hunk containing a newly composed sentence:** **stop and escalate that single file.** The restore-or-delete constraint is what keeps this class *interpretation* of BASELINE's project-generic claim rather than *design*. A composed sentence escalates **individually**; the class does not.
- **Fail — `git diff main -- work/milestones/README.md` empty:** the region restore over-reached and reverted the generic doctrine hunk. Fix the recipe, not the file.

### 9.4 Commit the purification

```sh
git commit -m "Organize: purify main to the generic bootstrap template

Strip instance content per the derived purification manifest; de-instance two
keep-column READMEs by restore-or-delete.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

Enumerate **change classes** in the message, not individual paths.

> **§ 9.2–9.4 is idempotent.** Re-running `derive.sh` + `purify.sh` on an already-purified tree yields `strip=0`, the `git rm` step no-ops, the `.gitkeep` step no-ops, both adaptations find nothing to change, and `git status --porcelain` comes back empty. **Verified in rehearsal.**

---

## 10. The template quality gate on the result

Run all of it before pushing. **If any of this reds, the fault is in the manifest or the recipe — never in the gate. Do not widen a list to make it pass.**

### 10a. File listing — expected vs actual (**the hard-green condition**)

```sh
git ls-files | sort | diff /tmp/fold/lists/expected-tree.txt -   && echo "IDENTICAL — 67 paths"
git ls-files 'work/*' | sort | diff /tmp/fold/lists/work-18.txt - && echo "IDENTICAL — 18 paths"
```

- **Pass:** both `diff`s empty, **in both directions** — that is what `diff` gives you, and it is the point. The second is the sharper one: the purified `work/` listing equals BASELINE bootstrap step 2's transcribed 18-path derivation exactly.
- **Record (rehearsal-verified):** 67 = 49 non-work + 18 `work/`. Of the 49: **41** under `.claude/`, 8 at root / `docs/` / `src/` / `.archive/`.

### 10b. Reference resolution — **`reference-gate` does not run here, and that is by design**

```sh
bun .claude/bin/reference-gate check; echo "exit=$?"
```

**Rehearsal-observed on the purified tree — exit `3`**, with:

```
no declaration: work/PROJECT.md is absent — this repo declares no structure, so the
reference-integrity axis has nothing to read. Author it per .claude/BASELINE.md bootstrap step 3.
```

**This is correct behavior, not a failure of the fold.** The gate reads its scope roots, exclusions, planning-artifact roots and sanctioned absences from `work/PROJECT.md` § Structure — and **the fold strips `work/PROJECT.md`.** The file that defines the gate does not survive the operation the gate validates. A purified template *has* no quality gate of its own; a consuming repo authors one at bootstrap step 3.

> **Fail condition for this step is any exit code other than 3, or a different message.** Exit 3 with the no-declaration message is the pass. If it exits 0, `work/PROJECT.md` survived purification — stop, that is a strip-list fault.

**Inline fallback recipe** — run this instead, since the gate cannot:

```sh
git ls-files '*.md' | xargs grep -rhoE 'git show [A-Za-z0-9._<>-]+:[A-Za-z0-9._/<>-]+|(\.claude|work|docs|src)/[A-Za-z0-9._/<>-]+' \
  | grep -v '^git show ' | sed 's/[.,)`:]*$//' | grep -vE '<|>' | sort -u > /tmp/fold/refs.txt
wc -l < /tmp/fold/refs.txt
while IFS= read -r p; do [ -e "$p" ] || echo "UNRESOLVED: $p"; done < /tmp/fold/refs.txt
```

The leading alternative consumes `git show <ref>:<path>` expressions **whole**, so tag-qualified provenance pointers are never extracted as tree references. Without it, the register's pointers would be checked as live paths and this gate would red for a cause that is not the fold's.

- **Pass:** every unresolved path is either in the § 14 table or in the known-false-positives table below.
- **Rehearsal-observed: 56 paths extracted, 8 unresolved — 6 sanctioned, 2 false positives.**

| False positive | Origin | Why it is not a reference |
| --- | --- | --- |
| `~/.claude/projects/` | `.claude/commands/archive.md`, `work/sessions/README.md` | It is `~/.claude/projects/…`, a **home-directory** path. The crude regex drops the `~/` prefix; the real `reference-gate` does not |
| `…/docs/sessions` | `work/README.md:13` | A slash-separated **prose list** — "todos/milestones/proposals/design/footguns/runbooks/docs/sessions" — not a path |

Both are artifacts of the fallback regex alone. **Do not chase them, and do not add them to the sanctioned-absence list** — the list describes real absences, not parser noise.

- **Fail — an unresolved path outside both tables:** manifest or recipe fault; fix there.
- **Fail — anything anomalous about `work/PROJECT.md` beyond its listed sanctioned absence:** escalate. That is an upstream doctrine failure, not something to work around by widening the list.

### 10c. Tooling smoke

```sh
bun .claude/bin/reference-gate           ; echo "exit=$?"   # usage, exit 1
bun .claude/bin/session-archive          ; echo "exit=$?"   # usage, exit 1
bun .claude/bin/consult                  ; echo "exit=$?"   # usage, exit 1
printf ''        | bun .claude/bin/commit-guard ; echo "exit=$?"   # silent, exit 0
printf 'garbage' | bun .claude/bin/commit-guard ; echo "exit=$?"   # silent, exit 0
```

- **Pass:** usage text + exit 1 for the first three; silence + exit 0 for both `commit-guard` arms (the backstop never breaks a session). **All five verified on the purified simulated tree at rehearsal.**
- **`reference-gate` no-args is the new row** this mission added to the smoke set. Note it exercises a different path from § 10b: no-args prints usage and exits **1**; `check` without a declaration exits **3**.
- **Two permanent adaptations, recorded so nobody re-litigates them:**
  - **`commit-guard`'s TTY arm is untestable from a script.** The spec says an interactive terminal gets usage + exit 1; a scripted run has no TTY, so only the stdin arms are exercised. This is a property of the check, not a shortcut.
  - **`sha256sum -c MANIFEST` is N/A on the purified tree.** The fold strips `work/sessions/MANIFEST` along with the store. Its absence is sanctioned (§ 14). Run it on the **branch** at § 2 instead.
- **Fail:** any other exit → a `bin/` script broke in the merge. `git reset --hard $(cat /tmp/fold-pre-ref)` and diagnose off the ceremony clock.

### 10d. `/initialize` — manual walkthrough

**Do not start a Claude session in the fold target to run this if session hooks are live.** A `SessionEnd` archive hook and a `Stop` commit-guard hook would write into `work/sessions/` and corrupt the very listing § 10a diffs. Evaluate the checks by hand against `.claude/commands/initialize.md`. Only the MCP check needs `claude mcp list`, and it is host-scoped — run it from a normal clone.

Expected outcomes: **§ 13.**

---

## 11. Push

```sh
git push origin main
git push origin v2.repo-hygiene-closed      # MANDATORY
git push origin 26-07-25:26-07-25
```

- **The tag push is mandatory.** It is the continuation protocol's anchor. An unpushed tag makes every provenance pointer in the register unresolvable for anyone but this machine — and § 7 established that two of those pointers name paths that exist *only* inside this tag.
- **The branch push costs nothing and is worth doing.** The mission's objects travel with the tag regardless — a default `git clone` fetches all tags — so pushing the branch ref adds no clone weight. What it buys is **navigability by name** instead of by tag archaeology.
- **`main`'s push carries no backlog** for v2 (§ 3a: `origin/main..main` = 0). Re-verify; if a backlog appeared, say so out loud before you run it.

**Fail — `main` push rejected (non-fast-forward):** someone pushed to `origin/main` between § 3a and here.
```sh
git fetch origin
git merge-base --is-ancestor origin/main main    # re-assert § 3a
```
If that now fails, **do not force.** Reset to `$(cat /tmp/fold-pre-ref)`, reconcile the remotes, and re-run from § 3. The fold is cheap to redo; there is no state outside these two local commits.

**Fail — tag push rejected (`already exists`):** a tag of that name is already on the remote. Stop; check whether it points at the same object (`git ls-remote --tags origin`). **Never delete or force-move a published tag.**

**Fail — branch push rejected:** harmless; the branch is a convenience. Investigate afterward, off the ceremony clock.

---

## 12. Post-fold verification and hand-back

1. **Confirm the fold landed:**
   ```sh
   git ls-remote --tags origin | grep repo-hygiene   # the tag resolves on the remote
   git log --oneline -3 origin/main
   git ls-files | wc -l                              # 67
   git diff --stat 26-07-25 HEAD                     # merge proof — pre-purify only
   ```
2. **Re-run the § 1 archive sweep** (or `/archive`) once the close session has ended, to confirm the live-session handle landed. **`work/sessions/play/<uuid>.jsonl.gz` should now exist** for UUID `9362ff9f-c270-4704-97cc-14d527ba9f12` — except that the fold has already `git mv`'d the store into the archive, so check the archived location on the branch. A handle still missing after the session ended is a *new* LOST and must be investigated.
3. **Confirm the ADR's forward-cites now resolve:**
   ```sh
   grep -oE 'v2\.repo-hygiene-closed:[A-Za-z0-9._/-]+' .claude/ADR.md \
     | while IFS= read -r r; do git show "$r" >/dev/null 2>&1 && echo "OK   $r" || echo "MISS $r"; done
   ```
   All should be `OK`. This is the warn→resolvable flip § 8c predicted, now observable.
4. **Confirm no ceremony scaffolding leaked into the tree:**
   ```sh
   git status --porcelain     # empty
   ls /tmp/fold               # the scripts live here, not in the repo
   ```
5. **Optional, explicitly non-gating: `git gc`.** Safe operator hygiene, deliberately **outside** the ceremony. Never let its absence block anything.
6. **Hand back.** The next mission's `/plan` inherits: the carried todos from § 6, divergence B, the standing return-path proposal (which must be **re-seeded**, not carried automatically — § 6), and any charter material the closing report flagged. Seeding the next mission is **not** part of this ceremony.

---

## 13. `/initialize` expected-outcomes table

> **This table doubles as the verification sheet for every future consumer's bootstrap.** A freshly-copied template is *supposed* to fail some of these; a template that passes everything has shipped somebody's project facts. Read it that way, not just as this fold's report card.

| # | Check | Expected | Why |
| --- | --- | --- | --- |
| 1 | Baseline integrity | **PASS — 41 tracked `.claude/` files** | 22 agents + 11 commands + 5 `bin/` + `settings.json` + `BASELINE.md` + `ADR.md`. Manifest 1:1 — no gaps, no strays. **This is the § 9.0 `nonwork != 49` assertion's other half: 41 + 8 = 49.** v1 was 38; the +3 is exactly `agents/janitor.md`, `commands/clean.md`, `bin/reference-gate` |
| 2 | Capabilities (MCP) | **EXPECTED-RED ×2 — host noise, not fold damage** | `chrome-devtools` configured but not connecting; `codebase-memory-mcp` index absent for this repo. **Both pre-existing and host-side** — nothing the fold touched, and both were already ruled environment-side during phase 4. `context7` and `playwright` connect. `.cbmignore` present |
| 3 | Hooks resolve | **PASS** | Both `settings.json` hook commands point at existing files (`session-archive`, `commit-guard`); both parse under `bun` |
| 4 | Spawn-depth cap | **PASS** | `env.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` present and `"2"` |
| 5 | Keystone docs | **EXPECTED-RED — definitionally** | Root `CLAUDE.md` present; `work/PROJECT.md` **absent**. BASELINE bootstrap step 3 authors it *after* the audit flags it. A green here on a fresh template would mean the template shipped somebody else's supplement. **This is the same absence that makes § 10b's `reference-gate` exit 3** — one cause, two red lights |
| 6 | Work-system scaffold | **PASS** | All 18 files present and matching `work/README.md`'s layout table, verified by § 10a's second `diff` |
| 7 | Git hygiene | **PASS** | `.gitignore` covers `.env*` + key patterns, `tmp/`, `.codebase-memory/`, `node_modules/`, editor cruft; `git status` clean |
| 8 | Session durability | **PASS (partial, correctly)** | `work/sessions/MANIFEST` absent → `sha256sum -c` N/A (§ 14 — the store is created by the first sweep). Zero stamped handles remain under `work/`, so the spot-check is vacuously satisfied |
| 9 | Toolchain | **PASS** | `bun` resolves |

**Green condition:** checks 1, 3, 4, 6, 7, 8, 9 green; checks 2 and 5 **expected-red per the rows above**. Anything else is a fault in the manifest or the recipe.

---

## 14. The sanctioned-absence list — inline, transcribed from § Structure

> **Why this is reproduced here rather than referenced.** It is defined in `work/PROJECT.md` § Structure — and **the fold strips `work/PROJECT.md`.** The file that defines the gate does not survive the operation the gate validates. The list must live inline in this runbook, or it is lost at exactly the moment it is needed.
>
> This is fine by design: the purified template carries **no** quality gate of its own. A consuming repo authors one at bootstrap step 3, and this table is the shape it should start from.

Transcribed verbatim from `work/PROJECT.md` § Structure → *Sanctioned absences* as of 26-07-25 — **nine** entries, where v1's inline table had seven (v1 collapsed the three `work/design/` entries into one row):

| # | Sanctioned absence | Created by |
| --- | --- | --- |
| 1 | `src/_archive/` | first sub-codebase retirement |
| 2 | `tmp/*` | runtime stream logs. **Not consumed by the reference gate** — `tmp/` is not a scope root, so no `tmp/`-prefixed string is ever extracted. Declared for the cleanliness and scaffold axes, which do read it |
| 3 | `work/MISSION.md` | `/plan` at mission tier |
| 4 | `work/PROJECT.md` | authored at bootstrap step 3 — absent in a bare template tree |
| 5 | `work/todos/BACKLOG.md` | first `/triage` |
| 6 | `work/sessions/MANIFEST` | first archive sweep |
| 7 | `work/design/DESIGN.md` | founding `/design` |
| 8 | `work/design/system/` — its contents | founding `/design`; the `README.md` is scaffolded |
| 9 | `work/design/sessions/` — its contents | founding `/design`; the `README.md` is scaffolded |

**Rules for using it:**

- An unresolved reference **on this list** is green. An unresolved reference **off this list** is a fault in the manifest or the recipe — fix those, never the list.
- **Provenance pointers are not tree references.** Paths written as complete `git show <ref>:<path>` expressions are historical data; the extraction consumes them whole. This is why such pointers must always be written in full and never elided — that syntax is what makes them recognizable. **Do not exempt individual paths instead.**
- **v1's inline-list caveat is discharged.** v1 recorded a known divergence: `.claude/BASELINE.md`'s "Paths that post-date the scaffold" named only 3 entries against the gate's 7. Phase 4a's dogfood pass detected that divergence (seeded divergence A) and phase 4's remedy made § Structure the single authoritative home, with BASELINE step 2 explicitly demoted to "the template default, stated in prose; it is not what tooling reads." **The two lists no longer race** — one is prose guidance, one is the parse target, and the layering is stated in BASELINE itself.

---

## 15. Rehearsal record

> **The load-bearing section.** It records not just what was derived but **by what method**, because the method is what a future ceremony has to trust.

**Rehearsed**: 26-07-25, phase 4c, on branch `26-07-25` at `d70dd83` plus phases 1–2 uncommitted. **This was a rehearsal, not a fold.** Nothing was pushed, no tag was created, `main`'s ref was never touched, and every artifact lived outside the tracked tree. The ceremony opens only on the operator's explicit judgment.

### 15.1 The method statement

> **The keep column is TRANSCRIBED from the specification. It is never derived from the tree.**

Concretely, the derivation is three inputs unioned:

1. **The `work/` scaffold — 18 paths — typed out by hand from `.claude/BASELINE.md` bootstrap step 2's brace enumeration.** Step 2's expression was expanded manually: 12 `README.md` entries and 6 directory-only entries (trailing `/`), each of the latter tracked by a `.gitkeep` because git cannot track an empty directory. **12 + 6 = 18**, verified against step 2, not against the tree.
2. **The fixed non-work set — 8 paths — read out of the specification**: step 2's "Also copy" list (`src/README.md`, `docs/README.md`, `docs/research/README.md`, `.archive/README.md`, `.cbmignore` — 5) plus the governing invariant's step-3 exception set (`CLAUDE.md`, `README.md`, `.gitignore` — 3).
3. **`git ls-files -- .claude` — 41 paths — the one tree read on the keep side.** Its soundness is argued in § 15.4.

Nothing else contributes to the keep column. No `grep` of `work/` produced any part of it.

### 15.2 Every derived count, with what produced it

| Quantity | Value | Derived from | vs v1 |
| --- | --- | --- | --- |
| `work/` scaffold | **18** | BASELINE step 2, transcribed (12 READMEs + 6 `.gitkeep`s) | same |
| Fixed non-work set | **8** | step 2 "Also copy" (5) + governing invariant step-3 exceptions (3) | same |
| `.claude/` manifest | **41** | `git ls-files -- .claude` — 22 agents + 11 commands + 5 `bin/` + `settings.json` + `BASELINE.md` + `ADR.md` | **38 → 41** (+`janitor.md`, +`clean.md`, +`reference-gate`) |
| Non-work keep total | **49** | 8 ∪ 41 | **46 → 49** |
| Expected tree | **67** | 49 ∪ 18 | **64 → 67** |
| Keep column | **65** | expected-tree less the 2 purification-artifact `.gitkeep`s | **62 → 65** |
| Tracked tree at rehearsal | **102** | `git ls-files` | n/a |
| Strip list | **35** | `comm -23 tree expected-tree` | grows with every artifact; never transcribed |
| Partition | `102 = 67 + 35` | — | **v1's `tree = keep ⊎ strip` does not hold for v2** — see § 9.0's note |
| `keep-absent` | **0** | `comm -13 tree keep` | same |
| Handles / UUIDs | **7 / 4** | `git grep` sweep (snapshot) | 27 / 13 |
| `MANIFEST` | **14/14 OK** | `sha256sum -c` | 71/71 |
| `merge-tree` | **exit 0, 0 conflicts** | `git merge-tree --write-tree 26-07-25 main` | v1: exit 1, one staged conflict |
| `origin/main..main` | **0** | `git rev-list --count` | v1: 4 |
| ADR tag cites | **3 occurrences / 3 lines** | `grep -o` / `grep -c` on `.claude/ADR.md` | 10 / 9 |

**Divergence from the order's § Plan:** none of substance. The plan predicted `git ls-files -- .claude` = 41, merge-tree exit 0, and `origin/main..main` empty — all three confirmed independently here. The plan did not predict the `tree = keep ⊎ strip` breakage, the `_enacted/` archive-path constraint, or the `work/milestones/README.md` wholesale-restore hazard; **the derivation found those and the derivation wins.**

### 15.3 The three product files, present **by derivation**

The proof is a grep against the *derived* `keep.txt` — not an assertion, not a hand-added line. The three files reach the keep column only because `git ls-files -- .claude` put them into `nonwork.txt`.

```
$ grep -c -E '^\.claude/(agents/janitor\.md|commands/clean\.md|bin/reference-gate)$' keep.txt
3
$ grep -E '^\.claude/(agents/janitor\.md|commands/clean\.md|bin/reference-gate)$' keep.txt
.claude/agents/janitor.md
.claude/bin/reference-gate
.claude/commands/clean.md
```

The same fact shows up in the manifest arithmetic: 38 → 41 is exactly +1 agent, +1 command, +1 `bin/` script.

### 15.4 Acceptance criterion 14 — the two mandatory statements

**Statement 1.** *The ceremony-time tree will contain `work/missions/<v>/` — that is, `work/missions/` plus this mission's version segment* — created by § 7's `git mv`s, carrying the mission's whole working history: MISSION.md, the milestone and its four phase docs, every work order, the enacted proposal, the footgun ledger entry, this runbook, and the session store. At rehearsal that directory did not exist; at ceremony it will hold roughly 33 files plus the closing report.

**Statement 2.** *No derivation step reads it.* The keep column is transcribed (inputs 1 and 2 above) or product-scoped (input 3). `work/missions/` cannot enter the keep column by any path, because nothing in the derivation looks under `work/` at all.

**The tree reads the recipe does make, and why each is safe:**

| Tree read | Where | Why it cannot smuggle |
| --- | --- | --- |
| `git ls-files -- .claude` | `derive.sh`, keep side | **Product-scoped.** The pathspec confines it to `.claude/`; `work/missions/` is structurally unreachable. Argued fully below |
| `git ls-files` (whole tree) | `derive.sh`, `tree.txt` | **Strip-side only.** Used exclusively as the *left* operand of `comm -23 tree expected-tree` (producing what to remove) and `comm -13 tree keep` (an assertion that keep paths exist). It classifies what to *delete*; it never contributes a path to keep |
| `git ls-files` post-purify | § 10a | **Verification, downstream of everything.** It compares the result against a list already fixed. A mismatch fails the gate; it cannot alter the gate |

### 15.5 Advisory note 2 — why `git ls-files -- .claude` is a sound tree read

The doctrine says *never derive the keep column from the tree*. This recipe does exactly one keep-side tree read. It is sound, for three independent reasons, and the operator should not have to reconstruct them mid-ceremony:

1. **It is product-scoped, and the scope is the whole point.** The pathspec `-- .claude` makes the read structurally incapable of returning a `work/missions/` path. The v1 failure was a read over `work/`, the exact container the mission archive lands in; this read cannot see that container at all. The unsound read and the sound read are not the same operation performed with different care — they differ in what they are *able* to return.
2. **`.claude/` is the manifest's own domain, and the manifest is the specification.** `.claude/BASELINE.md` step 1 says "copy the manifest set into `<repo>/.claude/`"; the repo convention says adding, removing or moving a bootstrap file updates `BASELINE.md` **in the same commit**. So `git ls-files -- .claude` is not an inference *about* the specification — it is the specification's materialized form, kept in sync by a standing commit rule. Transcribing 41 paths by hand would be a *less* reliable reading of the same document.
3. **It is cross-checked in the same session.** `/initialize`'s baseline-integrity check (§ 13, row 1) compares `BASELINE.md`'s manifest against the actual `.claude/` contents 1:1 and reports gaps and strays. § 10d runs it on the purified tree. A drift between the manifest and the listing therefore surfaces as a **red `/initialize`**, not as a silent keep-column error. And § 9.0's `!= 49` assertion catches the same drift a second time, earlier, as a hard stop.

The asymmetry to remember: **a scoped read of the product is a reading of the specification; an unscoped read of the workspace is a reading of the accident.**

### 15.6 The correction to v1's account of the hazard

v1's runbook states the smuggling mechanism as: the ceremony-time tree contains `work/missions/<v>/`, "whose subdirectories carry their own `README.md` copies", and names v1's own `work/missions/<v>/footguns/README.md` as the path a naive grep would have classified KEEP.

**That path does not exist on the v1 tag.** Checked:

```
$ git ls-tree -r --name-only v1.subagent-boundary-closed -- work/missions/v1.subagent-boundary \
    | grep -E '(^|/)(README\.md|\.gitkeep)$'
(none)
```

v1's archive-move enumerates *files*, not directories, so no scaffold README travels. And the same is true of v2's simulated archive: after the archive move, the naive grep

```
git ls-files -- work | grep -E '(^|/)(README\.md|\.gitkeep)$'
```

returned **18 — identical to the transcription.**

**This does not weaken the doctrine; it sharpens it, and it is the strongest evidence in this record.** A rehearsal that validated the naive grep *by running it* would have gone green here too — twice over, before and after the archive move — and that green would have been worth exactly nothing. The naive grep's correctness is **contingent on the archive's shape**, which is an operator choice made at § 7, *downstream* of the derivation and not fixed at rehearsal time. Any mission that archives a directory rather than enumerating its files smuggles immediately: `work/README.md` § Layout has `design/` "archived at close", and `work/design/`'s three READMEs **are** scaffolded — so `git mv work/design work/missions/<v>/design` would put three archive READMEs straight into the keep column. v2 has no design material, which is the only reason the hazard is latent rather than live.

So the correction is to the *illustration*, not the rule:

> The hazard is not that archive READMEs currently travel. The hazard is that a tree-derived keep column's correctness depends on a decision the derivation does not control — and it fails silently, at ceremony time, in the one operation that cannot be un-run.

Recorded as a finding against the inherited runbook: **raised, not resolved.** The v1 edition is a historical document and is not rewritten.

### 15.7 Simulation evidence

Run in a throwaway `git worktree` on branch `fold-rehearsal-throwaway`, outside the tracked tree; helper scripts in session scratch. **Nothing pushed, no tag created, `main`'s ref untouched.** The worktree and the branch were removed afterward and verified gone (`git worktree list`, `git branch`).

| Step | Result |
| --- | --- |
| Ceremony-shaped tree built (branch + phases 1–2 + a stub for this runbook and its README row) | 103 files |
| Derivation **before** the archive move | `tree=103 keep=65 expected=67 strip=36 keep-absent=0` |
| **Archive move simulated** — 33 files into `work/missions/<v>/` | committed on the throwaway branch |
| Derivation **after** the archive move | `tree=103 keep=65 expected=67 strip=36 keep-absent=0` |
| **`diff keep-before.txt keep-after.txt`** | **IDENTICAL — byte for byte** |
| All 33 archive files classified | strip-side, 100% |
| Purification run (`git rm` from `strip.txt`, `.gitkeep` step, both adaptations) | listing → **67** |
| **`git ls-files \| sort \| diff expected-tree.txt -`** | **IDENTICAL — 67 paths**, both directions |
| **`git ls-files 'work/*' \| sort \| diff work-18.txt -`** | **IDENTICAL — 18 paths**, both directions |
| Adaptation hunks | pure deletion + region restore; the generic Phase-docs hunk **survived** |
| `reference-gate check` post-purify | **exit 3**, no-declaration message (§ 10b) |
| Inline fallback reference check | 56 extracted, 8 unresolved = 6 sanctioned + 2 named false positives |
| Smoke tests (`reference-gate`, `session-archive`, `consult` no-args; `commit-guard` ×2) | 1 / 1 / 1 / 0 / 0 — all as specified |
| Idempotence (re-run derive + purify on the purified tree) | `strip=0`, `git status --porcelain` empty |

**The keep-column equality is the proof.** Not that the purification produced 67 files — that a derivation run against a tree *containing* the mission archive produced a keep column bit-identical to one run against a tree without it. That equality is only possible because no derivation step reads `work/missions/`.

### 15.8 Keep-with-adaptation, re-derived

Method: for each of the 24 non-`.claude/` keep-column files, `git diff main -- <path>`, classifying every hunk as generic-doctrine (folds) or instance content (adapts). **v1's four-entry list was not inherited.** Twenty files diff empty against `main`.

| File | v1 | v2 verdict |
| --- | --- | --- |
| `work/milestones/README.md` | wholesale restore | **ADAPTS — region restore, not wholesale.** The branch added the v2 mission roadmap (instance) *and* improved the generic "Phase docs" bullet with the declared-structure landing rule (doctrine). **v1's `git checkout <preref> -- <file>` would silently revert that doctrine off the template.** § 9.0 3a fixes this and § 9.3 asserts it |
| `work/runbooks/README.md` | delete data rows | **ADAPTS — unchanged in kind.** It will carry this runbook's row. The row is written as `\| [`fold-and-close.md`](fold-and-close.md) \| … \|` — it begins `\| [`, which is exactly what v1's `sed '/^## Held here$/,$ { /^\| \[/d }'` matches. That form is the deterministic delete's contract; a future row must keep it |
| `work/README.md` | 3 deletions + registry reset | **RETIRED — no adaptation.** All four of v1's `sed` anchors match **zero** lines. The machine registry already carries the generic `\| `<machine>` \| `<os>` / `<shell>` \| `<repo-path>` \|` placeholder row — v1's fold reset it and this mission never re-instanced it. The branch's 4 hunks are **all generic doctrine** (the § Structure mention in the layout table, the Janitor role row, the `/clean` command row, the whole `## The declared-structure floor` section) and fold unchanged. **Verified, and a genuine delta from v1** |
| `work/proposals/README.md` | delete founding-series pointer | **RETIRED — no adaptation.** The anchor matches zero lines; v1's fold removed it. Diffs empty against `main` |
| `src/README.md` | (residue R1, recorded only) | **PREPARED OPERATOR DECISION — see below** |
| `work/missions/README.md` | (not on v1's list) | **PREPARED OPERATOR DECISION — see below** |
| `work/PROJECT.md` § Structure | n/a | **NOT AN ADAPTATION. The whole file is stripped.** It is on the strip list; § Structure leaves with it. Nobody should "adapt" this section — there is nothing left to adapt. Its content is preserved for the ceremony by § 14's transcription |

#### Prepared operator decision A — `src/README.md`

The branch diff is **not** the instance sentence. It is a *repair*: the "In this repo:" line's dead link to `_deferred/26-07-11.work-queue-tier.md` (v1's recorded residue R1) became a complete `git show v1.subagent-boundary-closed:work/missions/v1.subagent-boundary/proposals/26-07-11.work-queue-tier.md` provenance expression, which resolves. **The branch side is strictly better and should fold as-is.**

The residual question is the one the order flagged: the sentence "In this repo: reserved for future workflow *software* … The bootstrap itself is documentation + `bun` scripts and lives in `.claude/`" is instance content sitting in a keep-column file — and it **already ships on `main`**, put there by v1's own fold. So it is not something this fold introduces.

**The fork, for the operator:** leave it (it folds as an improvement, and de-instancing it is a separate genericity question of the same class as v1's recorded-but-unacted residue R3–R6), or de-instance it now by deletion. **Recorded as a decision, not taken.** The rehearsal recommends leaving it: acting would be the first time this fold authored a genericity change outside the restore-or-delete discipline.

#### Prepared operator decision B — `work/missions/README.md`

Two questions, one file:

1. **The branch diff** converts v1's ledger-row Report cell from a markdown link into a `git show <tag>:<path>` provenance expression — the same dead-link repair as `src/README.md`, and correct for the same reason. **Folds as-is; § 8a says to write v2's row in the same style.**
2. **The seeded finding:** the ledger rows are instance history shipping on purified `main`. Is that deliberate canonical-repo history — the register of what this template has been through, which a consuming repo would empty at bootstrap — or a v1 fold gap? **Operator call at ceremony.** The rehearsal raises it and does not answer it. Note the consequence of the "gap" reading: it would mean the ledger table should be emptied at every fold, and the mission history would live only in tags — which contradicts `work/README.md` § Layout calling `missions/README.md` "the ledger" of "append-only institutional memory."

### 15.9 Findings raised, not resolved

1. **v1's smuggling illustration is factually wrong** (§ 15.6). Corrected here with a stronger mechanism; the v1 document is historical and is not rewritten.
2. **v1's `purify.sh` step 3a would have lost generic doctrine** (§ 15.8). Fixed in v2's recipe. The general lesson — *a wholesale file restore is only safe when the branch's changes to that file are entirely instance content* — is not stated anywhere in canon, and arguably should be.
3. **The archive layout is constrained by `.claude/ADR.md`'s forward-cited paths** (§ 7). Discovered by diffing the intended archive shape against v1's tag; the rehearsal's own first simulation got it wrong. There is no canonical statement of this dependency anywhere — the register writes paths into a future the ceremony must then produce. Worth a doctrine note.
4. **`work/missions/README.md`'s ledger rows on purified `main`** — deliberate or a fold gap (§ 15.8 decision B).
5. **Standing proposals: § Layout says "persist", v1's practice archived them** (§ 6). A convention/practice divergence, unrefereed.
6. **`work/notes/` has no archive lifecycle** in `work/README.md` § Layout (§ 6), so `work/notes/26-07-25.child-collection-evidence.md` has no default disposition.
7. **The `tree = keep ⊎ strip` invariant is not stable across missions** (§ 9.0). It depends on whether the purification-artifact `.gitkeep`s already exist, which depends on the previous fold. v2's form is `tree = expected-tree ⊎ strip`. A future edition must check which regime it is in rather than inheriting either equation.
8. **`work/runbooks/` is not a planning-artifact root, but a runbook is a temporal document.** Discovered by staging this file and re-running the gate: it produced **15 failures**, every one a path that *will* exist at ceremony time (`work/missions/<v>/…`, the closing report, the archived session) or a path deliberately quoted *because* it does not exist (§ 15.6's illustration, § 10b's false-positive table). `work/PROJECT.md` § Structure lists `work/todos/`, `work/milestones/`, `work/MISSION.md`, `work/design/` as planning-artifact roots — containers whose references are temporal because "a plan naming a path it will create is correct." **A ceremony runbook is that same thing**: it names, in advance, every path the ceremony will create.

   **Resolved here by writing, not by amending.** Each site now uses a form the gate already sanctions — the `<v>` placeholder (exempt as a template), a `~`-boundaried foreign path, or a complete `git show <ref>:<path>` provenance expression. The gate is green with the file staged: **68 files, 1330 references, 0 failures, 55 warnings, and zero warnings attributable to this runbook.** That is the better outcome regardless of the doctrine question: forward-looking paths *should* be marked as templates, because a reader cannot otherwise tell "this will exist" from "this is broken."

   **The doctrine question is raised, not answered:** should `work/runbooks/` join the planning-artifact roots? Arguments both ways — for, because a runbook's forward references are temporal by nature; against, because a runbook is *executed* rather than superseded, so a genuinely broken path in one is more dangerous than in a plan, and warn-only would hide it. **Do not amend the declaration inside the ceremony.** It is a `work/PROJECT.md` § Structure change, which is design.
