const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Listing = require('../models/Listing');
const User = require('../models/User');

// @desc    Upload image for listing
// @route   POST /api/uploads/listing/:id
// @access  Private
exports.uploadListingImage = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(
      new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is listing owner
  if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this listing`,
        403
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `listing_${listing._id}_${Date.now()}${path.parse(file.name).ext}`;

  // Move file to upload path
  file.mv(`${process.env.FILE_UPLOAD_PATH}/listings/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    // Add image to listing images array
    const imageUrl = `/uploads/listings/${file.name}`;
    
    // If it's the first image, set it as main image
    if (listing.images.length === 0) {
      listing.mainImage = imageUrl;
    }
    
    listing.images.push(imageUrl);
    await listing.save();

    res.status(200).json({
      success: true,
      data: {
        fileName: file.name,
        filePath: imageUrl
      }
    });
  });
});

// @desc    Upload profile image
// @route   POST /api/uploads/profile
// @access  Private
exports.uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `user_${req.user.id}_${Date.now()}${path.parse(file.name).ext}`;

  // Move file to upload path
  file.mv(`${process.env.FILE_UPLOAD_PATH}/users/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    // Update user avatar
    const imageUrl = `/uploads/users/${file.name}`;
    
    // Delete old avatar if exists and not a default avatar
    if (req.user.avatar && !req.user.avatar.includes('default-avatar')) {
      const oldAvatarPath = path.join(
        __dirname,
        '..',
        'public',
        req.user.avatar.replace('/', '')
      );
      
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    await User.findByIdAndUpdate(req.user.id, { avatar: imageUrl });

    res.status(200).json({
      success: true,
      data: {
        fileName: file.name,
        filePath: imageUrl
      }
    });
  });
});

// @desc    Delete image
// @route   DELETE /api/uploads/:id
// @access  Private
exports.deleteImage = asyncHandler(async (req, res, next) => {
  // Get image path from request
  const { imagePath } = req.body;

  if (!imagePath) {
    return next(new ErrorResponse(`Please provide an image path`, 400));
  }

  // Check if image belongs to a listing
  if (imagePath.includes('/uploads/listings/')) {
    const listing = await Listing.findOne({ images: imagePath });

    if (!listing) {
      return next(
        new ErrorResponse(`Listing with this image not found`, 404)
      );
    }

    // Make sure user is listing owner
    if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this image`,
          403
        )
      );
    }

    // Remove image from listing
    const imageIndex = listing.images.indexOf(imagePath);
    if (imageIndex > -1) {
      listing.images.splice(imageIndex, 1);
    }

    // If main image is deleted, set new main image
    if (listing.mainImage === imagePath) {
      listing.mainImage = listing.images.length > 0 ? listing.images[0] : '';
    }

    await listing.save();
  } else if (imagePath.includes('/uploads/users/')) {
    // Handle user avatar deletion
    const user = await User.findOne({ avatar: imagePath });

    if (!user) {
      return next(
        new ErrorResponse(`User with this avatar not found`, 404)
      );
    }

    // Make sure user is deleting their own avatar
    if (user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this avatar`,
          403
        )
      );
    }

    // Set avatar to default
    user.avatar = '/uploads/users/default-avatar.png';
    await user.save();
  }

  // Delete file from server
  const filePath = path.join(
    __dirname,
    '..',
    'public',
    imagePath.replace('/', '')
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.status(200).json({
    success: true,
    data: {}
  });
}); 