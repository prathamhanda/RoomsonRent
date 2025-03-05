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

const { protect, authorize } = require('../middleware/auth');

router.get('/search', searchLocations);
router.get('/name/:name', getLocationsByName);

router.route('/')
  .get(getLocations)
  .post(protect, authorize('admin'), createLocation);

router.route('/:id')
  .get(getLocation)
  .put(protect, authorize('admin'), updateLocation)
  .delete(protect, authorize('admin'), deleteLocation);

module.exports = router; 