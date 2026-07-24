# Runbook — mission close and template fold

> The hand-execution procedure for closing a mission and folding its branch back to `main`. Pick this up **as the operator**, in a fresh session, when a mission is finished and you are ready to render judgment on it. Assumes no campaign context: you do not need to have followed the mission's milestones to run this.
>
> **What it does.** Runs `/close`'s ceremony (report, triage, archive, ledger, tag), then merges the mission branch into `main` and **purifies** `main` down to the project-generic bootstrap template — product only, zero instance content. The mission's whole working history survives on the tagged branch; `main` becomes a clone-and-go template.
>
> **This instance's values** are shown throughout as `v1.subagent-boundary` / branch `26-07-23` / tag `v1.subagent-boundary-closed`. The shape generalizes: substitute your mission's version, branch, and `<v>-closed` tag. Numbers that are this-mission-specific (handle counts, the 64-path tree, the 128-path strip list) are labelled as such — **re-derive them, never transcribe them.**
>
> Est. time: 60–90 min including the closing-report dialog. The fold itself, once pre-flight is green, is about 15 minutes.

---

## Before you start — your five questions

### Can this lose my mission's work? **No, and here is the mechanism.**

The fold is a **true merge** (`git merge --no-ff <branch>`), not a squash. Every object the mission produced stays reachable from `main`'s history *and* from the tag. The purification commit removes files from the **working tree**, not from history — `git show <tag>:<path>` retrieves any of them forever.

That is why the tag push is **mandatory** and why the tag is **never deleted**. It is the continuation protocol's anchor: the decision register (`.claude/ADR.md`) cites it in provenance pointers, and every one of those pointers resolves only while the tag exists.

### Can I stop halfway? **Yes — everything before the push is local and reversible.**

You record a pre-fold ref at the very first step. Any failure at any stanza before § 10 recovers with `git reset --hard $(cat /tmp/fold-pre-ref)` (plus `git merge --abort` if a merge is in flight). Nothing on the mission branch is ever touched by the fold. After the push, `main` is public — a mistake is repaired by a further commit, never by rewriting or by deleting the tag.

### What if the pre-flight assertions fail? **Then the ceremony stops. That is the design.**

The assertions in § 3 run *before anything mutates*. A failure means the staged recipe no longer matches the tree it was staged against. **Do not improvise a fix inside the ceremony** — go back, re-stage, re-rehearse. Improvised resolutions inside a close ceremony are exactly the failure mode the assertions exist to prevent.

### Do I have to make the judgment call myself? **Yes. Two things are non-transferable.**

1. **The closing judgment** — `accomplished | failed | superseded` — is *yours*, rendered as an explicit utterance and recorded verbatim. It is never inferred from "proceed", from "looks good", or from silence.
2. **The panel attestation** (for missions whose success criteria include observability evidence) is *operator-authored*. An instrument cannot certify its own reading.

Both are expanded at § 5.

### Is any of it skippable?

- **Pre-flight (§ 1–3) is not skippable.** It is what makes the ceremony pure ceremony.
- **The `/close` ceremony (§ 4–8) is not skippable** — it is the close.
- **The fold (§ 9–11) is separable**: a mission can close without folding if the template purification is not part of its charter. If your mission has no fold-back determination, stop after § 8 and skip to § 12.
- **`git gc` (§ 11) is optional and non-gating.** Never let it block.

---

## Preconditions

Work through these before opening the ceremony. Each states the command and the output that confirms it.

1. **You are the operator, and you invoked this deliberately.** `/close` is the one command the system never self-initiates. If you arrived here by any other path, stop.
2. **Branch and trunk identified.**
   ```sh
   git branch --show-current      # the mission branch, e.g. 26-07-23
   git log --oneline -1 main
   ```
3. **Toolchain present.**
   ```sh
   bun --version                  # any recent version; the bin/ scripts are bun scripts
   ```
4. **Scratch space for the ceremony's helper scripts.** They are ceremony scaffolding and must **not** land in the tree.
   ```sh
   mkdir -p /tmp/fold && cd /tmp/fold
   ```
   Copy `derive.sh` and `purify.sh` (§ 9.0) there.

---

## 1. Archive sweep — the session store must be whole *before* the `git mv`

The close moves `work/sessions/` into the mission archive. A hole discovered mid-`git mv` is the failure this step exists to prevent.

**Derive the counts. Do not trust a written number** — this one has already drifted twice mid-campaign (24/12 at reconnaissance → 26/13 in the phase docs → 27/13 live), because the closing campaign stamps its own close-out as it works.

```sh
git grep -hoE '[a-z-]+@[a-z0-9-]+/[0-9a-f-]{36}' -- work '*.md' | sort -u | tee /tmp/fold/handles.txt
wc -l < /tmp/fold/handles.txt                                             # distinct stamped handles
sed 's/.*\///' /tmp/fold/handles.txt | sort -u | tee /tmp/fold/uuids.txt | wc -l   # distinct UUIDs
```

**This instance, derived live: 27 handles / 13 distinct UUIDs.**

> **A *higher* handle count than the last written figure is expected**, not drift — every stamp the ceremony itself writes raises it. **A *lower* count is the anomaly worth stopping for**: it means a stamped document was deleted or a stamp was stripped, and stamps live in never-rewritten historical files.
>
> The UUID count is the stable one. Handles are `role@machine/uuid`, so one session stamped under two roles yields two handles and one UUID.

Verify each local handle has its archive, and backfill stragglers:

```sh
while read -r u; do
  [ -e "work/sessions/play/$u.jsonl.gz" ] && echo "OK   $u" || echo "MISS $u"
done < /tmp/fold/uuids.txt
bun .claude/bin/session-archive <uuid>     # for each MISS, if a live transcript exists
```

### The decomposition — show it, do not just total it

**Report the sweep as arithmetic, so a future reader can *verify* it rather than trust it:**

> **13 = 9 archived + 3 LOST (expected) + 1 collected at `SessionEnd`**

