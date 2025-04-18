const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserProfile,
  checkUserByPhone,
  assignRoom,
  createOrGetUser
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
router.post('/create-or-get', authorize('landlord', 'admin'), createOrGetUser);

// Routes accessible to both landlords and admins
router.get('/', authorize('landlord', 'admin'), getUsers);
router.get('/:id', authorize('landlord', 'admin'), getUser);

// Admin only routes
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router; 