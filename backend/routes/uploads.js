const express = require('express');
const {
  uploadListingImage,
  uploadProfileImage,
  uploadRoomImage,
  deleteImage
} = require('../controllers/uploads');

const router = express.Router();

const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

// All routes are protected
router.use(checkAuthMiddleWare);

router.post('/listing/:id', checkAuthMiddleWare , authorize('landlord', 'admin'), uploadListingImage);
router.post('/profile', uploadProfileImage);
router.post('/room/:id/:floorId/:roomId',checkAuthMiddleWare, authorize('landlord', 'admin'), uploadRoomImage);
router.delete('/:id', deleteImage);

module.exports = router;