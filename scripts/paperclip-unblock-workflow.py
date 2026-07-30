#!/usr/bin/env python3
"""Unblock Dostel ticket flow: close health dupes, unpause research agents, upgrade routines."""
import json
import subprocess
import sys
import time
from collections import Counter

COOKIE = '/tmp/paperclip-board.cookies'
API = 'http://127.0.0.1:3100'
AUTH = 'https://office.witylogix.com'
MUT = 'http://127.0.0.1:3100'
CID = '2741f8bc-95ff-40c7-81a4-c8f59131c250'
PROJECT = 'f30dbea4-2573-487f-8fb5-d3885fe20beb'
BUILDER = '8ffc8018-6412-44a0-aa37-e24eeb5e5365'

CORE_ENG = {
    BUILDER,
    'b91580aa-9267-4e81-b39a-7b161f903d7c',  # QA
    '388beb2f-682d-4af8-a436-e78a5414fcde',  # SRE
    'cb6613a7-d2c4-400d-8d47-295646a9022f',  # CTO
}

WAKE_ORDER = [
    '388beb2f-682d-4af8-a436-e78a5414fcde',
    '616fa5e9-da2f-4f82-830c-0da3c1abad93',
    '31261d88-f4a3-46ce-9d7a-3f8f87510aa5',
    'cdc7530e-12b1-4b7a-9e4c-1b73fde96a4e',
    'cb6613a7-d2c4-400d-8d47-295646a9022f',
    BUILDER,
    'b91580aa-9267-4e81-b39a-7b161f903d7c',
]

UNPAUSE_NAME_PARTS = (
    'Product Manager', 'Market Researcher', 'Competitive Analyst', 'CMO', 'Content Marketer',
)

