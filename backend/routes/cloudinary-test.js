const express = require('express');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Test Cloudinary upload
// @route   POST /api/cloudinary-test/upload
// @access  Private
router.post('/upload', protect, asyncHandler(async (req, res, next) => {
  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: 'image',
      folder: 'test-uploads',
      public_id: `test_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        original_filename: file.name,
        format: result.format,
        resource_type: result.resource_type,
        created_at: result.created_at,
      }
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return next(new ErrorResponse(`Problem with Cloudinary upload: ${error.message}`, 500));
  }
}));

// @desc    Test Cloudinary delete
// @route   DELETE /api/cloudinary-test/delete
// @access  Private
router.delete('/delete', protect, asyncHandler(async (req, res, next) => {
  const { public_id } = req.body;

  if (!public_id) {
    return next(new ErrorResponse('Please provide public_id', 400));
  }

  try {
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully',
      });
    } else {
      return next(new ErrorResponse(`Failed to delete image: ${result.result}`, 400));
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return next(new ErrorResponse(`Problem with Cloudinary delete: ${error.message}`, 500));
  }
}));

module.exports = router; 