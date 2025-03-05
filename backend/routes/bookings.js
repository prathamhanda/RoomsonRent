const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus
} = require('../controllers/bookings');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(authorize('admin'), getBookings)
  .post(createBooking);

router.get('/user', getUserBookings);
router.get('/owner', authorize('owner', 'admin'), getOwnerBookings);

router.route('/:id')
  .get(getBooking)
  .put(updateBooking)
  .delete(deleteBooking);

router.put('/:id/status', authorize('owner', 'admin'), updateBookingStatus);

module.exports = router; 