# Runbooks

Operational procedure docs — the steps an operator runs by hand, plus any operator-applied config payload that rides with them. Per [`work/README.md`](../README.md) (the `runbooks/` row): mission-versioned, triaged at mission open (carried / retired / watch).

## Convention

- **Payload-free procedure** → a flat `work/runbooks/<slug>.md` (the whole runbook is the prose).
- **Procedure + config payload** → a `work/runbooks/<slug>/` directory bundling the procedure (`README.md`) and the operator-applied files (a Caddyfile, a firewall snippet, an `.env` template, …), so the runbook and the thing it deploys travel together.

A runbook describes *how a thing is operated*, which is mission-versioned in practice — a redesign obsoletes a procedure exactly as it obsoletes a footgun. `work/runbooks/` is BASELINE-scaffolded but carries no manifest entry (BASELINE manifests only `.claude/`).

## Held here

| Runbook | Purpose |
| --- | --- |
| [`probe-battery.md`](probe-battery.md) | M1 spike — the five subagent-dispatch probes, hand-run by the operator on the upgraded CLI |
| [`fold-and-close.md`](fold-and-close.md) | Mission close + template fold — the `/close` ceremony, the rehearsed merge/purify recipe, and the post-fold gate; operator-run |
