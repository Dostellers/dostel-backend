# Dostellers Implementation Issues

Based on the Dostellers Journey Spec v2.0, here are the implementation issues for Builder/QA to work on. Each issue is a small, vertical slice.

## Issue 1: Dostellers Page - Add Hero Image

**Description**: Replace the gradient background in the hero section of the Dostellers page with a mountain/nature photography image consistent with the Dostel brand.

**Acceptance Criteria**:
- [ ] Hero section displays a high-quality mountain/nature photograph as background
- [ ] Image is responsive and maintains proper aspect ratio on all screen sizes
- [ ] Text remains readable over the image (use overlay or text shadow if needed)
- [ ] Image is optimized for web (compressed, appropriate format)

**Files to change**:
- `apps/frontend/app/dostellers/page.tsx`
- Possibly add image to `public/` directory and import it

**Dependencies**: None

## Issue 2: Dostellers Page - Add Testimonials Carousel

**Description**: Add a testimonials carousel below the benefits section and above the tiers section, featuring auto-scroll and pause on hover.

**Acceptance Criteria**:
- [ ] Carousel displays at least 3 testimonials (can use placeholder data from `dostellerTestimonials`)
- [ ] Auto-scrolls every 5 seconds
- [ ] Pauses auto-scroll when user hovers over carousel
- [ ] Includes navigation dots or arrows for manual control
- [ ] Accessible: supports keyboard navigation and screen readers
- [ ] Responsive layout: slides adjust for mobile/desktop

**Files to change**:
- `apps/frontend/app/dostellers/page.tsx`
- May need to create a new `TestimonialCarousel` component in `components/`

