const path = require('path');
const backendRoot = path.join(__dirname, '../apps/backend');
const mongoose = require(path.join(backendRoot, 'node_modules/mongoose'));
require(path.join(backendRoot, 'node_modules/dotenv')).config({ path: path.join(backendRoot, '.env') });

const Amenity = require('../apps/backend/src/models/amenity');
const Hostel = require('../apps/backend/src/models/hostel');
const Image = require('../apps/backend/src/models/image');
const Room = require('../apps/backend/src/models/room');
const User = require('../apps/backend/src/models/user');

const amenities = [
  ['WiFi', 'Reliable internet throughout the property'],
  ['Breakfast', 'Fresh breakfast available each morning'],
  ['Hot Water', 'Hot water available around the clock'],
  ['Laundry', 'Guest laundry service'],
  ['Bonfire', 'Evening bonfires when weather permits'],
  ['Common Room', 'Shared lounge for guests and community events'],
  ['Parking', 'On-site guest parking']
];

const imageData = [
  ['https://placehold.co/1600x900?text=Dostel+Vattakanal', 'Dostel Vattakanal in the hills', 'hero'],
  ['https://placehold.co/1200x800?text=8-Bed+Dorm', 'Eight-bed mixed dorm', 'room'],
  ['https://placehold.co/1200x800?text=Couple+Room', 'Private couple room', 'room'],
  ['https://placehold.co/1200x800?text=Deluxe+Suite', 'Deluxe mountain suite', 'room'],
  ['https://placehold.co/1200x800?text=Common+Room', 'Dostel common room', 'property']
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dostel', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await Promise.all([
    Amenity.deleteMany({}),
    Hostel.deleteMany({}),
    Image.deleteMany({}),
    Room.deleteMany({}),
    User.deleteMany({ email: 'admin@dostel.in' })
  ]);

  const createdAmenities = await Amenity.insertMany(amenities.map(([name, description]) => ({
    name,
    description,
    status: true
  })));
  const createdImages = await Image.insertMany(imageData.map(([url, altText, type]) => ({
    url,
    altText,
    type
  })));
  const owner = await User.create({
    username: 'dostel-admin',
    email: 'admin@dostel.in',
    password: 'seed-only-password',
    firstName: 'Dostel',
    lastName: 'Admin'
  });
  const hostel = await Hostel.create({
    name: 'Dostel Vattakanal',
    slug: 'dostel-vattakanal',
    location: 'Vattakanal, Kodaikanal',
    city: 'Vattakanal',
    state: 'Tamil Nadu',
    country: 'India',
    description: 'A community-first mountain hostel tucked into the forests above Kodaikanal.',
    shortDescription: 'Mountain stays, shared stories, and slow mornings in Vattakanal.',
    rating: 4.8,
    reviewsCount: 342,
    pricePerNight: 800,
    featured: true,
    image: createdImages[0].url,
    thumbnail: createdImages[4].url,
    amenities: createdAmenities.map(amenity => amenity._id),
    owner: owner._id,
    isActive: true,
    isVerified: true
  });

  const roomData = [
    {
      number: 'DORM-8',
      type: '8-bed Mixed Dorm',
      capacity: 8,
      maxCapacity: 8,
      price: 800,
      description: 'A social eight-bed dorm with individual reading lights and lockers.',
      bedType: 'Bunk bed',
      view: 'Forest',
      amenities: createdAmenities.map(amenity => amenity._id),
      images: [createdImages[1]._id]
    },
    {
      number: 'COUPLE-1',
      type: 'Couple Room',
      capacity: 2,
      maxCapacity: 2,
      price: 2500,
      description: 'A warm private room for two with a queen bed and mountain views.',
      bedType: 'Queen bed',
      view: 'Mountain',
      amenities: createdAmenities.map(amenity => amenity._id),
      images: [createdImages[2]._id]
    },
    {
      number: 'SUITE-1',
      type: 'Deluxe Suite',
      capacity: 2,
      maxCapacity: 3,
      price: 4500,
      description: 'A spacious private suite with a sitting area and panoramic valley views.',
      bedType: 'King bed',
      view: 'Valley',
      amenities: createdAmenities.map(amenity => amenity._id),
      images: [createdImages[3]._id]
    }
  ];
  const rooms = await Room.insertMany(roomData.map(room => ({ ...room, hostel: hostel._id })));
  hostel.rooms = rooms.map(room => room._id);
  await hostel.save();

  console.log(`Seeded ${rooms.length} rooms, 1 hostel, ${createdAmenities.length} amenities, ${createdImages.length} images`);
}

seed()
  .catch(error => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());