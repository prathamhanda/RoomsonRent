const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Location = require('./models/Location');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Read JSON file
const locations = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/locations-comprehensive.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Location.deleteMany(); // Clear existing locations first
    const result = await Location.create(locations);
    
    console.log(`${result.length} locations imported successfully...`.green.inverse);
    console.log('Locations:'.yellow);
    result.forEach(loc => {
      console.log(`  ✓ ${loc.name}, ${loc.city}, ${loc.state}`);
    });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    const result = await Location.deleteMany();
    console.log(`${result.deletedCount} locations deleted...`.red.inverse);
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
  console.log('Locations Seeder'.yellow.bold);
  console.log('Usage:'.cyan);
  console.log('  node locations-seeder.js -i  (import data)'.green);
  console.log('  node locations-seeder.js -d  (delete data)'.red);
  process.exit();
}