| Bucket | Count | UUIDs (this instance) |
| --- | --- | --- |
| **Archived** — present in `work/sessions/play/` | 9 | `1db4a079`, `2f2dc1c5`, `34b58558`, `6a0035c9`, `6b086890`, `76ba13c6`, `7f0fbcc4`, `a52d1822`, `a9ddd6b3` |
| **`LOST (pre-existing)`** — unrecoverable, **expected** | 3 | see the table below |
| **Pending** — the live session, collected at its `SessionEnd` | 1 | `2bd6ea6d-d5b5-43cb-bfcc-743b1494caa2` (the Executor hosting this close) |

- **Pass:** every UUID falls into exactly one bucket, and the buckets sum to the derived total.
- **Fail:** a `MISS` that is **not** one of the three listed LOST handles and **not** the live session → a *new* LOST. Stop and investigate before touching the archive; that is precisely the hole this step exists to catch before the `git mv`.
- **Record:** the handle · role · status table, with the arithmetic line above it. It goes in the closing report.

### The three permanently-LOST handles — **expected, not fold damage**

Three of this mission's stamped UUIDs have **no source transcript anywhere** — not in the local CLI cache, not in `work/sessions/`. **No action recovers them.** They are a **class** with a common shape (stamps that predate, or fall outside, the archive-on-stamp convention), and a future reader must not mistake them for something the fold broke:

| UUID | Cause |
| --- | --- |
| `86ade408-7a9b-4edd-991a-6b3592ce377a` | Stamped inside the founding series — **predates the adoption of archive-on-stamp.** The transcript aged out of the CLI's local cache before any archiving convention existed: exactly the retention rot that convention was adopted to stop, realized before it existed |
| `1063f991-16dd-4fef-bc25-ba8c37c9dd2c` | Same cause, same founding series |
| `3816fb23-acef-4f71-b79f-ce68441a6b21` | **Relayed from another repo.** It never ran with this repo as `cwd`, so no transcript exists here to archive — the store is per-project by construction |

**The acceptance criterion is zero *new* LOST**, not zero LOST — it was amended to that wording for exactly this reason, because the original was unsatisfiable by any action. Pre-existing losses sit outside what the criterion protects (the ceremony never discovers a hole mid-`git mv`; stamps *this* mission relies on stay consultable).

**Say this plainly in the closing report: these three are not fold damage, and no future reader should chase them.** They were unrecoverable before the ceremony opened and will still be unrecoverable after it closes.

- **Do not strip these handles from the documents that carry them.** Those are historical, never-rewritten files.
- **Do** surface all three in the closing report's reader index — the archive's front door acknowledges its holes rather than silently narrowing the criterion.
- **Fail:** a *fourth* LOST handle, or a LOST handle this mission's work actually depends on → stop and escalate before touching the archive.

### The live-session handle — the `+ 1` in the arithmetic

One UUID will be the **session you are running right now** (this instance: `2bd6ea6d-d5b5-43cb-bfcc-743b1494caa2`). Its transcript is open and growing, and it is stamped under `work/`, so the `SessionEnd` archive-on-stamp hook collects it when this session ends. **It is not a loss.** Archiving it mid-session would store a truncated prefix the hook would overwrite anyway (last write wins).

> **Consequence for the ceremony: re-run this sweep after the close session ends** to confirm the last handle landed. That post-close re-run is § 12, step 2.

---

## 2. Store integrity and the spot-check re-run

```sh
cd work/sessions && sha256sum -c MANIFEST; cd -
```

- **Pass:** every line `OK`, zero failures. (This mission: **71/71 OK**.)
- **Note:** this check belongs to `/archive`, **upstream of the fold**. It is **N/A on the purified tree** — the fold strips both `work/sessions/MANIFEST` and `work/sessions/play/`. Run it here, on the branch, or not at all.

Re-run the pre-close spot-check the validation phase recorded, and confirm nothing regressed since. If your mission's earlier phase produced a handle-status table, diff this sweep against it; the only permitted delta is *new* handles from the ceremony itself.

- **Fail:** a manifest mismatch → stop. A corrupted archive must be repaired before it is `git mv`'d into permanence.

---

## 3. The merge-surface assertion — run this *before anything mutates*

Record the recovery anchor first. Everything below reverts to it.

```sh
git checkout main
git rev-parse HEAD | tee /tmp/fold-pre-ref
```

### 3a. Remote reconciliation

```sh
git fetch origin
git merge-base --is-ancestor origin/main main && echo "OK: origin/main is an ancestor of local main"
git rev-list --count origin/main..main
git log --oneline origin/main..main
```

- **Pass:** the `echo` fires. The count and log are your **expected backlog**.
- **Record (this instance):** `origin/main` is **4 commits behind** local `main` — `origin/main` = `fa6d173`, local `main` = `b332083`. The fold's push at § 10 therefore publishes `bfa1bf2`, `b0c9dda`, `fe63922`, `b332083` **in addition to** the fold. This is the standing state, not fold damage. Say it out loud before you push so nobody is surprised.
- **Fail (`--is-ancestor` non-zero):** local `main` and `origin/main` have forked. **Stop the ceremony.** Recovery: inspect with `git log --oneline --graph origin/main main`, reconcile the remotes deliberately *outside* the ceremony, then restart from § 3.

### 3b. Clean tree

```sh
git status --porcelain
```

- **Pass:** empty.
- **Fail:** commit, stash, or clean, then re-run. Never fold over a dirty tree: the purification commit enumerates paths, and a stray staged file would ride along unenumerated.

### 3c. The merge surface is *exactly* the staged conflict

```sh
git merge-tree --write-tree 26-07-23 main >/dev/null 2>&1; echo "merge-tree exit: $?"
git merge-tree --write-tree 26-07-23 main 2>&1 \
  | sed -n 's/^CONFLICT ([a-z/]*): Merge conflict in //p' | sort -u
```

