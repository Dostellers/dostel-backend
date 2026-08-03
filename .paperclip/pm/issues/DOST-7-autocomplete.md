# DOST-7: Activity Search Autocomplete Feature  

**Priority**: Medium  
**Owner**: Frontend Engineer  
**Requestor**: Product Manager (Community Growth)  

## Why  
To increase conversion in Dostellers activity sign-ups (DOST-6) by providing instant suggestions based on tier and past spend behavior. Competitive edge vs. Zostel's quest system.  

## Scope  
1. Implement autocomplete in `/dostellers/search` page  
2. Suggest activities based on:  
   - Current Dosteller tier (e.g., "Seedling workations")  
   - Past activity bookings (e.g., "Kristen's Woodworking Workshop")  
   - Popular cues (e.g., "wilderness", "skills", "community")  
3. Memory of last 3 searches for returning Dostellers  
4. Filter results to show only accessible activities  

## Files  
- `apps/frontend/components/SearchAutocomplete.tsx` (new)  
- Update `apps/frontend/app/dostellers/search.tsx`  
- Use `activities` collection from backend  

## Acceptance Criteria  
- [ ] Typeahead shows activities as user types first 2 characters  
- [ ] Results filtered by Dosteller tier (Seedling sees "Beginner Workshops", Expert sees "Advanced Hikes")  
- [ ] Past activity bookings appear at top of suggestions  
- [ ] No results shown for inaccessible activities  

## Dependencies  
- DOST-6 (activity sign-up flow) already built  
- `activities` collection exists  

## Notes  
- Reference research: `/root/dostel-backend/.paperclip/research/community-activity-search-patterns.md` (new research note)