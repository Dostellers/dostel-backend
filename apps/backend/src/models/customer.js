const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    // Basic Information
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    alias: String,  // Added alias
    // Optional + sparse: captive-portal signups (DOS-501) are phone-first, so a
    // customer can exist without an email. Uniqueness is still enforced among
    // documents that do have one. See migrations/001-portal-capture-indexes.js.
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    // E.164 normalization of `phone`, used as the portal's match key. Separate
    // from the legacy free-form `phone` field so a unique index can be applied
    // without tripping over historical duplicates.
    phoneNormalized: {
        type: String,
        trim: true,
        index: true,
        sparse: true
    },
    password: {
        type: String,
        default: ''
    },
    dateOfBirth: Date,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },
    profilePicture: String,
    emergencyContact: {
        name: String,
        relation: String,
        phoneNumber: String
    },
    
    // Activity
    bookings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    lastActive: Date,
    searchPreferences: [String],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hostel'
    }],
    coupons: [{  // Reference to Coupon model
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }],

    // Preferences
    socialMediaHandles: {
        twitter: String,
        instagram: String,
        facebook: String
    },
    preferredCommunicationChannel: {
        type: String,
        default: 'email'
    },

    // Security
    accountStatus: {
        type: String,
        default: 'active'
    },
    deviceInfo: String,

    // Marketing & Loyalty
    badges: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
    }],
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    newsletterSubscription: {
        type: Boolean,
        default: false
    },
    marketingPreferences: [String],
    referralCode: String,
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    referrals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    }],
    tier: {
        type: String,
        enum: ['Explorer', 'Contributor', 'Dosteller', 'Elder'],
        default: 'Explorer'
    },
    contributions: {
        type: Number,
        default: 0
    },
    reputation: {
        type: Number,
        default: 0
    },
    tokenBalance: {
        type: Number,
        default: 0
    },
    tokenReceipts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TokenReceipt'
    }],

    // --- Guest graph (DOS-500) ---

    // How this customer first entered the graph. `wifi_portal` marks a guest
    // captured at the captive portal (DOS-501) rather than one who booked direct.
    acquisitionSource: {
        type: String,
        enum: ['direct', 'ota', 'wifi_portal', 'referral', 'walk_in', 'admin', 'unknown'],
        default: 'unknown'
    },
    acquisitionCapturedAt: Date,

    // Granular consent records. DPDP Act 2023 requires consent to be specific and
    // independently withdrawable, so each purpose is its own record with its own
    // history rather than a single boolean.
    consents: [{
        purpose: {
            type: String,
            enum: ['network_terms', 'marketing', 'whatsapp_community', 'guest_graph_crossings'],
            required: true
        },
        granted: { type: Boolean, required: true },
        grantedAt: Date,
        withdrawnAt: Date,
        source: {
            type: String,
            enum: ['wifi_portal', 'booking', 'dashboard', 'admin', 'whatsapp'],
            required: true
        },
        // Verbatim text the guest agreed to, so an old consent stays auditable
        // after the wording changes.
        policyVersion: String,
        ipAddress: String
    }],

    // Devices seen at the portal. Lets a returning guest skip straight to network
    // access instead of re-entering their details every visit.
    deviceFingerprints: [{
        fingerprint: { type: String, required: true },
        macAddress: String,
        userAgent: String,
        firstSeenAt: Date,
        lastSeenAt: Date
    }],

    // Guest memory (DOS-502). What staff know about this person, captured as
    // structured records rather than left in whoever was on shift's head.
    //
    // This is a hospitality memory, not a surveillance log: every fact names who
    // captured it, expires by default, and is reviewable by the guest.
    guestFacts: [{
        text: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ['dietary', 'accessibility', 'interest', 'relationship', 'logistics', 'caution'],
            required: true
        },
        // Named, never anonymous — a note about a guest is attributable.
        capturedBy: { type: String, required: true, trim: true },
        capturedAt: { type: Date, required: true, default: Date.now },
        source: {
            type: String,
            enum: ['whatsapp_voice', 'whatsapp_text', 'admin', 'booking', 'portal'],
            required: true
        },
        confidence: {
            type: String,
            enum: ['high', 'medium', 'low'],
            required: true
        },
        // Low-confidence extractions queue for a human rather than being written
        // silently. Only `approved` facts surface anywhere.
        reviewStatus: {
            type: String,
            enum: ['approved', 'pending', 'rejected'],
            default: 'approved'
        },
        // Stale preferences are worse than none, so facts expire by default.
        expiresAt: Date,
        // `caution` facts are staff-only and never reach the guest dashboard or
        // an automated message.
        visibility: {
            type: String,
            enum: ['staff_only', 'guest_visible'],
            default: 'guest_visible'
        },
        // Which prompt/schema produced this, so a prompt change stays auditable.
        extractorVersion: String,
        // Verbatim source text, for a human resolving a disputed extraction.
        sourceExcerpt: String
    }]

}, {
    timestamps: true
});

customerSchema.index({ acquisitionSource: 1, acquisitionCapturedAt: -1 });
customerSchema.index({ 'deviceFingerprints.fingerprint': 1 });

/**
 * Current state of a consent purpose. Returns the most recent record, since
 * consent can be granted, withdrawn and re-granted over a guest's lifetime.
 */
/**
 * Facts fit to surface right now.
 *
 * Filters on all three gates at once — approved, unexpired, and permitted for
 * this audience — because every caller needs all three and getting one wrong
 * means showing a guest a staff-only note or acting on a stale preference.
 *
 * @param {'staff'|'guest'} audience
 */
customerSchema.methods.activeGuestFacts = function activeGuestFacts(audience = 'staff', now = new Date()) {
    return (this.guestFacts || []).filter(fact => {
        if (fact.reviewStatus !== 'approved') return false;
        if (fact.expiresAt && fact.expiresAt.getTime() <= now.getTime()) return false;
        if (audience === 'guest' && fact.visibility !== 'guest_visible') return false;
        return true;
    });
};

customerSchema.methods.hasConsent = function hasConsent(purpose) {
    const records = (this.consents || []).filter(c => c.purpose === purpose);
    if (!records.length) return false;
    const latest = records[records.length - 1];
    return latest.granted === true && !latest.withdrawnAt;
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
