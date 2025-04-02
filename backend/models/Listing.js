const mongoose = require('mongoose');
const slugify = require('slugify');

const FloorSchema = new mongoose.Schema({
  numberOfRooms: {
    type: Number,
    required: [true, 'Please add number of rooms']
  },
  sharingOptions: {
    type: [String],
    required: [true, 'Please add sharing options'],
    enum: ['Single', 'Double', 'Triple', '4 Sharing']
  },
  targetTenants: {
    type: String,
    required: [true, 'Please specify target tenants'],
    enum: ['Students', 'Working Professionals', 'Family', 'Any']
  }
});

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
  name: {
    type: String,
    required: [true, 'Please add a property name'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  landmark: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  price: {
    type: Number,
    // required: [true, 'Please add a price']
  },
  discountedPrice: {
    type: Number
  },
  propertyType: {
    type: String,
    required: [true, 'Please add a property type'],
    enum: [
      'PG',
      'Flat',
      'Boys PG',
      'Girls PG',
      'Other'
    ]
  },
  numberOfFloors: {
    type: Number,
    required: [true, 'Please add number of floors']
  },
  floors: [FloorSchema],
  furnishingStatus: {
    type: String,
    enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
    default: 'Unfurnished'
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
  favorites: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
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