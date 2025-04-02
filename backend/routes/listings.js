const express = require('express');
const {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getFeaturedListings,
  getOwnerListings,
  toggleFavorite,
  getUserFavorites
} = require('../controllers/listings');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { checkAuthMiddleWare } = require('../controllers/auth');

router.get('/featured', getFeaturedListings);
router.get('/favorites', protect, getUserFavorites);
router.post('/:id/favorite', protect, toggleFavorite);

router.route('/')
  .get(getListings)
  .post(checkAuthMiddleWare, authorize('landlord', 'admin'), createListing);

router.route('/owner')
  .get(checkAuthMiddleWare, authorize('landlord', 'admin'), getOwnerListings);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('landlord', 'admin'), updateListing)
  .delete(protect, authorize('landlord', 'admin'), deleteListing);

module.exports = router;