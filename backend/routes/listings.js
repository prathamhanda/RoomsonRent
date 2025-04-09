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
  getLandlordCapacity
} = require('../controllers/listings');

const router = express.Router();

const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

router.get('/featured', getFeaturedListings);
router.get('/favorites', checkAuthMiddleWare, getUserFavorites);
router.post('/:id/favorite', checkAuthMiddleWare, toggleFavorite);

// Add capacity route
router.get('/capacity', checkAuthMiddleWare, authorize('landlord', 'admin'), getLandlordCapacity);

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