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
  getUserFavorites,
  getCapacityStats,
  getNearbyListings,
  advancedSearch
} = require('../controllers/listings');

const router = express.Router();

const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

// Featured listings
router.get('/featured', getFeaturedListings);

// User favorites
router.get('/favorites', checkAuthMiddleWare, getUserFavorites);
router.post('/:id/favorite', checkAuthMiddleWare, toggleFavorite);

// Capacity stats
router.route('/capacity')
  .get(checkAuthMiddleWare, authorize('landlord', 'admin'), getCapacityStats);

// Topic #21-22: Geospatial queries - find nearby listings
// Uses: 2dsphere index, $geoNear operator for efficient location-based search
router.get('/nearby', getNearbyListings);

// Topic #8-12, #16, #26: Advanced search with multiple query operators
// Uses: $gt, $lt, $in, $or, $and, $exists, $elemMatch, $text, $skip, $limit
router.get('/search/advanced', advancedSearch);

// Main listing routes
router.route('/')
  .get(getListings)
  .post(checkAuthMiddleWare, authorize('landlord', 'admin'), createListing);

router.route('/owner')
  .get(checkAuthMiddleWare, authorize('landlord', 'admin'), getOwnerListings);

router.route('/:id')
  .get(getListing)
  .put(checkAuthMiddleWare, authorize('landlord', 'admin'), updateListing)
  .delete(checkAuthMiddleWare, authorize('landlord', 'admin'), deleteListing);

module.exports = router;