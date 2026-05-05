const express = require('express');
const {
  getDashboardStats,
  getListingsByCity,
  getPriceDistribution,
  getRoomSharingStats,
  getPopularLocations,
  getLandlordMetrics
} = require('../controllers/analytics');

const router = express.Router();
const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

/**
 * ANALYTICS ROUTES
 * 
 * All routes demonstrate MongoDB Aggregation Framework
 * Topics: #25 (Framework), #26 (Stages), #27-28 (Operators)
 */

// Topic #25-28: Dashboard statistics with aggregation
router.get('/dashboard', checkAuthMiddleWare, authorize('landlord', 'admin'), getDashboardStats);

// Topic #27-28: Group and count by city
router.get('/listings-by-city', checkAuthMiddleWare, authorize('landlord', 'admin'), getListingsByCity);

// Topic #27: Price distribution using $bucket operator
router.get('/price-distribution', checkAuthMiddleWare, authorize('landlord', 'admin'), getPriceDistribution);

// Topic #27-28: $unwind and aggregation on nested arrays
router.get('/room-sharing-stats', checkAuthMiddleWare, authorize('landlord', 'admin'), getRoomSharingStats);

// Topic #27: Popular locations analysis
router.get('/popular-locations', getPopularLocations);

// Topic #28: Landlord performance metrics
router.get('/landlord-metrics', checkAuthMiddleWare, authorize('admin'), getLandlordMetrics);

module.exports = router;
