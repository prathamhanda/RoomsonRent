const Listing = require('../models/Listing');

exports.createListing = async (req, res) => {
    const { title, description, price, location, images, amenities, ownerId } = req.body;
    try {
        const listing = new Listing({ title, description, price, location, images, amenities, ownerId });
        await listing.save();
        res.status(201).json(listing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getListings = async (req, res) => {
    try {
        const listings = await Listing.find();
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};