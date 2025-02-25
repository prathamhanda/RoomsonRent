const express = require('express');
const { createListing, getListings } = require('../controllers/listingController');
const router = express.Router();

router.post('/', createListing);
router.get('/', getListings);

module.exports = router;