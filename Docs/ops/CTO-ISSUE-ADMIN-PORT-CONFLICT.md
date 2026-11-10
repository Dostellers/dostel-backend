# [CLOSED] Admin Service Port Conflict - P0 Alert

**Summary:** The Admin PMS service (`dostel-admin.service`) is failing to start due to port conflicts with stale Next.js development processes. The service is being blocked by frontend processes incorrectly bound to port 3002.

**Symptoms:**
- Admin service stuck in `activating` state
- Multiple Next.js processes occupying ports 3001/3002
- Service restart attempts fail with `EADDRINUSE` errors
- Admin panel inaccessible at http://65.109.113.80:3002/

**Evidence from Logs:**
```
Aug 01 00:16:21 start-next-dev.sh[3458400]: Error: listen EADDRINUSE: address already in use 0.0.0.0:3002
Aug 01 00:16:21 start-next-dev.sh[3458400]:     at <unknown> (Error: listen EADDRINUSE: address already in use 0.0.0.0:3002) {
Aug 01 00:16:21 start-next-dev.sh[3458400]:       code: 'EADDRINUSE',
Aug 01 00:16:21 start-next-dev.sh[3458400]:       errno: -98,
Aug 01 00:16:21 start-next-dev.sh[3458400]:       syscall: 'listen',
Aug 01 00:16:21 start-next-dev.sh[3458400]:       address: '0.0.0.0',
Aug 01 00:16:21 start-next-dev.sh[3458400]:       port: 3002
```

**Process Investigation Findings:**
```
root     3536083 37.5  0.1 1117664 69040 ?       Ssl  00:20   0:00 npm run dev --port 3002
root     3536099  111  0.1 11546352 72452 ?      Sl   00:20   0:00 node /root/dostel-backend/apps/frontend/node_modules/.bin/next dev -p 3001 -H 0.0.0.0 --port 3002
```

**Root Cause:**
1. Frontend processes are incorrectly configured to bind to port 3002 (`--port 3002` flag)
2. Stale Next.js dev servers persist after service restarts
3. Port cleanup in restart script is insufficient against rapidly respawned processes

**Impact:** Admin PMS completely inaccessible - P0 outage affecting all administrative functions.

**Recommended Actions:**
1. Investigate frontend service configuration for incorrect port binding
2. Implement stronger process cleanup in restart scripts
3. Consider adding port validation before service startup
4. Review Next.js dev scripts in both frontend and admin packages

**Assign to:** Dostel CTO (Architecture/Port Configuration)
**Priority:** P0 - Platform Down
**Component:** dostel-admin.service

**Resolution (2026-08-01):** Service recovered and is healthy. Healthcheck returns HTTP 200 on port 3002. Issue closed.