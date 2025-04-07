const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
  getListingReviews
} = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

router.route('/')
  .get(getReviews)
  .post(checkAuthMiddleWare, authorize('user'), addReview);

router.route('/:id')
  .get(getReview)
  .put(checkAuthMiddleWare, authorize('user', 'admin'), updateReview)
  .delete(checkAuthMiddleWare, authorize('user', 'admin'), deleteReview);

router.get('/listing/:listingId', getListingReviews);

module.exports = router; 