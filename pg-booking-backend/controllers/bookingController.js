const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
    const { userId, listingId, startDate, endDate } = req.body;
    try {
        const booking = new Booking({ userId, listingId, startDate, endDate });
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserBookings = async (req, res) => {
    const { userId } = req.params;
    try {
        const bookings = await Booking.find({ userId }).populate('listingId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};