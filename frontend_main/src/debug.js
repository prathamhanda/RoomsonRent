// Debug utility functions

/**
 * Helper function to debug listings received from the API
 * @param {Array} listings - The raw listings from the API
 * @param {Object} userLocation - User's location coordinates
 * @returns {void}
 */
export const debugListings = (listings, userLocation) => {
  console.group('🔍 Listings Debug Information');
  
  console.log('Total listings received:', listings?.length || 0);
  console.log('User Location:', userLocation);
  
  if (!listings?.length) {
    console.log('⚠️ No listings received from API');
    console.groupEnd();
    return;
  }
  
  // Check for "shyammm" in the listings
  const shyammListing = listings.find(
    listing => listing.title?.toLowerCase().includes('shyamm')
  );
  
  if (shyammListing) {
    console.log('✅ "shyammm" listing found in API results:');
    console.log({
      id: shyammListing._id,
      title: shyammListing.title,
      distance: shyammListing.distance,
      coordinates: shyammListing.location?.coordinates
    });
    
    // Verify its position
    const index = listings.findIndex(l => l._id === shyammListing._id);
    console.log(`Position in list: ${index + 1} of ${listings.length}`);
  } else {
    console.log('⚠️ "shyammm" listing NOT found in API results');
  }
  
  // Log first 3 listings for comparison
  console.log('First 3 listings returned by API:');
  listings.slice(0, 3).forEach((listing, i) => {
    console.log(`${i + 1}. ${listing.title}`, {
      id: listing._id,
      distance: listing.distance,
      coordinates: listing.location?.coordinates
    });
  });
  
  console.groupEnd();
};

/**
 * Helper function to debug processed regularRooms
 * @param {Array} regularRooms - The processed regularRooms array
 * @returns {void}
 */
export const debugRegularRooms = (regularRooms) => {
  console.group('🔍 RegularRooms Debug Information');
  
  console.log('Total regularRooms processed:', regularRooms?.length || 0);
  
  if (!regularRooms?.length) {
    console.log('⚠️ No regularRooms processed');
    console.groupEnd();
    return;
  }
  
  // Check for "shyammm" in regularRooms
  const shyammRoom = regularRooms.find(
    room => room.name?.toLowerCase().includes('shyamm')
  );
  
  if (shyammRoom) {
    console.log('✅ "shyammm" found in processed regularRooms:');
    console.log({
      id: shyammRoom.id,
      name: shyammRoom.name,
      distance: shyammRoom.distance,
      location: shyammRoom.location
    });
    
    // Verify its position
    const index = regularRooms.findIndex(r => r.id === shyammRoom.id);
    console.log(`Position in regularRooms: ${index + 1} of ${regularRooms.length}`);
  } else {
    console.log('⚠️ "shyammm" NOT found in processed regularRooms');
  }
  
  // Log first 3 regularRooms for comparison
  console.log('First 3 processed regularRooms:');
  regularRooms.slice(0, 3).forEach((room, i) => {
    console.log(`${i + 1}. ${room.name}`, {
      id: room.id,
      distance: room.distance,
      location: room.location
    });
  });
  
  console.groupEnd();
};
