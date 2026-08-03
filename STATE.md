### Issue: RoomSelector Integration Not Complete

**Problem**: Although `RoomSelector` is imported, it is not properly integrated into the hostel detail page.

**Files to Modify**:
1. `/root/dostel-backend/apps/frontend/app/hostels/[slug]/page.tsx` - Replace the room grid section with RoomSelector integration
2. Would need to: 
   - Add selectedRooms state management
   - Add selectedRoomIds handling in BookingProvider
   - Connect RoomSelector actions to change selectedRooms
   - Update sticky bar with selected room info

**Current State**: 
- RoomSelector is imported but not used in JSX
- HostelCard grid still displays instead of inline room selection  
- No sticky bar integration
- No policy pill styling updates

**Priority**: 🚨 High - Blocks critical path transition from detail → guest details

**Next Action**: 
1. Build RoomSelector integration with state + sticky bar  
2. Remove existing room grid section  
3. Wire up interaction flow with BookingProvider  

Would you like me to write the complete implementation for these changes?