- **Pass:** exit `1`, and the conflict list is **exactly one line**: `.claude/BASELINE.md`.

> **Why this assertion exists — keep this paragraph; do not drop it in a future revision.**
>
> This conflict **did not exist at reconnaissance.** The campaign's confirmed decision 1 recorded `git merge-tree --write-tree` exiting 0 with three clean auto-merges, and mandated a pre-flight re-run *because a later phase was going to edit `BASELINE.md` again*. That phase did exactly that, and **its own edits created this conflict.** The pre-flight re-run is what caught it — decision 1's caution was right even though its factual premise died.
>
> Future missions inherit the assertion for that reason: **the staged resolution is only valid against the surface it was staged against, and the surface moves under you.** Any fold recipe that carries a pre-resolved conflict must also carry the assertion that the conflict is still the one it resolved.

- **Fail (exit 0):** the staged resolution is stale in the other direction — someone reconciled the file already. Stop; re-derive the resolution at staging.
- **Fail (any other or additional conflict path):** **stop the ceremony.** This is drift after staging. The stop condition, as narrowed by the campaign's amendment, is: *any conflict beyond the single staged one for which the recipe carries a verified resolution stops the ceremony for reassessment.* No ad-hoc resolution inside the ceremony.

### 3d. The three staged content assertions

These prove the staged resolution ("take the branch side wholesale") loses nothing from `main`. **Any deviation stops the ceremony.**

```sh
A1RE='work/todos/_done/[A-Za-z0-9]|agentic-workflow|_enacted/[A-Za-z0-9]|[0-9]{2}-[0-9]{2}-[0-9]{2}\.'

# A1 — zero instance-history paths in the branch's BASELINE.md
echo "A1 = $(git show 26-07-23:.claude/BASELINE.md | grep -cE "$A1RE")   (expect 0)"

# A2 — src/_archive/ sanctioned as created-on-first-retirement
echo "A2 = $(git show 26-07-23:.claude/BASELINE.md | grep -cE 'src/_archive/')   (expect >= 2)"
git show 26-07-23:.claude/BASELINE.md | grep -nE 'src/_archive/'

# A3 — the Retention line is de-instanced
echo "A3 = $(git show 26-07-23:.claude/BASELINE.md | grep -c 'agentic-workflow/5')   (expect 0)"
git show 26-07-23:.claude/BASELINE.md | grep -n '^- \*\*Retention\*\*'
```

- **Pass:** `A1 = 0`; `A2 = 3` (the `src/README.md` annotation at `:40`, the "Paths that post-date the scaffold" block at `:49`, the index-surface policy at `:65`); `A3 = 0`, with the Retention line printing without any `(see agentic-workflow/5)` parenthetical.
- **Note on the regex:** `A1RE` is calibrated, not guessed — it yields **0** against both the branch and `main`, and **2 hits** against the pre-fix text (`b332083^`), where it catches `work/todos/_done/agentic-workflow/1.determinations.md` and `agentic-workflow/5`. It deliberately does **not** fire on the bare `_enacted/` inside bootstrap step 2's brace-expansion, which is a directory name, not an instance-history reference.
- **Fail:** any assertion deviating, **or** any content from the `main`-side commit found missing from the branch text outside the three analyzed hunks → **stop and escalate.** "Which text does `main` get" has become a genuine design decision. Do not patch locally.

### 3e. Zero-unclassified re-derivation

```sh
git checkout 26-07-23
bash /tmp/fold/derive.sh /tmp/fold/lists      # § 9.0
git checkout main
```

- **Pass:** `keep=62  expected=64  strip=<N>  keep-paths-missing-from-tree=0` followed by `zero-unclassified: OK (tree = keep ⊎ strip)`.
- **Record:** `<N>` will be **larger** than the staging figure and that is correct. It grows with `work/sessions/play/` (a new archive at every `SessionEnd`), the mission archive that § 7 will `git mv` in, the campaign's own orders, and this runbook. **The strip list is derived, never transcribed** — that is what makes the recipe survive its own artifacts.
- **Fail (`keep-paths-missing-from-tree` non-zero):** a keep-column file was deleted or renamed since staging → stop, reconcile the manifest.
- **Fail (`FAIL: non-work keep != 46`):** `.claude/` gained or lost a file since staging. **Stop.** Repo convention requires `BASELINE.md`'s manifest and the keep column to be reconciled in the same commit, and that is doctrine authoring, not a ceremony step.

---

## 4. Open the ceremony — draft the closing report **in dialog**

`work/missions/<v>/closing.md`. **The retrospective is a dialog, not a form.** Do not fill it in and present it for approval; talk it through.

It carries:

- **Outcome** — the judgment (§ 5), verbatim.
- **What shipped vs what didn't, and why.**
- **What the *work system itself* taught** — the DX retrospective. This is the part future missions actually mine.
- **Items carried forward** — cross-reference the triage dispositions in § 6.
- **A reader's index** — the handful of archived docs a future planner should actually read, so the archive has a front door. **Include the LOST-handle class from § 1 here**, with its causes.

---

## 5. The two non-transferable protections

> **State both of these to the operator explicitly. They are not procedural formalities; they are what keeps the archive honest.**

### 5a. The closing judgment

A mission closes `accomplished | failed | superseded`. **Failure is first-class** and closes with the same ceremony; a mission may also close with open or deferred work orders — completion is not exhaustion of the queue.

- The judgment is **rendered by the operator as an explicit utterance** and **recorded verbatim** in the closing report.
- It is **never inferred** from "proceed", from "looks good", or from silence.
- An agent may *draft* the report. It may not *render* the verdict.

**Rationale, for the reader who wonders why this is so heavy:** a closing campaign is frequently its own mission's measuring instrument, and **an instrument cannot certify its own reading.** The archive must not teach future missions that campaigns may certify themselves.

### 5b. The panel attestation

Where a mission's success criteria include observability evidence — the operator having *watched* the system work — that attestation is **operator-authored** and lands **before the ceremony opens**.

