const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Listing = require('../models/Listing');
const Booking = require('../models/Booking');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
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
  let query = Review.find(JSON.parse(queryStr))
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'listing',
      select: 'title location',
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
  const total = await Review.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const reviews = await query;

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
    count: reviews.length,
    pagination,
    data: reviews
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'listing',
      select: 'title location',
      populate: {
        path: 'location',
        select: 'name city'
      }
    });

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Get reviews for a listing
// @route   GET /api/reviews/listing/:listingId
// @access  Public
exports.getListingReviews = asyncHandler(async (req, res, next) => {
  const reviews = await Review.find({ listing: req.params.listingId })
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const { listing } = req.body;

  if (!listing) {
    return next(new ErrorResponse(`Please provide a listing id`, 400));
  }

  // Check if listing exists
  const listingExists = await Listing.findById(listing);

  if (!listingExists) {
    return next(
      new ErrorResponse(`Listing not found with id of ${listing}`, 404)
    );
  }

  // Check if user has a completed booking for this listing
  const hasCompletedBooking = await Booking.findOne({
    user: req.user.id,
    listing,
    status: 'completed'
  });

  if (!hasCompletedBooking && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `You can only review a listing after a completed stay`,
        400
      )
    );
  }

  // Check if user already reviewed this listing
  const existingReview = await Review.findOne({
    user: req.user.id,
    listing
  });

  if (existingReview) {
    return next(
      new ErrorResponse(
        `You have already reviewed this listing`,
        400
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this review`,
        403
      )
    );
  }

  // Prevent updating listing or user
  delete req.body.listing;
  delete req.body.user;

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this review`,
        403
      )
    );
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
}); 