const express = require('express');
const cloudinary = require('../config/cloudinary');
const router = express.Router();
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

// All routes are protected
router.use(checkAuthMiddleWare);

// @desc    Delete image from Cloudinary
// @route   POST /api/cloudinary/delete
// @access  Private
router.post('/delete', asyncHandler(async (req, res, next) => {
  const { public_id } = req.body;

  if (!public_id) {
    return next(new ErrorResponse('Please provide public_id', 400));
  }

  try {
    console.log(`Attempting to delete image from Cloudinary with public_id: ${public_id}`);
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);
    
    console.log('Cloudinary deletion result:', result);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully from Cloudinary',
      });
    } else {
      return next(new ErrorResponse(`Failed to delete image from Cloudinary: ${result.result}`, 400));
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return next(new ErrorResponse(`Problem with Cloudinary delete: ${error.message}`, 500));
  }
}));

// @desc    Delete image from Cloudinary using full path
// @route   POST /api/cloudinary/delete-by-url
// @access  Private
router.post('/delete-by-url', asyncHandler(async (req, res, next) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return next(new ErrorResponse('Please provide imageUrl', 400));
  }

  try {
    // Extract the Cloudinary public_id from the URL
    // Cloudinary URLs typically have format: https://res.cloudinary.com/[cloud_name]/image/upload/v[version]/[folder]/[public_id].[extension]
    const urlParts = imageUrl.split('/');
    const fileNameWithExtension = urlParts[urlParts.length - 1];
    const fileName = fileNameWithExtension.split('.')[0]; // Remove file extension
    
    // Get the folder structure if any (usually after /upload/ in the URL)
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    const folderPath = uploadIndex >= 0 && uploadIndex + 2 < urlParts.length - 1 
      ? urlParts.slice(uploadIndex + 2, urlParts.length - 1).join('/') 
      : '';
    
    // Combine folder and filename to get the full public_id
    const publicId = folderPath ? `${folderPath}/${fileName}` : fileName;
    
    console.log(`Extracted public_id from URL: ${publicId}`);
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    console.log('Cloudinary deletion result:', result);

    if (result.result === 'ok') {
      res.status(200).json({
        success: true,
        message: 'Image deleted successfully from Cloudinary',
      });
    } else {
      return next(new ErrorResponse(`Failed to delete image from Cloudinary: ${result.result}`, 400));
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return next(new ErrorResponse(`Problem with Cloudinary delete: ${error.message}`, 500));
  }
}));

module.exports = router; 