- If it does not arrive, the criterion is **incomplete**, and the closing report must say so plainly.
- *"Accomplished, with the stated evidence gap"* is a legitimate operator verdict.
- **A backfilled attestation is not.** Do not reconstruct it after the fact.

This mission's criterion 3 requires: ≥1 upward pause-and-ask, ≥1 downward nudge (both recorded in the campaign log), **and** the operator's one-line live-panel attestation.

---

## 6. Triage — prepared dispositions

These are **prepared so you confirm rather than derive.** Read each, confirm or overrule. Contestable calls are yours.

| Item | Prepared disposition |
| --- | --- |
| `todos/26-07-11.configure-command` | **Archive open-carried** — re-seed on a future mission branch. Still wanted; simply never scheduled |
| `todos/26-07-22.lan-intercom` | **Archives halted.** The Orchestra one-way valve stays untouched — this close does not reopen it |
| `todos/bugs/26-07-24.bug.footgun-index-convention-drift.md` | **Carries to a future mission.** An open *design* question spanning eight agent policy docs, not a defect this ceremony can settle |
| `todos/bugs/26-07-24.bug.baseline-postdate-list-divergence.md` | **Carries forward** — *or* an operator-sanctioned post-fold hygiene commit on `main`. The triage's call. (Cause: `BASELINE.md`'s "Paths that post-date the scaffold" names 3 entries; the quality gate's sanctioned-absence list names 7. A consumer authoring its gate from BASELINE alone goes red on 4 paths. The § 14 inline list is the mitigation) |
| `work/footguns/` | **Absorbed by `.claude/ADR.md` § Standing hazards** — note it in the report. The hazards outlive the mission, so they moved to the product side of the seam rather than archiving with the ledger |
| `work/runbooks/` | **Retire with the mission — including this runbook.** It archives as the workflow's first close-and-fold recipe; future missions inherit it by reading it out of the archive, not by keeping it live on `main` |
| `docs/research/` | **Nothing to triage** |
| **Residue observations R1–R6** (below) | **Record only; no action.** Seeds for a future template-genericity audit, same neighborhood as the footgun-index drift bug |

### The residue list — recorded, not acted on

Instance content that lives *inside* keep-column files, which a path-level manifest structurally cannot reach, and which the fold's four sanctioned adaptations do not cover:

| # | File · line | Residue |
| --- | --- | --- |
| R1 | `src/README.md:7` | `work/proposals/_deferred/26-07-11.work-queue-tier.md` — **dead link** after the fold. Same class as the four adaptations; the reference gate does not see it because the gate greps `.claude/` only |
| R2 | `work/README.md:81` | `(Corrected 26-07-23 — see todos/26-07-23.fork-session-consults.md.)` — **dead link** plus a dated correction citation |
| R3 | `work/footguns/README.md:5` | "this repo's agentic work begins with the **agentic-workflow series**" — prose-level instance fact, no link |
| R4 | `work/todos/README.md:11` | "(first instance: `agentic-workflow/`)" — prose-level instance example |
| R5 | `work/README.md:50`, `:109` | "renamed from 'resolver'" + the `## Historical rename mapping` section — era vocabulary meaningful only to this repo's history |
| R6 | `work/todos/README.md:21,32,38` | `26-07-11.dispatch-policy.md`, `filed: 26-07-11`, `triaged: 26-07-11` — dated *examples* inside format specimens. Lowest severity; arguably fine as illustration |

**Explicitly not residue** (verified; listed so nobody re-litigates): the `.claude/ADR.md` provenance pointers, which are complete `git show <tag>:<path>` expressions and are provenance *data*, not tree references; `.claude/BASELINE.md`'s canonical-home URL, which is deliberately this repo since that is where consumers re-copy from; and root `CLAUDE.md` / `README.md`, which carry this repo's facts by design — bootstrap step 3 has the consuming repo re-author both, and they ship as shape exemplars.

---

## 7. Archive the mission

Move the mission's work system into `work/missions/<v>/`. **The archive is a snapshot, not a cleaned-up rewrite** — do not tidy prose on the way in.

```sh
mkdir -p work/missions/v1.subagent-boundary
git mv work/MISSION.md       work/missions/v1.subagent-boundary/
git mv work/milestones/1.spike work/milestones/2.conversion work/milestones/3.validation-and-fold \
                             work/missions/v1.subagent-boundary/milestones/
git mv work/todos/<the mission's orders, including _done/> work/missions/v1.subagent-boundary/todos/
git mv work/proposals/_enacted work/missions/v1.subagent-boundary/proposals/
git mv work/footguns/bin-scripts.md work/footguns/consult.md \
                             work/missions/v1.subagent-boundary/footguns/
git mv work/runbooks/probe-battery.md work/runbooks/fold-and-close.md \
                             work/missions/v1.subagent-boundary/runbooks/
git mv work/sessions/play    work/missions/v1.subagent-boundary/sessions/
git mv work/sessions/MANIFEST work/missions/v1.subagent-boundary/sessions/
```

Adjust the enumeration to your mission's actual contents — **enumerate paths; never `git add -A`.**

- **Record:** the closing report's path (`work/missions/<v>/closing.md`) goes in this directory too.
- **Note:** the fold strips everything under `work/missions/<v>/` anyway. The `git mv` still matters — it is what puts the archive in the **branch's** final state, which is what the tag preserves.
- **Fail:** any `git mv` erroring on a missing path → you enumerated against a stale listing. Re-derive from `git ls-files` and retry. Nothing is lost.

---

## 8. Ledger row, then tag

### 8a. Ledger

Add a row to `work/missions/README.md` — **create the table if this is the first close.** Columns: version · outcome · one-line result · closing-report link.

```markdown
| Mission | Outcome | Result | Report |
| --- | --- | --- | --- |
| `v1.subagent-boundary` | accomplished | <one line> | [closing.md](v1.subagent-boundary/closing.md) |
```

