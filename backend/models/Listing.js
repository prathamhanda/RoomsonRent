const mongoose = require('mongoose');
const slugify = require('slugify');

const ListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  discountedPrice: {
    type: Number
  },
  propertyType: {
    type: String,
    required: [true, 'Please add a property type'],
    enum: [
      'PG',
      'Hostel',
      'Apartment',
      'Room',
      'Flat',
      'Villa',
      'Other'
    ]
  },
  furnishingStatus: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    default: 'Unfurnished'
  },
  bedrooms: {
    type: Number,
    required: [true, 'Please add number of bedrooms']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Please add number of bathrooms']
  },
  amenities: {
    type: [String],
    default: []
  },
  rules: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  available: {
    type: Boolean,
    default: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create listing slug from the title
ListingSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Cascade delete reviews when a listing is deleted
ListingSchema.pre('remove', async function(next) {
  await this.model('Review').deleteMany({ listing: this._id });
  next();
});

// Reverse populate with virtuals
ListingSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'listing',
  justOne: false
});

// Reverse populate with virtuals
ListingSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'listing',
  justOne: false
});

module.exports = mongoose.model('Listing', ListingSchema); 