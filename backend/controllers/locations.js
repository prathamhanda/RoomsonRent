const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Location = require('../models/Location');

// @desc    Get all locations
// @route   GET /api/locations
// @access  Public
exports.getLocations = asyncHandler(async (req, res, next) => {
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
  let query = Location.find(JSON.parse(queryStr));

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
    query = query.sort('name');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Location.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const locations = await query;

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
    count: locations.length,
    pagination,
    data: locations
  });
});

// @desc    Get single location
// @route   GET /api/locations/:id
// @access  Public
exports.getLocation = asyncHandler(async (req, res, next) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: location
  });
});

// @desc    Create new location
// @route   POST /api/locations
// @access  Private (Admin)
exports.createLocation = asyncHandler(async (req, res, next) => {
  const location = await Location.create(req.body);

  res.status(201).json({
    success: true,
    data: location
  });
});

// @desc    Update location
// @route   PUT /api/locations/:id
// @access  Private (Admin)
exports.updateLocation = asyncHandler(async (req, res, next) => {
  const location = await Location.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: location
  });
});

// @desc    Delete location
// @route   DELETE /api/locations/:id
// @access  Private (Admin)
exports.deleteLocation = asyncHandler(async (req, res, next) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return next(
      new ErrorResponse(`Location not found with id of ${req.params.id}`, 404)
    );
  }

  await location.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Search locations
// @route   GET /api/locations/search
// @access  Public
exports.searchLocations = asyncHandler(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new ErrorResponse('Please provide a search query', 400));
  }

  // Search by name, city, or state
  const locations = await Location.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { city: { $regex: query, $options: 'i' } },
      { state: { $regex: query, $options: 'i' } }
    ]
  }).limit(10);

  res.status(200).json({
    success: true,
    count: locations.length,
    data: locations
  });
});

// @desc    Get locations by exact name
// @route   GET /api/locations/name/:name
// @access  Public
exports.getLocationsByName = asyncHandler(async (req, res, next) => {
  const locations = await Location.find({
    name: req.params.name
  });

  if (locations.length === 0) {
    return next(
      new ErrorResponse(`No locations found with name ${req.params.name}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    count: locations.length,
    data: locations
  });
}); 