### 8b. Commit the close, then tag it

```sh
git add -- <enumerated paths>
git commit -m "Close: mission v1.subagent-boundary — <outcome>

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
git tag v1.subagent-boundary-closed
```

### 8c. Verify the tag string **verbatim** against the register

The decision register cites the tag in provenance pointers. A one-character mismatch silently breaks every one of them.

```sh
git tag -l 'v1.subagent-boundary-closed'
grep -o 'v1\.subagent-boundary-closed' .claude/ADR.md | wc -l    # raw occurrences
grep -c  'v1\.subagent-boundary-closed' .claude/ADR.md           # lines carrying it
```

- **Pass:** the tag exists, and **10 raw occurrences across 9 lines** — line 34 carries two. **Both counts are stated so either counting method matches**; `grep -c` counts lines, `grep -o | wc -l` counts occurrences, and they legitimately differ here.
- **Fail:** any mismatch between the tag string and what the register cites → **stop.** Reconcile before pushing anything. A published tag is never renamed.

> Generalizing: whatever your register cites, count it both ways and reconcile *before* the push. The tag is the only thing making the register's history-side pointers resolvable.

---

## 9. The fold — merge and purify

Runs on `main`. Reverts wholly to `/tmp/fold-pre-ref` at any point before § 10.

### 9.0 The two helper scripts

Put both in `/tmp/fold/`. They are ceremony scaffolding — **they must not enter the tree.**

**`derive.sh`** — deterministic list generation. Note the load-bearing comment: the `work/` scaffold is **transcribed from BASELINE step 2, never grepped**.

```sh
#!/usr/bin/env bash
# Derive keep / expected-tree / strip deterministically. Run from the fold target's root.
# $1 = output directory.  Emits keep.txt (62), expected-tree.txt (64), strip.txt.
set -euo pipefail
OUT="$1"; mkdir -p "$OUT"

# --- the work/ scaffold: BASELINE step 2's enumeration, transcribed, NOT grepped ---
# (a grep for */README.md under work/ would also match the mission archive's copies)
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

# --- BASELINE step 1 (.claude manifest set) + step 3 keystones + the scaffold's siblings ---
{ printf '%s\n' CLAUDE.md README.md .gitignore .cbmignore \
                .archive/README.md docs/README.md docs/research/README.md src/README.md
  git ls-files -- .claude
} | sort -u > "$OUT/nonwork.txt"
[ "$(wc -l < "$OUT/nonwork.txt")" = 46 ] || { echo "FAIL: non-work keep != 46 (got $(wc -l < "$OUT/nonwork.txt"))"; exit 1; }

cat "$OUT/nonwork.txt" "$OUT/work-18.txt" | sort -u > "$OUT/expected-tree.txt"
[ "$(wc -l < "$OUT/expected-tree.txt")" = 64 ] || { echo "FAIL: expected tree != 64"; exit 1; }

# keep = expected-tree minus the two .gitkeeps this commit ADDS
grep -vE '^work/(todos/_done|proposals/_enacted)/\.gitkeep$' "$OUT/expected-tree.txt" > "$OUT/keep.txt"
[ "$(wc -l < "$OUT/keep.txt")" = 62 ] || { echo "FAIL: keep != 62"; exit 1; }

git ls-files | sort > "$OUT/tree.txt"
comm -23 "$OUT/tree.txt" "$OUT/expected-tree.txt" > "$OUT/strip.txt"
comm -13 "$OUT/tree.txt" "$OUT/keep.txt"          > "$OUT/keep-absent.txt"

echo "tree=$(wc -l < "$OUT/tree.txt")  keep=62  expected=64  strip=$(wc -l < "$OUT/strip.txt")  keep-paths-missing-from-tree=$(wc -l < "$OUT/keep-absent.txt")"
[ -s "$OUT/keep-absent.txt" ] && { echo "FAIL: keep-column paths absent from the tree:"; cat "$OUT/keep-absent.txt"; exit 1; }
echo "zero-unclassified: OK (tree = keep ⊎ strip)"
```

> **Why the `work/` list is transcribed and not grepped — the finding that earned this note.** The first rehearsal derived it as
> `git ls-tree -r --name-only <branch> -- work | grep -E '(^|/)(README\.md|\.gitkeep)$'`
> and went **green** — because at rehearsal time the mission archive had not been created yet. At *ceremony* time the tree contains `work/missions/<v>/`, whose subdirectories carry their own `README.md` copies, and that grep would have classified `work/missions/v1.subagent-boundary/footguns/README.md` as **KEEP** — silently smuggling mission archive into the purified `main`. The rehearsal could not catch this by running; it was caught by reasoning about the ceremony-time tree, then proven by simulating the archive move before purifying. **Transcribe the scaffold from BASELINE; never infer it from the tree.**

**`purify.sh`** — the mutating half. Every removal is enumerated from `strip.txt`. **No `git add -A`. No `git add .`.**

```sh
#!/usr/bin/env bash
# Purification commit — run from the repo root of the fold target.
# $1 = path to strip.txt (derived, one path per line)
set -euo pipefail
STRIP="$1"

# --- 1. enumerated removals (never `git add -A`) -----------------------------
# empty strip list = already purified; the step is a no-op, not an error
if [ -s "$STRIP" ]; then xargs -a "$STRIP" -d '\n' git rm -q -r --; fi

# --- 2. keep-column directories left with zero tracked files gain a .gitkeep --
for d in work/todos/_done work/proposals/_enacted; do
  mkdir -p "$d" && : > "$d/.gitkeep" && git add -- "$d/.gitkeep"
done

# --- 3. KEEP-WITH-ADAPTATION — restore-or-delete only ------------------------
# 3a. work/milestones/README.md — restore main's generic conventions stub
git checkout main -- work/milestones/README.md

# 3b. work/README.md — three deletions + the BASELINE-sanctioned registry reset
sed -i '/^Determinations record: /,+1d'            work/README.md
sed -i '/^Deferred: a \*\*work-queue tier\*\*/,+1d' work/README.md
sed -i '/^(The registry gains rows/,+1d'            work/README.md
sed -i 's@^| `play` .*@| `<machine>` | `<os>` / `<shell>` | `<repo-path>` | Single machine today; add a row per machine at bootstrap |@' work/README.md

# 3c. work/proposals/README.md — delete the founding-series pointer
sed -i '/^The `26-07-05\.agentic-workflow\/` series is/d' work/proposals/README.md
# drop any trailing blank lines the deletion left
printf '%s\n' "$(cat work/proposals/README.md)" > work/proposals/README.md

# 3d. work/runbooks/README.md — empty the "Held here" table's data rows
sed -i '/^## Held here$/,$ { /^| \[/d }' work/runbooks/README.md

git add -- work/README.md work/proposals/README.md work/runbooks/README.md work/milestones/README.md
```

