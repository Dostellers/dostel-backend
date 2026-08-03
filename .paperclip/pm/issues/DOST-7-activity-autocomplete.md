# DOST-7: Implement Activity Search Autocomplete  

**Priority**: P2  
**Owner**: Frontend Engineer  
**Requestor:** Product Manager (Community Growth)  

## Why  
- Autocomplete suggestions increase engagement and conversion in the Dostellers activity search flow.  
- Competitors like Zostel use quest-based navigation; we need a similarly intuitive search experience.  
- Directly supports DOST-6 (activity sign-up flow) by reducing friction for members.  

## Scope  
1. **Search Input Component**  
   - Build `/dostellers/search` page with a typeahead input.  
   - As user types queries like "wild", "trek", or "cooking", suggest relevant activities.  
2. **Smart Suggestions**  
   - Filter by popularity and tier relevance:  
     - Seedling (Explorer tier): "Beginner Workshops", "Intro to Natural Farming"  
     - Established (Contributor tier): "Advanced Hikes", "Craft Workshops"  
     - Expert (Dosteller tier): "Lead Community Workshops"  
   - Prioritize activities with higher sign-up rates (from `activities_attendance` collection).  
3. **Autocomplete Logic**  
   - Fetch suggestions via GraphQL query to `activities` collection.  
   - Show loading spinner when results take >300ms.  
4. **User Experience**  
   - Display suggestions with activity icons (e.g., 🌿, 🪵, 🧑‍🌾).  
   - Allow keyboard navigation and Enter/Space selections.  
   - Fallback to empty state if no matches found.  

## Files  
- `apps/frontend/app/dostellers/search.tsx` (new)  
- `apps/frontend/components/ActivitySuggestions.tsx` (new)  
- Update `apps/frontend/app/dostellers/search.tsx` to render suggested activities  

## Acceptance Criteria  
- [ ] Search bar accepts at least 2 characters before showing results.  
- [ ] Suggestions include activity name, icon, and brief description.  
- [ ] Results are filtered by tier-based popularity (Seedling < Established < Expert).  
- [ ] Keyboard navigation and Enter/Space activation work.  
- [ ] No suggestions appear for empty queries or unrelated terms.  

## Dependencies  
- **DOST-6** (activity sign-up flow) must be partially implemented to have an `activities` collection.  
- **DOT-5** (Dostellers landing page) may already render a search input; can integrate autocomplete there.  

## Notes  
- This issue should be implemented as a vertical slice — no full redesign of search UI required.  
- Reference research: `.paperclip/research/community-activity-search-patterns.md`