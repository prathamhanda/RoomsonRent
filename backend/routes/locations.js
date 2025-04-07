const express = require('express');
const {
  getLocations,
  getLocation,
  createLocation,
  updateLocation,
  deleteLocation,
  searchLocations,
  getLocationsByName
} = require('../controllers/locations');

const router = express.Router();

const { checkAuthMiddleWare, authorize } = require('../middleware/auth');

router.get('/search', searchLocations);
router.get('/name/:name', getLocationsByName);

router.route('/')
  .get(getLocations)
  .post(checkAuthMiddleWare, authorize('admin'), createLocation);

router.route('/:id')
  .get(getLocation)
  .put(checkAuthMiddleWare, authorize('admin'), updateLocation)
  .delete(checkAuthMiddleWare, authorize('admin'), deleteLocation);

module.exports = router; 