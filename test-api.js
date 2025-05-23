const axios = require('axios');

// Create axios instance with timeout
const api = axios.create({
  timeout: 8000 // 8 seconds timeout
});

// Mock data to test distance calculation if API fails
const mockListing = {
  _id: 'mock1',
  title: 'shyammm - Boys PG',
  location: {
    coordinates: [76.355758, 30.3474135] // [longitude, latitude] - same as user's position
  }
};

// Calculate distance manually - this is the same function used in backend and frontend
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

// This simulates what the frontend does with the listing data
const simulateFrontendProcessing = (listings, userLocation) => {
  console.log('\n--- SIMULATING FRONTEND PROCESSING ---');    // This is very similar to the transformedListings code in HomePage.jsx
  const transformedListings = listings.map(listing => {
    let distance = null;
    
    if (userLocation && listing.location?.coordinates) {
      distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        listing.location.coordinates[1], // MongoDB stores as [longitude, latitude]
        listing.location.coordinates[0]
      );
    }

    return {
      id: listing._id,
      title: listing.title,
      distance: distance,  // Save the distance for sorting
      coordinates: listing.location.coordinates,
      originalDistance: listing.distance || null, // Keep track of original distance
      // Debug information to help understand the structure
      hasDistanceProperty: Object.prototype.hasOwnProperty.call(listing, 'distance'),
      listingKeys: Object.keys(listing),
      distanceTypeInListing: typeof listing.distance
    };
  });
  console.log('Frontend distance calculation (first 3 items):');
  transformedListings.slice(0, 3).forEach(item => {
    console.log(`${item.title}: Frontend calc: ${item.distance} km, Backend calc: ${item.originalDistance} km`);
    console.log(`  Has distance property: ${item.hasDistanceProperty}, Type: ${item.distanceTypeInListing}`);
    console.log(`  Available keys: ${item.listingKeys.join(', ')}`);
  });

  // Sort by distance if userLocation is available - this is what the frontend does
  if (userLocation) {
    const sortedListings = [...transformedListings].sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });
    
    console.log('\nSorted by frontend calculation (first 5):');
    sortedListings.slice(0, 5).forEach((item, i) => {
      console.log(`${i+1}. ${item.title} - ${item.distance} km`);
    });
    
    return sortedListings;
  }
  
  return transformedListings;
};

// Main test function
async function test() {
  const userLocation = {latitude: 30.3474135, longitude: 76.355758};
  console.log('Starting test with user coordinates:', userLocation);
  
  // Test the distance calculation function with the coordinates from the images
  const manualDistance = calculateDistance(
    userLocation.latitude, 
    userLocation.longitude,
    mockListing.location.coordinates[1],  // MongoDB stores as [longitude, latitude]
    mockListing.location.coordinates[0]
  );
  
  console.log('Manual distance calculation test:');
  console.log('User coords:', userLocation.latitude, userLocation.longitude);
  console.log('Listing coords:', mockListing.location.coordinates[1], mockListing.location.coordinates[0]);
  console.log('Calculated distance:', manualDistance, 'km');
  
  try {
    // Try with localhost
    console.log('\nAttempting to connect to localhost backend...');
    try {
      const response = await api.get('http://localhost:5000/api/listings', {
        params: {
          lat: userLocation.latitude, 
          lng: userLocation.longitude, 
          sort: 'distance', 
          limit: 15
        }
      });
      
      console.log('Success with localhost! Total listings returned:', response.data.count);
        // Log listings as returned by backend (first 5)
      console.log('\nListings as returned by backend (first 5):');
      response.data.data.slice(0, 5).forEach((listing, i) => {
        console.log(`${i+1}. ${listing.title} - ${listing.distance} km, coordinates: ${JSON.stringify(listing.location.coordinates)}`);
      });
      
      // Check if any listing has null distance
      const nullDistanceListings = response.data.data.filter(listing => listing.distance === null);
      if (nullDistanceListings.length > 0) {
        console.log('\nWARNING: Found listings with null distance:', nullDistanceListings.length);
        nullDistanceListings.forEach((listing, i) => {
          console.log(`${i+1}. ${listing.title} - coords: ${JSON.stringify(listing.location.coordinates)}`);
        });
      }
      
      // Simulate frontend processing
      const frontendProcessedListings = simulateFrontendProcessing(response.data.data, userLocation);
      
      // Compare backend and frontend to see if any discrepancies
      console.log('\nCHECKING FOR ISSUES IN THE SORT ORDER:');
      const backendFirstListing = response.data.data[0];
      const frontendFirstListing = frontendProcessedListings[0];
      
      if (backendFirstListing._id !== frontendFirstListing.id) {
        console.log('PROBLEM DETECTED: The first item in backend differs from frontend!');
        console.log(`Backend first: ${backendFirstListing.title} (${backendFirstListing.distance} km)`);
        console.log(`Frontend first: ${frontendFirstListing.title} (${frontendFirstListing.distance} km)`);
      } else {
        console.log('First listing matches between backend and frontend.');
      }
      
    } catch (localError) {
      console.error('Localhost API error:', localError.message);
      console.error('Unable to connect to local backend. Is your server running?');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

test();
