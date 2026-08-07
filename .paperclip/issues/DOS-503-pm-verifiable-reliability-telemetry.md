# DOS-503: Verifiable reliability telemetry — publish the record, not the claim

## Priority: P1
## Type: Backend / Frontend / Ops
## Parent: DOS-500

### Source
- Waterheaterman, welcomed as a BHC vendor member alongside four AI startups — in boutique hospitality, hot water working *is* a product feature
- `.paperclip/marketing/reliability-card-workweek-copy.md`
- `.paperclip/marketing/verified-hill-stay-reliability-messaging.md`
- DOS-391 (Verified Hill Stay)

### Problem
We already market reliability — the Verified Hill Stay positioning and the reliability card both promise it. But it is copy, not data. In the Western Ghats every listing claims reliable power and WiFi and roughly half of them are lying. A claim that cannot be checked is worth nothing to the remote worker deciding between us and a Kodaikanal guesthouse, because they have been burned before and they assume we are lying too.

### Opportunity
Measure it and publish it. A verifiable reliability record is a differentiator no OTA can fake, no AI vendor can sell to our competitors, and no copywriter can produce. It converts the highest-value long-stay segment (remote workers, workations) precisely because it is falsifiable.

### Acceptance Criteria
- [ ] Telemetry agent on-property logs: mains/inverter state transitions, hot-water availability windows, WiFi speed + packet loss (scheduled test), and uptime heartbeats
- [ ] Ingest endpoint on the backend, tolerant of extended offline periods (buffer locally, batch on reconnect — the property loses connectivity, and connectivity loss is itself a data point that must not be lost)
- [ ] `Hostel` model stores rolling reliability aggregates (7d / 30d / 90d)
- [ ] `hostel.reliability` exposed via GraphQL
- [ ] Reliability panel on the hostel detail page showing real numbers with the measurement window and last-updated timestamp
- [ ] Bad months are published too — the panel shows the actual record, including outages. Suppression defeats the entire mechanism
- [ ] Public methodology note: what is measured, how often, by what device

### Technical Notes
- Collector: small agent on a Pi or the property router; MQTT or plain HTTPS POST with an HMAC-signed device key
- Backend: extend `apps/backend/src/models/hostel.js` + `hostelResolver.js`; aggregation via scheduled job (project already uses node-cron for reminders)
- Hot water is the hard signal — likely a temperature sensor on the outlet line rather than an inferred schedule. Scope the sensor choice before committing to the metric
- Keep raw events append-only and separate from aggregates so the published numbers are reproducible from source

### Dependencies
- Hardware procurement for on-property sensors (power, temperature) — not yet scoped
- DOS-391 (Verified Hill Stay) — messaging layer that consumes these numbers

### Risk
This only works if we publish honestly. If the first monsoon shows 60% inverter uptime, that number goes on the page. The mechanism's entire value is that a guest can trust it *because* we did not hide the bad month. Get explicit sign-off on that commitment before build starts.

### Metrics
- Reliability panel viewed by > 40% of workation-intent sessions
- Workation booking conversion for sessions that viewed the panel: +20% vs. those that did not
- Data completeness: > 95% of hours covered by telemetry

### Status
todo
