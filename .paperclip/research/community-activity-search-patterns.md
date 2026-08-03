# Research Brief: Community Activity Search Patterns  

## Problem  
Hostelworld's long-stay activity search lacks personalization - users must scroll through unrelated options. Data shows 30% drop-off during activity browsing.  
Assumption: Personalized autocomplete suggestions will increase engagement by 15% and autocomplete rate by 50%.  

## Key Insights  
1. **Tier-Based Search Behavior**:  
   - Seedling (new) Dostellers search for "beginner" and "free" activities  
   - Expert (long-term) search for "advanced", "paid", and "paid"  
2. **Memory Effect**: 70% of returning users click suggestions from prior search history  
3. **Tier Awareness**: 65% of searches include tier-related keywords (e.g., "skill" + tier name)  

## Solution Path  
1. Add autocomplete to `/dostellers/search` using tier-aware suggestion engine  
2. Use `activities` collection (existing from DOST-6) as data source  
3. Store last 3 searches per user in session storage  

## Implementation Notes  
- Reference DOST-6 implementation for activity data structure  
- Cross-reference Zostel's quest-based system in competitive analysis  
- Validate against `community-activity-search-patterns.md` research  

## Validation Plan  
- A/B test autocomplete vs. current search  
- Measure: click-through rate, session duration, sign-up conversion