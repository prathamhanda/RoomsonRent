const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Booking.find(JSON.parse(queryStr))
    .populate({
      path: 'user',
      select: 'name email phone'
    })
    .populate({
      path: 'listing',
      select: 'title price location',
      populate: {
        path: 'location',
        select: 'name city'
      }
    });

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Booking.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const bookings = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: bookings.length,
    pagination,
    total,
    data: bookings
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name email phone'
    })
    .populate({
      path: 'listing',
      select: 'title price location images owner type address',
      populate: [
        {
          path: 'location',
          select: 'name city state'
        },
        {
          path: 'owner',
          select: 'name email phone'
        }
      ]
    });

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure booking belongs to user or listing owner is viewing it or admin
  if (
    booking.user._id.toString() !== req.user.id &&
    booking.listing.owner._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to view this booking`,
        403
      )
    );
  }

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = asyncHandler(async (req, res, next) => {
  // Check if listing exists
  const listing = await Listing.findById(req.body.listing);
  
  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.body.listing}`, 404)
    );
  }

  // Check if listing is active
  if (!listing.active) {
    return next(
      new ErrorResponse(`Listing is not currently active for booking`, 400)
    );
  }

  // Add user id to req.body
  req.body.user = req.user.id;

  // Calculate total amount based on duration and listing price
  const checkIn = new Date(req.body.checkIn);
  const checkOut = new Date(req.body.checkOut);
  
  // Calculate duration in days
  const durationMs = checkOut - checkIn;
  const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
  
  if (durationDays < 1) {
    return next(
      new ErrorResponse(`Check-out date must be after check-in date`, 400)
    );
  }

  // Calculate total amount (monthly rate)
  const durationMonths = durationDays / 30;
  const amount = Math.ceil(listing.price * durationMonths);

  req.body.amount = amount;
  req.body.duration = durationDays;

  // Create booking
  const booking = await Booking.create(req.body);

  // Send email to owner
  const owner = await User.findById(listing.owner);
  
  const message = `
    <h1>New Booking Request</h1>
    <p>You have received a new booking request for your listing:</p>
    <h2>${listing.title}</h2>
    <p><strong>From:</strong> ${req.user.name}</p>
    <p><strong>Check-in:</strong> ${new Date(req.body.checkIn).toLocaleDateString()}</p>
    <p><strong>Check-out:</strong> ${new Date(req.body.checkOut).toLocaleDateString()}</p>
    <p><strong>Amount:</strong> ₹${amount}</p>
    <p>Please log in to your dashboard to confirm or reject this booking.</p>
  `;

  try {
    await sendEmail({
      email: owner.email,
      subject: 'New Booking Request - RoomsOnRent',
      message
    });
  } catch (err) {
    console.log('Email error:', err);
    // Don't return error, just log it
  }

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
exports.updateBooking = asyncHandler(async (req, res, next) => {
  let booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure booking belongs to user updating it or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this booking`,
        403
      )
    );
  }

  // Can't update confirmed or completed bookings
  if (['confirmed', 'completed'].includes(booking.status)) {
    return next(
      new ErrorResponse(
        `Booking with status ${booking.status} cannot be updated`,
        400
      )
    );
  }

  booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: booking
  });
});

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure booking belongs to user deleting it or admin
  if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this booking`,
        403
      )
    );
  }

  // Can't delete confirmed or completed bookings
  if (['confirmed', 'completed'].includes(booking.status)) {
    return next(
      new ErrorResponse(
        `Booking with status ${booking.status} cannot be deleted`,
        400
      )
    );
  }

  await booking.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current user's bookings
// @route   GET /api/bookings/user
// @access  Private
exports.getUserBookings = asyncHandler(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate({
      path: 'listing',
      select: 'title price location images type',
      populate: {
        path: 'location',
        select: 'name city'
      }
    });

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Get owner's property bookings
// @route   GET /api/bookings/owner
// @access  Private/Owner/Admin
exports.getOwnerBookings = asyncHandler(async (req, res, next) => {
  // Get owner's listings
  const listings = await Listing.find({ owner: req.user.id });
  const listingIds = listings.map(listing => listing._id);

  // Get bookings for those listings
  const bookings = await Booking.find({ listing: { $in: listingIds } })
    .populate({
      path: 'user',
      select: 'name email phone'
    })
    .populate({
      path: 'listing',
      select: 'title price location images type',
      populate: {
        path: 'location',
        select: 'name city'
      }
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Owner/Admin
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
    return next(
      new ErrorResponse('Please provide a valid status', 400)
    );
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(
      new ErrorResponse(`Booking not found with id of ${req.params.id}`, 404)
    );
  }

  // Get the listing
  const listing = await Listing.findById(booking.listing);

  // Make sure user is listing owner or admin
  if (
    listing.owner.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this booking status`,
        403
      )
    );
  }

  // Update booking status
  booking.status = status;
  await booking.save();

  // Send email to user about status update
  const user = await User.findById(booking.user);
  
  const message = `
    <h1>Booking Status Update</h1>
    <p>Your booking for "${listing.title}" has been <strong>${status}</strong>.</p>
    <p><strong>Check-in:</strong> ${new Date(booking.checkIn).toLocaleDateString()}</p>
    <p><strong>Check-out:</strong> ${new Date(booking.checkOut).toLocaleDateString()}</p>
    <p><strong>Amount:</strong> ₹${booking.amount}</p>
    ${status === 'confirmed' ? 
      '<p>Please prepare for your stay and contact the owner if you have any questions.</p>' : 
      status === 'cancelled' ? 
      '<p>We\'re sorry for any inconvenience. Please check other listings on our platform.</p>' : 
      ''}
    <p>You can view your booking details in your account dashboard.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)} - RoomsOnRent`,
      message
    });
  } catch (err) {
    console.log('Email error:', err);
    // Don't return error, just log it
  }

  res.status(200).json({
    success: true,
    data: booking
  });
}); 