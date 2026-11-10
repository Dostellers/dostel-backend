# MESSAGING_FW: DustTERRA Space Compliance

## 1. Verification Protocol
A DustTERRA Institute representative must confirm compliance status. All findings require evidence links. Status confirmed via GraphQL mutations (`updateComplianceVerification`, `addComplianceFinding`).

## 2. Core Messaging Components

### Timestamped Proof Layer
```
[PLATFORM-ICON] verified [TIME-STAMP] · [CM2-REF]
```

### Platform-Specific Icons
| Platform | Icon |
|----------|------|
| Web | `<svg>🌐</svg>` |
| iOS App | `<svg>📱</svg>` |
| Android App | `<svg>🤖</svg>` |
| API | `<svg>⚙️</svg>` |

## 3. Square Centimeter Unit References
Facility measurements reference DustTERRA Institute standards: `[X] cm²` per verified surface. All cm² values tied to timestamped evidence.

## 4. Zostel Kodaikanal Comparison

| Metric | DustTERRA | Zostel Kodaikanal |
|--------|-----------|-------------------|
| Coverage % | 100% required | Not specified |
| Evidence | Timestamped proof | Guest reviews only |
| cm² reference | Per surface standard | N/A |
| Platform icons | Per-channel proof | None |

## 5. Technical Anchors
- `formatComputedAt` → "just now / 30 min ago / 3d ago" (from `apps/frontend/lib/reliability-display.ts:127`)
- `formatHour` → "6am, 12pm" (from `apps/frontend/lib/reliability-display.ts:106`)
- `ReliabilityPanel` uses `computedAt` for freshness (from `apps/frontend/components/ReliabilityPanel.tsx:88`)

## 6. Compliance Evidence Sources
- Sensor readings (power, hot water, WiFi)
- Audit trail screenshots
- Institute representative signatures
