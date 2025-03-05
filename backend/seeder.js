const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const User = require('./models/User');
const Listing = require('./models/Listing');
const Booking = require('./models/Booking');
const Location = require('./models/Location');
const Review = require('./models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON files
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const listings = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/listings.json`, 'utf-8')
);

const bookings = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bookings.json`, 'utf-8')
);

const locations = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/locations.json`, 'utf-8')
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Location.create(locations);
    await Listing.create(listings);
    await Booking.create(bookings);
    await Review.create(reviews);
    
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Listing.deleteMany();
    await Booking.deleteMany();
    await Location.deleteMany();
    await Review.deleteMany();
    
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please provide proper command'.yellow);
  process.exit(1);
} 