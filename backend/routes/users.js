const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserProfile,
  checkUserByPhone,
  assignRoom
} = require('../controllers/users');

const router = express.Router();

const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

// Use checkAuthMiddleWare middleware for all routes
router.use(checkAuthMiddleWare);

// Public routes (after authentication)
router.put('/profile', updateUserProfile);
router.get('/check-user/:phone', checkUserByPhone);

// Landlord and admin routes
router.put('/assign-room/:userId', authorize('landlord', 'admin'), assignRoom);

// Admin only routes
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router; 