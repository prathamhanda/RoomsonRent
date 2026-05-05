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

// Migrate floor structure from sharingOptions at floor level to rooms array
const migrateFloorStructure = async () => {
  try {
    console.log('Starting to migrate floor structure...'.cyan);
    
    // Get all listings
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings`.yellow);
    
    let updated = 0;
    
    // Update each listing
    for (const listing of listings) {
      let needsUpdate = false;
      
      // Check if floors exist and need migration
      if (listing.floors && listing.floors.length > 0) {
        for (let i = 0; i < listing.floors.length; i++) {
          const floor = listing.floors[i];
          
          // If floor has sharingOptions but no rooms, migrate it
          if (floor.sharingOptions && (!floor.rooms || floor.rooms.length === 0)) {
            needsUpdate = true;
            
            // Create room from floor's sharingOptions
            floor.rooms = [{
              roomId: `room-1-floor-${i}`,
              type: 'standard',
              sharingOptions: floor.sharingOptions,
              targetTenants: floor.targetTenants || 'Any',
              price: listing.price,
              photos: [],
              tenants: []
            }];
            
            // Remove floor-level sharingOptions as it's now in rooms
            delete floor.sharingOptions;
            delete floor.targetTenants;
          }
          
          // Ensure rooms have roomId
          if (floor.rooms && floor.rooms.length > 0) {
            floor.rooms.forEach((room, roomIdx) => {
              if (!room.roomId) {
                room.roomId = `room-${roomIdx + 1}-floor-${i}`;
                needsUpdate = true;
              }
              if (!room.type) {
                room.type = 'standard';
                needsUpdate = true;
              }
            });
          }
        }
      }
      
      if (needsUpdate) {
        await listing.save();
        updated++;
        console.log(`Migrated listing ${updated}: ${listing.title}`.green);
      }
    }
    
    console.log(`\n✅ Successfully migrated ${updated} listings to new floor structure`.green.inverse);
    process.exit();
  } catch (err) {
    console.error('Error migrating floor structure:'.red, err);
    process.exit(1);
  }
};

migrateFloorStructure();