> **One line must change on transcription.** Step 3a's `git checkout main -- work/milestones/README.md` was written for the rehearsal, where the throwaway branch was not `main`. At ceremony time you are *on* `main` with the merge already committed, so `main` is `HEAD` and that line is a no-op. **Use the recorded pre-fold ref instead:**
> ```sh
> git checkout $(cat /tmp/fold-pre-ref) -- work/milestones/README.md
> ```
> This is the only line in either script that differs between rehearsal and ceremony.

### 9.1 The merge

```sh
git checkout main
git merge --no-ff 26-07-23
```

**Expected output** — `Auto-merging .claude/BASELINE.md` / `CONFLICT (content): Merge conflict in .claude/BASELINE.md` / two clean auto-merges / `Automatic merge failed`. **This is the expected path, not a failure.**

```sh
git diff --name-only --diff-filter=U
```

- **Pass:** exactly `.claude/BASELINE.md`.
- **Fail:** any other path → `git merge --abort`, then stop (see § 3c).

### 9.2 Resolve — branch side wholesale, **never** a hand-authored text

```sh
git checkout 26-07-23 -- .claude/BASELINE.md
git diff --name-only --diff-filter=U                                       # expect: empty
diff <(git show 26-07-23:.claude/BASELINE.md) .claude/BASELINE.md && echo "OK: byte-identical to the branch side"
grep -rn '^<<<<<<<\|^=======$\|^>>>>>>>' .claude/ | wc -l                  # expect: 0
```

A hand-merged text would be a **third** variant of the file existing on neither branch — novel content entering `main` unreviewed and unblessed. Taking the branch side loses nothing: the `main`-side commit touches this file in exactly 3 hunks, all three subsumed by the branch text, and the third auto-merges anyway because both sides made the identical deletion.

### 9.3 Re-run A1–A3 on the **resolved file**

```sh
A1RE='work/todos/_done/[A-Za-z0-9]|agentic-workflow|_enacted/[A-Za-z0-9]|[0-9]{2}-[0-9]{2}-[0-9]{2}\.'
echo "A1 = $(grep -cE "$A1RE" .claude/BASELINE.md)             (expect 0)"
echo "A2 = $(grep -cE 'src/_archive/' .claude/BASELINE.md)     (expect 3)"
echo "A3 = $(grep -c 'agentic-workflow/5' .claude/BASELINE.md) (expect 0)"
```

### 9.4 Commit the merge — and prove the resolution

```sh
git commit --no-edit
git log --oneline -1
git diff --stat 26-07-23 HEAD        # expect: EMPTY
```

- **Pass:** the last command prints nothing. **This is the real proof the resolution was correct** — after taking the branch side, the merge result is *tree-identical to the branch*, so `main`'s side contributed nothing the branch had not already superseded.
- **Recovery for all of § 9.1–9.4:** `git merge --abort` before the commit, `git reset --hard $(cat /tmp/fold-pre-ref)` after. Both are total; the mission branch is never touched.

### 9.5 Purify

```sh
bash /tmp/fold/derive.sh /tmp/fold/lists
bash /tmp/fold/purify.sh /tmp/fold/lists/strip.txt
git ls-files | wc -l                 # expect: 64
```

### 9.6 Inspect the four adaptations **before** committing

Four keep-column files carry instance content *in their text*, which `git rm` structurally cannot reach. The purification de-instances them by **restore-or-delete only — never newly authored prose.**

| File | Adaptation | Kind |
| --- | --- | --- |
| `work/milestones/README.md` | restore `main`'s own copy — the generic conventions stub; the branch had turned it into the mission roadmap index | **restore** |
| `work/README.md` | delete the determinations + design-corpus links, the work-queue-tier pointer, the cross-LAN pointer; reset the machine registry to a placeholder row per BASELINE's stated adaptation | **delete** + the one pre-sanctioned adaptation |
| `work/proposals/README.md` | delete the founding-series pointer | **delete** |
| `work/runbooks/README.md` | delete the "Held here" table's data rows, leaving the empty table | **delete** |

```sh
git diff --cached -- work/README.md work/proposals/README.md \
                     work/runbooks/README.md work/milestones/README.md
```

- **Pass:** **every hunk is a pure deletion or a whole-file restore.** Concretely: `work/README.md` loses 3 paragraphs and has its one registry row replaced by a placeholder row whose Notes cell is the file's own existing text; `work/milestones/README.md` loses the roadmap header + table and regains the one-sentence stub; `work/proposals/README.md` loses its last paragraph; `work/runbooks/README.md` loses one table row.
- **Fail — any hunk containing a newly composed sentence:** **stop and escalate that single file.** The restore-or-delete constraint is what keeps this class *interpretation* of BASELINE's project-generic claim rather than *design*. A composed sentence escalates **individually**; the class does not.

### 9.7 Commit the purification

