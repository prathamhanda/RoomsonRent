const express = require('express');
const {
  uploadListingImage,
  uploadProfileImage,
  deleteImage
} = require('../controllers/uploads');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

router.post('/listing/:id', authorize('owner', 'admin'), uploadListingImage);
router.post('/profile', uploadProfileImage);
router.delete('/:id', deleteImage);

module.exports = router;