const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserProfile
} = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Use protect middleware for all routes
router.use(protect);

router.put('/profile', updateUserProfile);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router; 