```sh
git commit -m "Organize: purify main to the generic bootstrap template

Strip instance content per the purification manifest; add
work/todos/_done/.gitkeep and work/proposals/_enacted/.gitkeep so the emptied
containers survive; de-instance four keep-column READMEs by restore-or-delete.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

Enumerate **change classes** in the message, not 128 individual paths.

> **§ 9.5–9.7 is idempotent.** Re-running `derive.sh` + `purify.sh` on an already-purified tree yields `strip=0`, the `git rm` step no-ops, all four `sed` anchors find nothing, and `git status --porcelain` comes back empty. Verified in rehearsal.

---

## 10. The template quality gate on the result

Run all three before pushing. **If any of this reds, the fault is in the manifest or the recipe — never in the gate. Do not widen a list to make it pass.**

### 10a. File listing — expected vs actual

```sh
git ls-files | sort | diff /tmp/fold/lists/expected-tree.txt -   && echo "IDENTICAL — 64 paths"
git ls-files 'work/*' | sort | diff /tmp/fold/lists/work-18.txt - && echo "IDENTICAL — 18 paths"
```

- **Pass:** both `diff`s empty. The second is the **hard-green condition** — the purified `work/` listing equals BASELINE bootstrap step 2's 18-path derivation exactly, in both directions.
- **Record (this instance):** 64 = 62 keep-column paths + the 2 added `.gitkeep`s. Of the 64, 18 are under `work/`, 38 under `.claude/`, 8 at root / `docs/` / `src/` / `.archive/`.

### 10b. Reference resolution

```sh
grep -rhoE 'git show [A-Za-z0-9._<>-]+:[A-Za-z0-9._/<>-]+|(\.claude/bin|work|docs|src|tmp)/[A-Za-z0-9._/<>-]+' \
     .claude --include='*.md' \
  | grep -v '^git show ' | sed 's/[.,)`:]*$//' | grep -vE '<|>' | sort -u > /tmp/fold/refs.txt
