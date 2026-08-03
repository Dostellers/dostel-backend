const { Schema, model } = require('mongoose');

const hostelSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    location: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, default: 'India', trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    pricePerNight: { type: Number, required: true, min: 0 },
    featured: { type: Boolean, default: false },
    image: { type: String },
    thumbnail: { type: String },
    amenities: [{ type: String, trim: true }],
    rooms: [{ type: Schema.Types.ObjectId, ref: 'Room' }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

hostelSchema.index({ name: 'text', description: 'text', location: 'text' });

hostelSchema.pre('save', async function (next) {
  if (!this.isModified('slug')) return next();
  
  const baseSlug = this.name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  let slug = baseSlug;
  let counter = 1;
  
  while (await this.constructor.findOne({ slug: slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  this.slug = slug;
  next();
});

module.exports = model('Hostel', hostelSchema);