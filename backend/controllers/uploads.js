const path = require('path');
const fs = require('fs');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Listing = require('../models/Listing');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

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

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'image',
      folder: `listings/${listing._id}`,
      public_id: `listing_${Date.now()}`,
      overwrite: true,
    });

    // If it's the first image, set it as main image
    if (listing.images.length === 0) {
      listing.mainImage = result.secure_url;
    }
    
    listing.images.push(result.secure_url);
    await listing.save();

    res.status(200).json({
      success: true,
      data: {
        fileName: result.public_id,
        filePath: result.secure_url
      }
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return next(new ErrorResponse(`Problem with file upload to Cloudinary`, 500));
  }
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

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'image',
      folder: `users`,
      public_id: `user_${req.user.id}_${Date.now()}`,
      overwrite: true,
    });

    // Update user avatar with Cloudinary URL
    await User.findByIdAndUpdate(req.user.id, { avatar: result.secure_url });

    res.status(200).json({
      success: true,
      data: {
        fileName: result.public_id,
        filePath: result.secure_url
      }
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return next(new ErrorResponse(`Problem with file upload to Cloudinary`, 500));
  }
});

// @desc    Upload room image for a specific room in a listing
// @route   POST /api/uploads/room/:id/:floorId/:roomId
// @access  Private
exports.uploadRoomImage = asyncHandler(async (req, res, next) => {
  console.log('Upload room image request received');
  
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(new ErrorResponse(`Listing not found with id of ${req.params.id}`, 404));
  }

  if (listing.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this listing`, 403));
  }

  const { floorId, roomId } = req.params;
  const floorIndex = listing.floors.findIndex(floor => floor.floorId === floorId);
  if (floorIndex === -1) {
    return next(new ErrorResponse(`Floor with ID ${floorId} not found`, 404));
  }

  const roomIndex = listing.floors[floorIndex].rooms.findIndex(room => room.roomId === roomId);
  if (roomIndex === -1) {
    return next(new ErrorResponse(`Room with ID ${roomId} not found on floor ${floorId}`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload files`, 400));
  }

  // Handle both single and multiple file uploads
  const files = req.files.file ? (Array.isArray(req.files.file) ? req.files.file : [req.files.file]) : [];
  console.log(`Received ${files.length} files for upload`);

  if (files.length === 0) {
    return next(new ErrorResponse(`No files to upload`, 400));
  }

  try {
    // Process files sequentially to avoid overwhelming Cloudinary
    const uploadedUrls = [];
    
    for (const file of files) {
      console.log(`Processing file: ${file.name}, size: ${file.size / 1024 / 1024}MB`);
      
      // Validate file type
      if (!file.mimetype.startsWith('image')) {
        console.error(`File ${file.name} is not an image`);
        continue; // Skip this file but continue with others
      }

      // Validate file size
      if (file.size > process.env.MAX_FILE_UPLOAD) {
        console.error(`File ${file.name} exceeds size limit of ${process.env.MAX_FILE_UPLOAD / 1000000}MB`);
        continue; // Skip this file but continue with others
      }

      try {
        // Upload to Cloudinary with extended timeout
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          resource_type: 'image',
          folder: `rooms/${listing._id}/${floorId}/${roomId}`,
          public_id: `room_${Date.now()}_${Math.round(Math.random() * 1000)}`,
          overwrite: true,
          timeout: 300000, // 5 minute timeout for each upload
          use_filename: true,
          unique_filename: true
        });
        
        uploadedUrls.push(result.secure_url);
        console.log(`Successfully uploaded ${file.name} to Cloudinary`);
        
        // Clean up temp file
        if (fs.existsSync(file.tempFilePath)) {
          fs.unlinkSync(file.tempFilePath);
        }
      } catch (uploadError) {
        console.error(`Error uploading ${file.name} to Cloudinary:`, uploadError);
        // Continue with the next file
      }
    }

    console.log(`Successfully uploaded ${uploadedUrls.length} of ${files.length} files`);
    
    if (uploadedUrls.length === 0) {
      return next(new ErrorResponse('Failed to upload any images to Cloudinary', 500));
    }

    // Add new photos to the room's photos array
    listing.floors[floorIndex].rooms[roomIndex].photos = 
      listing.floors[floorIndex].rooms[roomIndex].photos || [];
    listing.floors[floorIndex].rooms[roomIndex].photos.push(...uploadedUrls);

    await listing.save();
    console.log('Updated listing with new photos');

    return res.status(200).json({
      success: true,
      data: {
        fileCount: uploadedUrls.length,
        filePaths: uploadedUrls
      }
    });
  } catch (error) {
    console.error('Upload process error:', error);
    return next(new ErrorResponse(`Problem with file upload to Cloudinary: ${error.message}`, 500));
  }
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