wc -l < /tmp/fold/refs.txt
while IFS= read -r p; do [ -e "$p" ] || echo "UNRESOLVED: $p"; done < /tmp/fold/refs.txt
```

The leading alternative consumes `git show <ref>:<path>` expressions **whole**, so tag-qualified provenance pointers are never extracted as tree references. Without it, the register's pointers would be checked as live paths and this gate would red for a cause that is not the fold's.

- **Pass:** every unresolved path appears in the § 14 sanctioned-absence table. **This instance: 30 paths extracted, 7 unresolved, all 7 sanctioned.**
- **Fail — an unresolved path outside the table:** manifest or recipe fault; fix there.
- **Fail — anything anomalous about `work/PROJECT.md` beyond its listed sanctioned absence:** escalate. That is an upstream doctrine failure, not something to work around by widening the list.

### 10c. Tooling smoke

```sh
bun .claude/bin/session-archive          ; echo "exit=$?"   # usage, exit 1
bun .claude/bin/consult                  ; echo "exit=$?"   # usage, exit 1
printf ''        | bun .claude/bin/commit-guard ; echo "exit=$?"   # silent, exit 0
printf 'garbage' | bun .claude/bin/commit-guard ; echo "exit=$?"   # silent, exit 0
```

- **Pass:** usage text + exit 1 for the first two; silence + exit 0 for both `commit-guard` arms (the backstop never breaks a session).
- **Two permanent adaptations, recorded so nobody re-litigates them:**
  - **`commit-guard`'s TTY arm is untestable from a script.** The spec says an interactive terminal gets usage + exit 1; a scripted run has no TTY, so only the stdin arms are exercised. This is a property of the check, not a shortcut.
  - **`sha256sum -c MANIFEST` is N/A on the purified tree.** The fold strips `work/sessions/MANIFEST` along with the store. There is nothing to verify, and its absence is sanctioned (§ 14, entry 6). Run it on the **branch** at § 2 instead.
- **Fail:** any other exit → a `bin/` script broke in the merge. `git reset --hard $(cat /tmp/fold-pre-ref)` and diagnose off the ceremony clock.

### 10d. `/initialize` — manual walkthrough

**Do not start a Claude session in the fold target to run this if session hooks are live.** A `SessionEnd` archive hook and a `Stop` commit-guard hook would write into `work/sessions/` and corrupt the very listing § 10a diffs. Evaluate the nine checks by hand against `.claude/commands/initialize.md`. Only check 2 needs `claude mcp list`, and it is host-scoped — run it from a normal clone.

Expected outcomes: **§ 13.**

---

## 11. Push

```sh
git push origin main
git push origin v1.subagent-boundary-closed      # MANDATORY
git push origin 26-07-23:26-07-23
```

- **The tag push is mandatory.** It is the continuation protocol's anchor. An unpushed tag makes every provenance pointer in the register unresolvable for anyone but this machine.
- **The branch push costs nothing and is worth doing.** The mission's objects travel with the tag regardless — a default `git clone` fetches all tags — so pushing the branch ref adds no clone weight. What it buys is **navigability by name** instead of by tag archaeology.
- **`main`'s push carries the backlog** from § 3a. Expected; say so before you run it.

**Fail — `main` push rejected (non-fast-forward):** someone pushed to `origin/main` between § 3a and here.
```sh
git fetch origin
git merge-base --is-ancestor origin/main main    # re-assert § 3a
```
If that now fails, **do not force.** Reset to `$(cat /tmp/fold-pre-ref)`, reconcile the remotes, and re-run from § 3. The fold is cheap to redo; there is no state outside these two local commits.

**Fail — tag push rejected (`already exists`):** a tag of that name is already on the remote. Stop; check whether it points at the same object (`git ls-remote --tags origin`). **Never delete or force-move a published tag** — the protocol's whole guarantee is that this tag persists.

**Fail — branch push rejected:** harmless; the branch is a convenience. Investigate afterward, off the ceremony clock.

---

## 12. Post-fold verification and hand-back

1. **Confirm the fold landed:**
   ```sh
   git ls-remote --tags origin | grep subagent-boundary   # the tag resolves on the remote
   git log --oneline -3 origin/main
   git ls-files | wc -l                                   # 64
   git diff --stat 26-07-23 HEAD                          # merge proof — must still be empty
   ```
2. **Re-run the § 1 archive sweep** (or `/archive`) once the close session has ended, to confirm the live-session handle landed — the `+ 1` in `13 = 9 + 3 + 1`. **This instance: `work/sessions/play/2bd6ea6d-d5b5-43cb-bfcc-743b1494caa2.jsonl.gz` should now exist**, moving the arithmetic to `10 archived + 3 LOST`. A handle still missing after the session ended is a *new* LOST and must be investigated.
3. **Confirm no ceremony scaffolding leaked into the tree:**
   ```sh
   git status --porcelain     # empty
   ls /tmp/fold               # the scripts live here, not in the repo
   ```
4. **Optional, explicitly non-gating: `git gc`.** This repo carries **924 never-collected loose objects** (~12 MB `.git`; `gc` has never run). Collecting them afterward is safe operator hygiene and deliberately sits **outside** the ceremony. Do not run it as part of the fold, and never let its absence block anything.
5. **Hand back.** The next mission's `/plan` inherits: the carried todos from § 6, the footgun triage input, and any charter material the closing report flagged. Seeding the next mission is **not** part of this ceremony.

---

## 13. `/initialize` expected-outcomes table

> **This table doubles as the verification sheet for every future consumer's bootstrap.** A freshly-copied template is *supposed* to fail two of these checks; a template that passes all nine has shipped somebody's project facts. Read it that way, not just as this fold's report card.

| # | Check | Expected | Why |
| --- | --- | --- | --- |
| 1 | Baseline integrity | **PASS** | 38 tracked `.claude/` files = 21 agents + 10 commands + 4 `bin/` + `settings.json` + `BASELINE.md` + `ADR.md`. Manifest 1:1 — no gaps, no strays |
| 2 | Capabilities (MCP) | **EXPECTED-RED ×2 — host noise, not fold damage** | `chrome-devtools` configured but not connecting (`-32000: MCP error -32000: Connection closed`); `codebase-memory-mcp` not installed. **Both pre-existing and host-side** — nothing the fold touched. `context7` and `playwright` connect. `.cbmignore` present and correct (`/*`, `!/src/`, `/src/_archive/`) |
| 3 | Hooks resolve | **PASS** | Both `settings.json` hook commands point at existing files (`session-archive`, `commit-guard`); both parse under `bun` |
| 4 | Spawn-depth cap | **PASS** | `env.CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` present and `"2"` |
| 5 | Keystone docs | **EXPECTED-RED — definitionally** | Root `CLAUDE.md` present; `work/PROJECT.md` **absent**. BASELINE bootstrap step 3 authors it *after* the audit flags it. A green here on a fresh template would mean the template shipped somebody else's supplement |
| 6 | Work-system scaffold | **PASS** | All 18 directories/files present and matching `work/README.md`'s layout table. That table's `MISSION.md` and `PROJECT.md` rows are sanctioned lazy-creates (§ 14, entries 3 and 4) |
| 7 | Git hygiene | **PASS** | `.gitignore` covers `.env*` + key patterns, `tmp/`, `.codebase-memory/`, `node_modules/`, editor cruft; `git status` clean |
| 8 | Session durability | **PASS (partial, correctly)** | `work/sessions/MANIFEST` absent → `sha256sum -c` N/A (§ 14, entry 6 — the store is created by the first sweep). Zero stamped handles remain under `work/`, so the spot-check is vacuously satisfied. Host `cleanupPeriodDays` = 90 — raised |
| 9 | Toolchain | **PASS** | `bun` resolves |

**Green condition:** checks 1, 3, 4, 6, 7, 8, 9 green; checks 2 and 5 **expected-red per the rows above**. Anything else is a fault in the manifest or the recipe.

---

## 14. The sanctioned-absence list — inline, 7 entries

> **Why this list is reproduced here rather than referenced.** It is defined in `work/PROJECT.md` § All roles — and **the fold strips `work/PROJECT.md`.** The file that defines the gate does not survive the operation the gate validates. The list must therefore live inline in this runbook, or it is lost at exactly the moment it is needed.
>
> This is fine by design: the purified template carries **no** quality gate of its own. A consuming repo authors one at bootstrap step 3, and this table is the shape it should start from.

Paths referenced from `.claude/` that legitimately do not exist in a bare template tree, because they are created lazily by the commands that need them:

| # | Sanctioned absence | Created by |
| --- | --- | --- |
| 1 | `src/_archive/` | first sub-codebase retirement |
| 2 | `tmp/*` | runtime stream logs |
| 3 | `work/MISSION.md` | `/plan` at mission tier |
| 4 | `work/PROJECT.md` | authored at bootstrap step 3 — absent in a bare template tree |
| 5 | `work/todos/BACKLOG.md` | first `/triage` |
| 6 | `work/sessions/MANIFEST` | first archive sweep |
| 7 | `work/design/` contents — `DESIGN.md`, `system/`, `sessions/` (the READMEs are scaffolded) | founding `/design` |

**Rules for using it:**

- An unresolved reference **on this list** is green. An unresolved reference **off this list** is a fault in the manifest or the recipe — fix those, never the list.
- **Provenance pointers are not tree references.** Paths written as complete `git show <ref>:<path>` expressions are historical data; the gate's regex consumes them whole and never extracts them. This is why such pointers must always be written in full and never elided — that syntax is what makes them recognizable. **Do not exempt individual paths instead.**
- A known divergence, carried forward as a filed bug: `.claude/BASELINE.md`'s "Paths that post-date the scaffold" names only **3** of these entries. A consumer authoring its gate from BASELINE alone would go red on `tmp/*`, `work/MISSION.md`, `work/todos/BACKLOG.md`, and `work/design/` contents. **This inline 7-entry list is the mitigation** until that divergence is reconciled.