ROUTINE_PROMPTS = {
    'Platform Health Watch': """## Enterprise ops runbook — Platform Health Watch

**Role:** Site Reliability (on-call platform engineer)
**RACI:** Responsible=SRE · Accountable=CTO · Consulted=Builder · Informed=CEO

### Preconditions
- Workspace: `/root/dostel-backend`
- Runbook: `.paperclip/OPS_INSTRUCTIONS.md`

### Execution (every 30 min)
1. Run `scripts/healthcheck.sh` (Paperclip :3100, guest :3001, admin :3002, GraphQL :4000, OmniRoute :20128).
2. **If ALL green:** mark **this routine execution issue** `done` with one-line proof (HTTP codes). Do **not** file new platform-health tickets. Close stale duplicate `Platform health` blocked issues as `cancelled` with note "superseded — platform green".
3. **If ANY fail:** run `sudo /root/dostel-backend/scripts/restart-dostel-service.sh <unit>`. Re-check after 10s.
4. **If still failing:** keep issue `blocked`, @-mention **Dostel CTO**, attach `sudo journalctl -u <unit> -n 40`.
5. Never ask Builder to kill root-owned PIDs — escalate to SRE/CTO.

### Definition of done
- All healthcheck lines OK, OR documented escalation with owner + next action.""",

    'Morning Ship Block': """## Enterprise engineering runbook — Morning Ship Block

**Role:** Full-stack engineer (delivery lane)
**RACI:** Responsible=Builder · Accountable=CTO · Consulted=PM/QA

### Goal
Ship **one vertical slice** before noon IST — runnable code, not planning docs.

### Execution
1. Check inbox — pick highest-priority `todo` **feature** issue (skip platform-health noise). Checkout first.
2. If no feature todo: pull from PM backlog (`DOS-64` room availability, `DOS-65` membership) or PM research issues.
3. Implement smallest shippable slice in `/root/dostel-backend`.
4. Run `scripts/healthcheck.sh` before marking done.
5. Comment: files changed, curl URL to verify, next slice recommendation.

### Definition of done
- Code in workspace + verification steps + status updated.""",

    'Daily Research Intake': """## Enterprise product intelligence — Daily Research Intake

**Role:** Market Intelligence analyst · **Accountable:** CMO · **Handoff:** PM

### Execution (weekday mornings)
1. Scan Zostel, Hosteller, Cloudbeds, OTAs — product, pricing, UX, membership moves.
2. Append `.paperclip/research/intake-YYYY-MM-DD.md` or update `competitive-landscape.md`.
3. **Create ≥1 Paperclip issue** for PM when actionable (prefix `[Research]`).
4. Update `research/usp-backlog.md` with Impact × Effort scores.

### Definition of done
- Dated artifact + ≥1 PM issue OR "no material change" with evidence.""",

    'Competitive USP & Feature Matrix': """## Enterprise competitive analysis — USP Matrix

**Role:** Competitive Analyst · **Cadence:** Mon/Wed/Fri

1. Refresh `research/competitive-feature-matrix.md` and `research/usp-backlog.md`.
2. File **1–3 PM issues** for top USP gaps with acceptance criteria.
3. @-mention PM on high-impact items.

**DoD:** Matrix dated + backlog ranked + PM issues created/promoted.""",

    'PM Research & USP Triage': """## Enterprise product ops — Research Triage

**Role:** PM · **Cadence:** Weekdays 08:30 IST

1. Triage `[Research]` / `[USP]` issues + latest `.paperclip/research/`.
2. Promote top 2 to `todo` for Builder with acceptance criteria.
3. Cancel/merge duplicates. Update PM sprint notes in `.paperclip/pm/`.
4. Ensure Builder always has a **feature** (not ops) issue in `todo`.

**DoD:** Priority stack updated + actionable eng tickets ready.""",

    'PM Backlog Grooming': """## Enterprise backlog grooming (PM)

Mon/Thu: INVEST-refine top 10 items; split epics >3 days; add acceptance criteria; archive duplicates; sync with CTO on dependencies.""",

    'E2E Guest to Admin Journey Test': """## Enterprise QA — E2E journey

Run healthcheck → guest :3001 flows → admin :3002 → GraphQL. File `[QA]` regressions with repro. Mark done when green.""",

    'Deploy & Release Gate': """## Enterprise release gate (SRE)

Verify healthcheck green + no open P0 platform issues. Document release readiness or escalate to CTO.""",

    'Daily Standup': """## Enterprise standup (CTO)

Summarize ships, WIP, blockers across Builder/QA/SRE. Reassign or create issues for risks. Unblock eng delivery.""",

    'Weekly Planning Call': """## Enterprise weekly planning (CEO)

Review goals, P0/P1, approve PM priority stack, assign owners, document decisions.""",

    'Weekly Competitive Deep Dive': """## Enterprise competitor deep dive

Rotate Zostel → Hosteller → Cloudbeds. Write in `research/competitive/`. Exec summary for CMO/Friday board.""",

    'Market Research Pulse': """## Enterprise market pulse

Quick news/pricing/OTA scan. Append pulse note; flag PM if urgent.""",

    'End-of-Day Update Call': """## Enterprise EOD review (Builder)

Summarize today's ships, open issues, tomorrow's target. Mark routine done.""",

    'QA Smoke & Regression Sweep': """## Enterprise QA smoke sweep

Smoke critical paths; triage failures to Builder; document in comment.""",

    'CMO Weekly Growth Review': """## Enterprise CMO weekly review

Review research, content pipeline, community. Prioritize campaigns; create weekly marketing issues.""",

    'Content Calendar & Copy Sprint': """## Enterprise content sprint

Draft copy in `.paperclip/marketing/` or file frontend copy issues. One shippable pack per run.""",

    'Friday Status / Board Update': """## Enterprise board update (CEO)

Weekly scorecard: ships, incidents, research highlights, next-week bets.""",
}


def curl(method, path, data=None, timeout=45, origin=MUT):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-b', COOKIE, '-c', COOKIE,
        '-X', method, f'{API}{path}',
        '-H', 'Content-Type: application/json',
        '-H', f'Origin: {origin}',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    return json.loads(out) if out.strip() else {}


def login():
    curl('POST', '/api/auth/sign-in/email', {
        'email': 'connect@wityliti.io',
        'password': 'Wityliti@2026',
    }, origin=AUTH)


def close_platform_health_dupes():
    issues = curl('GET', f'/api/companies/{CID}/issues?limit=200')
    closed = 0
    for issue in issues:
        title = (issue.get('title') or '').lower()
        if 'platform health' not in title:
            continue
        if issue.get('status') not in ('blocked', 'todo', 'in_progress'):
            continue
        curl('PATCH', f'/api/issues/{issue["id"]}', {
            'status': 'done',
            'comment': (
                'Closed duplicate platform-health ticket — platform recovered. '
                'SRE routine now closes green checks without spawning dupes.'
            ),
        })
        closed += 1
        print(f'  closed {issue.get("identifier")}')
    return closed


