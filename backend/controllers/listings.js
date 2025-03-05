const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Listing = require('../models/Listing');
const User = require('../models/User');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
exports.getListings = asyncHandler(async (req, res, next) => {
  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'query'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  let query = Listing.find(JSON.parse(queryStr))
    .populate({
      path: 'location',
      select: 'name city state'
    })
    .populate({
      path: 'owner',
      select: 'name email phone'
    });

  // Handle search query
  if (req.query.query) {
    const searchQuery = req.query.query;
    query = query.or([
      { title: { $regex: searchQuery, $options: 'i' } },
      { description: { $regex: searchQuery, $options: 'i' } }
    ]);
  }

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
  const total = await Listing.countDocuments(query.getQuery());

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const listings = await query;

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
    count: listings.length,
    pagination,
    total,
    data: listings
  });
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
exports.getListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: 'location',
      select: 'name city state'
    })
    .populate({
      path: 'owner',
      select: 'name email phone createdAt'
    });

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private (Owner, Admin)
exports.createListing = asyncHandler(async (req, res, next) => {
  // Add owner to req.body
  req.body.owner = req.user.id;

  const listing = await Listing.create(req.body);

  res.status(201).json({
    success: true,
    data: listing
  });
});

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private (Owner, Admin)
exports.updateListing = asyncHandler(async (req, res, next) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is listing owner or admin
  if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this listing`,
        403
      )
    );
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: listing
  });
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private (Owner, Admin)
exports.deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is listing owner or admin
  if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this listing`,
        403
      )
    );
  }

  await listing.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
exports.getFeaturedListings = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  
  const listings = await Listing.find({ featured: true, active: true })
    .limit(limit)
    .populate({
      path: 'location',
      select: 'name city'
    });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

// @desc    Get owner listings
// @route   GET /api/listings/owner
// @access  Private (Owner, Admin)
exports.getOwnerListings = asyncHandler(async (req, res, next) => {
  const listings = await Listing.find({ owner: req.user.id })
    .populate({
      path: 'location',
      select: 'name city'
    });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

// @desc    Toggle favorite listing
// @route   POST /api/listings/:id/favorite
// @access  Private
exports.toggleFavorite = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  const isFavorited = listing.favorites.includes(req.user.id);

  if (isFavorited) {
    // Remove from favorites
    const index = listing.favorites.indexOf(req.user.id);
    listing.favorites.splice(index, 1);
  } else {
    // Add to favorites
    listing.favorites.push(req.user.id);
  }

  await listing.save();

  res.status(200).json({
    success: true,
    data: {
      isFavorited: !isFavorited
    }
  });
});

// @desc    Get user's favorite listings
// @route   GET /api/listings/favorites
// @access  Private
exports.getUserFavorites = asyncHandler(async (req, res, next) => {
  const listings = await Listing.find({ favorites: req.user.id })
    .populate({
      path: 'location',
      select: 'name city'
    })
    .populate({
      path: 'owner',
      select: 'name'
    });

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
}); 