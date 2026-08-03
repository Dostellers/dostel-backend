# DOST-98: Sustainability Impact Tracker

**Priority**: P3  
**Owner**: Builder (Backend + Admin Dashboard)  
**Requestor**: Product Manager (Brand Story)  

## Why  
The Bob & Tanya ecological restoration story is a unique brand asset, but currently unquantified. Competitors don't offer impact tracking. This feature differentiates Dostel and supports future token/airline rewards.

## Scope (MVP Tracker)
1. **Impact Display (Public)**  
   - "Trees planted: 1,200"  
   - "Waste reduced: 350 kg"  
   - "Community days: 42"  
2. **Dosteller Dashboard (Logged-in)**  
   - Personal contribution badge  
   - Progress toward next impact milestone  
3. **Admin Input**  
   - Manual entry of impact hours/volume  
   - Annual impact report generation  

## Files
- `apps/backend/src/schema/impact.types.ts` (new)
- `apps/backend/src/resolvers/impact.resolvers.ts` (new)
- `apps/frontend/components/ImpactCard.tsx` (new)
- `apps/admin/pages/impact/page.tsx` (new)

## Acceptance Criteria
- [ ] Public badge shows aggregate impact stats
- [ ] Logged-in Dostellers see personal contribution
- [ ] Admin can update metrics without DB migration
- [ ] Report exports to PDF (future)

## Dependencies
- **DOS-86** (membership schema) — for contribution tracking

## Source
- `.paperclip/marketing/Dostel-Growth-Requirements-Brief-for-Product.md` (Competitive Research Gap #5)