#!/usr/bin/env python3
"""Create speed-dev, E2E, deploy, and competitive research routines for Dostel."""
import json
import subprocess
import sys

COOKIE = '/tmp/paperclip-board.cookies'
ORIGIN = 'http://localhost:3100'
CID = '2741f8bc-95ff-40c7-81a4-c8f59131c250'
PROJECT = 'f30dbea4-2573-487f-8fb5-d3885fe20beb'
TZ = 'Asia/Kolkata'

AGENTS = {
    'SRE': '388beb2f-682d-4af8-a436-e78a5414fcde',
    'QA': 'b91580aa-9267-4e81-b39a-7b161f903d7c',
    'Builder': '8ffc8018-6412-44a0-aa37-e24eeb5e5365',
    'PM': 'cdc7530e-12b1-4b7a-9e4c-1b73fde96a4e',
    'Researcher': '616fa5e9-da2f-4f82-830c-0da3c1abad93',
    'CTO': 'cb6613a7-d2c4-400d-8d47-295646a9022f',
}

NEW_ROUTINES = [
    {
        'title': 'Platform Health Watch',
        'assignee': 'SRE',
        'priority': 'high',
        'cron': '*/30 * * * *',
        'label': 'Every 30 min',
        'description': (
            'Run scripts/healthcheck.sh for Paperclip, :3001, :3002, :4000, OmniRoute. '
            'If any FAIL, restart dostel-* / paperclip units (see .paperclip/OPS_INSTRUCTIONS.md) '
            'and comment on open ops issue. Keep platform green for all agents.'
        ),
    },
    {
        'title': 'Competitive USP & Feature Matrix',
        'assignee': 'Researcher',
        'priority': 'high',
        'cron': '0 10 * * 1,3,5',
        'label': 'Mon/Wed/Fri 10:00 IST',
        'description': (
            'Update .paperclip/research/competitive-feature-matrix.md and usp-backlog.md. '
            'Compare Dostel vs Zostel, Hosteller, Cloudbeds on booking, membership, PMS, payments, app. '
            'File PM issues for top USP gaps with Impact/Effort scores.'
        ),
    },
    {
        'title': 'Daily Research Intake',
        'assignee': 'Researcher',
        'priority': 'medium',
        'cron': '0 8 * * 1-5',
        'label': 'Weekdays 08:00 IST',
        'description': (
            'Scan competitor/product news, OTA listing changes, pricing signals. '
            'Append .paperclip/research/ and create at least one Paperclip issue for PM or CMO when actionable.'
        ),
    },
    {
        'title': 'E2E Guest to Admin Journey Test',
        'assignee': 'QA',
        'priority': 'high',
        'cron': '30 9 * * 1-5',
        'label': 'Weekdays 09:30 IST',
        'description': (
            'End-to-end test: guest site (:3001) browse → hostel detail → booking flow stub; '
            'admin (:3002) loads; GraphQL (:4000) health. Run scripts/healthcheck.sh first. '
            'File [QA] issues for regressions; mark done when green.'
        ),
    },
    {
        'title': 'Deploy & Release Gate',
        'assignee': 'SRE',
        'priority': 'medium',
        'cron': '0 19 * * 1-5',
        'label': 'Weekdays 19:00 IST',
        'description': (
            'After Builder EOD: verify all services healthy, confirm latest main workspace state, '
            'document deploy readiness in issue comment. Escalate to CTO if GraphQL/frontend/admin down.'
        ),
    },
    {
        'title': 'Morning Ship Block',
        'assignee': 'Builder',
        'priority': 'high',
        'cron': '0 11 * * 1-5',
        'label': 'Weekdays 11:00 IST',
        'description': (
            'Ship one vertical slice from PM backlog (checkout issue first). '
            'Prefer runnable guest or admin improvement. Comment diff + next step.'
        ),
    },
    {
        'title': 'PM Research & USP Triage',
        'assignee': 'PM',
        'priority': 'medium',
        'cron': '30 8 * * 1-5',
        'label': 'Weekdays 08:30 IST',
        'description': (
            'Triage research/USP issues from Competitive Analyst and Market Researcher. '
            'Promote top items to todo for Builder/QA. Update .paperclip/pm/ sprint pack.'
        ),
    },
    {
        'title': 'Weekly Competitive Deep Dive',
        'assignee': 'Researcher',
        'priority': 'medium',
        'cron': '0 14 * * 5',
        'label': 'Fridays 14:00 IST',
        'description': (
            'Pick one competitor (rotate Zostel → Hosteller → Cloudbeds → OTAs). '
            'Write deep-dive in .paperclip/research/competitive/. Summarize USPs for CMO Friday board.'
        ),
    },
]


def curl(method, path, data=None, timeout=45):
    cmd = [
        'curl', '-sS', '--max-time', str(timeout),
        '-b', COOKIE,
        '-X', method, f'{ORIGIN}{path}',
        '-H', 'Content-Type: application/json',
        '-H', f'Origin: {ORIGIN}',
    ]
    if data is not None:
        cmd += ['-d', json.dumps(data)]
    out = subprocess.check_output(cmd, text=True, stderr=subprocess.STDOUT)
    return json.loads(out) if out.strip() else {}


def existing_titles():
    for attempt in range(3):
        routines = curl('GET', f'/api/companies/{CID}/routines', 60)
        if isinstance(routines, list):
            return {r.get('title', '').strip().lower() for r in routines}
        if attempt < 2:
            import time
            time.sleep(2)
    raise RuntimeError(f'routines API error: {routines}')


def create_routine(spec):
    body = {
        'title': spec['title'],
        'description': spec['description'],
        'assigneeAgentId': AGENTS[spec['assignee']],
        'projectId': PROJECT,
        'priority': spec['priority'],
        'status': 'active',
        'concurrencyPolicy': 'coalesce_if_active',
        'catchUpPolicy': 'skip_missed',
    }
    routine = curl('POST', f'/api/companies/{CID}/routines', body, 45)
    rid = routine.get('id')
    if not rid:
        raise RuntimeError(f'create failed: {routine}')
    trigger = curl('POST', f'/api/routines/{rid}/triggers', {
        'kind': 'schedule',
        'cronExpression': spec['cron'],
        'timezone': TZ,
        'label': spec['label'],
        'enabled': True,
    }, 45)
    return routine, trigger


def main():
    titles = existing_titles()
    created = 0
    skipped = 0
    for spec in NEW_ROUTINES:
        key = spec['title'].strip().lower()
        if key in titles:
            print(f'SKIP (exists): {spec["title"]}')
            skipped += 1
            continue
        routine, trigger = create_routine(spec)
        print(f'CREATED: {spec["title"]} -> {spec["assignee"]} ({spec["label"]}) id={routine.get("id", "")[:8]}')
        created += 1
    print(f'\nDone: {created} created, {skipped} skipped, total target {len(NEW_ROUTINES)}')


if __name__ == '__main__':
    main()
