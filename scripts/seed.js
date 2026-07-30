const mongoose = require('mongoose');
require('dotenv').config({ path: '../../apps/backend/.env' });

// Import models
const Hostel = require('../apps/backend/src/models/hostel');
const Room = require('../apps/backend/src/models/room');
const Customer = require('../apps/backend/src/models/customer');
const Booking = require('../apps/backend/src/models/booking');
const Amenity = require('../apps/backend/src/models/amenity');
const MembershipPlan = require('../apps/backend/src/models/membershipPlan');
const MembershipSubscription = require('../apps/backend/src/models/membershipSubscription');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dostel';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Hostel.deleteMany({});
    await Room.deleteMany({});
    await Customer.deleteMany({});
    await Booking.deleteMany({});
    await Amenity.deleteMany({});
    await MembershipSubscription.deleteMany({});
    await MembershipPlan.deleteMany({});
    console.log('Cleared existing data');

const membershipPlans = await MembershipPlan.insertMany([
      {
        name: 'Explorer',
        tier: 'explorer',
        durationDays: 30,
        price: 999,
        perks: [
          '5% off all bookings',
          'Priority check-in at 50+ hostels',
          'Free breakfast twice a month',
          'Access to Dosteller events',
          '24/7 concierge'
        ]
      },
      {
        name: 'Nomad',
        tier: 'nomad',
        durationDays: 30,
        price: 1999,
        perks: [
          '10% off all bookings',
          'Priority check-in at all hostels',
          'Free breakfast daily',
          'Dosteller-only events',
          'Free late checkout',
          '1 free night every 2 months',
          'Dedicated travel manager'
        ]
      },
      {
        name: 'Wanderer',
        tier: 'wanderer',
        durationDays: 30,
        price: 4999,
        perks: [
          '15% off all bookings',
          'VIP check-in + room upgrade',
          'Free meals (breakfast + lunch + dinner)',
          'Unlimited event access',
          'Free cancellation anytime',
          '2 free nights every month',
          'Personal travel curator',
          'Access to exclusive properties'
        ]
      }
    ]);
    console.log(`Created ${membershipPlans.length} membership plans`);

    // Create amenities
    const amenityData = [
      { name: 'Bonfire', iconUrl: 'fire' },
      { name: 'Co-working Space', iconUrl: 'laptop' },
      { name: 'Cafe (Altaf\'s)', iconUrl: 'coffee' },
      { name: 'WiFi', iconUrl: 'wifi' },
      { name: 'Hot Water', iconUrl: 'water' },
      { name: 'Lockers', iconUrl: 'lock' },
      { name: 'Laundry', iconUrl: 'tshirt' }
    ];
    const amenities = await Amenity.insertMany(amenityData);
    console.log(`Created ${amenities.length} amenities`);

    // Map amenities for easy reference
    const amenityMap = {};
    amenities.forEach(a => {
      amenityMap[a.name] = a._id;
    });

    // Create hostel
    const hostel = await Hostel.create({
      name: 'Dostel Vattakanal',
      slug: 'dostel-vattakanal',
      tagline: 'Community hostel in the mountains',
      description: {
        heading: 'Nestled in the pine forests of Vattakanal, Dostel is Kodaikanal\'s original backpacker community.',
        content: 'Founded by Bob & Tanya in 1985, Dostel has been a hub for travelers seeking connection, adventure, and sustainable living in the hills.'
      },
      inauguratedOn: new Date('1985-01-01'),
      basePrice: 450,
      totalRooms: 6,
      totalBeds: 18,
      contact: {
        phone: '+91 98765 43210',
        email: 'info@dostel.in'
      },
      location: {
        latitude: 10.2345,
        longitude: 77.4567,
        url: 'https://maps.google.com/?q=vattakanal,kodaikanal',
        address: {
          line1: 'Main Road, Vattakanal',
          line2: 'Near Pine Forest',
          city: 'Vattakanal',
          state: 'Tamil Nadu',
          country: 'India',
          pincode: '624101'
        }
      },
      timing: {
        checkin: '14:00',
        checkout: '11:00',
        guestVisit: '08:00-20:00',
        cafe: '07:00-22:00',
        reception: '07:00-22:00',
        other: 'Bonfire: 19:00-22:00'
      },
      seo: {
        title: 'Dostel Vattakanal - Backpacker Hostel in Kodaikanal',
        description: 'Experience community living at Dostel Vattakanal. Founded in 1985, we offer dorms, private rooms, and a vibrant traveler community.',
        keywords: 'hostel, hostel, backpacker, dormitory, travel, Kodaikanal, Vattakanal, budget travel'
      },
      thingsToKnow: [
        'Remove shoes before entering common areas',
        'Quiet hours: 22:00-08:00',
        'No smoking inside rooms',
        'Pet-friendly with prior notice'
      ],
      gmapUrl: 'https://maps.google.com/?q=vattakanal,kodaikanal',
      url: 'https://dostel.in',
      amenities: [
        amenityMap['Bonfire'],
        amenityMap['Co-working Space'],
        amenityMap['Cafe (Altaf\'s)'],
        amenityMap['WiFi'],
        amenityMap['Hot Water'],
        amenityMap['Lockers'],
        amenityMap['Laundry']
      ],
      policies: {
        general: [
          'Valid ID required at check-in',
          'Guests must be 18+ unless accompanied by guardian',
          'Outside food allowed in common areas only'
        ],
        pet: [
          'Pets allowed with prior approval',
          'Pet fee: ₹500/day',
          'Pets must be leashed in common areas'
        ],
        covid: [
          'Vaccination or negative test recommended',
          'Masks recommended in common areas',
          'Sanitization stations available'
        ]
      },
      otherInfo: [
        {
          heading: 'Sustainability',
          content: 'We practice rainwater harvesting, solar heating, and waste segregation.',
          iconUrl: 'https://example.com/icons/sustainability.png'
        },
        {
          heading: 'Community',
          content: 'Weekly bonfire nights, skill-sharing workshops, and trekking organizing.',
          iconUrl: 'https://example.com/icons/community.png'
        }
      ],
      blogs: [],
      faqs: []
    });
    console.log('Created hostel:', hostel.name);

    // Create rooms
    const roomsData = [
      {
        name: 'Mixed Dorm (6 Bed)',
        type: 'dorm',
        capacity: 6,
        maxCapacity: 6,
        price: 450,
        msp: 400,
        additionalGuestPrice: 0,
        description: 'Mixed dormitory with 6 beds, lockers, and shared bathroom.',
        features: ['Bunk beds', 'Individual reading lights', 'Power outlets'],
        amenities: [amenityMap['Lockers'], amenityMap['WiFi'], amenityMap['Hot Water']],
        accessibilityFeatures: ['Ground floor'],
        view: 'Garden view',
        size: 200,
        bedType: 'Bunk bed',
        petPolicy: 'Pets allowed with prior notice',
        restrictions: ['No shoes inside', 'Quiet hours 22:00-08:00'],
        hostel: hostel._id
      },
      {
        name: 'Female Dorm (4 Bed)',
        type: 'dorm',
        capacity: 4,
        maxCapacity: 4,
        price: 550,
        msp: 500,
        additionalGuestPrice: 0,
        description: 'Female-only dormitory with 4 beds, lockers, and shared bathroom.',
        features: ['Bunk beds', 'Individual reading lights', 'Power outlets', 'Female-only floor'],
        amenities: [amenityMap['Lockers'], amenityMap['WiFi'], amenityMap['Hot Water']],
        accessibilityFeatures: ['Ground floor'],
        view: 'Mountain view',
        size: 180,
        bedType: 'Bunk bed',
        petPolicy: 'Pets allowed with prior notice',
        restrictions: ['No shoes inside', 'Quiet hours 22:00-08:00'],
        hostel: hostel._id
      },
      {
        name: 'Private Couple Room',
        type: 'private',
        capacity: 2,
        maxCapacity: 2,
        price: 1200,
        msp: 1000,
        additionalGuestPrice: 0,
        description: 'Private room for couples with double bed, attached bathroom, and mountain view.',
        features: ['Double bed', 'Attached bathroom', 'Balcony', 'Wardrobe'],
        amenities: [amenityMap['WiFi'], amenityMap['Hot Water']],
        accessibilityFeatures: ['Ground floor'],
        view: 'Mountain view',
        size: 250,
        bedType: 'Double bed',
        petPolicy: 'Pets allowed with prior notice and fee',
        restrictions: ['No smoking', 'Check-out by 11:00'],
        hostel: hostel._id
      },
      {
        name: 'Private Couple Room (Second)',
        type: 'private',
        capacity: 2,
        maxCapacity: 2,
        price: 1200,
        msp: 1000,
        additionalGuestPrice: 0,
        description: 'Private room for couples with double bed, attached bathroom, and garden view.',
        features: ['Double bed', 'Attached bathroom', 'Garden view', 'Wardrobe'],
        amenities: [amenityMap['WiFi'], amenityMap['Hot Water']],
        accessibilityFeatures: ['Ground floor'],
        view: 'Garden view',
        size: 250,
        bedType: 'Double bed',
        petPolicy: 'Pets allowed with prior notice and fee',
        restrictions: ['No smoking', 'Check-out by 11:00'],
        hostel: hostel._id
      },
      {
        name: 'Deluxe Suite',
        type: 'private',
        capacity: 2,
        maxCapacity: 2,
        price: 2500,
        msp: 2200,
        additionalGuestPrice: 0,
        description: 'Spacious suite with sitting area, king bed, and premium amenities.',
        features: ['King bed', 'Sitting area', 'Attached bathroom', 'Balcony', 'Mini fridge'],
        amenities: [amenityMap['WiFi'], amenityMap['Hot Water']],
        accessibilityFeatures: ['Ground floor'],
        view: 'Panoramic mountain view',
        size: 350,
        bedType: 'King bed',
        petPolicy: 'Pets allowed with prior notice and fee',
        restrictions: ['No smoking', 'Check-out by 11:00'],
        hostel: hostel._id
      },
      {
        name: 'Family Room (4 Bed)',
        type: 'private',
        capacity: 4,
        maxCapacity: 4,
        price: 1800,
        msp: 1600,
        additionalGuestPrice: 500,
        description: 'Family room with two double beds, suitable for families or groups of friends.',
        features: ['Two double beds', 'Attached bathroom', 'Sitting area', 'Wardrobe'],
        amenities: [amenityMap['WiFi'], amenityMap['Hot Water']],
        accessibilityFeatures: ['Ground floor'],
        view: 'Garden and mountain view',
        size: 300,
        bedType: 'Double bed',
        restrictions: ['No smoking', 'Check-out by 11:00'],
        hostel: hostel._id
      },
      {
        name: 'Mountain View Suite',
        type: 'private',
        capacity: 2,
        maxCapacity: 2,
        price: 3000,
        msp: 2700,
        additionalGuestPrice: 0,
        description: 'Premium suite with unobstructed mountain views and luxury amenities.',
        features: ['King bed', 'Sitting area', 'Attached bathroom with bathtub', 'Private balcony'],
        amenities: [amenityMap['WiFi'], amenityMap['Hot Water']],
        accessibilityFeatures: ['Ground floor'],
        view: 'Direct mountain view',
        size: 400,
        bedType: 'King bed',
        petPolicy: 'Pets allowed with prior notice and fee',
        restrictions: ['No smoking', 'Check-out by 11:00'],
        hostel: hostel._id
      }
    ];

    const rooms = await Room.insertMany(roomsData);
    console.log(`Created ${rooms.length} rooms`);

    // Create test customer
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test1234', salt);

    const customer = await Customer.create({
      fullName: 'Test User',
      email: 'test@dostel.in',
      phone: '9999999999',
      password: hashedPassword,
      accountStatus: 'active'
    });
    console.log('Created test customer:', customer.email);

    // Create a sample booking for the test customer
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 3); // 3 days from now
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 2); // 2 nights stay

    const booking = await Booking.create({
      reference: `DST${Date.now().toString().slice(-6)}`,
      customer: customer._id,
      hostel: hostel._id,
      roomType: rooms[0].type, // e.g., 'dorm'
      checkInDate: startDate,
      checkOutDate: endDate,
      guests: 1,
      totalAmount: rooms[0].price * 2, // 2 nights
      status: 'Confirmed', // matches enum: 'Draft', 'Confirmed', 'Completed', 'Abandoned'
      specialRequests: 'None'
      // payment and source will use defaults
    });
    console.log('Created sample booking:', booking.reference);

    // Update room reservations
    await Room.findByIdAndUpdate(rooms[0]._id, {
      $push: {
        reservations: {
          startDate: startDate,
          endDate: endDate,
          customer: customer._id,
          bookingReference: booking.reference
        }
      }
    });
    console.log('Updated room with reservation');

    console.log('Seeding completed successfully!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();