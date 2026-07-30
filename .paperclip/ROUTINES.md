# Dostel Routines Audit — Speed Dev, Research, E2E, Deploy

**Updated:** Jul 28, 2026 · **Total:** 28 (8 speed-dev routines live; delete `Platform Health Watch TEST` stub manually)

## What you have today (good foundation)

| Cadence | Routines | Purpose |
|---------|----------|---------|
| **Daily eng** | Standup, EOD Update, Morning Ship Block* | CTO + Builder rhythm |
| **Weekly planning** | CEO Planning, Friday Board, CMO Weekly | Strategy + status |
| **QA / security** | Smoke sweep, Red/Blue team, Security patch | Quality + security |
| **Design** | Design crit, DS office hours, UI polish, PD flow review | UX craft |
| **Marketing** | Content sprint, Dostellers pulse, Market Research pulse | Brand + community |
| **PM** | Backlog grooming, Research triage* | Backlog hygiene |

\*New in speed-dev wave

## Gaps we closed

| Gap | Routine added | Owner |
|-----|---------------|-------|
| No continuous platform uptime | **Platform Health Watch** (every 30m) | SRE |
| No E2E product test | **E2E Guest→Admin Journey Test** (weekdays) | QA |
| No deploy gate | **Deploy & Release Gate** (weekdays 19:00) | SRE |
| Research not daily | **Daily Research Intake** (weekdays 08:00) | Market Researcher |
| USP vs competitors ad hoc | **Competitive USP & Feature Matrix** (Mon/Wed/Fri) | Market Researcher |
| PM not triaging research | **PM Research & USP Triage** (weekdays 08:30) | PM |
| Builder only EOD | **Morning Ship Block** (weekdays 11:00) | Builder |
| Shallow competitor dives | **Weekly Competitive Deep Dive** (Fridays) | Market Researcher |

## Competitive intelligence agent

Hire config: `.paperclip/hires/15-competitive-analyst.json`  
Agent: **Dostel Competitive Analyst** (`31261d88-f4a3-46ce-9d7a-3f8f87510aa5`) — **approved & active**  
Instructions: `.paperclip/COMPETITIVE_ANALYSIS_INSTRUCTIONS.md`  
Artifacts: `research/competitive-feature-matrix.md`, `research/usp-backlog.md`

**Competitive Analyst** owns USP matrix + weekly deep dive. **Market Researcher** keeps daily intake + Market Research Pulse.

## Recommended heartbeat intervals (speed mode)

| Agent | Current | Suggested |
|-------|---------|-----------|
| Builder | 600s | 600s ✓ |
| QA | 900s | 600s |
| SRE | 300s | 300s ✓ |
| PM | 1200s | 900s |
| Market Researcher | 1800s | 1200s |

## Self-reinforcing loop

```
Research (daily + USP matrix) → PM triage → Builder morning ship
    → QA E2E test → SRE health + deploy gate → CEO Friday board
```

Script to recreate routines: `scripts/paperclip-create-speed-routines.py`
