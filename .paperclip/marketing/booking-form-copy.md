# Booking Form Copy Draft

**Author:** Dostel Content Marketer · **Date:** Jul 28, 2026  
**Voice:** Warm, inviting, mountain-air crisp · not a corporate hotel  
**Target page:** `/booking` (step in booking flow)  
**Context:** Part of the direct booking engine PWA. Guests check availability, select room, enter details, and pay.

---

## Header

**H1:** Book Your Stay at Dostel Vattakanal  
**Subtitle:** Wake up to mountain views, join the Dosteller community, and stay in the heart of Vattakanal. No booking fees. Pay securely online.

---

## Step 1: Choose Your Dates

**Label:** Check-in  
**Placeholder:** Select date  
**Helper text:** Check-in time is 2:00 PM. Early check-in subject to availability.

**Label:** Check-out  
**Placeholder:** Select date  
**Helper text:** Check-out time is 11:00 AM. Late checkout available for Dostellers.

**Note:** Show a calendar dropdown. Highlight Dosteller member discounts if logged in.

---

## Step 2: Select Your Room

**Label:** Room Type  
**Options:**  
- Dormitory Bed (₹600/night)  
- Private Couple Room (₹1,200/night)  
- Suite (₹2,000/night)  

**Details toggle for each:**  
Shows photos, amenities, capacity, and cancellation policy.

**Label:** Number of Guests  
**Options:** 1, 2, 3, 4 (max varies by room type)

**Note:** Show Dosteller discount badge if applicable (e.g., "Dostellers save 10%").

---

## Step 3: Guest Details

**Label:** Full Name  
**Placeholder:** As on ID  
**Helper text:** Required for check-in.

**Label:** Email  
**Placeholder:** your@email.com  
**Helper text:** We'll send booking confirmation and receipt.

**Label:** Phone Number  
**Placeholder:** +91 XXXXXXXXXX  
**Helper text:** For check-in coordination and last-minute updates.

**Label:** Special Requests  
**Placeholder:** e.g., extra blanket, quiet floor, help with trek booking  
**Helper text:** We'll do our best to accommodate.

---

## Step 4: Payment

**Label:** Amount Payable  
**Display:** ₹X,XXX (includes taxes)  
**Note:** Show breakdown: room cost × nights + taxes - Dosteller discount (if any) + no booking fees.

**Payment Methods:**  
- Credit/Debit Card (Visa, Mastercard, Amex)  
- UPI (PhonePe, Google Pay, Paytm)  
- Bank Transfer (for Indian banks)  

**Note:** All payments are secure and encrypted. We do not store card details.

**Checkbox:** I agree to the [Terms & Conditions] and [Privacy Policy].  
**Note:** Links open in new tab.

---

## Step 5: Confirmation

**Header:** Booking Confirmed!  
**Subtitle:** Your Dostel adventure awaits.

**Details:**  
- Booking ID: #DST-XXXXXX  
- Stay: [Check-in] to [Check-out]  
- Room: [Room Type]  
- Guest: [Full Name]  
- Amount Paid: ₹X,XXX  

**Next Steps:**  
1. Save this booking ID for check-in.  
2. Join the Dostellers WhatsApp group for updates and to meet fellow guests: [Link]  
3. Need help? Contact us at +91 XXXXXXXXXX or hello@dostel.in  

**CTA Buttons:**  
- Primary: "View Booking" → /bookings/[booking-id]  
- Secondary: "Book Another Stay" → /booking

---

## Dosteller Benefits Callout (Logged-in Members Only)

**Background:** Soft mountain image with translucent overlay  
**Heading:** You're a Dosteller!  
**Body:**  
- Your discount: [X%] applied  
- Priority check-in confirmed  
- Free breakfast: [X] mornings (if applicable)  
- Access to member-only events: [Link to events calendar]  

**CTA:** "Manage Membership" → /membership

---

## Error States

**Availability:**  
> "Sorry, this room type is fully booked for your selected dates. Try adjusting your dates or check another room type."

**Payment Failure:**  
> "Payment could not be processed. Please check your details and try again, or choose another payment method."  
> **CTA:** "Try Again" (stays on payment step)  
> **CTA:** "Use Different Method" (shows other payment options)

**Validation:**  
Highlight missing/invalid fields with red border and inline error message.

---

## Mobile Notes

- Full-width buttons for primary actions.  
- Collapsible sections for room details and guest details to save space.  
- Date pickers optimized for touch.  
- Wallet buttons (Apple Pay/Google Pay) if supported by payment gateway.

---

## Voice Notes for This Flow

- Use warm, inviting language — like a friend helping you plan a trip.  
- Avoid jargon: say "room type" not "inventory", "guest" not "user".  
- Emphasize no hidden fees and transparent pricing.  
- Highlight Dosteller benefits naturally, not as a sales pitch.  
- Keep forms minimal: only ask for what we need.  
- Use mountain/nature imagery sparingly but effectively (e.g., background on confirmation page).  
- WhatsApp is our primary guest communication channel — mention it early and often.