const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Listing = require('./models/Listing');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Generate random price between 10,000 and 20,000
const generateRandomPrice = () => {
  return Math.floor(Math.random() * (20000 - 10000 + 1)) + 10000;
};

// Seed prices
const seedPrices = async () => {
  try {
    console.log('Starting to seed prices...'.cyan);
    
    // Get all listings
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings`.yellow);
    
    let updated = 0;
    
    // Update each listing with random price
    for (const listing of listings) {
      const randomPrice = generateRandomPrice();
      listing.price = randomPrice;
      await listing.save();
      updated++;
      console.log(`Updated listing ${updated}/${listings.length}: ${listing.title} -> ₹${randomPrice}`.green);
    }
    
    console.log(`\n✅ Successfully updated ${updated} listings with random prices (₹10,000 - ₹20,000)`.green.inverse);
    process.exit();
  } catch (err) {
    console.error('Error seeding prices:'.red, err);
    process.exit(1);
  }
};

seedPrices();
