const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    gender: req.body.gender,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  // Don't allow email change if user registered with OAuth
  if (req.user.googleId && fieldsToUpdate.email && fieldsToUpdate.email !== req.user.email) {
    return next(
      new ErrorResponse('Email cannot be changed for Google-linked accounts', 400)
    );
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Check if user exists by phone number
// @route   GET /api/users/check-user/:phone
// @access  Private
exports.checkUserByPhone = asyncHandler(async (req, res, next) => {
  const phone = req.params.phone;

  if (!phone || phone.length !== 10) {
    return next(
      new ErrorResponse('Please provide a valid 10-digit phone number', 400)
    );
  }

  const user = await User.findOne({ phone }).select('name phone role');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found with this phone number'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Associate tenant with room
// @route   PUT /api/users/assign-room/:userId
// @access  Private/Admin
exports.assignRoom = asyncHandler(async (req, res, next) => {
  const { listingId, floorId, roomId } = req.body;

  if (!listingId || !floorId || !roomId) {
    return next(
      new ErrorResponse('Please provide listing, floor and room IDs', 400)
    );
  }

  const user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  // Update user's room assignment
  user.currentRoom = {
    listingId,
    floorId,
    roomId,
    assignedAt: Date.now()
  };

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
}); 