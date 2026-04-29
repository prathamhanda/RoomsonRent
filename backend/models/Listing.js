const mongoose = require('mongoose');
const slugify = require('slugify');

const RoomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: [true, 'Please add a room identifier']
  },
  type: {
    type: String,
    default: 'standard'
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
  },
  price: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  discountedPrice: {
    type: Number,
    min: [0, 'Discounted price cannot be negative']
  },
  photos: {
    type: [String],
    default: []
  },
  tenants: {
    type: [{
      userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user ID']
      },
      name: {
        type: String,
        required: [true, 'Please add tenant name']
      },
      phone: {
        type: String,
        required: [true, 'Please add tenant phone number'],
        match: [
          /^\d{10}$/,
          'Please add a valid 10-digit phone number'
        ]
      },
      assignedAt: {
        type: Date,
        default: Date.now
      }
    }],
    default: []
  }
});

const FloorSchema = new mongoose.Schema({
  floorId: {
    type: String,
    required: [true, 'Please add a floor identifier']
  },
  numberOfRooms: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  rooms: [RoomSchema]
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
  active: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// INDEXES - Topic #15-24: MongoDB Indexing
// ============================================

// Topic #16: Text Index for full-text search
// Enables: db.find({ $text: { $search: "keyword" } })
// Covers: title, description, amenities for keyword matching
ListingSchema.index({ 
  title: 'text', 
  description: 'text', 
  amenities: 'text' 
});

// Topic #19: Compound Index for common query patterns
// Optimizes: Finding listings by owner, filtered by active status, sorted by date
// Covers: Landlord dashboard queries
ListingSchema.index({ 
  owner: 1, 
  active: 1, 
  createdAt: -1 
});

// Topic #19: Compound Index for featured listings
// Optimizes: Getting featured active listings sorted by date
// Covers: Homepage featured section queries
ListingSchema.index({ 
  featured: 1, 
  active: 1, 
  createdAt: -1 
});

// Topic #23: Partial Index - only for active listings
// Benefit: Smaller index size, faster queries on active subset
// Optimizes: Common queries filtering only active listings
ListingSchema.index(
  { createdAt: -1 },
  { partialFilterExpression: { active: true } }
);

// Topic #19: Compound Index for city and property type
// Optimizes: Filtering by location and property type in search
ListingSchema.index({ 
  'location.city': 1, 
  propertyType: 1 
});

// Create listing slug from the title
ListingSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// No cascading deletes needed
ListingSchema.pre('remove', async function(next) {
  next();
});

// No virtual references needed

module.exports = mongoose.model('Listing', ListingSchema);