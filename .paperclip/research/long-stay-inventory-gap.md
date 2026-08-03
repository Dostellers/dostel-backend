# Research Brief: Vattakanal Long-Stay Visibility Gap  

## Problem  
Hostelworld search for 'Kodaikanal' shows 1 listing with 3 rooms visible. Dostel's 40-bed dorms aren't surfacing in long-stay filters (minimum 30 nights).  
Assumption: Channel manager sync uses static mapping; won't update for long-stay segments.  

## Solution Path  
Add dynamic inventory export logic in `channel-manager.js` to expose dorm availability for stays ≥30 nights.  
Reference research: `open-source-pms-patterns-2026-07-30.md` Section 3.2 (long-stay mapping)  

## Next Action  
Build DOST-1 to validate long-stay sync logic with Hostelworld staging.  

## Sources  
- Hostelworld listing: Dostel Vattakanal (8.9/10)  
- `pms-vendor-comparison-jul-2026.md` (section on inventory mapping)