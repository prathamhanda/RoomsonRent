const axios = require('axios');

// Create axios instance with timeout
const api = axios.create({
  timeout: 10000 // 10 seconds timeout
});

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return parseFloat(distance.toFixed(1));
};

const deg2rad = (deg) => {
  return deg * (Math.PI/180);
};

// Final verification after our changes
async function runTest() {
  const userLocation = {latitude: 30.3474135, longitude: 76.355758};
  console.log('Testing property distance sorting with user coordinates:', userLocation);
  
  try {
    console.log('Connecting to backend...');
    const response = await api.get('http://localhost:5000/api/listings', {
      params: {
        lat: userLocation.latitude, 
        lng: userLocation.longitude, 
        sort: 'distance', 
        limit: 15
      }
    });
    
    console.log(`✅ Successfully connected to backend. Found ${response.data.count} listings.`);
    
    // Verify the first listing is the one with coordinates matching the user's location
    const listings = response.data.data;
    console.log('\nTop 3 listings by distance:');
    listings.slice(0, 3).forEach((listing, i) => {
      console.log(`${i+1}. ${listing.title} - ${listing.distance} km`);
      console.log(`   Coordinates: [${listing.location.coordinates[1]}, ${listing.location.coordinates[0]}]`);
    });
    
    // Find the "shyammm" listing
    const shyammListing = listings.find(l => l.title === 'shyammm');
    
    if (shyammListing) {
      console.log('\nFound "shyammm" listing:');
      console.log(`ID: ${shyammListing._id}`);
      console.log(`Distance: ${shyammListing.distance} km`);
      console.log(`Position in results: ${listings.findIndex(l => l._id === shyammListing._id) + 1} of ${listings.length}`);
      
      if (listings[0]._id === shyammListing._id) {
        console.log('✅ ISSUE FIXED: "shyammm" listing is correctly shown as the first result!');
      } else {
        console.log('❌ ISSUE PERSISTS: "shyammm" listing is not the first result!');
      }
    } else {
      console.log('❌ Could not find "shyammm" listing in the results!');
    }
    
    // Calculate distances manually as a final check
    console.log('\nVerifying distance calculations:');
    const firstListing = listings[0];
    const firstListingCoords = firstListing.location.coordinates;
    
    const manualDistance = calculateDistance(
      userLocation.latitude, 
      userLocation.longitude,
      firstListingCoords[1],  // MongoDB stores as [longitude, latitude]
      firstListingCoords[0]
    );
    
    console.log(`Backend distance for "${firstListing.title}": ${firstListing.distance} km`);
    console.log(`Manual calculation: ${manualDistance} km`);
    
    if (Math.abs(firstListing.distance - manualDistance) < 0.1) {
      console.log('✅ Distance calculation verified!');
    } else {
      console.log('❌ Distance calculation mismatch!');
    }
    
    // Final recommendation
    console.log('\n========================================');
    console.log('DIAGNOSTICS COMPLETE');
    console.log('========================================');
    console.log('The "shyammm" property should now be correctly shown as the closest property.');
    console.log('If you are still having issues, please check:');
    console.log('1. The frontend is making requests with the correct coordinates');
    console.log('2. The backend is returning listings with distance values');
    console.log('3. The frontend is using the distances correctly for sorting');
    console.log('4. Restart your backend server to apply the changes');
    
  } catch (error) {
    console.error('Error during test:', error.message);
    console.log('Make sure your backend server is running at http://localhost:5000');
  }
}

runTest();
