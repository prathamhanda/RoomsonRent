const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  checkInDate: {
    type: Date,
    required: [true, 'Please add a check-in date']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Please add a check-out date']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please add a total price']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash', 'other'],
    default: 'other'
  },
  paymentId: {
    type: String
  },
  guests: {
    type: Number,
    required: [true, 'Please add number of guests'],
    default: 1
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.ObjectId,
    ref: 'Listing',
    required: true
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent user from submitting more than one booking for the same dates
BookingSchema.index({ user: 1, listing: 1, checkInDate: 1, checkOutDate: 1 }, { unique: true });

// Static method to check if dates are available
BookingSchema.statics.checkAvailability = async function(listingId, checkInDate, checkOutDate) {
  const overlappingBookings = await this.find({
    listing: listingId,
    status: { $ne: 'cancelled' },
    $or: [
      // Check if the new check-in date falls between an existing booking's check-in and check-out dates
      { 
        checkInDate: { $lte: checkInDate },
        checkOutDate: { $gte: checkInDate }
      },
      // Check if the new check-out date falls between an existing booking's check-in and check-out dates
      {
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkOutDate }
      },
      // Check if the new booking completely encompasses an existing booking
      {
        checkInDate: { $gte: checkInDate },
        checkOutDate: { $lte: checkOutDate }
      }
    ]
  });

  return overlappingBookings.length === 0;
};

module.exports = mongoose.model('Booking', BookingSchema); 