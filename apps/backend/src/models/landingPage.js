const { Schema, model } = require('mongoose')

/**
 * Singleton CMS document for the guest landing page.
 * Board rows, strip photos, travellers, and network stats are computed
 * at query time from hostels + bookings — not stored here.
 *
 * Callers: src/resolvers/landingResolver.js (getOrCreate + updateLandingPage).
 * Wired via schema/landingTypeDefs.js + resolvers/index.js.
 * User: "make it dynamic and controlled via the admin panel… no static data."
 */
const landingPageSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: 'home' },
    heroStamp: { type: String, default: 'दोस्त + hostel' },
    heroTitle: { type: String, default: 'Meet your people.' },
    heroSubtitle: {
      type: String,
      default: "Book your bed. See who's in the room. Pay a little now — rest at the hostel.",
    },
    searchPlaceholder: { type: String, default: 'Where do you want to go?' },
    boardTitle: { type: String, default: 'Departures · tonight' },
    boardCaption: {
      type: String,
      default: 'Dostel properties across India, nightly rate and availability',
    },
    boardColumns: {
      type: [String],
      default: ['Where', 'Known for', 'From', 'Tonight'],
    },
    stripFacts: [
      {
        label: { type: String, required: true },
        detail: { type: String, required: true },
      },
    ],
    useComputedStripFacts: { type: Boolean, default: true },
    thesisTitle: { type: String, default: 'Every hostel sells you a bed.' },
    thesisHighlight: { type: String, default: 'We introduce you to the room.' },
    thesisCards: [
      {
        head: { type: String, required: true },
        body: { type: String, required: true },
        href: { type: String, required: true },
        cta: { type: String, required: true },
      },
    ],
    whosGoingStamp: { type: String, default: "Who's going" },
    whosGoingTitle: { type: String, default: 'See the room before you book.' },
    whosGoingBody: {
      type: String,
      default:
        "First names, stay windows, and what they're up for — opt-in, cleared at checkout. No points wallet. Just people you might meet.",
    },
    whosGoingBrowseLabel: { type: String, default: 'Browse stays' },
    whosGoingBrowseHref: { type: String, default: '/hostels' },
    whosGoingPanelTitle: { type: String, default: "Who's here · this week" },
    whosGoingEmptyMessage: {
      type: String,
      default:
        'No opt-in travellers on the board this week. Be the first — book a bed and share what you are up for.',
    },
    whosGoingSideTitle: { type: String, default: 'Known before you arrive' },
    whosGoingSideBody: {
      type: String,
      default:
        'Share what you want the next house to know — trek plans, work hours, dietary notes — and the desk already has your name when you walk in.',
    },
    whosGoingTags: {
      type: [String],
      default: ['Opt-in only', 'First names', 'Cleared at checkout'],
    },
    circuitsStamp: { type: String, default: 'The circuits' },
    circuitsTitle: { type: String, default: 'Plan the route,\nnot the room.' },
    circuitsBody: {
      type: String,
      default:
        "Nobody backpacks one address. Circuits link the houses — and because it's one network, the next hostel already knows your name when you walk in.",
    },
    circuits: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        color: { type: String, default: '#F54E4E' },
        stops: [{ type: String }],
        legs: [{ type: String }],
        nights: { type: String, default: '' },
        blurb: { type: String, default: '' },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    closeTitle: { type: String, default: 'Leave with दोस्त' },
    closeBody: {
      type: String,
      default:
        'Hills, coast, or the middle of a city. A weekend or a month — there is a bed, a fire, and people who will know your name by the second morning.',
    },
    closePrimaryCta: { type: String, default: 'Find a bed' },
    closePrimaryHref: { type: String, default: '/hostels' },
    closeSecondaryCta: { type: String, default: 'Become a Dosteller' },
    closeSecondaryHref: { type: String, default: '/dostellers' },
    foundedYear: { type: Number, default: 1985 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = model('LandingPage', landingPageSchema)
