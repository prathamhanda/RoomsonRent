const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Listing = require('../models/Listing');

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

  // Find the user
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.userId}`, 404)
    );
  }

  // Find the listing and get room details
  const listing = await Listing.findById(listingId);
  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${listingId}`, 404)
    );
  }

  // Find floor and room
  const floor = listing.floors.find(f => f.floorId === floorId);
  if (!floor) {
    return next(
      new ErrorResponse(`Floor not found with id of ${floorId}`, 404)
    );
  }

  const floorIndex = listing.floors.findIndex(f => f.floorId === floorId);
  const room = floor.rooms.find(r => r.roomId === roomId);
  if (!room) {
    return next(
      new ErrorResponse(`Room not found with id of ${roomId}`, 404)
    );
  }

  const roomIndex = floor.rooms.findIndex(r => r.roomId === roomId);

  // Create room assignment object
  const roomAssignment = {
    listingId: listing._id,
    listingName: listing.name,
    floorId: floor.floorId,
    floorNumber: floorIndex + 1,
    roomId: room.roomId,
    roomNumber: roomIndex + 1,
    assignedBy: req.user.id,
    assignedAt: new Date(),
    sharingType: room.sharingOptions[0], // Using first sharing option as the assigned type
    active: true
  };

  // Check if user already has this room assigned
  const existingAssignment = user.currentRooms.find(
    room => room.listingId.toString() === listingId &&
           room.floorId === floorId &&
           room.roomId === roomId
  );

  if (existingAssignment) {
    // Update existing assignment
    Object.assign(existingAssignment, roomAssignment);
  } else {
    // Add new assignment
    if (!user.currentRooms) {
      user.currentRooms = [];
    }
    user.currentRooms.push(roomAssignment);
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Create or get user by phone
// @route   POST /api/users/create-or-get
// @access  Private/Landlord/Admin
exports.createOrGetUser = asyncHandler(async (req, res, next) => {
  const { 
    phone, 
    name,
    email,
    role = 'user',
    verified = false,
    avatar = '',
    gender = 'not_specified',
    address = '',
    city = '',
    state = '',
    pincode = '',
    otp = null
  } = req.body;

  if (!phone || phone.length !== 10) {
    return next(
      new ErrorResponse('Please provide a valid 10-digit phone number', 400)
    );
  }

  // Try to find existing user
  let user = await User.findOne({ phone });

  if (!user && name) {
    // Create new user if not found
    try {
      user = await User.create({
        phone,
        name,
        email: email || `${phone}@placeholder.com`,
        role,
        verified,
        avatar,
        gender,
        address,
        city,
        state,
        pincode,
        otp,
        currentRooms: []
      });
    } catch (error) {
      return next(
        new ErrorResponse(`Error creating user: ${error.message}`, 400)
      );
    }
  }

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found and no name provided to create new user'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
}); 