**Dependencies**: 
- Dostellers page structure (Issue #1)

## Issue 3: Dostellers Page - Add FAQ Accordion

**Description**: Add an FAQ accordion section at the bottom of the Dostellers page, keyboard accessible.

**Acceptance Criteria**:
- [ ] Accordion contains 4-5 common questions about Dostellers membership
- [ ] Each item can be expanded/collapsed by clicking header or pressing Enter/Space
- [ ] Only one item can be open at a time (accordion behavior)
- [ ] Smooth animation when opening/closing
- [ ] Proper ARIA attributes for accessibility

**Files to change**:
- `apps/frontend/app/dostellers/page.tsx`
- May need to create a new `FaqAccordion` component

**Dependencies**: 
- Dostellers page structure (Issue #1)

## Issue 4: Join Page - Visual Password Requirements

**Description**: Enhance the password field on the Join page to show visual requirements (length, character types) as the user types.

**Acceptance Criteria**:
- [ ] Password field shows requirements list below it
- [ ] Requirements update in real-time as user types (e.g., checkmark appears when requirement met)
- [ ] Requirements include: minimum 8 characters, at least one letter, at least one number
- [ ] Visual design matches Dostel design system (colors, spacing)

**Files to change**:
- `apps/frontend/app/dostellers/join/page.tsx`
- Possibly the `handleSubmit` function and form state

**Dependencies**: 
- Join page structure

## Issue 5: Join Page - Terms Agreement Button State

**Description**: Ensure the submit button on the Join page is disabled until the user agrees to the terms and conditions.

**Acceptance Criteria**:
- [ ] Submit button is disabled when page loads (checkbox unchecked)
- [ ] Submit button becomes enabled when checkbox is checked
- [ ] Submit button becomes disabled again if checkbox is unchecked
- [ ] Visual styling clearly indicates disabled state (opacity, cursor)

**Files to change**:
- `apps/frontend/app/dostellers/join/page.tsx`
- Specifically the button's `disabled` prop and the checkbox handler

**Dependencies**: 
- Join page structure

## Issue 6: Join Page - Post-Signup Redirection Logic

**Description**: Implement correct redirection after account creation based on membership tier.

**Acceptance Criteria**:
- [ ] For Bronze (free) tier: redirect to `/dashboard` with a welcome toast message after successful account creation
- [ ] For Silver/Gold tiers: redirect to `/booking/membership/payment` (Razorpay) for payment processing after account creation
- [ ] Handle loading states and error messages appropriately
- [ ] Ensure form resets on successful submission

**Files to change**:
- `apps/frontend/app/dostellers/join/page.tsx`
- May need to create/update toast notification system
- May need to check if `/booking/membership/payment` route exists (if not, create it or adjust)

**Dependencies**: 
- Join page structure
- Possible dependency on booking/payment routes

## Issue 7: Dashboard Page - Upcoming Stays Link Correction

**Description**: Fix the upcoming stays links on the dashboard to point to the dashboard bookings page instead of the public hostel detail page.

**Acceptance Criteria**:
- [ ] Each upcoming stay card links to `/dashboard/bookings/[slug]` (or `[id]` as per spec)
- [ ] Link preserves the booking context for dashboard-specific features
- [ ] Maintains same visual styling and hover effects

**Files to change**:
- `apps/frontend/app/dashboard/page.tsx`
- Specifically the `Link` component in the upcoming stays section

**Dependencies**: 
- Dashboard page structure
- Existence of `/dashboard/bookings/[slug]` route (if not, may need to create)

## Issue 8: Dashboard Page - Use HostelCard for Recommended Section

**Description**: Refactor the recommended hostel section on the dashboard to reuse the existing `HostelCard` component.

**Acceptance Criteria**:
- [ ] Replace custom hostel card implementation with `<HostelCard />` component
- [ ] Pass appropriate props (hostel data, Dosteller pricing badge if applicable)
- [ ] Maintain same visual appearance and layout
- [ ] Ensure Dosteller pricing badge shows when user is logged in as Dosteller

**Files to change**:
- `apps/frontend/app/dashboard/page.tsx`
- Import and use `HostelCard` from `components/`

**Dependencies**: 
- Dashboard page structure
- Existence and correctness of `HostelCard` component

## Issue 9: Dashboard Page - Points Bar Enhancement

**Description**: Ensure the PointsBar component displays the ₹ equivalent value and progress to next tier as specified.

**Acceptance Criteria**:
- [ ] Shows text like "You have ₹320 in rewards" (based on points)
- [ ] Visual progress bar shows current points toward next tier threshold
- [ ] Displays text indicating points needed for next tier (e.g., "→ Silver in 680 more points")
- [ ] Colors correspond to tier (Bronze/forest-100, Silver/stone-400, Gold/sunset)

**Files to change**:
- `apps/frontend/components/PointsBar.tsx` (likely needs updates)
- `apps/frontend/app/dashboard/page.tsx` (if prop passing needs adjustment)

**Dependencies**: 
- PointsBar component implementation

## Issue 10: Dashboard Page - Member Header Tier Badge Colors

**Description**: Ensure the MemberHeader component displays the tier badge with correct color-coding.

**Acceptance Criteria**:
- [ ] Bronze tier badge uses forest-100 background/text color
- [ ] Silver tier badge uses stone-400 background/text color
- [ ] Gold tier badge uses sunset background/text color
- [ ] Badge is clearly visible and accessible (sufficient contrast)

**Files to change**:
- `apps/frontend/components/MemberHeader.tsx`
- `apps/frontend/app/dashboard/page.tsx` (if prop passing needs adjustment)

**Dependencies**: 
- MemberHeader component implementation

## Issue 11: Dashboard Page - Quick Actions Layout

**Description**: Ensure the QuickActions component displays 2x2 grid on mobile and 4-in-a-row on desktop.

**Acceptance Criteria**:
- [ ] On mobile screens (< 768px): actions display in 2 columns, multiple rows as needed
- [ ] On desktop screens (≥ 768px): actions display in single row (4 items) or wrap if more than 4
- [ ] Each action has proper tap/click target size (≥ 44px)
- [ ] Icons and labels are vertically aligned and spaced properly

**Files to change**:
- `apps/frontend/components/QuickActions.tsx`
- `apps/frontend/app/dashboard/page.tsx` (if prop passing needs adjustment)

**Dependencies**: 
- QuickActions component implementation

## Issue 12: Mobile Bottom Nav - Dashboard Tab

**Description**: Update the mobile bottom navigation to include a "Dashboard" tab when the user is logged in as a Dosteller.

**Acceptance Criteria**:
- [ ] When user is logged in, bottom nav shows: [Home] [Search] [Dashboard] [Events] [Profile]
- [ ] When user is logged out, bottom nav shows: [Home] [Search] [Events] [Profile] (no Dashboard)
- [ ] Dashboard tab icon is appropriate (e.g., 📋 or similar)
- [ ] Tapping Dashboard tab navigates to `/dashboard`
- [ ] Active tab is visually distinct

**Files to change**:
- Likely `apps/frontend/components/Navbar.tsx` or a separate bottom nav component
- May need to update layout or use React context to check auth status

**Dependencies**: 
- Authentication system (to know if user is logged in)
- Bottom nav component structure

## Issue 13: Navbar - Dostellers Link

**Description**: Ensure the navbar includes a "Dostellers" link that directs to `/dostellers` (desktop) and appears as a tab in mobile bottom nav when appropriate.

**Acceptance Criteria**:
- [ ] Desktop navbar: "Dostellers" link appears in the nav menu (replacing or alongside existing "Membership" link)
- [ ] Mobile bottom nav: When logged in as Dosteller, "Dostellers" tab appears (position to be determined based on priority)
- [ ] Both desktop and mobile versions link to `/dostellers`
- [ ] Active state styling works correctly

**Files to change**:
- `apps/frontend/components/Navbar.tsx`
- Bottom nav component (if separate)

**Dependencies**: 
- Navbar and bottom nav components

## Issue 14: Long-Stay Toggle in Booking Flow (Integration Point)

**Description**: Implement the LongStayToggle component in the hostel detail page for stays of 7+ nights, showing Dosteller pricing when applicable.

**Acceptance Criteria**:
- [ ] For date ranges < 7 nights: component is hidden
- [ ] For date ranges ≥ 7 nights and user is Dosteller: show toggle with weekly/monthly pricing and discount percentage
- [ ] For date ranges ≥ 7 nights and user is NOT Dosteller: show "Unlock Dosteller pricing" inline prompt linking to `/dostellers`
- [ ] Toggling updates the price breakdown in real-time
- [ ] Dosteller pricing reflects correct discounts (e.g., 15% weekly, 33% monthly as per example)

**Files to change**:
- `apps/frontend/components/LongStayToggle.tsx` (create or update)
- `apps/frontend/app/hostels/[slug]/page.tsx` (hostel detail page)
- Possibly booking flow steps

**Dependencies**: 
- Hostel detail page
- Dosteller authentication/context
- Potential API for Dosteller pricing (if not calculated client-side)

## Issue 15: Dosteller Pricing in Search Results

**Description**: Add Dosteller pricing badge to hostel cards in search results for stays 7+ nights when user is logged in as Dosteller.

**Acceptance Criteria**:
- [ ] For stays < 7 nights: no badge shown
- [ ] For stays ≥ 7 nights and user is Dosteller: show badge "Dosteller: up to 40% off"
- [ ] For stays ≥ 7 nights and user is NOT Dosteller: show badge "Unlock Dosteller pricing" linking to `/dostellers`
- [ ] Badge design is consistent and accessible
- [ ] Only applies to hostel cards in `/hostels` search results

**Files to change**:
- `apps/frontend/components/HostelCard.tsx` (likely)
- `apps/frontend/app/hostels/page.tsx` (search results page)
- Potentially context/hooks for user Dosteller status

**Dependencies**: 
- HostelCard component
- Dosteller authentication/context

---

*Note: These issues are intended to be worked on independently where possible. Some may have dependencies as noted. Prioritize based on user impact and dependencies.*