# Dostel Enterprise Routine Playbooks

Reference for Paperclip scheduled routines. Each routine execution creates **one issue**; the assignee follows the playbook and marks it done.

## Why tickets stall (operational notes)

| Symptom | Cause | Fix |
|---------|-------|-----|
| Routines fire but nothing ships | Assignee agent **paused** | Resume PM, Researcher, Competitive Analyst, CMO |
| Flood of duplicate tickets | Platform Health Watch filed new issue every 30m while checks failed | Close dupes; playbook now says "if green → done, no new tickets" |
| Builder ignores features | 40+ **blocked** platform-health tickets clog inbox | Bulk-close health dupes; promote feature backlog |
| Research never reaches eng | PM paused; triage routine assignee idle | Unpause PM; PM Research & USP Triage promotes to Builder |

## Self-reinforcing enterprise loop

```
Daily Research Intake ──┐
Competitive USP Matrix ─┼→ PM Research Triage → PM Backlog Grooming
Weekly Deep Dive ───────┘         │
                                  ▼
                    Morning Ship Block (Builder) → E2E Test (QA)
                                  │
                    Platform Health + Deploy Gate (SRE)
                                  │
                    Friday Board Update (CEO) ← CMO Weekly Review
```

## Active research artifacts

- `.paperclip/research/competitive-feature-matrix.md`
- `.paperclip/research/usp-backlog.md`
- `.paperclip/research/competitive-landscape.md`
- `.paperclip/research/intake-YYYY-MM-DD.md` (created by Daily Research Intake)

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/paperclip-unblock-workflow.py` | Close health dupes, unpause research agents, upgrade prompts, wake agents |
| `scripts/paperclip-create-speed-routines.py` | Create speed-dev routines (initial scaffold) |
| `scripts/paperclip-recover-agents.py` | Pause non-core, wake eng core |

## Agent activation policy

| Tier | Agents | Heartbeat |
|------|--------|-----------|
| **Always on** | SRE, Builder, QA, CTO | 5–15 min |
| **Product loop** | PM, Market Researcher, Competitive Analyst | 15–20 min |
| **Marketing** | CMO, Content Marketer | 20–40 min |
| **Design** | Head of Design, PD, DS, UI Engineer | Unpause when eng capacity allows |
| **Paused by default** | CEO (event-driven), Community Lead | Wake for weekly routines only |

Apply playbook text updates: `python3 scripts/paperclip-unblock-workflow.py`
