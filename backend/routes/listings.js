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

router.get('/featured', getFeaturedListings);
router.get('/favorites', protect, getUserFavorites);
router.post('/:id/favorite', protect, toggleFavorite);

router.route('/')
  .get(getListings)
  .post(protect, authorize('owner', 'admin'), createListing);

router.route('/owner')
  .get(protect, authorize('owner', 'admin'), getOwnerListings);

router.route('/:id')
  .get(getListing)
  .put(protect, authorize('owner', 'admin'), updateListing)
  .delete(protect, authorize('owner', 'admin'), deleteListing);

module.exports = router; 