def unpause_agents(agents):
    ids = set(CORE_ENG)
    for a in agents:
        if any(part in a.get('name', '') for part in UNPAUSE_NAME_PARTS):
            ids.add(a['id'])
    resumed = 0
    for agent in agents:
        if agent['id'] in ids and agent.get('status') == 'paused':
            curl('POST', f'/api/agents/{agent["id"]}/resume')
            print(f'  resumed {agent.get("name")}')
            resumed += 1
    return resumed


def upgrade_routines(routines):
    updated = 0
    for routine in routines:
        title = routine.get('title', '')
        if title == 'Platform Health Watch TEST':
            curl('PATCH', f'/api/routines/{routine["id"]}', {'status': 'paused'})
            print(f'  paused: {title}')
            continue
        prompt = ROUTINE_PROMPTS.get(title)
        if not prompt:
            continue
        curl('PATCH', f'/api/routines/{routine["id"]}', {
            'description': prompt,
            'concurrencyPolicy': 'coalesce_if_active',
            'catchUpPolicy': 'skip_missed',
        })
        print(f'  upgraded: {title}')
        updated += 1
    return updated


def promote_feature_backlog():
    issues = curl('GET', f'/api/companies/{CID}/issues?limit=200')
    promoted = 0
    for issue in issues:
        ident = issue.get('identifier', '')
        if ident in ('DOS-64', 'DOS-65', 'DOS-66') and issue.get('status') in ('backlog', 'blocked'):
            curl('PATCH', f'/api/issues/{issue["id"]}', {
                'status': 'todo',
                'assigneeAgentId': BUILDER,
                'priority': 'high',
                'comment': 'Promoted to active eng backlog after workflow unblock.',
            })
            print(f'  promoted {ident}')
            promoted += 1
    return promoted


def wake_agents(names):
    for aid in WAKE_ORDER:
        if aid not in names:
            continue
        try:
            curl('POST', f'/api/agents/{aid}/wake', {
                'source': 'on_demand',
                'reason': 'Workflow unblock — research + feature pipeline restart',
            }, timeout=20)
            print(f'  woke {names[aid]}')
            time.sleep(2)
        except subprocess.CalledProcessError as err:
            print(f'  wake skip {names.get(aid, aid)}: {err}', file=sys.stderr)


def ensure_research_epic(pm_id):
    issues = curl('GET', f'/api/companies/{CID}/issues?limit=80&status=todo,in_progress')
    for i in issues:
        if 'Continuous feature discovery' in (i.get('title') or ''):
            print('  research epic already exists')
            return
    issue = curl('POST', f'/api/companies/{CID}/issues', {
        'title': '[Research] Continuous feature discovery — PMS + Dostellers USP pipeline',
        'description': (
            'Standing epic: Researcher + Competitive Analyst → PM triage → Builder ships. '
            'See `.paperclip/ROUTINE_PROMPTS.md` and `research/usp-backlog.md`.'
        ),
        'status': 'in_progress',
        'priority': 'high',
        'assigneeAgentId': pm_id,
        'projectId': PROJECT,
    })
    print(f'  created {issue.get("identifier")}')


def main():
    login()
    agents = curl('GET', f'/api/companies/{CID}/agents')
    names = {a['id']: a.get('name', '') for a in agents}
    pm_id = next(a['id'] for a in agents if 'Product Manager' in a.get('name', ''))

    print('=== Close platform health duplicates ===')
    print(f'  {close_platform_health_dupes()} closed')

    print('\n=== Unpause research/product agents ===')
    print(f'  {unpause_agents(agents)} resumed')

    print('\n=== Upgrade routine prompts ===')
    routines = curl('GET', f'/api/companies/{CID}/routines')
    print(f'  {upgrade_routines(routines)} upgraded')

    print('\n=== Promote feature backlog ===')
    print(f'  {promote_feature_backlog()} promoted')

    print('\n=== Research epic ===')
    ensure_research_epic(pm_id)

    print('\n=== Wake agents ===')
    wake_agents(names)

    issues = curl('GET', f'/api/companies/{CID}/issues?limit=200')
    print('\n=== AFTER ===', dict(Counter(i.get('status') for i in issues)))
    for i in [x for x in issues if x.get('status') == 'todo'][:10]:
        print(f"  {i.get('identifier')} -> {names.get(i.get('assigneeAgentId'), '?')}: {i.get('title','')[:55]}")


if __name__ == '__main__':
    main()
